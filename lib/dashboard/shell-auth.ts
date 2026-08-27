import { createClient } from "@/lib/supabase/server";

export type DashboardShellAuth = {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  userEmail: string | null;
};

/**
 * Auth/subscription lookup shared by every page that renders inside
 * DashboardShell — the /dashboard layout and any public page (e.g.
 * /updates, /sources) shown in the sidebar shell via ?view=app.
 */
export async function getDashboardShellAuth(): Promise<DashboardShellAuth> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isSubscribed = false;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .maybeSingle();
      isSubscribed = profile?.subscription_status === "active";
    }

    return { isLoggedIn: Boolean(user), isSubscribed, userEmail: user?.email ?? null };
  } catch (error) {
    console.error("getDashboardShellAuth failed to load auth state:", error);
    return { isLoggedIn: false, isSubscribed: false, userEmail: null };
  }
}
