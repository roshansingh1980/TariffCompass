import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Lock, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubscribeButton } from "@/components/billing/subscribe-button";
import { GenerateBriefSection } from "@/components/onboarding/generate-brief";
import type { Currency } from "@/components/onboarding/exposure-step";
import { MarketRiskDialog, RiskBadge, type DialogFocus } from "@/components/onboarding/market-risk-dialog";
import { firstSentence, MaskedSection } from "@/components/onboarding/masked-section";
import { ChipSelect } from "@/components/onboarding/chip-select";
import {
  Tooltip,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CANADIAN_PROVINCES } from "@/lib/locations";
import {
  getDataStatus,
  getMarketDataRows,
  getRiskStatus,
  resolveScenarioDirection,
  type Attractiveness,
  type CostFriction,
  type MarketDataRow,
} from "@/lib/data/db-market-data";
import { getSupportPrograms, type SupportProgram } from "@/lib/data/db-support-programs";
import { ProvenanceDetails } from "@/components/trade-measures/provenance-details";
import { TradeMeasureChangeCard } from "@/components/trade-measures/change-card";
import {
  findCanadianCounterTariff,
  findCanadianCounterTariffChange,
  calendarDateInTimeZone,
  getTradeMeasureStatus,
} from "@/lib/data/canada-counter-tariffs-2026";
import { computeFinancialImpact, formatExposureRange } from "@/lib/exposure";
import { formatHsCode } from "@/lib/hs-code";
import { CATEGORIES, SCENARIOS, type Country } from "@/lib/onboarding-data";
import { savePendingWizardState } from "@/lib/pending-wizard";
import { recordAnalysis } from "@/lib/supabase/analyses";
import { attachIncrementalFinancialImpact, getTradeMeasureChangeStatus } from "@/lib/trade-measure-changes";
import { saveOnboardingSelections } from "@/lib/supabase/save";
import { deleteProfile, saveProfile } from "@/lib/supabase/saved-profiles";
import type { SavedProfile } from "@/types/database";
import { cn } from "@/lib/utils";
import { buildPracticalResponseIntelligence } from "@/lib/response-intelligence";
import { PracticalResponsePanel } from "@/components/onboarding/practical-response-panel";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatRate(rate: number): string {
  return `${Number(rate.toFixed(1))}%`;
}

