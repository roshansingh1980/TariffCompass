import { DashboardWizard } from "@/components/onboarding/dashboard-wizard";
import { createClient } from "@/lib/supabase/server";
import { listSavedProfiles } from "@/lib/supabase/saved-profiles";
import { evaluateAndListExposureAlerts } from "@/lib/supabase/exposure-alerts";
import { parseHsLookupPrefill } from "@/lib/hs-lookup";

/**
 * Open to anonymous visitors — the wizard and Results table don't require an
 * account. isLoggedIn gates only the two things that do (AI Brief, saved
 * profiles); listSavedProfiles() already returns [] for no user.
 */
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ hs?: string; product?: string }> }) {
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
  const exposureAlerts = await evaluateAndListExposureAlerts();
  const lookupPrefill = parseHsLookupPrefill(await searchParams);

  return (
    <DashboardWizard
      isLoggedIn={Boolean(user)}
      isSubscribed={isSubscribed}
      savedProfiles={savedProfiles}
      initialExposureAlerts={exposureAlerts}
      lookupPrefill={lookupPrefill}
    />
  );
}
