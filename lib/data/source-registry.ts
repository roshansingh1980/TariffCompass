/**
 * Computed view of every source actually referenced by the app's data —
 * not a hand-maintained list, so it can never drift from what's really
 * cited. Queries Postgres directly (the `sources`, `tariff_rates`, and
 * `support_programs` tables) now that the data has moved out of code.
 */

import { createClient } from "@supabase/supabase-js";

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type SourceRegistryEntry = {
  name: string;
  url: string;
  covers: string;
  lastChecked: string;
};

export async function getUsedSourceRegistry(): Promise<SourceRegistryEntry[]> {
  const supabase = getAnonClient();

  const [{ data: rates, error: ratesError }, { data: allSources, error: sourcesError }, { data: programs, error: programsError }] =
    await Promise.all([
      supabase.from("tariff_rates").select("source_id"),
      supabase.from("sources").select("id, name, url, covers, last_checked"),
      supabase.from("support_programs").select("name, description, href, last_checked"),
    ]);

  if (ratesError) throw ratesError;
  if (sourcesError) throw sourcesError;
  if (programsError) throw programsError;

  // Only sources actually referenced by at least one tariff_rates row — this
  // is what drops a defined-but-unused entry (e.g. a source registered for
  // completeness but never cited by any rate).
  const usedSourceIds = new Set(rates.map((r) => r.source_id).filter(Boolean));

  const byUrl = new Map<string, SourceRegistryEntry>();
  for (const source of allSources) {
    if (usedSourceIds.has(source.id)) {
      byUrl.set(source.url, {
        name: source.name,
        url: source.url,
        covers: source.covers,
        lastChecked: source.last_checked,
      });
    }
  }
  for (const program of programs) {
    if (!byUrl.has(program.href)) {
      byUrl.set(program.href, {
        name: program.name,
        url: program.href,
        covers: program.description,
        lastChecked: program.last_checked,
      });
    }
  }

  return [...byUrl.values()].sort((a, b) => a.name.localeCompare(b.name));
}
