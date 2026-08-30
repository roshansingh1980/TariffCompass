import type { Metadata } from "next";
import { HeroSection } from "@/components/homepage/hero-section";
import { MonitorQuantifyRespond } from "@/components/homepage/monitor-quantify-respond";
import { ProofStrip } from "@/components/homepage/proof-strip";
import { TradeChangesSection } from "@/components/homepage/trade-changes-section";
import { ImporterExporterSplit } from "@/components/homepage/importer-exporter-split";
import { MoreThanLookup } from "@/components/homepage/more-than-lookup";
import { HowItWorks } from "@/components/homepage/how-it-works";
import { PricingPreview } from "@/components/homepage/pricing-preview";
import { TrustBand } from "@/components/homepage/trust-band";

export const metadata: Metadata = {
  title: "TariffCompass | Canadian Tariff & Trade Impact Intelligence",
  description:
    "Understand how tariff and trade-policy changes affect your Canadian business. Analyze import and export exposure, estimate financial impact, and monitor what changes.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <HeroSection />
      <MonitorQuantifyRespond />
      <ProofStrip />
      <TradeChangesSection />
      <ImporterExporterSplit />
      <MoreThanLookup />
      <HowItWorks />
      <PricingPreview />
      <TrustBand />
    </div>
  );
}
