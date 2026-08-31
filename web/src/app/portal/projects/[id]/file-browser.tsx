"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatBytes, formatDate, type Folder, type ProjectFile } from "@/lib/portal";
import {
  addFolder,
  deleteFile,
  deleteFolder,
  getDownloadUrl,
  moveFile,
  renameFile,
  renameFolder,
  setClientInbox,
} from "../../actions";

type Props = {
  projectId: string;
  isAdmin: boolean;
  userId: string;
  folders: Folder[];
  files: ProjectFile[];
};

export function FileBrowser({
  projectId,
  isAdmin,
  userId,
  folders,
  files,
}: Props) {
  const router = useRouter();
  const [active, setActive] = useState(folders[0]?.id ?? null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const inbox = useMemo(
    () => folders.find((f) => f.is_client_inbox) ?? null,
    [folders]
  );
  const activeFolder = folders.find((f) => f.id === active) ?? null;
  const visible = files.filter((f) => f.folder_id === active);

  // הלקוח מעלה רק דרך תיבת ההעלאות. המנהל — לכל ספרייה.
  const canUploadHere =
    activeFolder && (isAdmin || activeFolder.is_client_inbox);

  function report(text: string, bad = false) {
    setMsg({ text, bad });
    setTimeout(() => setMsg(null), 6000);
  }

  async function run(fn: () => Promise<{ error?: string; ok?: string }>) {
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

  async function upload(fileList: FileList | null) {
    if (!fileList?.length || !activeFolder) return;
    setBusy(true);
    const supabase = createClient();
    let done = 0;

    try {
      for (const file of Array.from(fileList)) {
        setProgress(`מעלה ${++done} מתוך ${fileList.length}…`);

        // שם ייחודי כדי ששני קבצים באותו שם לא ידרסו זה את זה.
        const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
        const key = `${projectId}/${activeFolder.id}/${crypto.randomUUID()}${
          ext ? "." + ext : ""
        }`;

        const { error: upErr } = await supabase.storage
          .from("project-files")
          .upload(key, file, { contentType: file.type || undefined });

        if (upErr) {
          report(`העלאת ${file.name} נכשלה: ${upErr.message}`, true);
          continue;
        }

        const { error: rowErr } = await supabase.from("project_files").insert({
          project_id: projectId,
          folder_id: activeFolder.id,
          name: file.name,
          storage_path: key,
          mime_type: file.type || null,
          size_bytes: file.size,
          uploaded_by: userId,
        });

        // אם רישום השורה נכשל, לא משאירים קובץ יתום באחסון.
        if (rowErr) {
          await supabase.storage.from("project-files").remove([key]);
          report(`רישום ${file.name} נכשל: ${rowErr.message}`, true);
        }
      }

      report(
        isAdmin
          ? "הקבצים הועלו."
          : "הקבצים הועלו. סיגל ובן קיבלו התראה."
      );
      router.refresh();
    } finally {
      setProgress(null);
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function download(file: ProjectFile) {
    const { url, error } = await getDownloadUrl(file.storage_path);
    if (error || !url) return report(error ?? "ההורדה נכשלה.", true);
    window.open(url, "_blank", "noopener");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-light text-cream">קבצים</h2>
          <p className="mt-1 text-sm text-cream-dim">
            {isAdmin
              ? "אפשר להוסיף ספריות, לשנות שמות, להעביר קבצים ולמחוק."
              : inbox
                ? `אפשר לצפות בכל הספריות ולהעלות קבצים דרך "${inbox.name}".`
                : "אפשר לצפות בכל הספריות."}
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              const name = window.prompt("שם הספרייה החדשה:");
              if (name) run(() => addFolder(projectId, name));
            }}
            className="rounded-sm border border-ink-line px-4 py-2 text-sm text-cream transition-colors hover:border-sand hover:text-sand disabled:opacity-50"
          >
            + ספרייה
          </button>
        )}
      </div>

      {msg && (
        <p
          role="status"
          className={`mt-4 rounded-sm border px-4 py-2.5 text-sm ${
            msg.bad
              ? "border-red-500/50 text-red-400"
              : "border-sand/50 text-sand"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        {/* רשימת הספריות */}
        <nav>
          <ul className="space-y-1">
            {folders.map((f) => {
              const count = files.filter((x) => x.folder_id === f.id).length;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => setActive(f.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-sm px-3 py-2.5 text-right text-sm transition-colors ${
                      active === f.id
                        ? "bg-ink-soft text-cream"
                        : "text-cream-dim hover:bg-ink-soft/60 hover:text-cream"
                    }`}
                  >
                    <span className="truncate">
                      {f.name}
                      {f.is_client_inbox && (
                        <span className="mr-1.5 text-xs text-sand">●</span>
                      )}
                    </span>
                    <span className="shrink-0 text-xs text-cream-dim/70">
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {inbox && (
            <p className="mt-4 px-3 text-xs leading-relaxed text-cream-dim/70">
              <span className="text-sand">●</span> תיבת ההעלאות — הספרייה שדרכה
              הלקוח מעלה קבצים.
            </p>
          )}
        </nav>

        {/* תוכן הספרייה */}
        <div className="rounded-sm border border-ink-line bg-ink-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-line px-5 py-4">
            <h3 className="text-cream">{activeFolder?.name ?? "—"}</h3>

            <div className="flex items-center gap-2">
              {canUploadHere && (
                <>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => upload(e.target.files)}
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => inputRef.current?.click()}
                    className="rounded-sm bg-cream px-4 py-2 text-sm text-ink transition-colors hover:bg-sand disabled:opacity-50"
                  >
                    {progress ?? "העלאת קבצים"}
                  </button>
                </>
              )}

              {isAdmin && activeFolder && (
                <>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      const name = window.prompt(
                        "שם חדש לספרייה:",
                        activeFolder.name
                      );
                      if (name)
                        run(() =>
                          renameFolder(projectId, activeFolder.id, name)
                        );
                    }}
                    className="rounded-sm border border-ink-line px-3 py-2 text-xs text-cream-dim transition-colors hover:text-cream disabled:opacity-50"
                  >
                    שינוי שם
                  </button>

                  {!activeFolder.is_client_inbox && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        if (
                          window.confirm(
                            `להפוך את "${activeFolder.name}" לתיבת ההעלאות של הלקוח?\n\n` +
                              `"${inbox?.name ?? "הספרייה הנוכחית"}" תפסיק לשמש לכך, ואז אפשר יהיה למחוק אותה.`
                          )
                        )
                          run(() => setClientInbox(projectId, activeFolder.id));
                      }}
                      className="rounded-sm border border-ink-line px-3 py-2 text-xs text-cream-dim transition-colors hover:text-cream disabled:opacity-50"
                    >
                      הפוך לתיבת העלאות
                    </button>
                  )}
                  {activeFolder.is_client_inbox ? (
                    <span
                      title="כדי למחוק ספרייה זו, יש להפוך קודם ספרייה אחרת לתיבת ההעלאות"
                      className="px-3 py-2 text-xs text-cream-dim/60"
                    >
                      תיבת ההעלאות — לא ניתנת למחיקה
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        const n = files.filter(
                          (x) => x.folder_id === activeFolder.id
                        ).length;
                        if (
                          window.confirm(
                            n
                              ? `מחיקת "${activeFolder.name}" תמחק גם ${n} קבצים שבתוכה. להמשיך?`
                              : `למחוק את "${activeFolder.name}"?`
                          )
                        ) {
                          run(() => deleteFolder(projectId, activeFolder.id));
                          setActive(folders[0]?.id ?? null);
                        }
                      }}
                      className="rounded-sm border border-ink-line px-3 py-2 text-xs text-red-400/80 transition-colors hover:text-red-400 disabled:opacity-50"
                    >
                      מחיקה
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-cream-dim">
              {canUploadHere
                ? "אין כאן קבצים עדיין."
                : "אין כאן קבצים."}
            </p>
          ) : (
            <ul className="divide-y divide-ink-line/60">
              {visible.map((file) => (
                <li
                  key={file.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                >
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => download(file)}
                      className="block max-w-full truncate text-right text-sm text-cream transition-colors hover:text-sand"
                    >
                      {file.name}
                    </button>
                    <p className="mt-0.5 text-xs text-cream-dim">
                      {formatBytes(file.size_bytes)} · {formatDate(file.created_at)}
                    </p>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <select
                        disabled={busy}
                        value={file.folder_id}
                        onChange={(e) =>
                          run(() =>
                            moveFile(projectId, file.id, e.target.value)
                          )
                        }
                        aria-label={`העברת ${file.name} לספרייה אחרת`}
                        className="rounded-sm border border-ink-line bg-ink px-2 py-1.5 text-xs text-cream-dim outline-none focus:border-sand"
                      >
                        {folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          const name = window.prompt(
                            "שם חדש לקובץ:",
                            file.name
                          );
                          if (name)
                            run(() => renameFile(projectId, file.id, name));
                        }}
                        className="text-xs text-cream-dim transition-colors hover:text-cream disabled:opacity-50"
                      >
                        שינוי שם
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          if (window.confirm(`למחוק את "${file.name}"?`))
                            run(() => deleteFile(projectId, file.id));
                        }}
                        className="text-xs text-red-400/80 transition-colors hover:text-red-400 disabled:opacity-50"
                      >
                        מחיקה
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
