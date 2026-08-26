import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCENARIOS } from "@/lib/onboarding-data";
import { cn } from "@/lib/utils";

export function ScenarioStep({
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
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          What is your situation?
        </h1>
        <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
          Choose the scenario that best describes your business.
        </p>
      </div>

      <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {SCENARIOS.map((s) => {
          const isSelected = selected === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              aria-pressed={isSelected}
              className={cn(
                "group relative flex flex-col items-start gap-2.5 rounded-3xl border px-8 py-10 text-left transition-all duration-200",
                isSelected
                  ? "border-foreground/80 bg-foreground/[0.03] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]"
                  : "border-border/60 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-foreground/[0.015] hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.10)]"
              )}
            >
              <span
                className={cn(
                  "absolute top-7 right-7 flex size-5 items-center justify-center rounded-full border transition-colors duration-200",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-transparent"
                )}
              >
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className="pr-8 text-xl font-medium tracking-tight text-foreground">
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
        className="mt-20 h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]"
      >
        Continue
      </Button>
    </>
  );
}
