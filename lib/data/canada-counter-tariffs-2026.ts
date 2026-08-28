import { isValidHsCode, normalizeHsCode } from "@/lib/hs-code";

export const CANADA_COUNTER_TARIFF_SOURCE = {
  name: "Department of Finance Canada",
  url: "https://www.canada.ca/en/department-finance/programs/international-trade-finance-policy/canadas-response-us-tariffs/complete-list-us-products-subject-to-counter-tariffs.html",
  reviewedAt: "2026-08-28",
  sourceStatus:
    "Authoritative Finance Canada product list; CBSA administration details and a corresponding legal instrument were not yet available when reviewed.",
} as const;

export type TradeMeasureStatus = "upcoming" | "current";

export type CanadianCounterTariff = {
  hsCode: string;
  nationalTariffItem: string;
  productDescription: string;
  rate: number;
  measureType: "counter_tariff";
  effectiveFrom: string;
  originCountry: "us";
  destinationCountry: "CA";
  confidence: "official";
  applicabilityNote: string;
  source: typeof CANADA_COUNTER_TARIFF_SOURCE;
};

const COMMON_FIELDS = {
  measureType: "counter_tariff",
  effectiveFrom: "2026-09-08",
  originCountry: "us",
  destinationCountry: "CA",
  confidence: "official",
  applicabilityNote:
    "Applies to qualifying U.S.-origin goods. Confirm classification, origin and final duty treatment with a customs professional.",
  source: CANADA_COUNTER_TARIFF_SOURCE,
} as const;

/**
 * Small, manually reviewed launch slice from the Finance Canada list updated
 * August 26, 2026. Every selected Canadian tariff item ends in .00, so its
 * first six digits map unambiguously to the HS6 used by TariffCompass.
 */
export const CANADA_US_COUNTER_TARIFFS_2026: readonly CanadianCounterTariff[] = [
  { hsCode: "730810", nationalTariffItem: "7308.10.00", productDescription: "Bridges and bridge sections of iron or steel", rate: 50, ...COMMON_FIELDS },
  { hsCode: "730820", nationalTariffItem: "7308.20.00", productDescription: "Towers and lattice masts of iron or steel", rate: 50, ...COMMON_FIELDS },
  { hsCode: "730830", nationalTariffItem: "7308.30.00", productDescription: "Iron or steel doors, windows, frames and thresholds", rate: 50, ...COMMON_FIELDS },
  { hsCode: "730840", nationalTariffItem: "7308.40.00", productDescription: "Iron or steel scaffolding, shuttering and propping equipment", rate: 50, ...COMMON_FIELDS },
  { hsCode: "730890", nationalTariffItem: "7308.90.00", productDescription: "Other iron or steel structures and parts", rate: 50, ...COMMON_FIELDS },
  { hsCode: "842542", nationalTariffItem: "8425.42.00", productDescription: "Hydraulic jacks and vehicle hoists", rate: 25, ...COMMON_FIELDS },
  { hsCode: "842620", nationalTariffItem: "8426.20.00", productDescription: "Tower cranes", rate: 25, ...COMMON_FIELDS },
  { hsCode: "842870", nationalTariffItem: "8428.70.00", productDescription: "Industrial robots", rate: 15, ...COMMON_FIELDS },
  { hsCode: "843320", nationalTariffItem: "8433.20.00", productDescription: "Other mowers, including tractor-mounted cutter bars", rate: 15, ...COMMON_FIELDS },
  { hsCode: "845020", nationalTariffItem: "8450.20.00", productDescription: "Washing machines with dry-linen capacity over 10 kg", rate: 25, ...COMMON_FIELDS },
  { hsCode: "851713", nationalTariffItem: "8517.13.00", productDescription: "Smartphones", rate: 50, ...COMMON_FIELDS },
  { hsCode: "851762", nationalTariffItem: "8517.62.00", productDescription: "Data reception, conversion, transmission, switching and routing apparatus", rate: 50, ...COMMON_FIELDS },
] as const;

export function getTradeMeasureStatus(
  effectiveFrom: string,
  asOf: Date = new Date()
): TradeMeasureStatus {
  const effectiveAt = new Date(`${effectiveFrom}T00:00:00Z`);
  return asOf.getTime() >= effectiveAt.getTime() ? "current" : "upcoming";
}

export function isSafeHs6Mapping(nationalTariffItem: string, hsCode: string): boolean {
  const digits = nationalTariffItem.replace(/\D/g, "");
  return digits.length === 8 && digits.endsWith("00") && digits.slice(0, 6) === hsCode;
}

export function findCanadianCounterTariff({
  hsCode,
  scenario,
  originCountry = "us",
  destinationCountry = "CA",
}: {
  hsCode: string | null | undefined;
  scenario: string | null;
  originCountry?: string;
  destinationCountry?: string;
}): CanadianCounterTariff | null {
  if (
    scenario !== "import-us" ||
    originCountry !== "us" ||
    destinationCountry !== "CA" ||
    !isValidHsCode(hsCode ?? "")
  ) {
    return null;
  }

  const normalized = normalizeHsCode(hsCode ?? "");
  return CANADA_US_COUNTER_TARIFFS_2026.find((measure) => measure.hsCode === normalized) ?? null;
}

export function computeIncrementalCounterTariffExposure(
  measure: CanadianCounterTariff | null,
  annualImportValue: number | null | undefined
): number | null {
  if (!measure || annualImportValue == null || !Number.isFinite(annualImportValue) || annualImportValue <= 0) {
    return null;
  }
  return annualImportValue * (measure.rate / 100);
}
