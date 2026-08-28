import { NextResponse } from "next/server";
import { parseUsitcSearchResponse } from "@/lib/hs-search";

const USITC_SEARCH_URL = "https://hts.usitc.gov/reststop/search";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 3 || query.length > 120) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const response = await fetch(`${USITC_SEARCH_URL}?keyword=${encodeURIComponent(query)}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: 86_400 },
    });
    if (!response.ok) throw new Error(`USITC returned HTTP ${response.status}`);

    const suggestions = parseUsitcSearchResponse(await response.json(), query);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("USITC HS search unavailable:", error);
    return NextResponse.json({ suggestions: [] }, { status: 503 });
  }
}
