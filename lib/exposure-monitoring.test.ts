import { describe, expect, it } from "vitest";
import { CANADA_COUNTER_TARIFF_SOURCES_2026, CANADA_US_COUNTER_TARIFF_CHANGE_2026 } from "@/lib/data/canada-counter-tariffs-2026";
import { alertDedupeKey, createAlertDraft, createMissingAlertDrafts, markAlertReadState, matchesTradeMeasureChange, removeDismissedAlert, routeForScenario, type MonitoredExposure, type TradeExposureAlert } from "@/lib/exposure-monitoring";
import { readFileSync } from "node:fs";

function exposure(overrides: Partial<MonitoredExposure> = {}): MonitoredExposure {
  return {
    id: "profile-1", ownerId: "user-1", productDescription: "Smartphones", hsCode: "851713",
    category: "Electronics", scenario: "import-us", ...routeForScenario("import-us"),
    annualTradeValue: 250000, currency: "CAD", savedAt: "2026-08-28", monitoringActive: true,
    ...overrides,
  };
}

const change = CANADA_US_COUNTER_TARIFF_CHANGE_2026;
const source = CANADA_COUNTER_TARIFF_SOURCES_2026.find((item) => change.sourceIds.includes(item.id))!;

describe("saved exposure monitoring", () => {
  it("matches HS 851713 imported from the US", () => expect(matchesTradeMeasureChange(exposure(), change, "2026-08-28")).toBe(true));
  it("rejects export to the US", () => expect(matchesTradeMeasureChange(exposure({ scenario: "export-us", ...routeForScenario("export-us") }), change, "2026-08-28")).toBe(false));
  it("rejects imports from the EU", () => expect(matchesTradeMeasureChange(exposure({ originCountry: "eu" }), change, "2026-08-28")).toBe(false));
  it("rejects unrelated HS codes", () => expect(matchesTradeMeasureChange(exposure({ hsCode: "851762" }), change, "2026-08-28")).toBe(false));
  it("rejects inactive monitoring", () => expect(matchesTradeMeasureChange(exposure({ monitoringActive: false }), change, "2026-08-28")).toBe(false));
  it.each([null, "", "8517"])("rejects missing or invalid HS %s", (hsCode) => expect(matchesTradeMeasureChange(exposure({ hsCode }), change, "2026-08-28")).toBe(false));

  it("creates a material, sourced CAD 125,000 alert", () => {
    const draft = createAlertDraft(exposure(), change, source, "2026-08-28")!;
    expect(draft.intelligence).toMatchObject({
      severity: "material", eventStatus: "announced", measureStatus: "upcoming", effectiveDate: "2026-09-08",
      confidence: "provisional", previousState: { kind: "none_recorded" },
      newState: { kind: "known_rate", rate: 50 }, source: { id: source.id },
    });
    expect(draft.intelligence.financialImpact.newAdditionalExposure.incrementalExposureMax).toBe(125000);
    expect(draft.userId).toBe("user-1");
  });

  it("dedupes the same profile and event", () => {
    const key = alertDedupeKey("profile-1", change.id);
    expect(createMissingAlertDrafts([exposure()], [change], [source], new Set([key]), "2026-08-28")).toEqual([]);
  });

  it("allows a new event ID to create a new alert", () => {
    const next = { ...change, id: "new-event-id", changeType: "amended" as const };
    const drafts = createMissingAlertDrafts([exposure()], [change, next], [source], new Set([alertDedupeKey("profile-1", change.id)]), "2026-08-28");
    expect(drafts.map((draft) => draft.changeEventId)).toEqual(["new-event-id"]);
  });

  it("supports read and dismissed alert state", () => {
    const draft = createAlertDraft(exposure(), change, source, "2026-08-28")!;
    const alert: TradeExposureAlert = { ...draft.intelligence, id: "alert-1", userId: draft.userId, monitoredExposureId: draft.monitoredExposureId, tradeMeasureId: draft.tradeMeasureId, changeEventId: draft.changeEventId, createdAt: "2026-08-28T00:00:00Z", readAt: null, dismissedAt: null };
    expect(markAlertReadState(alert, "2026-08-29T00:00:00Z").readAt).toBe("2026-08-29T00:00:00Z");
    expect(removeDismissedAlert([alert], alert.id)).toEqual([]);
  });

  it("scopes select, insert, and update policies to auth.uid ownership", () => {
    const sql = readFileSync("supabase/migrations/20260829000149_add_saved_exposure_alerts.sql", "utf8");
    expect(sql).toContain('create policy "Users can view own exposure alerts"');
    expect(sql).toContain('create policy "Users can update own exposure alert state"');
    expect(sql.match(/\(select auth\.uid\(\)\) = user_id/g)?.length).toBeGreaterThanOrEqual(4);
    expect(sql).toContain("saved_profiles.user_id = (select auth.uid())");
    expect(sql).toContain("grant update (read_at, dismissed_at)");
  });
});
