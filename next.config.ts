import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Makes `next dev` use the same Cloudflare bindings/runtime shims that
// `opennextjs-cloudflare preview` and the deployed Worker use, so local dev
// doesn't silently diverge from production. No-op outside Cloudflare tooling.
initOpenNextCloudflareForDev();
