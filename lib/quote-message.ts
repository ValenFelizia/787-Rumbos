/**
 * Mensaje de WhatsApp que arma el cotizador web (cierre cliente → WA).
 * El prefijo identifica la superficie para conteo manual de chats (growth).
 */

export type QuoteMessageInput = {
  destino: string;
  fecha: string;
  duracion: string;
  adultos: number;
  menores: number;
  aerolinea: string;
};

export function buildQuoteWhatsAppMessage({
  destino,
  fecha,
  duracion,
  adultos,
  menores,
  aerolinea,
}: QuoteMessageInput): string {
  const passengerText = `${adultos} ${adultos === 1 ? "adulto" : "adultos"}${
    menores > 0 ? ` y ${menores} ${menores === 1 ? "menor" : "menores"}` : ""
  }`;

  return [
    "Hola, armé mi viaje en el cotizador de la web:",
    "",
    `📍 *Destino:* ${destino}`,
    `📅 *Fecha estimada:* ${fecha}`,
    `🗓️ *Duración estimada:* ${duracion}`,
    `👥 *Pasajeros:* ${passengerText}`,
    `✈️ *Aerolínea:* ${aerolinea}`,
  ].join("\n");
}
