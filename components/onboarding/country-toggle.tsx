import type { Country } from "@/lib/onboarding-data";
import { cn } from "@/lib/utils";

const OPTIONS: { code: Country; label: string }[] = [
  { code: "CA", label: "Canada" },
  { code: "US", label: "United States" },
];

export function CountryToggle({
  value,
  onChange,
}: {
  value: Country;
  onChange: (country: Country) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Country"
      className="inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-foreground/[0.02] p-1"
    >
      {OPTIONS.map((option) => {
        const isSelected = value === option.code;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => onChange(option.code)}
            aria-pressed={isSelected}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200",
              isSelected
                ? "bg-foreground text-background shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
