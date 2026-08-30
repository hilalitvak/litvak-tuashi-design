"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOGO, STUDIO_NAME_EN, nav } from "@/lib/site";
import { img } from "@/lib/portfolio";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // הכותרת שקופה מעל הבאנר ונאטמת בגלילה, כדי לא להסתיר את הצילום.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // סגירת התפריט הנייד במעבר בין עמודים.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "bg-ink/95 border-b border-ink-line backdrop-blur"
          : "bg-gradient-to-b from-ink/80 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="shrink-0"
          aria-label={`${STUDIO_NAME_EN} — לעמוד הבית`}
        >
          <Image
            src={img(LOGO)}
            alt={STUDIO_NAME_EN}
            width={132}
            height={44}
            priority
            className="h-10 w-auto brightness-0 invert"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm tracking-wide transition-colors ${
                  active
                    ? "text-sand"
                    : "text-cream/80 hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-sm border border-cream/30 px-5 py-2 text-sm text-cream transition-colors hover:border-sand hover:text-sand sm:inline-block"
          >
            כניסה לפורטל
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
            className="grid h-10 w-10 place-items-center text-cream md:hidden"
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
          className="border-t border-ink-line bg-ink px-5 pb-6 pt-2 md:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-b border-ink-line/60 py-3.5 text-cream/90"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-5 block rounded-sm border border-sand px-5 py-3 text-center text-sand"
          >
            כניסה לפורטל
          </Link>
        </nav>
      )}
    </header>
  );
}
