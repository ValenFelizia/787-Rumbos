export type MediaLike = {
  url?: string | null;
} | null;

/**
 * Payload media → URL for `<Image>`, OG and cards: Blob HTTPS or
 * `/api/media/file/...`. Returns undefined when the relation is not
 * populated (an id or a bare string).
 */
export function resolveMediaUrl(
  media: MediaLike | string | number | null | undefined,
): string | undefined {
  if (!media || typeof media === "string" || typeof media === "number") {
    return undefined;
  }
  return media.url?.trim() || undefined;
}
