// העלאת צילומי תיק העבודות מ-assets/optimized אל דלי portfolio ב-Supabase.
//
// דורש מפתח service_role, כי העלאה לאחסון מחייבת הרשאת כתיבה שאין
// למפתח הציבורי. המפתח נקרא מ-web/.env.local ולא מודפס לשום מקום.
//
// הכנה:  להוסיף ל-web/.env.local את השורה
//          SUPABASE_SERVICE_ROLE_KEY=eyJ...
//        (הקובץ כבר ב-gitignore)
//
// הרצה:  node scripts/upload-portfolio.mjs
//
// הסקריפט ניתן להרצה חוזרת — קובץ שכבר עלה מדולג.

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../../", import.meta.url));

const SRC = ROOT + "assets/optimized";
const BUCKET = "portfolio";

// קריאת משתני הסביבה מ-web/.env.local בלי להדפיס אותם.
const envText = await readFile(ROOT + "web/.env.local", "utf8").catch(() => {
  console.error(
    "לא נמצא web/.env.local. צרו אותו והוסיפו SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
});

const env = Object.fromEntries(
  envText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "חסרים NEXT_PUBLIC_SUPABASE_URL או SUPABASE_SERVICE_ROLE_KEY ב-web/.env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

const files = (await readdir(SRC)).filter((f) => !f.startsWith("_"));
files.sort();

const { data: existing } = await supabase.storage.from(BUCKET).list("", {
  limit: 1000,
});
const already = new Set((existing ?? []).map((o) => o.name));

let uploaded = 0;
let skipped = 0;
let failed = 0;
let bytes = 0;

for (const file of files) {
  if (already.has(file)) {
    skipped++;
    continue;
  }

  const body = await readFile(path.join(SRC, file));
  const contentType = file.endsWith(".png") ? "image/png" : "image/jpeg";

  const { error } = await supabase.storage.from(BUCKET).upload(file, body, {
    contentType,
    cacheControl: "31536000", // שנה — הקבצים אף פעם לא משתנים תחת אותו שם
    upsert: false,
  });

  if (error) {
    console.error(`✗ ${file} — ${error.message}`);
    failed++;
    continue;
  }

  bytes += (await stat(path.join(SRC, file))).size;
  uploaded++;
  if (uploaded % 10 === 0) console.log(`  …${uploaded} הועלו`);
}

console.log(`\nהועלו:  ${uploaded}`);
console.log(`דולגו:  ${skipped} (כבר היו שם)`);
console.log(`נכשלו:  ${failed}`);
console.log(`נפח:    ${(bytes / 1024 / 1024).toFixed(1)}MB`);
console.log(
  `\nכתובת הבסיס החדשה:\n  ${url}/storage/v1/object/public/${BUCKET}/`
);
