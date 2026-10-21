import type { DepartureListing, DestinationListing } from "@/lib/catalog/listing";
import {
  formatShownMoney,
  getActiveUpcomingDepartures,
  getTodayLocal,
  readHomeDeparture,
  type HomeDepartureView,
} from "@/lib/catalog/logic";

export const META_DESCRIPTION_MAX = 155;

type OfferDeparture = DepartureListing & { program?: string };

export type OfferDescriptionInput = Omit<DestinationListing, "departures"> & {
  typicalInclusions?: readonly string[];
  priceNote?: string;
  departures: OfferDeparture[];
};

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

const DISPLAY_DATE = new RegExp(`^\\d{1,2} de (${MONTHS.join("|")})$`);

const BANNED: readonly RegExp[] = [
  /desde córdoba/i,
  /atenci[oó]n humana/i,
  /v[ií]a bariloche/i,
  /v[ií]a tac/i,
];

const CONSULT_CLAUSE = "Consultá salidas y precio.";
const ALL_INCLUSIVE = /all[\s-]*inclusive/i;
const AIR_WORD = /a[eé]reos?|vuelos?|charter/i;
const HOTEL_WORD = /hotels?|alojamientos?/i;
const TRANSFER_WORD = /traslados?/i;
const EVENT_PACKAGE =
  /(?:^|[^a-z0-9])(?:f1|grand[\s-]*premio|formula[\s-]*1)(?:[^a-z0-9]|$)/;

type ShownMoney = {
  currency: "ARS" | "USD";
  amount: number;
  quotedAs: "desde" | "final";
};

type Quote =
  | { kind: "priced"; dateIso: string; dateLabel: string; money: ShownMoney }
  | { kind: "unpriced"; dateIso: string; dateLabel: string }
  | { kind: "none" };

type Ficha = {
  name: string;
  quote: Quote;
  tail: string;
};

type Hub = {
  country?: string;
  beaches: readonly string[];
  quote: Quote;
  tail: string;
};

type PricedRow = {
  index: number;
  quote: Extract<Quote, { kind: "priced" }>;
  view: HomeDepartureView;
};

type IntentFacts = {
  nights?: number;
  airTransport: boolean;
  texts: readonly string[];
  inclusionTexts: readonly string[];
};

export function describeDestinationListing(
  dest: OfferDescriptionInput,
  today = getTodayLocal(),
): string {
  const view = readHomeDeparture(dest, today);
  return finishFicha({
    name: dest.name,
    quote: toQuote(view),
    tail: intentTail(intentFacts(dest, view, today)),
  });
}

export function describeClusterListings(
  membersInClusterOrder: readonly OfferDescriptionInput[],
  today = getTodayLocal(),
): string {
  const pool = membersInClusterOrder.filter((member) => !isEventPackage(member));
  const country = sharedCountry(pool);
  const winner = pickEarliestPriced(pricedRows(pool, today));
  const winnerDest = winner ? pool[winner.index] : undefined;
  return finishHub({
    ...(country ? { country } : {}),
    beaches: beachLabels(pool),
    quote: winner ? winner.quote : { kind: "none" },
    tail: winner && winnerDest ? intentTail(intentFacts(winnerDest, winner.view, today)) : "",
  });
}

export function isEventPackage(dest: { slug: string; name: string }): boolean {
  const folded = `${dest.slug} ${dest.name}`
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  return EVENT_PACKAGE.test(folded);
}

function intentFacts(
  dest: OfferDescriptionInput,
  view: HomeDepartureView | null,
  today: Date,
): IntentFacts {
  const quoted = view ? quotedDeparture(dest, view, today) : undefined;
  const inclusions = dest.typicalInclusions ?? [];
  const texts = [quoted?.note, quoted?.program, dest.priceNote, ...inclusions].filter(
    (text): text is string => typeof text === "string" && text.trim().length > 0,
  );
  return {
    ...(view && view.nights > 0 ? { nights: view.nights } : {}),
    airTransport: view?.transport === "aereo",
    texts,
    inclusionTexts: inclusions,
  };
}

function quotedDeparture(
  dest: OfferDescriptionInput,
  view: HomeDepartureView,
  today: Date,
) {
  return getActiveUpcomingDepartures(dest, today)
    .filter((dep) => dep.date === view.dateIso)
    .slice()
    .sort(hotelPackageBeforeLowerPrice)[0];
}

function hotelPackageBeforeLowerPrice(
  a: { stayLabel?: string; priceFrom?: number },
  b: { stayLabel?: string; priceFrom?: number },
): number {
  if (Boolean(a.stayLabel) !== Boolean(b.stayLabel)) return a.stayLabel ? 1 : -1;
  return (a.priceFrom ?? Number.POSITIVE_INFINITY) - (b.priceFrom ?? Number.POSITIVE_INFINITY);
}

