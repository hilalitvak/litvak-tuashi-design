import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // צילומי הפרויקטים. כרגע מוגשים מהאחסון שבו Base44 שמרה אותם;
      // לאחר ההעברה לדלי Supabase שלכם — להחליף כאן ולעדכן IMAGE_BASE ב-src/lib/portfolio.ts.
      {
        protocol: "https",
        hostname: "qtrypzzcjebvfcihiynt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // דלי Supabase עתידי משלכם — נגזר ממשתנה הסביבה, אם הוגדר.
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
              pathname: "/storage/v1/object/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
