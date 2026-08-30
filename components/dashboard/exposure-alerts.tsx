"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { dismissExposureAlert, markExposureAlertRead, type ExposureAlertsResult } from "@/lib/supabase/exposure-alerts";
import { formatExposureRange } from "@/lib/exposure";
import { markAlertReadState, removeDismissedAlert } from "@/lib/exposure-monitoring";
import { EmptyState } from "@/components/dashboard/empty-state";

function formatDate(value: string | null): string {
  if (!value) return "Unavailable";
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export function ExposureAlerts({ result, showEmptyState = false }: { result: ExposureAlertsResult; showEmptyState?: boolean }) {
  const [alerts, setAlerts] = useState(result.alerts);
  if (!result.available) {
    if (result.reason !== "migration_required" && result.reason !== "query_failed") {
      if (!showEmptyState) return null;
      return (
        <EmptyState
          icon={Bell}
          heading={result.reason === "not_authenticated" ? "Log in to view alerts" : "Upgrade to unlock alerts"}
          description={
            result.reason === "not_authenticated"
              ? "Alerts for your monitored exposures appear here once you're signed in."
              : "An active Business subscription is required for monitored-exposure alerts."
          }
          ctaLabel={result.reason === "not_authenticated" ? "Log in" : "See plans"}
          ctaHref={result.reason === "not_authenticated" ? "/login" : "/#pricing"}
        />
      );
    }
    return (
      <section className="mb-10 w-full max-w-3xl rounded-2xl border border-border/60 bg-foreground/[0.015] p-5">
        <h2 className="text-sm font-semibold">Changes affecting your saved exposures</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          {result.reason === "migration_required"
            ? "Saved-exposure alert storage has not been enabled yet. Existing profile saving remains available."
            : "Saved-exposure alerts could not be refreshed. Please try again later."}
        </p>
      </section>
    );
  }
  if (alerts.length === 0) {
    if (!showEmptyState) return null;
    return (
      <EmptyState
        icon={Bell}
        heading="No current alerts"
        description="You'll see an alert here as soon as a covered change affects one of your monitored exposures."
        ctaLabel="View monitored exposures"
        ctaHref="/dashboard/exposures"
      />
    );
  }

  async function markRead(id: string) {
    if (await markExposureAlertRead(id)) setAlerts((current) => current.map((alert) => alert.id === id ? markAlertReadState(alert, new Date().toISOString()) : alert));
  }

  async function dismiss(id: string) {
    if (await dismissExposureAlert(id)) setAlerts((current) => removeDismissedAlert(current, id));
  }

  return (
    <section className="mb-10 w-full max-w-3xl rounded-2xl border border-amber-500/25 bg-amber-500/[0.05] p-5">
      <h2 className="text-sm font-semibold tracking-tight">Changes affecting your saved exposures</h2>
      <div className="mt-4 max-h-[65vh] space-y-3 overflow-y-auto overscroll-contain pr-1">
        {alerts.map((alert) => (
          <article key={alert.id} className="rounded-xl border border-border/60 bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{alert.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{alert.summary}</p>
              </div>
              <span className="rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize">{alert.severity}</span>
            </div>
            <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-3">
              <dt className="text-muted-foreground">Effective</dt><dd>{formatDate(alert.effectiveDate)}</dd>
              <dt className="text-muted-foreground">Estimated incremental annual exposure</dt><dd className="font-semibold">{formatExposureRange(alert.financialImpact.newAdditionalExposure)}</dd>
              <dt className="text-muted-foreground">Status</dt><dd className="capitalize">{alert.measureStatus}</dd>
              <dt className="text-muted-foreground">Confidence</dt><dd className="capitalize">{alert.confidence}</dd>
            </dl>
            <details className="mt-3 text-xs text-muted-foreground">
              <summary className="cursor-pointer font-medium text-foreground">View change details</summary>
              <p className="mt-2"><span className="font-medium text-foreground">Before:</span> {alert.previousState.description}</p>
              <p className="mt-1"><span className="font-medium text-foreground">After:</span> {alert.newState.description}</p>
              <a href={alert.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-medium text-foreground underline underline-offset-2">Source: {alert.source.name}</a>
            </details>
            <div className="mt-4 flex gap-3 text-xs">
              {!alert.readAt && <button type="button" onClick={() => markRead(alert.id)} className="font-medium underline underline-offset-2">Mark as read</button>}
              <button type="button" onClick={() => dismiss(alert.id)} className="text-muted-foreground underline underline-offset-2">Dismiss</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
