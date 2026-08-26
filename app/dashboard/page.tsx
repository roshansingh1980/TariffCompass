import { redirect } from "next/navigation";
import { DashboardWizard } from "@/components/onboarding/dashboard-wizard";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  const isSubscribed = profile?.subscription_status === "active";

  return <DashboardWizard isSubscribed={isSubscribed} />;
}
