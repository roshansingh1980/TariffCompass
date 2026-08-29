import type { Metadata } from "next";
import { HsLookupTool } from "@/components/hs-lookup/hs-lookup-tool";

export const metadata: Metadata = {
  title: "HS Code Lookup Canada | TariffCompass",
  description: "Search official tariff descriptions to find likely six-digit HS codes, then carry a possible match into a Canadian tariff exposure analysis.",
  alternates: { canonical: "/hs-lookup" },
};

export default function HsLookupPage() {
  return <HsLookupTool />;
}
