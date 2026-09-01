import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/portal-server";
import { getAllProjectsForAdmin } from "@/lib/portfolio";
import { PortfolioManager } from "./portfolio-manager";

export const dynamic = "force-dynamic";

export default async function PortfolioAdminPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  // ניהול תיק העבודות הוא ענייני הסטודיו, לא של לקוח.
  if (profile.role !== "admin") redirect("/portal");

  const projects = await getAllProjectsForAdmin();

  return (
    <div>
      <Link
        href="/portal"
        className="text-sm text-cream-dim transition-colors hover:text-cream"
      >
        ← לפורטל
      </Link>

      <div className="mt-5">
        <h1 className="font-display text-3xl font-light text-cream">
          תיק העבודות
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream-dim">
          מה שמופיע כאן הוא מה שהמבקרים באתר רואים. פרויקט חדש נוצר כטיוטה
          ואינו מוצג עד שתפרסמו אותו — כך אפשר להעלות תמונות בשקט לפני שהוא
          עולה לאוויר.
        </p>
      </div>

      <div className="mt-8">
        <PortfolioManager projects={projects} />
      </div>
    </div>
  );
}
