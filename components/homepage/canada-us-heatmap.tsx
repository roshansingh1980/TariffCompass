import Link from "next/link";
import { getUsHeatmapSummary, type Attractiveness, type RiskStatus } from "@/lib/data/db-market-data";
import { cn } from "@/lib/utils";

function AttractivenessBadge({ level }: { level: Attractiveness }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide",
        level === "Excellent" && "border-transparent bg-foreground text-background",
        level === "Good" && "border-foreground/30 text-foreground",
        level === "Fair" && "border-border text-muted-foreground",
        level === "Challenging" && "border-dashed border-border text-muted-foreground/70"
      )}
    >
      {level}
    </span>
  );
}

function RiskBadge({ level }: { level: RiskStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide",
        level === "Elevated" && "border-transparent bg-foreground text-background",
        level === "Watch" && "border-foreground/30 text-foreground",
        level === "Stable" && "border-border text-muted-foreground",
        level === "Uncertain" && "border-dashed border-border text-muted-foreground/70"
      )}
    >
      {level}
    </span>
  );
}

export async function CanadaUsHeatmap() {
  let summary;
  try {
    summary = await getUsHeatmapSummary();
  } catch (error) {
    console.error("Failed to load homepage heatmap data:", error);
    return (
      <section className="w-full max-w-4xl px-6 pb-28">
        <div className="text-center">
          <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Canada &ndash; U.S. trade, at a glance
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Couldn&apos;t load this section right now — try refreshing the page.
          </p>
        </div>
      </section>
    );
  }

  const panels = [
    {
      key: "export",
      title: "Exporting to the U.S.",
      subtitle: "Canada → United States",
      data: summary.export,
    },
    {
      key: "import",
      title: "Importing from the U.S.",
      subtitle: "United States → Canada",
      data: summary.import,
    },
  ] as const;

  return (
    <section className="w-full max-w-4xl px-6 pb-28">
      <div className="text-center">
        <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          Canada &ndash; U.S. trade, at a glance
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Typical attractiveness and risk across product categories, based on TariffCompass data.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
        aria-label="See your own tariff exposure in the dashboard"
      >
        {panels.map((panel) => (
          <div
            key={panel.key}
            className={cn(
              "flex flex-col gap-4 rounded-3xl border border-border/60 p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.10)]",
              panel.data.risk === "Elevated" ? "bg-foreground/[0.03]" : "bg-foreground/[0.01]"
            )}
          >
            <div>
              <p className="text-lg font-medium tracking-tight text-foreground">{panel.title}</p>
              <p className="mt-1 text-xs tracking-wide text-muted-foreground/80">{panel.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <AttractivenessBadge level={panel.data.attractiveness} />
              <RiskBadge level={panel.data.risk} />
            </div>
          </div>
        ))}
      </Link>

      <p className="mt-8 text-center text-xs text-muted-foreground/70">
        Illustrative view based on current TariffCompass attractiveness and risk scores. Not official
        tariff determinations.
      </p>
    </section>
  );
}
