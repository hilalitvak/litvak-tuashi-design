import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { ButtonLink, Section, SectionHeading } from "@/components/ui";
import { banners, processSteps } from "@/lib/site";

export const metadata: Metadata = {
  title: "התהליך שלנו",
  description:
    "שש אבני דרך מהחזון ועד החלל המוגמר — כך נראה תהליך העבודה בליטבק-טואשי עיצוב פנים.",
};

export default function ProcessPage() {
  return (
    <>
      <PageBanner
        image={banners.process}
        title="התהליך שלנו"
        subtitle="שש אבני דרך לחלל המושלם שלכם"
        priority
      />

      <Section>
        <SectionHeading
          eyebrow="מחזון למציאות"
          title="איך זה עובד"
          body="הגישה היעילה שלנו מבטיחה שכל פרויקט יבוצע בדיוק ובאלגנטיות"
        />

        <ol className="mx-auto mt-16 max-w-3xl">
          {processSteps.map((step, i) => (
            <li
              key={step.title}
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              {/* קו הזמן האנכי — מסתיים בשלב האחרון */}
              {i < processSteps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-12 bottom-0 right-6 w-px bg-ink-line"
                />
              )}
              <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-sand/50 bg-ink font-display text-sand">
                {i + 1}
              </span>
              <div className="pt-2">
                <h3 className="font-display text-xl font-light text-cream">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-cream-dim">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <section className="border-t border-ink-line bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-display text-3xl font-light text-cream sm:text-4xl">
            מוכנים להתחיל את המסע שלכם?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream-dim">
            בואו נקבע פגישת ייעוץ כדי לדון בפרויקט שלכם ולראות כיצד נוכל להגשים
            את החזון שלכם.
          </p>
          <div className="mt-10">
            <ButtonLink href="/contact">קבעו פגישת ייעוץ</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
