import Image from "next/image";
import { img } from "@/lib/images";

type Props = {
  image: string;
  /** ריק כברירת מחדל: ברוב העמודים הצילום הוא רקע דקורטיבי לכותרת. */
  alt?: string;
  title: string;
  subtitle?: string;
  /** גובה מלא לעמוד הבית, נמוך יותר לעמודים פנימיים. */
  full?: boolean;
  children?: React.ReactNode;
  priority?: boolean;
};

export function PageBanner({
  image,
  alt = "",
  title,
  subtitle,
  full = false,
  children,
  priority = false,
}: Props) {
  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${
        full ? "min-h-[88vh]" : "min-h-[42vh] pt-24"
      }`}
    >
      <Image
        src={img(image)}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      <div className="banner-veil absolute inset-0" />

      <div className="relative mx-auto max-w-4xl px-5 py-16 text-center sm:px-8">
        <h1
          className={`font-display font-light leading-tight text-canvas ${
            full ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-canvas/85 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
