"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-28 sm:py-32">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          What is your situation?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the scenario that best describes your business.
        </p>
      </div>

      <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        {SCENARIOS.map((scenario) => {
          const isSelected = selected === scenario.id;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setSelected(scenario.id)}
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
                {scenario.title}
              </span>
              <span className="text-sm text-muted-foreground">
                {scenario.description}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        size="lg"
        disabled={!selected}
        onClick={() => console.log("Selected scenario:", selected)}
        className="mt-16 h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
      >
        Continue
      </Button>
    </div>
  );
}
