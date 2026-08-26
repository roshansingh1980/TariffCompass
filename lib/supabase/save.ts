"use server";

import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { CompanyInsert, ProductInsert } from "@/types/database";

const TEMP_USER_COOKIE = "tc_uid";

export type OnboardingSelections = {
  scenario: string | null;
  country: string;
  province: string | null;
  usState: string | null;
  category: string | null;
  productName: string;
};

/**
 * Prefer a real, logged-in user if one exists. Otherwise fall back to the
 * ghost/temporary user mechanism below. This means the moment someone logs
 * in, every future save uses their real auth.uid() — no ghost involved.
 */
async function resolveUserId(supabase: SupabaseClient): Promise<string> {
  const sessionClient = await createClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();
  if (user) return user.id;

  return getOrCreateTempUserId(supabase);
}

/**
 * We don't have authentication for every visitor yet. Rather than persisting
 * data under no user at all, we create a real (but synthetic/"ghost") row in
 * auth.users via the Admin API and remember its id in an httpOnly cookie.
 * This keeps every foreign key and RLS policy intact, and — because it's a
 * genuine auth.users row — it can be linked to a real account later (see
 * lib/supabase/link-ghost-user.ts) without any data loss. The admin API
 * requires an email or phone, so we use one on the reserved `.invalid` TLD
 * (RFC 2606) — guaranteed to never resolve or receive mail.
 */
async function getOrCreateTempUserId(supabase: SupabaseClient): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(TEMP_USER_COOKIE)?.value;
  if (existing) return existing;

  const email = `guest-${crypto.randomUUID()}@temp.tariffcompass.invalid`;
  const { data, error } = await supabase.auth.admin.createUser({ email });
  if (error || !data.user) {
    throw error ?? new Error("Failed to create a temporary user reference");
  }

  cookieStore.set(TEMP_USER_COOKIE, data.user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return data.user.id;
}

async function ensureProfile(supabase: SupabaseClient, userId: string): Promise<void> {
  const { error } = await supabase.from("profiles").upsert({ id: userId }, { onConflict: "id" });
  if (error) throw error;
}

/**
 * One company per (temporary) user for now — repeat visits to the Results
 * screen update the same row rather than piling up duplicates.
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
    const userId = await resolveUserId(supabase);
    await ensureProfile(supabase, userId);
    const companyId = await upsertCompany(supabase, userId, selections);
    await upsertProduct(supabase, companyId, selections);
  } catch (error) {
    console.error("Failed to save onboarding selections:", error);
  }
}
