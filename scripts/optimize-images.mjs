// אופטימיזציה של צילומי הפרויקטים לפני העלאה ל-Supabase Storage.
//
// המקור: assets/images (89 קבצים, 154MB — הכבד ביותר 11MB).
// היעד:  assets/optimized
//
// הרזולוציה נשמרת עד 2400px ברוחב, שזה יותר ממה שכל מסך מציג בפועל,
// ובאיכות שלא ניכרת לעין בצילומי פנים. הלוגו נשאר PNG כדי לשמר שקיפות.
//
// הרצה:  node scripts/optimize-images.mjs

import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets/images";
const OUT = "assets/optimized";
const MAX_WIDTH = 2400;
const JPEG_QUALITY = 82;

const fmt = (b) => `${(b / 1024 / 1024).toFixed(1)}MB`;

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
files.sort();

let before = 0;
let after = 0;
const manifest = [];

for (const file of files) {
  const src = path.join(SRC, file);
  const srcSize = (await stat(src)).size;
  before += srcSize;

  const image = sharp(src, { failOn: "none" });
  const meta = await image.metadata();

  const isPng = /\.png$/i.test(file);
  // הלוגו קטן ושקוף — ממירים אותו ל-JPEG היה הורס אותו.
  const keepPng = isPng && srcSize < 200_000;

  const outName = keepPng ? file : file.replace(/\.(jpe?g|png)$/i, ".jpg");
  const dest = path.join(OUT, outName);

  let pipeline = image.rotate(); // מכבד את ה-EXIF לפני שמסירים אותו
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  pipeline = keepPng
    ? pipeline.png({ compressionLevel: 9, palette: true })
    : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });

  await pipeline.toFile(dest);

  const outSize = (await stat(dest)).size;
  after += outSize;

  manifest.push({ from: file, to: outName });

  const saved = Math.round((1 - outSize / srcSize) * 100);
  if (srcSize > 2_000_000) {
    console.log(
      `  ${file.padEnd(42)} ${fmt(srcSize).padStart(7)} → ${fmt(outSize).padStart(7)}  (-${saved}%)`
    );
  }
}

await writeFile(
  path.join(OUT, "_manifest.json"),
  JSON.stringify(manifest, null, 2)
);

console.log(`\n${files.length} קבצים`);
console.log(`לפני:  ${fmt(before)}`);
console.log(`אחרי:  ${fmt(after)}`);
console.log(`חיסכון: ${Math.round((1 - after / before) * 100)}%`);
