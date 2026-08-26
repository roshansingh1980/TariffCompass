import type { MetadataRoute } from "next";
import { INSIGHTS } from "@/lib/insights-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/insights`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...INSIGHTS.map((article) => ({
      url: `${SITE_URL}/insights/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
