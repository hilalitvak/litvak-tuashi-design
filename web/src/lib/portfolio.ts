// תיק העבודות נקרא מבסיס הנתונים, לא מקובץ.
// סיגל ובן מנהלים אותו דרך /portal/portfolio — הוספה, עריכה, סדר ומחיקה —
// בלי שאף אחד יצטרך לגעת בקוד.

import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

export { IMAGE_BASE, img } from "@/lib/images";

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  category: string | null;
  description: string | null;
  banner_image: string;
  gallery: string[];
  is_featured: boolean;
  sort_order: number;
  status: string;
};

const COLUMNS =
  "id, slug, title, location, category, description, banner_image, gallery, is_featured, sort_order, status";

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select(COLUMNS)
    .eq("status", "active")
    .order("sort_order", { ascending: false });

  if (error) {
    console.error("getPortfolioProjects", error);
    return [];
  }
  return (data as PortfolioProject[]) ?? [];
}

export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  const all = await getPortfolioProjects();
  return all.filter((p) => p.is_featured);
}

export async function getProject(
  slug: string
): Promise<PortfolioProject | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("portfolio_projects")
    .select(COLUMNS)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  return (data as PortfolioProject) ?? null;
}

/** כל הפרויקטים, כולל מוסתרים — לניהול בלבד. */
export async function getAllProjectsForAdmin(): Promise<PortfolioProject[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_projects")
    .select(COLUMNS)
    .order("sort_order", { ascending: false });

  return (data as PortfolioProject[]) ?? [];
}
