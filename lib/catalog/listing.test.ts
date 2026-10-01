import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toDestinationListing } from "./listing";
import type { DestinationPage } from "./types";

function fullDestination(): DestinationPage {
  return {
    slug: "cancun",
    name: "Cancún",
    country: "México",
    region: "internacional",
    metaTitle: "Cancún meta title that should not serialize to listing",
    metaDescription: "Meta description for SEO only",
    h1: "Paquetes a Cancún",
    heroImage: "/destinos/cancun.jpg",
    flyerImage: "/flyers/cancun.jpg",
    description: "All Inclusive en la Riviera Maya.",
    highlights: ["Playa", "All Inclusive"],
    typicalInclusions: ["Aéreo", "Hotel"],
    optionalExcursions: ["Tulum"],
    travelTip: "Llevá protector solar.",
    priceFrom: 1200,
    currency: "USD",
    priceNote: "por persona en base doble",
    priceValidUntil: "2026-12-31",
    faq: [
      {
        id: "traslados",
        question: "¿Incluye traslados?",
        answer: [{ type: "text", value: "Sí." }],
      },
    ],
    departures: [
      {
        date: "2026-11-10",
        displayDate: "10 de Noviembre",
        status: "confirmed",
        transport: "aereo",
        nights: 7,
        priceFrom: 1190,
        currency: "USD",
        note: "Salida especial",
        program: "Todo incluido",
        priceIsFinal: false,
        priceValidUntil: "2026-10-15",
      },
    ],
  };
}

describe("toDestinationListing", () => {
  it("keeps card fields and drops detail-only payload", () => {
    const listing = toDestinationListing(fullDestination());
    assert.equal(listing.slug, "cancun");
    assert.equal(listing.description, "All Inclusive en la Riviera Maya.");
    assert.equal(listing.heroImage, "/destinos/cancun.jpg");
    assert.equal(listing.departures.length, 1);
    assert.equal(listing.departures[0].displayDate, "10 de Noviembre");
    assert.equal(listing.departures[0].priceFrom, 1190);

    const serialized = JSON.stringify(listing);
    assert.equal(serialized.includes("metaTitle"), false);
    assert.equal(serialized.includes("flyerImage"), false);
    assert.equal(serialized.includes("highlights"), false);
    assert.equal(serialized.includes("typicalInclusions"), false);
    assert.equal(serialized.includes("optionalExcursions"), false);
    assert.equal(serialized.includes("travelTip"), false);
    assert.equal(serialized.includes("faq"), false);
    assert.equal(serialized.includes("Salida especial"), false);
    assert.equal(serialized.includes("Todo incluido"), false);
    assert.equal(serialized.includes("priceIsFinal"), false);
  });

  it("omits description for home featured cards", () => {
    const listing = toDestinationListing(fullDestination(), {
      includeDescription: false,
    });
    assert.equal("description" in listing, false);
  });
});
