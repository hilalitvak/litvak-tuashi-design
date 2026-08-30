"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "google" | "phone";

/** ממיר קלט ישראלי נפוץ (050-1234567) לפורמט E.164 שנדרש ל-OTP. */
function toE164(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return /^\+\d{8,15}$/.test(digits) ? digits : null;
  if (digits.startsWith("0")) return `+972${digits.slice(1)}`;
  if (digits.startsWith("972")) return `+${digits}`;
  return null;
}

export function LoginForm({ configured }: { configured: boolean }) {
  const [mode, setMode] = useState<Mode>("google");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!configured) {
    return (
      <p className="rounded-sm border border-ink-line bg-ink px-5 py-4 text-sm leading-relaxed text-cream-dim">
        ההתחברות עדיין לא הופעלה — פרויקט Supabase טרם חובר לאתר. האתר הציבורי
        פעיל במלואו בינתיים.
      </p>
    );
  }

  async function signInWithGoogle() {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "ההתחברות נכשלה.");
      setBusy(false);
    }
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    const e164 = toE164(phone);
    if (!e164) {
      setError("מספר הטלפון אינו תקין. לדוגמה: 050-1234567");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({ phone: e164 });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שליחת הקוד נכשלה.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    const e164 = toE164(phone);
    if (!e164) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        phone: e164,
        token: code.trim(),
        type: "sms",
      });
      if (error) throw error;
      window.location.assign("/portal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "הקוד שגוי או פג תוקף.");
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-sm border border-ink-line bg-ink px-4 py-3 text-cream outline-none transition-colors placeholder:text-cream-dim/60 focus:border-sand";

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-2 rounded-sm border border-ink-line p-1">
        {(
          [
            ["google", "חשבון Google"],
            ["phone", "מספר טלפון"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setMode(value);
              setError(null);
            }}
            className={`rounded-sm px-4 py-2.5 text-sm transition-colors ${
              mode === value
                ? "bg-cream text-ink"
                : "text-cream-dim hover:text-cream"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "google" ? (
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded-sm bg-cream px-6 py-3.5 text-sm text-ink transition-colors hover:bg-sand disabled:opacity-60"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1z"
            />
            <path
              fill="#EA4335"
              d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
            />
          </svg>
          המשך עם Google
        </button>
      ) : !sent ? (
        <form onSubmit={sendCode} className="space-y-4">
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm text-cream">
              מספר טלפון
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="050-1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className={`${field} text-right`}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-sm bg-cream px-6 py-3.5 text-sm text-ink transition-colors hover:bg-sand disabled:opacity-60"
          >
            {busy ? "שולח…" : "שלחו לי קוד ב-SMS"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="mb-2 block text-sm text-cream">
              הקוד שנשלח אל {phone}
            </label>
            <input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              dir="ltr"
              className={`${field} text-center tracking-[0.5em]`}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-sm bg-cream px-6 py-3.5 text-sm text-ink transition-colors hover:bg-sand disabled:opacity-60"
          >
            {busy ? "מאמת…" : "כניסה"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setCode("");
              setError(null);
            }}
            className="w-full text-sm text-cream-dim transition-colors hover:text-cream"
          >
            שינוי מספר הטלפון
          </button>
        </form>
      )}

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-sm border border-red-500/50 px-4 py-3 text-sm text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
