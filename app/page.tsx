import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TcLockup } from "@/components/brand/tc-lockup";
import { CanadaUsHeatmap } from "@/components/homepage/canada-us-heatmap";

export const metadata: Metadata = {
  title: "TariffCompass | Canadian Export Tariff & Market Diversification Tool",
  description:
    "See your U.S. tariff exposure, compare alternative markets, and generate a funding-ready diversification brief. Built for Canadian exporters and their advisors.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-col items-center justify-center px-6 py-36 text-center sm:py-48">
        <TcLockup size="hero" orientation="horizontal" showDescriptor />
        <p className="mt-10 max-w-md text-xl font-normal text-muted-foreground sm:text-2xl">
          Navigate tariffs. Find your path.
        </p>
        <Button
          size="lg"
          render={<Link href="/dashboard" />}
          nativeButton={false}
          className="mt-16 h-12 rounded-full px-10 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]"
        >
          Get Started
        </Button>
      </div>
      <CanadaUsHeatmap />
    </div>
  );
}
