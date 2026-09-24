import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapFeaturedPromo, type FeaturedPromoDoc } from "./promo";
import type { FeaturedPromo } from "./types";

const today = new Date(2026, 8, 23);

const published: FeaturedPromo = {
  slug: "f1-grand-premio-sao-paulo",
  endsAt: "2026-11-05",
  topBarText: "barra",
  badgeText: "etiqueta",
  charterText: "charter",
  title: "Grand Premio",
  description: "Descripción",
  price: "USD 2.770",
  priceNote: "por persona en base doble",
  taxNote: "+ USD 260 de gastos e impuestos",
  imageSrc: "/destinos/gp-sao-paulo.png",
  whatsappMsg: "Hola",
  inclusions: [{ label: "Aéreo", icon: "plane" }],
};

function doc(overrides: Partial<FeaturedPromoDoc> = {}): FeaturedPromoDoc {
  return {
    enabled: true,
    destination: { slug: published.slug },
    endsAt: published.endsAt,
    topBarText: published.topBarText,
    badgeText: published.badgeText,
    charterText: published.charterText,
    title: published.title,
    description: published.description,
    price: published.price,
    priceNote: published.priceNote,
    taxNote: published.taxNote,
    image: { legacyPath: published.imageSrc },
    whatsappMsg: published.whatsappMsg,
    inclusions: published.inclusions,
    ...overrides,
  };
}

describe("mapFeaturedPromo", () => {
  it("arma la forma pública de la promo", () => {
    assert.deepEqual(mapFeaturedPromo(doc(), today), published);
  });

  it("sin vigencia el precio sigue visible", () => {
    const promo = mapFeaturedPromo(doc({ priceValidUntil: null }), today);
    assert.equal(promo?.price, "USD 2.770");
    assert.equal(promo?.priceNote, published.priceNote);
    assert.equal(promo?.taxNote, published.taxNote);
  });

  it("con vigencia vencida oculta monto y notas", () => {
    const promo = mapFeaturedPromo(doc({ priceValidUntil: "2026-09-22" }), today);
    assert.equal(promo?.price, "Consultá precio actualizado");
    assert.equal(promo?.priceNote, "");
    assert.equal(promo?.taxNote, "");
  });

  it("el día de la vigencia sigue mostrando el precio", () => {
    const promo = mapFeaturedPromo(doc({ priceValidUntil: "2026-09-23T00:00:00.000Z" }), today);
    assert.equal(promo?.price, "USD 2.770");
  });

  it("deshabilitada o sin slug no se publica", () => {
    assert.equal(mapFeaturedPromo(doc({ enabled: false }), today), null);
    assert.equal(mapFeaturedPromo(doc({ destination: 4 }), today), null);
  });
});
