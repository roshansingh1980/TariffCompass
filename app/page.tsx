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
  title: "TariffCompass | Canadian Tariff & Trade Impact Intelligence",
  description:
    "Understand how tariff and trade-policy changes affect your Canadian business. Analyze import and export exposure, estimate financial impact, and monitor what changes.",
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
      <div className="flex flex-col items-center justify-center px-6 pt-24 pb-14 text-center sm:pt-32 sm:pb-16">
        <TcLockup size="hero" orientation="horizontal" showDescriptor />
        <h1 className="mt-10 max-w-xs text-xl font-normal text-foreground sm:max-w-sm sm:text-2xl">
          Turn tariff and trade-policy changes into actionable intelligence for your business.
        </h1>
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
