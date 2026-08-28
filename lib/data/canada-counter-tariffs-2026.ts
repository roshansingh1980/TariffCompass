import { isValidHsCode, normalizeHsCode } from "@/lib/hs-code";
import type { TradeMeasureChange } from "@/lib/trade-measure-changes";

export type SourceAuthorityTier = "legal" | "administrative" | "official_announcement";
export type SourceType = "legal_instrument" | "customs_guidance" | "government_announcement";
export type ProvenanceConfidence = "verified" | "provisional" | "limited";
export type TradeMeasureStatus = "announced" | "upcoming" | "current" | "expired";

export type TradeMeasureSource = {
  id: string; name: string; url: string; jurisdiction: string;
  authorityTier: SourceAuthorityTier; sourceType: SourceType; retrievedAt: string;
  legalInstrumentIdentifier: string | null; statusNote: string | null;
};

export type TradeMeasure = {
  id: string; jurisdiction: string; title: string; shortName: string;
  measureType: "counter_tariff"; announcementDate: string | null;
  effectiveFrom: string | null; effectiveTo: string | null;
  originCountry: "us"; destinationCountry: "CA"; applicabilityNote: string;
  confidence: ProvenanceConfidence; reviewedAt: string; sourceIds: readonly string[];
};

export type TradeMeasureApplicability = {
  id: string; tradeMeasureId: string; hsCode: string; nationalTariffItem: string;
  productDescription: string; additionalRate: number;
};

export type ApplicableTradeMeasure = {
  measure: TradeMeasure;
  applicability: TradeMeasureApplicability;
  sources: readonly TradeMeasureSource[];
};

export const FINANCE_CANADA_COUNTER_TARIFF_SOURCE: TradeMeasureSource = {
  id: "20260908-0000-4000-8000-000000000001",
  name: "Department of Finance Canada",
  url: "https://www.canada.ca/en/department-finance/programs/international-trade-finance-policy/canadas-response-us-tariffs/complete-list-us-products-subject-to-counter-tariffs.html",
  jurisdiction: "CA",
  authorityTier: "official_announcement",
  sourceType: "government_announcement",
  retrievedAt: "2026-08-28",
  legalInstrumentIdentifier: null,
  statusNote: "CBSA implementation guidance and an operative legal instrument had not been verified when this source was reviewed.",
};

export const FINANCE_CANADA_COUNTER_TARIFF_ANNOUNCEMENT_SOURCE: TradeMeasureSource = {
  id: "20260908-0000-4000-8000-000000000002",
  name: "Department of Finance Canada",
  url: "https://www.canada.ca/en/department-finance/news/2026/08/canada-announces-targeted-countermeasures-and-substantive-support-for-workers-and-businesses-in-response-to-us-tariffs.html",
  jurisdiction: "CA",
  authorityTier: "official_announcement",
  sourceType: "government_announcement",
  retrievedAt: "2026-08-28",
  legalInstrumentIdentifier: null,
  statusNote: "Official August 25, 2026 announcement of the countermeasures effective September 8, 2026.",
};

export const CANADA_US_COUNTER_TARIFF_MEASURE_2026: TradeMeasure = {
  id: "20260908-0000-4000-8000-000000000010",
  jurisdiction: "CA",
  title: "Canadian counter-tariffs on selected U.S.-origin products effective September 8, 2026",
  shortName: "September 2026 Canadian counter-tariffs",
  measureType: "counter_tariff",
  announcementDate: "2026-08-25",
  effectiveFrom: "2026-09-08",
  effectiveTo: null,
  originCountry: "us",
  destinationCountry: "CA",
  applicabilityNote: "Applies to qualifying U.S.-origin goods imported into Canada. Confirm classification, origin and final treatment with a customs professional.",
  confidence: "provisional",
  reviewedAt: "2026-08-28",
  sourceIds: [FINANCE_CANADA_COUNTER_TARIFF_SOURCE.id, FINANCE_CANADA_COUNTER_TARIFF_ANNOUNCEMENT_SOURCE.id],
};

const MEASURE_ID = CANADA_US_COUNTER_TARIFF_MEASURE_2026.id;

export const CANADA_US_COUNTER_TARIFF_CHANGE_2026: TradeMeasureChange = {
  id: "20260908-0000-4000-8000-000000000020",
  tradeMeasureId: MEASURE_ID,
  changeType: "announced",
  eventDate: "2026-08-25",
  announcedDate: "2026-08-25",
  effectiveDate: "2026-09-08",
  previousState: {
    kind: "none_recorded",
    description: "No verified additional counter-tariff recorded for this measure/applicability",
  },
  newState: {
    kind: "known_rate",
    rate: 50,
    rateKind: "additional_counter_tariff",
    description: "50% additional Canadian counter-tariff",
  },
  sourceIds: [FINANCE_CANADA_COUNTER_TARIFF_ANNOUNCEMENT_SOURCE.id],
  confidence: "provisional",
  applicability: {
    hsCode: "851713",
    nationalTariffItem: "8517.13.00",
    originCountry: "us",
    destinationCountry: "CA",
  },
  financialImpact: null,
};

export function findCanadianCounterTariffChange(applicable: ApplicableTradeMeasure): TradeMeasureChange | null {
  if (applicable.measure.id !== MEASURE_ID || applicable.applicability.hsCode !== CANADA_US_COUNTER_TARIFF_CHANGE_2026.applicability.hsCode) return null;
  return CANADA_US_COUNTER_TARIFF_CHANGE_2026;
}

