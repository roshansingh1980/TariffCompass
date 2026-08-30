import { PackageSearch } from "lucide-react";
import { formatHsCode, isValidHsCode } from "@/lib/hs-code";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { SavedProfile } from "@/types/database";

function scenarioLabel(value: string | null): string {
  if (value === "import-us") return "Import from the United States";
  if (value === "export-us") return "Export to the United States";
  return value ?? "Route not specified";
}

function tradeValue(profile: SavedProfile): string {
  if (profile.annual_value == null || !profile.currency) return "Trade value not specified";
  return `${profile.currency} ${new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 }).format(profile.annual_value)}`;
}

export function MonitoredExposures({ profiles, isLoggedIn }: { profiles: SavedProfile[]; isLoggedIn: boolean }) {
  if (!isLoggedIn) return (
    <EmptyState
      icon={PackageSearch}
      heading="Log in to view your exposures"
      description="Saved products and trade routes appear here once you're signed in."
      ctaLabel="Log in"
      ctaHref="/login"
    />
  );

  if (profiles.length === 0) return (
    <EmptyState
      icon={PackageSearch}
      heading="No monitored exposures yet"
      description="Save a product or trade route from an analysis to start monitoring it here."
      ctaLabel="Create an analysis"
      ctaHref="/dashboard"
    />
  );

  return (
    <div className="max-h-[65vh] divide-y divide-border/60 overflow-y-auto overscroll-contain rounded-xl border border-border/60">
      {profiles.map((profile) => (
        <article key={profile.id} className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-sm font-semibold">{profile.product_description || profile.name}</h2>
              <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{profile.monitoring_active ? "Monitoring active" : "Inactive"}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{isValidHsCode(profile.hs_code ?? "") ? `HS ${formatHsCode(profile.hs_code ?? "")}` : "HS code unavailable"} · {scenarioLabel(profile.scenario)}</p>
          </div>
          <p className="text-sm font-medium sm:text-right">{tradeValue(profile)}</p>
        </article>
      ))}
    </div>
  );
}
