import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { ButtonLink, ProjectCard, Section } from "@/components/ui";
import { getPortfolioProjects } from "@/lib/portfolio";
import { banners } from "@/lib/site";

export const metadata: Metadata = {
  title: "פרויקטים",
  description:
    "תיק העבודות של ליטבק-טואשי עיצוב פנים — חללים מעוצבים בקפידה ברחבי הארץ.",
};

export default async function ProjectsPage() {
  const projects = await getPortfolioProjects();

  return (
    <>
      <PageBanner
        image={banners.projects}
        title="הפרויקטים שלנו"
        subtitle="גלו את תיק העבודות שלנו עם חללים מעוצבים בקפידה"
        priority
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      <section className="border-t border-ink-line bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-display text-3xl font-light text-cream sm:text-4xl">
            מוכנים ליצור את הסיפור שלכם?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream-dim">
            בואו נעבוד יחד כדי להפוך את החלל שלכם למשהו יוצא דופן
          </p>
          <div className="mt-10">
            <ButtonLink href="/contact">התחילו את הפרויקט שלכם</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
