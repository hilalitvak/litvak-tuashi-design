"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { linkClient } from "../../actions";

/** שיוך לקוח לפרויקט. מוצג למנהלים בלבד. */
export function ClientAccess({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const r = await linkClient(projectId, email);
    if (r.error) setMsg({ text: r.error, bad: true });
    else {
      setMsg({ text: r.ok ?? "שויך." });
      setEmail("");
      router.refresh();
    }
    setBusy(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 rounded-sm border border-rule px-4 py-2 text-sm text-ink-soft transition-colors hover:border-brass hover:text-ink"
      >
        + שיוך לקוח לפרויקט
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-6 rounded-sm border border-rule bg-panel p-5"
    >
      <h2 className="text-sm text-ink">שיוך לקוח</h2>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
        הלקוח צריך להיכנס פעם אחת דרך עמוד הכניסה עם חשבון Google שלו. אחרי
        הכניסה הראשונה אפשר לשייך אותו כאן, והוא יראה את הפרויקט הזה בלבד.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="client@gmail.com"
          dir="ltr"
          className="min-w-64 flex-1 rounded-sm border border-rule bg-canvas px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/50 focus:border-brass"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-sm bg-ink px-5 py-2.5 text-sm text-canvas transition-colors hover:bg-brass disabled:opacity-60"
        >
          {busy ? "משייך…" : "שייך"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-ink-soft transition-colors hover:text-ink"
        >
          סגירה
        </button>
      </div>

      {msg && (
        <p
          role="status"
          className={`mt-3 text-sm ${msg.bad ? "text-red-400" : "text-brass"}`}
        >
          {msg.text}
        </p>
      )}
    </form>
  );
}
