import type { DestinationListing } from "@/lib/catalog/listing";
import {
  formatShownMoney,
  getTodayLocal,
  readHomeDeparture,
  type CardOrigin,
  type HomeDepartureView,
} from "@/lib/catalog/logic";

export const META_DESCRIPTION_MAX = 155;

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

type ShownMoney = {
  currency: "ARS" | "USD";
  amount: number;
  quotedAs: "desde" | "final";
};

/** Priced quotes always carry a date label. A price with no date is not representable. */
type Quote =
  | { kind: "priced"; date: string; dateLabel: string; money: ShownMoney }
  | { kind: "unpriced"; date: string; dateLabel: string }
  | { kind: "none" };

type Draft = {
  country?: string;
  name: string;
  quote: Quote;
  city: "";
};

type DatedRow = {
  index: number;
  name: string;
  origin: CardOrigin;
  quote: Exclude<Quote, { kind: "none" }>;
};

export function describeDestinationListing(
  dest: DestinationListing,
  today = getTodayLocal(),
): string {
  const view = readHomeDeparture(dest, today);
  return finish({
    name: dest.name,
    quote: toQuote(view),
    city: originClause(view?.origin ?? "omit"),
  });
}

/** `members` order is the same-day tie-break. Pass `getClusterDestinations` output. */
export function describeClusterListings(
  members: readonly DestinationListing[],
  today = getTodayLocal(),
): string {
  const country = sharedCountry(members);
  const winner = pickWinner(datedRows(members, today));
  if (!winner) {
    return finish({
      name: country ? `Paquetes a ${country}` : "Paquetes",
      quote: { kind: "none" },
      city: originClause("omit"),
    });
  }
  return finish({
    country,
    name: winner.name,
    quote: winner.quote,
    city: originClause(winner.origin),
  });
}

/** No CardOrigin can say Córdoba alone, so the description prints no city. */
function originClause(origin: CardOrigin): "" {
  switch (origin) {
    case "cordoba-or-ezeiza":
    case "bus":
    case "omit":
      return "";
  }
}

function normalizeWords(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function subjectName(name: string): string {
  const trimmed = normalizeWords(name);
  return trimmed.length > 0 ? trimmed : "Este destino";
}

function labelFor(date: string, displayDate: string): string | undefined {
  const shown = displayDate.trim();
  if (DISPLAY_DATE.test(shown)) return shown;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return undefined;
  const month = Number(match[2]);
  const day = Number(match[3]);
  const monthName = MONTHS[month - 1];
  if (!monthName || day < 1 || day > 31) return undefined;
  return `${day} de ${monthName}`;
}

function toQuote(view: HomeDepartureView | null): Quote {
  if (!view) return { kind: "none" };
  const dateLabel = labelFor(view.date, view.displayDate);
  if (!dateLabel) return { kind: "none" };
  if (view.price.kind === "amount" && Number.isFinite(view.price.amount)) {
    return {
      kind: "priced",
      date: view.date,
      dateLabel,
      money: {
        currency: view.price.currency,
        amount: view.price.amount,
        quotedAs: view.price.quotedAs,
      },
    };
  }
  return { kind: "unpriced", date: view.date, dateLabel };
}

function isBanned(text: string): boolean {
  return BANNED.some((pattern) => pattern.test(text));
}

function render(draft: Draft): string {
  const subject = draft.country ? `${draft.country}: ${draft.name}` : draft.name;
  const city = draft.city;
  switch (draft.quote.kind) {
    case "priced": {
      const money = formatShownMoney(draft.quote.money.currency, draft.quote.money.amount);
      return `${subject}, salida ${draft.quote.dateLabel}, ${draft.quote.money.quotedAs} ${money}.${city}`;
    }
    case "unpriced":
      return `${subject}, salida ${draft.quote.dateLabel}. Consultá precio.${city}`;
    case "none":
      return `${subject}. Consultá salidas y precio.${city}`;
  }
}

function dropCountry(draft: Draft): Draft {
  return { name: draft.name, quote: draft.quote, city: draft.city };
}

function candidateSentences(draft: Draft): string[] {
  const texts = [render(draft)];
  const bare = dropCountry(draft);
  if (draft.country) texts.push(render(bare));
  if (draft.quote.kind === "priced") {
    texts.push(
      render({
        ...bare,
        quote: {
          kind: "unpriced",
          date: draft.quote.date,
          dateLabel: draft.quote.dateLabel,
        },
      }),
    );
  }
  if (draft.quote.kind !== "none") {
    texts.push(render({ ...bare, quote: { kind: "none" } }));
  }
  return texts;
}

/**
 * A single token longer than the cap is left out whole.
 * The consult clause stands in when nothing before that token fits.
 */
function truncate(text: string): string {
  if (text.length <= META_DESCRIPTION_MAX) return text;
  const limit = cutBeforeOversizedToken(text, META_DESCRIPTION_MAX);
  const boundary = lastWordEnd(text, limit);
  if (boundary <= 0) return CONSULT_CLAUSE;
  const prefix = text.slice(0, boundary).replace(/[\s,;:]+$/u, "");
  return prefix.length > 0 ? prefix : CONSULT_CLAUSE;
}

function cutBeforeOversizedToken(text: string, limit: number): number {
  const tokens = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = tokens.exec(text)) !== null) {
    if (match[0].length > META_DESCRIPTION_MAX && match.index < limit) {
      return match.index;
    }
  }
  return limit;
}

