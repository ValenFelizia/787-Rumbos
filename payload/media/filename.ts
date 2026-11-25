import sanitize from "sanitize-filename";

export const IMAGE_SIZE_WIDTHS = [640, 1280, 1920] as const;

const RESERVED_SIZE_SUFFIXES = IMAGE_SIZE_WIDTHS.map((width) => `-w${width}`);

export function splitMediaFilename(filename: string): { basename: string; ext: string } {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) {
    return { basename: filename, ext: "" };
  }
  return {
    basename: filename.slice(0, lastDot),
    ext: filename.slice(lastDot),
  };
}

export function hasReservedMediaSizeSuffix(basename: string): boolean {
  const normalized = basename.toLowerCase();
  return RESERVED_SIZE_SUFFIXES.some((suffix) => normalized.endsWith(suffix));
}

/**
 * Aplica la misma limpieza que Payload (`generateFileData`) al basename, para
 * comparar contra el nombre que realmente se va a guardar.
 */
export function sanitizeMediaFilename(filename: string): string {
  const { basename, ext } = splitMediaFilename(filename);
  return `${sanitize(basename)}${ext}`;
}

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

/**
 * Deja el nombre subido como `<basename>.<ext>` con la extensión del mime real,
 * para que el basename que se compara sea el mismo que Payload usa al nombrar las
 * variantes (`photo.jpg.` o `photo` sin extensión se partirían distinto si no).
 */
export function normalizeUploadName(filename: string, mimeType: string | undefined): string {
  const cleaned = sanitize(filename) || filename;
  const ext = mimeType ? EXT_BY_MIME[mimeType] : undefined;
  if (!ext) return cleaned;
  const { basename, ext: currentExt } = splitMediaFilename(cleaned);
  const keepsExt = currentExt.toLowerCase() === ext || (ext === ".jpg" && currentExt.toLowerCase() === ".jpeg");
  return keepsExt ? `${basename}${ext}` : `${cleaned}${ext}`;
}

// Payload trunca el basename a 255 bytes al sanitizarlo, lo que borraría un sufijo
// `-N` agregado al final. 60 caracteres son como mucho 240 bytes en UTF-8.
const MAX_BASENAME_CHARS = 60;

function storableBasename(rawBasename: string): string {
  const shortened = Array.from(sanitize(rawBasename)).slice(0, MAX_BASENAME_CHARS).join("");
  // Recortar puede dejar un punto o espacio final que Payload volvería a quitar.
  return sanitize(shortened) || "imagen";
}

/**
 * Resuelve un nombre de archivo único para `media` comparando solo por basename
 * (sin extensión) y reservando los sufijos `-w640`, `-w1280` y `-w1920`.
 * Evita colisiones entre `<basename>.jpg` y `<basename>.png` al generar
 * variantes WebP como `<basename>-w640.webp`.
 */
export function resolveUniqueMediaFilename(
  incomingFilename: string,
  existingFilenames: Iterable<string | null | undefined>,
): string {
  const takenBasenames = new Set<string>();
  for (const filename of existingFilenames) {
    if (!filename) continue;
    takenBasenames.add(splitMediaFilename(filename).basename.toLowerCase());
  }

  const { basename: rawBasename, ext } = splitMediaFilename(incomingFilename);
  const basename = storableBasename(rawBasename);
  const isTaken = (candidate: string): boolean =>
    takenBasenames.has(candidate.toLowerCase()) || hasReservedMediaSizeSuffix(candidate);

  if (!isTaken(basename)) {
    return `${basename}${ext}`;
  }

  for (let suffix = 1; ; suffix += 1) {
    const candidate = `${basename}-${suffix}`;
    if (!isTaken(candidate)) {
      return `${candidate}${ext}`;
    }
  }
}
