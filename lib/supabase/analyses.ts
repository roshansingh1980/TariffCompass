"use server";

import { createClient } from "@/lib/supabase/server";
import type { MarketDataRow } from "@/lib/data/db-market-data";
import type { ApplicableTradeMeasure } from "@/lib/data/canada-counter-tariffs-2026";
import type { FinancialImpact } from "@/lib/exposure";

export type AnalysisRateSnapshot = {
  comparisonRows: MarketDataRow[];
  currentImpact: FinancialImpact;
  additionalImpact: FinancialImpact | null;
  tradeMeasure: ApplicableTradeMeasure | null;
};

export type RecordAnalysisInput = {
  category: string | null;
  hsCode: string | null;
  annualValue: number;
  currency: string | null;
  destinationCountry: string;
  computedRateMin: number;
  computedRateMax: number;
  exposureLow: number;
  exposureMid: number | null;
  exposureHigh: number;
  rateSnapshot: AnalysisRateSnapshot;
};

/**
 * Logs one row to the `analyses` history table for a real, logged-in user.
 * Intentionally never throws — this is a background log, not something that
 * should ever block or error out the Results screen the user is looking at.
 */
export async function recordAnalysis(input: RecordAnalysisInput): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("analyses").insert({
      user_id: user.id,
      saved_profile_id: null,
      category: input.category,
      hs_code: input.hsCode,
      annual_value: input.annualValue,
      currency: input.currency,
      destination_country: input.destinationCountry,
      computed_rate_min: input.computedRateMin,
      computed_rate_max: input.computedRateMax,
      exposure_low: input.exposureLow,
      exposure_mid: input.exposureMid,
      exposure_high: input.exposureHigh,
      rate_snapshot: input.rateSnapshot,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Failed to record analysis:", error);
  }
}
