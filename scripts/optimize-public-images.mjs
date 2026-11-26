/**
 * Generates WebP variants (`-w640.webp`, `-w1280.webp`, `-w1920.webp`) next to
 * every `public/` raster image served through `next/image`.
 *
 * Idempotent: skips variants whose mtime is at least the source file's mtime.
 * Exclusions live in `lib/public-image-variants.mjs` so this script and
 * `lib/image-loader.ts` never drift.
 *
 * Usage: npm run images:public
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  getOptimizablePublicRasterBase,
  VARIANT_WIDTHS,
} from "../lib/public-image-variants.mjs";

const RASTER_EXT_RE = /\.(?:jpe?g|png)$/i;
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = (await walkFiles(publicDir)).sort();
let generated = 0;
let upToDate = 0;
let excluded = 0;

for (const sourcePath of allFiles) {
  if (!RASTER_EXT_RE.test(sourcePath)) continue;

  const relPosix = path.relative(publicDir, sourcePath).split(path.sep).join("/");
  const publicSrc = `/${relPosix}`;
  const base = getOptimizablePublicRasterBase(publicSrc);
  if (!base) {
    excluded += 1;
    continue;
  }

  const sourceStat = await stat(sourcePath);

  for (const width of VARIANT_WIDTHS) {
    const variantPath = path.join(publicDir, `${base.slice(1)}-w${width}.webp`);
    try {
      const variantStat = await stat(variantPath);
      if (variantStat.mtimeMs >= sourceStat.mtimeMs && variantStat.size > 0) {
        upToDate += 1;
        continue;
      }
    } catch {
      // Variant missing on disk; generate it below.
    }

    await sharp(sourcePath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(variantPath);
    generated += 1;
  }
}

console.log(
  `images:public — ${generated} generated, ${upToDate} up-to-date, ${excluded} excluded`,
);
