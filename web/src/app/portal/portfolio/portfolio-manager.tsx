"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { img } from "@/lib/images";
import type { PortfolioProject } from "@/lib/portfolio";
import type { ActionState } from "../actions";
import {
  createPortfolioProject,
  deletePortfolioProject,
  reorderProject,
  updatePortfolioProject,
} from "./actions";

const field =
  "w-full rounded-sm border border-ink-line bg-ink px-4 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-cream-dim/50 focus:border-sand";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-cream px-6 py-2.5 text-sm text-ink transition-colors hover:bg-sand disabled:opacity-60"
    >
      {pending ? "שומר…" : label}
    </button>
  );
}

export function PortfolioManager({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const [state, action] = useActionState<ActionState, FormData>(
    createPortfolioProject,
    {}
  );

  function report(text: string, bad = false) {
    setMsg({ text, bad });
    setTimeout(() => setMsg(null), 6000);
  }

  async function run(fn: () => Promise<ActionState>) {
    setBusy(true);
    try {
      const r = await fn();
      if (r.error) report(r.error, true);
      else if (r.ok) report(r.ok);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="rounded-sm border border-ink-line px-5 py-2.5 text-sm text-cream transition-colors hover:border-sand hover:text-sand"
        >
          {adding ? "ביטול" : "+ פרויקט חדש"}
        </button>
        <span className="text-sm text-cream-dim">
          {projects.filter((p) => p.status === "active").length} מוצגים ·{" "}
          {projects.filter((p) => p.status !== "active").length} טיוטות
        </span>
      </div>

      {adding && (
        <form
          action={action}
          className="mt-5 rounded-sm border border-ink-line bg-ink-soft p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-xs text-cream-dim">
                שם הפרויקט <span className="text-sand">*</span>
              </label>
              <input id="title" name="title" required maxLength={200} className={field} />
            </div>
            <div>
              <label htmlFor="location" className="mb-1.5 block text-xs text-cream-dim">
                מיקום
              </label>
              <input id="location" name="location" maxLength={200} className={field} />
            </div>
            <div>
              <label htmlFor="category" className="mb-1.5 block text-xs text-cream-dim">
                קטגוריה
              </label>
              <select id="category" name="category" className={field}>
                <option value="">—</option>
                <option value="Residential">מגורים</option>
                <option value="Commercial">מסחרי</option>
              </select>
            </div>
            <div>
              <label htmlFor="slug" className="mb-1.5 block text-xs text-cream-dim">
                כתובת באתר (אנגלית, אופציונלי)
              </label>
              <input
                id="slug"
                name="slug"
                dir="ltr"
                placeholder="villa-tel-aviv"
                maxLength={80}
                className={`${field} text-right`}
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="description" className="mb-1.5 block text-xs text-cream-dim">
              תיאור
            </label>
            <textarea id="description" name="description" rows={3} maxLength={2000} className={field} />
          </div>

          {(state.error || state.ok) && (
            <p className={`mt-4 text-sm ${state.error ? "text-red-400" : "text-sand"}`}>
              {state.error ?? state.ok}
            </p>
          )}

          <div className="mt-5">
            <Submit label="צור פרויקט" />
          </div>
        </form>
      )}

      {msg && (
        <p
          role="status"
          className={`mt-5 rounded-sm border px-4 py-2.5 text-sm ${
            msg.bad ? "border-red-500/50 text-red-400" : "border-sand/50 text-sand"
          }`}
        >
          {msg.text}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {projects.map((p, i) => (
          <li
            key={p.id}
            className="rounded-sm border border-ink-line bg-ink-soft"
          >
            <div className="flex flex-wrap items-center gap-4 p-4">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-ink">
                {p.banner_image && (
                  <Image
                    src={img(p.banner_image)}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-cream">{p.title}</h2>
                  {p.status !== "active" && (
                    <span className="rounded-sm border border-ink-line px-2 py-0.5 text-xs text-cream-dim">
                      טיוטה
                    </span>
                  )}
                  {p.is_featured && (
                    <span className="rounded-sm border border-sand/50 px-2 py-0.5 text-xs text-sand">
                      מובחר
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-cream-dim">
                  {p.location || "—"} · {p.gallery.length} תמונות ·{" "}
                  <span dir="ltr">/{p.slug}</span>
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={busy || i === 0}
                  onClick={() => run(() => reorderProject(p.id, "up"))}
                  aria-label="הזז למעלה"
                  className="grid h-8 w-8 place-items-center rounded-sm border border-ink-line text-cream-dim transition-colors hover:text-cream disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={busy || i === projects.length - 1}
                  onClick={() => run(() => reorderProject(p.id, "down"))}
                  aria-label="הזז למטה"
                  className="grid h-8 w-8 place-items-center rounded-sm border border-ink-line text-cream-dim transition-colors hover:text-cream disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(open === p.id ? null : p.id)}
                  className="rounded-sm border border-ink-line px-3 py-1.5 text-xs text-cream-dim transition-colors hover:text-cream"
                >
                  {open === p.id ? "סגור" : "עריכה"}
                </button>
              </div>
            </div>

            {open === p.id && (
              <ProjectEditor
                project={p}
                busy={busy}
                run={run}
                report={report}
                router={router}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectEditor({
  project,
  busy,
  run,
  report,
  router,
}: {
  project: PortfolioProject;
  busy: boolean;
  run: (fn: () => Promise<ActionState>) => Promise<void>;
  report: (t: string, bad?: boolean) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const supabase = createClient();
    const added: string[] = [];

    try {
      let n = 0;
      for (const file of Array.from(files)) {
        setUploading(`מעלה ${++n} מתוך ${files.length}…`);
        const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
        const key = `${project.slug}-${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from("portfolio")
          .upload(key, file, { contentType: file.type || undefined });
        if (error) {
          report(`העלאת ${file.name} נכשלה: ${error.message}`, true);
          continue;
        }
        added.push(key);
      }

      if (added.length) {
        const gallery = [...project.gallery, ...added];
        // התמונה הראשונה שמועלית הופכת אוטומטית לתמונת השער.
        const patch: Record<string, unknown> = { gallery };
        if (!project.banner_image) patch.banner_image = added[0];
        await run(() => updatePortfolioProject(project.id, patch));
      }
    } finally {
      setUploading(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    }
  }

  const canPublish = project.gallery.length > 0 && project.banner_image;

  return (
    <div className="border-t border-ink-line p-5">
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        <button
          type="button"
          disabled={busy || !!uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-sm bg-cream px-4 py-2 text-sm text-ink transition-colors hover:bg-sand disabled:opacity-50"
        >
          {uploading ?? "הוספת תמונות"}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() =>
            run(() =>
              updatePortfolioProject(project.id, {
                is_featured: !project.is_featured,
              })
            )
          }
          className="rounded-sm border border-ink-line px-4 py-2 text-sm text-cream-dim transition-colors hover:text-cream disabled:opacity-50"
        >
          {project.is_featured ? "הסר ממובחרים" : "סמן כמובחר"}
        </button>

        <button
          type="button"
          disabled={busy || (project.status !== "active" && !canPublish)}
          title={
            project.status !== "active" && !canPublish
              ? "צריך לפחות תמונה אחת לפני פרסום"
              : undefined
          }
          onClick={() =>
            run(() =>
              updatePortfolioProject(project.id, {
                status: project.status === "active" ? "draft" : "active",
              })
            )
          }
          className="rounded-sm border border-ink-line px-4 py-2 text-sm text-cream-dim transition-colors hover:text-cream disabled:opacity-40"
        >
          {project.status === "active" ? "הסתר מהאתר" : "פרסם באתר"}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (
              window.confirm(
                `למחוק את "${project.title}" מתיק העבודות?\n\nהתמונות יישארו באחסון.`
              )
            )
              run(() => deletePortfolioProject(project.id));
          }}
          className="rounded-sm border border-ink-line px-4 py-2 text-sm text-red-400/80 transition-colors hover:text-red-400 disabled:opacity-50"
        >
          מחיקה
        </button>
      </div>

      {project.gallery.length > 0 && (
        <>
          <p className="mt-5 text-xs text-cream-dim">
            לחיצה על תמונה הופכת אותה לתמונת השער.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {project.gallery.map((name) => (
              <button
                key={name}
                type="button"
                disabled={busy}
                onClick={() =>
                  run(() =>
                    updatePortfolioProject(project.id, { banner_image: name })
                  )
                }
                className={`relative aspect-square overflow-hidden rounded-sm border-2 transition-colors ${
                  name === project.banner_image
                    ? "border-sand"
                    : "border-transparent hover:border-ink-line"
                }`}
              >
                <Image src={img(name)} alt="" fill sizes="120px" className="object-cover" />
                {name === project.banner_image && (
                  <span className="absolute inset-x-0 bottom-0 bg-sand/90 py-0.5 text-[10px] text-ink">
                    שער
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
