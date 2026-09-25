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

/**
 * Vencido solo si hay fecha y es anterior a hoy. El día indicado sigue vigente.
 * Sin fecha no hay vencimiento (el seed no carga vigencia).
 */
export function isPriceExpired(validUntil?: string | null, today = getTodayLocal()): boolean {
  if (!validUntil) return false;
  const day = /^(\d{4}-\d{2}-\d{2})/.exec(validUntil)?.[1];
  if (!day) return false;
  return new Date(`${day}T00:00:00`) < today;
}

/** Salidas futuras (cualquier status). */
export function getUpcomingDepartures(dest: DestinationPage, today = getTodayLocal()): Departure[] {
  return dest.departures.filter((dep) => isDepartureUpcoming(dep, today));
}

/** Salidas futuras consultables (no sold-out). */
export function getActiveUpcomingDepartures(dest: DestinationPage, today = getTodayLocal()): Departure[] {
  return getUpcomingDepartures(dest, today).filter((dep) => dep.status !== "sold-out");
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

/** Tope de chips de sugerencia en el cotizador (paso 1). */
export const QUOTE_SUGGESTION_LIMIT = 6;

/**
 * Nombres para chips del cotizador: publicados con salidas activas,
 * en el orden del catálogo (`sortOrder` CMS) y acotados a un tope chico.
 */
export function getQuoteSuggestionNames(
  destinations: DestinationPage[],
  limit = QUOTE_SUGGESTION_LIMIT,
  today = getTodayLocal(),
): string[] {
  return destinations
    .filter((dest) => getActiveUpcomingDepartures(dest, today).length > 0)
    .slice(0, limit)
    .map((dest) => dest.name);
}

function applicableValidity(dep: Departure, dest: DestinationPage): string | undefined {
  return dep.priceValidUntil ?? dest.priceValidUntil;
}

/** Precio propio de la salida, si no está vencido. Sin monto propio, undefined. */
export function isDeparturePriceExpired(
  dest: DestinationPage,
  dep: Departure,
  today = getTodayLocal(),
): boolean {
  return dep.priceFrom != null && isPriceExpired(applicableValidity(dep, dest), today);
}

function contribution(
  dest: DestinationPage,
  dep: Departure,
  today: Date,
  respectExpiry: boolean,
): number | undefined {
  if (dep.priceFrom != null) {
    if (respectExpiry && isPriceExpired(applicableValidity(dep, dest), today)) return undefined;
    return dep.priceFrom;
  }
  if (dest.priceFrom == null) return undefined;
  if (respectExpiry && isPriceExpired(dest.priceValidUntil, today)) return undefined;
  return dest.priceFrom;
}

function listedPrice(
  dest: DestinationPage,
  today: Date,
  respectExpiry: boolean,
): { amount: number; currency: "ARS" | "USD" } | undefined {
  const hotelTrips = getActiveUpcomingDepartures(dest, today).filter((dep) => !dep.stayLabel);
  const amounts = hotelTrips
    .map((dep) => contribution(dest, dep, today, respectExpiry))
    .filter((amount): amount is number => amount != null);
  if (amounts.length === 0) {
    if (hotelTrips.length > 0) return undefined;
    if (dest.priceFrom == null) return undefined;
    if (respectExpiry && isPriceExpired(dest.priceValidUntil, today)) return undefined;
    return { amount: dest.priceFrom, currency: dest.currency };
  }
  const priced = hotelTrips.find((dep) => {
    if (dep.priceFrom == null) return false;
    return !respectExpiry || !isPriceExpired(applicableValidity(dep, dest), today);
  });
  return {
    amount: Math.min(...amounts),
    currency: priced?.currency ?? dest.currency,
  };
}

/** Tarifa “desde” de la ficha: el menor precio de hotel entre las salidas vigentes. */
export function getListedPrice(
  dest: DestinationPage,
  today = getTodayLocal(),
): { amount: number; currency: "ARS" | "USD" } | undefined {
  return listedPrice(dest, today, true);
}

/** Había un monto para mostrar, pero todas las vigencias que lo cubren ya vencieron. */
export function hasExpiredListedPrice(dest: DestinationPage, today = getTodayLocal()): boolean {
  return listedPrice(dest, today, false) != null && listedPrice(dest, today, true) == null;
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

/** Modos del select “Ordenar” en `/destinos`. */
export type DestinosSortMode = "featured" | "price-asc" | "price-desc" | "next-departure";

export const DESTINOS_SORT_OPTIONS: { value: DestinosSortMode; label: string }[] = [
  { value: "featured", label: "Destacados" },
  { value: "price-asc", label: "Precio menor a mayor" },
  { value: "price-desc", label: "Precio mayor a menor" },
  { value: "next-departure", label: "Próxima salida" },
];

/** Bloque del listado: con encabezado de moneda solo cuando el sort por precio mezcla ARS y USD. */
export type DestinationSortGroup = {
  heading?: "En pesos" | "En dólares";
  items: DestinationPage[];
};

function catalogOrderIndex(
  destinations: DestinationPage[],
  catalogOrder: DestinationPage[],
): Map<string, number> {
  const index = new Map<string, number>();
  catalogOrder.forEach((dest, i) => {
    if (!index.has(dest.slug)) index.set(dest.slug, i);
  });
  // Destinos que no estén en el catálogo de referencia quedan al final.
  destinations.forEach((dest, i) => {
    if (!index.has(dest.slug)) index.set(dest.slug, catalogOrder.length + i);
  });
  return index;
}

function compareCatalogTies(
  a: DestinationPage,
  b: DestinationPage,
  orderIndex: Map<string, number>,
): number {
  const ia = orderIndex.get(a.slug) ?? 0;
  const ib = orderIndex.get(b.slug) ?? 0;
  if (ia !== ib) return ia - ib;
  return a.name.localeCompare(b.name, "es");
}

function compareListedPriceAmount(
  a: DestinationPage,
  b: DestinationPage,
  direction: "asc" | "desc",
  orderIndex: Map<string, number>,
  today: Date,
): number {
  const pa = getListedPrice(a, today);
  const pb = getListedPrice(b, today);
  if (pa == null && pb == null) return compareCatalogTies(a, b, orderIndex);
  if (pa == null) return 1;
  if (pb == null) return -1;
  const diff = direction === "asc" ? pa.amount - pb.amount : pb.amount - pa.amount;
  if (diff !== 0) return diff;
  return compareCatalogTies(a, b, orderIndex);
}

/**
 * Ordena el listado de `/destinos` para el select Ordenar.
 * - `featured`: conserva el orden de entrada (Payload `sortOrder`).
 * - `price-*`: clave = `getListedPrice`; nunca mezcla ARS/USD en la misma escala;
 *   sin precio / vencido / “Consultar” al final; monedas mixtas → bloques “En pesos” / “En dólares”.
 * - `next-departure`: por la salida activa más próxima; sin salida al final.
 * Empates: orden de catálogo (`sortOrder`), luego nombre.
 */
export function groupDestinationsForSort(
  destinations: DestinationPage[],
  mode: DestinosSortMode,
  options?: { today?: Date; catalogOrder?: DestinationPage[] },
): DestinationSortGroup[] {
  const today = options?.today ?? getTodayLocal();
  const catalogOrder = options?.catalogOrder ?? destinations;
  const orderIndex = catalogOrderIndex(destinations, catalogOrder);

  if (mode === "featured") {
    return [{ items: destinations.slice() }];
  }

  if (mode === "next-departure") {
    const items = destinations.slice().sort((a, b) => {
      const da = getNearestActiveDeparture(a)?.date;
      const db = getNearestActiveDeparture(b)?.date;
      if (!da && !db) return compareCatalogTies(a, b, orderIndex);
      if (!da) return 1;
      if (!db) return -1;
      const byDate = da.localeCompare(db);
      if (byDate !== 0) return byDate;
      return compareCatalogTies(a, b, orderIndex);
    });
    return [{ items }];
  }

  const direction = mode === "price-asc" ? "asc" : "desc";
  const ars: DestinationPage[] = [];
  const usd: DestinationPage[] = [];
  const unpriced: DestinationPage[] = [];

  for (const dest of destinations) {
    const listed = getListedPrice(dest, today);
    if (listed == null) unpriced.push(dest);
    else if (listed.currency === "USD") usd.push(dest);
    else ars.push(dest);
  }

  const byPrice = (a: DestinationPage, b: DestinationPage) =>
    compareListedPriceAmount(a, b, direction, orderIndex, today);

  ars.sort(byPrice);
  usd.sort(byPrice);
  unpriced.sort((a, b) => compareCatalogTies(a, b, orderIndex));

  const mixedCurrencies = ars.length > 0 && usd.length > 0;
  if (!mixedCurrencies) {
    return [{ items: [...ars, ...usd, ...unpriced] }];
  }

  const groups: DestinationSortGroup[] = [
    { heading: "En pesos", items: ars },
    { heading: "En dólares", items: usd },
  ];
  if (unpriced.length > 0) {
    groups.push({ items: unpriced });
  }
  return groups;
}
