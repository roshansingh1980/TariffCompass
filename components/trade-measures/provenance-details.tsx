import type { ProvenanceConfidence, TradeMeasureSource } from "@/lib/data/canada-counter-tariffs-2026";

const AUTHORITY_LABELS: Record<TradeMeasureSource["authorityTier"], string> = {
  legal: "Legal / operative source",
  administrative: "Administrative implementation source",
  official_announcement: "Official government announcement",
};

const CONFIDENCE_LABELS: Record<ProvenanceConfidence, string> = {
  verified: "Verified operative treatment",
  provisional: "Provisional — official announcement verified",
  limited: "Limited coverage",
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

export function ProvenanceDetails({ source, confidence }: {
  source: TradeMeasureSource | null;
  confidence: ProvenanceConfidence;
}) {
  return (
    <details className="mt-4 border-t border-amber-500/20 pt-3 text-xs text-muted-foreground">
      <summary className="cursor-pointer font-medium text-foreground">Why we trust this</summary>
      <dl className="mt-3 grid gap-1 sm:grid-cols-[auto_1fr] sm:gap-x-3">
        <dt>Authority</dt><dd>{source ? AUTHORITY_LABELS[source.authorityTier] : "Not verified"}</dd>
        <dt>Confidence</dt><dd>{CONFIDENCE_LABELS[confidence]}</dd>
        <dt>Retrieved</dt><dd>{source ? formatDate(source.retrievedAt) : "Unavailable"}</dd>
      </dl>
      {source?.statusNote && <p className="mt-2 leading-relaxed">{source.statusNote}</p>}
      {source && (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-medium text-foreground underline underline-offset-2">
          Open official source
        </a>
      )}
    </details>
  );
}
