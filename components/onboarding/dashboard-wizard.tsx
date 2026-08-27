"use client";

import { useEffect, useState } from "react";
import { CountryToggle } from "@/components/onboarding/country-toggle";
import { ScenarioStep } from "@/components/onboarding/scenario-step";
import { LocationStep } from "@/components/onboarding/location-step";
import { ProductStep } from "@/components/onboarding/product-step";
import { ResultsStep } from "@/components/onboarding/results-step";
import { listSavedProfiles } from "@/lib/supabase/saved-profiles";
import type { Country } from "@/lib/onboarding-data";
import type { SavedProfile } from "@/types/database";

type Step = "scenario" | "location" | "product" | "results";

export function DashboardWizard({
  isSubscribed,
  savedProfiles: initialSavedProfiles,
}: {
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
    setStep("results");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  function goNext(next: Step) {
    if (returnToResults) {
      setReturnToResults(false);
      setStep("results");
    } else {
      setStep(next);
    }
  }

  function editStep(target: "scenario" | "location" | "product") {
    setReturnToResults(true);
    setStep(target);
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-28 sm:py-36">
      <div className="mb-12 flex w-full max-w-5xl justify-end">
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
          isSubscribed={isSubscribed}
          savedProfiles={savedProfiles}
          onSavedProfilesChange={refreshSavedProfiles}
          onBack={() => setStep("product")}
          onEditStep={editStep}
          onScenarioChange={setScenario}
          onProvinceChange={setProvince}
          onCategoryChange={setCategory}
        />
      )}
    </div>
  );
}
