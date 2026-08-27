/**
 * Computed view of every source actually referenced by the app's data —
 * not a hand-maintained list, so it can never drift from what market-data.ts
 * and support-programs.ts really cite. Kept in its own file (not sources.ts)
 * to avoid a circular import: market-data.ts already imports SOURCES from
 * sources.ts, so sources.ts can't import flattenMarketData back.
 *
 * Shape mirrors the planned Postgres `sources` table columns 1:1
 * (name, url, covers, last_checked) so this can move over later without
 * reshaping.
 */

import { flattenMarketData } from "@/lib/data/market-data";
import { SOURCES } from "@/lib/data/sources";
import { SUPPORT_PROGRAMS } from "@/lib/support-programs";

export type SourceRegistryEntry = {
  name: string;
  url: string;
  covers: string;
  lastChecked: string;
};

export function getUsedSourceRegistry(): SourceRegistryEntry[] {
  const byUrl = new Map<string, SourceRegistryEntry>();

  for (const source of Object.values(SOURCES)) {
    byUrl.set(source.url, {
      name: source.name,
      url: source.url,
      covers: source.usedFor,
      lastChecked: source.lastChecked,
    });
  }

  for (const program of SUPPORT_PROGRAMS) {
    if (!byUrl.has(program.href)) {
      byUrl.set(program.href, {
        name: program.name,
        url: program.href,
        covers: program.description,
        lastChecked: program.lastChecked,
      });
    }
  }

  const usedUrls = new Set<string>([
    ...flattenMarketData().map((row) => row.sourceUrl),
    ...SUPPORT_PROGRAMS.map((program) => program.href),
  ]);

  return [...byUrl.values()]
    .filter((entry) => usedUrls.has(entry.url))
    .sort((a, b) => a.name.localeCompare(b.name));
}
