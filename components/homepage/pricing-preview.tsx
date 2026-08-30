import Link from "next/link";
import { Check } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { SubscribeButton } from "@/components/billing/subscribe-button";
import { PRICING } from "@/lib/pricing";

const FREE_FEATURES = [
  "HS code lookup and market comparison",
  "Export tariff rate, cost/friction and risk badges",
  "Relevant government support programs",
];

const BUSINESS_FEATURES = [
  "Everything in Free, plus:",
  "Estimated dollar exposure for your trade",
  "Automatic monitoring with alerts",
  "AI-generated diversification brief",
  "Full program details and rating rationale",
];

const ADVISOR_FEATURES = [
  "Multi-client workspace",
  "Client Exposure Radar across your book",
  "Client-ready, sourced output",
];

export function PricingPreview() {
  return (
    <section id="pricing" className="w-full scroll-mt-20 py-14 sm:py-16">
      <PublicContainer>
        <div className="text-center">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Simple, outcome-focused pricing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Free proves the intelligence. Business buys company-specific relevance and monitoring.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 p-6">
            <p className="text-sm font-semibold text-foreground">Free</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              C$0<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {FREE_FEATURES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground/50" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="mt-6 flex h-11 items-center justify-center rounded-full border border-border/70 text-sm font-medium text-foreground hover:bg-foreground/[0.03]"
            >
              Get started free
            </Link>
          </div>

          <div className="relative rounded-2xl border-2 border-[#C8102E]/70 bg-background p-6 shadow-[0_8px_30px_-12px_rgba(200,16,46,0.25)]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#C8102E] px-3 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
              Most popular
            </span>
            <p className="text-sm font-semibold text-foreground">Business</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              C${PRICING.business.monthlyCad}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {BUSINESS_FEATURES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#C8102E]" />
                  {item}
                </li>
              ))}
            </ul>
            <SubscribeButton
              label="Start Business"
              className="mt-6 h-11 w-full rounded-full bg-[#C8102E] text-white hover:bg-[#B00E29]"
            />
          </div>

          <div className="rounded-2xl border border-border/60 p-6">
            <p className="text-sm font-semibold text-foreground">Advisor</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              C${PRICING.advisor.monthlyCad}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {ADVISOR_FEATURES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground/50" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/support"
              className="mt-6 flex h-11 items-center justify-center rounded-full border border-border/70 text-sm font-medium text-foreground hover:bg-foreground/[0.03]"
            >
              Learn more
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          All plans in CAD. Cancel anytime. The first 10 Business customers get 50% off for 12 months.
        </p>
      </PublicContainer>
    </section>
  );
}
