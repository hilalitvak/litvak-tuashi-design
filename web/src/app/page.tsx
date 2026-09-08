import { PageBanner } from "@/components/page-banner";
import { ButtonLink, Section } from "@/components/ui";
import { STUDIO_NAME_FULL, banners } from "@/lib/site";

export default function HomePage() {
  // אין כאן רשת פרויקטים. היא הציגה שישה מתוך שמונה, כלומר כמעט את
  // אותו דבר כמו עמוד הפרויקטים — כפילות ולא טיזר.
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
