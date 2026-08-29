import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { buildMaterialAlertEmail, type AlertEmail } from "@/lib/alert-email";
import {
  createMissingAlertDrafts,
  routeForScenario,
  type AlertDraft,
  type MonitoredExposure,
  type TradeExposureAlertIntelligence,
} from "@/lib/exposure-monitoring";
import {
  CANADA_COUNTER_TARIFF_SOURCES_2026,
  CANADA_US_COUNTER_TARIFF_CHANGE_2026,
  calendarDateInTimeZone,
} from "@/lib/data/canada-counter-tariffs-2026";

const MAX_EMAIL_ATTEMPTS = 3;

export type ScheduledAlert = {
  id: string;
  userId: string;
  intelligence: TradeExposureAlertIntelligence;
};

export type RetryableDelivery = {
  id: string;
  alert: ScheduledAlert;
  attemptCount: number;
};

export interface ScheduledMonitoringRepository {
  loadSubscribedExposures(): Promise<MonitoredExposure[]>;
  loadExistingDedupeKeys(): Promise<Set<string>>;
  insertMissingAlerts(drafts: readonly AlertDraft[]): Promise<ScheduledAlert[]>;
  ensureDeliveryCandidates(alerts: readonly ScheduledAlert[]): Promise<void>;
  listRetryableDeliveries(maxAttempts: number): Promise<RetryableDelivery[]>;
  claimDelivery(delivery: RetryableDelivery, attemptedAt: string): Promise<boolean>;
  getUserEmail(userId: string): Promise<string | null>;
  markDeliverySent(deliveryId: string, emailedAt: string): Promise<void>;
  markDeliveryFailed(deliveryId: string, error: string, attemptedAt: string): Promise<void>;
  markDeliverySkipped(deliveryId: string, reason: string, attemptedAt: string): Promise<void>;
}

export interface TransactionalEmailSender {
  send(message: AlertEmail): Promise<void>;
}

export type ScheduledMonitoringStats = {
  exposuresEvaluated: number;
  matchesFound: number;
  alertsCreated: number;
  materialEmailsSent: number;
  sendsSkipped: number;
  sendFailures: number;
};

export async function runScheduledMonitoring(
  repository: ScheduledMonitoringRepository,
  sender: TransactionalEmailSender,
  now: Date = new Date()
): Promise<ScheduledMonitoringStats> {
  const exposures = await repository.loadSubscribedExposures();
  const existingKeys = await repository.loadExistingDedupeKeys();
  const asOfDate = calendarDateInTimeZone(now, "America/Toronto");
  const drafts = createMissingAlertDrafts(
    exposures,
    [CANADA_US_COUNTER_TARIFF_CHANGE_2026],
    CANADA_COUNTER_TARIFF_SOURCES_2026,
    existingKeys,
    asOfDate
  );
  const createdAlerts = await repository.insertMissingAlerts(drafts);
  const materialAlerts = createdAlerts.filter((alert) => alert.intelligence.severity === "material");
  await repository.ensureDeliveryCandidates(materialAlerts);

  const stats: ScheduledMonitoringStats = {
    exposuresEvaluated: exposures.length,
    matchesFound: drafts.length,
    alertsCreated: createdAlerts.length,
    materialEmailsSent: 0,
    sendsSkipped: createdAlerts.length - materialAlerts.length,
    sendFailures: 0,
  };
  const attemptedAt = now.toISOString();
  const deliveries = await repository.listRetryableDeliveries(MAX_EMAIL_ATTEMPTS);

  for (const delivery of deliveries) {
    const claimed = await repository.claimDelivery(delivery, attemptedAt);
    if (!claimed) {
      stats.sendsSkipped += 1;
      continue;
    }
    const email = await repository.getUserEmail(delivery.alert.userId);
    if (!email) {
      await repository.markDeliverySkipped(delivery.id, "No authenticated account email is available.", attemptedAt);
      stats.sendsSkipped += 1;
      continue;
    }
    try {
      await sender.send(buildMaterialAlertEmail(delivery.alert.id, email, delivery.alert.intelligence, now));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Email send failed.";
      await repository.markDeliveryFailed(delivery.id, message.slice(0, 500), attemptedAt);
      stats.sendFailures += 1;
      continue;
    }
    try {
      await repository.markDeliverySent(delivery.id, attemptedAt);
      stats.materialEmailsSent += 1;
    } catch (error) {
      // The provider accepted the message. Leave the row in `sending` if the
      // success write fails so a later run cannot accidentally send it twice.
      console.error("Email was accepted but delivery confirmation could not be persisted:", error);
      stats.sendFailures += 1;
    }
  }

  console.info("Scheduled exposure monitoring completed", stats);
  return stats;
}

