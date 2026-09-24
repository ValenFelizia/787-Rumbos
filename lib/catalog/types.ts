/**
 * Tipos públicos del catálogo. Idénticos al modelo que el sitio renderizaba
 * desde el array estático: el mapper de Payload tiene que producir esta forma.
 */
import type { FaqItem } from "../constants";

export type TransportType = "aereo" | "bus" | "bus-cama" | "mix";

export type PromoIcon = "plane" | "calendar" | "ticket" | "map-pin";

/** Forma que renderiza SpecialPromo. Igual al objeto que antes vivía en el componente. */
export interface FeaturedPromo {
  slug: string;
  endsAt: string;
  topBarText: string;
  badgeText: string;
  charterText: string;
  title: string;
  description: string;
  price: string;
  priceNote: string;
  taxNote: string;
  imageSrc: string;
  whatsappMsg: string;
  inclusions: { label: string; icon: PromoIcon }[];
}

export interface Departure {
  date: string; // Formato ISO "YYYY-MM-DD"
  displayDate: string; // Ej: "8 de Julio"
  priceFrom?: number; // Opcional, si difiere del precio base del destino
  currency?: "ARS" | "USD";
  status: "confirmed" | "few-seats" | "sold-out" | "inquire";
  transport: TransportType;
  nights: number;
  note?: string;
  /** Nombre corto del programa, visible en la tarjeta de la salida. */
  program?: string;
  /** Si está, reemplaza el texto de noches (p. ej. un solo aéreo). */
  stayLabel?: string;
  /** El monto de esta salida es cerrado, no una tarifa “desde”. */
  priceIsFinal?: boolean;
  /** Vigencia propia de esta salida, YYYY-MM-DD. Si no está, usa la del destino. */
  priceValidUntil?: string;
}

export interface DestinationPage {
  slug: string;
  name: string;
  country: string;
  region: "nacional" | "internacional";
  metaTitle: string;
  metaDescription: string;
  /** Override del H1 del hero; por defecto `Paquetes a {name}`. */
  h1?: string;
  heroImage: string;
  flyerImage?: string;
  description: string;
  highlights: string[];
  typicalInclusions: string[];
  optionalExcursions?: string[];
  travelTip?: string;
  priceFrom?: number; // Precio base orientativo
  currency: "ARS" | "USD";
  priceNote?: string; // "por persona en base doble"
  /** Vigencia del precio base, YYYY-MM-DD. Vacío = el monto sigue visible. */
  priceValidUntil?: string;
  departures: Departure[];
  /** FAQ específicas del destino. Opcional: solo destinos prioritarios. */
  faq?: FaqItem[];
}
