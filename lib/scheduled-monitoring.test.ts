import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { AlertEmail } from "@/lib/alert-email";
import { buildMaterialAlertEmail } from "@/lib/alert-email";
import { createAlertDraft, routeForScenario, type AlertDraft, type MonitoredExposure } from "@/lib/exposure-monitoring";
import { CANADA_COUNTER_TARIFF_SOURCES_2026, CANADA_US_COUNTER_TARIFF_CHANGE_2026 } from "@/lib/data/canada-counter-tariffs-2026";
import {
  runScheduledMonitoring,
  type RetryableDelivery,
  type ScheduledAlert,
  type ScheduledMonitoringRepository,
  type TransactionalEmailSender,
} from "@/lib/scheduled-monitoring";

const now = new Date("2026-08-28T13:00:00Z");
const change = CANADA_US_COUNTER_TARIFF_CHANGE_2026;
const source = CANADA_COUNTER_TARIFF_SOURCES_2026.find((item) => change.sourceIds.includes(item.id))!;

function exposure(overrides: Partial<MonitoredExposure> = {}): MonitoredExposure {
  return {
    id: "profile-1",
    ownerId: "user-1",
    productDescription: "Smartphones",
    hsCode: "851713",
    category: "Electronics",
    scenario: "import-us",
    ...routeForScenario("import-us"),
    annualTradeValue: 250_000,
    currency: "CAD",
    savedAt: now.toISOString(),
    monitoringActive: true,
    ...overrides,
  };
}

type FakeDelivery = RetryableDelivery & { status: "pending" | "sending" | "sent" | "failed" | "skipped" };

class FakeRepository implements ScheduledMonitoringRepository {
  keys = new Set<string>();
  alerts: ScheduledAlert[] = [];
  deliveries: FakeDelivery[] = [];
  emails = new Map<string, string | null>([["user-1", "owner@example.test"]]);
  failMarkSent = false;

  constructor(public exposures: MonitoredExposure[]) {}

  async loadSubscribedExposures() { return this.exposures; }
  async loadExistingDedupeKeys() { return new Set(this.keys); }
  async insertMissingAlerts(drafts: readonly AlertDraft[]) {
    const created = drafts.map((draft, index) => ({ id: `alert-${this.alerts.length + index + 1}`, userId: draft.userId, intelligence: draft.intelligence }));
    drafts.forEach((draft) => this.keys.add(draft.dedupeKey));
    this.alerts.push(...created);
    return created;
  }
  async ensureDeliveryCandidates(alerts: readonly ScheduledAlert[]) {
    for (const alert of alerts) {
      if (this.deliveries.some((delivery) => delivery.alert.id === alert.id)) continue;
      this.deliveries.push({ id: `delivery-${this.deliveries.length + 1}`, alert, attemptCount: 0, status: "pending" });
    }
  }
  async listRetryableDeliveries(maxAttempts: number) {
    return this.deliveries.filter((delivery) => ["pending", "failed"].includes(delivery.status) && delivery.attemptCount < maxAttempts);
  }
  async claimDelivery(delivery: RetryableDelivery) {
    const stored = this.deliveries.find((candidate) => candidate.id === delivery.id);
    if (!stored || !["pending", "failed"].includes(stored.status) || stored.attemptCount !== delivery.attemptCount) return false;
    stored.status = "sending";
    stored.attemptCount += 1;
    return true;
  }
  async getUserEmail(userId: string) { return this.emails.get(userId) ?? null; }
  async markDeliverySent(id: string) {
    if (this.failMarkSent) throw new Error("simulated persistence failure");
    this.delivery(id).status = "sent";
  }
  async markDeliveryFailed(id: string) { this.delivery(id).status = "failed"; }
  async markDeliverySkipped(id: string) { this.delivery(id).status = "skipped"; }
  private delivery(id: string) { return this.deliveries.find((delivery) => delivery.id === id)!; }
}

class FakeSender implements TransactionalEmailSender {
  sent: AlertEmail[] = [];
  fail = false;
  async send(message: AlertEmail) {
    if (this.fail) throw new Error("simulated failure");
    this.sent.push(message);
  }
}

