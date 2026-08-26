import { X } from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SubscribeButton } from "@/components/billing/subscribe-button";
import { getRiskStatus, type MarketDataRow, type RiskStatus } from "@/lib/data/market-data";
import { cn } from "@/lib/utils";

const RISK_HINTS: Record<RiskStatus, string> = {
  Elevated: "Current risk is elevated. Click for more details.",
  Watch: "This market should be monitored. Click for more details.",
  Stable: "No major short-term disruption flagged. Click for more details.",
  Uncertain: "Not enough confirmed data. Click for more details.",
};

const NEXT_STEP: Record<RiskStatus, string> = {
  Elevated:
    "Confirm the exact duty treatment for your specific HS code before pricing or committing to this market, and keep at least one lower-risk alternative in view.",
  Watch:
    "Keep an eye on this market's tariff treatment and confirm current figures before finalizing pricing or contracts.",
  Stable:
    "This market currently looks steady for your category — still worth confirming the specifics for your exact product before you commit.",
  Uncertain:
    "Verify the applicable rate with an official source or a trade professional before relying on this market in your planning.",
};

function tariffStatusLine(row: MarketDataRow): string {
  if (row.tariffConfidence === "unknown") {
    return "This tariff figure is currently unavailable — treat it as unresolved, not zero.";
  }
  if (row.tariffConfidence === "estimated") {
    return "This tariff figure is an estimate, not an official determination. Confirm it against the source below before acting on it.";
  }
  return "This figure is sourced from an official reference, current as of the last-updated date below.";
}

function keyRisks(row: MarketDataRow): string[] {
  const risks: string[] = [];
  if (row.tariffConfidence !== "official") {
    risks.push(
      `The tariff figure is ${row.tariffConfidence === "unknown" ? "unresolved" : "an estimate"}, so your actual landed cost may differ.`
    );
  }
  if (row.costFriction !== "Low") {
    risks.push(
      `Cost and friction are rated ${row.costFriction.toLowerCase()} — expect added compliance, logistics, or administrative overhead.`
    );
  }
  if (row.attractiveness === "Challenging" || row.attractiveness === "Fair") {
    risks.push(
      `Overall attractiveness is rated ${row.attractiveness.toLowerCase()} relative to the other markets in your comparison.`
    );
  }
  if (risks.length === 0) {
    risks.push("No elevated risk factors stand out for this market and category right now.");
  }
  return risks;
}

export function RiskBadge({
  level,
  onClick,
}: {
  level: RiskStatus;
  onClick?: () => void;
}) {
  const className = cn(
    "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide",
    level === "Elevated" && "border-transparent bg-foreground text-background",
    level === "Watch" && "border-foreground/30 text-foreground",
    level === "Stable" && "border-border text-muted-foreground",
    level === "Uncertain" && "border-dashed border-border text-muted-foreground/70"
  );

  const badge = onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={cn(className, "transition-transform duration-150 hover:opacity-80 active:scale-95")}
    >
      {level}
    </button>
  ) : (
    <span className={className}>{level}</span>
  );

  return (
    <Tooltip>
      <TooltipTrigger render={badge} />
      <TooltipPortal>
        <TooltipPositioner>
          <TooltipPopup>{RISK_HINTS[level]}</TooltipPopup>
        </TooltipPositioner>
      </TooltipPortal>
    </Tooltip>
  );
}

export function MarketRiskDialog({
  row,
  isSubscribed,
  tariffColumnLabel,
  category,
  onClose,
}: {
  row: MarketDataRow | null;
  isSubscribed: boolean;
  tariffColumnLabel: string;
  category: string | null;
  onClose: () => void;
}) {
  const risk = row ? getRiskStatus(row) : null;

  return (
    <Dialog open={row !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          {row && risk && (
            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex items-start justify-between gap-4 border-b border-border/50 p-7 pb-6">
                <div className="flex flex-col gap-2.5">
                  <DialogTitle>{row.market.name}</DialogTitle>
                  <div>
                    <RiskBadge level={risk} />
                  </div>
                </div>
                <DialogClose className="rounded-full p-1.5 text-muted-foreground/60 transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground">
                  <X className="size-4" />
                </DialogClose>
              </div>

              {isSubscribed ? (
                <div className="flex flex-col gap-6 p-7">
                  <section className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium tracking-wide text-foreground">
                      Current situation
                    </h3>
                    <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                      For {category ?? "your product category"}, {row.market.name} currently shows
                      a {tariffColumnLabel.toLowerCase()} of{" "}
                      <span className="font-medium text-foreground">
                        {row.tariffConfidence === "unknown" ? "Unavailable" : row.tariffRate}
                      </span>
                      , with {row.costFriction.toLowerCase()} cost/friction and an overall rating
                      of {row.attractiveness.toLowerCase()}.
                    </p>
                  </section>

                  <section className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium tracking-wide text-foreground">
                      Why this market is rated this way
                    </h3>
                    <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                      {row.rationale}
                    </p>
                  </section>

                  <section className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium tracking-wide text-foreground">
                      Key risks
                    </h3>
                    <ul className="flex flex-col gap-1.5">
                      {keyRisks(row).map((riskLine, i) => (
                        <li
                          key={i}
                          className="flex gap-2.5 text-[14.5px] leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground/40" />
                          {riskLine}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium tracking-wide text-foreground">
                      Tariff figure status
                    </h3>
                    <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                      {tariffStatusLine(row)}
                    </p>
                  </section>

                  <section className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium tracking-wide text-foreground">
                      Relevant next step
                    </h3>
                    <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                      {NEXT_STEP[risk]}
                    </p>
                  </section>

                  <a
                    href={row.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-medium text-muted-foreground/70 underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-foreground hover:decoration-foreground"
                  >
                    Source: {row.sourceName}
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 p-7 text-center">
                  <p className="text-[15px] leading-relaxed text-muted-foreground">
                    Unlock the full risk breakdown for {row.market.name} — why it&apos;s rated
                    this way, key risks, and a relevant next step.
                  </p>
                  <SubscribeButton label="Upgrade — C$99/month" className="h-11 px-7" />
                </div>
              )}

              <div className="border-t border-border/50 p-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="mx-auto block text-[13px] font-medium tracking-wide text-muted-foreground/80 transition-colors duration-200 hover:text-foreground"
                >
                  Back to Results
                </button>
              </div>
            </div>
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
