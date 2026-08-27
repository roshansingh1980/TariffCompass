import { DashboardWizard } from "@/components/onboarding/dashboard-wizard";
import { createClient } from "@/lib/supabase/server";
import { listSavedProfiles } from "@/lib/supabase/saved-profiles";

/**
 * Open to anonymous visitors — the wizard and Results table don't require an
 * account. isLoggedIn gates only the two things that do (AI Brief, saved
 * profiles); listSavedProfiles() already returns [] for no user.
 */
export default async function DashboardPage() {
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

  const savedProfiles = await listSavedProfiles();

  return (
    <DashboardWizard
      isLoggedIn={Boolean(user)}
      isSubscribed={isSubscribed}
      savedProfiles={savedProfiles}
    />
  );
}
