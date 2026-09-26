import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterEmptyWhatsAppHref,
  formatDestinosResultCount,
} from "../../app/(site)/destinos/destinos-filter-empty-helpers";

describe("formatDestinosResultCount (QOL-10)", () => {
  it("formats singular and plural in Spanish", () => {
    assert.equal(formatDestinosResultCount(0), "0 destinos");
    assert.equal(formatDestinosResultCount(1), "1 destino");
    assert.equal(formatDestinosResultCount(12), "12 destinos");
  });
});

describe("filterEmptyWhatsAppHref (QOL-10)", () => {
  it("builds a WhatsApp link for month and generic empty states", () => {
    const withMonth = filterEmptyWhatsAppHref({ monthLabel: "oct. 2026" });
    assert.match(withMonth, /^https:\/\/api\.whatsapp\.com\/send\?phone=/);
    assert.match(decodeURIComponent(withMonth), /oct\. 2026/);
    assert.match(decodeURIComponent(withMonth), /filtro vacío/i);

    const generic = filterEmptyWhatsAppHref({ monthLabel: null });
    assert.match(generic, /^https:\/\/api\.whatsapp\.com\/send\?phone=/);
    assert.match(decodeURIComponent(generic), /filtrando destinos/i);
  });
});
