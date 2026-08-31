// טיפוסים ועזרי תצוגה בלבד — הקובץ הזה נטען גם בדפדפן,
// ולכן אסור לו לייבא שום דבר צד-שרת. קריאות ל-Supabase יושבות
// ב-portal-server.ts.

export type Role = "admin" | "client";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
};

export type Project = {
  id: string;
  title: string;
  client_name: string | null;
  address: string | null;
  location: string | null;
  status: string;
  designer: string | null;
  description: string | null;
  start_date: string | null;
  target_completion: string | null;
  created_at: string;
};

export type Folder = {
  id: string;
  project_id: string;
  name: string;
  sort_order: number;
  is_client_inbox: boolean;
};

export type ProjectFile = {
  id: string;
  project_id: string;
  folder_id: string;
  name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  created_at: string;
};

export const STATUS_LABELS: Record<string, string> = {
  planning: "בתכנון",
  in_progress: "בביצוע",
  on_hold: "מושהה",
  completed: "הושלם",
};

export function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n < 10 && i > 0 ? n.toFixed(1) : Math.round(n)} ${units[i]}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
