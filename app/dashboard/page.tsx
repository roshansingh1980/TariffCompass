"use client";

import { useState } from "react";
import { ScenarioStep } from "@/components/onboarding/scenario-step";
import { LocationStep } from "@/components/onboarding/location-step";
import { ProductStep } from "@/components/onboarding/product-step";
import { ResultsStep } from "@/components/onboarding/results-step";

type Step = "scenario" | "location" | "product" | "results";

export default function DashboardPage() {
  const [step, setStep] = useState<Step>("scenario");
  const [scenario, setScenario] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [usState, setUsState] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [productName, setProductName] = useState("");

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-28 sm:py-36">
      {step === "scenario" && (
        <ScenarioStep
          selected={scenario}
          onSelect={setScenario}
          onContinue={() => setStep("location")}
        />
      )}
      {step === "location" && (
        <LocationStep
          province={province}
          usState={usState}
          onProvinceChange={setProvince}
          onUsStateChange={setUsState}
          onBack={() => setStep("scenario")}
          onContinue={() => setStep("product")}
        />
      )}
      {step === "product" && (
        <ProductStep
          category={category}
          productName={productName}
          onCategoryChange={setCategory}
          onProductNameChange={setProductName}
          onBack={() => setStep("location")}
          onContinue={() => setStep("results")}
        />
      )}
      {step === "results" && (
        <ResultsStep
          scenario={scenario}
          province={province}
          category={category}
          productName={productName}
          onBack={() => setStep("product")}
        />
      )}
    </div>
  );
}
