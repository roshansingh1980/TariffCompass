import { isValidHsCode, normalizeHsCode } from "@/lib/hs-code";

export const HS_CLASSIFICATION_CAVEAT = "Possible match — confirm classification with a customs professional.";
export const HS6_NATIONAL_CODE_CAVEAT = "The first six HS digits are internationally harmonized. U.S. HTS and Canadian tariff-item classifications may differ beyond six digits.";

export type HsLookupPrefill = { hsCode: string; productDescription: string };

export function buildHsAnalysisHref(hsCode: string, productDescription: string): string {
  const normalized = normalizeHsCode(hsCode);
  if (!isValidHsCode(normalized)) throw new Error("A valid six-digit HS code is required.");
  const params = new URLSearchParams({ hs: normalized, product: productDescription.trim() });
  return `/dashboard?${params.toString()}`;
}

export function parseHsLookupPrefill(params: { hs?: string; product?: string }): HsLookupPrefill | null {
  const hsCode = params.hs?.trim() ?? "";
  if (!isValidHsCode(hsCode)) return null;
  return {
    hsCode: normalizeHsCode(hsCode),
    productDescription: (params.product ?? "").trim().slice(0, 120),
  };
}
