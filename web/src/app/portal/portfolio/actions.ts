"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/portal-server";
import type { ActionState } from "../actions";

async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("פעולה זו מותרת למנהלים בלבד.");
  }
}

/** עמודי התיק סטטיים, ולכן כל שינוי מחייב רענון שלהם. */
function refreshPublicPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  if (slug) revalidatePath(`/projects/${slug}`);
  revalidatePath("/portal/portfolio");
}

/**
 * כותרות הפרויקטים בעברית, וכתובת URL עברית נראית שבורה כשמעתיקים אותה.
 * לכן נוצר slug באנגלית מהתעתיק, ואם אין — מזהה קצר.
 */
function slugify(input: string): string {
  const clean = input
    .trim()
    .toLowerCase()
    .replace(/[^\w֐-׿\s-]/g, "")
    .replace(/\s+/g, "-");

  const ascii = clean.replace(/[^\w-]/g, "");
  return ascii.length >= 3
    ? ascii
    : `project-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createPortfolioProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) return { error: "נא להזין שם לפרויקט." };

  const supabase = await createClient();

  const { data: top } = await supabase
    .from("portfolio_projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("portfolio_projects").insert({
    slug: slugInput ? slugify(slugInput) : slugify(title),
    title,
    location: location || null,
    category: category || null,
    description: description || null,
    banner_image: "",
    gallery: [],
    is_featured: false,
    // פרויקט חדש נכנס לראש הרשימה — זו העבודה האחרונה.
    sort_order: (top?.sort_order ?? 0) + 1,
    // נשמר מוסתר עד שיהיו לו תמונות, כדי שלא יופיע ריק באתר.
    status: "draft",
  });

  if (error) {
    if (error.code === "23505")
      return { error: "כבר קיים פרויקט עם כתובת זהה. בחרו שם אחר." };
    console.error("createPortfolioProject", error);
    return { error: "יצירת הפרויקט נכשלה." };
  }

  refreshPublicPages();
  return {
    ok: "הפרויקט נוצר כטיוטה. הוסיפו תמונות ואז פרסמו אותו.",
  };
}

export async function updatePortfolioProject(
  id: string,
  patch: Record<string, unknown>
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_projects")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error) {
    console.error("updatePortfolioProject", error);
    return { error: "העדכון נכשל." };
  }

  refreshPublicPages(data?.slug);
  return { ok: "עודכן." };
}

export async function deletePortfolioProject(
  id: string
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const supabase = await createClient();

  // התמונות נשארות באחסון בכוונה — הן עשויות לשמש פרויקט אחר,
  // ומחיקה בטעות של פרויקט לא צריכה לאבד אותן.
  const { data } = await supabase
    .from("portfolio_projects")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("id", id);

  if (error) return { error: "המחיקה נכשלה." };

  refreshPublicPages(data?.slug);
  return { ok: "הפרויקט נמחק. התמונות נשארו באחסון." };
}

/** החלפת מיקום בין שני פרויקטים ברשימה. */
export async function reorderProject(
  id: string,
  direction: "up" | "down"
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const supabase = await createClient();
  const { data: all } = await supabase
    .from("portfolio_projects")
    .select("id, sort_order")
    .order("sort_order", { ascending: false });

  if (!all) return { error: "העדכון נכשל." };

  const i = all.findIndex((p) => p.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= all.length) return {};

  await supabase
    .from("portfolio_projects")
    .update({ sort_order: all[j].sort_order })
    .eq("id", all[i].id);
  await supabase
    .from("portfolio_projects")
    .update({ sort_order: all[i].sort_order })
    .eq("id", all[j].id);

  refreshPublicPages();
  return { ok: "הסדר עודכן." };
}
