import { describe, expect, it } from "vitest";
import { BRIEF_SYSTEM_PROMPT, buildBriefUserPrompt, type BriefInput } from "@/lib/ai/generate-brief";
import { CANADA_US_COUNTER_TARIFF_CHANGE_2026, findCanadianCounterTariff, getTradeMeasureStatus } from "@/lib/data/canada-counter-tariffs-2026";
import { attachIncrementalFinancialImpact } from "@/lib/trade-measure-changes";
import { computeFinancialImpact } from "@/lib/exposure";

function input(): BriefInput {
  const match = findCanadianCounterTariff({ hsCode: "851713", scenario: "import-us" })!;
  return {
    scenarioLabel: "Import from the United States", country: "CA", province: "Ontario",
    usState: null, category: "Electronics", productName: "Smartphones",
    tariffColumnLabel: "Import Duty", annualValue: 250000, currency: "CAD", hsCode: "851713",
    comparisonRows: [{ market: "United States", tariffRate: "10–50%", tariffConfidence: "estimated", specificity: "category", hsCode: null, easeOfBusiness: 8.4, costFriction: "Medium", attractiveness: "Fair" }],
    programs: [],
    tradeMeasure: { ...match, status: getTradeMeasureStatus(match.measure, "2026-08-28") },
    financialImpacts: [computeFinancialImpact({
      annualTradeValue: 250000, currency: "CAD", scenario: "import-us", hsCode: "851713",
      specificity: "hs", rate: 50, basis: "additional_measure", measureType: "counter_tariff",
      measureStatus: "upcoming", confidence: "provisional",
    })!],
    tradeMeasureChange: attachIncrementalFinancialImpact(CANADA_US_COUNTER_TARIFF_CHANGE_2026, 250000, "CAD", "import-us", "2026-08-28"),
  };
}

describe("Claude structured provenance boundary", () => {
  it("passes structured provenance into the prompt", () => {
    const prompt = buildBriefUserPrompt(input());
    expect(prompt).toContain('"authorityTier": "official_announcement"');
    expect(prompt).toContain('"confidence": "provisional"');
    expect(prompt).toContain('"status": "upcoming"');
    expect(prompt).toContain('"nationalTariffItem": "8517.13.00"');
  });

  it("forbids Claude from inventing or upgrading tariff facts", () => {
    expect(BRIEF_SYSTEM_PROMPT).toContain("Never contradict, upgrade, or fill gaps");
    expect(BRIEF_SYSTEM_PROMPT).toContain("HS applicability");
    expect(BRIEF_SYSTEM_PROMPT).toContain("authority tiers");
    expect(BRIEF_SYSTEM_PROMPT).toContain("choose or emphasize a midpoint");
    expect(BRIEF_SYSTEM_PROMPT).toContain("all-in duty");
  });

  it("passes structured financial impact without asking Claude to calculate it", () => {
    const prompt = buildBriefUserPrompt(input());
    expect(prompt).toContain('"incrementalExposureMax": 125000');
    expect(prompt).toContain('"currency": "CAD"');
    expect(prompt).toContain("do not recalculate, combine, or convert");
  });

  it("passes change intelligence and preserves none-recorded semantics", () => {
    const prompt = buildBriefUserPrompt(input());
    expect(prompt).toContain('"kind": "none_recorded"');
    expect(prompt).toContain('"announcedDate": "2026-08-25"');
    expect(prompt).toContain('"changeInAdditionalExposureMax": 125000');
    expect(BRIEF_SYSTEM_PROMPT).toContain("never call it a 0% tariff");
  });
});
