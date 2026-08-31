// נוצר אוטומטית מייצוא Base44 (data/base44-export/PortfolioProject.csv).
// התמונות מוגשות מדלי portfolio ב-Supabase של הסטודיו (מאופטמות, ראו scripts/optimize-images.mjs).

export const IMAGE_BASE =
  "https://tegccsfcfwnqtdtaczsl.supabase.co/storage/v1/object/public/portfolio/";

export type PortfolioProject = {
  slug: string;
  title: string;
  location: string;
  category: string | null;
  description: string | null;
  banner: string;
  gallery: string[];
  featured: boolean;
  order: number;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    "slug": "classic-apartment",
    "title": "דירה קלאסית",
    "location": "תל אביב",
    "category": "Residential",
    "description": null,
    "banner": "41c1cc127_14.jpg",
    "gallery": [
      "a62ece8d5_7.jpg",
      "6855466ee_8.jpg",
      "f0a500922_10.jpg",
      "681d7e793_13.jpg",
      "41c1cc127_14.jpg"
    ],
    "featured": false,
    "order": 14
  },
  {
    "slug": "modality-offices",
    "title": "משרדים מודליטי",
    "location": "תל אביב",
    "category": "Commercial",
    "description": "בשיתוף המעצבת  עדי עוז",
    "banner": "1d5faa503_1-Copy.jpg",
    "gallery": [
      "1d5faa503_1-Copy.jpg",
      "fbcb236ea_5.jpg",
      "6def0e379_6-Copy.jpg",
      "87631adf5_11-Copy.jpg",
      "4718f96ac_12.jpg",
      "bc6f21289_13-Copy.jpg",
      "508e045c2_32.jpg"
    ],
    "featured": true,
    "order": 13
  },
  {
    "slug": "modern-house-shfela",
    "title": "בית מודרני בשפלה",
    "location": "שפלה",
    "category": "Residential",
    "description": null,
    "banner": "fd724a73a_Ben2_View3_09-11-23.jpg",
    "gallery": [
      "30aa163fe_Ben2_View2_09-11-23.jpg",
      "fd724a73a_Ben2_View3_09-11-23.jpg",
      "cd698a9bb_Ben2_View4_09-11-23.jpg",
      "b95391c2a_Ben2_View5_09-11-23.jpg"
    ],
    "featured": true,
    "order": 12
  },
  {
    "slug": "mini-penthouse",
    "title": "מיני פנטהאוז",
    "location": "גבעתיים",
    "category": "Residential",
    "description": null,
    "banner": "118efee82_ERZ_2224-Edit.jpg",
    "gallery": [
      "08d3fa340_ERZ_2057-Edit.jpg",
      "c9f1d4954_ERZ_2061-Edit.jpg",
      "a9a27e623_ERZ_2073-Edit.jpg",
      "f107b14b7_ERZ_2106-Edit-2.jpg",
      "f553e667f_ERZ_2197-Edit.jpg",
      "18328d415_ERZ_2213-Edit.jpg",
      "118efee82_ERZ_2224-Edit.jpg",
      "6613f6d99_ERZ_2233-Edit.jpg",
      "0b36f7f41_ERZ_2240-Edit.jpg"
    ],
    "featured": true,
    "order": 11
  },
  {
    "slug": "urban-penthouse",
    "title": "פנטהאוז אורבני",
    "location": "יבנה",
    "category": "Residential",
    "description": null,
    "banner": "ecacf0b2a_1-.jpg",
    "gallery": [
      "ecacf0b2a_1-.jpg",
      "a70aded10_3-.jpg",
      "e4f9438e7_4-Copy.jpg",
      "6c0a195e1_5.jpg",
      "be0bfba2f_6-.jpg",
      "238d34527_10.jpg",
      "48da8a6a2_19.jpg",
      "6e9be96e7_20.jpg"
    ],
    "featured": true,
    "order": 10
  },
  {
    "slug": "garden-apartment",
    "title": "דירת גן",
    "location": "תל אביב",
    "category": "Residential",
    "description": null,
    "banner": "917a18576_4.jpg",
    "gallery": [
      "816910ec6_1.jpg",
      "cb128b0cc_2-.jpg",
      "77ac390ed_3-.jpg",
      "917a18576_4.jpg",
      "eb1e18dd8_8.jpg",
      "49e29a269_9.jpg",
      "1288fc5b3_13.jpg"
    ],
    "featured": false,
    "order": 3
  },
  {
    "slug": "natural-apartment",
    "title": "דירה טבעית",
    "location": "תל אביב",
    "category": "Residential",
    "description": null,
    "banner": "212d9b_pr4_view2_06-23-23.jpg",
    "gallery": [
      "212d9b_pr4_view2_06-23-23.jpg",
      "f07937aed_pr4_view1_06-23-23.jpg",
      "8cd4cae73_pr4_view3_06-23-23.jpg",
      "61989e300_pr4_view4_06-23-23.jpg"
    ],
    "featured": true,
    "order": 2
  },
  {
    "slug": "villa-tel-aviv",
    "title": "וילה תל אביב",
    "location": "תל אביב",
    "category": null,
    "description": null,
    "banner": "651024158_5.jpg",
    "gallery": [
      "de4ab9aac_3-.jpg",
      "42750b1b4_6-.jpg",
      "651024158_5.jpg",
      "76b437fba_9.jpg",
      "422ee3910_11.jpg",
      "161437af0_19--.jpg",
      "361c20796_20-.jpg"
    ],
    "featured": true,
    "order": 1
  }
];

export const img = (name: string) => IMAGE_BASE + name;

export const featuredProjects = portfolioProjects.filter((p) => p.featured);

export const getProject = (slug: string) =>
  portfolioProjects.find((p) => p.slug === slug);
