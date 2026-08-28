export type SupportedCurrency = "CAD" | "USD";
export type FinancialImpactBasis = "current_or_base" | "additional_measure";
export type FinancialImpactSpecificity = "hs" | "category";
export type FinancialImpactConfidence =
  | "official"
  | "estimated"
  | "unknown"
  | "verified"
  | "provisional"
  | "limited";

export type RateRange = { min: number; max: number };

export type FinancialImpactInput = {
  annualTradeValue: number | null;
  currency: string | null;
  scenario: string | null;
  hsCode: string | null;
  specificity: FinancialImpactSpecificity;
  rate: number | string | RateRange | null;
  basis: FinancialImpactBasis;
  measureType: string | null;
  measureStatus: string | null;
  confidence: FinancialImpactConfidence;
};

export type FinancialImpact = {
  annualTradeValue: number;
  currency: SupportedCurrency;
  scenario: string | null;
  hsCode: string | null;
  rateMin: number;
  rateMax: number;
  grossExposureMin: number;
  grossExposureMax: number;
  incrementalExposureMin: number | null;
  incrementalExposureMax: number | null;
  basis: FinancialImpactBasis;
  calculationType: "single_rate" | "rate_range";
  specificity: FinancialImpactSpecificity;
  confidence: FinancialImpactConfidence;
  measureType: string | null;
  measureStatus: string | null;
  planningEstimate: true;
  caveat: string;
};

const NUMBER = "(\\d+(?:\\.\\d+)?)";
const SINGLE_RATE = new RegExp(`^\\s*${NUMBER}\\s*%(?:\\s*\\([^()]*\\))?\\s*$`);
const RANGE_RATE = new RegExp(`^\\s*${NUMBER}\\s*%?\\s*[–—-]\\s*${NUMBER}\\s*%\\s*$`);

/** Strict compatibility parser for legacy display strings. Structured rates should stay numeric. */
export function parseRateRange(rate: string): RateRange | null {
  const single = rate.match(SINGLE_RATE);
  if (single) {
    const value = Number(single[1]);
    return Number.isFinite(value) ? { min: value, max: value } : null;
  }

  const range = rate.match(RANGE_RATE);
  if (!range) return null;
  const min = Number(range[1]);
  const max = Number(range[2]);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) return null;
  return { min, max };
}

function normalizeRate(rate: FinancialImpactInput["rate"]): RateRange | null {
  if (typeof rate === "number") {
    return Number.isFinite(rate) && rate >= 0 ? { min: rate, max: rate } : null;
  }
  if (typeof rate === "string") return parseRateRange(rate);
  if (!rate || !Number.isFinite(rate.min) || !Number.isFinite(rate.max) || rate.min < 0 || rate.min > rate.max) return null;
  return rate;
}

export function computeFinancialImpact(input: FinancialImpactInput): FinancialImpact | null {
  if (input.annualTradeValue == null || !Number.isFinite(input.annualTradeValue) || input.annualTradeValue <= 0) return null;
  if (input.currency !== "CAD" && input.currency !== "USD") return null;
  const rate = normalizeRate(input.rate);
  if (!rate) return null;

  const grossExposureMin = input.annualTradeValue * (rate.min / 100);
  const grossExposureMax = input.annualTradeValue * (rate.max / 100);
  const incremental = input.basis === "additional_measure";

  return {
    annualTradeValue: input.annualTradeValue,
    currency: input.currency,
    scenario: input.scenario,
    hsCode: input.hsCode,
    rateMin: rate.min,
    rateMax: rate.max,
    grossExposureMin,
    grossExposureMax,
    incrementalExposureMin: incremental ? grossExposureMin : null,
    incrementalExposureMax: incremental ? grossExposureMax : null,
    basis: input.basis,
    calculationType: rate.min === rate.max ? "single_rate" : "rate_range",
    specificity: input.specificity,
    confidence: input.confidence,
    measureType: input.measureType,
    measureStatus: input.measureStatus,
    planningEstimate: true,
    caveat: incremental
      ? "Incremental gross exposure from the additional measure; not an all-in landed cost or final duty determination."
      : "Gross planning estimate based on the available treatment; not a customs-duty determination.",
  };
}

export function formatExposureRange(impact: Pick<FinancialImpact, "currency" | "grossExposureMin" | "grossExposureMax">): string {
  const format = (amount: number) => `${impact.currency} ${Math.round(amount).toLocaleString("en-CA")}`;
  return impact.grossExposureMin === impact.grossExposureMax
    ? format(impact.grossExposureMin)
    : `${format(impact.grossExposureMin)}–${format(impact.grossExposureMax)}`;
}
