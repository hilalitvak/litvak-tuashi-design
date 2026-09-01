import type { Metadata } from "next";
import Image from "next/image";
import { PageBanner } from "@/components/page-banner";
import { ButtonLink, Section } from "@/components/ui";
import {
  STUDIO_NAME_EN,
  TAGLINE,
  banners,
  founders,
  values,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "אודות",
  description:
    "סטודיו לעיצוב ואדריכלות פנים שהוקם ב-2012 על ידי סיגל ליטבק ובן טואשי.",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner image={banners.about} title={TAGLINE} priority />

      {/* הסיפור — שתי פסקאות. המסמך של סיגל ארוך בהרבה, אבל עמוד
          אודות שדורש גלילה ארוכה פשוט לא נקרא עד הסוף. */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-lg leading-relaxed text-cream/90">
            {STUDIO_NAME_EN} הוקם ב-2012 על ידי סיגל ליטבק ובן טואשי — שני
            מעצבים בעלי סגנונות שונים אך משלימים, מתוך חזון משותף ליצור מרחבים
            שמבטאים ייחודיות, הרמוניה ופונקציונליות אמיתית.
          </p>
          <p className="mt-6 leading-relaxed text-cream-dim">
            מה שהתחיל כסטודיו קטן התפתח למשרד עיצוב הפעיל בפרויקטים ברחבי הארץ
            ובעולם — דירות, בתים פרטיים, פנטהאוזים, משרדים וחללים מסחריים.
          </p>
        </div>
      </Section>

      <div className="rule" />

      <Section>
        <h2 className="text-center font-display text-3xl font-light text-cream">
          הכירו את המעצבים
        </h2>

        <div className="mx-auto mt-14 grid max-w-4xl gap-10 sm:grid-cols-2">
          {founders.map((person) => (
            <article key={person.name} className="text-center">
              <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full border border-ink-line bg-ink-soft">
                {person.photo ? (
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                ) : (
                  // עד שתגיע תמונה — ראשי תיבות, ולא ריבוע ריק.
                  <span className="grid h-full w-full place-items-center font-display text-3xl font-light text-cream-dim">
                    {person.name.charAt(0)}
                  </span>
                )}
              </div>

              <h3 className="mt-6 font-display text-2xl font-light text-cream">
                {person.name}
              </h3>
              <p className="mt-1 text-sm tracking-wide text-sand">
                {person.role}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-cream-dim">
                {person.bio}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <div className="rule" />

      <Section>
        <div className="grid gap-10 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title}>
              <h3 className="font-display text-lg text-sand">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-dim">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-t border-ink-line bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-display text-3xl font-light text-cream sm:text-4xl">
            מוכנים להתחיל?
          </h2>
          <div className="mt-8">
            <ButtonLink href="/contact">דברו איתנו</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
