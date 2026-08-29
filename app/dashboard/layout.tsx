import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardShellAuth } from "@/lib/dashboard/shell-auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const { isLoggedIn, isSubscribed, userEmail } = await getDashboardShellAuth();

  return (
    <DashboardShell isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} userEmail={userEmail}>
      {children}
    </DashboardShell>
  );
}
