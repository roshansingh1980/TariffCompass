"use client";

import { useEffect, useState } from "react";
import { ScenarioStep } from "@/components/onboarding/scenario-step";
import { LocationStep } from "@/components/onboarding/location-step";
import { ProductStep } from "@/components/onboarding/product-step";
import { ExposureStep, type Currency } from "@/components/onboarding/exposure-step";
import { ResultsStep } from "@/components/onboarding/results-step";
import { OtherCategoryInterstitial } from "@/components/onboarding/other-category-interstitial";
import { listSavedProfiles } from "@/lib/supabase/saved-profiles";
import { saveOnboardingSelections } from "@/lib/supabase/save";
import { loadPendingWizardState, clearPendingWizardState } from "@/lib/pending-wizard";
import { OTHER_CATEGORY, type Country } from "@/lib/onboarding-data";
import type { SavedProfile } from "@/types/database";

/**
 * Home country is intentionally hardcoded, not user-selectable — see
 * CLAUDE.md. TariffCompass is positioned as a Canadian tool; a
 * US-home-country option had no upside and one real cost (a disclaimer
 * apologizing for the product being Canadian). The field itself stays
 * live everywhere it's written (companies.country, saved_profiles.country,
 * the AI brief's "Home country" prompt field) — only the value is fixed.
 */
const HOME_COUNTRY: Country = "CA";

type Step = "scenario" | "location" | "product" | "exposure" | "results";

export function DashboardWizard({
  isLoggedIn,
  isSubscribed,
  savedProfiles: initialSavedProfiles,
}: {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  savedProfiles: SavedProfile[];
}) {
  const [step, setStep] = useState<Step>("scenario");
  const [scenario, setScenario] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [usState, setUsState] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [annualValue, setAnnualValue] = useState("");
  const [currency, setCurrency] = useState<Currency>("CAD");
  const [hsCode, setHsCode] = useState("");
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>(initialSavedProfiles);
  /** True while the user is editing a single answer from a Results summary chip. */
  const [returnToResults, setReturnToResults] = useState(false);

  async function refreshSavedProfiles() {
    setSavedProfiles(await listSavedProfiles());
  }

  function loadSavedProfile(profile: SavedProfile) {
    setScenario(profile.scenario);
    setProvince(profile.province);
    setUsState(profile.us_state);
    setCategory(profile.category);
    setAnnualValue(profile.annual_value != null ? String(profile.annual_value) : "");
    setCurrency((profile.currency as Currency) ?? "CAD");
    setHsCode(profile.hs_code ?? "");
    setStep("results");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // One-time restore across the /signup or /login round-trip an anonymous
  // visitor takes from Results (see lib/pending-wizard.ts). Clearing the key
  // synchronously, before the async save below, prevents a double-fire under
  // React Strict Mode's double-invoke.
  useEffect(() => {
    const pending = loadPendingWizardState();
    if (!pending) return;

    setScenario(pending.scenario);
    setProvince(pending.province);
    setUsState(pending.usState);
    setCategory(pending.category);
    setProductName(pending.productName);
    setAnnualValue(pending.annualValue);
    setCurrency(pending.currency);
    setHsCode(pending.hsCode);
    setStep("results");

    if (isLoggedIn) {
      clearPendingWizardState();
      saveOnboardingSelections({
        scenario: pending.scenario,
        country: HOME_COUNTRY,
        province: pending.province,
        usState: pending.usState,
        category: pending.category,
        productName: pending.productName,
      });
    }
    // Intentionally runs once on mount only — isLoggedIn is read fresh each
    // time via the effect body, not tracked as a dependency, since restoring
    // itself is a one-shot action regardless of later auth-state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goNext(next: Step) {
    if (returnToResults) {
      setReturnToResults(false);
      setStep("results");
    } else {
      setStep(next);
    }
  }

  function editStep(target: "scenario" | "location" | "product" | "exposure") {
    setReturnToResults(true);
    setStep(target);
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-10 sm:py-14">
      {step === "scenario" && (
        <>
          {savedProfiles.length > 0 && (
            <div className="mb-14 flex w-full max-w-3xl flex-col items-center gap-3">
              <p className="text-[13px] font-medium tracking-wide text-muted-foreground">
                Load a saved profile
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {savedProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => loadSavedProfile(profile)}
                    className="rounded-full border border-border/50 px-5 py-2.5 text-sm font-medium tracking-tight text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-foreground/[0.02]"
                  >
                    {profile.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <ScenarioStep
            selected={scenario}
            onSelect={setScenario}
            onContinue={() => goNext("location")}
          />
        </>
      )}
      {step === "location" && (
        <LocationStep
          province={province}
          usState={usState}
          onProvinceChange={setProvince}
          onUsStateChange={setUsState}
          onBack={() => setStep("scenario")}
          onContinue={() => goNext("product")}
        />
      )}
      {step === "product" && (
        <ProductStep
          category={category}
          productName={productName}
          hsCode={hsCode}
          onCategoryChange={setCategory}
          onProductNameChange={setProductName}
          onHsCodeChange={setHsCode}
          onBack={() => setStep("location")}
          onContinue={() => goNext(category === OTHER_CATEGORY ? "results" : "exposure")}
        />
      )}
      {step === "exposure" && (
        <ExposureStep
          annualValue={annualValue}
          currency={currency}
          onAnnualValueChange={setAnnualValue}
          onCurrencyChange={setCurrency}
          onBack={() => setStep("product")}
          onContinue={() => goNext("results")}
        />
      )}
      {step === "results" && category === OTHER_CATEGORY && (
        <OtherCategoryInterstitial onBack={() => setStep("product")} />
      )}
      {step === "results" && category !== OTHER_CATEGORY && (
        <ResultsStep
          country={HOME_COUNTRY}
          scenario={scenario}
          province={province}
          usState={usState}
          category={category}
          productName={productName}
          annualValue={annualValue}
          currency={currency}
          hsCode={hsCode}
          isLoggedIn={isLoggedIn}
          isSubscribed={isSubscribed}
          savedProfiles={savedProfiles}
          onSavedProfilesChange={refreshSavedProfiles}
          onBack={() => setStep("exposure")}
          onEditStep={editStep}
          onScenarioChange={setScenario}
          onProvinceChange={setProvince}
          onCategoryChange={setCategory}
        />
      )}
    </div>
  );
}
