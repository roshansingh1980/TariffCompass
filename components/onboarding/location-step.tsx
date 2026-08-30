import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { CANADIAN_PROVINCES, US_STATES } from "@/lib/locations";

const WHY_WE_ASK = [
  "Tailor regional tariff guidance",
  "Improve market context",
  "Support better response intelligence",
];

export function LocationStep({
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
    <div className="grid w-full max-w-4xl grid-cols-1 gap-10 lg:grid-cols-[1fr_16rem] lg:items-start lg:gap-12">
      <div>
        <StepIndicator step={2} total={4} />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Where does your business trade?
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          Add your Canadian base and, if relevant, your primary U.S. market. We use this to
          tailor tariff guidance and regional context.
        </p>

        <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-border/60 p-6 sm:p-7">
          <div className="flex flex-col gap-3 text-left">
            <label htmlFor="province" className="text-[13px] font-medium tracking-wide text-foreground">
              Canadian province <span className="text-[#C8102E]">*</span>
            </label>
            <Select value={province} onValueChange={(value) => onProvinceChange(value as string)}>
              <SelectTrigger
                id="province"
                className="h-11 w-full rounded-lg border-border/50 px-3.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <SelectValue placeholder="Select a province">
                  {(value: string | null) =>
                    CANADIAN_PROVINCES.find((p) => p.value === value)?.label ?? "Select a province"
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

          <div className="flex flex-col gap-3 text-left">
            <label htmlFor="us-state" className="text-[13px] font-medium tracking-wide text-foreground">
              Primary U.S. market <span className="text-muted-foreground">(optional)</span>
            </label>
            <Select value={usState} onValueChange={(value) => onUsStateChange(value as string)}>
              <SelectTrigger
                id="us-state"
                className="h-11 w-full rounded-lg border-border/50 px-3.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <SelectValue placeholder="Select a state">
                  {(value: string | null) => US_STATES.find((s) => s.value === value)?.label ?? "Select a state"}
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

          <p className="text-xs text-muted-foreground">You can change this anytime before saving your results.</p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            className="h-11 rounded-full border-border/70 px-7 text-[15px] font-medium tracking-tight text-foreground"
          >
            Back
          </Button>
          <Button
            size="lg"
            disabled={!province}
            onClick={onContinue}
            className="h-11 rounded-full bg-[#C8102E] px-8 text-[15px] font-medium tracking-tight text-white hover:bg-[#B00E29]"
          >
            Continue
          </Button>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-foreground/[0.02] p-6 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-[#C8102E]/[0.08] text-[#C8102E]">
            <Globe2 aria-hidden="true" className="size-5" />
          </span>
          <p className="text-sm font-semibold tracking-tight text-foreground">Why we ask for your location</p>
          <ul className="mt-1 flex flex-col gap-2 text-left text-xs text-muted-foreground">
            {WHY_WE_ASK.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 size-1 shrink-0 rounded-full bg-[#C8102E]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
