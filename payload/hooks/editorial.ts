import { ValidationError, type CollectionBeforeChangeHook, type PayloadRequest } from "payload";
import { FIELD_LABELS, nonOperationalChanges, normalizeEditorialValue } from "../editorial/diff";
import { roleOf } from "../access";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type DepartureRow = {
  id?: string | null;
  date?: unknown;
  displayDate?: unknown;
  priceFrom?: unknown;
  status?: unknown;
  priceValidUntil?: unknown;
};

function invalid(message: string, path: string, req: PayloadRequest): never {
  throw new ValidationError({
    collection: "destinations",
    errors: [{ message, path }],
    req,
  });
}

function localISODate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isRealISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function dayOf(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match ? match[1] : null;
}

function hasAmount(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string" && value.trim() !== "") return Number.isFinite(Number(value));
  return false;
}

function assertSlug(data: Record<string, unknown>, req: PayloadRequest): void {
  if (!Object.prototype.hasOwnProperty.call(data, "slug")) return;
  if (typeof data.slug !== "string" || !SLUG_RE.test(data.slug)) {
    invalid(
      "El slug tiene que ir en minúsculas y con guiones, por ejemplo cataratas-del-iguazu.",
      "slug",
      req,
    );
  }
}

function assertDepartures(
  data: Record<string, unknown>,
  original: Record<string, unknown> | null,
  req: PayloadRequest,
): void {
  if (!Array.isArray(data.departures)) return;
  const today = localISODate();
  const previous = new Map<string, string>();
  const stored = Array.isArray(original?.departures) ? original.departures : [];
  for (const row of stored) {
    if (!row || typeof row !== "object") continue;
    const id = (row as DepartureRow).id;
    if (typeof id === "string" && id) {
      previous.set(id, JSON.stringify(normalizeEditorialValue(row)));
    }
  }

  data.departures.forEach((row, index) => {
    const departure = (row ?? {}) as DepartureRow;
    const date = departure.date;
    if (typeof date !== "string" || !isRealISODate(date)) {
      invalid("La fecha de la salida tiene que ser AAAA-MM-DD válida.", `departures.${index}.date`, req);
    }
    if (typeof departure.displayDate !== "string" || departure.displayDate.trim() === "") {
      invalid(
        "Cada salida necesita la fecha visible, por ejemplo «8 de Julio».",
        `departures.${index}.displayDate`,
        req,
      );
    }
    const id = typeof departure.id === "string" ? departure.id : "";
    const unchanged = id !== "" && previous.get(id) === JSON.stringify(normalizeEditorialValue(departure));
    if (!unchanged && date < today) {
      invalid(
        `La salida del ${date} está en el pasado. Una salida nueva o modificada tiene que ser de hoy o de un día que viene.`,
        `departures.${index}.date`,
        req,
      );
    }
  });
}

function assertPriceValidity(doc: Record<string, unknown>, req: PayloadRequest): void {
  const today = localISODate();
  const destinationValidity = doc.priceValidUntil;
  if (hasAmount(doc.priceFrom)) {
    const day = dayOf(destinationValidity);
    if (!day || day < today) {
      invalid("Indicá hasta cuándo vale el precio (Precio válido hasta).", "priceValidUntil", req);
    }
  }

  const departures = Array.isArray(doc.departures) ? doc.departures : [];
  departures.forEach((row, index) => {
    const departure = (row ?? {}) as DepartureRow;
    if (departure.status === "sold-out" || !hasAmount(departure.priceFrom)) return;
    const own = dayOf(departure.priceValidUntil);
    const applicable = own ? departure.priceValidUntil : destinationValidity;
    const day = dayOf(applicable);
    if (!day || day < today) {
      invalid("Indicá hasta cuándo vale el precio (Precio válido hasta).", `departures.${index}.priceValidUntil`, req);
    }
  });
}

/**
 * `originalDoc` puede ser el borrador más nuevo. La comparación de un
 * publish de agente usa la versión publicada (`draft: false`).
 */
export const enforceEditorialRules: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (req.context?.skipEditorialValidation) return data;

  const role = roleOf(req.user);
  const original = (originalDoc ?? null) as Record<string, unknown> | null;

  if (req.user) {
    data.lastReviewedAt = new Date().toISOString();
    data.reviewedBy = req.user.id;
  }

  assertSlug(data, req);
  assertDepartures(data, original, req);

  let published: Record<string, unknown> | null = null;
  if (operation === "update" && original?.id != null) {
    const stored = await req.payload.findByID({
      collection: "destinations",
      id: original.id as number,
      depth: 0,
      draft: false,
      overrideAccess: true,
      disableErrors: true,
    });
    if (stored && stored._status === "published") {
      published = stored as unknown as Record<string, unknown>;
    }
  }

  if (
    published &&
    typeof data.slug === "string" &&
    data.slug !== published.slug &&
    role !== "admin" &&
    role !== "encargado"
  ) {
    invalid("Cambiar el slug de un destino publicado lo hace un encargado o un admin.", "slug", req);
  }

  if (role === "agente" && data._status === "published") {
    if (operation === "create" || !published) {
      if (operation === "create") {
        data._status = "draft";
      } else {
        invalid(
          "Este destino todavía no está publicado. Guardá como borrador y avisá a un encargado.",
          "_status",
          req,
        );
      }
    } else {
      const blocked = nonOperationalChanges(published, data);
      if (blocked.length > 0) {
        const list = blocked.map((field) => FIELD_LABELS[field] ?? field).join(", ");
        invalid(
          `Cambiaste campos que requieren aprobación (${list}). Guardá como borrador y avisá a un encargado.`,
          blocked[0],
          req,
        );
      }
    }
  }

  if (data._status === "published") {
    const base = published ?? original ?? {};
    assertPriceValidity({ ...base, ...data }, req);
  }

  if (data._status === "draft" && role === "agente") {
    data.pendingApproval = true;
  } else if (data._status === "published" && (role === "admin" || role === "encargado" || role === "agente")) {
    data.pendingApproval = false;
  }

  return data;
};
