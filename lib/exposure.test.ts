import { describe, expect, it } from "vitest";
import { computeFinancialImpact, formatExposureRange, parseRateRange } from "@/lib/exposure";

const baseInput = {
  annualTradeValue: 250_000,
  currency: "CAD",
  scenario: "import-us",
  hsCode: "851713",
  specificity: "hs" as const,
  rate: 50,
  basis: "additional_measure" as const,
  measureType: "counter_tariff",
  measureStatus: "upcoming",
  confidence: "provisional" as const,
};

describe("canonical financial impact engine", () => {
  it("computes 250,000 × 50% as 125,000", () => {
    const impact = computeFinancialImpact(baseInput);
    expect(impact?.grossExposureMin).toBe(125_000);
    expect(impact?.grossExposureMax).toBe(125_000);
    expect(impact?.incrementalExposureMin).toBe(125_000);
  });

  it("preserves a 10–50% range without selecting a midpoint", () => {
    const impact = computeFinancialImpact({ ...baseInput, rate: "10–50%", basis: "current_or_base", specificity: "category", confidence: "estimated" });
    expect(impact).toMatchObject({ grossExposureMin: 25_000, grossExposureMax: 125_000, incrementalExposureMin: null, calculationType: "rate_range" });
    expect(formatExposureRange(impact!)).toBe("CAD 25,000–CAD 125,000");
  });

  it("uses equal bounds for a single rate", () => {
    expect(computeFinancialImpact(baseInput)).toMatchObject({ rateMin: 50, rateMax: 50, calculationType: "single_rate" });
  });

  it("returns no exposure for missing, zero, or negative annual values", () => {
    expect(computeFinancialImpact({ ...baseInput, annualTradeValue: null })).toBeNull();
    expect(computeFinancialImpact({ ...baseInput, annualTradeValue: 0 })).toBeNull();
    expect(computeFinancialImpact({ ...baseInput, annualTradeValue: -1 })).toBeNull();
  });

  it("strictly parses supported legacy rates and rejects malformed strings", () => {
    expect(parseRateRange("10%")).toEqual({ min: 10, max: 10 });
    expect(parseRateRange("10-25%")).toEqual({ min: 10, max: 25 });
    expect(parseRateRange("0% (CUSMA)")).toEqual({ min: 0, max: 0 });
    expect(parseRateRange("50-10%")).toBeNull();
    expect(parseRateRange("10, 20 and 50 percent")).toBeNull();
    expect(parseRateRange("Unknown")).toBeNull();
  });

  it("preserves CAD and USD without FX conversion", () => {
    const cad = computeFinancialImpact(baseInput)!;
    const usd = computeFinancialImpact({ ...baseInput, currency: "USD" })!;
    expect(cad.currency).toBe("CAD");
    expect(usd.currency).toBe("USD");
    expect(usd.grossExposureMax).toBe(cad.grossExposureMax);
  });

  it("keeps additional exposure separate from base/category exposure", () => {
    const base = computeFinancialImpact({ ...baseInput, rate: "10–50%", basis: "current_or_base", specificity: "category", confidence: "estimated" })!;
    const additional = computeFinancialImpact(baseInput)!;
    expect(base.incrementalExposureMax).toBeNull();
    expect(additional.incrementalExposureMax).toBe(125_000);
    expect(additional.caveat).toContain("not an all-in landed cost");
  });

  it("does not calculate unsupported currencies", () => {
    expect(computeFinancialImpact({ ...baseInput, currency: "EUR" })).toBeNull();
  });

  it("parses decimal ranges", () => {
    expect(parseRateRange("2.5–4.75%")).toEqual({ min: 2.5, max: 4.75 });
  });

  it("accepts a percent sign on both range bounds", () => {
    expect(parseRateRange("10%–25%")).toEqual({ min: 10, max: 25 });
  });

  it("accepts normalized whitespace", () => {
    expect(parseRateRange(" 10 – 25% ")).toEqual({ min: 10, max: 25 });
  });

  it("rejects a missing percent sign", () => {
    expect(parseRateRange("10–25")).toBeNull();
  });

  it("rejects negative display rates", () => {
    expect(parseRateRange("-5%")).toBeNull();
  });

  it("rejects empty and N/A display values", () => {
    expect(parseRateRange("")).toBeNull();
    expect(parseRateRange("N/A")).toBeNull();
  });

  it("rejects NaN and infinite annual values", () => {
    expect(computeFinancialImpact({ ...baseInput, annualTradeValue: Number.NaN })).toBeNull();
    expect(computeFinancialImpact({ ...baseInput, annualTradeValue: Number.POSITIVE_INFINITY })).toBeNull();
  });

  it("accepts a structured numeric rate range", () => {
    expect(computeFinancialImpact({ ...baseInput, rate: { min: 10, max: 25 } })).toMatchObject({ rateMin: 10, rateMax: 25 });
  });

  it("rejects an inverted structured rate range", () => {
    expect(computeFinancialImpact({ ...baseInput, rate: { min: 25, max: 10 } })).toBeNull();
  });

  it("rejects a negative structured rate", () => {
    expect(computeFinancialImpact({ ...baseInput, rate: -1 })).toBeNull();
  });

  it("formats a single exposure amount once", () => {
    expect(formatExposureRange(computeFinancialImpact(baseInput)!)).toBe("CAD 125,000");
  });

  it("marks every result as a planning estimate", () => {
    expect(computeFinancialImpact(baseInput)?.planningEstimate).toBe(true);
  });

  it("preserves scenario and HS inputs", () => {
    expect(computeFinancialImpact(baseInput)).toMatchObject({ scenario: "import-us", hsCode: "851713" });
  });

  it("preserves specificity and confidence", () => {
    expect(computeFinancialImpact({ ...baseInput, specificity: "category", confidence: "limited" })).toMatchObject({ specificity: "category", confidence: "limited" });
  });

  it("preserves measure type and status", () => {
    expect(computeFinancialImpact(baseInput)).toMatchObject({ measureType: "counter_tariff", measureStatus: "upcoming" });
  });

  it("keeps a USD range entirely in USD", () => {
    const impact = computeFinancialImpact({ ...baseInput, currency: "USD", rate: "10–50%" })!;
    expect(formatExposureRange(impact)).toBe("USD 25,000–USD 125,000");
  });

  it("handles very small values without rounding the calculation", () => {
    expect(computeFinancialImpact({ ...baseInput, annualTradeValue: 0.01 })?.grossExposureMax).toBeCloseTo(0.005, 10);
  });
});
