import { normalizeHsCode } from "@/lib/hs-code";

export type HsSuggestion = {
  hsCode: string;
  displayCode: string;
  description: string;
  sourceName: "USITC Harmonized Tariff Schedule";
};

type UsitcSearchRow = {
  htsno?: unknown;
  description?: unknown;
};

export function parseUsitcSearchResponse(value: unknown, query = "", limit = 5): HsSuggestion[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const candidates: Array<HsSuggestion & { score: number }> = [];
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/).filter((word) => word.length > 1);

  for (const candidate of value as UsitcSearchRow[]) {
    if (typeof candidate.htsno !== "string" || typeof candidate.description !== "string") continue;
    const hsCode = normalizeHsCode(candidate.htsno).slice(0, 6);
    const description = candidate.description.replace(/\s+/g, " ").trim();
    if (hsCode.length !== 6 || !description || seen.has(hsCode)) continue;

    seen.add(hsCode);
    const normalizedDescription = description.toLowerCase();
    const score =
      (normalizedQuery && normalizedDescription.includes(normalizedQuery) ? 10 : 0) +
      queryWords.filter((word) => normalizedDescription.includes(word)).length;
    candidates.push({
      hsCode,
      displayCode: candidate.htsno,
      description,
      sourceName: "USITC Harmonized Tariff Schedule",
      score,
    });
  }

  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((candidate) => ({
      hsCode: candidate.hsCode,
      displayCode: candidate.displayCode,
      description: candidate.description,
      sourceName: candidate.sourceName,
    }));
}

export async function requestHsSuggestions(
  query: string,
  fetcher: typeof fetch = fetch
): Promise<HsSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  try {
    const response = await fetcher(`/api/hs-search?q=${encodeURIComponent(trimmed)}`);
    if (!response.ok) return [];
    const body = (await response.json()) as { suggestions?: unknown };
    return Array.isArray(body.suggestions) ? (body.suggestions as HsSuggestion[]) : [];
  } catch {
    return [];
  }
}
