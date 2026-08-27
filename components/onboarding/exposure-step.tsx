import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Currency = "CAD" | "USD";

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "CAD", label: "CAD" },
  { code: "USD", label: "USD" },
];

const HS_CODE_PATTERN = /^\d{6}$/;

export function ExposureStep({
  annualValue,
  currency,
  hsCode,
  onAnnualValueChange,
  onCurrencyChange,
  onHsCodeChange,
  onBack,
  onContinue,
}: {
  annualValue: string;
  currency: Currency;
  hsCode: string;
  onAnnualValueChange: (value: string) => void;
  onCurrencyChange: (value: Currency) => void;
  onHsCodeChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const hsCodeInvalid = hsCode.trim().length > 0 && !HS_CODE_PATTERN.test(hsCode.trim());

  return (
    <>
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          How much do you ship?
        </h1>
        <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
          Optional — this lets us estimate your dollar exposure, not just the rate.
        </p>
      </div>

      <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2">
        <div className="flex flex-col gap-3 text-left">
          <label
            htmlFor="annual-value"
            className="text-[13px] font-medium tracking-wide text-foreground"
          >
            Annual value shipped to this market (optional)
          </label>
          <div className="flex items-center gap-3">
            <Input
              id="annual-value"
              type="number"
              min="0"
              inputMode="decimal"
              value={annualValue}
              onChange={(e) => onAnnualValueChange(e.target.value)}
              placeholder="e.g. 250000"
              className="h-11 flex-1 rounded-lg border-border/50 px-3.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            />
            <div
              role="group"
              aria-label="Currency"
              className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-border/60 bg-foreground/[0.02] p-1"
            >
              {CURRENCIES.map((option) => {
                const isSelected = currency === option.code;
                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => onCurrencyChange(option.code)}
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
          </div>
        </div>

        <div className="flex flex-col gap-3 text-left">
          <label htmlFor="hs-code" className="text-[13px] font-medium tracking-wide text-foreground">
            HS code (optional)
          </label>
          <Input
            id="hs-code"
            value={hsCode}
            onChange={(e) => onHsCodeChange(e.target.value)}
            placeholder="e.g. 870830"
            aria-invalid={hsCodeInvalid}
            className={cn(
              "h-11 rounded-lg border-border/50 px-3.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
              hsCodeInvalid && "border-destructive"
            )}
          />
          <p className={cn("text-xs", hsCodeInvalid ? "text-destructive" : "text-muted-foreground")}>
            {hsCodeInvalid
              ? "Enter a 6-digit HS code, or leave it blank."
              : "If you know it. Leave blank and we'll use your category."}
          </p>
        </div>
      </div>

      <div className="mt-20 flex items-center gap-5">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="h-12 rounded-full px-8 text-[15px] font-medium tracking-tight text-muted-foreground transition-transform duration-200 hover:text-foreground active:scale-[0.98]"
        >
          Back
        </Button>
        <Button
          size="lg"
          disabled={hsCodeInvalid}
          onClick={onContinue}
          className="h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] active:scale-[0.98]"
        >
          Continue
        </Button>
      </div>
    </>
  );
}
