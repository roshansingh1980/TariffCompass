import { Bell, CalendarClock, CircleDollarSign, Tag } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import {
  CANADA_US_COUNTER_TARIFF_APPLICABILITY_2026,
  CANADA_US_COUNTER_TARIFF_MEASURE_2026,
} from "@/lib/data/canada-counter-tariffs-2026";
import { computeFinancialImpact, formatExposureRange } from "@/lib/exposure";

function formatShortDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ProofStrip() {
  const exampleImpact = computeFinancialImpact({
    annualTradeValue: 250_000,
    currency: "CAD",
    scenario: "import-us",
    hsCode: "851713",
    specificity: "hs",
    rate: 50,
    basis: "additional_measure",
    measureType: "counter_tariff",
    measureStatus: "upcoming",
    confidence: "provisional",
  });

  const metrics = [
    {
      icon: Tag,
      label: "HS-specific measures tracked",
      value: String(CANADA_US_COUNTER_TARIFF_APPLICABILITY_2026.length),
      qualifier: "Canadian counter-tariff",
    },
    {
      icon: CalendarClock,
      label: "Next material change",
      value: formatShortDate(CANADA_US_COUNTER_TARIFF_MEASURE_2026.effectiveFrom!),
      qualifier: "Announced",
    },
    {
      icon: CircleDollarSign,
      label: "Example annual exposure",
      value: exampleImpact ? formatExposureRange(exampleImpact) : "—",
      qualifier: "Incremental",
    },
    {
      icon: Bell,
      label: "Saved exposure monitoring",
      value: "Daily",
      qualifier: "Scheduled check",
    },
  ];

  return (
    <section className="w-full pb-14 sm:pb-16">
      <PublicContainer>
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-background p-2 sm:grid-cols-4">
          {metrics.map(({ icon: Icon, label, value, qualifier }) => (
            <div key={label} className="flex flex-col gap-2 rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon aria-hidden="true" className="size-4" />
                <span className="text-xs">{label}</span>
              </div>
              <p className="text-xl font-semibold tracking-tight text-foreground">
                {value} <span className="text-xs font-medium text-muted-foreground">{qualifier}</span>
              </p>
            </div>
          ))}
        </div>
      </PublicContainer>
    </section>
  );
}