function intentTail(facts: IntentFacts): string {
  if (facts.nights && facts.texts.some((text) => ALL_INCLUSIVE.test(text))) {
    return `${facts.nights} noches All Inclusive.`;
  }
  const packaged = evidencedPackageTail(facts);
  if (packaged) return packaged;
  if (facts.nights && facts.airTransport) return `${facts.nights} noches con aéreo.`;
  if (facts.nights) return `${facts.nights} noches.`;
  return "";
}

function evidencedPackageTail(facts: IntentFacts): string {
  const airWord = facts.inclusionTexts.some((text) => AIR_WORD.test(text));
  const hotel = facts.inclusionTexts.some((text) => HOTEL_WORD.test(text));
  const transfer = facts.inclusionTexts.some((text) => TRANSFER_WORD.test(text));
  if (!airWord && !hotel && !transfer) return "";
  const nouns: string[] = [];
  if (airWord || facts.airTransport) nouns.push("aéreo");
  if (hotel) nouns.push("hotel");
  if (transfer) nouns.push("traslados");
  return joinPackage(nouns);
}

function joinPackage(nouns: readonly string[]): string {
  const last = nouns[nouns.length - 1];
  if (!last) return "";
  if (nouns.length === 1) return `Paquete con ${last}.`;
  const lead = nouns.slice(0, -1).join(", ");
  return `Paquete con ${lead} y ${last}.`;
}

function normalizeWords(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function subjectName(name: string): string {
  const trimmed = normalizeWords(name);
  return trimmed.length > 0 ? trimmed : "Este destino";
}

function beachLabel(name: string): string {
  const trimmed = normalizeWords(name);
  const head = /^(.*)\s+de\s+\S+$/i.exec(trimmed)?.[1]?.trim() ?? "";
  return [...head].length >= 3 ? head : trimmed;
}

function beachLabels(members: readonly OfferDescriptionInput[]): string[] {
  return members
    .slice(0, 3)
    .map((member) => beachLabel(member.name))
    .filter((label) => label.length > 0);
}

function labelFor(dateIso: string, displayDate: string): string | undefined {
  const shown = displayDate.trim();
  if (DISPLAY_DATE.test(shown)) return shown;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso);
  if (!match) return undefined;
  const month = Number(match[2]);
  const day = Number(match[3]);
  const monthName = MONTHS[month - 1];
  if (!monthName || day < 1 || day > 31) return undefined;
  return `${day} de ${monthName}`;
}

function toQuote(view: HomeDepartureView | null): Quote {
  if (!view) return { kind: "none" };
  const dateLabel = labelFor(view.dateIso, view.displayDate);
  if (!dateLabel) return { kind: "none" };
  if (view.price.kind === "amount" && Number.isFinite(view.price.amount)) {
    return {
      kind: "priced",
      dateIso: view.dateIso,
      dateLabel,
      money: {
        currency: view.price.currency,
        amount: view.price.amount,
        quotedAs: view.price.quotedAs,
      },
    };
  }
  return { kind: "unpriced", dateIso: view.dateIso, dateLabel };
}

function isBanned(text: string): boolean {
  return BANNED.some((pattern) => pattern.test(text));
}

function renderFicha(sentence: Ficha): string {
  let text: string;
  switch (sentence.quote.kind) {
    case "priced": {
      const money = formatShownMoney(sentence.quote.money.currency, sentence.quote.money.amount);
      text = `Paquete a ${sentence.name}, salida ${sentence.quote.dateLabel}, ${sentence.quote.money.quotedAs} ${money}.`;
      break;
    }
    case "unpriced":
      text = `Paquete a ${sentence.name}, salida ${sentence.quote.dateLabel}. Consultá precio.`;
      break;
    case "none":
      text = `Paquete a ${sentence.name}. Consultá salidas y precio.`;
      break;
  }
  return sentence.tail ? `${text} ${sentence.tail}` : text;
}

function fichaTexts(sentence: Ficha): string[] {
  const texts: string[] = [];
  if (sentence.tail) texts.push(renderFicha(sentence));
  const bare: Ficha = { ...sentence, tail: "" };
  texts.push(renderFicha(bare));
  if (sentence.quote.kind === "priced") {
    texts.push(
      renderFicha({
        ...bare,
        quote: {
          kind: "unpriced",
          dateIso: sentence.quote.dateIso,
          dateLabel: sentence.quote.dateLabel,
        },
      }),
    );
  }
  if (sentence.quote.kind !== "none") {
    texts.push(renderFicha({ ...bare, quote: { kind: "none" } }));
  }
  return texts;
}

function fallbackFicha(name: string): Ficha {
  return {
    name: isBanned(name) ? "Este destino" : subjectName(name),
    quote: { kind: "none" },
    tail: "",
  };
}

