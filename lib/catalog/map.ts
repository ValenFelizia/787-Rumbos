/**
 * Documento de Payload → DestinationPage.
 * Las partes `whatsapp` vuelven a ser links con la URL que arma
 * `whatsappDestinoFaq` en el momento del render, igual que el catálogo estático.
 * `legacyPath` conserva `/destinos/...` para que `/_next/image?url=` no cambie.
 */
import type { FaqAnswerSegment } from "../constants";
import { whatsappDestinoFaq } from "./logic";
import type { Departure, DestinationPage, TransportType } from "./types";

type MediaLike = {
  legacyPath?: string | null;
  url?: string | null;
} | null;

type TextRow = { text?: string | null };

type AnswerPart = {
  blockType?: string | null;
  value?: string | null;
  label?: string | null;
  href?: string | null;
  external?: boolean | null;
};

type FaqRow = {
  faqId?: string | null;
  question?: string | null;
  answer?: AnswerPart[] | null;
};

type DepartureRow = {
  date?: string | null;
  displayDate?: string | null;
  priceFrom?: number | string | null;
  currency?: "ARS" | "USD" | null;
  status?: Departure["status"] | null;
  transport?: TransportType | null;
  nights?: number | string | null;
  note?: string | null;
  program?: string | null;
  stayLabel?: string | null;
  priceIsFinal?: boolean | null;
};

export type DestinationDoc = {
  slug?: string | null;
  name?: string | null;
  country?: string | null;
  region?: DestinationPage["region"] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  h1?: string | null;
  heroImage?: MediaLike | string | number;
  flyerImage?: MediaLike | string | number;
  description?: string | null;
  highlights?: TextRow[] | null;
  typicalInclusions?: TextRow[] | null;
  optionalExcursions?: TextRow[] | null;
  travelTip?: string | null;
  priceFrom?: number | string | null;
  currency?: "ARS" | "USD" | null;
  priceNote?: string | null;
  departures?: DepartureRow[] | null;
  faq?: FaqRow[] | null;
};

function text(value: string | null | undefined): string | undefined {
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : value;
}

function asNumber(value: number | string | null | undefined): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function texts(rows: TextRow[] | null | undefined): string[] {
  return (rows ?? []).map((row) => row.text ?? "").filter((value) => value !== "");
}

function mediaUrl(media: DestinationDoc["heroImage"]): string | undefined {
  if (!media || typeof media === "string" || typeof media === "number") return undefined;
  if (media.legacyPath) return media.legacyPath;
  if (media.url) return media.url;
  return undefined;
}

function mapAnswer(part: AnswerPart, destino: string): FaqAnswerSegment | undefined {
  if (part.blockType === "text") {
    return { type: "text", value: part.value ?? "" };
  }
  if (part.blockType === "whatsapp") {
    return {
      type: "link",
      label: part.label ?? "WhatsApp",
      href: whatsappDestinoFaq(destino),
      external: true,
    };
  }
  if (part.blockType === "link") {
    const segment: FaqAnswerSegment = {
      type: "link",
      label: part.label ?? "",
      href: part.href ?? "",
    };
    if (part.external) segment.external = true;
    return segment;
  }
  return undefined;
}

function mapDeparture(row: DepartureRow): Departure {
  const departure: Departure = {
    date: row.date ?? "",
    displayDate: row.displayDate ?? "",
    status: row.status ?? "inquire",
    transport: row.transport ?? "mix",
    nights: asNumber(row.nights) ?? 0,
  };
  const priceFrom = asNumber(row.priceFrom);
  if (priceFrom != null) departure.priceFrom = priceFrom;
  if (row.currency) departure.currency = row.currency;
  const note = text(row.note);
  if (note) departure.note = note;
  const program = text(row.program);
  if (program) departure.program = program;
  const stayLabel = text(row.stayLabel);
  if (stayLabel) departure.stayLabel = stayLabel;
  if (row.priceIsFinal) departure.priceIsFinal = true;
  return departure;
}

export function mapDestination(doc: DestinationDoc): DestinationPage {
  const name = doc.name ?? "";
  const heroImage = mediaUrl(doc.heroImage);
  if (!heroImage) {
    throw new Error(`El destino ${doc.slug ?? name} no tiene heroImage resoluble`);
  }

  const destination: DestinationPage = {
    slug: doc.slug ?? "",
    name,
    country: doc.country ?? "",
    region: doc.region === "internacional" ? "internacional" : "nacional",
    metaTitle: doc.metaTitle ?? "",
    metaDescription: doc.metaDescription ?? "",
    heroImage,
    description: doc.description ?? "",
    highlights: texts(doc.highlights),
    typicalInclusions: texts(doc.typicalInclusions),
    currency: doc.currency === "USD" ? "USD" : "ARS",
    departures: (doc.departures ?? []).map(mapDeparture),
  };

  const h1 = text(doc.h1);
  if (h1) destination.h1 = h1;
  const flyerImage = mediaUrl(doc.flyerImage);
  if (flyerImage) destination.flyerImage = flyerImage;
  const excursions = texts(doc.optionalExcursions);
  if (excursions.length > 0) destination.optionalExcursions = excursions;
  const travelTip = text(doc.travelTip);
  if (travelTip) destination.travelTip = travelTip;
  const priceFrom = asNumber(doc.priceFrom);
  if (priceFrom != null) destination.priceFrom = priceFrom;
  const priceNote = text(doc.priceNote);
  if (priceNote) destination.priceNote = priceNote;

  const faq = (doc.faq ?? [])
    .filter((item) => item.question && item.faqId)
    .map((item) => ({
      id: item.faqId as string,
      question: item.question as string,
      answer: (item.answer ?? [])
        .map((part) => mapAnswer(part, name))
        .filter((part): part is FaqAnswerSegment => Boolean(part)),
    }));
  if (faq.length > 0) destination.faq = faq;

  return destination;
}
