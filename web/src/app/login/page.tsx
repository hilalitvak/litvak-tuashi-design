import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "כניסה לפורטל",
  description: "כניסת לקוחות ומנהלים לפורטל הפרויקטים של ליטבק-טואשי עיצוב פנים.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 pb-20 pt-32 sm:px-8">
      <h1 className="font-display text-3xl font-light text-cream">
        כניסה לפורטל
      </h1>
      <p className="mt-3 leading-relaxed text-cream-dim">
        לקוחות רואים את הפרויקט שלהם. סיגל ובן רואים את כל הפרויקטים.
      </p>

      <div className="mt-10 rounded-sm border border-ink-line bg-ink-soft p-7">
        <LoginForm configured={isSupabaseConfigured} />
      </div>

      <p className="mt-8 text-center text-sm text-cream-dim">
        <Link href="/" className="transition-colors hover:text-cream">
          ← חזרה לאתר
        </Link>
      </p>
    </div>
  );
}
