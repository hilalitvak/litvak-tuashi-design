import Link from "next/link";
import { STUDIO_NAME_FULL, contact, nav } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-line bg-ink-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <h2 className="font-display text-lg tracking-wide text-cream">
            {STUDIO_NAME_FULL}
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream-dim">
            הופכים חללים לחוויות יוצאות דופן.
          </p>
        </div>

        <nav aria-label="ניווט תחתון">
          <h2 className="text-sm tracking-widest text-sand">ניווט</h2>
          <ul className="mt-4 space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-cream-dim transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="text-sm text-cream-dim transition-colors hover:text-cream"
              >
                כניסה לפורטל
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm tracking-widest text-sand">יצירת קשר</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-cream-dim">
            <li>
              <a
                href={`mailto:${contact.emails[0]}`}
                className="transition-colors hover:text-cream"
              >
                {contact.emails[0]}
              </a>
            </li>
            <li>
              <a
                href={`tel:${contact.phones[0].replace(/\s/g, "")}`}
                className="transition-colors hover:text-cream"
                dir="ltr"
              >
                {contact.phones[0]}
              </a>
            </li>
            <li>{contact.address.join(", ")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-line/70">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-cream-dim sm:px-8">
          © {year} {STUDIO_NAME_FULL}. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
}
