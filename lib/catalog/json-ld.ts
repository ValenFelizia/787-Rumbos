/**
 * JSON-LD de ficha de destino. El Offer usa la misma oferta publicada que la UI
 * (`getListedOffer` / `getDeparturePublishedPrice`).
 */
import { AGENCY_PHONE } from "../constants";
import { siteUrl } from "../site-url";
import {
  getActiveUpcomingDepartures,
  getListedOffer,
  getTodayLocal,
} from "./logic";
import type { DestinationPage } from "./types";

export type TouristTripJsonLd = {
  "@context": "https://schema.org";
  "@type": "TouristTrip";
  name: string;
  description: string;
  touristType: "Leisure";
  provider: {
    "@type": "TravelAgency";
    name: string;
    telephone: string;
    url: string;
  };
  offers?: {
    "@type": "Offer";
    price: string;
    priceCurrency: "ARS" | "USD";
    availability: string;
    priceValidUntil?: string;
  };
};

/**
 * TouristTrip + Offer alineado al precio publicado vigente.
 * Sin oferta válida (sin monto o vigencia vencida) → sin `offers`.
 */
export function buildDestinationTouristTripJsonLd(
  dest: DestinationPage,
  today = getTodayLocal(),
): TouristTripJsonLd {
  const offer = getListedOffer(dest, today);
  const activeUpcoming = getActiveUpcomingDepartures(dest, today);

  const jsonLd: TouristTripJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `Paquete a ${dest.name}`,
    description: dest.description,
    touristType: "Leisure",
    provider: {
      "@type": "TravelAgency",
      name: "787 Rumbos",
      telephone: AGENCY_PHONE.tel,
      url: siteUrl("/"),
    },
  };

  if (!offer) return jsonLd;

  jsonLd.offers = {
    "@type": "Offer",
    price: offer.amount.toString(),
    priceCurrency: offer.currency,
    availability:
      activeUpcoming.length > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/InquiryLimit",
    ...(offer.priceValidUntil ? { priceValidUntil: offer.priceValidUntil } : {}),
  };

  return jsonLd;
}
