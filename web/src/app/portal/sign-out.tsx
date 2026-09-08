"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await createClient().auth.signOut();
    } finally {
      window.location.assign("/");
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="text-sm text-ink-soft transition-colors hover:text-ink disabled:opacity-50"
    >
      {busy ? "יוצא…" : "יציאה"}
    </button>
  );
}
