import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardShellAuth } from "@/lib/dashboard/shell-auth";
import { evaluateAndListExposureAlerts } from "@/lib/supabase/exposure-alerts";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const [{ isLoggedIn, isSubscribed, userEmail }, alertsResult] = await Promise.all([
    getDashboardShellAuth(),
    evaluateAndListExposureAlerts(),
  ]);
  const alertCount = alertsResult.available ? alertsResult.alerts.length : 0;

  return (
    <DashboardShell isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} userEmail={userEmail} alertCount={alertCount}>
      {children}
    </DashboardShell>
  );
}
