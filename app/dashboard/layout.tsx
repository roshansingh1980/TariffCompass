import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  let isLoggedIn = false;
  let isSubscribed = false;
  let userEmail: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
    userEmail = user?.email ?? null;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .maybeSingle();
      isSubscribed = profile?.subscription_status === "active";
    }
  } catch (error) {
    console.error("Dashboard layout failed to load auth state:", error);
  }

  return (
    <DashboardShell isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} userEmail={userEmail}>
      {children}
    </DashboardShell>
  );
}
