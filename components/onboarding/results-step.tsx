import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Lock, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/components/billing/subscribe-button";
import { GenerateBriefSection } from "@/components/onboarding/generate-brief";
import { MarketRiskDialog, RiskBadge } from "@/components/onboarding/market-risk-dialog";
import { CANADIAN_PROVINCES } from "@/lib/locations";
import {
  getMarketDataRows,
  getRiskStatus,
  resolveScenarioDirection,
  type Attractiveness,
  type CostFriction,
  type MarketDataRow,
} from "@/lib/data/market-data";
import { SCENARIOS, type Country } from "@/lib/onboarding-data";
import { saveOnboardingSelections } from "@/lib/supabase/save";
import { SUPPORT_PROGRAMS } from "@/lib/support-programs";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ResultsStep({
  country,
  scenario,
  province,
  usState,
  category,
  productName,
  isSubscribed,
  onBack,
  onEditStep,
}: {
  country: Country;
  scenario: string | null;
  province: string | null;
  usState: string | null;
  category: string | null;
  productName: string;
  isSubscribed: boolean;
  onBack: () => void;
  onEditStep: (step: "scenario" | "location" | "product") => void;
}) {
  const scenarioLabel = SCENARIOS.find((s) => s.id === scenario)?.title;
  const provinceLabel = CANADIAN_PROVINCES.find((p) => p.value === province)?.label;
  const direction = resolveScenarioDirection(scenario);
  const comparisonRows = getMarketDataRows(category, scenario);
  const tariffColumnLabel = direction === "export" ? "Export Tariff" : "Import Duty";
  const dataLastUpdated = comparisonRows[0]?.lastUpdated;
  const supportLastChecked = SUPPORT_PROGRAMS.reduce(
    (latest, program) => (program.lastChecked > latest ? program.lastChecked : latest),
    SUPPORT_PROGRAMS[0]?.lastChecked ?? ""
  );

  const [detailsRow, setDetailsRow] = useState<MarketDataRow | null>(null);

  const hasSavedRef = useRef(false);
  useEffect(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;
    saveOnboardingSelections({ scenario, country, province, usState, category, productName });
    // Save once when the user lands on Results; not on every prop change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  type SummaryChip = { label: string; step: "scenario" | "location" | "product" };
  const summaryChips: SummaryChip[] = [
    scenarioLabel && { label: scenarioLabel, step: "scenario" },
    provinceLabel && { label: provinceLabel, step: "location" },
    category && { label: category, step: "product" },
    productName && { label: productName, step: "product" },
  ].filter((chip): chip is SummaryChip => Boolean(chip));

  return (
    <div className="w-full max-w-5xl">
      <div className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Your market comparison
        </h1>
        <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
          {direction === "export"
            ? "Comparing where you could sell, based on your selections below."
            : "Comparing where you could source from, based on your selections below."}
        </p>

        {summaryChips.length > 0 && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {summaryChips.map((chip, i) => (
              <button
                key={`${chip.step}-${i}`}
                type="button"
                onClick={() => onEditStep(chip.step)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-foreground/[0.02] px-4 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/[0.05] hover:text-foreground active:scale-[0.97]"
              >
                {chip.label}
                <Pencil className="size-3 text-muted-foreground/40 transition-colors duration-200 group-hover:text-foreground/60" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="mt-20 hidden overflow-hidden rounded-3xl border border-border/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border/60 bg-foreground/[0.015]">
              <th className="px-7 py-5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Market
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {tariffColumnLabel}
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Ease of Business
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Cost / Friction
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Overall Attractiveness
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Current Risk
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr
                key={row.market.key}
                className="border-b border-border/40 transition-colors last:border-0 hover:bg-foreground/[0.012]"
              >
                <td className="px-7 py-6 font-medium text-foreground">{row.market.name}</td>
                <td className="px-7 py-6 text-foreground">
                  <LockedValue locked={!isSubscribed}>
                    <TariffValue row={row} />
                  </LockedValue>
                </td>
                <td className="px-7 py-6">
                  <span className="font-semibold text-foreground">
                    {row.market.easeOfBusiness.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground"> / 10</span>
                </td>
                <td className="px-7 py-6">
                  <LockedValue locked={!isSubscribed}>
                    <FrictionMeter level={row.costFriction} />
                  </LockedValue>
                </td>
                <td className="px-7 py-6">
                  <AttractivenessBadge level={row.attractiveness} />
                </td>
                <td className="px-7 py-6">
                  <RiskBadge level={getRiskStatus(row)} onClick={() => setDetailsRow(row)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-20 flex flex-col gap-4 sm:hidden">
        {comparisonRows.map((row) => (
          <div
            key={row.market.key}
            className="rounded-3xl border border-border/60 p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-lg font-medium tracking-tight text-foreground">
                {row.market.name}
              </span>
              <AttractivenessBadge level={row.attractiveness} />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-y-3.5 text-sm">
              <dt className="text-muted-foreground">{tariffColumnLabel}</dt>
              <dd className="text-right font-medium text-foreground">
                <LockedValue locked={!isSubscribed}>
                  <TariffValue row={row} />
                </LockedValue>
              </dd>
              <dt className="text-muted-foreground">Ease of Business</dt>
              <dd className="text-right font-medium text-foreground">
                {row.market.easeOfBusiness.toFixed(1)} / 10
              </dd>
              <dt className="flex items-center text-muted-foreground">Cost / Friction</dt>
              <dd className="flex justify-end">
                <LockedValue locked={!isSubscribed}>
                  <FrictionMeter level={row.costFriction} />
                </LockedValue>
              </dd>
              <dt className="flex items-center text-muted-foreground">Current Risk</dt>
              <dd className="flex justify-end">
                <RiskBadge level={getRiskStatus(row)} onClick={() => setDetailsRow(row)} />
              </dd>
            </dl>
          </div>
        ))}
      </div>

      {dataLastUpdated && (
        <p className="mt-8 text-center text-xs text-muted-foreground/60">
          Rates and scores are based on the latest available data. Last updated{" "}
          {formatDate(dataLastUpdated)}. Sources: official trade publications and current program
          pages.
        </p>
      )}

      <p className="mt-3 text-center text-xs text-muted-foreground/70">
        Disclaimer: TariffCompass provides general information and estimates only. It is not
        legal, tax, customs, or financial advice. Tariff rates, trade rules, logistics costs, and
        government programs can change. Always verify details with official sources or a
        qualified professional before making business decisions.
      </p>

      {!isSubscribed && (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-foreground/[0.02] p-7 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[15px] font-medium tracking-tight text-foreground">
            Unlock full tariff details and generate your brief — C$99/month
          </p>
          <SubscribeButton label="Upgrade" className="h-11 shrink-0 px-7" />
        </div>
      )}

      {/* Government Support Options */}
      <div className="mt-28">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Government Support Options
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Real federal and Crown-corporation programs that may be relevant to your trade
          situation.
        </p>
        <p className="mt-2 text-sm text-muted-foreground/70">
          {country === "US" &&
            "These are Government of Canada programs — since you've selected United States, most won't apply directly to a U.S.-based business. "}
          This is general guidance, not eligibility confirmation, application support, or
          financial advice. Program details and eligibility change — confirm everything on the
          official page before acting.
        </p>
        {supportLastChecked && (
          <p className="mt-1 text-xs text-muted-foreground/60">
            Program details last checked {formatDate(supportLastChecked)}.
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {SUPPORT_PROGRAMS.map((program) => (
            <div
              key={program.name}
              className="flex h-full flex-col gap-3 rounded-3xl border border-border/60 p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.10)]"
            >
              <span className="font-medium tracking-tight text-foreground">{program.name}</span>
              <LockedValue
                locked={!isSubscribed}
                showIcon={false}
                className="flex flex-1 flex-col items-start gap-3"
              >
                <span className="text-sm text-muted-foreground">{program.description}</span>
                <div className="text-sm">
                  <span className="font-medium text-foreground">Who it&apos;s for: </span>
                  <span className="text-muted-foreground">{program.whoItsFor}</span>
                </div>
                {direction === "import" && program.importCaveat && (
                  <div className="rounded-xl bg-foreground/[0.03] px-3.5 py-2.5 text-xs text-muted-foreground">
                    {program.importCaveat}
                  </div>
                )}
                <a
                  href={program.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Learn more
                  <ArrowUpRight className="size-3.5" />
                </a>
              </LockedValue>
            </div>
          ))}
        </div>
      </div>

      <GenerateBriefSection
        isSubscribed={isSubscribed}
        input={{
          scenarioLabel: scenarioLabel ?? null,
          country,
          province: provinceLabel ?? province,
          usState,
          category,
          productName,
          tariffColumnLabel,
          comparisonRows: comparisonRows.map((row) => ({
            market: row.market.name,
            tariffRate: row.tariffRate,
            tariffConfidence: row.tariffConfidence,
            easeOfBusiness: row.market.easeOfBusiness,
            costFriction: row.costFriction,
            attractiveness: row.attractiveness,
          })),
        }}
      />

      <div className="mt-20 flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="h-12 rounded-full px-8 text-[15px] font-medium tracking-tight text-muted-foreground hover:text-foreground"
        >
          Back
        </Button>
      </div>

      <MarketRiskDialog
        row={detailsRow}
        isSubscribed={isSubscribed}
        tariffColumnLabel={tariffColumnLabel}
        category={category}
        onClose={() => setDetailsRow(null)}
      />
    </div>
  );
}

function TariffValue({ row }: { row: MarketDataRow }) {
  if (row.tariffConfidence === "unknown") {
    return <span className="text-muted-foreground">Unavailable</span>;
  }
  return (
    <span>
      {row.tariffRate}
      {row.tariffConfidence === "estimated" && (
        <span className="ml-1 text-[11px] font-normal text-muted-foreground/60">est.</span>
      )}
    </span>
  );
}

function FrictionMeter({ level }: { level: CostFriction }) {
  const filled = level === "Low" ? 1 : level === "Medium" ? 2 : 3;
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((segment) => (
          <span
            key={segment}
            className={cn(
              "h-1.5 w-6 rounded-full",
              segment <= filled ? "bg-foreground/70" : "bg-border"
            )}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">{level}</span>
    </div>
  );
}

function LockedValue({
  locked,
  children,
  className,
  showIcon = true,
}: {
  locked: boolean;
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
}) {
  if (!locked) return <>{children}</>;
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="select-none blur-[4px]" aria-hidden="true">
        {children}
      </span>
      {showIcon && <Lock className="size-3 shrink-0 text-muted-foreground/40" />}
    </span>
  );
}

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
