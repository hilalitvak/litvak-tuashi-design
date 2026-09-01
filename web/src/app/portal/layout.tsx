import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/portal-server";
import { STUDIO_NAME } from "@/lib/site";
import { NotificationsBell } from "./notifications-bell";
import { SignOutButton } from "./sign-out";


// הפורטל תלוי ב-session של המשתמש, ולכן חייב להיבנות בזמן בקשה
// ולא מראש. בלי זה Next מנסה לעבד אותו בזמן build, כשאין עדיין מי שמחובר.
export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "פורטל",
  robots: { index: false },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const isAdmin = profile.role === "admin";

  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-40 border-b border-ink-line bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-5">
            <Link href="/portal" className="font-display text-cream">
              {STUDIO_NAME}
            </Link>
            <span className="rounded-sm border border-ink-line px-2 py-0.5 text-xs text-sand">
              {isAdmin ? "ניהול" : "פורטל לקוח"}
            </span>
            {isAdmin && (
              <Link
                href="/portal/portfolio"
                className="text-sm text-cream-dim transition-colors hover:text-cream"
              >
                תיק העבודות
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && <NotificationsBell />}
            <span className="hidden text-sm text-cream-dim sm:inline">
              {profile.full_name || profile.email}
            </span>
            <Link
              href="/"
              className="text-sm text-cream-dim transition-colors hover:text-cream"
            >
              לאתר
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
