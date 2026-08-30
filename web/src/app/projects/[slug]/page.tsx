import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui";
import { getProject, img, portfolioProjects } from "@/lib/portfolio";
import { categoryLabels } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description:
      project.description ??
      `${project.title}${project.location ? ` — ${project.location}` : ""}. מתוך תיק העבודות של ליטבק-תוואשי עיצוב פנים.`,
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  // הבאנר מופיע בראש; אין טעם להציג אותו שוב בתוך הגלריה.
  const gallery = project.gallery.filter((name) => name !== project.banner);

  return (
    <>
      <section className="relative flex min-h-[62vh] items-end overflow-hidden pt-20">
        <Image
          src={img(project.banner)}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="banner-veil absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
          <Link
            href="/projects"
            className="text-sm text-cream/70 transition-colors hover:text-sand"
          >
            ← חזרה לכל הפרויקטים
          </Link>
          <h1 className="mt-5 font-display text-4xl font-light text-cream sm:text-5xl">
            {project.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cream-dim">
            {project.location && <span>{project.location}</span>}
            {project.category && (
              <>
                <span aria-hidden className="text-ink-line">
                  |
                </span>
                <span>
                  {categoryLabels[project.category] ?? project.category}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {project.description && (
        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <p className="text-lg leading-relaxed text-cream/90">
            {project.description}
          </p>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {gallery.map((name, i) => (
            <div
              key={name}
              // כל תמונה שלישית נפרשת לרוחב מלא, כדי לשבור את המונוטוניות של רשת אחידה.
              className={`relative overflow-hidden rounded-sm ${
                i % 3 === 0 ? "sm:col-span-2 aspect-16/9" : "aspect-4/3"
              }`}
            >
              <Image
                src={img(name)}
                alt={`${project.title} — תמונה ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-ink-line bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-display text-3xl font-light text-cream sm:text-4xl">
            אהבתם את מה שראיתם?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream-dim">
            נשמח לשמוע על הפרויקט שלכם ולהתאים לו את הפתרון הנכון.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/contact">צרו קשר</ButtonLink>
            <ButtonLink href="/projects" variant="outline">
              עוד פרויקטים
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