describe("scheduled saved-exposure monitoring", () => {
  it("reuses the deterministic matching and creates one material alert/email", async () => {
    const repository = new FakeRepository([exposure()]);
    const sender = new FakeSender();
    const stats = await runScheduledMonitoring(repository, sender, now);

    expect(stats).toMatchObject({ exposuresEvaluated: 1, matchesFound: 1, alertsCreated: 1, materialEmailsSent: 1 });
    expect(repository.alerts).toHaveLength(1);
    expect(sender.sent).toHaveLength(1);
    expect(readFileSync("lib/scheduled-monitoring.ts", "utf8")).toContain("createMissingAlertDrafts");
  });

  it("is idempotent across repeated scheduled runs", async () => {
    const repository = new FakeRepository([exposure()]);
    const sender = new FakeSender();
    await runScheduledMonitoring(repository, sender, now);
    await runScheduledMonitoring(repository, sender, now);
    expect(repository.alerts).toHaveLength(1);
    expect(sender.sent).toHaveLength(1);
  });

  it("does not email informational alerts", async () => {
    const repository = new FakeRepository([exposure({ annualTradeValue: 100 })]);
    const sender = new FakeSender();
    const stats = await runScheduledMonitoring(repository, sender, now);
    expect(repository.alerts[0].intelligence.severity).toBe("informational");
    expect(stats.sendsSkipped).toBe(1);
    expect(sender.sent).toHaveLength(0);
  });

  it("does not resend a successfully emailed alert", async () => {
    const repository = new FakeRepository([exposure()]);
    const sender = new FakeSender();
    await runScheduledMonitoring(repository, sender, now);
    repository.exposures = [];
    await runScheduledMonitoring(repository, sender, now);
    expect(repository.deliveries[0].status).toBe("sent");
    expect(sender.sent).toHaveLength(1);
  });

  it("retries a failed email without creating another alert", async () => {
    const repository = new FakeRepository([exposure()]);
    const sender = new FakeSender();
    sender.fail = true;
    await runScheduledMonitoring(repository, sender, now);
    expect(repository.deliveries[0].status).toBe("failed");
    sender.fail = false;
    await runScheduledMonitoring(repository, sender, now);
    expect(repository.alerts).toHaveLength(1);
    expect(repository.deliveries[0].status).toBe("sent");
    expect(repository.deliveries[0].attemptCount).toBe(2);
  });

  it("does not retry when the provider accepted mail but success persistence failed", async () => {
    const repository = new FakeRepository([exposure()]);
    repository.failMarkSent = true;
    const sender = new FakeSender();
    await runScheduledMonitoring(repository, sender, now);
    expect(repository.deliveries[0].status).toBe("sending");
    repository.failMarkSent = false;
    await runScheduledMonitoring(repository, sender, now);
    expect(sender.sent).toHaveLength(1);
  });

  it("skips a missing account email without failing the run", async () => {
    const repository = new FakeRepository([exposure()]);
    repository.emails.set("user-1", null);
    const sender = new FakeSender();
    const stats = await runScheduledMonitoring(repository, sender, now);
    expect(stats.sendsSkipped).toBe(1);
    expect(repository.deliveries[0].status).toBe("skipped");
  });

  it("keeps recipients paired with their own alert payload", async () => {
    const repository = new FakeRepository([
      exposure(),
      exposure({ id: "profile-2", ownerId: "user-2", productDescription: "Second user's smartphones" }),
    ]);
    repository.emails.set("user-2", "second@example.test");
    const sender = new FakeSender();
    await runScheduledMonitoring(repository, sender, now);
    expect(sender.sent.find((email) => email.to === "owner@example.test")?.raw).not.toContain("Second user's smartphones");
    expect(sender.sent.find((email) => email.to === "second@example.test")?.raw).toContain("Second user's smartphones");
  });

  it("does not generate alerts for export or non-US-origin exposures", async () => {
    const repository = new FakeRepository([
      exposure({ id: "export", scenario: "export-us", ...routeForScenario("export-us") }),
      exposure({ id: "eu", originCountry: "eu" }),
    ]);
    const sender = new FakeSender();
    const stats = await runScheduledMonitoring(repository, sender, now);
    expect(stats.matchesFound).toBe(0);
    expect(sender.sent).toHaveLength(0);
  });

  it("keeps the demo impact at CAD 125,000", () => {
    const draft = createAlertDraft(exposure(), change, source, "2026-08-28")!;
    expect(draft.intelligence.financialImpact.changeInAdditionalExposureMax).toBe(125_000);
  });

  it("builds a deterministic operational email with sourced facts and none_recorded wording", () => {
    const alert = createAlertDraft(exposure(), change, source, "2026-08-28")!.intelligence;
    const email = buildMaterialAlertEmail("alert-1", "owner@example.test", alert, now);
    expect(email.subject).toContain("Smartphones affected by +50% counter-tariff");
    expect(email.raw).toContain("Smartphones — HS 851713");
    expect(email.raw).toContain("September 8, 2026");
    expect(email.raw).toContain("CAD 125,000");
    expect(email.raw).toContain("Provisional");
    expect(email.raw).toContain("Department of Finance Canada");
    expect(email.raw).toContain("No verified additional counter-tariff recorded");
    expect(email.raw).not.toContain("prior tariff was 0%");
    expect(email.raw).toContain("Reply-To: support@tariffcompass.ca");
  });

  it("keeps delivery state private and configures one daily EMAIL binding schedule", () => {
    const sql = readFileSync("supabase/migrations/20260829042834_add_exposure_alert_email_delivery.sql", "utf8");
    const config = readFileSync("wrangler.jsonc", "utf8");
    expect(sql).toContain("enable row level security");
    expect(sql).toContain("revoke all on public.trade_exposure_alert_deliveries from anon, authenticated");
    expect(config).toContain('"name": "EMAIL"');
    expect(config).toContain('"crons": ["0 13 * * *"]');
    expect(config).toContain('"NEXT_PUBLIC_SUPABASE_URL"');
  });
});
