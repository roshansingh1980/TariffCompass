import type { TradeMeasureSource } from "@/lib/data/canada-counter-tariffs-2026";
import type { TradeMeasureChange, TradeMeasureChangeStatus } from "@/lib/trade-measure-changes";
import { formatExposureRange } from "@/lib/exposure";

function formatDate(value: string | null): string {
  if (!value) return "Unavailable";
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

export function TradeMeasureChangeCard({ change, status, source }: {
  change: TradeMeasureChange;
  status: TradeMeasureChangeStatus;
  source: TradeMeasureSource | null;
}) {
  return (
    <div className="mt-4 rounded-xl border border-amber-500/20 bg-background/50 px-4 py-4">
      <p className="text-xs font-semibold tracking-wider text-amber-700 uppercase dark:text-amber-300">What changed</p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-4">
        <dt className="text-muted-foreground">Before</dt><dd className="font-medium">{change.previousState.description}</dd>
        <dt className="text-muted-foreground">After</dt><dd className="font-medium">{change.newState.description}</dd>
        <dt className="text-muted-foreground">Announced</dt><dd className="font-medium">{formatDate(change.announcedDate)}</dd>
        <dt className="text-muted-foreground">Effective</dt><dd className="font-medium">{formatDate(change.effectiveDate)}</dd>
        <dt className="text-muted-foreground">Change status</dt><dd className="font-medium capitalize">{status}</dd>
        {change.financialImpact && <><dt className="text-muted-foreground">Estimated incremental annual impact</dt><dd className="font-semibold">{formatExposureRange(change.financialImpact.newAdditionalExposure)}</dd></>}
        <dt className="text-muted-foreground">Source</dt><dd className="font-medium">{source?.name ?? "Unavailable"}</dd>
        <dt className="text-muted-foreground">Confidence</dt><dd className="font-medium capitalize">{change.confidence}</dd>
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">“None recorded” describes this additional measure only. It does not mean the prior base customs duty was 0%. Financial impact is a planning estimate.</p>
    </div>
  );
}
