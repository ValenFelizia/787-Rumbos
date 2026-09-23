/**
 * Diff del flujo mixto. Compara el documento publicado con lo que llega
 * a guardar. Ignora `id` (también el de cada fila), `updatedAt`, `createdAt`
 * y `_status`: Payload los manda en el doc completo al publicar.
 */
export const OPERATIONAL_FIELDS = [
  "departures",
  "priceFrom",
  "currency",
  "priceNote",
  "priceValidUntil",
  "lastReviewedAt",
  "reviewedBy",
] as const;

const OPERATIONAL = new Set<string>(OPERATIONAL_FIELDS);

const IGNORED_KEYS = new Set([
  "id",
  "updatedAt",
  "createdAt",
  "_status",
  "pendingApproval",
]);

const CONTENT_FIELDS = [
  "slug",
  "sortOrder",
  "name",
  "country",
  "region",
  "heroImage",
  "flyerImage",
  "description",
  "metaTitle",
  "metaDescription",
  "h1",
  "highlights",
  "typicalInclusions",
  "optionalExcursions",
  "travelTip",
  "faq",
  ...OPERATIONAL_FIELDS,
] as const;

export const FIELD_LABELS: Record<string, string> = {
  slug: "slug",
  sortOrder: "orden",
  name: "nombre",
  country: "país",
  region: "región",
  heroImage: "imagen principal",
  flyerImage: "folleto",
  description: "descripción",
  metaTitle: "title",
  metaDescription: "meta description",
  h1: "h1",
  highlights: "destacados",
  typicalInclusions: "incluye",
  optionalExcursions: "excursiones",
  travelTip: "tip de viaje",
  faq: "preguntas",
  departures: "salidas",
  priceFrom: "precio desde",
  currency: "moneda",
  priceNote: "nota de precio",
  priceValidUntil: "precio válido hasta",
  lastReviewedAt: "última revisión",
  reviewedBy: "revisado por",
};

function isRelation(value: Record<string, unknown>): boolean {
  if (!("id" in value)) return false;
  return (
    "url" in value ||
    "alt" in value ||
    "email" in value ||
    "filename" in value ||
    "legacyPath" in value ||
    value.collection === "users" ||
    value.collection === "media"
  );
}

/** Normaliza un valor para comparar contenido, no ruido de Payload. */
export function normalizeEditorialValue(value: unknown): unknown {
  if (value == null || value === "") return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "boolean") return value ? true : null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    if (/^-?\d+(?:\.\d+)?$/.test(value)) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    const day = /^(\d{4}-\d{2}-\d{2})(?:T|\s|$)/.exec(value);
    if (day) return day[1];
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeEditorialValue(item));
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (isRelation(record)) return normalizeEditorialValue(record.id);
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      if (IGNORED_KEYS.has(key)) continue;
      const normalized = normalizeEditorialValue(record[key]);
      if (normalized !== null) out[key] = normalized;
    }
    return out;
  }
  return null;
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(normalizeEditorialValue(left)) === JSON.stringify(normalizeEditorialValue(right));
}

/** Campos de contenido presentes en `incoming` que no coinciden con el publicado. */
export function changedFields(
  published: Record<string, unknown> | null | undefined,
  incoming: Record<string, unknown>,
): string[] {
  const base = published ?? {};
  const changed: string[] = [];
  for (const key of CONTENT_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(incoming, key)) continue;
    if (!sameValue(base[key], incoming[key])) changed.push(key);
  }
  return changed;
}

export function nonOperationalChanges(
  published: Record<string, unknown> | null | undefined,
  incoming: Record<string, unknown>,
): string[] {
  return changedFields(published, incoming).filter((field) => !OPERATIONAL.has(field));
}
