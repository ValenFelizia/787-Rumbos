/**
 * Prefill messages for destination WhatsApp CTAs.
 * Pure text helpers — pair with `whatsappLink` / `AGENCY_PHONE` for the URL.
 *
 * Growth-approved copy identifies the source surface so the shop can count
 * chats manually. `source` is reserved for QOL-07 (cotizador); only `"detail"`
 * is wired in UI today.
 */
import { AGENCY_PHONE, whatsappLink } from "@/lib/constants";

export type WhatsAppInquirySource = "detail" | "cotizador";

export type DestinationInquiryMessageOptions = {
  destinationName: string;
  /** Display date of the next active departure, when one exists. */
  departureDisplayDate?: string | null;
  /** Hotel name from "Video del hotel", when filled in the CMS. */
  hotelName?: string | null;
  /** Surface that opens WhatsApp. Only `"detail"` is wired in UI today. */
  source?: WhatsAppInquirySource;
};

/**
 * Builds the prefilled WhatsApp body for a destination inquiry.
 * With a hotel name → mentions hotel + destination; with a next active
 * departure → includes that date; otherwise a generic fechas ask.
 */
export function buildDestinationInquiryMessage({
  destinationName,
  departureDisplayDate,
  hotelName,
  source = "detail",
}: DestinationInquiryMessageOptions): string {
  const name = destinationName.trim();
  const date = departureDisplayDate?.trim() || null;
  const hotel = hotelName?.trim() || null;

  // QOL-07 will branch on `source` for cotizador-specific copy.
  void source;

  if (hotel) {
    if (date) {
      return `Hola! Vi en la web el hotel ${hotel} en ${name} y quiero consultar por la salida del ${date}.`;
    }
    return `Hola! Vi en la web el hotel ${hotel} en ${name} y quiero consultar fechas.`;
  }

  if (date) {
    return `Hola, vi ${name} en la web y quiero consultar por la salida del ${date}`;
  }
  return `Hola, vi ${name} en la web y quiero consultar fechas`;
}

/** api.whatsapp.com link using the agency number and inquiry prefill. */
export function destinationInquiryWhatsAppLink(
  options: DestinationInquiryMessageOptions,
): string {
  return whatsappLink(
    AGENCY_PHONE.whatsapp,
    buildDestinationInquiryMessage(options),
  );
}