/** One canonical reviewed fixture used by both the runtime adapter and DB seed. */
export const CANADA_US_COUNTER_TARIFF_APPLICABILITY_2026: readonly TradeMeasureApplicability[] = [
  { id: "20260908-0000-4000-8000-000000000101", tradeMeasureId: MEASURE_ID, hsCode: "730810", nationalTariffItem: "7308.10.00", productDescription: "Bridges and bridge sections of iron or steel", additionalRate: 50 },
  { id: "20260908-0000-4000-8000-000000000102", tradeMeasureId: MEASURE_ID, hsCode: "730820", nationalTariffItem: "7308.20.00", productDescription: "Towers and lattice masts of iron or steel", additionalRate: 50 },
  { id: "20260908-0000-4000-8000-000000000103", tradeMeasureId: MEASURE_ID, hsCode: "730830", nationalTariffItem: "7308.30.00", productDescription: "Iron or steel doors, windows, frames and thresholds", additionalRate: 50 },
  { id: "20260908-0000-4000-8000-000000000104", tradeMeasureId: MEASURE_ID, hsCode: "730840", nationalTariffItem: "7308.40.00", productDescription: "Iron or steel scaffolding, shuttering and propping equipment", additionalRate: 50 },
  { id: "20260908-0000-4000-8000-000000000105", tradeMeasureId: MEASURE_ID, hsCode: "730890", nationalTariffItem: "7308.90.00", productDescription: "Other iron or steel structures and parts", additionalRate: 50 },
  { id: "20260908-0000-4000-8000-000000000106", tradeMeasureId: MEASURE_ID, hsCode: "842542", nationalTariffItem: "8425.42.00", productDescription: "Hydraulic jacks and vehicle hoists", additionalRate: 25 },
  { id: "20260908-0000-4000-8000-000000000107", tradeMeasureId: MEASURE_ID, hsCode: "842620", nationalTariffItem: "8426.20.00", productDescription: "Tower cranes", additionalRate: 25 },
  { id: "20260908-0000-4000-8000-000000000108", tradeMeasureId: MEASURE_ID, hsCode: "842870", nationalTariffItem: "8428.70.00", productDescription: "Industrial robots", additionalRate: 15 },
  { id: "20260908-0000-4000-8000-000000000109", tradeMeasureId: MEASURE_ID, hsCode: "843320", nationalTariffItem: "8433.20.00", productDescription: "Other mowers, including tractor-mounted cutter bars", additionalRate: 15 },
  { id: "20260908-0000-4000-8000-000000000110", tradeMeasureId: MEASURE_ID, hsCode: "845020", nationalTariffItem: "8450.20.00", productDescription: "Washing machines with dry-linen capacity over 10 kg", additionalRate: 25 },
  { id: "20260908-0000-4000-8000-000000000111", tradeMeasureId: MEASURE_ID, hsCode: "851713", nationalTariffItem: "8517.13.00", productDescription: "Smartphones", additionalRate: 50 },
  { id: "20260908-0000-4000-8000-000000000112", tradeMeasureId: MEASURE_ID, hsCode: "851762", nationalTariffItem: "8517.62.00", productDescription: "Data reception, conversion, transmission, switching and routing apparatus", additionalRate: 50 },
] as const;

export const CANADA_COUNTER_TARIFF_SOURCES_2026 = [
  FINANCE_CANADA_COUNTER_TARIFF_SOURCE,
  FINANCE_CANADA_COUNTER_TARIFF_ANNOUNCEMENT_SOURCE,
] as const;

const CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertCalendarDate(value: string): void {
  if (!CALENDAR_DATE_PATTERN.test(value)) throw new Error(`Invalid calendar date: ${value}`);
}

export function calendarDateInTimeZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function getTradeMeasureStatus(
  measure: Pick<TradeMeasure, "announcementDate" | "effectiveFrom" | "effectiveTo">,
  asOfDate: string = calendarDateInTimeZone(new Date(), "America/Toronto")
): TradeMeasureStatus {
  assertCalendarDate(asOfDate);
  if (measure.effectiveTo && asOfDate > measure.effectiveTo) return "expired";
  if (measure.effectiveFrom && asOfDate >= measure.effectiveFrom) return "current";
  if (measure.announcementDate && asOfDate < measure.announcementDate) return "announced";
  return measure.effectiveFrom ? "upcoming" : "announced";
}

export function isSafeHs6Mapping(nationalTariffItem: string, hsCode: string): boolean {
  const digits = nationalTariffItem.replace(/\D/g, "");
  return digits.length === 8 && digits.endsWith("00") && digits.slice(0, 6) === hsCode;
}

/** Temporary fixture adapter; replace with a DB query after migrations are applied. */
export function findCanadianCounterTariff({ hsCode, scenario, originCountry = "us", destinationCountry = "CA" }: {
  hsCode: string | null | undefined; scenario: string | null; originCountry?: string; destinationCountry?: string;
}): ApplicableTradeMeasure | null {
  if (scenario !== "import-us" || originCountry !== "us" || destinationCountry !== "CA" || !isValidHsCode(hsCode ?? "")) return null;
  const normalized = normalizeHsCode(hsCode ?? "");
  const applicability = CANADA_US_COUNTER_TARIFF_APPLICABILITY_2026.find((item) => item.hsCode === normalized);
  if (!applicability) return null;
  return { measure: CANADA_US_COUNTER_TARIFF_MEASURE_2026, applicability, sources: CANADA_COUNTER_TARIFF_SOURCES_2026.filter((source) => CANADA_US_COUNTER_TARIFF_MEASURE_2026.sourceIds.includes(source.id)) };
}
