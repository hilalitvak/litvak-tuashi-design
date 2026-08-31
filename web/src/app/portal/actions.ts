"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/portal-server";

export type ActionState = { error?: string; ok?: string };

/**
 * הערה על אבטחה: הבדיקות כאן הן נוחות למשתמש, לא קו ההגנה.
 * גם אם מישהו יקרא ל-action הזה ישירות, ה-RLS בבסיס הנתונים
 * יחזיר שגיאה. שתי השכבות מכוונות, וה-RLS הוא הקובע.
 */
async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("פעולה זו מותרת למנהלים בלבד.");
  }
  return profile;
}

export async function createProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const title = String(formData.get("title") ?? "").trim();
  const client_name = String(formData.get("client_name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!title) return { error: "נא להזין שם לפרויקט." };
  if (title.length > 200) return { error: "שם הפרויקט ארוך מדי." };

  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert({
    title,
    client_name: client_name || null,
    location: location || null,
  });

  if (error) {
    console.error("createProject", error);
    return { error: "יצירת הפרויקט נכשלה." };
  }

  revalidatePath("/portal");
  return { ok: "הפרויקט נוצר, ושבע ספריות נוצרו לו אוטומטית." };
}

export async function addFolder(
  projectId: string,
  name: string
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const clean = name.trim();
  if (!clean) return { error: "נא להזין שם לספרייה." };
  if (clean.length > 100) return { error: "שם הספרייה ארוך מדי." };

  const supabase = await createClient();

  // ספרייה חדשה נכנסת לסוף הרשימה.
  const { data: last } = await supabase
    .from("project_folders")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("project_folders").insert({
    project_id: projectId,
    name: clean,
    sort_order: (last?.sort_order ?? 0) + 1,
  });

  if (error) {
    console.error("addFolder", error);
    return { error: "יצירת הספרייה נכשלה." };
  }

  revalidatePath(`/portal/projects/${projectId}`);
  return { ok: "הספרייה נוספה." };
}

export async function renameFolder(
  projectId: string,
  folderId: string,
  name: string
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const clean = name.trim();
  if (!clean) return { error: "השם לא יכול להיות ריק." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("project_folders")
    .update({ name: clean })
    .eq("id", folderId);

  if (error) return { error: "שינוי השם נכשל." };

  revalidatePath(`/portal/projects/${projectId}`);
  return { ok: "השם עודכן." };
}

export async function deleteFolder(
  projectId: string,
  folderId: string
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const supabase = await createClient();

  const { data: folder } = await supabase
    .from("project_folders")
    .select("is_client_inbox")
    .eq("id", folderId)
    .maybeSingle();

  // תיבת ההעלאות היא הדרך היחידה של הלקוח להעלות קבצים.
  // מחיקתה הייתה משביתה אותו בלי שיבין למה.
  if (folder?.is_client_inbox) {
    return {
      error:
        "אי אפשר למחוק את תיבת ההעלאות — זו הספרייה היחידה שדרכה הלקוח מעלה קבצים.",
    };
  }

  // מוחקים קודם את הקבצים מהאחסון; מחיקת השורות עצמן מתבצעת ב-cascade.
  const { data: files } = await supabase
    .from("project_files")
    .select("storage_path")
    .eq("folder_id", folderId);

  if (files?.length) {
    await supabase.storage
      .from("project-files")
      .remove(files.map((f) => f.storage_path));
  }

  const { error } = await supabase
    .from("project_folders")
    .delete()
    .eq("id", folderId);

  if (error) return { error: "מחיקת הספרייה נכשלה." };

  revalidatePath(`/portal/projects/${projectId}`);
  return { ok: "הספרייה נמחקה." };
}

/**
 * העברת תפקיד "תיבת ההעלאות" לספרייה אחרת.
 *
 * קיים אינדקס ייחודי שמתיר תיבה אחת לכל פרויקט, ולכן מנקים קודם את הדגל
 * מכל הספריות ורק אז מסמנים את החדשה. הסדר הזה חשוב — הפוך היה מפר אותו.
 */
export async function setClientInbox(
  projectId: string,
  folderId: string
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const supabase = await createClient();

  const { error: clearErr } = await supabase
    .from("project_folders")
    .update({ is_client_inbox: false })
    .eq("project_id", projectId);

  if (clearErr) return { error: "העדכון נכשל." };

  const { error } = await supabase
    .from("project_folders")
    .update({ is_client_inbox: true })
    .eq("id", folderId);

  if (error) {
    console.error("setClientInbox", error);
    return { error: "העדכון נכשל. ייתכן שהפרויקט נשאר בלי תיבת העלאות." };
  }

  revalidatePath(`/portal/projects/${projectId}`);
  return { ok: "זו עכשיו תיבת ההעלאות של הלקוח." };
}

export async function renameFile(
  projectId: string,
  fileId: string,
  name: string
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const clean = name.trim();
  if (!clean) return { error: "השם לא יכול להיות ריק." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("project_files")
    .update({ name: clean, updated_at: new Date().toISOString() })
    .eq("id", fileId);

  if (error) return { error: "שינוי השם נכשל." };

  revalidatePath(`/portal/projects/${projectId}`);
  return { ok: "השם עודכן." };
}

/** הזזת קובץ בין ספריות. רק רשומת ה-DB זזה; הקובץ באחסון נשאר במקומו. */
export async function moveFile(
  projectId: string,
  fileId: string,
  folderId: string
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("project_files")
    .update({ folder_id: folderId, updated_at: new Date().toISOString() })
    .eq("id", fileId);

  if (error) return { error: "העברת הקובץ נכשלה." };

  revalidatePath(`/portal/projects/${projectId}`);
  return { ok: "הקובץ הועבר." };
}

export async function deleteFile(
  projectId: string,
  fileId: string
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const supabase = await createClient();

  const { data: file } = await supabase
    .from("project_files")
    .select("storage_path")
    .eq("id", fileId)
    .maybeSingle();

  if (file?.storage_path) {
    await supabase.storage.from("project-files").remove([file.storage_path]);
  }

  const { error } = await supabase
    .from("project_files")
    .delete()
    .eq("id", fileId);

  if (error) return { error: "מחיקת הקובץ נכשלה." };

  revalidatePath(`/portal/projects/${projectId}`);
  return { ok: "הקובץ נמחק." };
}

/** שיוך לקוח לפרויקט לפי אימייל. הלקוח חייב להיות רשום כבר. */
export async function linkClient(
  projectId: string,
  email: string
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const clean = email.trim().toLowerCase();
  if (!clean) return { error: "נא להזין אימייל." };

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", clean)
    .maybeSingle();

  if (!profile) {
    return {
      error:
        "לא נמצא משתמש עם האימייל הזה. הלקוח צריך להיכנס פעם אחת דרך עמוד הכניסה, ואז אפשר לשייך אותו.",
    };
  }

  const { error } = await supabase
    .from("project_clients")
    .insert({ project_id: projectId, user_id: profile.id });

  if (error) {
    // 23505 = הרשומה כבר קיימת
    if (error.code === "23505") return { error: "הלקוח כבר משויך לפרויקט." };
    console.error("linkClient", error);
    return { error: "השיוך נכשל." };
  }

  revalidatePath(`/portal/projects/${projectId}`);
  return { ok: "הלקוח שויך לפרויקט." };
}

/** קישור הורדה חתום, בתוקף לחמש דקות. הדלי עצמו פרטי. */
export async function getDownloadUrl(
  storagePath: string
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("project-files")
    .createSignedUrl(storagePath, 300);

  if (error || !data) return { error: "יצירת קישור ההורדה נכשלה." };
  return { url: data.signedUrl };
}