function finishFicha(sentence: Ficha): string {
  const ready: Ficha = { ...sentence, name: subjectName(sentence.name) };
  if (isBanned(renderFicha(ready))) return fitTexts(fichaTexts(fallbackFicha(ready.name)));
  const fitted = fitTexts(fichaTexts(ready));
  if (isBanned(fitted)) return fitTexts(fichaTexts(fallbackFicha(ready.name)));
  return fitted;
}

function hubHeading(country: string | undefined): string {
  return country ? `Paquetes a ${country}` : "Paquetes";
}

function renderHub(sentence: Hub): string {
  const heading = hubHeading(sentence.country);
  const place =
    sentence.beaches.length > 0 ? `${heading}: ${sentence.beaches.join(", ")}` : heading;
  let text: string;
  switch (sentence.quote.kind) {
    case "priced": {
      const money = formatShownMoney(sentence.quote.money.currency, sentence.quote.money.amount);
      text = `${place}. Próxima salida ${sentence.quote.dateLabel}, ${sentence.quote.money.quotedAs} ${money}.`;
      break;
    }
    case "unpriced":
      text = `${place}. Próxima salida ${sentence.quote.dateLabel}. Consultá precio.`;
      break;
    case "none":
      text = `${place}. Consultá salidas y precio.`;
      break;
  }
  return sentence.tail ? `${text} ${sentence.tail}` : text;
}

function hubTexts(sentence: Hub): string[] {
  const texts: string[] = [];
  if (sentence.tail) texts.push(renderHub(sentence));
  const bare: Hub = { ...sentence, tail: "" };
  texts.push(renderHub(bare));
  if (sentence.quote.kind === "priced") {
    texts.push(
      renderHub({
        ...bare,
        quote: {
          kind: "unpriced",
          dateIso: sentence.quote.dateIso,
          dateLabel: sentence.quote.dateLabel,
        },
      }),
    );
  }
  if (sentence.quote.kind !== "none") {
    texts.push(renderHub({ ...bare, quote: { kind: "none" } }));
  }
  if (bare.beaches.length > 0) {
    texts.push(renderHub({ ...bare, beaches: [], quote: { kind: "none" } }));
  }
  if (bare.country) {
    texts.push(renderHub({ country: undefined, beaches: [], quote: { kind: "none" }, tail: "" }));
  }
  return texts;
}

function finishHub(sentence: Hub): string {
  if (isBanned(renderHub(sentence))) return fitTexts(hubTexts(emptyHub()));
  const fitted = fitTexts(hubTexts(sentence));
  if (isBanned(fitted)) return fitTexts(hubTexts(emptyHub()));
  return fitted;
}

function emptyHub(): Hub {
  return { beaches: [], quote: { kind: "none" }, tail: "" };
}

function fitTexts(texts: readonly string[]): string {
  for (const text of texts) {
    if (text.length <= META_DESCRIPTION_MAX) return text;
  }
  return truncate(texts[texts.length - 1] ?? CONSULT_CLAUSE);
}

function truncate(text: string): string {
  if (text.length <= META_DESCRIPTION_MAX) return text;
  const tokens = text.match(/\S+/g) ?? [];
  if (tokens.some((token) => token.length > META_DESCRIPTION_MAX)) return CONSULT_CLAUSE;
  const boundary = lastWordEnd(text, META_DESCRIPTION_MAX);
  if (boundary <= 0) return CONSULT_CLAUSE;
  const prefix = text.slice(0, boundary).replace(/[\s,;:]+$/u, "");
  return prefix.length > 0 ? prefix : CONSULT_CLAUSE;
}

function lastWordEnd(text: string, limit: number): number {
  const head = text.slice(0, Math.max(0, limit));
  let boundary = -1;
  for (let index = 0; index < head.length; index++) {
    if (/\s/.test(head[index] ?? "")) boundary = index;
  }
  return boundary;
}

function sharedCountry(members: readonly OfferDescriptionInput[]): string | undefined {
  const first = members[0] ? normalizeWords(members[0].country) : "";
  if (!first) return undefined;
  return members.every((member) => normalizeWords(member.country) === first) ? first : undefined;
}

function pricedRows(members: readonly OfferDescriptionInput[], today: Date): PricedRow[] {
  const rows: PricedRow[] = [];
  for (let index = 0; index < members.length; index++) {
    const dest = members[index];
    if (!dest) continue;
    const view = readHomeDeparture(dest, today);
    const quote = toQuote(view);
    if (!view || quote.kind !== "priced") continue;
    rows.push({ index, quote, view });
  }
  return rows;
}

function pickEarliestPriced(rows: readonly PricedRow[]): PricedRow | undefined {
  return rows.slice().sort((a, b) => {
    if (a.quote.dateIso < b.quote.dateIso) return -1;
    if (a.quote.dateIso > b.quote.dateIso) return 1;
    return a.index - b.index;
  })[0];
}
