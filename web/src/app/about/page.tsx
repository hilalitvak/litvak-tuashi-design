import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui";
import { STUDIO_NAME_FULL, TAGLINE, founders, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "אודות",
  description:
    "סטודיו לעיצוב ואדריכלות פנים שהוקם ב-2012 על ידי סיגל ליטבק ובן טואשי.",
};

export default function AboutPage() {
  return (
    // בלי באנר תמונה בראש: הוא דחף את התוכן מתחת לקיפול והכריח גלילה
    // כדי להגיע למה שהעמוד באמת עליו — המעצבים.
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-32 sm:px-8">
      <header className="text-center">
        <p className="text-xs tracking-[0.3em] text-brass">{TAGLINE}</p>
        <h1 className="mt-4 font-display text-3xl font-light text-ink sm:text-4xl">
          הכירו את המעצבים
        </h1>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-ink-soft">
          {STUDIO_NAME_FULL} הוקם ב-2012 על ידי סיגל ליטבק ובן טואשי. שני
          מעצבים בעלי סגנונות שונים אך משלימים, מתוך חזון משותף ליצור מרחבים
          שמבטאים ייחודיות, הרמוניה ופונקציונליות אמיתית. הסטודיו ממוקם בחולון.
        </p>
      </header>

      {/* פורטרט וטקסט זה לצד זה — קומפקטי בהרבה מתמונה מעל טקסט. */}
      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        {founders.map((person) => (
          <article key={person.name} className="flex gap-5">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-sm border border-rule bg-panel">
              {person.photo ? (
                <Image
                  src={person.photo}
                  alt={person.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <span className="grid h-full w-full place-items-center font-display text-2xl font-light text-ink-soft">
                  {person.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="font-display text-xl font-light text-ink">
                {person.name}
              </h2>
              <p className="mt-0.5 text-sm text-brass">{person.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {person.bio}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="rule-line mt-14" />

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {values.map((value) => (
          <div key={value.title}>
            <h2 className="font-display text-base text-brass">{value.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {value.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <ButtonLink href="/contact">דברו איתנו</ButtonLink>
      </div>
    </div>
  );
}
