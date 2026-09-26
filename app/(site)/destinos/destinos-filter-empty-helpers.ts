import { AGENCY_PHONE, whatsappLink } from "@/lib/constants";

/** Texto del live region de conteo (QOL-10). */
export function formatDestinosResultCount(count: number): string {
  return count === 1 ? "1 destino" : `${count} destinos`;
}

export function filterEmptyWhatsAppHref(opts: {
  monthLabel?: string | null;
}): string {
  if (opts.monthLabel) {
    return whatsappLink(
      AGENCY_PHONE.whatsapp,
      `Hola 787 Rumbos! Estuve mirando salidas de ${opts.monthLabel} en la web y no encontré lo que buscaba. ¿Me ayudan a armar algo para ese mes? (Web - Destinos filtro vacío)`,
    );
  }
  return whatsappLink(
    AGENCY_PHONE.whatsapp,
    "Hola 787 Rumbos! Estuve filtrando destinos en la web y no encontré lo que buscaba. ¿Me ayudan a armar un viaje a medida? (Web - Destinos filtro vacío)",
  );
}
