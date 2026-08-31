import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/portal";

/**
 * הפרופיל של המשתמש המחובר, או null.
 *
 * הטריגר handle_new_user יוצר את הפרופיל בהרשמה, אבל בכניסה הראשונה
 * ייתכן מרוץ קצר שבו ה-session כבר קיים והשורה עדיין לא — לכן null
 * הוא מצב תקין שצריך לטפל בו, לא שגיאה.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return (data as Profile) ?? null;
}
