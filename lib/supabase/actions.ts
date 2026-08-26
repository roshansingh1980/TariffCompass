"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { linkGhostUserData } from "@/lib/supabase/link-ghost-user";

export type AuthActionState = { error?: string; message?: string } | undefined;

export async function login(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { error: error?.message ?? "Failed to log in. Please try again." };
  }

  await linkGhostUserData(data.user.id);
  redirect("/dashboard");
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    return { error: error?.message ?? "Failed to sign up. Please try again." };
  }

  if (!data.session) {
    return { message: "Check your email to confirm your account, then log in." };
  }

  await linkGhostUserData(data.user.id);
  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
