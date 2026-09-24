import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getListedPrice,
  getQuoteSuggestionNames,
  hasExpiredListedPrice,
  isPriceExpired,
} from "./logic";
import type { Departure, DestinationPage } from "./types";

const today = new Date(2026, 8, 23);

function departure(overrides: Partial<Departure> = {}): Departure {
  return {
    date: "2026-10-09",
    displayDate: "9 de Octubre",
    status: "confirmed",
    transport: "aereo",
    nights: 7,
    ...overrides,
  };
}

function destination(overrides: Partial<DestinationPage> = {}): DestinationPage {
  return {
    slug: "cataratas-del-iguazu",
    name: "Cataratas del Iguazú",
    country: "Argentina",
    region: "nacional",
    metaTitle: "Cataratas",
    metaDescription: "Cataratas",
    heroImage: "/destinos/cataratas.jpg",
    description: "Selva",
    highlights: [],
    typicalInclusions: [],
    currency: "ARS",
    priceFrom: 410000,
    departures: [departure()],
    ...overrides,
  };
}

describe("isPriceExpired", () => {
  it("stays valid when there is no date", () => {
    assert.equal(isPriceExpired(undefined, today), false);
    assert.equal(isPriceExpired(null, today), false);
  });

  it("stays valid through the whole day", () => {
    assert.equal(isPriceExpired("2026-09-23", today), false);
    assert.equal(isPriceExpired("2026-09-24", today), false);
  });

  it("expires the day after", () => {
    assert.equal(isPriceExpired("2026-09-22", today), true);
  });
});

describe("getListedPrice", () => {
  it("keeps the amount when validity is unset", () => {
    const dest = destination({
      departures: [departure({ priceFrom: 380000 })],
    });
    assert.deepEqual(getListedPrice(dest, today), { amount: 380000, currency: "ARS" });
    assert.equal(hasExpiredListedPrice(dest, today), false);
  });

  it("drops an expired departure price and keeps a valid one", () => {
    const dest = destination({
      priceValidUntil: "2026-12-31",
      departures: [
        departure({ priceFrom: 500000, priceValidUntil: "2026-09-01" }),
        departure({ date: "2026-11-01", priceFrom: 420000, priceValidUntil: "2026-12-31" }),
      ],
    });
    assert.deepEqual(getListedPrice(dest, today), { amount: 420000, currency: "ARS" });
    assert.equal(hasExpiredListedPrice(dest, today), false);
  });

  it("returns undefined when every applicable price is expired", () => {
    const dest = destination({
      priceValidUntil: "2026-09-22",
      departures: [departure({ priceFrom: 380000 })],
    });
    assert.equal(getListedPrice(dest, today), undefined);
    assert.equal(hasExpiredListedPrice(dest, today), true);
  });

  it("uses the destination price when there is no hotel departure", () => {
    const valid = destination({
      departures: [],
      priceValidUntil: "2026-12-31",
    });
    assert.deepEqual(getListedPrice(valid, today), { amount: 410000, currency: "ARS" });

    const expired = destination({
      departures: [],
      priceValidUntil: "2026-09-22",
    });
    assert.equal(getListedPrice(expired, today), undefined);
    assert.equal(hasExpiredListedPrice(expired, today), true);
  });
});

describe("getQuoteSuggestionNames", () => {
  it("keeps catalog order, skips sold-out-only, and respects the limit", () => {
    const catalog = [
      destination({ slug: "a", name: "Alpha", departures: [departure({ status: "sold-out" })] }),
      destination({ slug: "b", name: "Bravo", departures: [departure()] }),
      destination({ slug: "c", name: "Charlie", departures: [] }),
      destination({
        slug: "d",
        name: "Delta",
        departures: [departure({ date: "2026-11-01", status: "few-seats" })],
      }),
      destination({ slug: "e", name: "Echo", departures: [departure({ date: "2026-12-01" })] }),
    ];

    assert.deepEqual(getQuoteSuggestionNames(catalog, 2, today), ["Bravo", "Delta"]);
    assert.deepEqual(getQuoteSuggestionNames(catalog, 10, today), ["Bravo", "Delta", "Echo"]);
  });

  it("returns an empty list when nothing is bookable", () => {
    assert.deepEqual(
      getQuoteSuggestionNames(
        [destination({ departures: [departure({ status: "sold-out" })] })],
        6,
        today,
      ),
      [],
    );
  });
});
