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
            {contact.emails.map((email) => (
              <li key={email.address}>
                <span className="text-cream-dim/70">{email.owner}: </span>
                <a
                  href={`mailto:${email.address}`}
                  className="transition-colors hover:text-cream"
                >
                  {email.address}
                </a>
              </li>
            ))}
            {contact.phones.map((phone) => (
              <li key={phone.href}>
                <span className="text-cream-dim/70">{phone.owner}: </span>
                <a
                  href={`tel:${phone.href}`}
                  className="transition-colors hover:text-cream"
                  dir="ltr"
                >
                  {phone.display}
                </a>
              </li>
            ))}
            <li>{contact.address.join(", ")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-line/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-cream-dim sm:px-8">
          <p>
            © {year} {STUDIO_NAME_FULL}. כל הזכויות שמורות.
          </p>
          <p className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-cream">
              מדיניות פרטיות
            </Link>
            <Link href="/terms" className="transition-colors hover:text-cream">
              תנאי שימוש
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
