import { Check, Building2, Globe2 } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";

const PANELS = [
  {
    icon: Building2,
    heading: "For importers",
    tint: "bg-[#C8102E]/[0.04]",
    iconTint: "bg-[#C8102E]/[0.1] text-[#C8102E]",
    items: [
      "Monitor tariffs affecting your input costs",
      "Quantify sourcing exposure",
      "Investigate alternative suppliers",
    ],
  },
  {
    icon: Globe2,
    heading: "For exporters",
    tint: "bg-foreground/[0.02]",
    iconTint: "bg-foreground/[0.06] text-foreground",
    items: [
      "Monitor destination-market changes",
      "Quantify revenue exposure",
      "Investigate new markets and trade-agreement angles",
    ],
  },
] as const;

export function ImporterExporterSplit() {
  return (
    <section className="w-full py-14 sm:py-16">
      <PublicContainer>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PANELS.map(({ icon: Icon, heading, tint, iconTint, items }) => (
            <div key={heading} className={`rounded-2xl border border-border/60 p-6 sm:p-7 ${tint}`}>
              <span className={`flex size-9 items-center justify-center rounded-xl ${iconTint}`}>
                <Icon aria-hidden="true" className="size-[18px]" />
              </span>
              <p className="mt-4 text-lg font-semibold tracking-tight text-foreground">{heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#C8102E]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PublicContainer>
    </section>
  );
}
