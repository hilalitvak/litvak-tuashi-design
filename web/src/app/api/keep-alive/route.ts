import { createPublicClient } from "@/lib/supabase/public";

// Supabase בתוכנית החינמית משהה פרויקט אחרי כשבוע בלי פעילות, ואז גם
// התמונות וגם הפרויקטים נעלמים מהאתר. העמודים סטטיים ולא פונים אליו בכל
// ביקור, אז Vercel Cron (ראו vercel.json) קורא לנתיב הזה פעם ביום כדי
// שתהיה לפחות שאילתה אחת אמיתית ביום.
//
// הקריאה היא אותה קריאה ציבורית שהאתר עושה ממילא, מוגבלת ע"י RLS לפרויקטים
// פעילים. אם CRON_SECRET מוגדר ב-Vercel, רק Vercel Cron יכול להפעיל אותה.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return Response.json({ ok: false, error: "Supabase is not configured" }, { status: 500 });
  }

  const { error } = await supabase.from("portfolio_projects").select("id").limit(1);
  if (error) {
    console.error("keep-alive", error);
    return Response.json({ ok: false, error: error.message }, { status: 502 });
  }
  return Response.json({ ok: true });
}
