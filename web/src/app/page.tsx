import Image from "next/image";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { ScrollToHash } from "@/components/scroll-to-hash";
import { ButtonLink, ProjectCard, SectionHeading } from "@/components/ui";
import { getPortfolioProjects } from "@/lib/portfolio";
import { STUDIO_NAME_FULL, TAGLINE, banners, founders } from "@/lib/site";

// עמוד הבית הוא עכשיו העמוד המרכזי: הפרויקטים יושבים בתוכו, והכפתורים
// והניווט גוללים אליהם במקום לטעון עמוד נפרד שהציג בדיוק את אותו דבר.
export default async function HomePage() {
  const projects = await getPortfolioProjects();

  return (
    <>
      <ScrollToHash />
      <PageBanner
        image={banners.home}
        title="הופכים חללים לחוויות יוצאות דופן"
        subtitle={`${STUDIO_NAME_FULL} משלב חזון ומומחיות ליצירת חללים יפים ופונקציונליים המשקפים את אישיותכם ואורח חייכם הייחודי.`}
        full
        priority
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="#projects" onDark>
            צפו בפרויקטים שלנו
          </ButtonLink>
          <ButtonLink href="#designers" variant="outline" onDark>
            הכירו את המעצבים
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline" onDark>
            צרו קשר
          </ButtonLink>
        </div>
      </PageBanner>

      {/* פתיח קצר — נותן לעין רגע לנחות אחרי הצילום המלא. */}
      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-24">
        <p className="text-xs tracking-[0.3em] text-brass">{TAGLINE}</p>
        <h2 className="mt-5 font-display text-2xl font-light leading-relaxed text-ink sm:text-3xl">
          סטודיו לעיצוב ואדריכלות פנים שמשלב תכנון הנדסי מוקפד עם חשיבה
          יצירתית
        </h2>
        <p className="mt-6 text-base leading-relaxed text-ink-soft">
          מעצבים דירות, בתים פרטיים, פנטהאוזים, משרדים וחללים מסחריים — מהרעיון
          הראשון ועד היום שנכנסים פנימה.
        </p>
      </section>

      {/* תיק העבודות המלא, כאן ולא בעמוד נפרד. */}
      <section
        id="projects"
        className="scroll-mt-24 border-y border-rule bg-panel"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="תיק העבודות"
            title="הפרויקטים שלנו"
            body="חללים מעוצבים בקפידה ברחבי הארץ. לחצו על פרויקט לצפייה בגלריה המלאה."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* המעצבים — טיזר בלבד; הביוגרפיות המלאות בעמוד אודות. */}
      <section id="designers" className="scroll-mt-24">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading eyebrow="מי אנחנו" title="הכירו את המעצבים" />

          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            {founders.map((person) => (
              <article key={person.name} className="flex items-center gap-5">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-sm border border-rule bg-panel">
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-light text-ink">
                    {person.name}
                  </h3>
                  <p className="mt-1 text-sm text-brass">{person.role}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <ButtonLink href="/about" variant="outline">
              קראו עלינו עוד
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-t border-rule bg-panel">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-display text-3xl font-light text-ink sm:text-4xl">
            מוכנים ליצור את הסיפור שלכם?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-soft">
            בואו נעבוד יחד כדי להפוך את החלל שלכם למשהו יוצא דופן.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/contact">דברו איתנו</ButtonLink>
            <Link
              href="/process"
              className="inline-flex items-center px-2 py-3 text-sm tracking-wide text-ink-soft transition-colors hover:text-brass"
            >
              איך זה עובד? ←
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
