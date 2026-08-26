import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/components/billing/subscribe-button";
import { GenerateBriefSection } from "@/components/onboarding/generate-brief";
import { CANADIAN_PROVINCES } from "@/lib/locations";
import {
  getMarketComparison,
  resolveScenarioDirection,
  type Attractiveness,
  type CostFriction,
} from "@/lib/market-data";
import { SCENARIOS, type Country } from "@/lib/onboarding-data";
import { saveOnboardingSelections } from "@/lib/supabase/save";
import { SUPPORT_PROGRAMS } from "@/lib/support-programs";
import { cn } from "@/lib/utils";

export function ResultsStep({
  country,
  scenario,
  province,
  usState,
  category,
  productName,
  isSubscribed,
  onBack,
}: {
  country: Country;
  scenario: string | null;
  province: string | null;
  usState: string | null;
  category: string | null;
  productName: string;
  isSubscribed: boolean;
  onBack: () => void;
}) {
  const scenarioLabel = SCENARIOS.find((s) => s.id === scenario)?.title;
  const provinceLabel = CANADIAN_PROVINCES.find((p) => p.value === province)?.label;
  const direction = resolveScenarioDirection(scenario);
  const comparisonRows = getMarketComparison(category, scenario);
  const tariffColumnLabel = direction === "export" ? "Export Tariff" : "Import Duty";

  const hasSavedRef = useRef(false);
  useEffect(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;
    saveOnboardingSelections({ scenario, country, province, usState, category, productName });
    // Save once when the user lands on Results; not on every prop change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summaryChips = [scenarioLabel, provinceLabel, category, productName || null].filter(
    (value): value is string => Boolean(value)
  );

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
            {summaryChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border/60 bg-foreground/[0.02] px-4 py-2 text-sm text-muted-foreground"
              >
                {chip}
              </span>
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
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map(({ market, profile }) => (
              <tr
                key={market.key}
                className="border-b border-border/40 transition-colors last:border-0 hover:bg-foreground/[0.012]"
              >
                <td className="px-7 py-6 font-medium text-foreground">{market.name}</td>
                <td className="px-7 py-6 text-foreground">
                  <LockedValue locked={!isSubscribed}>{profile.tariffRate}</LockedValue>
                </td>
                <td className="px-7 py-6">
                  <span className="font-semibold text-foreground">
                    {market.easeOfBusiness.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground"> / 10</span>
                </td>
                <td className="px-7 py-6">
                  <LockedValue locked={!isSubscribed}>
                    <FrictionMeter level={profile.costFriction} />
                  </LockedValue>
                </td>
                <td className="px-7 py-6">
                  <AttractivenessBadge level={profile.attractiveness} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-20 flex flex-col gap-4 sm:hidden">
        {comparisonRows.map(({ market, profile }) => (
          <div
            key={market.key}
            className="rounded-3xl border border-border/60 p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-lg font-medium tracking-tight text-foreground">
                {market.name}
              </span>
              <AttractivenessBadge level={profile.attractiveness} />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-y-3.5 text-sm">
              <dt className="text-muted-foreground">{tariffColumnLabel}</dt>
              <dd className="text-right font-medium text-foreground">
                <LockedValue locked={!isSubscribed}>{profile.tariffRate}</LockedValue>
              </dd>
              <dt className="text-muted-foreground">Ease of Business</dt>
              <dd className="text-right font-medium text-foreground">
                {market.easeOfBusiness.toFixed(1)} / 10
              </dd>
              <dt className="flex items-center text-muted-foreground">Cost / Friction</dt>
              <dd className="flex justify-end">
                <LockedValue locked={!isSubscribed}>
                  <FrictionMeter level={profile.costFriction} />
                </LockedValue>
              </dd>
            </dl>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground/70">
        Figures shown are illustrative estimates for demonstration purposes only and do not
        constitute tariff, legal, or financial advice.
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
          comparisonRows: comparisonRows.map(({ market, profile }) => ({
            market: market.name,
            tariffRate: profile.tariffRate,
            easeOfBusiness: market.easeOfBusiness,
            costFriction: profile.costFriction,
            attractiveness: profile.attractiveness,
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
    </div>
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
