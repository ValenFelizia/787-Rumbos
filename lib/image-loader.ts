import type { ImageLoaderProps } from "next/image";
import { resolvePublicImageVariant, selectVariantWidth } from "./public-image-variants.mjs";

const MEDIA_FILE_RE = /^\/api\/media\/file\/([^/?#]+)\.(?:jpe?g|png|webp|avif)$/i;

function extractPathname(src: string): string | null {
  if (src.startsWith("/")) {
    return src;
  }
  if (/^https?:\/\//i.test(src)) {
    try {
      const url = new URL(src);
      return url.search || url.hash ? null : url.pathname;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Serves pre-generated WebP variants (`-w640`, `-w1280`, `-w1920`) for both
 * Payload CMS media paths and static `public/` rasters without going through
 * Vercel's `/_next/image` optimizer.
 */
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const publicVariant = resolvePublicImageVariant(src, width);
  if (publicVariant) return publicVariant;

  const pathname = extractPathname(src);
  if (!pathname) return src;

  const match = MEDIA_FILE_RE.exec(pathname);
  if (!match) return src;

  return `/api/media/file/${match[1]}-w${selectVariantWidth(width)}.webp`;
}
