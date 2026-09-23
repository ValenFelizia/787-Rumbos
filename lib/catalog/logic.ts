/**
 * Reglas puras del catálogo. Reciben los destinos ya cargados para que el
 * mismo código corra en el servidor, en componentes cliente y en el seed.
 */
import { AGENCY_PHONE, whatsappLink } from "../constants";
import type { Departure, DestinationPage, TransportType } from "./types";

/** Etiqueta legible para UI; el valor canónico en datos sigue sin tilde (`aereo`). */
export function getTransportLabel(transport: TransportType): string {
  switch (transport) {
    case "aereo":
      return "Aéreo";
    case "bus":
      return "Bus";
    case "bus-cama":
      return "Bus Coche Cama";
    case "mix":
      return "Aéreo / Bus";
  }
}

/** WhatsApp con tracking por página de destino (FAQ / detalle). */
export function whatsappDestinoFaq(destino: string): string {
  return whatsappLink(
    AGENCY_PHONE.whatsapp,
    `Hola 787 Rumbos! Quiero consultar por un viaje a ${destino}. (Web - FAQ Destino)`,
  );
}

/** Fecha de hoy a medianoche local (para comparar salidas ISO). */
export function getTodayLocal(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/** True si la salida aún no pasó (incluye el día de hoy). */
export function isDepartureUpcoming(dep: Departure, today = getTodayLocal()): boolean {
  return new Date(dep.date + "T00:00:00") >= today;
}

/** Salidas futuras (cualquier status). */
export function getUpcomingDepartures(dest: DestinationPage): Departure[] {
  const today = getTodayLocal();
  return dest.departures.filter((dep) => isDepartureUpcoming(dep, today));
}

/** Salidas futuras consultables (no sold-out). */
export function getActiveUpcomingDepartures(dest: DestinationPage): Departure[] {
  return getUpcomingDepartures(dest).filter((dep) => dep.status !== "sold-out");
}

/** La salida consultable más cercana. */
export function getNearestActiveDeparture(dest: DestinationPage): Departure | undefined {
  return getActiveUpcomingDepartures(dest)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}

/**
 * Destinos de “Próximas salidas” en la home.
 * Más fechas vigentes primero; si empatan, gana la salida más próxima.
 * Un empate restante conserva el orden del catálogo (el array que entra).
 */
export function getHomeFeaturedDestinations(
  destinations: DestinationPage[],
  limit = 4,
): DestinationPage[] {
  return destinations
    .map((dest) => {
      const upcoming = getActiveUpcomingDepartures(dest);
      const nearest = upcoming.reduce<string | null>(
        (min, dep) => (min === null || dep.date < min ? dep.date : min),
        null,
      );
      const dates = new Set(upcoming.map((dep) => dep.date));
      return { dest, count: dates.size, nearest };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return (a.nearest ?? "").localeCompare(b.nearest ?? "");
    })
    .slice(0, limit)
    .map((item) => item.dest);
}

/** Tarifa “desde” de la ficha: el menor precio de hotel entre las salidas vigentes. */
export function getListedPrice(
  dest: DestinationPage,
): { amount: number; currency: "ARS" | "USD" } | undefined {
  const hotelTrips = getActiveUpcomingDepartures(dest).filter((dep) => !dep.stayLabel);
  const amounts = hotelTrips
    .map((dep) => dep.priceFrom ?? dest.priceFrom)
    .filter((amount): amount is number => amount != null);
  if (amounts.length === 0) {
    if (dest.priceFrom == null) return undefined;
    return { amount: dest.priceFrom, currency: dest.currency };
  }
  const priced = hotelTrips.find((dep) => dep.priceFrom != null);
  return {
    amount: Math.min(...amounts),
    currency: priced?.currency ?? dest.currency,
  };
}

export function getDestinationBySlug(
  destinations: DestinationPage[],
  slug: string,
): DestinationPage | undefined {
  return destinations.find((d) => d.slug === slug);
}

/** Relacionados: mismo cluster fijo primero, luego mismo país, luego región. */
export function getRelatedDestinations(
  destinations: DestinationPage[],
  slug: string,
  limit = 3,
): DestinationPage[] {
  const current = getDestinationBySlug(destinations, slug);
  if (!current) return [];

  const clusterMateSlugs = new Set<string>();
  const fixedClusters: string[][] = [
    ["rio-de-janeiro", "porto-de-galinhas", "camboriu", "f1-grand-premio-sao-paulo"],
    ["salvador-de-bahia", "imbassai", "guarajuba", "praia-do-forte"],
    ["cancun", "playa-del-carmen", "riviera-maya", "punta-cana", "bayahibe"],
    ["termas-rio-hondo", "cataratas-del-iguazu", "salar-de-uyuni"],
  ];
  for (const group of fixedClusters) {
    if (group.includes(slug)) {
      group.forEach((s) => {
        if (s !== slug) clusterMateSlugs.add(s);
      });
    }
  }

  const others = destinations.filter((d) => d.slug !== slug);
  const clusterMates = others
    .filter((d) => clusterMateSlugs.has(d.slug))
    .sort((a, b) => Number(b.country === current.country) - Number(a.country === current.country));
  const sameCountry = others.filter(
    (d) => d.country === current.country && !clusterMateSlugs.has(d.slug),
  );
  const sameRegion = others.filter(
    (d) =>
      d.region === current.region &&
      d.country !== current.country &&
      !clusterMateSlugs.has(d.slug),
  );

  return [...clusterMates, ...sameCountry, ...sameRegion].slice(0, limit);
}

export function getAllDestinationSlugs(destinations: DestinationPage[]): string[] {
  return destinations.map((d) => d.slug);
}
