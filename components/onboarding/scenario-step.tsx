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
