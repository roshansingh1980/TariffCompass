import { Bell, ClipboardList, LineChart, Save, Search } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";

const STEPS = [
  { icon: Search, label: "1. Search", body: "Look up an HS code or product" },
  { icon: ClipboardList, label: "2. Analyze", body: "See relevant tariff changes and official sources" },
  { icon: LineChart, label: "3. Quantify", body: "Review estimated financial impact" },
  { icon: Save, label: "4. Save", body: "Save exposures you want to track" },
  { icon: Bell, label: "5. Monitor", body: "Get alerts when material changes occur" },
] as const;

export function HowItWorks() {
  return (
    <section className="w-full py-14 sm:py-16">
      <PublicContainer>
        <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          How TariffCompass works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-5 sm:gap-3">
          {STEPS.map(({ icon: Icon, label, body }, i) => (
            <div key={label} className="relative flex flex-col items-center text-center">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-6 right-[calc(50%+28px)] hidden h-px w-[calc(100%-56px)] bg-border/60 sm:block"
                />
              )}
              <span className="relative z-10 flex size-12 items-center justify-center rounded-full border border-border/60 bg-background text-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <p className="mt-3 text-sm font-semibold tracking-tight text-foreground">{label}</p>
              <p className="mt-1 max-w-[10rem] text-xs leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </PublicContainer>
    </section>
  );
}
