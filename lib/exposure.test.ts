import { describe, expect, it } from "vitest";
import { computeExposure, parseRateRange } from "@/lib/exposure";

describe("parseRateRange", () => {
  it("parses a simple range", () => {
    expect(parseRateRange("10–50%")).toEqual({ low: 10, mid: 30, high: 50 });
  });

  it("parses a single flat rate as low === mid === high", () => {
    expect(parseRateRange("50%")).toEqual({ low: 50, mid: 50, high: 50 });
  });

  it("handles a zero-minimum range", () => {
    expect(parseRateRange("0–25%")).toEqual({ low: 0, mid: 12.5, high: 25 });
  });

  it("handles an all-zero rate with trailing annotation text", () => {
    expect(parseRateRange("0% (CUSMA)")).toEqual({ low: 0, mid: 0, high: 0 });
  });

  it("parses decimal rates", () => {
    expect(parseRateRange("2.5–4.75%")).toEqual({ low: 2.5, mid: 3.625, high: 4.75 });
  });

  it("takes the true min/max regardless of the order the numbers appear in", () => {
    expect(parseRateRange("50-10%")).toEqual({ low: 10, mid: 30, high: 50 });
  });

  it("uses only the global min and max when more than two numbers are present", () => {
    // The mid value here is the midpoint of low/high, not an average of all
    // matched numbers or a mean of the ones "in between" — a row's rationale
    // text could easily contain other numbers (e.g. years, section numbers).
    expect(parseRateRange("10, 20, and 50 percent")).toEqual({ low: 10, mid: 30, high: 50 });
  });

  it("strips a leading minus sign — negative-looking input reads as its positive digits", () => {
    // \d+ never matches a sign character, so "-5%" and "5%" parse identically.
    // This documents that behavior rather than asserting it's ideal.
    expect(parseRateRange("-5%")).toEqual({ low: 5, mid: 5, high: 5 });
  });

  it("returns null for an unknown-confidence row's display string", () => {
    expect(parseRateRange("Unknown")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(parseRateRange("")).toBeNull();
  });

  it("returns null for a malformed range with no digits at all", () => {
    expect(parseRateRange("N/A")).toBeNull();
  });

  it("returns null for a bare percent sign with no number", () => {
    expect(parseRateRange("%")).toBeNull();
  });

  it("handles a very large rate value without error", () => {
    expect(parseRateRange("1000000%")).toEqual({ low: 1000000, mid: 1000000, high: 1000000 });
  });

  it("handles a very small nonzero decimal rate", () => {
    expect(parseRateRange("0.001%")).toEqual({ low: 0.001, mid: 0.001, high: 0.001 });
  });
});

describe("computeExposure", () => {
  it("computes low/mid/high dollar amounts for a simple range", () => {
    const result = computeExposure(100000, "10–50%");
    expect(result).toEqual({
      lowRate: 10,
      midRate: 30,
      highRate: 50,
      lowAmount: 10000,
      midAmount: 30000,
      highAmount: 50000,
    });
  });

  it("produces a zero lowAmount when the rate's minimum is 0", () => {
    const result = computeExposure(150000, "0–25%");
    expect(result?.lowAmount).toBe(0);
    expect(result?.midRate).toBe(12.5);
    expect(result?.midAmount).toBe(18750);
    expect(result?.highAmount).toBe(37500);
  });

  it("returns null when the tariff rate string carries no number (unknown confidence)", () => {
    expect(computeExposure(150000, "Unknown")).toBeNull();
  });

  it("returns null for a malformed rate string even with a valid annual value", () => {
    expect(computeExposure(150000, "N/A")).toBeNull();
  });

  it("returns null for zero annual value", () => {
    expect(computeExposure(0, "10–50%")).toBeNull();
  });

  it("returns null for negative annual value", () => {
    expect(computeExposure(-100, "10–50%")).toBeNull();
  });

  it("returns null for NaN annual value", () => {
    expect(computeExposure(Number.NaN, "10–50%")).toBeNull();
  });

  it("returns null for infinite annual value", () => {
    expect(computeExposure(Number.POSITIVE_INFINITY, "10–50%")).toBeNull();
  });

  it("handles a very large annual value without losing precision", () => {
    const result = computeExposure(1_000_000_000, "0–25%");
    expect(result?.lowAmount).toBe(0);
    expect(result?.midAmount).toBe(125_000_000);
    expect(result?.highAmount).toBe(250_000_000);
  });

  it("handles a very small (sub-dollar) annual value", () => {
    const result = computeExposure(0.01, "50%");
    expect(result?.midAmount).toBeCloseTo(0.005, 10);
  });

  it("scales correctly for a flat single-number rate", () => {
    const result = computeExposure(200000, "4%");
    expect(result).toEqual({
      lowRate: 4,
      midRate: 4,
      highRate: 4,
      lowAmount: 8000,
      midAmount: 8000,
      highAmount: 8000,
    });
  });
});
