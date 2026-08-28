import { describe, expect, it } from "vitest";
import {
  CANADA_US_COUNTER_TARIFF_APPLICABILITY_2026,
  CANADA_US_COUNTER_TARIFF_MEASURE_2026,
  FINANCE_CANADA_COUNTER_TARIFF_SOURCE,
  calendarDateInTimeZone,
  findCanadianCounterTariff,
  getTradeMeasureStatus,
  isSafeHs6Mapping,
} from "@/lib/data/canada-counter-tariffs-2026";

const smartphone = () => findCanadianCounterTariff({ hsCode: "8517.13", scenario: "import-us" });

describe("canonical Canadian trade measure", () => {
  it("classifies Finance Canada as announcement authority, not legal authority", () => {
    expect(FINANCE_CANADA_COUNTER_TARIFF_SOURCE.authorityTier).toBe("official_announcement");
    expect(FINANCE_CANADA_COUNTER_TARIFF_SOURCE.legalInstrumentIdentifier).toBeNull();
    expect(CANADA_US_COUNTER_TARIFF_MEASURE_2026.confidence).toBe("provisional");
  });

  it("uses calendar dates for upcoming and current status", () => {
    expect(getTradeMeasureStatus(CANADA_US_COUNTER_TARIFF_MEASURE_2026, "2026-09-07")).toBe("upcoming");
    expect(getTradeMeasureStatus(CANADA_US_COUNTER_TARIFF_MEASURE_2026, "2026-09-08")).toBe("current");
  });

  it("does not let a UTC timestamp advance September 7 in Canada", () => {
    const instant = new Date("2026-09-08T00:30:00Z");
    const canadianDate = calendarDateInTimeZone(instant, "America/Toronto");
    expect(canadianDate).toBe("2026-09-07");
    expect(getTradeMeasureStatus(CANADA_US_COUNTER_TARIFF_MEASURE_2026, canadianDate)).toBe("upcoming");
  });

  it("marks a measure expired after effective_to", () => {
    expect(getTradeMeasureStatus({ announcementDate: "2026-01-01", effectiveFrom: "2026-02-01", effectiveTo: "2026-03-01" }, "2026-03-02")).toBe("expired");
  });

  it("handles a future announcement deterministically", () => {
    expect(getTradeMeasureStatus({ announcementDate: "2026-10-01", effectiveFrom: "2026-11-01", effectiveTo: null }, "2026-09-01")).toBe("announced");
  });

  it("preserves the smartphone applicability and route facts", () => {
    const match = smartphone();
    expect(match?.applicability).toMatchObject({ hsCode: "851713", nationalTariffItem: "8517.13.00", additionalRate: 50 });
    expect(match?.measure).toMatchObject({ effectiveFrom: "2026-09-08", originCountry: "us", destinationCountry: "CA" });
  });

  it("links all 12 applicability rows to one measure", () => {
    expect(CANADA_US_COUNTER_TARIFF_APPLICABILITY_2026).toHaveLength(12);
    expect(new Set(CANADA_US_COUNTER_TARIFF_APPLICABILITY_2026.map((row) => row.tradeMeasureId))).toEqual(new Set([CANADA_US_COUNTER_TARIFF_MEASURE_2026.id]));
  });

  it("does not fabricate missing source data", () => {
    expect(FINANCE_CANADA_COUNTER_TARIFF_SOURCE.legalInstrumentIdentifier).toBeNull();
    expect(FINANCE_CANADA_COUNTER_TARIFF_SOURCE.statusNote).toContain("not been verified");
  });

  it("only applies to the verified route and HS scope", () => {
    expect(smartphone()).not.toBeNull();
    expect(findCanadianCounterTariff({ hsCode: "851713", scenario: "export-us" })).toBeNull();
    expect(findCanadianCounterTariff({ hsCode: "851713", scenario: "import-us", originCountry: "eu" })).toBeNull();
    expect(findCanadianCounterTariff({ hsCode: "870830", scenario: "import-us" })).toBeNull();
  });

  it("only retains unambiguous national-item mappings", () => {
    expect(isSafeHs6Mapping("8517.13.10", "851713")).toBe(false);
    expect(CANADA_US_COUNTER_TARIFF_APPLICABILITY_2026.every((row) => isSafeHs6Mapping(row.nationalTariffItem, row.hsCode))).toBe(true);
  });
});
