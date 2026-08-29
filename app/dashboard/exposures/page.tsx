import { MonitoredExposures } from "@/components/dashboard/monitored-exposures";
import { getDashboardShellAuth } from "@/lib/dashboard/shell-auth";
import { listSavedProfiles } from "@/lib/supabase/saved-profiles";

export default async function MonitoredExposuresPage() {
  const [{ isLoggedIn }, profiles] = await Promise.all([getDashboardShellAuth(), listSavedProfiles()]);
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Monitored Exposures</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Saved products and trade routes TariffCompass evaluates against covered structured changes.</p>
      </div>
      <MonitoredExposures profiles={profiles} isLoggedIn={isLoggedIn} />
    </div>
  );
}
