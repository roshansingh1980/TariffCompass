import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type ChipOption = { value: string; label: string };

/**
 * Same pill look as the plain summary chips, but the pill itself is the
 * Select trigger — picking a new value updates the parent's state directly
 * and never navigates away from Results.
 */
export function ChipSelect({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string | null;
  options: ChipOption[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as string)}>
      <SelectPrimitive.Trigger
        className={cn(
          "group inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-foreground/[0.02] px-4 py-2 text-sm text-muted-foreground outline-none transition-all duration-200 active:scale-[0.97]",
          "hover:border-foreground/30 hover:bg-foreground/[0.05] hover:text-foreground",
          "data-popup-open:border-foreground/30 data-popup-open:bg-foreground/[0.05] data-popup-open:text-foreground"
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder}>
          {(v: string | null) => options.find((o) => o.value === v)?.label ?? placeholder}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon
          render={
            <ChevronDown className="size-3.5 text-muted-foreground/50 transition-transform duration-200 group-data-popup-open:rotate-180" />
          }
        />
      </SelectPrimitive.Trigger>
      <SelectContent align="center" sideOffset={8} alignItemWithTrigger={false}>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
