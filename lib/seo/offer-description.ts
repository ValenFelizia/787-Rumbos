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
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

const DISPLAY_DATE = new RegExp(`^(\\d{1,2}) de (${MONTHS.join("|")})$`, "i");

const BANNED: readonly RegExp[] = [
  /desde córdoba/i,
  /atenci[oó]n humana/i,
  /v[ií]a bariloche/i,
  /v[ií]a tac/i,
];

const CONSULT_CLAUSE = "Consultá salidas y precio.";
const WHATSAPP_PRICED = "Consultanos por WhatsApp.";
const WHATSAPP_UNPRICED = "Consultá el precio por WhatsApp.";
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
  middle: string;
  whatsapp: string;
};

type Hub = {
  country?: string;
  beaches: readonly string[];
  nextName: string;
  quote: Quote;
  middle: string;
};

type PricedRow = {
  index: number;
  name: string;
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
  const quote = toQuote(view);
  const middle = fichaMiddle(intentFacts(dest, view, today));
  return finishFicha({
    name: dest.name,
    quote,
    middle,
    whatsapp: quote.kind === "priced" ? WHATSAPP_PRICED : WHATSAPP_UNPRICED,
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
  const nextName = winner ? hubPlaceLabel(winner.name) : "";
  return finishHub({
    ...(country ? { country } : {}),
    beaches: beachList(pool, winner?.index ?? null),
    nextName,
    quote: winner ? winner.quote : { kind: "none" },
    middle:
      winner && winnerDest
        ? hubMiddle(intentFacts(winnerDest, winner.view, today))
        : "",
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

function evidencedNouns(facts: IntentFacts): string[] {
  const airWord = facts.inclusionTexts.some((text) => AIR_WORD.test(text));
  const hotel = facts.inclusionTexts.some((text) => HOTEL_WORD.test(text));
  const transfer = facts.inclusionTexts.some((text) => TRANSFER_WORD.test(text));
  const nouns: string[] = [];
  if (airWord || facts.airTransport) nouns.push("aéreo");
  if (hotel) nouns.push("hotel");
  if (transfer) nouns.push("traslados");
  return nouns;
}

function formatNounList(nouns: readonly string[]): string {
  if (nouns.length === 0) return "";
  const titled = nouns.map((noun, index) =>
    index === 0 ? noun.charAt(0).toUpperCase() + noun.slice(1) : noun,
  );
  if (titled.length === 1) return titled[0] ?? "";
  if (titled.length === 2) return `${titled[0]} y ${titled[1]}`;
  return `${titled.slice(0, -1).join(", ")} y ${titled[titled.length - 1]}`;
}

function fichaMiddle(facts: IntentFacts): string {
  if (facts.nights && facts.texts.some((text) => ALL_INCLUSIVE.test(text))) {
    return `${facts.nights} noches All Inclusive.`;
  }
  const nouns = evidencedNouns(facts);
  if (nouns.length > 0) return `${formatNounList(nouns)} incluidos.`;
  if (facts.nights && facts.airTransport) return `${facts.nights} noches con aéreo.`;
  if (facts.nights) return `${facts.nights} noches.`;
  return "";
}

function hubMiddle(facts: IntentFacts): string {
  if (facts.nights && facts.texts.some((text) => ALL_INCLUSIVE.test(text))) {
    return `${facts.nights} noches All Inclusive.`;
  }
  const nouns = evidencedNouns(facts);
  if (nouns.length > 0) return `${formatNounList(nouns)}.`;
  if (facts.nights && facts.airTransport) return `${facts.nights} noches con aéreo.`;
  if (facts.nights) return `${facts.nights} noches.`;
  return "";
}

function normalizeWords(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function subjectName(name: string): string {
  const trimmed = normalizeWords(name);
  return trimmed.length > 0 ? trimmed : "Este destino";
}

function hubPlaceLabel(name: string): string {
  const trimmed = normalizeWords(name);
  if (/^r[ií]o de janeiro$/i.test(trimmed)) return "Río";
  if (/^salvador de bah[ií]a$/i.test(trimmed)) return "Salvador";
  return trimmed;
}

function joinList(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

/** Up to four non-event members in cluster order; always includes the quoted destination. */
function beachList(
  members: readonly OfferDescriptionInput[],
  winnerIndex: number | null,
): string[] {
  if (members.length === 0) return [];
  const limit = Math.min(4, members.length);
  const indices: number[] = [];
  for (let index = 0; index < members.length && indices.length < limit; index++) {
    indices.push(index);
  }
  if (
    winnerIndex != null &&
    winnerIndex >= 0 &&
    winnerIndex < members.length &&
    !indices.includes(winnerIndex)
  ) {
    indices[indices.length - 1] = winnerIndex;
    indices.sort((a, b) => a - b);
  }
  return indices
    .map((index) => members[index])
    .filter((member): member is OfferDescriptionInput => Boolean(member))
    .map((member) => hubPlaceLabel(member.name))
    .filter((label) => label.length > 0);
}

function shortenBeaches(
  beaches: readonly string[],
  nextName: string,
): readonly (readonly string[])[] {
  const variants: string[][] = [];
  for (let size = beaches.length; size >= 1; size--) {
    let slice = beaches.slice(0, size);
    if (nextName && !slice.includes(nextName)) {
      slice = [...slice.slice(0, Math.max(0, size - 1)), nextName];
    }
    variants.push(slice);
  }
  if (nextName) variants.push([nextName]);
  variants.push([]);
  return variants;
}

function labelFor(dateIso: string, displayDate: string): string | undefined {
  const shown = displayDate.trim();
  const matched = DISPLAY_DATE.exec(shown);
  if (matched) {
    const day = matched[1];
    const month = matched[2]?.toLowerCase();
    if (day && month) return `${Number(day)} de ${month}`;
  }
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
  const parts: string[] = [];
  switch (sentence.quote.kind) {
    case "priced": {
      const money = formatShownMoney(sentence.quote.money.currency, sentence.quote.money.amount);
      parts.push(
        `${sentence.name}: salida ${sentence.quote.dateLabel}, ${sentence.quote.money.quotedAs} ${money} por persona.`,
      );
      break;
    }
    case "unpriced":
      parts.push(`${sentence.name}: salida ${sentence.quote.dateLabel}.`);
      break;
    case "none":
      parts.push(`${sentence.name}.`);
      break;
  }
  if (sentence.middle) parts.push(sentence.middle);
  if (sentence.whatsapp) parts.push(sentence.whatsapp);
  return parts.join(" ");
}

function fichaTexts(sentence: Ficha): string[] {
  const texts: string[] = [renderFicha(sentence)];
  if (sentence.whatsapp) {
    texts.push(renderFicha({ ...sentence, whatsapp: "" }));
  }
  if (sentence.middle) {
    texts.push(renderFicha({ ...sentence, middle: "", whatsapp: "" }));
  }
  if (sentence.quote.kind === "priced") {
    texts.push(
      renderFicha({
        name: sentence.name,
        quote: {
          kind: "unpriced",
          dateIso: sentence.quote.dateIso,
          dateLabel: sentence.quote.dateLabel,
        },
        middle: sentence.middle,
        whatsapp: "",
      }),
    );
  }
  if (sentence.quote.kind !== "none") {
    texts.push(
      renderFicha({
        name: sentence.name,
        quote: { kind: "none" },
        middle: "",
        whatsapp: "",
      }),
    );
  }
  return texts;
}

function fallbackFicha(name: string): Ficha {
  return {
    name: isBanned(name) ? "Este destino" : subjectName(name),
    quote: { kind: "none" },
    middle: "",
    whatsapp: "",
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
    sentence.beaches.length > 0 ? `${heading}: ${joinList(sentence.beaches)}` : heading;
  const parts: string[] = [];
  switch (sentence.quote.kind) {
    case "priced": {
      const money = formatShownMoney(sentence.quote.money.currency, sentence.quote.money.amount);
      const dest = sentence.nextName || "destino";
      parts.push(
        `${place}. Próxima salida: ${dest}, ${sentence.quote.dateLabel}, ${sentence.quote.money.quotedAs} ${money}.`,
      );
      break;
    }
    case "unpriced": {
      const dest = sentence.nextName || "destino";
      parts.push(`${place}. Próxima salida: ${dest}, ${sentence.quote.dateLabel}.`);
      break;
    }
    case "none":
      parts.push(`${place}. ${CONSULT_CLAUSE}`);
      break;
  }
  if (sentence.quote.kind !== "none" && sentence.middle) parts.push(sentence.middle);
  return parts.join(" ");
}

function hubTexts(sentence: Hub): string[] {
  const texts: string[] = [];
  for (const beaches of shortenBeaches(sentence.beaches, sentence.nextName)) {
    const withMiddle: Hub = { ...sentence, beaches };
    texts.push(renderHub(withMiddle));
    if (sentence.middle) {
      texts.push(renderHub({ ...withMiddle, middle: "" }));
    }
  }
  texts.push(
    renderHub({
      country: sentence.country,
      beaches: [],
      nextName: "",
      quote: { kind: "none" },
      middle: "",
    }),
  );
  return texts;
}

function finishHub(sentence: Hub): string {
  if (isBanned(renderHub(sentence))) {
    return fitTexts(
      hubTexts({
        country: undefined,
        beaches: [],
        nextName: "",
        quote: { kind: "none" },
        middle: "",
      }),
    );
  }
  const fitted = fitTexts(hubTexts(sentence));
  if (isBanned(fitted)) {
    return fitTexts(
      hubTexts({
        country: undefined,
        beaches: [],
        nextName: "",
        quote: { kind: "none" },
        middle: "",
      }),
    );
  }
  return fitted;
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
    rows.push({ index, name: dest.name, quote, view });
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
