"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { CompanyInsert, ProductInsert } from "@/types/database";

export type OnboardingSelections = {
  scenario: string | null;
  country: string;
  province: string | null;
  usState: string | null;
  category: string | null;
  productName: string;
};

/**
 * Every caller of saveOnboardingSelections is gated behind isLoggedIn, so
 * this always resolves a real session user. Throws (rather than falling
 * back to any kind of synthetic user) if that invariant is ever violated —
 * the outer try/catch in saveOnboardingSelections logs it instead of
 * silently creating a row under no real owner.
 */
async function resolveUserId(): Promise<string> {
  const sessionClient = await createClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();
  if (!user) throw new Error("resolveUserId called with no signed-in user");
  return user.id;
}

async function ensureProfile(supabase: SupabaseClient, userId: string): Promise<void> {
  const { error } = await supabase.from("profiles").upsert({ id: userId }, { onConflict: "id" });
  if (error) throw error;
}

/**
 * One company per user for now — repeat visits to the Results screen
 * update the same row rather than piling up duplicates.
 */
async function upsertCompany(
  supabase: SupabaseClient,
  userId: string,
  selections: OnboardingSelections
): Promise<string> {
  const { data: existing, error: fetchError } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (fetchError) throw fetchError;

  const payload: CompanyInsert = {
    user_id: userId,
    // Placeholder until a real company-setup step exists.
    name: "My Business",
    province: selections.province,
    scenario: selections.scenario,
    country: selections.country,
    us_state: selections.usState,
  };

  if (existing) {
    const { error } = await supabase.from("companies").update(payload).eq("id", existing.id);
    if (error) throw error;
    return existing.id as string;
  }

  const { data, error } = await supabase.from("companies").insert(payload).select("id").single();
  if (error) throw error;
  return data.id as string;
}

/**
 * One product per company for now, mirroring upsertCompany — repeat saves
 * (e.g. editing a Results filter inline) update the same row instead of
 * accumulating duplicates.
 */
async function upsertProduct(
  supabase: SupabaseClient,
  companyId: string,
  selections: OnboardingSelections
): Promise<void> {
  const { data: existing, error: fetchError } = await supabase
    .from("products")
    .select("id")
    .eq("company_id", companyId)
    .maybeSingle();
  if (fetchError) throw fetchError;

  const payload: ProductInsert = {
    company_id: companyId,
    name: selections.productName || "Unnamed product",
    category: selections.category,
  };

  if (existing) {
    const { error } = await supabase.from("products").update(payload).eq("id", existing.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("products").insert(payload);
  if (error) throw error;
}

/**
 * Saves the onboarding selections to Supabase. Intentionally never throws —
 * the Results screen should never be blocked by a save failure.
 */
export async function saveOnboardingSelections(selections: OnboardingSelections): Promise<void> {
  try {
    const supabase = createAdminClient();
    const userId = await resolveUserId();
    await ensureProfile(supabase, userId);
    const companyId = await upsertCompany(supabase, userId, selections);
    await upsertProduct(supabase, companyId, selections);
  } catch (error) {
    console.error("Failed to save onboarding selections:", error);
  }
}
