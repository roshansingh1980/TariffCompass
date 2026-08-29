import { describe, expect, it } from "vitest";
import { buildPracticalResponseIntelligence } from "@/lib/response-intelligence";
import type { MarketDataRow } from "@/lib/data/db-market-data";

const row: MarketDataRow = {
  market: { key: "eu", name: "European Union", easeOfBusiness: 7.6 },
  direction: "import",
  category: "Electronics",
  hsCode: "851713",
  specificity: "hs",
  tariffRate: "0%",
  tariffConfidence: "official",
  costFriction: "Medium",
  attractiveness: "Good",
  rationale: "Verified comparison row",
  sourceName: "Official tariff schedule",
  sourceUrl: "https://example.gc.ca/official",
  lastUpdated: "2026-08-28",
};

describe("practical response intelligence", () => {
  it("returns a sourced deterministic slice for the covered smartphone route", () => {
    const result = buildPracticalResponseIntelligence({ hsCode: "851713", productDescription: "Smartphones", scenario: "import-us", annualIncrementalExposure: 125000, currency: "CAD", comparisonRows: [row] });
    expect(result.coverage).toBe("covered");
    expect(result.sourcingAlternatives[0].source?.authority).toBe("official");
    expect(result.tradeAgreementConsiderations[0].detail).toContain("does not establish CUSMA eligibility");
    expect(result.governmentPrograms[0].detail).toContain("No eligibility or deadline has been determined");
    expect(result.adviserQuestions.every((item) => item.label === "question for adviser")).toBe(true);
    expect(result.adviserQuestions[1].detail).toContain("CAD 125,000");
  });

  it("returns limited coverage instead of fabricated recommendations", () => {
    const result = buildPracticalResponseIntelligence({ hsCode: "870899", productDescription: "Parts", scenario: "export-us", annualIncrementalExposure: null, currency: "CAD", comparisonRows: [row] });
    expect(result.coverage).toBe("limited");
    expect(result.sourcingAlternatives).toEqual([]);
    expect(result.governmentPrograms).toEqual([]);
  });
});

