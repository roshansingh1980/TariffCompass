"use client";

import { useEffect, useState } from "react";
import { CountryToggle } from "@/components/onboarding/country-toggle";
import { ScenarioStep } from "@/components/onboarding/scenario-step";
import { LocationStep } from "@/components/onboarding/location-step";
import { ProductStep } from "@/components/onboarding/product-step";
import { ExposureStep, type Currency } from "@/components/onboarding/exposure-step";
import { ResultsStep } from "@/components/onboarding/results-step";
import { listSavedProfiles } from "@/lib/supabase/saved-profiles";
import { saveOnboardingSelections } from "@/lib/supabase/save";
import { loadPendingWizardState, clearPendingWizardState } from "@/lib/pending-wizard";
import type { Country } from "@/lib/onboarding-data";
import type { SavedProfile } from "@/types/database";

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
  const [country, setCountry] = useState<Country>("CA");
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
    setCountry((profile.country as Country) ?? "CA");
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
    setCountry(pending.country);
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
        country: pending.country,
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
    <div className="flex flex-1 flex-col items-center px-6 py-16 sm:py-20">
      <div className="mb-8 flex w-full max-w-5xl justify-end">
        <CountryToggle value={country} onChange={setCountry} />
      </div>

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
          onCategoryChange={setCategory}
          onProductNameChange={setProductName}
          onBack={() => setStep("location")}
          onContinue={() => goNext("exposure")}
        />
      )}
      {step === "exposure" && (
        <ExposureStep
          annualValue={annualValue}
          currency={currency}
          hsCode={hsCode}
          onAnnualValueChange={setAnnualValue}
          onCurrencyChange={setCurrency}
          onHsCodeChange={setHsCode}
          onBack={() => setStep("product")}
          onContinue={() => goNext("results")}
        />
      )}
      {step === "results" && (
        <ResultsStep
          country={country}
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
