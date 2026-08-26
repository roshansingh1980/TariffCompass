import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CANADIAN_PROVINCES, US_STATES } from "@/lib/locations";

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
