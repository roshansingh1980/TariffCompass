import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calendar } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import {
  CANADA_US_COUNTER_TARIFF_CHANGE_2026,
  CANADA_US_COUNTER_TARIFF_MEASURE_2026,
  FINANCE_CANADA_COUNTER_TARIFF_ANNOUNCEMENT_SOURCE,
  getTradeMeasureStatus,
} from "@/lib/data/canada-counter-tariffs-2026";
import { computeFinancialImpact, formatExposureRange } from "@/lib/exposure";

const EXAMPLE_ANNUAL_IMPORTS = 250_000;

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

const TRUST_ITEMS = ["Imports & exports", "Official sources", "Financial impact", "Automatic monitoring"];

function ExposureExampleCard() {
  const change = CANADA_US_COUNTER_TARIFF_CHANGE_2026;
  const measure = CANADA_US_COUNTER_TARIFF_MEASURE_2026;
  const status = getTradeMeasureStatus(measure);
  const impact = computeFinancialImpact({
    annualTradeValue: EXAMPLE_ANNUAL_IMPORTS,
    currency: "CAD",
    scenario: "import-us",
    hsCode: change.applicability.hsCode,
    specificity: "hs",
    rate: change.newState.kind === "known_rate" ? change.newState.rate : null,
    basis: "additional_measure",
    measureType: "counter_tariff",
    measureStatus: status,
    confidence: change.confidence,
  });

  return (
    <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold tracking-tight text-foreground">Smartphones — HS 851713</p>
          <p className="mt-1 text-sm text-muted-foreground">U.S. → Canada</p>
        </div>
        <div className="shrink-0 rounded-xl bg-[#C8102E]/[0.06] px-3 py-2 text-right">
          <p className="text-lg font-semibold tracking-tight text-[#C8102E]">+{change.newState.kind === "known_rate" ? change.newState.rate : "—"}%</p>
          <p className="text-[11px] leading-tight text-[#C8102E]/80">Additional counter-tariff</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-lg bg-amber-500/[0.08] px-3 py-2 text-xs font-medium text-amber-800">
        <Calendar aria-hidden="true" className="size-3.5 shrink-0" />
        {status === "upcoming" ? "Upcoming announced measure" : "Announced measure"}
        <span className="ml-auto text-muted-foreground">Effective {formatDate(change.effectiveDate!)}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Annual imports</p>
          <p className="mt-1 text-sm font-semibold text-foreground">CAD {EXAMPLE_ANNUAL_IMPORTS.toLocaleString("en-CA")}</p>
        </div>
        {impact && (
          <div>
            <p className="text-xs text-muted-foreground">Estimated incremental exposure</p>
            <p className="mt-1 text-sm font-semibold text-[#C8102E]">{formatExposureRange(impact)}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
        <span className="capitalize">{change.confidence}</span>
        <a
          href={FINANCE_CANADA_COUNTER_TARIFF_ANNOUNCEMENT_SOURCE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
        >
          {FINANCE_CANADA_COUNTER_TARIFF_ANNOUNCEMENT_SOURCE.name}
          <ArrowUpRight className="size-3" />
        </a>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-b from-[#C8102E]/[0.03] to-transparent pb-16 pt-14 sm:pb-20 sm:pt-20">
      <PublicContainer className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <p className="inline-flex items-center rounded-full bg-[#C8102E]/[0.08] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#C8102E] uppercase">
            Trade-impact intelligence for importers &amp; exporters
          </p>
          <h1 className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            Tariffs changed.
            <br />
            <span className="text-[#C8102E]">Know what it means</span>
            <br />
            for your business.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            TariffCompass monitors trade-policy changes, identifies what affects your products,
            quantifies the financial impact, and helps you decide what to investigate next.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-[#C8102E] px-7 text-[15px] font-medium tracking-tight text-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B00E29] hover:shadow-[0_8px_24px_-8px_rgba(200,16,46,0.4)]"
            >
              Analyze my exposure
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/hs-lookup"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border/70 px-7 text-[15px] font-medium tracking-tight text-foreground transition-colors duration-200 hover:bg-foreground/[0.03]"
            >
              Check an HS code
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            {TRUST_ITEMS.map((item, i) => (
              <span key={item} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-[#C8102E]/60" />}
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ExposureExampleCard />
        </div>
      </PublicContainer>
    </section>
  );
}
