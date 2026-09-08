import { PageBanner } from "@/components/page-banner";
import { ButtonLink } from "@/components/ui";
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
          <ButtonLink href="/projects" onDark>צפו בפרויקטים שלנו</ButtonLink>
          <ButtonLink href="/about" variant="outline" onDark>
            הכירו את המעצבים
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline" onDark>
            צרו קשר
          </ButtonLink>
        </div>
      </PageBanner>

    </>
  );
}
