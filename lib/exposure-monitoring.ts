import { isValidHsCode, normalizeHsCode } from "@/lib/hs-code";
import type { SupportedCurrency } from "@/lib/exposure";
import type { TradeMeasureSource } from "@/lib/data/canada-counter-tariffs-2026";
import type { AdditionalTariffState, TradeMeasureChange, TradeMeasureChangeStatus } from "@/lib/trade-measure-changes";
import { attachIncrementalFinancialImpact, getTradeMeasureChangeStatus } from "@/lib/trade-measure-changes";

export type MonitoredExposure = {
  id: string;
  ownerId: string;
  productDescription: string;
  hsCode: string | null;
  category: string | null;
  scenario: string | null;
  originCountry: string | null;
  destinationCountry: string | null;
  annualTradeValue: number | null;
  currency: string | null;
  savedAt: string;
  monitoringActive: boolean;
};

export type AlertSeverity = "material" | "informational";

export type TradeExposureAlertIntelligence = {
  alertType: "trade_measure_change";
  severity: AlertSeverity;
  title: string;
  summary: string;
  productDescription: string;
  hsCode: string;
  scenario: string;
  eventStatus: TradeMeasureChangeStatus;
  measureStatus: "upcoming" | "current" | "expired";
  announcedDate: string | null;
  effectiveDate: string | null;
  previousState: AdditionalTariffState;
  newState: AdditionalTariffState;
  financialImpact: NonNullable<TradeMeasureChange["financialImpact"]>;
  source: TradeMeasureSource;
  confidence: TradeMeasureChange["confidence"];
};

export type TradeExposureAlert = TradeExposureAlertIntelligence & {
  id: string;
  userId: string;
  monitoredExposureId: string;
  tradeMeasureId: string;
  changeEventId: string;
  createdAt: string;
  readAt: string | null;
  dismissedAt: string | null;
};

export type AlertDraft = {
  dedupeKey: string;
  userId: string;
  monitoredExposureId: string;
  tradeMeasureId: string;
  changeEventId: string;
  intelligence: TradeExposureAlertIntelligence;
};

export function routeForScenario(scenario: string | null): { originCountry: string | null; destinationCountry: string | null } {
  if (scenario === "import-us") return { originCountry: "us", destinationCountry: "CA" };
  if (scenario === "export-us") return { originCountry: "CA", destinationCountry: "us" };
  return { originCountry: null, destinationCountry: null };
}

export function matchesTradeMeasureChange(
  exposure: MonitoredExposure,
  change: TradeMeasureChange,
  asOfDate: string
): boolean {
  if (!exposure.monitoringActive || !isValidHsCode(exposure.hsCode ?? "")) return false;
  if (normalizeHsCode(exposure.hsCode ?? "") !== change.applicability.hsCode) return false;
  if (exposure.scenario !== "import-us") return false;
  if (exposure.originCountry !== change.applicability.originCountry) return false;
  if (exposure.destinationCountry !== change.applicability.destinationCountry) return false;
  const status = getTradeMeasureChangeStatus(change, asOfDate);
  return status !== "expired" && status !== "rescinded";
}

/** Explicit launch rule: at least CAD/USD 10,000 of incremental gross exposure is material. */
export function classifyAlertSeverity(incrementalExposureMin: number): AlertSeverity {
  return incrementalExposureMin >= 10_000 ? "material" : "informational";
}

export function alertDedupeKey(exposureId: string, changeEventId: string): string {
  return `${exposureId}:${changeEventId}`;
}

export function createAlertDraft(
  exposure: MonitoredExposure,
  change: TradeMeasureChange,
  source: TradeMeasureSource,
  asOfDate: string
): AlertDraft | null {
  if (!matchesTradeMeasureChange(exposure, change, asOfDate)) return null;
  const withImpact = attachIncrementalFinancialImpact(
    change,
    exposure.annualTradeValue,
    exposure.currency as SupportedCurrency | string | null,
    exposure.scenario,
    asOfDate
  );
  if (!withImpact.financialImpact || !exposure.hsCode || !exposure.scenario) return null;
  const status = getTradeMeasureChangeStatus(change, asOfDate);
  const measureStatus = status === "effective" ? "current" : status === "expired" || status === "rescinded" ? "expired" : "upcoming";
  const rate = change.newState.kind === "known_rate" ? change.newState.rate : null;
  return {
    dedupeKey: alertDedupeKey(exposure.id, change.id),
    userId: exposure.ownerId,
    monitoredExposureId: exposure.id,
    tradeMeasureId: change.tradeMeasureId,
    changeEventId: change.id,
    intelligence: {
      alertType: "trade_measure_change",
      severity: classifyAlertSeverity(withImpact.financialImpact.changeInAdditionalExposureMin),
      title: `${exposure.productDescription} — HS ${normalizeHsCode(exposure.hsCode)}`,
      summary: rate == null ? "A Canadian trade measure changed" : `+${rate}% Canadian counter-tariff announced`,
      productDescription: exposure.productDescription,
      hsCode: normalizeHsCode(exposure.hsCode),
      scenario: exposure.scenario,
      eventStatus: status,
      measureStatus,
      announcedDate: change.announcedDate,
      effectiveDate: change.effectiveDate,
      previousState: change.previousState,
      newState: change.newState,
      financialImpact: withImpact.financialImpact,
      source,
      confidence: change.confidence,
    },
  };
}

export function createMissingAlertDrafts(
  exposures: readonly MonitoredExposure[],
  changes: readonly TradeMeasureChange[],
  sources: readonly TradeMeasureSource[],
  existingKeys: ReadonlySet<string>,
  asOfDate: string
): AlertDraft[] {
  const drafts: AlertDraft[] = [];
  const seen = new Set(existingKeys);
  for (const exposure of exposures) {
    for (const change of changes) {
      const source = sources.find((candidate) => change.sourceIds.includes(candidate.id));
      if (!source) continue;
      const draft = createAlertDraft(exposure, change, source, asOfDate);
      if (!draft || seen.has(draft.dedupeKey)) continue;
      seen.add(draft.dedupeKey);
      drafts.push(draft);
    }
  }
  return drafts;
}

export function markAlertReadState(alert: TradeExposureAlert, readAt: string): TradeExposureAlert {
  return { ...alert, readAt };
}

export function removeDismissedAlert(alerts: readonly TradeExposureAlert[], dismissedId: string): TradeExposureAlert[] {
  return alerts.filter((alert) => alert.id !== dismissedId);
}
