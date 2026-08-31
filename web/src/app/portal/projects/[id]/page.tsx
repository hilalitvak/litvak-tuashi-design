import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/portal-server";
import {
  STATUS_LABELS,
  formatDate,
  type Folder,
  type Project,
  type ProjectFile,
} from "@/lib/portal";
import { FileBrowser } from "./file-browser";
import { ClientAccess } from "./client-access";


// הפורטל תלוי ב-session של המשתמש, ולכן חייב להיבנות בזמן בקשה
// ולא מראש. בלי זה Next מנסה לעבד אותו בזמן build, כשאין עדיין מי שמחובר.
export const dynamic = "force-dynamic";


export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();

  // אם הפרויקט לא שייך למשתמש, ה-RLS פשוט לא יחזיר שורה — ומכאן 404.
  // לקוח לא יכול לגלות שפרויקט קיים בכלל ע"י ניחוש מזהה.
  const { data: project } = await supabase
    .from("projects")
    .select(
      "id, title, client_name, address, location, status, designer, description, start_date, target_completion, created_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (!project) notFound();

  const [{ data: folders }, { data: files }] = await Promise.all([
    supabase
      .from("project_folders")
      .select("id, project_id, name, sort_order, is_client_inbox")
      .eq("project_id", id)
      .order("sort_order"),
    supabase
      .from("project_files")
      .select(
        "id, project_id, folder_id, name, storage_path, mime_type, size_bytes, uploaded_by, created_at"
      )
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const isAdmin = profile.role === "admin";
  const p = project as Project;

  return (
    <div>
      <Link
        href="/portal"
        className="text-sm text-cream-dim transition-colors hover:text-cream"
      >
        ← לכל הפרויקטים
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-cream">
            {p.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cream-dim">
            {p.client_name && <span>{p.client_name}</span>}
            {(p.location || p.address) && <span>{p.location || p.address}</span>}
            <span>נפתח {formatDate(p.created_at)}</span>
          </div>
        </div>
        <span className="rounded-sm border border-ink-line px-3 py-1 text-xs text-sand">
          {STATUS_LABELS[p.status] ?? p.status}
        </span>
      </div>

      {p.description && (
        <p className="mt-5 max-w-2xl leading-relaxed text-cream-dim">
          {p.description}
        </p>
      )}

      {isAdmin && <ClientAccess projectId={p.id} />}

      <div className="mt-10">
        <FileBrowser
          projectId={p.id}
          isAdmin={isAdmin}
          userId={profile.id}
          folders={(folders as Folder[]) ?? []}
          files={(files as ProjectFile[]) ?? []}
        />
      </div>
    </div>
  );
}
