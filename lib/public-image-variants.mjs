/**
 * Shared contract between `lib/image-loader.ts`, `scripts/optimize-public-images.mjs`,
 * and unit tests so the set of optimized `public/` rasters cannot drift.
 */

/** Widths generated for both Payload Media uploads and static `public/` rasters. */
export const VARIANT_WIDTHS = [640, 1280, 1920];

/**
 * Local `public/` rasters never rendered through `next/image`:
 * favicons/app icons, OpenGraph image, raw `<img>` badges, and print-only assets.
 */
export const EXCLUDED_PUBLIC_RASTERS = new Set([
  "/afip.jpg",
  "/favicon-32x32.png",
  "/icon-192.png",
  "/icon-512.png",
  "/og-image.jpg",
  "/qr-resenas-787.png",
]);

const PUBLIC_RASTER_RE = /^\/(?!api\/)([^?#]+)\.(?:jpe?g|png)$/i;

/**
 * Picks the smallest pre-generated variant width >= `width`, capped at 1920.
 * @param {number} width
 * @returns {number}
 */
export function selectVariantWidth(width) {
  return VARIANT_WIDTHS.find((candidate) => candidate >= width) ?? 1920;
}

/**
 * Parses a local `public/` raster src (starting with `/`, not `/api/`, ending
 * `.jpg`/`.jpeg`/`.png`, and not in `EXCLUDED_PUBLIC_RASTERS`).
 * Returns the path without extension (e.g. `"/hero-bg"`), or `null` if the
 * loader should leave `src` unchanged.
 * @param {string} src
 * @returns {string | null}
 */
export function getOptimizablePublicRasterBase(src) {
  if (!src.startsWith("/") || src.startsWith("//")) return null;
  const match = PUBLIC_RASTER_RE.exec(src);
  if (!match) return null;
  if (EXCLUDED_PUBLIC_RASTERS.has(src.toLowerCase())) return null;
  return `/${match[1]}`;
}

/**
 * Maps a local `public/` raster src + requested width to its `-w<N>.webp` path,
 * or returns `null` if `src` is not an optimizable public raster.
 * @param {string} src
 * @param {number} width
 * @returns {string | null}
 */
export function resolvePublicImageVariant(src, width) {
  const base = getOptimizablePublicRasterBase(src);
  if (!base) return null;
  return `${base}-w${selectVariantWidth(width)}.webp`;
}
