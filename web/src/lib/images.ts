// כתובות התמונות. מודול נפרד ונטול תלויות שרת, כי גם קומפוננטות
// שרצות בדפדפן (הכותרת, למשל) צריכות אותו.

export const IMAGE_BASE =
  "https://tegccsfcfwnqtdtaczsl.supabase.co/storage/v1/object/public/portfolio/";

/**
 * שם קובץ באחסון → כתובת מלאה.
 * מקבל גם כתובת מלאה, כדי שתמונה שהועלתה דרך הפורטל תעבוד כמו שהיא.
 */
export const img = (name: string) =>
  name.startsWith("http") ? name : IMAGE_BASE + name;
