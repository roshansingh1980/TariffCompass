import {
  getDataStatus,
  getMarketDataRows,
  getRiskStatus,
} from "@/lib/data/db-market-data";

/**
 * A real row pulled live from the same Postgres tables the Results screen
 * reads, so this can't drift from the app the way a static screenshot would.
 * Renders nothing if the fetch fails rather than showing placeholder data.
 */
export async function AboutLiveExample() {
  let rows;
  try {
    rows = await getMarketDataRows("Auto parts", "export-us");
  } catch {
    return null;
  }

  const row = rows.find((r) => r.market.key === "us") ?? rows[0];
  if (!row) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-border/60">
      <div className="flex items-center justify-between border-b border-border/50 bg-foreground/[0.02] px-5 py-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Live example — Auto parts, exporting to {row.market.name}
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-[#C8102E]" />
      </div>
      <div className="grid grid-cols-2 gap-4 px-5 py-5 sm:grid-cols-4">
        <div>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Tariff rate</p>
          <p className="mt-1 text-lg font-medium tracking-tight text-foreground">{row.tariffRate}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Attractiveness</p>
          <p className="mt-1 text-lg font-medium tracking-tight text-foreground">{row.attractiveness}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Cost / friction</p>
          <p className="mt-1 text-lg font-medium tracking-tight text-foreground">{row.costFriction}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Data status</p>
          <p className="mt-1 text-lg font-medium tracking-tight text-foreground">{getDataStatus(row)}</p>
        </div>
      </div>
      <p className="border-t border-border/50 px-5 py-3 text-[11px] text-muted-foreground/70">
        Risk: {getRiskStatus(row)} · Source: {row.sourceName}
      </p>
    </div>
  );
}
