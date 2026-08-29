import { ExposureAlerts } from "@/components/dashboard/exposure-alerts";
import { evaluateAndListExposureAlerts } from "@/lib/supabase/exposure-alerts";

export default async function AlertsPage() {
  const alerts = await evaluateAndListExposureAlerts();
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Alerts</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Structured trade-policy changes matched to your monitored exposures.</p>
      </div>
      <ExposureAlerts result={alerts} showEmptyState />
    </div>
  );
}