type ScheduledMonitoringEnv = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

type DeliveryRow = {
  id: string;
  alert_id: string;
  user_id: string;
  attempt_count: number;
};

function serverClient(env: ScheduledMonitoringEnv): SupabaseClient {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Scheduled monitoring requires Supabase server credentials.");
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createSupabaseMonitoringRepository(env: ScheduledMonitoringEnv): ScheduledMonitoringRepository {
  const supabase = serverClient(env);

  return {
    async loadSubscribedExposures() {
      const profilesResult = await supabase
        .from("profiles")
        .select("id")
        .eq("subscription_status", "active")
        .or("subscription_tier.eq.business,subscription_tier.is.null");
      if (profilesResult.error) throw new Error(`Failed to load subscribed accounts: ${profilesResult.error.message}`);
      const userIds = (profilesResult.data ?? []).map((profile) => profile.id as string);
      if (userIds.length === 0) return [];

      const exposureResult = await supabase
        .from("saved_profiles")
        .select("id,user_id,name,product_description,hs_code,category,scenario,annual_value,currency,created_at,monitoring_active")
        .in("user_id", userIds)
        .eq("monitoring_active", true);
      if (exposureResult.error) throw new Error(`Failed to load monitored exposures: ${exposureResult.error.message}`);
      return (exposureResult.data ?? []).map((row) => ({
        id: row.id as string,
        ownerId: row.user_id as string,
        productDescription: (row.product_description || row.name) as string,
        hsCode: row.hs_code as string | null,
        category: row.category as string | null,
        scenario: row.scenario as string | null,
        ...routeForScenario(row.scenario as string | null),
        annualTradeValue: row.annual_value as number | null,
        currency: row.currency as string | null,
        savedAt: row.created_at as string,
        monitoringActive: row.monitoring_active as boolean,
      }));
    },

    async loadExistingDedupeKeys() {
      const result = await supabase.from("trade_exposure_alerts").select("saved_profile_id,change_event_id");
      if (result.error) throw new Error(`Failed to load alert dedupe keys: ${result.error.message}`);
      return new Set((result.data ?? []).map((row) => `${row.saved_profile_id}:${row.change_event_id}`));
    },

    async insertMissingAlerts(drafts) {
      if (drafts.length === 0) return [];
      const result = await supabase
        .from("trade_exposure_alerts")
        .upsert(
          drafts.map((draft) => ({
            user_id: draft.userId,
            saved_profile_id: draft.monitoredExposureId,
            trade_measure_id: draft.tradeMeasureId,
            change_event_id: draft.changeEventId,
            alert_type: draft.intelligence.alertType,
            severity: draft.intelligence.severity,
            payload: draft.intelligence,
          })),
          { onConflict: "saved_profile_id,change_event_id", ignoreDuplicates: true }
        )
        .select("id,user_id,payload");
      if (result.error) throw new Error(`Failed to create scheduled alerts: ${result.error.message}`);
      return (result.data ?? []).map((row) => ({
        id: row.id as string,
        userId: row.user_id as string,
        intelligence: row.payload as TradeExposureAlertIntelligence,
      }));
    },

    async ensureDeliveryCandidates(alerts) {
      if (alerts.length === 0) return;
      const result = await supabase.from("trade_exposure_alert_deliveries").upsert(
        alerts.map((alert) => ({ alert_id: alert.id, user_id: alert.userId })),
        { onConflict: "alert_id", ignoreDuplicates: true }
      );
      if (result.error) throw new Error(`Failed to create email delivery state: ${result.error.message}`);
    },

    async listRetryableDeliveries(maxAttempts) {
      const deliveryResult = await supabase
        .from("trade_exposure_alert_deliveries")
        .select("id,alert_id,user_id,attempt_count")
        .in("status", ["pending", "failed"])
        .is("emailed_at", null)
        .lt("attempt_count", maxAttempts)
        .order("created_at", { ascending: true });
      if (deliveryResult.error) throw new Error(`Failed to load retryable email deliveries: ${deliveryResult.error.message}`);
      const deliveries = (deliveryResult.data ?? []) as DeliveryRow[];
      if (deliveries.length === 0) return [];
      const alertResult = await supabase
        .from("trade_exposure_alerts")
        .select("id,user_id,payload,severity")
        .in("id", deliveries.map((delivery) => delivery.alert_id))
        .eq("severity", "material");
      if (alertResult.error) throw new Error(`Failed to load email alert payloads: ${alertResult.error.message}`);
      const alerts = new Map((alertResult.data ?? []).map((row) => [row.id as string, row]));
      return deliveries.flatMap((delivery) => {
        const alert = alerts.get(delivery.alert_id);
        if (!alert || alert.user_id !== delivery.user_id) return [];
        return [{
          id: delivery.id,
          attemptCount: delivery.attempt_count,
          alert: {
            id: alert.id as string,
            userId: alert.user_id as string,
            intelligence: alert.payload as TradeExposureAlertIntelligence,
          },
        }];
      });
    },

    async claimDelivery(delivery, attemptedAt) {
      const result = await supabase
        .from("trade_exposure_alert_deliveries")
        .update({ status: "sending", attempt_count: delivery.attemptCount + 1, attempted_at: attemptedAt, updated_at: attemptedAt, error: null })
        .eq("id", delivery.id)
        .eq("user_id", delivery.alert.userId)
        .eq("attempt_count", delivery.attemptCount)
        .in("status", ["pending", "failed"])
        .is("emailed_at", null)
        .select("id")
        .maybeSingle();
      if (result.error) throw new Error(`Failed to claim email delivery: ${result.error.message}`);
      return Boolean(result.data);
    },

    async getUserEmail(userId) {
      const result = await supabase.auth.admin.getUserById(userId);
      if (result.error || result.data.user?.id !== userId) return null;
      return result.data.user.email ?? null;
    },

    async markDeliverySent(deliveryId, emailedAt) {
      const result = await supabase.from("trade_exposure_alert_deliveries").update({ status: "sent", emailed_at: emailedAt, updated_at: emailedAt, error: null }).eq("id", deliveryId).eq("status", "sending");
      if (result.error) throw new Error(`Failed to record successful email delivery: ${result.error.message}`);
    },

    async markDeliveryFailed(deliveryId, error, attemptedAt) {
      const result = await supabase.from("trade_exposure_alert_deliveries").update({ status: "failed", error, updated_at: attemptedAt }).eq("id", deliveryId).eq("status", "sending");
      if (result.error) throw new Error(`Failed to record email failure: ${result.error.message}`);
    },

    async markDeliverySkipped(deliveryId, reason, attemptedAt) {
      const result = await supabase.from("trade_exposure_alert_deliveries").update({ status: "skipped", error: reason.slice(0, 500), updated_at: attemptedAt }).eq("id", deliveryId).eq("status", "sending");
      if (result.error) throw new Error(`Failed to record skipped email: ${result.error.message}`);
    },
  };
}
