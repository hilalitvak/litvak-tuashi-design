import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/portal-server";
import { STATUS_LABELS, formatDate, type Project } from "@/lib/portal";
import { NewProjectForm } from "./new-project-form";


// הפורטל תלוי ב-session של המשתמש, ולכן חייב להיבנות בזמן בקשה
// ולא מראש. בלי זה Next מנסה לעבד אותו בזמן build, כשאין עדיין מי שמחובר.
export const dynamic = "force-dynamic";


export default async function PortalHome() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();

  // אין כאן סינון לפי משתמש — ה-RLS כבר מחזיר לאדמין את הכול
  // וללקוח רק את הפרויקטים שהוא משויך אליהם.
  const { data } = await supabase
    .from("projects")
    .select(
      "id, title, client_name, address, location, status, designer, description, start_date, target_completion, created_at"
    )
    .order("created_at", { ascending: false });

  const projects = (data as Project[]) ?? [];
  const isAdmin = profile.role === "admin";

  // ללקוח עם פרויקט אחד אין טעם להציג רשימה של פריט אחד.
  if (!isAdmin && projects.length === 1) {
    redirect(`/portal/projects/${projects[0].id}`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-cream">
            {isAdmin ? "הפרויקטים" : "הפרויקטים שלי"}
          </h1>
          <p className="mt-2 text-sm text-cream-dim">
            {isAdmin
              ? `${projects.length} פרויקטים במערכת`
              : "לחצו על פרויקט כדי לראות את הקבצים והתקדמות העבודה"}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-8">
          <NewProjectForm />
        </div>
      )}

      {projects.length === 0 ? (
        <p className="mt-10 rounded-sm border border-ink-line bg-ink-soft px-6 py-10 text-center text-cream-dim">
          {isAdmin
            ? "עדיין אין פרויקטים. צרו את הראשון למעלה — שבע ספריות ייווצרו לו אוטומטית."
            : "עדיין לא שויך אליכם פרויקט. סיגל או בן ישייכו אתכם בקרוב."}
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/portal/projects/${p.id}`}
                className="block rounded-sm border border-ink-line bg-ink-soft p-6 transition-colors hover:border-sand"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-light text-cream">
                    {p.title}
                  </h2>
                  <span className="shrink-0 rounded-sm border border-ink-line px-2 py-0.5 text-xs text-sand">
                    {STATUS_LABELS[p.status] ?? p.status}
                  </span>
                </div>

                <dl className="mt-4 space-y-1 text-sm text-cream-dim">
                  {p.client_name && (
                    <div className="flex gap-2">
                      <dt>לקוח:</dt>
                      <dd>{p.client_name}</dd>
                    </div>
                  )}
                  {(p.location || p.address) && (
                    <div className="flex gap-2">
                      <dt>מיקום:</dt>
                      <dd>{p.location || p.address}</dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt>נפתח:</dt>
                    <dd>{formatDate(p.created_at)}</dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
