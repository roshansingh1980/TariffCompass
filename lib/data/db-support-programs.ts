/**
 * Postgres-backed replacement for the old code-resident lib/support-programs.ts.
 * Uses a plain anon-key client (see lib/data/db-market-data.ts) so it works
 * from both client and server components — this table is public-read.
 */

import { createClient } from "@supabase/supabase-js";

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type SupportProgram = {
  name: string;
  description: string;
  whoItsFor: string;
  href: string;
  importCaveat?: string;
  lastChecked: string;
};

export async function getSupportPrograms(): Promise<SupportProgram[]> {
  const supabase = getAnonClient();
  const { data, error } = await supabase
    .from("support_programs")
    .select("name, description, who_its_for, href, import_caveat, last_checked")
    .order("name");

  if (error) throw error;

  return data.map((p) => ({
    name: p.name,
    description: p.description,
    whoItsFor: p.who_its_for,
    href: p.href,
    importCaveat: p.import_caveat ?? undefined,
    lastChecked: p.last_checked,
  }));
}
