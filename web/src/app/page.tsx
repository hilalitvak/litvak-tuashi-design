import { PageBanner } from "@/components/page-banner";
import {
  ButtonLink,
  ProjectCard,
  Section,
  SectionHeading,
} from "@/components/ui";
import { getFeaturedProjects } from "@/lib/portfolio";
import { STUDIO_NAME_FULL, banners } from "@/lib/site";

export default async function HomePage() {
  const showcase = (await getFeaturedProjects()).slice(0, 6);

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
          {/* גולל לפרויקטים שמיד מתחת, במקום לטעון עמוד שמראה את אותו דבר. */}
          <ButtonLink href="#projects">צפו בפרויקטים שלנו</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            צרו קשר
          </ButtonLink>
        </div>
      </PageBanner>

      {/* scroll-mt-32 = 128px: גובה הכותרת (97) ועוד אוויר, אחרת
          הכותרת "הפרויקטים שלנו" נוחתת ממש מתחת לסרגל בלי מרווח. */}
      <Section className="scroll-mt-32" id="projects">
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
            {STUDIO_NAME_FULL} הוקם ב-2012 על ידי סיגל ליטבק ובן טואשי. שני
            מעצבים בעלי סגנונות שונים אך משלימים, מתוך חזון משותף ליצור מרחבים
            שמבטאים ייחודיות, הרמוניה ופונקציונליות אמיתית.
          </p>
          <div className="mt-10">
            <ButtonLink href="/about" variant="outline">
              למדו עוד
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
