"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { STUDIO_NAME_EN, nav } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  // התפריט הנייד זוכר באיזה עמוד נפתח, ונחשב פתוח רק שם — כך מעבר עמוד
  // סוגר אותו בלי setState בתוך effect (שגורם לרינדור כפול).
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // רק חלק מהעמודים נפתחים בצילום מלא־רוחב. שם הכותרת שקופה ובהירה;
  // בשאר (אודות, כניסה, משפטיים) היא יושבת ישר על רקע בהיר, ואם לא
  // נבדיל — הלוגו הלבן והניווט הלבן פשוט נעלמים.
  const heroPages = ["/", "/projects", "/process", "/contact"];
  const hasHero =
    heroPages.includes(pathname) || pathname.startsWith("/projects/");
  const onImage = hasHero && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        onImage
          ? "bg-gradient-to-b from-black/45 to-transparent"
          : "border-b border-rule bg-canvas/95 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="shrink-0"
          aria-label={`${STUDIO_NAME_EN} — לעמוד הבית`}
        >
          <Image
            src={onImage ? "/logo-white.png" : "/logo-black.png"}
            alt={STUDIO_NAME_EN}
            width={470}
            height={170}
            priority
            className="h-16 w-auto sm:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            // קישורי עוגן ("/#projects") גוללים בתוך עמוד הבית ואינם
            // עמוד נפרד — אין להם מצב "פעיל".
            const active = item.href.includes("#")
              ? false
              : item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-[15px] tracking-wide transition-colors ${
                  onImage
                    ? active
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                    : active
                      ? "text-brass"
                      : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpenOn(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
            className={`grid h-10 w-10 place-items-center md:hidden ${
              onImage ? "text-white" : "text-ink"
            }`}
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute inset-x-0 top-0 h-px bg-current transition-transform ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 top-2 h-px bg-current transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 top-4 h-px bg-current transition-transform ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-rule bg-canvas px-5 pb-6 pt-2 md:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-b border-rule/60 py-4 text-base text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
