import type { Metadata } from "next";
import { HsLookupTool } from "@/components/hs-lookup/hs-lookup-tool";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardShellAuth } from "@/lib/dashboard/shell-auth";

export const metadata: Metadata = {
  title: "HS Code Lookup Canada | TariffCompass",
  description: "Search official tariff descriptions to find likely six-digit HS codes, then carry a possible match into a Canadian tariff exposure analysis.",
  alternates: { canonical: "/hs-lookup" },
};

export default async function HsLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  if (view !== "app") return <HsLookupTool />;

  const shellAuth = await getDashboardShellAuth();
  return (
    <DashboardShell {...shellAuth}>
      <HsLookupTool />
    </DashboardShell>
  );
}
