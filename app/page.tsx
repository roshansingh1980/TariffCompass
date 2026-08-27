import type { Metadata } from "next";
import { Suspense } from "react";
import { TcLockup } from "@/components/brand/tc-lockup";
import { CanadaUsHeatmap } from "@/components/homepage/canada-us-heatmap";
import { KeyDatesSection } from "@/components/homepage/key-dates-section";
import { SourcesCountLine } from "@/components/homepage/sources-count-line";
import { CtaSection } from "@/components/homepage/cta-section";
import { createClient } from "@/lib/supabase/server";
import { listSavedProfiles } from "@/lib/supabase/saved-profiles";

export const metadata: Metadata = {
  title: "TariffCompass | Canadian Export Tariff & Market Diversification Tool",
  description:
    "See your U.S. tariff exposure, compare alternative markets, and generate a funding-ready diversification brief. Built for Canadian exporters and their advisors.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  let isLoggedIn = false;
  let savedProfileCount = 0;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
    if (isLoggedIn) {
      savedProfileCount = (await listSavedProfiles()).length;
    }
  } catch (error) {
    console.error("Homepage failed to load auth state:", error);
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-col items-center justify-center px-6 py-36 text-center sm:py-48">
        <TcLockup size="hero" orientation="horizontal" showDescriptor />
        <p className="mt-10 max-w-md text-xl font-normal text-muted-foreground sm:text-2xl">
          Navigate tariffs. Find your path.
        </p>
      </div>
      <Suspense fallback={<HeatmapSkeleton />}>
        <CanadaUsHeatmap />
      </Suspense>
      <KeyDatesSection />
      <SourcesCountLine />
      <CtaSection isLoggedIn={isLoggedIn} savedProfileCount={savedProfileCount} />
    </div>
  );
}

function HeatmapSkeleton() {
  return (
    <section className="w-full max-w-4xl px-6 pb-28">
      <div className="mx-auto h-7 w-64 animate-pulse rounded-full bg-foreground/[0.06]" />
      <div className="mx-auto mt-3 h-4 w-80 animate-pulse rounded-full bg-foreground/[0.05]" />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-3xl border border-border/60 bg-foreground/[0.02]"
          />
        ))}
      </div>
    </section>
  );
}
