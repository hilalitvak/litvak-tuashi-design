"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const MAX = { name: 120, email: 200, phone: 40, subject: 200, message: 5000 };

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!full_name || !email || !message) {
    return { status: "error", message: "נא למלא שם, אימייל והודעה." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "כתובת האימייל אינה תקינה." };
  }
  if (
    full_name.length > MAX.name ||
    email.length > MAX.email ||
    phone.length > MAX.phone ||
    subject.length > MAX.subject ||
    message.length > MAX.message
  ) {
    return { status: "error", message: "אחד השדות ארוך מדי." };
  }

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message:
        "טופס יצירת הקשר עדיין לא חובר למסד הנתונים. בינתיים אפשר לפנות אלינו במייל או בטלפון.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      full_name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
    });

    if (error) {
      console.error("contact_messages insert failed", error);
      return {
        status: "error",
        message: "שליחת ההודעה נכשלה. נסו שוב או פנו אלינו ישירות.",
      };
    }
  } catch (err) {
    console.error("contact submit failed", err);
    return {
      status: "error",
      message: "שליחת ההודעה נכשלה. נסו שוב או פנו אלינו ישירות.",
    };
  }

  return {
    status: "success",
    message: "ההודעה נשלחה. נחזור אליכם בהקדם האפשרי.",
  };
}