function lastWordEnd(text: string, limit: number): number {
  const head = text.slice(0, Math.max(0, limit));
  let boundary = -1;
  for (let index = 0; index < head.length; index++) {
    if (/\s/.test(head[index] ?? "")) boundary = index;
  }
  return boundary;
}

function fit(draft: Draft): string {
  for (const text of candidateSentences(draft)) {
    if (text.length <= META_DESCRIPTION_MAX) return text;
  }
  return truncate(
    render({ name: draft.name, quote: { kind: "none" }, city: draft.city }),
  );
}

function consultFallback(name: string): Draft {
  return {
    name: isBanned(name) ? "Este destino" : name,
    quote: { kind: "none" },
    city: originClause("omit"),
  };
}

function finish(draft: Draft): string {
  const ready: Draft = {
    name: subjectName(draft.name),
    quote: draft.quote,
    city: draft.city,
    ...(draft.country && normalizeWords(draft.country)
      ? { country: normalizeWords(draft.country) }
      : {}),
  };
  if (isBanned(render(ready))) return fit(consultFallback(ready.name));
  const fitted = fit(ready);
  if (isBanned(fitted)) return fit(consultFallback(ready.name));
  return fitted;
}

function sharedCountry(members: readonly DestinationListing[]): string | undefined {
  const first = members[0] ? normalizeWords(members[0].country) : "";
  if (!first) return undefined;
  return members.every((member) => normalizeWords(member.country) === first) ? first : undefined;
}

function datedRows(members: readonly DestinationListing[], today: Date): DatedRow[] {
  const rows: DatedRow[] = [];
  for (let index = 0; index < members.length; index++) {
    const dest = members[index];
    if (!dest) continue;
    const view = readHomeDeparture(dest, today);
    const quote = toQuote(view);
    if (!view || quote.kind === "none") continue;
    rows.push({ index, name: dest.name, origin: view.origin, quote });
  }
  return rows;
}

/**
 * Earliest ISO date, then earlier input index.
 * Amounts are not compared. ARS and USD are not one scale.
 */
function pickWinner(rows: readonly DatedRow[]): DatedRow | undefined {
  const priced = rows.filter((row) => row.quote.kind === "priced");
  const pool = priced.length > 0 ? priced : rows;
  return [...pool].sort((a, b) => {
    if (a.quote.date < b.quote.date) return -1;
    if (a.quote.date > b.quote.date) return 1;
    return a.index - b.index;
  })[0];
}
