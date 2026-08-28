import { describe, expect, it } from "vitest";
import {
  CANADA_US_COUNTER_TARIFFS_2026,
  computeIncrementalCounterTariffExposure,
  findCanadianCounterTariff,
  getTradeMeasureStatus,
  isSafeHs6Mapping,
} from "@/lib/data/canada-counter-tariffs-2026";

const smartphone = () =>
  findCanadianCounterTariff({ hsCode: "8517.13", scenario: "import-us" });

describe("verified Canadian counter-tariff slice", () => {
  it("finds a verified HS6 measure", () => expect(smartphone()?.rate).toBe(50));

  it("is upcoming before September 8", () => {
    expect(getTradeMeasureStatus("2026-09-08", new Date("2026-09-07T23:59:59Z"))).toBe("upcoming");
  });

  it("becomes current on its effective date", () => {
    expect(getTradeMeasureStatus("2026-09-08", new Date("2026-09-08T00:00:00Z"))).toBe("current");
  });

  it("does not return an upcoming measure as a current market row", () => {
    expect(getTradeMeasureStatus(smartphone()!.effectiveFrom, new Date("2026-08-28T12:00:00Z"))).not.toBe("current");
  });

  it("applies to U.S.-to-Canada imports", () => expect(smartphone()).not.toBeNull());

  it("does not apply to Canada-to-U.S. exports", () => {
    expect(findCanadianCounterTariff({ hsCode: "851713", scenario: "export-us" })).toBeNull();
  });

  it("does not apply to non-U.S. origins", () => {
    expect(findCanadianCounterTariff({ hsCode: "851713", scenario: "import-us", originCountry: "eu" })).toBeNull();
  });

  it("does not apply to unrelated HS codes", () => {
    expect(findCanadianCounterTariff({ hsCode: "870830", scenario: "import-us" })).toBeNull();
  });

  it("calculates incremental gross exposure from the additional rate", () => {
    expect(computeIncrementalCounterTariffExposure(smartphone(), 250_000)).toBe(125_000);
  });

  it("does not invent exposure when annual value is missing", () => {
    expect(computeIncrementalCounterTariffExposure(smartphone(), null)).toBeNull();
  });

  it("retains exact Canadian tariff-item provenance for every HS6 row", () => {
    expect(CANADA_US_COUNTER_TARIFFS_2026.every((row) => row.nationalTariffItem)).toBe(true);
    expect(smartphone()?.nationalTariffItem).toBe("8517.13.00");
  });

  it("only accepts unambiguous .00 mappings", () => {
    expect(isSafeHs6Mapping("8517.13.00", "851713")).toBe(true);
    expect(isSafeHs6Mapping("8517.13.10", "851713")).toBe(false);
    expect(CANADA_US_COUNTER_TARIFFS_2026.every((row) => isSafeHs6Mapping(row.nationalTariffItem, row.hsCode))).toBe(true);
  });
});
