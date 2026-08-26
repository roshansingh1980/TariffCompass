import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default config: no ISR/on-demand-revalidation cache backend configured.
// Nearly every route in this app is dynamic (auth-gated or per-request
// data), so there's no meaningful build-time cache to persist yet. If
// static/ISR pages are added later, wire up an incremental cache override
// here (e.g. the R2-backed one) rather than assuming this default still fits.
export default defineCloudflareConfig();
