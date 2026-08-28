import { describe, expect, it, vi } from "vitest";
import {
  resolveScenarioDirection,
  selectPreferredTariffRow,
  type DbTariffRow,
} from "@/lib/data/db-market-data";
import { isValidHsCode, normalizeHsCode } from "@/lib/hs-code";
import { parseUsitcSearchResponse, requestHsSuggestions } from "@/lib/hs-search";

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
  });

  it("selects import routes using origin rather than destination", () => {
    const category = tariffRow({ origin_country: "us", destination_country: "CA" });

    expect(resolveScenarioDirection("import-us")).toBe("import");
    expect(resolveScenarioDirection("export-us")).toBe("export");
    expect(selectPreferredTariffRow([category], [], "us", "origin_country")?.row).toBe(category);
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
        sourceName: "USITC Harmonized Tariff Schedule",
      },
    ]);
  });

  it("keeps the wizard usable when description search fails", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error("offline"));

    await expect(requestHsSuggestions("brake pads", fetcher)).resolves.toEqual([]);
  });
});
