import { ValidationError, type GlobalBeforeChangeHook, type PayloadRequest } from "payload";
import { isRealISODate } from "./editorial";

function invalid(message: string, path: string, req: PayloadRequest): never {
  throw new ValidationError({
    global: "featuredPromo",
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

function dayOf(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return localISODate(value);
  }
  if (typeof value !== "string") return null;
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match?.[1] ?? null;
}

function hasPrice(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * El seed publica la promo histórica sin vigencia (`skipEditorialValidation`),
 * igual que los destinos: sin fecha el monto sigue visible.
 */
export const enforcePromoRules: GlobalBeforeChangeHook = ({ data, originalDoc, req }) => {
  if (req.context?.skipEditorialValidation) return data;

  const merged = { ...(originalDoc ?? {}), ...(data ?? {}) } as Record<string, unknown>;

  if (Object.prototype.hasOwnProperty.call(merged, "endsAt")) {
    const endsAt = merged.endsAt;
    if (typeof endsAt !== "string" || !isRealISODate(endsAt)) {
      invalid("La fecha de fin tiene que ser AAAA-MM-DD válida.", "endsAt", req);
    }
  }

  if (merged._status === "published" && hasPrice(merged.price)) {
    const day = dayOf(merged.priceValidUntil);
    if (!day || !isRealISODate(day) || day < localISODate()) {
      invalid("Indicá hasta cuándo vale el precio (Precio válido hasta).", "priceValidUntil", req);
    }
  }

  return data;
};
