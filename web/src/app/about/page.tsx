import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { ButtonLink, Section, SectionHeading } from "@/components/ui";
import { STUDIO_NAME, STUDIO_NAME_FULL, banners, founders, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "אודות",
  description: `הכירו את ${STUDIO_NAME_FULL} — הסיפור, המייסדים והערכים שמנחים את עבודתנו.`,
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        image={banners.about}
        title={`אודות ${STUDIO_NAME}`}
        subtitle="אנחנו צוות נלהב של מעצבים המוקדש ליצירת חללים מתחשבים, פונקציונליים ויפים המשקפים את אישיותם הייחודית של לקוחותינו."
        priority
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs tracking-[0.25em] text-sand">הסיפור שלנו</p>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-cream/90">
            <p>
              {STUDIO_NAME_FULL} נוסדה כאשר סיגל ליטבק ובן תואשי, שני מעצבים עם
              סגנונות שונים אך משלימים, החליטו לשלב את כישרונותיהם ומומחיותם
              ליצירת סטודיו לעיצוב החוגג אינדיבידואליות ופונקציונליות.
            </p>
            <p className="text-cream-dim">
              מה שהחל כסטודיו קטן בתל אביב צמח למשרד עיצוב מוערך עם פרויקטים
              ברחבי ישראל. צמיחתנו הייתה אורגנית, ונבנתה על המלצות מלקוחות
              מרוצים המעריכים את גישתנו השיתופית ותשומת הלב לפרטים.
            </p>
            <p className="text-cream-dim">
              כיום, אנו ממשיכים לגשת לכל פרויקט באותה תשוקה ומסירות שחיברה
              בינינו, ויוצרים חללים שהם לא רק יפים אלא גם אישיים ופונקציונליים
              מאוד עבור דייריהם.
            </p>
          </div>
        </div>
      </Section>

      <div className="rule" />

      <Section>
        <SectionHeading
          eyebrow="הצוות"
          title="הכירו את המייסדים"
          body={`המוחות היצירתיים מאחורי ${STUDIO_NAME_FULL}`}
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {founders.map((person) => (
            <article
              key={person.name}
              className="rounded-sm border border-ink-line bg-ink-soft p-8"
            >
              <h3 className="font-display text-2xl font-light text-cream">
                {person.name}
              </h3>
              <p className="mt-1 text-sm tracking-wide text-sand">
                {person.role}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-cream-dim">
                {person.bio}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <div className="rule" />

      <Section>
        <SectionHeading
          eyebrow="הערכים שלנו"
          title="מה שמנחה אותנו"
          body="העקרונות המנחים את עבודתנו ומערכות היחסים שלנו"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-sm border border-ink-line p-7"
            >
              <h3 className="font-display text-lg text-cream">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-dim">
                {value.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <section className="border-t border-ink-line bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-display text-3xl font-light text-cream sm:text-4xl">
            מוכנים להפוך את החלל שלכם?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream-dim">
            צרו איתנו קשר עוד היום לקביעת פגישת ייעוץ ועשו את הצעד הראשון ליצירת
            חלל המשקף את אישיותכם ואורח חייכם הייחודי.
          </p>
          <div className="mt-10">
            <ButtonLink href="/contact">צרו קשר</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
