export type ReviewDoc = {
  id: number | string;
  name?: string | null;
  slug?: string | null;
  priceFrom?: number | string | null;
  priceValidUntil?: string | null;
  lastReviewedAt?: string | null;
  departures?:
    | {
        date?: string | null;
        status?: string | null;
        priceFrom?: number | string | null;
        priceValidUntil?: string | null;
      }[]
    | null;
};

export type ReviewLink = {
  id: number | string;
  name: string;
  detail: string;
};

export type ReviewLists = {
  expiring: ReviewLink[];
  missingValidity: ReviewLink[];
  noDepartures: ReviewLink[];
  staleReview: ReviewLink[];
};

function dayPrefix(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match?.[1] ?? null;
}

export function isoToday(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return isoToday(date);
}

function hasAmount(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string" && value.trim() !== "") return Number.isFinite(Number(value));
  return false;
}

function link(doc: ReviewDoc, detail: string): ReviewLink {
  return {
    id: doc.id,
    name: doc.name?.trim() || doc.slug || String(doc.id),
    detail,
  };
}

export function classifyForReview(docs: ReviewDoc[], today = isoToday()): ReviewLists {
  const horizon = addDays(today, 7);
  const staleBefore = addDays(today, -30);
  const lists: ReviewLists = {
    expiring: [],
    missingValidity: [],
    noDepartures: [],
    staleReview: [],
  };

  for (const doc of docs) {
    const departures = doc.departures ?? [];
    const validityDates = [
      dayPrefix(doc.priceValidUntil),
      ...departures.map((row) => dayPrefix(row.priceValidUntil)),
    ].filter((day): day is string => Boolean(day));
    const soon = validityDates.filter((day) => day <= horizon);
    if (soon.length > 0) {
      const earliest = soon.slice().sort()[0];
      const detail = earliest < today ? `Venció el ${earliest}` : `Vence el ${earliest}`;
      lists.expiring.push(link(doc, detail));
    }

    const showsPrice = hasAmount(doc.priceFrom) || departures.some((row) => hasAmount(row.priceFrom));
    if (!dayPrefix(doc.priceValidUntil) && showsPrice) {
      lists.missingValidity.push(link(doc, "Sin vigencia de precio cargada"));
    }

    const activeUpcoming = departures.some((row) => {
      const date = dayPrefix(row.date);
      return date != null && date >= today && row.status !== "sold-out";
    });
    if (!activeUpcoming) {
      lists.noDepartures.push(link(doc, "No tiene salidas vigentes"));
    }

    const reviewed = dayPrefix(doc.lastReviewedAt);
    if (!reviewed || reviewed <= staleBefore) {
      lists.staleReview.push(
        link(doc, reviewed ? `Última revisión ${reviewed}` : "Nunca se revisó"),
      );
    }
  }

  return lists;
}
