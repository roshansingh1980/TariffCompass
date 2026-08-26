"use client";

import { useEffect, useState } from "react";
import { CountryToggle } from "@/components/onboarding/country-toggle";
import { ScenarioStep } from "@/components/onboarding/scenario-step";
import { LocationStep } from "@/components/onboarding/location-step";
import { ProductStep } from "@/components/onboarding/product-step";
import { ResultsStep } from "@/components/onboarding/results-step";
import type { Country } from "@/lib/onboarding-data";

type Step = "scenario" | "location" | "product" | "results";

export function DashboardWizard({ isSubscribed }: { isSubscribed: boolean }) {
  const [step, setStep] = useState<Step>("scenario");
  const [country, setCountry] = useState<Country>("CA");
  const [scenario, setScenario] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [usState, setUsState] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  /** True while the user is editing a single answer from a Results summary chip. */
  const [returnToResults, setReturnToResults] = useState(false);

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
        <ScenarioStep
          selected={scenario}
          onSelect={setScenario}
          onContinue={() => goNext("location")}
        />
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
          onBack={() => setStep("product")}
          onEditStep={editStep}
        />
      )}
    </div>
  );
}
