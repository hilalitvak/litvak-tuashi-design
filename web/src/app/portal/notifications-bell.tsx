"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  project_id: string | null;
  read_at: string | null;
  created_at: string;
};

export function NotificationsBell() {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("notifications")
      .select("id, title, body, project_id, read_at, created_at")
      .order("created_at", { ascending: false })
      .limit(15);
    setItems((data as Notification[]) ?? []);
  }, []);

  useEffect(() => {
    load();

    // עדכון חי — כשלקוח מעלה קובץ, ההתראה מופיעה בלי לרענן.
    const supabase = createClient();
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const unread = items.filter((n) => !n.read_at).length;

  async function markAllRead() {
    const ids = items.filter((n) => !n.read_at).map((n) => n.id);
    if (!ids.length) return;
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .in("id", ids);
    load();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`התראות${unread ? ` — ${unread} חדשות` : ""}`}
        className="relative grid h-9 w-9 place-items-center rounded-sm text-cream-dim transition-colors hover:text-cream"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sand px-1 text-[10px] font-medium text-ink">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-50 w-80 rounded-sm border border-ink-line bg-ink-soft shadow-xl">
          <div className="flex items-center justify-between border-b border-ink-line px-4 py-3">
            <span className="text-sm text-cream">התראות</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-sand hover:underline"
              >
                סמן הכל כנקרא
              </button>
            )}
          </div>

          <ul className="max-h-96 overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-cream-dim">
                אין התראות
              </li>
            )}
            {items.map((n) => (
              <li
                key={n.id}
                className={`border-b border-ink-line/60 last:border-0 ${
                  n.read_at ? "" : "bg-sand/5"
                }`}
              >
                <Link
                  href={n.project_id ? `/portal/projects/${n.project_id}` : "#"}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 transition-colors hover:bg-ink"
                >
                  <p className="text-sm text-cream">{n.title}</p>
                  {n.body && (
                    <p className="mt-1 text-xs text-cream-dim">{n.body}</p>
                  )}
                  <p className="mt-1 text-[11px] text-cream-dim/70">
                    {new Date(n.created_at).toLocaleString("he-IL")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
