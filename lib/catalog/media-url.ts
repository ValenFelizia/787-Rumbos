import { existsSync } from "node:fs";
import path from "node:path";

export type MediaLike = {
  legacyPath?: string | null;
  url?: string | null;
} | null;

export type ResolveMediaUrlOptions = {
  /** Tests inject a stub. Production checks files under `public/`. */
  isPublicAsset?: (legacyPath: string) => boolean;
};

function defaultIsPublicAsset(legacyPath: string): boolean {
  if (!legacyPath.startsWith("/") || legacyPath.includes("..")) return false;
  return existsSync(path.join(process.cwd(), "public", legacyPath));
}

function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/**
 * Payload media → URL for `<Image>`, OG and cards.
 *
 * Prefer `media.url` (Blob HTTPS or `/api/media/file/...`).
 * Use `legacyPath` only when that file still ships under `public/`
 * (seeded catalog). A filled `legacyPath` that is not on disk must not
 * win over a working Payload URL.
 */
export function resolveMediaUrl(
  media: MediaLike | string | number | null | undefined,
  options: ResolveMediaUrlOptions = {},
): string | undefined {
  if (!media || typeof media === "string" || typeof media === "number") {
    return undefined;
  }

  const url = media.url?.trim() || undefined;
  const legacy = media.legacyPath?.trim() || undefined;
  const isPublicAsset = options.isPublicAsset ?? defaultIsPublicAsset;

  if (url && isAbsoluteHttpUrl(url)) return url;
  if (legacy && isPublicAsset(legacy)) return legacy;
  if (url) return url;
  return legacy;
}
