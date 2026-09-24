import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildQuoteWhatsAppMessage } from "./quote-message";

describe("buildQuoteWhatsAppMessage", () => {
  it("starts with the web cotizador prefix and includes the form details", () => {
    const text = buildQuoteWhatsAppMessage({
      destino: "Bariloche",
      fecha: "Octubre 2026",
      duracion: "5-7 días",
      adultos: 2,
      menores: 1,
      aerolinea: "LATAM Airlines",
    });

    assert.match(text, /^Hola, armé mi viaje en el cotizador de la web:/);
    assert.match(text, /\*Destino:\* Bariloche/);
    assert.match(text, /\*Fecha estimada:\* Octubre 2026/);
    assert.match(text, /\*Duración estimada:\* 5-7 días/);
    assert.match(text, /\*Pasajeros:\* 2 adultos y 1 menor/);
    assert.match(text, /\*Aerolínea:\* LATAM Airlines/);
    assert.doesNotMatch(text, /Asistente de Cotización/);
  });

  it("singularizes passenger labels", () => {
    const text = buildQuoteWhatsAppMessage({
      destino: "Salta",
      fecha: "Próximos 3 meses",
      duracion: "A definir",
      adultos: 1,
      menores: 0,
      aerolinea: "Sin preferencia",
    });

    assert.match(text, /\*Pasajeros:\* 1 adulto$/m);
  });
});
