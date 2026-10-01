/**
 * DTOs livianos para cards de listado (home destacados y /destinos).
 * Evitan serializar a client components campos solo de ficha detalle
 * (meta, FAQ, highlights, flyer, tip, etc.).
 */
import type { Departure, DestinationPage, TransportType } from "./types";

/** Campos de salida que usan precio, filtros de mes y badges de card. */
export type DepartureListing = Pick<
  Departure,
  | "date"
  | "displayDate"
  | "priceFrom"
  | "currency"
  | "status"
  | "transport"
  | "nights"
  | "stayLabel"
  | "priceValidUntil"
>;

/**
 * Shape mínima compartida por helpers de catálogo (precio, filtros, sort)
 * y por las cards cliente. `DestinationPage` la satisface estructuralmente.
 */
export type DestinationListing = {
  slug: string;
  name: string;
  country: string;
  region: "nacional" | "internacional";
  heroImage: string;
  /** Presente en /destinos; omitido en destacados de home. */
  description?: string;
  priceFrom?: number;
  currency: "ARS" | "USD";
  priceNote?: string;
  priceValidUntil?: string;
  departures: DepartureListing[];
};

export type ClusterCardProps = {
  href: string;
  title: string;
  line: string;
  image: string;
  imageAlt: string;
  destinationCount: number;
  departureCount: number;
};

function toDepartureListing(dep: Departure): DepartureListing {
  return {
    date: dep.date,
    displayDate: dep.displayDate,
    status: dep.status,
    transport: dep.transport,
    nights: dep.nights,
    ...(dep.priceFrom != null ? { priceFrom: dep.priceFrom } : {}),
    ...(dep.currency ? { currency: dep.currency } : {}),
    ...(dep.stayLabel ? { stayLabel: dep.stayLabel } : {}),
    ...(dep.priceValidUntil ? { priceValidUntil: dep.priceValidUntil } : {}),
  };
}

export type ToDestinationListingOptions = {
  /** Default true. Home destacados no renderiza descripción. */
  includeDescription?: boolean;
};

/** Quita campos de ficha detalle antes de cruzar el boundary RSC → client. */
export function toDestinationListing(
  dest: DestinationPage,
  options: ToDestinationListingOptions = {},
): DestinationListing {
  const includeDescription = options.includeDescription !== false;
  return {
    slug: dest.slug,
    name: dest.name,
    country: dest.country,
    region: dest.region,
    heroImage: dest.heroImage,
    ...(includeDescription ? { description: dest.description } : {}),
    ...(dest.priceFrom != null ? { priceFrom: dest.priceFrom } : {}),
    currency: dest.currency,
    ...(dest.priceNote ? { priceNote: dest.priceNote } : {}),
    ...(dest.priceValidUntil ? { priceValidUntil: dest.priceValidUntil } : {}),
    departures: dest.departures.map(toDepartureListing),
  };
}

export function toDestinationListings(
  destinations: DestinationPage[],
  options?: ToDestinationListingOptions,
): DestinationListing[] {
  return destinations.map((dest) => toDestinationListing(dest, options));
}

/** Re-export tipado para UI que solo necesita el union de transporte. */
export type { TransportType };
