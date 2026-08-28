import type { FinancialImpact, SupportedCurrency } from "@/lib/exposure";
import { computeFinancialImpact } from "@/lib/exposure";

export type TradeMeasureChangeType =
  | "announced"
  | "effective"
  | "amended"
  | "delayed"
  | "expired"
  | "rescinded";

export type TradeMeasureChangeStatus = "announced" | "effective" | "delayed" | "amended" | "expired" | "rescinded";

export type AdditionalTariffState =
  | { kind: "none_recorded"; description: string }
  | { kind: "known_rate"; rate: number; rateKind: "additional_counter_tariff"; description: string }
  | { kind: "unknown"; description: string };

export type ChangeApplicability = {
  hsCode: string;
  nationalTariffItem: string;
  originCountry: string;
  destinationCountry: string;
};

export type TradeMeasureChange = {
  id: string;
  tradeMeasureId: string;
  changeType: TradeMeasureChangeType;
  eventDate: string | null;
  announcedDate: string | null;
  effectiveDate: string | null;
  previousState: AdditionalTariffState;
  newState: AdditionalTariffState;
  sourceIds: readonly string[];
  confidence: "verified" | "provisional" | "limited";
  applicability: ChangeApplicability;
  financialImpact: ChangeFinancialImpact | null;
};

export type ChangeFinancialImpact = {
  priorAdditionalExposure: null;
  newAdditionalExposure: FinancialImpact;
  changeInAdditionalExposureMin: number;
  changeInAdditionalExposureMax: number;
  explanation: "No recorded additional counter-tariff from this measure";
};

export function getTradeMeasureChangeStatus(change: TradeMeasureChange, asOfDate: string): TradeMeasureChangeStatus {
  if (change.changeType === "expired" || change.changeType === "rescinded") return change.changeType;
  if (change.changeType === "delayed" || change.changeType === "amended") return change.changeType;
  if (change.effectiveDate && asOfDate >= change.effectiveDate) return "effective";
  return "announced";
}

export function addChangeToHistory(
  history: readonly TradeMeasureChange[],
  change: TradeMeasureChange
): readonly TradeMeasureChange[] {
  if (history.some((event) => event.id === change.id)) throw new Error(`Duplicate trade-measure change: ${change.id}`);
  return [...history, change];
}

export function attachIncrementalFinancialImpact(
  change: TradeMeasureChange,
  annualTradeValue: number | null,
  currency: SupportedCurrency | string | null,
  scenario: string | null,
  asOfDate: string
): TradeMeasureChange {
  if (change.newState.kind !== "known_rate") return { ...change, financialImpact: null };
  const impact = computeFinancialImpact({
    annualTradeValue,
    currency,
    scenario,
    hsCode: change.applicability.hsCode,
    specificity: "hs",
    rate: change.newState.rate,
    basis: "additional_measure",
    measureType: "counter_tariff",
    measureStatus: getTradeMeasureChangeStatus(change, asOfDate),
    confidence: change.confidence,
  });
  if (!impact) return { ...change, financialImpact: null };
  return {
    ...change,
    financialImpact: {
      priorAdditionalExposure: null,
      newAdditionalExposure: impact,
      changeInAdditionalExposureMin: impact.incrementalExposureMin ?? impact.grossExposureMin,
      changeInAdditionalExposureMax: impact.incrementalExposureMax ?? impact.grossExposureMax,
      explanation: "No recorded additional counter-tariff from this measure",
    },
  };
}
