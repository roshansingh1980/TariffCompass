import { isValidHsCode, normalizeHsCode } from "@/lib/hs-code";

export const HS_CLASSIFICATION_CAVEAT = "Possible match — confirm classification with a customs professional.";
export const HS6_NATIONAL_CODE_CAVEAT = "The first six HS digits are internationally harmonized. U.S. HTS and Canadian tariff-item classifications may differ beyond six digits.";

const MAX_PRODUCT_DESCRIPTION_LENGTH = 120;
const MAX_OFFICIAL_DESCRIPTION_LENGTH = 240;

export type HsLookupPrefill = {
  hsCode: string;
  productDescription: string;
  officialDescription: string;
  source: "hs-lookup";
};

export function buildHsAnalysisHref(hsCode: string, productDescription: string, officialDescription = ""): string {
  const normalized = normalizeHsCode(hsCode);
  if (!isValidHsCode(normalized)) throw new Error("A valid six-digit HS code is required.");
  const params = new URLSearchParams({
    hs: normalized,
    product: productDescription.trim().slice(0, MAX_PRODUCT_DESCRIPTION_LENGTH),
    official: officialDescription.trim().slice(0, MAX_OFFICIAL_DESCRIPTION_LENGTH),
    source: "hs-lookup",
  });
  return `/dashboard?${params.toString()}`;
}

export function parseHsLookupPrefill(params: { hs?: string; product?: string; official?: string; source?: string }): HsLookupPrefill | null {
  const hsCode = params.hs?.trim() ?? "";
  if (!isValidHsCode(hsCode) || params.source !== "hs-lookup") return null;
  return {
    hsCode: normalizeHsCode(hsCode),
    productDescription: (params.product ?? "").trim().slice(0, MAX_PRODUCT_DESCRIPTION_LENGTH),
    officialDescription: (params.official ?? "").trim().slice(0, MAX_OFFICIAL_DESCRIPTION_LENGTH),
    source: "hs-lookup",
  };
}
