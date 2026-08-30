import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * האם Supabase מוגדר בסביבה הנוכחית.
 *
 * האתר הציבורי נבנה ועולה לאוויר גם לפני שהחיבור קיים — העמודים הסטטיים
 * לא תלויים בו. רק הפורטל וטופס יצירת הקשר דורשים אותו, והם בודקים זאת
 * לפני כל שימוש במקום להתרסק.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export async function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase אינו מוגדר. הגדירו NEXT_PUBLIC_SUPABASE_URL ו-NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // נקרא מתוך Server Component — רענון ה-session מטופל ב-middleware.
        }
      },
    },
  });
}
