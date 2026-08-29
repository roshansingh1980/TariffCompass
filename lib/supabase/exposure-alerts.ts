"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CANADA_COUNTER_TARIFF_SOURCES_2026, CANADA_US_COUNTER_TARIFF_CHANGE_2026, calendarDateInTimeZone } from "@/lib/data/canada-counter-tariffs-2026";
import { createMissingAlertDrafts, routeForScenario, type MonitoredExposure, type TradeExposureAlert, type TradeExposureAlertIntelligence } from "@/lib/exposure-monitoring";

export type ExposureAlertsResult = {
  available: boolean;
  alerts: TradeExposureAlert[];
  reason?: "not_authenticated" | "not_subscribed" | "migration_required" | "query_failed";
};

function isMissingMonitoringSchema(error: { code?: string } | null): boolean {
  return error?.code === "42P01" || error?.code === "42703" || error?.code === "PGRST204" || error?.code === "PGRST205";
}

export async function evaluateAndListExposureAlerts(): Promise<ExposureAlertsResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { available: false, alerts: [], reason: "not_authenticated" };

  const { data: profile } = await supabase.from("profiles").select("subscription_status").eq("id", user.id).maybeSingle();
  if (profile?.subscription_status !== "active") return { available: false, alerts: [], reason: "not_subscribed" };

  const exposureResult = await supabase
    .from("saved_profiles")
    .select("id,user_id,name,product_description,hs_code,category,scenario,annual_value,currency,created_at,monitoring_active")
    .eq("user_id", user.id)
    .eq("monitoring_active", true);
  if (exposureResult.error) {
    if (isMissingMonitoringSchema(exposureResult.error)) return { available: false, alerts: [], reason: "migration_required" };
    console.error("Failed to load monitored exposures:", exposureResult.error);
    return { available: false, alerts: [], reason: "query_failed" };
  }

  const exposures: MonitoredExposure[] = (exposureResult.data ?? []).map((row) => ({
    id: row.id,
    ownerId: row.user_id,
    productDescription: row.product_description || row.name,
    hsCode: row.hs_code,
    category: row.category,
    scenario: row.scenario,
    ...routeForScenario(row.scenario),
    annualTradeValue: row.annual_value,
    currency: row.currency,
    savedAt: row.created_at,
    monitoringActive: row.monitoring_active,
  }));

  const existingResult = await supabase
    .from("trade_exposure_alerts")
    .select("saved_profile_id,change_event_id")
    .eq("user_id", user.id);
  if (existingResult.error) {
    if (isMissingMonitoringSchema(existingResult.error)) return { available: false, alerts: [], reason: "migration_required" };
    console.error("Failed to check exposure-alert deduplication:", existingResult.error);
    return { available: false, alerts: [], reason: "query_failed" };
  }

  const existingKeys = new Set((existingResult.data ?? []).map((row) => `${row.saved_profile_id}:${row.change_event_id}`));
  const asOfDate = calendarDateInTimeZone(new Date(), "America/Toronto");
  const drafts = createMissingAlertDrafts(
    exposures,
    [CANADA_US_COUNTER_TARIFF_CHANGE_2026],
    CANADA_COUNTER_TARIFF_SOURCES_2026,
    existingKeys,
    asOfDate
  );

  if (drafts.length > 0) {
    const { error } = await supabase.from("trade_exposure_alerts").upsert(
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
    );
    if (error) {
      if (isMissingMonitoringSchema(error)) return { available: false, alerts: [], reason: "migration_required" };
      console.error("Failed to create exposure alerts:", error);
      return { available: false, alerts: [], reason: "query_failed" };
    }
  }

  const alertsResult = await supabase
    .from("trade_exposure_alerts")
    .select("id,user_id,saved_profile_id,trade_measure_id,change_event_id,payload,created_at,read_at,dismissed_at")
    .eq("user_id", user.id)
    .is("dismissed_at", null)
    .order("created_at", { ascending: false });
  if (alertsResult.error) {
    console.error("Failed to list exposure alerts:", alertsResult.error);
    return { available: false, alerts: [], reason: "query_failed" };
  }

  const alerts = (alertsResult.data ?? []).map((row) => ({
    ...(row.payload as TradeExposureAlertIntelligence),
    id: row.id,
    userId: row.user_id,
    monitoredExposureId: row.saved_profile_id,
    tradeMeasureId: row.trade_measure_id,
    changeEventId: row.change_event_id,
    createdAt: row.created_at,
    readAt: row.read_at,
    dismissedAt: row.dismissed_at,
  }));
  return { available: true, alerts };
}

async function updateAlertState(id: string, values: { read_at?: string; dismissed_at?: string }): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase.from("trade_exposure_alerts").update(values).eq("id", id).eq("user_id", user.id).select("id").maybeSingle();
  if (error || !data) {
    console.error("Failed to update exposure alert:", error);
    return false;
  }
  revalidatePath("/dashboard");
  return true;
}

export async function markExposureAlertRead(id: string): Promise<boolean> {
  return updateAlertState(id, { read_at: new Date().toISOString() });
}

export async function dismissExposureAlert(id: string): Promise<boolean> {
  return updateAlertState(id, { dismissed_at: new Date().toISOString() });
}
