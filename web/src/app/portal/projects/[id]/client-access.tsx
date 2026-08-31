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
        className="mt-6 rounded-sm border border-ink-line px-4 py-2 text-sm text-cream-dim transition-colors hover:border-sand hover:text-cream"
      >
        + שיוך לקוח לפרויקט
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-6 rounded-sm border border-ink-line bg-ink-soft p-5"
    >
      <h2 className="text-sm text-cream">שיוך לקוח</h2>
      <p className="mt-1 text-xs leading-relaxed text-cream-dim">
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
          className="min-w-64 flex-1 rounded-sm border border-ink-line bg-ink px-4 py-2.5 text-sm text-cream outline-none placeholder:text-cream-dim/50 focus:border-sand"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-sm bg-cream px-5 py-2.5 text-sm text-ink transition-colors hover:bg-sand disabled:opacity-60"
        >
          {busy ? "משייך…" : "שייך"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-cream-dim transition-colors hover:text-cream"
        >
          סגירה
        </button>
      </div>

      {msg && (
        <p
          role="status"
          className={`mt-3 text-sm ${msg.bad ? "text-red-400" : "text-sand"}`}
        >
          {msg.text}
        </p>
      )}
    </form>
  );
}
