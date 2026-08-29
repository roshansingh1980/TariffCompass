import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  isTariffRowCurrent,
  resolveScenarioDirection,
  selectPreferredTariffRow,
  type DbTariffRow,
} from "@/lib/data/db-market-data";
import { isValidHsCode, normalizeHsCode } from "@/lib/hs-code";
import { parseUsitcSearchResponse, requestHsSuggestionResult, requestHsSuggestions } from "@/lib/hs-search";
import { buildHsAnalysisHref, HS6_NATIONAL_CODE_CAVEAT, HS_CLASSIFICATION_CAVEAT, parseHsLookupPrefill } from "@/lib/hs-lookup";

function tariffRow(overrides: Partial<DbTariffRow> = {}): DbTariffRow {
  return {
    category: "Auto parts",
    hs_code: null,
    origin_country: "CA",
    destination_country: "us",
    rate_min: 10,
    rate_max: 20,
    confidence: "estimated",
    cost_friction: "Medium",
    attractiveness: "Fair",
    rationale: "Test fixture",
    reviewed_at: "2026-08-28",
    sources: { name: "Official source", url: "https://example.test" },
    ...overrides,
  };
}

describe("HS-aware tariff selection", () => {
  it("prefers an HS-specific row over the category row for the same export route", () => {
    const category = tariffRow();
    const hs = tariffRow({ hs_code: "870830", rate_min: 25, rate_max: 25, confidence: "official" });

    const selected = selectPreferredTariffRow(
      [category],
      [hs],
      "us",
      "destination_country"
    );

    expect(selected).toEqual({ row: hs, specificity: "hs" });
  });

  it("falls back to category data and identifies that fallback explicitly", () => {
    const category = tariffRow();

    const selected = selectPreferredTariffRow(
      [category],
      [],
      "us",
      "destination_country"
    );

    expect(selected).toEqual({ row: category, specificity: "category" });
    expect(selected?.row.confidence).toBe("estimated");
  });

  it("selects import routes using origin rather than destination", () => {
    const category = tariffRow({ origin_country: "us", destination_country: "CA" });

    expect(resolveScenarioDirection("import-us")).toBe("import");
    expect(resolveScenarioDirection("export-us")).toBe("export");
    expect(selectPreferredTariffRow([category], [], "us", "origin_country")?.row).toBe(category);
  });

  it("keeps future HS rows out of current tariff selection", () => {
    const future = tariffRow({ hs_code: "851713", effective_from: "2026-09-08" });
    expect(isTariffRowCurrent(future, "2026-08-28")).toBe(false);
    expect(isTariffRowCurrent(future, "2026-09-08")).toBe(true);
  });
});

describe("HS input and official description search", () => {
  it("normalizes common punctuation but rejects malformed code lengths", () => {
    expect(normalizeHsCode("8708.30")).toBe("870830");
    expect(isValidHsCode("8708.30")).toBe(true);
    expect(isValidHsCode("87083")).toBe(false);
    expect(isValidHsCode("8708301")).toBe(false);
    expect(isValidHsCode("brake")).toBe(false);
    expect(isValidHsCode("abc870830")).toBe(false);
  });

  it("maps official USITC rows to deduplicated six-digit suggestions", () => {
    expect(
      parseUsitcSearchResponse(
        [
          { htsno: "3819.00.00", description: "Hydraulic brake fluids" },
          { htsno: "8708.30.10.10", description: "Mounted brake pads and linings" },
          { htsno: "8708.30.50", description: "Other brakes" },
          { htsno: "invalid", description: "Ignored" },
        ],
        "brake pads",
        1
      )
    ).toEqual([
      {
        hsCode: "870830",
        displayCode: "8708.30.10.10",
        description: "Mounted brake pads and linings",
        sourceName: "U.S. International Trade Commission HTS",
      },
    ]);
  });

  it("keeps the wizard usable when description search fails", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error("offline"));

    await expect(requestHsSuggestions("brake pads", fetcher)).resolves.toEqual([]);
  });

  it("reports upstream failure separately while valid manual HS remains usable", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error("offline"));
    await expect(requestHsSuggestionResult("smartphones", fetcher)).resolves.toEqual({ status: "unavailable", suggestions: [] });
    expect(isValidHsCode("851713")).toBe(true);
    expect(buildHsAnalysisHref("8517.13", "Smartphones")).toBe("/dashboard?hs=851713&product=Smartphones");
  });

  it("preserves HS6 and product description through the dashboard handoff", () => {
    const href = new URL(buildHsAnalysisHref("870830", "brake pads"), "https://tariffcompass.ca");
    expect(parseHsLookupPrefill({ hs: href.searchParams.get("hs") ?? undefined, product: href.searchParams.get("product") ?? undefined })).toEqual({ hsCode: "870830", productDescription: "brake pads" });
    expect(parseHsLookupPrefill({ hs: "87083", product: "brake pads" })).toBeNull();
  });

  it("keeps classification and national-code caveats explicit", () => {
    expect(HS_CLASSIFICATION_CAVEAT).toContain("Possible match");
    expect(HS_CLASSIFICATION_CAVEAT).toContain("confirm classification");
    expect(HS6_NATIONAL_CODE_CAVEAT).toContain("internationally harmonized");
    expect(HS6_NATIONAL_CODE_CAVEAT).toContain("may differ beyond six digits");
  });

  it("shares the canonical lookup client between ProductStep and the standalone tool", () => {
    const productStep = readFileSync("components/onboarding/product-step.tsx", "utf8");
    const publicLookup = readFileSync("components/hs-lookup/hs-lookup-tool.tsx", "utf8");
    expect(productStep).toContain("requestHsSuggestionResult");
    expect(publicLookup).toContain("requestHsSuggestionResult");
    expect(publicLookup).not.toContain("Anthropic");
  });
});
