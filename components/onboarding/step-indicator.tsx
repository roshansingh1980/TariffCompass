import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs font-semibold tracking-wide text-[#C8102E]">
        Step {step} of {total}
      </span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <span
            key={n}
            aria-hidden="true"
            className={cn(
              "flex size-4 items-center justify-center rounded-full text-[9px] font-bold",
              n < step && "bg-[#C8102E] text-white",
              n === step && "bg-[#C8102E] text-white ring-2 ring-[#C8102E]/25",
              n > step && "bg-border/70 text-transparent"
            )}
          >
            {n < step && <Check className="size-2.5" strokeWidth={3} />}
          </span>
        ))}
      </div>
    </div>
  );
}
