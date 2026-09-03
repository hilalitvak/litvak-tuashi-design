import Link from "next/link";
import { STUDIO_NAME_FULL } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  // פוטר מינימלי. הניווט כבר בכותרת ופרטי הקשר בעמוד ייעודי — שניהם
  // היו כפילות. נשארו רק השם וקישורי החובה המשפטיים.
  return (
    <footer className="border-t border-ink-line bg-ink-soft">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs text-cream-dim sm:px-8">
        <p>
          © {year} {STUDIO_NAME_FULL}. כל הזכויות שמורות.
        </p>
        <p className="flex gap-5">
          <Link href="/privacy" className="transition-colors hover:text-cream">
            מדיניות פרטיות
          </Link>
          <Link href="/terms" className="transition-colors hover:text-cream">
            תנאי שימוש
          </Link>
        </p>
      </div>
    </footer>
  );
}
