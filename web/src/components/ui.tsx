import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/images";
import type { PortfolioProject } from "@/lib/portfolio";

export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 ${className}`}
    >
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
        <p className="text-xs tracking-[0.25em] text-brass">{eyebrow}</p>
      )}
      <h2 className="mt-3 font-display text-3xl font-light text-ink sm:text-4xl">
        {title}
      </h2>
      {body && (
        <p className="mt-5 text-base leading-relaxed text-ink-soft">{body}</p>
      )}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
  onDark = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  /** כפתורים שיושבים על צילום — הערכה הבהירה לא נראית שם. */
  onDark?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-sm px-7 py-3 text-sm tracking-wide transition-colors";
  const styles = onDark
    ? variant === "solid"
      ? "bg-white text-ink hover:bg-brass hover:text-white"
      : "border border-white/50 text-white hover:border-white hover:bg-white/10"
    : variant === "solid"
      ? "bg-ink text-canvas hover:bg-brass"
      : "border border-rule text-ink hover:border-brass hover:text-brass";
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
      className="group relative block overflow-hidden rounded-sm bg-panel"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={img(project.banner_image)}
          // הכותרת והמיקום כבר כתובים בכרטיס. alt זהה היה גורם לקורא מסך
          // להקריא את שם הפרויקט פעמיים בתוך שם הקישור.
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-80" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-xl font-light text-canvas">
          {project.title}
        </h3>
        {project.location && (
          <p className="mt-1 text-sm text-canvas/75">{project.location}</p>
        )}
        <span className="mt-3 inline-block text-xs tracking-widest text-canvas opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          צפה בפרויקט ←
        </span>
      </div>
    </Link>
  );
}
