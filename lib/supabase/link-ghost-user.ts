import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

const TEMP_USER_COOKIE = "tc_uid";

/**
 * If this browser has ghost/temporary data (saved via lib/supabase/save.ts
 * before the visitor had a real account), re-parent that data to their new
 * real account and clean up the ghost user.
 *
 * Our data model only ever creates one company per temp user, so "migration"
 * here is just re-pointing that company's user_id — no need for a general
 * multi-record migration engine. Never throws: a failed migration should
 * never block a successful login/signup, and worst case the ghost data is
 * simply left behind under the old (now orphaned) ghost account.
 */
export async function linkGhostUserData(realUserId: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const ghostUserId = cookieStore.get(TEMP_USER_COOKIE)?.value;
    if (!ghostUserId || ghostUserId === realUserId) return;

    const supabase = createAdminClient();

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: realUserId }, { onConflict: "id" });
    if (profileError) throw profileError;

    const { error: companiesError } = await supabase
      .from("companies")
      .update({ user_id: realUserId })
      .eq("user_id", ghostUserId);
    if (companiesError) throw companiesError;

    // Nothing references the ghost anymore — deleting it cascades to its
    // now-empty profile row.
    await supabase.auth.admin.deleteUser(ghostUserId);

    cookieStore.delete(TEMP_USER_COOKIE);
  } catch (error) {
    console.error("Failed to link ghost user data:", error);
  }
}
