import { Compass, LineChart, Radar } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";

const STEPS = [
  {
    icon: Radar,
    label: "Monitor",
    heading: "What changed and does it affect me?",
    body: "We monitor official sources daily and identify changes relevant to your products and markets.",
  },
  {
    icon: LineChart,
    label: "Quantify",
    heading: "What could it cost my business?",
    body: "We translate tariff changes into estimated dollar exposure for your specific trade.",
  },
  {
    icon: Compass,
    label: "Respond",
    heading: "What should I investigate next?",
    body: "We surface sourcing, market, and agreement options worth investigating.",
  },
] as const;

export function MonitorQuantifyRespond() {
  return (
    <section className="w-full py-14 sm:py-16">
      <PublicContainer>
        <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          From change to clarity in three steps
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, label, heading, body }) => (
            <div key={label} className="rounded-2xl border border-border/60 bg-background p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#C8102E]/[0.08] text-[#C8102E]">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  {label}
                </span>
              </div>
              <p className="mt-3 text-[15px] font-semibold tracking-tight text-foreground">{heading}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </PublicContainer>
    </section>
  );
}
