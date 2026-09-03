// כתובות התמונות. מודול נפרד ונטול תלויות שרת, כי גם קומפוננטות
// שרצות בדפדפן (הכותרת, למשל) צריכות אותו.

export const IMAGE_BASE =
  "https://tegccsfcfwnqtdtaczsl.supabase.co/storage/v1/object/public/portfolio/";

/**
 * שם קובץ באחסון → כתובת מלאה.
 *
 * עובר כמו שהוא על כתובת מלאה (תמונה שהועלתה דרך הפורטל) ועל נתיב
 * שמתחיל ב-/ (קובץ מקומי ב-public, כמו תמונת ההירו).
 */
export const img = (name: string) =>
  name.startsWith("http") || name.startsWith("/") ? name : IMAGE_BASE + name;
