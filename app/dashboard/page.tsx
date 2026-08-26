"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CANADIAN_PROVINCES, US_STATES } from "@/lib/locations";
import { cn } from "@/lib/utils";

type Step = "scenario" | "location" | "product";

const CATEGORIES = [
  "Auto parts",
  "Electronics",
  "Furniture",
  "Apparel & Textiles",
  "Steel & Metals",
  "Agri-food",
  "Machinery",
  "Chemicals",
  "Other / Custom",
];

type Scenario = {
  id: string;
  title: string;
  description: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "export-us",
    title: "Export to the United States",
    description: "You sell products to customers in the U.S.",
  },
  {
    id: "import-us",
    title: "Import from the United States",
    description: "You buy products from U.S. suppliers.",
  },
  {
    id: "export-other",
    title: "Export to other countries",
    description: "You sell products outside the U.S.",
  },
  {
    id: "import-other",
    title: "Import from other countries",
    description: "You buy products from outside the U.S.",
  },
];

export default function DashboardPage() {
  const [step, setStep] = useState<Step>("scenario");
  const [scenario, setScenario] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [usState, setUsState] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [productName, setProductName] = useState("");

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-28 sm:py-32">
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
          onContinue={() =>
            console.log("Onboarding selections:", {
              scenario,
              province,
              usState,
              category,
              productName,
            })
          }
        />
      )}
    </div>
  );
}

function ScenarioStep({
  selected,
  onSelect,
  onContinue,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          What is your situation?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the scenario that best describes your business.
        </p>
      </div>

      <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        {SCENARIOS.map((s) => {
          const isSelected = selected === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              aria-pressed={isSelected}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-2xl border px-7 py-8 text-left transition-all duration-200",
                isSelected
                  ? "border-foreground/80 bg-foreground/[0.03] shadow-sm"
                  : "border-border/70 hover:border-foreground/30 hover:bg-foreground/[0.015]"
              )}
            >
              <span
                className={cn(
                  "absolute top-6 right-6 flex size-5 items-center justify-center rounded-full border transition-colors duration-200",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-transparent"
                )}
              >
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className="pr-8 text-lg font-medium tracking-tight text-foreground">
                {s.title}
              </span>
              <span className="text-sm text-muted-foreground">{s.description}</span>
            </button>
          );
        })}
      </div>

      <Button
        size="lg"
        disabled={!selected}
        onClick={onContinue}
        className="mt-16 h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
      >
        Continue
      </Button>
    </>
  );
}

function LocationStep({
  province,
  usState,
  onProvinceChange,
  onUsStateChange,
  onBack,
  onContinue,
}: {
  province: string | null;
  usState: string | null;
  onProvinceChange: (value: string) => void;
  onUsStateChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Where are you based?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This helps us tailor tariff guidance to your business.
        </p>
      </div>

      <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-2.5 text-left">
          <label
            htmlFor="province"
            className="text-sm font-medium text-foreground"
          >
            Canadian Province
          </label>
          <Select
            value={province}
            onValueChange={(value) => onProvinceChange(value as string)}
          >
            <SelectTrigger
              id="province"
              className="h-12 w-full rounded-xl border-border/70 px-4 text-base"
            >
              <SelectValue placeholder="Select a province">
                {(value: string | null) =>
                  CANADIAN_PROVINCES.find((p) => p.value === value)?.label ??
                  "Select a province"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CANADIAN_PROVINCES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2.5 text-left">
          <label htmlFor="us-state" className="text-sm font-medium text-foreground">
            Primary U.S. market (optional)
          </label>
          <Select
            value={usState}
            onValueChange={(value) => onUsStateChange(value as string)}
          >
            <SelectTrigger
              id="us-state"
              className="h-12 w-full rounded-xl border-border/70 px-4 text-base"
            >
              <SelectValue placeholder="Select a state">
                {(value: string | null) =>
                  US_STATES.find((s) => s.value === value)?.label ?? "Select a state"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-16 flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="h-12 rounded-full px-8 text-[15px] font-medium tracking-tight text-muted-foreground hover:text-foreground"
        >
          Back
        </Button>
        <Button
          size="lg"
          disabled={!province}
          onClick={onContinue}
          className="h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
        >
          Continue
        </Button>
      </div>
    </>
  );
}

function ProductStep({
  category,
  productName,
  onCategoryChange,
  onProductNameChange,
  onBack,
  onContinue,
}: {
  category: string | null;
  productName: string;
  onCategoryChange: (value: string) => void;
  onProductNameChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          What do you sell or import?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Pick the category that best fits, then tell us the specific product.
        </p>
      </div>

      <div className="mt-16 flex w-full max-w-2xl flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-medium tracking-tight transition-all duration-200",
                isSelected
                  ? "border-foreground bg-foreground text-background shadow-sm"
                  : "border-border/70 text-foreground hover:border-foreground/40 hover:bg-foreground/[0.02]"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mt-12 w-full max-w-sm text-left">
        <label
          htmlFor="product-name"
          className="text-sm font-medium text-foreground"
        >
          Specific product name (optional)
        </label>
        <Input
          id="product-name"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="e.g. Brake pads"
          className="mt-2.5 h-12 rounded-xl border-border/70 px-4 text-base"
        />
      </div>

      <div className="mt-16 flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="h-12 rounded-full px-8 text-[15px] font-medium tracking-tight text-muted-foreground hover:text-foreground"
        >
          Back
        </Button>
        <Button
          size="lg"
          disabled={!category}
          onClick={onContinue}
          className="h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
        >
          Continue
        </Button>
      </div>
    </>
  );
}
