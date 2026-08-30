import Image from "next/image";
import Link from "next/link";
import { img, type PortfolioProject } from "@/lib/portfolio";

export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-xs tracking-[0.25em] text-sand">{eyebrow}</p>
      )}
      <h2 className="mt-3 font-display text-3xl font-light text-cream sm:text-4xl">
        {title}
      </h2>
      {body && (
        <p className="mt-5 text-base leading-relaxed text-cream-dim">{body}</p>
      )}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-flex items-center justify-center rounded-sm px-7 py-3 text-sm tracking-wide transition-colors";
  const styles =
    variant === "solid"
      ? "bg-cream text-ink hover:bg-sand"
      : "border border-cream/40 text-cream hover:border-sand hover:text-sand";
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

export function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block overflow-hidden rounded-sm bg-ink-soft"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={img(project.banner)}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-80" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-xl font-light text-cream">
          {project.title}
        </h3>
        {project.location && (
          <p className="mt-1 text-sm text-cream-dim">{project.location}</p>
        )}
        <span className="mt-3 inline-block text-xs tracking-widest text-sand opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          צפה בפרויקט ←
        </span>
      </div>
    </Link>
  );
}