export function ResultsStep({
  country,
  scenario,
  province,
  usState,
  category,
  productName,
  annualValue,
  currency,
  hsCode,
  isLoggedIn,
  isSubscribed,
  savedProfiles,
  onSavedProfilesChange,
  onBack,
  onEditStep,
  onScenarioChange,
  onProvinceChange,
  onCategoryChange,
}: {
  country: Country;
  scenario: string | null;
  province: string | null;
  usState: string | null;
  category: string | null;
  productName: string;
  annualValue: string;
  currency: string;
  hsCode: string;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  savedProfiles: SavedProfile[];
  onSavedProfilesChange: () => void | Promise<void>;
  onBack: () => void;
  onEditStep: (step: "scenario" | "location" | "product" | "exposure") => void;
  onScenarioChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}) {
  const scenarioLabel = SCENARIOS.find((s) => s.id === scenario)?.title;
  const provinceLabel = CANADIAN_PROVINCES.find((p) => p.value === province)?.label;
  const direction = resolveScenarioDirection(scenario);
  const tariffColumnLabel = direction === "export" ? "Export Tariff" : "Import Duty";

  const [detailsRow, setDetailsRow] = useState<{ row: MarketDataRow; focus: DialogFocus } | null>(
    null
  );

  const [comparisonRows, setComparisonRows] = useState<MarketDataRow[] | null>(null);
  const [rowsError, setRowsError] = useState<string | null>(null);
  const [supportPrograms, setSupportPrograms] = useState<SupportProgram[] | null>(null);
  const [programsError, setProgramsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setComparisonRows(null);
    setRowsError(null);
    getMarketDataRows(category, scenario, hsCode)
      .then((rows) => {
        if (!cancelled) setComparisonRows(rows);
      })
      .catch((err) => {
        console.error("Failed to load market comparison data:", err);
        if (!cancelled) setRowsError("Couldn't load the market comparison. Please try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [category, scenario, hsCode]);

  useEffect(() => {
    let cancelled = false;
    getSupportPrograms()
      .then((programs) => {
        if (!cancelled) setSupportPrograms(programs);
      })
      .catch((err) => {
        console.error("Failed to load support programs:", err);
        if (!cancelled) setProgramsError("Couldn't load government support programs.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const dataLastUpdated = comparisonRows?.[0]?.lastUpdated;
  const usRow = comparisonRows?.find((row) => row.market.key === "us");
  const hsSpecificRows = comparisonRows?.filter((row) => row.specificity === "hs") ?? [];
  const parsedAnnualValue = Number(annualValue);
  const upcomingCounterTariff = findCanadianCounterTariff({ hsCode, scenario });
  const counterTariffStatus = upcomingCounterTariff
    ? getTradeMeasureStatus(upcomingCounterTariff.measure)
    : null;
  const currentImpact = usRow
    ? computeFinancialImpact({
        annualTradeValue: Number.isFinite(parsedAnnualValue) ? parsedAnnualValue : null,
        currency, scenario, hsCode: hsCode.trim() || null,
        specificity: usRow.specificity, rate: usRow.tariffRate,
        basis: "current_or_base", measureType: null, measureStatus: "current",
        confidence: usRow.tariffConfidence,
      })
    : null;
  const additionalImpact = upcomingCounterTariff
    ? computeFinancialImpact({
        annualTradeValue: Number.isFinite(parsedAnnualValue) ? parsedAnnualValue : null,
        currency, scenario, hsCode: upcomingCounterTariff.applicability.hsCode,
        specificity: "hs", rate: upcomingCounterTariff.applicability.additionalRate,
        basis: "additional_measure", measureType: upcomingCounterTariff.measure.measureType,
        measureStatus: counterTariffStatus, confidence: upcomingCounterTariff.measure.confidence,
      })
    : null;
  const currentCanadianDate = calendarDateInTimeZone(new Date(), "America/Toronto");
  const baseChange = upcomingCounterTariff ? findCanadianCounterTariffChange(upcomingCounterTariff) : null;
  const tradeMeasureChange = baseChange
    ? attachIncrementalFinancialImpact(baseChange, Number.isFinite(parsedAnnualValue) ? parsedAnnualValue : null, currency, scenario, currentCanadianDate)
    : null;
  const tradeMeasureChangeStatus = tradeMeasureChange
    ? getTradeMeasureChangeStatus(tradeMeasureChange, currentCanadianDate)
    : null;
  const supportLastChecked = supportPrograms?.reduce(
    (latest, program) => (program.lastChecked > latest ? program.lastChecked : latest),
    supportPrograms[0]?.lastChecked ?? ""
  );
  const practicalResponse = buildPracticalResponseIntelligence({
    hsCode: hsCode.trim() || null,
    productDescription: productName || null,
    scenario,
    annualIncrementalExposure: additionalImpact?.incrementalExposureMax ?? null,
    currency: currency || null,
    comparisonRows: comparisonRows ?? [],
  });

  useEffect(() => {
    // Anonymous visitors write nothing to the database — their answers stay
    // in client state until they have a real account (see lib/pending-wizard.ts
    // for how that state survives the /signup or /login round-trip).
    if (!isLoggedIn) return;
    saveOnboardingSelections({ scenario, country, province, usState, category, productName });
    // Re-save whenever a filter changes inline — ResultsStep now stays
    // mounted across edits instead of remounting on step navigation.
  }, [isLoggedIn, scenario, country, province, usState, category, productName]);

  useEffect(() => {
    // Logs one history row per meaningful change, not per keystroke —
    // debounced the same way a "save on settle" field would be.
    if (!isLoggedIn || !usRow || !currentImpact || !comparisonRows) return;
    const timer = setTimeout(() => {
      recordAnalysis({
        category,
        hsCode: hsCode.trim() || null,
        annualValue: parsedAnnualValue,
        currency: currency || null,
        destinationCountry: usRow.market.key,
        computedRateMin: currentImpact.rateMin,
        computedRateMax: currentImpact.rateMax,
        exposureLow: currentImpact.grossExposureMin,
        exposureMid: null,
        exposureHigh: currentImpact.grossExposureMax,
        rateSnapshot: { comparisonRows, currentImpact, additionalImpact, tradeMeasure: upcomingCounterTariff, tradeMeasureChange },
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [
    isLoggedIn,
    comparisonRows,
    category,
    hsCode,
    parsedAnnualValue,
    currency,
    usRow?.market.key,
    usRow?.tariffRate,
    currentImpact,
    additionalImpact,
    upcomingCounterTariff,
    tradeMeasureChange,
    usRow,
  ]);

  return (
    <TooltipProvider delay={150}>
    <div className="w-full max-w-5xl">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Your market comparison
        </h1>
        <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
          {direction === "export"
            ? "Comparing where you could sell, based on your selections below."
            : "Comparing where you could source from, based on your selections below."}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <ChipSelect
            value={scenario}
            options={SCENARIOS.map((s) => ({ value: s.id, label: s.title }))}
            placeholder="Choose a scenario"
            onChange={onScenarioChange}
          />
          <ChipSelect
            value={province}
            options={CANADIAN_PROVINCES.map((p) => ({ value: p.value, label: p.label }))}
            placeholder="Choose a province"
            onChange={onProvinceChange}
          />
          <ChipSelect
            value={category}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            placeholder="Choose a category"
            onChange={onCategoryChange}
          />
          {productName && (
            <button
              type="button"
              onClick={() => onEditStep("product")}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-foreground/[0.02] px-4 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/[0.05] hover:text-foreground active:scale-[0.97]"
            >
              {productName}
              <Pencil className="size-3 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
            </button>
          )}
          {hsCode && (
            <button
              type="button"
              onClick={() => onEditStep("product")}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-foreground/[0.02] px-4 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/[0.05] hover:text-foreground active:scale-[0.97]"
            >
              HS {formatHsCode(hsCode)}
              <Pencil className="size-3 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
            </button>
          )}
        </div>

        {comparisonRows && (
          <div className="mx-auto mt-7 max-w-2xl rounded-2xl border border-border/60 bg-foreground/[0.015] px-5 py-4 text-left">
            <p className="text-sm font-medium text-foreground">
              {hsCode && hsSpecificRows.length > 0 ? "HS-specific analysis" : "Category-level estimate"}
              {hsCode && <span className="ml-2 text-muted-foreground">HS {formatHsCode(hsCode)}</span>}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {hsCode && hsSpecificRows.length > 0
                ? `${hsSpecificRows.length} of ${comparisonRows.length} routes use verified HS-specific coverage. Routes without a matching HS row remain clearly labelled category estimates.`
                : hsCode
                  ? "TariffCompass does not yet have verified HS-specific coverage for this product and route set, so these results use broader category data."
                  : "No HS code was provided, so these results use broader category data. Add a confirmed HS code for product-specific matching where coverage exists."}
            </p>
          </div>
        )}

        {currentImpact && (
          <section className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border/60 bg-foreground/[0.02] px-5 py-5 text-left">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Estimated annual tariff exposure
            </p>
            <LockedValue locked={!isSubscribed}>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {formatExposureRange(currentImpact)}
              </p>
            </LockedValue>
            <p className="mt-2 text-sm text-muted-foreground">
              Based on {currentImpact.currency} {Math.round(currentImpact.annualTradeValue).toLocaleString("en-CA")} annual trade value × {currentImpact.rateMin === currentImpact.rateMax ? formatRate(currentImpact.rateMin) : `${formatRate(currentImpact.rateMin)}–${formatRate(currentImpact.rateMax)}`} {currentImpact.specificity === "category" ? "category treatment" : "HS-specific treatment"}.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {currentImpact.specificity === "category" ? "Category-level estimate" : "HS-specific estimate"} · Planning estimate — not a customs-duty determination.
            </p>
          </section>
        )}

        {upcomingCounterTariff && (
          <section className="mx-auto mt-6 max-w-2xl rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] px-5 py-5 text-left">
            <p className="text-xs font-semibold tracking-wider text-amber-700 uppercase dark:text-amber-300">
              {counterTariffStatus === "upcoming" ? "Upcoming announced measure" : "Current announced measure"}
            </p>
            <h2 className="mt-2 text-base font-semibold text-foreground">
              HS {formatHsCode(upcomingCounterTariff.applicability.hsCode)} — {upcomingCounterTariff.applicability.productDescription}
            </h2>
            <dl className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-[auto_1fr] sm:gap-x-3">
              <dt>Additional Canadian counter-tariff</dt>
              <dd className="font-medium text-foreground">{formatRate(upcomingCounterTariff.applicability.additionalRate)}</dd>
              <dt>Effective</dt>
              <dd className="font-medium text-foreground">{upcomingCounterTariff.measure.effectiveFrom ? formatDate(upcomingCounterTariff.measure.effectiveFrom) : "Not verified"}</dd>
              <dt>Status</dt>
              <dd className="font-medium text-foreground capitalize">{counterTariffStatus}</dd>
              <dt>Measure type</dt>
              <dd className="font-medium text-foreground">Additional counter-tariff</dd>
              <dt>Canadian tariff item</dt>
              <dd className="font-medium text-foreground">{upcomingCounterTariff.applicability.nationalTariffItem}</dd>
              <dt>Confidence</dt>
              <dd className="font-medium text-foreground">Provisional — official announcement verified</dd>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Applies to qualifying U.S.-origin goods. This is an additional countermeasure, not a
              verified all-in customs-duty rate; confirm classification, origin and treatment with
              a customs professional.
            </p>
            {tradeMeasureChange && tradeMeasureChangeStatus && (
              <TradeMeasureChangeCard
                change={tradeMeasureChange}
                status={tradeMeasureChangeStatus}
                source={upcomingCounterTariff.sources.find((source) => tradeMeasureChange.sourceIds.includes(source.id)) ?? null}
              />
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Source:{" "}
              <a
                href={upcomingCounterTariff.sources[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-2"
              >
                {upcomingCounterTariff.sources[0]?.name ?? "Source unavailable"}
              </a>
              {" · "}Reviewed {formatDate(upcomingCounterTariff.measure.reviewedAt)}
            </p>
            <ProvenanceDetails source={upcomingCounterTariff.sources[0] ?? null} confidence={upcomingCounterTariff.measure.confidence} />
          </section>
        )}

        <SavedProfilesPanel
          isLoggedIn={isLoggedIn}
          isSubscribed={isSubscribed}
          savedProfiles={savedProfiles}
          onSavedProfilesChange={onSavedProfilesChange}
          currentSelections={{
            scenario,
            country,
            province,
            usState,
            category,
            productName,
            annualValue,
            currency,
            hsCode,
          }}
        />
      </div>

      {rowsError && (
        <div className="mt-20 rounded-3xl border border-destructive/30 bg-destructive/[0.03] p-8 text-center">
          <p className="text-[15px] font-medium text-destructive">{rowsError}</p>
        </div>
      )}

      {!rowsError && !comparisonRows && (
        <div className="mt-20 flex flex-col items-center gap-3 rounded-3xl border border-border/60 p-16 text-center">
          <div className="size-6 animate-spin rounded-full border-2 border-border border-t-foreground/60" />
          <p className="text-sm text-muted-foreground">Loading your market comparison…</p>
        </div>
      )}

      {comparisonRows && (
        <>
          {/* Desktop table */}
          <div className="mt-12 hidden overflow-hidden rounded-2xl border border-border/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:block">
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
                    <td className="px-7 py-4 font-medium text-foreground">{row.market.name}</td>
                    <td className="px-7 py-4 text-foreground">
                      <TariffValue row={row} />
                      <DataStatusLine row={row} />
                    </td>
                    <td className="px-7 py-4">
                      <span className="font-semibold text-foreground">
                        {row.market.easeOfBusiness.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground"> / 10</span>
                    </td>
                    <td className="px-7 py-4">
                      <FrictionMeter
                        level={row.costFriction}
                        onClick={() => setDetailsRow({ row, focus: "friction" })}
                      />
                    </td>
                    <td className="px-7 py-4">
                      <AttractivenessBadge
                        level={row.attractiveness}
                        onClick={() => setDetailsRow({ row, focus: "risk" })}
                      />
                    </td>
                    <td className="px-7 py-4">
                      <RiskBadge
                        level={getRiskStatus(row)}
                        onClick={() => setDetailsRow({ row, focus: "risk" })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-10 flex flex-col gap-3 sm:hidden">
            {comparisonRows.map((row) => (
              <div
                key={row.market.key}
                className="rounded-3xl border border-border/60 p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-medium tracking-tight text-foreground">
                    {row.market.name}
                  </span>
                  <AttractivenessBadge
                    level={row.attractiveness}
                    onClick={() => setDetailsRow({ row, focus: "risk" })}
                  />
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-y-3.5 text-sm">
                  <dt className="text-muted-foreground">{tariffColumnLabel}</dt>
                  <dd className="text-right font-medium text-foreground">
                    <TariffValue row={row} />
                  </dd>
                  <dt className="text-muted-foreground">Ease of Business</dt>
                  <dd className="text-right font-medium text-foreground">
                    {row.market.easeOfBusiness.toFixed(1)} / 10
                  </dd>
                  <dt className="flex items-center text-muted-foreground">Cost / Friction</dt>
                  <dd className="flex justify-end">
                    <FrictionMeter
                      level={row.costFriction}
                      onClick={() => setDetailsRow({ row, focus: "friction" })}
                    />
                  </dd>
                  <dt className="flex items-center text-muted-foreground">Current Risk</dt>
                  <dd className="flex justify-end">
                    <RiskBadge
                      level={getRiskStatus(row)}
                      onClick={() => setDetailsRow({ row, focus: "risk" })}
                    />
                  </dd>
                </dl>
                <DataStatusLine row={row} className="mt-3" />
              </div>
            ))}
          </div>
        </>
      )}

      {dataLastUpdated && (
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Rates and scores are based on the latest available data. Last updated{" "}
          {formatDate(dataLastUpdated)}. Sources: official trade publications and current program
          pages.
        </p>
      )}

      {comparisonRows && <PracticalResponsePanel intelligence={practicalResponse} />}

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Disclaimer: TariffCompass provides general information and estimates only. It is not
        legal, tax, customs, or financial advice. Tariff rates, trade rules, logistics costs, and
        government programs can change. Always verify details with official sources or a
        qualified professional before making business decisions.
      </p>

      {!isSubscribed && (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-foreground/[0.02] p-7 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[15px] font-medium tracking-tight text-foreground">
            Unlock dollar exposure, the reasoning behind each rating, and full program details —
            C$99/month
          </p>
          <SubscribeButton label="Upgrade" className="h-11 shrink-0 px-7" />
        </div>
      )}

      {/* Government Support Options */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Government Support Options
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Real federal and Crown-corporation programs that may be relevant to your trade
          situation.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This is general guidance, not eligibility confirmation, application support, or
          financial advice. Program details and eligibility change — confirm everything on the
          official page before acting.
        </p>
        {supportLastChecked && (
          <p className="mt-1 text-xs text-muted-foreground">
            Program details last checked {formatDate(supportLastChecked)}.
          </p>
        )}

        {programsError && (
          <p className="mt-10 text-sm text-destructive">{programsError}</p>
        )}
        {!programsError && !supportPrograms && (
          <p className="mt-10 text-sm text-muted-foreground">Loading government programs…</p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {supportPrograms?.map((program) => (
            <div
              key={program.name}
              className="flex h-full flex-col gap-3 rounded-2xl border border-border/60 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.10)]"
            >
              <span className="font-medium tracking-tight text-foreground">{program.name}</span>
              {isSubscribed ? (
                <div className="flex flex-1 flex-col items-start gap-3">
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
                </div>
              ) : (
                <MaskedSection
                  heading="Program details"
                  preview={firstSentence(program.description)}
                  className="flex-1"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {comparisonRows && (
        <GenerateBriefSection
          isLoggedIn={isLoggedIn}
          isSubscribed={isSubscribed}
          wizardSelections={{
            scenario,
            country,
            province,
            usState,
            category,
            productName,
            annualValue,
            currency: currency as Currency,
            hsCode,
          }}
          input={{
            scenarioLabel: scenarioLabel ?? null,
            country,
            province: provinceLabel ?? province,
            usState,
            category,
            productName,
            tariffColumnLabel,
            annualValue: Number.isFinite(parsedAnnualValue) && parsedAnnualValue > 0 ? parsedAnnualValue : null,
            currency: currency || null,
            hsCode: hsCode.trim() || null,
            comparisonRows: comparisonRows.map((row) => ({
              market: row.market.name,
              tariffRate: row.tariffRate,
              tariffConfidence: row.tariffConfidence,
              specificity: row.specificity,
              hsCode: row.hsCode,
              easeOfBusiness: row.market.easeOfBusiness,
              costFriction: row.costFriction,
              attractiveness: row.attractiveness,
            })),
            programs: (supportPrograms ?? []).map((p) => ({ name: p.name, href: p.href })),
            tradeMeasure: upcomingCounterTariff && counterTariffStatus
              ? { ...upcomingCounterTariff, status: counterTariffStatus }
              : null,
            financialImpacts: [currentImpact, additionalImpact].filter(
              (impact): impact is NonNullable<typeof impact> => impact !== null
            ),
            tradeMeasureChange,
          }}
        />
      )}

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
        row={detailsRow?.row ?? null}
        focus={detailsRow?.focus ?? "risk"}
        isSubscribed={isSubscribed}
        tariffColumnLabel={tariffColumnLabel}
        category={category}
        onClose={() => setDetailsRow(null)}
      />
    </div>
    </TooltipProvider>
  );
}

function SavedProfilesPanel({
  isLoggedIn,
  isSubscribed,
  savedProfiles,
  onSavedProfilesChange,
  currentSelections,
}: {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  savedProfiles: SavedProfile[];
  onSavedProfilesChange: () => void | Promise<void>;
  currentSelections: {
    scenario: string | null;
    country: Country;
    province: string | null;
    usState: string | null;
    category: string | null;
    productName: string;
    annualValue: string;
    currency: string;
    hsCode: string;
  };
}) {
  const [isNaming, setIsNaming] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <Link
        href="/signup"
        onClick={() =>
          savePendingWizardState({
            scenario: currentSelections.scenario,
            country: currentSelections.country,
            province: currentSelections.province,
            usState: currentSelections.usState,
            category: currentSelections.category,
            productName: currentSelections.productName,
            annualValue: currentSelections.annualValue,
            currency: currentSelections.currency as Currency,
            hsCode: currentSelections.hsCode,
          })
        }
        className="mt-7 text-xs font-medium tracking-wide text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Create a free account to save this profile
      </Link>
    );
  }

  async function handleSave() {
    setError(null);
    setConfirmation(null);
    setIsSaving(true);
    const parsedAnnualValue = Number(currentSelections.annualValue);
    const result = await saveProfile({
      name,
      scenario: currentSelections.scenario,
      country: currentSelections.country,
      province: currentSelections.province,
      usState: currentSelections.usState,
      category: currentSelections.category,
      annualValue: Number.isFinite(parsedAnnualValue) && parsedAnnualValue > 0 ? parsedAnnualValue : null,
      currency: currentSelections.currency || null,
      hsCode: currentSelections.hsCode.trim() || null,
      productDescription: currentSelections.productName,
    });
    setIsSaving(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setName("");
    setIsNaming(false);
    setConfirmation(result.monitoringActive && isSubscribed
      ? "Saved for monitoring. TariffCompass will check this exposure against structured trade-policy changes when you open or refresh the dashboard."
      : "Profile saved. Monitoring alerts are available with an active Business subscription after monitoring storage is enabled.");
    await onSavedProfilesChange();
  }

  async function handleDelete(id: string) {
    await deleteProfile(id);
    onSavedProfilesChange();
  }

  return (
    <div className="mt-7 flex flex-col items-center gap-3">
      {savedProfiles.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {savedProfiles.map((profile) => (
            <span
              key={profile.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-foreground/[0.015] py-1.5 pr-1.5 pl-3.5 text-xs text-muted-foreground"
            >
              {profile.name}
              <button
                type="button"
                onClick={() => handleDelete(profile.id)}
                aria-label={`Delete saved profile ${profile.name}`}
                className="rounded-full p-1 text-muted-foreground transition-colors duration-200 hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {isNaming ? (
        <div className="flex items-center gap-2">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Profile name"
            className="h-9 w-48 rounded-full border-border/50 px-4 text-sm"
          />
          <Button
            type="button"
            size="sm"
            disabled={!name.trim() || isSaving}
            onClick={handleSave}
            className="h-9 rounded-full px-4 text-sm"
          >
            {isSaving ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsNaming(false);
              setError(null);
            }}
            className="h-9 rounded-full px-3 text-sm text-muted-foreground"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsNaming(true)}
          className="text-xs font-medium tracking-wide text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {isSubscribed ? "Save for monitoring" : "Save this profile"}
        </button>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {confirmation && <p className="max-w-md text-center text-xs text-muted-foreground">{confirmation}</p>}
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
        <span className="ml-1 text-[11px] font-normal text-muted-foreground">est.</span>
      )}
    </span>
  );
}

function DataStatusLine({ row, className }: { row: MarketDataRow; className?: string }) {
  return (
    <p className={cn("text-[11px] leading-snug text-muted-foreground", className)}>
      {row.specificity === "hs" && row.hsCode
        ? `HS-specific · HS ${formatHsCode(row.hsCode)}`
        : "Category estimate"}{" "}
      · {getDataStatus(row)} ·{" "}
      <a
        href={row.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-2 hover:text-foreground hover:underline"
      >
        Source: {row.sourceName}
      </a>{" "}
      · Updated {formatDate(row.lastUpdated)}
    </p>
  );
}

function FrictionMeter({ level, onClick }: { level: CostFriction; onClick?: () => void }) {
  const filled = level === "Low" ? 1 : level === "Medium" ? 2 : 3;
  const content = (
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

  if (!onClick) return content;

  const button = (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md transition-opacity duration-150 hover:opacity-70 active:scale-[0.98]"
    >
      {content}
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipPortal>
        <TooltipPositioner>
          <TooltipPopup>See why this is rated {level.toLowerCase()} friction.</TooltipPopup>
        </TooltipPositioner>
      </TooltipPortal>
    </Tooltip>
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
      {showIcon && <Lock className="size-3 shrink-0 text-muted-foreground" />}
    </span>
  );
}

const ATTRACTIVENESS_HINTS: Record<Attractiveness, string> = {
  Excellent: "This market looks highly attractive right now. Click for more details.",
  Good: "This market looks comparatively attractive. Click for more details.",
  Fair: "This market is workable, with some friction. Click for more details.",
  Challenging: "This market currently carries higher friction. Click for more details.",
};

function AttractivenessBadge({
  level,
  onClick,
}: {
  level: Attractiveness;
  onClick?: () => void;
}) {
  const className = cn(
    "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide",
    level === "Excellent" && "border-transparent bg-foreground text-background",
    level === "Good" && "border-foreground/30 text-foreground",
    level === "Fair" && "border-border text-muted-foreground",
    level === "Challenging" && "border-dashed border-border text-muted-foreground"
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
          <TooltipPopup>{ATTRACTIVENESS_HINTS[level]}</TooltipPopup>
        </TooltipPositioner>
      </TooltipPortal>
    </Tooltip>
  );
}
