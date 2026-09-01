import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * לקוח לקריאות ציבוריות בלבד — תיק העבודות.
 *
 * בלי עוגיות ובלי session, ולכן אפשר להשתמש בו גם ב-generateStaticParams
 * שרץ בזמן בנייה כשאין בקשת HTTP. הגישה מוגבלת ממילא ע"י ה-RLS:
 * anon רשאי לקרוא רק פרויקטים במצב active.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
