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
  return `${sanitize(basename) || basename}${ext}`;
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

  const sanitizedIncoming = sanitizeMediaFilename(incomingFilename);
  const { basename, ext } = splitMediaFilename(sanitizedIncoming);
  const isTaken = (candidate: string): boolean =>
    takenBasenames.has(candidate.toLowerCase()) || hasReservedMediaSizeSuffix(candidate);

  if (!isTaken(basename)) {
    return sanitizedIncoming;
  }

  for (let suffix = 1; ; suffix += 1) {
    const candidate = `${basename}-${suffix}`;
    if (!isTaken(candidate)) {
      return `${candidate}${ext}`;
    }
  }
}
