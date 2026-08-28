import { describe, expect, it } from "vitest";
import {
  CANADA_US_COUNTER_TARIFF_APPLICABILITY_2026,
  CANADA_US_COUNTER_TARIFF_MEASURE_2026,
  CANADA_US_COUNTER_TARIFF_CHANGE_2026,
  FINANCE_CANADA_COUNTER_TARIFF_SOURCE,
  FINANCE_CANADA_COUNTER_TARIFF_ANNOUNCEMENT_SOURCE,
  calendarDateInTimeZone,
  findCanadianCounterTariff,
  findCanadianCounterTariffChange,
  getTradeMeasureStatus,
  isSafeHs6Mapping,
} from "@/lib/data/canada-counter-tariffs-2026";
import { addChangeToHistory, attachIncrementalFinancialImpact, getTradeMeasureChangeStatus, type TradeMeasureChange } from "@/lib/trade-measure-changes";

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

  it("maps the smartphone measure to one canonical before/after transition", () => {
    const match = smartphone()!;
    const change = findCanadianCounterTariffChange(match)!;
    expect(change.tradeMeasureId).toBe(match.measure.id);
    expect(change.previousState).toMatchObject({ kind: "none_recorded" });
    expect(change.newState).toMatchObject({ kind: "known_rate", rate: 50, rateKind: "additional_counter_tariff" });
    expect(change.effectiveDate).toBe("2026-09-08");
    expect(change.announcedDate).toBe("2026-08-25");
    expect(change.sourceIds).toContain(FINANCE_CANADA_COUNTER_TARIFF_ANNOUNCEMENT_SOURCE.id);
    expect(FINANCE_CANADA_COUNTER_TARIFF_ANNOUNCEMENT_SOURCE.url).toContain("canada-announces-targeted-countermeasures");
  });

  it("does not represent none recorded as a verified zero-percent base tariff", () => {
    const previous = CANADA_US_COUNTER_TARIFF_CHANGE_2026.previousState;
    expect(previous.kind).toBe("none_recorded");
    expect(previous).not.toHaveProperty("rate");
    expect(previous.description).not.toContain("0%");
  });

  it("moves the real event from announced to effective on the canonical date", () => {
    expect(getTradeMeasureChangeStatus(CANADA_US_COUNTER_TARIFF_CHANGE_2026, "2026-09-07")).toBe("announced");
    expect(getTradeMeasureChangeStatus(CANADA_US_COUNTER_TARIFF_CHANGE_2026, "2026-09-08")).toBe("effective");
  });

  it("reuses the canonical engine for a 250,000 CAD incremental impact", () => {
    const change = attachIncrementalFinancialImpact(CANADA_US_COUNTER_TARIFF_CHANGE_2026, 250000, "CAD", "import-us", "2026-08-28");
    expect(change.financialImpact).toMatchObject({
      priorAdditionalExposure: null,
      changeInAdditionalExposureMin: 125000,
      changeInAdditionalExposureMax: 125000,
      explanation: "No recorded additional counter-tariff from this measure",
    });
    expect(change.financialImpact?.newAdditionalExposure.incrementalExposureMax).toBe(125000);
    expect(change.financialImpact?.newAdditionalExposure.measureStatus).toBe("announced");
  });

  it("supports delayed, amended, and expired events without replacing history", () => {
    const delayed: TradeMeasureChange = { ...CANADA_US_COUNTER_TARIFF_CHANGE_2026, id: "delayed-test", changeType: "delayed", eventDate: "2026-09-01", effectiveDate: "2026-10-01" };
    const amended: TradeMeasureChange = { ...CANADA_US_COUNTER_TARIFF_CHANGE_2026, id: "amended-test", changeType: "amended", eventDate: "2026-09-15" };
    const expired: TradeMeasureChange = { ...CANADA_US_COUNTER_TARIFF_CHANGE_2026, id: "expired-test", changeType: "expired", eventDate: "2027-01-01" };
    const history = addChangeToHistory(addChangeToHistory([CANADA_US_COUNTER_TARIFF_CHANGE_2026], delayed), amended);
    expect(delayed.effectiveDate).toBe("2026-10-01");
    expect(getTradeMeasureChangeStatus(delayed, "2026-09-02")).toBe("delayed");
    expect(getTradeMeasureChangeStatus(amended, "2026-09-16")).toBe("amended");
    expect(getTradeMeasureChangeStatus(expired, "2027-01-01")).toBe("expired");
    expect(history.map((event) => event.id)).toEqual([CANADA_US_COUNTER_TARIFF_CHANGE_2026.id, "delayed-test", "amended-test"]);
  });
});
