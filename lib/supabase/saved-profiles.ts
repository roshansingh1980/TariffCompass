"use server";

import { createClient } from "@/lib/supabase/server";
import type { SavedProfile } from "@/types/database";

export type SaveProfileInput = {
  name: string;
  scenario: string | null;
  country: string;
  province: string | null;
  usState: string | null;
  category: string | null;
};

export type SaveProfileResult = { error: string } | { success: true; id: string };
export type DeleteProfileResult = { error: string } | { success: true };

/** Every caller is already behind the auth-gated /dashboard, so this only ever runs for a real signed-in user. */
export async function listSavedProfiles(): Promise<SavedProfile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("saved_profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to list saved profiles:", error);
    return [];
  }
  return data ?? [];
}

export async function saveProfile(input: SaveProfileInput): Promise<SaveProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please log in to save a profile." };
  }

  const name = input.name.trim();
  if (!name) {
    return { error: "Give this profile a name before saving." };
  }

  const { data, error } = await supabase
    .from("saved_profiles")
    .insert({
      user_id: user.id,
      name,
      scenario: input.scenario,
      country: input.country,
      province: input.province,
      us_state: input.usState,
      category: input.category,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to save profile:", error);
    return { error: "Something went wrong saving this profile. Please try again." };
  }
  return { success: true, id: data.id };
}

export async function deleteProfile(id: string): Promise<DeleteProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please log in to manage saved profiles." };
  }

  const { error } = await supabase
    .from("saved_profiles")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete profile:", error);
    return { error: "Something went wrong deleting this profile. Please try again." };
  }
  return { success: true };
}
