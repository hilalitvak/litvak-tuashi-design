import { PageBanner } from "@/components/page-banner";
import {
  ButtonLink,
  ProjectCard,
  Section,
  SectionHeading,
} from "@/components/ui";
import { featuredProjects } from "@/lib/portfolio";
import { STUDIO_NAME_FULL, banners, contact } from "@/lib/site";

export default function HomePage() {
  // בניגוד לאתר הישן — שהציג בעמוד הבית שישה פרויקטים מומצאים שקודדו קשיח —
  // כאן מוצגים הפרויקטים האמיתיים מתיק העבודות.
  const showcase = featuredProjects.slice(0, 6);

  return (
    <>
      <PageBanner
        image={banners.home}
        title="הופכים חללים לחוויות יוצאות דופן"
        subtitle={`${STUDIO_NAME_FULL} משלב חזון ומומחיות ליצירת חללים יפים ופונקציונליים המשקפים את אישיותכם ואורח חייכם הייחודי.`}
        full
        priority
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/projects">צפו בפרויקטים שלנו</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            צרו קשר
          </ButtonLink>
        </div>
      </PageBanner>

      <Section>
        <SectionHeading
          eyebrow="תיק העבודות"
          title="הפרויקטים שלנו"
          body="גלו מבחר מעבודותינו האחרונות המציגות את התשוקה שלנו לעיצוב ותשומת לב לפרטים."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <ButtonLink href="/projects" variant="outline">
            לכל הפרויקטים
          </ButtonLink>
        </div>
      </Section>

      <div className="rule" />

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.25em] text-sand">הסיפור שלנו</p>
          <p className="mt-6 text-lg leading-relaxed text-cream/90">
            {STUDIO_NAME_FULL} נוסדה כאשר סיגל ליטבק ובן תואשי, שני מעצבים עם
            סגנונות שונים אך משלימים, החליטו לשלב את כישרונותיהם ומומחיותם
            ליצירת סטודיו לעיצוב החוגג אינדיבידואליות ופונקציונליות.
          </p>
          <p className="mt-5 leading-relaxed text-cream-dim">
            מה שהחל כסטודיו קטן בתל אביב צמח למשרד עיצוב מוערך. צמיחתנו הייתה
            אורגנית, ונבנתה על המלצות מלקוחות מרוצים המעריכים את גישתנו
            השיתופית ותשומת הלב לפרטים.
          </p>
          <div className="mt-10">
            <ButtonLink href="/about" variant="outline">
              למדו עוד
            </ButtonLink>
          </div>
        </div>
      </Section>

      <section className="border-t border-ink-line bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-display text-3xl font-light text-cream sm:text-4xl">
            בואו ניצור יחד
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream-dim">
            מוכנים להפוך את החלל שלכם? נשמח לשמוע על הפרויקט שלכם ולעזור להגשים
            את החזון שלכם.
          </p>

          <dl className="mx-auto mt-12 grid max-w-lg gap-8 sm:grid-cols-2">
            <div>
              <dt className="text-xs tracking-widest text-sand">אימייל</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${contact.emails[0]}`}
                  className="text-cream transition-colors hover:text-sand"
                >
                  {contact.emails[0]}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-widest text-sand">טלפון</dt>
              <dd className="mt-2" dir="ltr">
                <a
                  href={`tel:${contact.phones[0].href}`}
                  className="text-cream transition-colors hover:text-sand"
                >
                  {contact.phones[0].display}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-12">
            <ButtonLink href="/contact">צרו קשר</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
