import { CircleDollarSign, Compass, RefreshCw, Search } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";

const ITEMS = [
  { icon: Search, label: "Product-specific", body: "Start with your product or HS code." },
  { icon: CircleDollarSign, label: "Financial", body: "Translate tariff changes into estimated dollar exposure." },
  { icon: RefreshCw, label: "Continuous", body: "Save exposures and let TariffCompass monitor them." },
  { icon: Compass, label: "Action-oriented", body: "See sourcing, market, and adviser questions worth investigating." },
] as const;

export function MoreThanLookup() {
  return (
    <section className="w-full py-14 sm:py-16">
      <PublicContainer>
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          More than a tariff lookup
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, label, body }) => (
            <div key={label} className="rounded-2xl border border-border/60 p-5">
              <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold tracking-tight text-foreground">{label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </PublicContainer>
    </section>
  );
}
