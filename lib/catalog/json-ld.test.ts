import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildDestinationTouristTripJsonLd } from "./json-ld";
import { getDeparturePublishedPrice, getListedOffer } from "./logic";
import type { Departure, DestinationPage } from "./types";

const today = new Date(2026, 9, 1); // 1 oct 2026 — repro Río

function departure(overrides: Partial<Departure> = {}): Departure {
  return {
    date: "2026-10-12",
    displayDate: "12 de Octubre",
    status: "confirmed",
    transport: "aereo",
    nights: 7,
    ...overrides,
  };
}

function destination(overrides: Partial<DestinationPage> = {}): DestinationPage {
  return {
    slug: "rio-de-janeiro",
    name: "Río de Janeiro",
    country: "Brasil",
    region: "internacional",
    metaTitle: "Río",
    metaDescription: "Río",
    heroImage: "/destinos/rio.jpg",
    description: "Cidade Maravilhosa",
    highlights: [],
    typicalInclusions: [],
    currency: "USD",
    priceFrom: 980,
    priceValidUntil: "2026-12-31",
    departures: [
      departure({ date: "2026-09-05", displayDate: "5 de Septiembre" }),
      departure({ date: "2026-10-12", displayDate: "12 de Octubre", status: "few-seats" }),
      departure({
        date: "2026-12-30",
        displayDate: "30 de Diciembre",
        priceFrom: 1719,
        currency: "USD",
        program: "Ibiza Barra Hotel",
      }),
    ],
    ...overrides,
  };
}

describe("buildDestinationTouristTripJsonLd", () => {
  it("JSON-LD price equals displayed departure price (Río: 1719, not stale 980)", () => {
    const dest = destination();
    const jsonLd = buildDestinationTouristTripJsonLd(dest, today);
    const listed = getListedOffer(dest, today);
    const displayed = dest.departures
      .map((dep) => getDeparturePublishedPrice(dest, dep, today))
      .filter((offer): offer is NonNullable<typeof offer> => offer != null);

    assert.ok(listed);
    assert.equal(listed.amount, 1719);
    assert.deepEqual(
      displayed.map((o) => o.amount),
      [1719],
    );
    assert.ok(jsonLd.offers);
    assert.equal(jsonLd.offers.price, listed.amount.toString());
    assert.equal(jsonLd.offers.price, "1719");
    assert.equal(jsonLd.offers.priceCurrency, "USD");
    assert.equal(jsonLd.offers.availability, "https://schema.org/InStock");
  });

  it("omits offers when there is no valid published price", () => {
    const dest = destination({
      priceFrom: undefined,
      priceValidUntil: undefined,
      departures: [
        departure({ date: "2026-10-12" }),
        departure({ date: "2026-12-30", displayDate: "30 de Diciembre" }),
      ],
    });
    const jsonLd = buildDestinationTouristTripJsonLd(dest, today);
    assert.equal(jsonLd.offers, undefined);
    assert.equal(getListedOffer(dest, today), undefined);
  });

  it("omits offers when the published price is expired", () => {
    const dest = destination({
      priceFrom: 980,
      priceValidUntil: "2026-09-22",
      departures: [
        departure({
          date: "2026-12-30",
          displayDate: "30 de Diciembre",
          priceFrom: 1719,
          currency: "USD",
          priceValidUntil: "2026-09-22",
        }),
      ],
    });
    const jsonLd = buildDestinationTouristTripJsonLd(dest, today);
    assert.equal(jsonLd.offers, undefined);
    assert.equal(getListedOffer(dest, today), undefined);
  });

  it("uses CMS priceValidUntil on the Offer (not a hardcoded fallback)", () => {
    const dest = destination({
      priceFrom: undefined,
      priceValidUntil: undefined,
      departures: [
        departure({
          date: "2026-12-30",
          displayDate: "30 de Diciembre",
          priceFrom: 1719,
          currency: "USD",
          priceValidUntil: "2026-11-15T00:00:00.000Z",
        }),
      ],
    });
    const jsonLd = buildDestinationTouristTripJsonLd(dest, today);
    assert.ok(jsonLd.offers);
    assert.equal(jsonLd.offers.price, "1719");
    assert.equal(jsonLd.offers.priceValidUntil, "2026-11-15");
  });

  it("omits priceValidUntil on the Offer when CMS has no vigencia", () => {
    const dest = destination({
      priceFrom: 1670,
      priceValidUntil: undefined,
      departures: [departure({ date: "2027-01-08", displayDate: "8 de Enero" })],
    });
    const jsonLd = buildDestinationTouristTripJsonLd(dest, today);
    assert.ok(jsonLd.offers);
    assert.equal(jsonLd.offers.price, "1670");
    assert.equal(jsonLd.offers.priceValidUntil, undefined);
  });
});
