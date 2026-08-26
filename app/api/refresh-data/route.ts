import { NextResponse } from "next/server";
import { refreshMarketData } from "@/lib/ai/refresh-market-data";

/**
 * Internal-only trigger for the market-data freshness review.
 *
 * Not linked from any UI and excluded from robots.txt. Requires a bearer
 * token matching REFRESH_DATA_SECRET — with no secret configured, this
 * fails closed (503) rather than running unprotected. Never called from
 * the browser; the Anthropic API key stays server-side inside
 * refreshMarketData().
 *
 * Usage: curl -X POST https://<host>/api/refresh-data \
 *   -H "Authorization: Bearer $REFRESH_DATA_SECRET"
 *
 * This only proposes changes — see lib/ai/refresh-market-data.ts and
 * lib/data/refresh-log.ts. Nothing here writes to market-data.ts.
 */
export async function POST(request: Request) {
  const secret = process.env.REFRESH_DATA_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "REFRESH_DATA_SECRET is not configured; refusing to run." },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await refreshMarketData();

  if (!result.ok) {
    console.error("[refresh-data] failed:", result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  console.log(
    `[refresh-data] ${result.checkedAt} — ${result.changes.length} proposed change(s): ${result.summary}`
  );
  if (result.changes.length > 0) {
    console.log("[refresh-data] proposed changes:", JSON.stringify(result.changes, null, 2));
  }

  return NextResponse.json(result);
}
