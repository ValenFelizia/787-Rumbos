/**
 * Reglas puras del catálogo. Reciben los destinos ya cargados para que el
 * mismo código corra en el servidor, en componentes cliente y en el seed.
 *
 * Los helpers de listado/precio aceptan `DestinationListing` (DTO liviano);
 * `DestinationPage` sigue siendo asignable (superset estructural).
 */
import { AGENCY_PHONE, whatsappLink } from "../constants";
import type { DepartureListing, DestinationListing } from "./listing";
import type { DestinationPage, TransportType } from "./types";

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
export function isDepartureUpcoming(
  dep: Pick<DepartureListing, "date">,
  today = getTodayLocal(),
): boolean {
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

/** Salidas futuras (cualquier status). Conserva el tipo de `departures` del input. */
export function getUpcomingDepartures<T extends DestinationListing>(
  dest: T,
  today = getTodayLocal(),
): T["departures"] {
  return dest.departures.filter((dep) =>
    isDepartureUpcoming(dep, today),
  ) as T["departures"];
}

/** Salidas futuras consultables (no sold-out). */
export function getActiveUpcomingDepartures<T extends DestinationListing>(
  dest: T,
  today = getTodayLocal(),
): T["departures"] {
  return getUpcomingDepartures(dest, today).filter(
    (dep) => dep.status !== "sold-out",
  ) as T["departures"];
}

/** Clave de mes de salida (`YYYY-MM`) desde una fecha ISO local. */
export type DepartureMonthKey = string;

/** Chip de mes en `/destinos`: clave estable + etiqueta es-AR corta. */
export type DepartureMonthOption = {
  key: DepartureMonthKey;
  label: string;
};

const MONTH_SHORT_ES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

/** Ventana por defecto de chips de mes (mes actual inclusive). */
export const DEPARTURE_MONTH_WINDOW = 6;

/**
 * Clave `YYYY-MM` de una fecha ISO `YYYY-MM-DD` (parseo local, sin UTC).
 * Misma convención que `isDepartureUpcoming`.
 */
export function getDepartureMonthKey(isoDate: string): DepartureMonthKey {
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!day) {
    // Fallback: mismo parseo local que las salidas.
    const local = new Date(`${isoDate}T00:00:00`);
    const y = local.getFullYear();
    const m = String(local.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }
  return `${day[1]}-${day[2]}`;
}

/** Etiqueta de chip: "Oct 2026" (abreviatura es-AR, capitalizada). */
export function formatDepartureMonthLabel(monthKey: DepartureMonthKey): string {
  const match = /^(\d{4})-(\d{2})$/.exec(monthKey);
  if (!match) return monthKey;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return monthKey;
  return `${MONTH_SHORT_ES[monthIndex]} ${year}`;
}

function monthKeysInWindow(today: Date, monthsAhead: number): DepartureMonthKey[] {
  const keys: DepartureMonthKey[] = [];
  const cursor = new Date(today.getFullYear(), today.getMonth(), 1);
  for (let i = 0; i < monthsAhead; i++) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    keys.push(`${y}-${m}`);
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return keys;
}

/**
 * Meses (próximos `monthsAhead`, default 6) con ≥1 salida activa futura.
 * Sold-out y fechas pasadas no cuentan. Orden cronológico determinista.
 */
export function listAvailableDepartureMonths(
  destinations: DestinationListing[],
  options?: { today?: Date; monthsAhead?: number },
): DepartureMonthOption[] {
  const today = options?.today ?? getTodayLocal();
  const monthsAhead = options?.monthsAhead ?? DEPARTURE_MONTH_WINDOW;
  const windowKeys = monthKeysInWindow(today, monthsAhead);
  const allowed = new Set(windowKeys);
  const withDepartures = new Set<DepartureMonthKey>();

  for (const dest of destinations) {
    for (const dep of getActiveUpcomingDepartures(dest, today)) {
      const key = getDepartureMonthKey(dep.date);
      if (allowed.has(key)) withDepartures.add(key);
    }
  }

  return windowKeys
    .filter((key) => withDepartures.has(key))
    .map((key) => ({ key, label: formatDepartureMonthLabel(key) }));
}

/** True si el destino tiene ≥1 salida activa en el mes `YYYY-MM`. */
export function destinationHasActiveDepartureInMonth(
  dest: DestinationListing,
  monthKey: DepartureMonthKey,
  today = getTodayLocal(),
): boolean {
  return getActiveUpcomingDepartures(dest, today).some(
    (dep) => getDepartureMonthKey(dep.date) === monthKey,
  );
}

/**
 * Filtra destinos con al menos una salida activa en el mes.
 * `monthKey` null/undefined = sin filtro de mes.
 */
export function filterDestinationsByDepartureMonth<T extends DestinationListing>(
  destinations: T[],
  monthKey: DepartureMonthKey | null | undefined,
  today = getTodayLocal(),
): T[] {
  if (!monthKey) return destinations;
  return destinations.filter((dest) =>
    destinationHasActiveDepartureInMonth(dest, monthKey, today),
  );
}

/**
 * Effective month for the current chip list: keep selection if still available,
 * otherwise clear (no useEffect — derive during render to avoid hydration loops).
 */
export function resolveSelectedDepartureMonth(
  selected: DepartureMonthKey | null | undefined,
  monthOptions: DepartureMonthOption[],
): DepartureMonthKey | null {
  if (!selected) return null;
  return monthOptions.some((option) => option.key === selected) ? selected : null;
}

/** La salida consultable más cercana. */
export function getNearestActiveDeparture<T extends DestinationListing>(
  dest: T,
  today = getTodayLocal(),
): T["departures"][number] | undefined {
  return getActiveUpcomingDepartures(dest, today)
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

function applicableValidity(dep: DepartureListing, dest: DestinationListing): string | undefined {
  return dep.priceValidUntil ?? dest.priceValidUntil;
}

/** YYYY-MM-DD para JSON-LD / UI; ignora horas si vienen del CMS. */
function validityDay(value?: string | null): string | undefined {
  if (!value) return undefined;
  return /^(\d{4}-\d{2}-\d{2})/.exec(value)?.[1];
}

/** Precio propio de la salida, si no está vencido. Sin monto propio, undefined. */
export function isDeparturePriceExpired(
  dest: DestinationListing,
  dep: DepartureListing,
  today = getTodayLocal(),
): boolean {
  return dep.priceFrom != null && isPriceExpired(applicableValidity(dep, dest), today);
}

/** Oferta “desde” publicada (monto + vigencia) para ficha, listado y JSON-LD. */
export type ListedOffer = {
  amount: number;
  currency: "ARS" | "USD";
  /** Vigencia aplicable YYYY-MM-DD; ausente = sin vencimiento cargado. */
  priceValidUntil?: string;
};

function destinationBaseOffer(
  dest: DestinationListing,
  today: Date,
  respectExpiry: boolean,
): ListedOffer | undefined {
  if (dest.priceFrom == null) return undefined;
  if (respectExpiry && isPriceExpired(dest.priceValidUntil, today)) return undefined;
  const priceValidUntil = validityDay(dest.priceValidUntil);
  return {
    amount: dest.priceFrom,
    currency: dest.currency,
    ...(priceValidUntil ? { priceValidUntil } : {}),
  };
}

/**
 * Precio publicado de una salida (ficha, home card, JSON-LD por fila).
 * Own amount if present and not expired.
 * Else, when no active hotel departure publishes its own price, inherit dest.priceFrom
 * (Porto / Cataratas shape). Never dilute an explicit sibling min with a stale base (Río).
 * Solo aéreo without its own fare does not inherit the hotel package base.
 */
function departureOffer(
  dest: DestinationListing,
  dep: DepartureListing,
  today: Date,
  respectExpiry: boolean,
): ListedOffer | undefined {
  if (dep.priceFrom != null) {
    const validity = applicableValidity(dep, dest);
    if (respectExpiry && isPriceExpired(validity, today)) return undefined;
    const priceValidUntil = validityDay(validity);
    return {
      amount: dep.priceFrom,
      currency: dep.currency ?? dest.currency,
      ...(priceValidUntil ? { priceValidUntil } : {}),
    };
  }

  if (dep.stayLabel) return undefined;

  const hotelTrips = getActiveUpcomingDepartures(dest, today).filter((row) => !row.stayLabel);
  if (hotelTrips.some((row) => row.priceFrom != null)) return undefined;

  return destinationBaseOffer(dest, today, respectExpiry);
}

/** Precio publicado de una salida en la ficha (mismo criterio que el Offer JSON-LD). */
export function getDeparturePublishedPrice(
  dest: DestinationListing,
  dep: DepartureListing,
  today = getTodayLocal(),
): ListedOffer | undefined {
  return departureOffer(dest, dep, today, true);
}

/**
 * Tarifa “desde” publicada.
 * Min of per-departure offers (same resolver as ficha rows / home card).
 * Empty hotel list falls back to destination base.
 */
function listedOffer(
  dest: DestinationListing,
  today: Date,
  respectExpiry: boolean,
): ListedOffer | undefined {
  const hotelTrips = getActiveUpcomingDepartures(dest, today).filter((dep) => !dep.stayLabel);
  if (hotelTrips.length === 0) {
    return destinationBaseOffer(dest, today, respectExpiry);
  }

  const offers: ListedOffer[] = [];
  for (const dep of hotelTrips) {
    const offer = departureOffer(dest, dep, today, respectExpiry);
    if (offer) offers.push(offer);
  }
  if (offers.length === 0) return undefined;
  return offers.reduce((best, offer) => (offer.amount < best.amount ? offer : best));
}

/** Oferta “desde” vigente (monto + currency + vigencia) para UI y JSON-LD. */
export function getListedOffer(
  dest: DestinationListing,
  today = getTodayLocal(),
): ListedOffer | undefined {
  return listedOffer(dest, today, true);
}

/** Tarifa “desde” de la ficha: el menor precio de hotel entre las salidas vigentes. */
export function getListedPrice(
  dest: DestinationListing,
  today = getTodayLocal(),
): { amount: number; currency: "ARS" | "USD" } | undefined {
  const offer = listedOffer(dest, today, true);
  if (!offer) return undefined;
  return { amount: offer.amount, currency: offer.currency };
}

/** Había un monto para mostrar, pero todas las vigencias que lo cubren ya vencieron. */
export function hasExpiredListedPrice(dest: DestinationListing, today = getTodayLocal()): boolean {
  return listedOffer(dest, today, false) != null && listedOffer(dest, today, true) == null;
}

export function getDestinationBySlug(
  destinations: DestinationPage[],
  slug: string,
): DestinationPage | undefined {
  return destinations.find((d) => d.slug === slug);
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

/** Chip auxiliar “Moneda” al ordenar por precio (QOL-02). Default: Todas. */
export type DestinosCurrencyFilter = "all" | "ARS" | "USD";

export const DESTINOS_CURRENCY_FILTER_OPTIONS: {
  value: DestinosCurrencyFilter;
  label: string;
}[] = [
  { value: "all", label: "Todas" },
  { value: "ARS", label: "ARS" },
  { value: "USD", label: "USD" },
];

export function isPriceSortMode(mode: DestinosSortMode): boolean {
  return mode === "price-asc" || mode === "price-desc";
}

/**
 * Refina el listado al ordenar por precio: ARS/USD dejan solo destinos con
 * `getListedPrice` en esa moneda. “Todas” no filtra (conserva bloques QOL-01).
 * Sin precio / vencido no matchean ARS ni USD (solo aparecen con Todas).
 */
export function filterDestinationsByCurrency<T extends DestinationListing>(
  destinations: T[],
  currencyFilter: DestinosCurrencyFilter,
  today = getTodayLocal(),
): T[] {
  if (currencyFilter === "all") return destinations;
  return destinations.filter((dest) => getListedPrice(dest, today)?.currency === currencyFilter);
}

/** Bloque del listado: con encabezado de moneda solo cuando el sort por precio mezcla ARS y USD. */
export type DestinationSortGroup<T extends DestinationListing = DestinationListing> = {
  heading?: "En pesos" | "En dólares";
  items: T[];
};

function catalogOrderIndex(
  destinations: DestinationListing[],
  catalogOrder: DestinationListing[],
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
  a: DestinationListing,
  b: DestinationListing,
  orderIndex: Map<string, number>,
): number {
  const ia = orderIndex.get(a.slug) ?? 0;
  const ib = orderIndex.get(b.slug) ?? 0;
  if (ia !== ib) return ia - ib;
  return a.name.localeCompare(b.name, "es");
}

function compareListedPriceAmount(
  a: DestinationListing,
  b: DestinationListing,
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
export function groupDestinationsForSort<T extends DestinationListing>(
  destinations: T[],
  mode: DestinosSortMode,
  options?: { today?: Date; catalogOrder?: DestinationListing[] },
): DestinationSortGroup<T>[] {
  const today = options?.today ?? getTodayLocal();
  const catalogOrder = options?.catalogOrder ?? destinations;
  const orderIndex = catalogOrderIndex(destinations, catalogOrder);

  if (mode === "featured") {
    return [{ items: destinations.slice() }];
  }

  if (mode === "next-departure") {
    const items = destinations.slice().sort((a, b) => {
      const da = getNearestActiveDeparture(a, today)?.date;
      const db = getNearestActiveDeparture(b, today)?.date;
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
  const ars: T[] = [];
  const usd: T[] = [];
  const unpriced: T[] = [];

  for (const dest of destinations) {
    const listed = getListedPrice(dest, today);
    if (listed == null) unpriced.push(dest);
    else if (listed.currency === "USD") usd.push(dest);
    else ars.push(dest);
  }

  const byPrice = (a: T, b: T) =>
    compareListedPriceAmount(a, b, direction, orderIndex, today);

  ars.sort(byPrice);
  usd.sort(byPrice);
  unpriced.sort((a, b) => compareCatalogTies(a, b, orderIndex));

  const mixedCurrencies = ars.length > 0 && usd.length > 0;
  if (!mixedCurrencies) {
    return [{ items: [...ars, ...usd, ...unpriced] }];
  }

  const groups: DestinationSortGroup<T>[] = [
    { heading: "En pesos", items: ars },
    { heading: "En dólares", items: usd },
  ];
  if (unpriced.length > 0) {
    groups.push({ items: unpriced });
  }
  return groups;
}

/** City claim the home card may print. omit prints nothing. */
export type CardOrigin = "cordoba-or-ezeiza" | "bus" | "omit";

export type ShownPrice =
  | {
      kind: "amount";
      currency: "ARS" | "USD";
      amount: number;
      quotedAs: "desde" | "final";
    }
  | { kind: "ask" };

export type HomeDepartureView = {
  displayDate: string;
  transport: TransportType;
  nights: number;
  origin: CardOrigin;
  price: ShownPrice;
};

export type DepartureBadge =
  | { kind: "past"; label: "Viaje Realizado" }
  | { kind: "sold-out"; label: "Cupos Completos" }
  | { kind: "soon"; label: "Consultar Lugares" }
  | { kind: "few-seats"; label: "Últimos Cupos" }
  | { kind: "confirmed"; label: "Salida Confirmada" }
  | { kind: "inquire"; label: "Consultar disponibilidad" };

const MS_PER_DAY = 86_400_000;

/**
 * Note phrase wins over transport.
 * Córdoba alone is not a claim.
 */
export function getCardOrigin(dep: {
  transport: TransportType;
  note?: string;
}): CardOrigin {
  if (dep.note && /Córdoba o Ezeiza/i.test(dep.note)) return "cordoba-or-ezeiza";
  if (dep.transport === "bus" || dep.transport === "bus-cama") return "bus";
  return "omit";
}

export function formatCardOriginLine(
  origin: CardOrigin,
): "Córdoba o Ezeiza" | "Bus" | null {
  switch (origin) {
    case "cordoba-or-ezeiza":
      return "Córdoba o Ezeiza";
    case "bus":
      return "Bus";
    case "omit":
      return null;
  }
}

/** Currency + amount only. Keep this token unbreakable in UI (`whitespace-nowrap`). */
export function formatShownMoney(currency: "ARS" | "USD", amount: number): string {
  const digits = amount.toLocaleString("es-AR");
  return currency === "USD" ? `USD ${digits}` : `$${digits}`;
}

/**
 * Same-date tie-break for the home card only: hotel before solo aéreo, then cheaper.
 * Leaves `getNearestActiveDeparture` unchanged for hubs and sticky bars.
 */
function pickHomeCardDeparture(
  dest: DestinationListing,
  today: Date,
): DepartureListing | undefined {
  const active = getActiveUpcomingDepartures(dest, today);
  if (active.length === 0) return undefined;
  const nearestDate = active.reduce(
    (min, dep) => (dep.date < min ? dep.date : min),
    active[0].date,
  );
  return active
    .filter((dep) => dep.date === nearestDate)
    .slice()
    .sort((a, b) => {
      if (Boolean(a.stayLabel) !== Boolean(b.stayLabel)) return a.stayLabel ? 1 : -1;
      return (a.priceFrom ?? Number.POSITIVE_INFINITY) - (b.priceFrom ?? Number.POSITIVE_INFINITY);
    })[0];
}

/** Home card view of the nearest departure. Price uses getDeparturePublishedPrice. */
export function readHomeDeparture(
  dest: DestinationListing,
  today = getTodayLocal(),
): HomeDepartureView | null {
  const dep = pickHomeCardDeparture(dest, today);
  if (!dep) return null;
  const published = getDeparturePublishedPrice(dest, dep, today);
  const price: ShownPrice = published
    ? {
        kind: "amount",
        currency: published.currency,
        amount: published.amount,
        quotedAs: dep.priceIsFinal ? "final" : "desde",
      }
    : { kind: "ask" };
  return {
    displayDate: dep.displayDate,
    transport: dep.transport,
    nights: dep.nights,
    origin: getCardOrigin(dep),
    price,
  };
}

/** Card string. ask is Consultá precio. USD has a space. $ does not. */
export function formatShownPrice(price: ShownPrice): string {
  if (price.kind === "ask") return "Consultá precio";
  const prefix = price.quotedAs === "final" ? "Final" : "Desde";
  return `${prefix} ${formatShownMoney(price.currency, price.amount)}`;
}

export function formatHomeCardPriceClause(price: ShownPrice): string {
  if (price.kind === "ask") return "precio a consultar";
  const prefix = price.quotedAs === "final" ? "final" : "desde";
  return `${prefix} ${formatShownMoney(price.currency, price.amount)}`;
}

export type FormattedShownPriceParts =
  | {
      kind: "amount";
      prefix: string;
      amount: string;
    }
  | {
      kind: "ask";
      label: "Consultá precio";
    };

/**
 * Partes estructuradas del precio para tarjetas donde el calificador
 * ('desde USD' / 'desde') se maqueta con jerarquía visual distinta del importe.
 */
export function formatShownPriceParts(
  price?: ShownPrice | null,
): FormattedShownPriceParts {
  if (!price || price.kind === "ask") {
    return { kind: "ask", label: "Consultá precio" };
  }
  const prefixWord = price.quotedAs === "final" ? "final" : "desde";
  const isUsd = price.currency === "USD";
  return {
    kind: "amount",
    prefix: isUsd ? `${prefixWord} USD` : prefixWord,
    amount: isUsd
      ? price.amount.toLocaleString("es-AR")
      : `$${price.amount.toLocaleString("es-AR")}`,
  };
}

/**
 * First match wins. today is already midnight.
 * A status outside the known set is inquire, never Salida Confirmada.
 */
export function getDepartureBadge(
  dep: { date: string; status: string },
  today = getTodayLocal(),
): DepartureBadge {
  const depDate = new Date(`${dep.date}T00:00:00`);
  if (depDate < today) return { kind: "past", label: "Viaje Realizado" };
  if (dep.status === "sold-out") return { kind: "sold-out", label: "Cupos Completos" };
  const diffDays = Math.ceil((depDate.getTime() - today.getTime()) / MS_PER_DAY);
  if (diffDays <= 3) return { kind: "soon", label: "Consultar Lugares" };
  if (dep.status === "few-seats") return { kind: "few-seats", label: "Últimos Cupos" };
  if (dep.status === "confirmed") return { kind: "confirmed", label: "Salida Confirmada" };
  return { kind: "inquire", label: "Consultar disponibilidad" };
}

export function departureBadgeSelectable(badge: DepartureBadge): boolean {
  return badge.kind !== "past" && badge.kind !== "sold-out";
}
