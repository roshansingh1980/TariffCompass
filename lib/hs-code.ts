export const HS_CODE_LENGTH = 6;

export function normalizeHsCode(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidHsCode(value: string): boolean {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  return /^[\d.\s-]+$/.test(trimmed) && digits.length === HS_CODE_LENGTH;
}

export function formatHsCode(value: string): string {
  const normalized = normalizeHsCode(value);
  return normalized.length === HS_CODE_LENGTH
    ? `${normalized.slice(0, 4)}.${normalized.slice(4)}`
    : normalized;
}
