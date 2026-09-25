import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  destinationHasActiveDepartureInMonth,
  filterDestinationsByCurrency,
  filterDestinationsByDepartureMonth,
  formatDepartureMonthLabel,
  getDepartureMonthKey,
  getListedPrice,
  getQuoteSuggestionNames,
  groupDestinationsForSort,
  hasExpiredListedPrice,
  isPriceExpired,
  isPriceSortMode,
  listAvailableDepartureMonths,
  resolveSelectedDepartureMonth,
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

describe("filterDestinationsByCurrency", () => {
  const arsDest = destination({
    slug: "mendoza",
    name: "Mendoza",
    currency: "ARS",
    priceFrom: 420000,
    departures: [departure({ priceFrom: 420000 })],
  });
  const usdDest = destination({
    slug: "rio-de-janeiro",
    name: "Río de Janeiro",
    country: "Brasil",
    region: "internacional",
    currency: "USD",
    priceFrom: 1850,
    departures: [departure({ priceFrom: 1850, currency: "USD" })],
  });
  const unpriced = destination({
    slug: "a-medida",
    name: "Viaje a medida",
    currency: "ARS",
    priceFrom: undefined,
    departures: [],
  });
  const expired = destination({
    slug: "precio-vencido",
    name: "Precio vencido",
    currency: "USD",
    priceFrom: 900,
    priceValidUntil: "2026-09-01",
    departures: [],
  });
  const catalog = [arsDest, usdDest, unpriced, expired];

  it("keeps the full list for Todas", () => {
    assert.deepEqual(
      filterDestinationsByCurrency(catalog, "all", today).map((d) => d.slug),
      ["mendoza", "rio-de-janeiro", "a-medida", "precio-vencido"],
    );
  });

  it("keeps only ARS listed prices (excludes unpriced/expired)", () => {
    assert.deepEqual(
      filterDestinationsByCurrency(catalog, "ARS", today).map((d) => d.slug),
      ["mendoza"],
    );
  });

  it("keeps only USD listed prices (excludes unpriced/expired)", () => {
    assert.deepEqual(
      filterDestinationsByCurrency(catalog, "USD", today).map((d) => d.slug),
      ["rio-de-janeiro"],
    );
  });

  it("uses getListedPrice currency, not the raw destination.currency field", () => {
    // Destination declares ARS but the only hotel amount is USD via departure.
    const mixed = destination({
      slug: "mixto",
      name: "Mixto",
      currency: "ARS",
      priceFrom: 100,
      departures: [departure({ priceFrom: 500, currency: "USD" })],
    });
    assert.deepEqual(getListedPrice(mixed, today), { amount: 500, currency: "USD" });
    assert.deepEqual(
      filterDestinationsByCurrency([mixed], "USD", today).map((d) => d.slug),
      ["mixto"],
    );
    assert.deepEqual(filterDestinationsByCurrency([mixed], "ARS", today), []);
  });
});

describe("isPriceSortMode", () => {
  it("is true only for Precio ↑/↓", () => {
    assert.equal(isPriceSortMode("price-asc"), true);
    assert.equal(isPriceSortMode("price-desc"), true);
    assert.equal(isPriceSortMode("featured"), false);
    assert.equal(isPriceSortMode("next-departure"), false);
  });
});

describe("groupDestinationsForSort", () => {
  const bariloche = destination({
    slug: "bariloche",
    name: "Bariloche",
    currency: "ARS",
    priceFrom: 587000,
    departures: [departure({ date: "2026-11-10", priceFrom: 587000 })],
  });
  const mendoza = destination({
    slug: "mendoza",
    name: "Mendoza",
    currency: "ARS",
    priceFrom: 420000,
    departures: [departure({ date: "2026-10-05", priceFrom: 420000 })],
  });
  const rio = destination({
    slug: "rio-de-janeiro",
    name: "Río de Janeiro",
    country: "Brasil",
    region: "internacional",
    currency: "USD",
    priceFrom: 1850,
    departures: [departure({ date: "2026-10-20", priceFrom: 1850, currency: "USD" })],
  });
  const cancún = destination({
    slug: "cancun",
    name: "Cancún",
    country: "México",
    region: "internacional",
    currency: "USD",
    priceFrom: 2100,
    departures: [departure({ date: "2026-12-01", priceFrom: 2100, currency: "USD" })],
  });
  const consultar = destination({
    slug: "a-medida",
    name: "Viaje a medida",
    currency: "ARS",
    priceFrom: undefined,
    departures: [],
  });
  const expired = destination({
    slug: "precio-vencido",
    name: "Precio vencido",
    currency: "ARS",
    priceFrom: 100000,
    priceValidUntil: "2026-09-01",
    departures: [],
  });

  it("keeps catalog order for Destacados", () => {
    const catalog = [rio, mendoza, bariloche];
    const groups = groupDestinationsForSort(catalog, "featured", { today });
    assert.equal(groups.length, 1);
    assert.deepEqual(
      groups[0].items.map((d) => d.slug),
      ["rio-de-janeiro", "mendoza", "bariloche"],
    );
    assert.equal(groups[0].heading, undefined);
  });

  it("splits mixed ARS/USD into En pesos / En dólares blocks (price asc)", () => {
    const catalog = [rio, mendoza, cancún, bariloche, consultar];
    const groups = groupDestinationsForSort(catalog, "price-asc", { today });
    assert.equal(groups.length, 3);
    assert.equal(groups[0].heading, "En pesos");
    assert.deepEqual(
      groups[0].items.map((d) => d.slug),
      ["mendoza", "bariloche"],
    );
    assert.equal(groups[1].heading, "En dólares");
    assert.deepEqual(
      groups[1].items.map((d) => d.slug),
      ["rio-de-janeiro", "cancun"],
    );
    assert.equal(groups[2].heading, undefined);
    assert.deepEqual(
      groups[2].items.map((d) => d.slug),
      ["a-medida"],
    );
  });

  it("never compares ARS vs USD numerically on price desc", () => {
    // 1850 USD must not sort above 587000 ARS just because 1850 < 587000.
    const catalog = [bariloche, rio];
    const groups = groupDestinationsForSort(catalog, "price-desc", { today });
    assert.equal(groups.length, 2);
    assert.equal(groups[0].heading, "En pesos");
    assert.equal(groups[0].items[0].slug, "bariloche");
    assert.equal(groups[1].heading, "En dólares");
    assert.equal(groups[1].items[0].slug, "rio-de-janeiro");
  });

  it("puts missing and expired prices last in both directions", () => {
    const catalog = [consultar, mendoza, expired, bariloche];
    const asc = groupDestinationsForSort(catalog, "price-asc", { today });
    assert.deepEqual(
      asc[0].items.map((d) => d.slug),
      ["mendoza", "bariloche", "a-medida", "precio-vencido"],
    );

    const desc = groupDestinationsForSort(catalog, "price-desc", { today });
    assert.deepEqual(
      desc[0].items.map((d) => d.slug),
      ["bariloche", "mendoza", "a-medida", "precio-vencido"],
    );
  });

  it("breaks price ties with catalog sortOrder, then name", () => {
    const sameA = destination({
      slug: "zeta",
      name: "Zeta",
      currency: "ARS",
      priceFrom: 400000,
      departures: [departure({ priceFrom: 400000 })],
    });
    const sameB = destination({
      slug: "alfa",
      name: "Alfa",
      currency: "ARS",
      priceFrom: 400000,
      departures: [departure({ priceFrom: 400000 })],
    });
    // sameA appears first in catalog (lower sortOrder) despite name Z vs A.
    const catalog = [sameA, sameB];
    const groups = groupDestinationsForSort(catalog, "price-asc", { today });
    assert.deepEqual(
      groups[0].items.map((d) => d.slug),
      ["zeta", "alfa"],
    );

    const sameNameFirst = destination({
      slug: "bravo",
      name: "Mismo",
      currency: "ARS",
      priceFrom: 400000,
      departures: [departure({ priceFrom: 400000 })],
    });
    const sameNameSecond = destination({
      slug: "charlie",
      name: "Mismo",
      currency: "ARS",
      priceFrom: 400000,
      departures: [departure({ priceFrom: 400000 })],
    });
    const byName = groupDestinationsForSort([sameNameSecond, sameNameFirst], "price-asc", {
      today,
      catalogOrder: [sameNameFirst, sameNameSecond],
    });
    assert.deepEqual(
      byName[0].items.map((d) => d.slug),
      ["bravo", "charlie"],
    );
  });

  it("sorts by next active departure and leaves inquire-only last", () => {
    const catalog = [cancún, consultar, mendoza, rio];
    const groups = groupDestinationsForSort(catalog, "next-departure", { today });
    assert.deepEqual(
      groups[0].items.map((d) => d.slug),
      ["mendoza", "rio-de-janeiro", "cancun", "a-medida"],
    );
  });
});

describe("departure month helpers", () => {
  it("formats month keys with es-AR short labels", () => {
    assert.equal(getDepartureMonthKey("2026-10-09"), "2026-10");
    assert.equal(formatDepartureMonthLabel("2026-10"), "Oct 2026");
    assert.equal(formatDepartureMonthLabel("2027-01"), "Ene 2027");
  });

  it("lists only months in the window with active upcoming departures", () => {
    const catalog = [
      destination({
        slug: "oct-active",
        departures: [departure({ date: "2026-10-15", status: "confirmed" })],
      }),
      destination({
        slug: "nov-sold-out",
        departures: [departure({ date: "2026-11-10", status: "sold-out" })],
      }),
      destination({
        slug: "past-only",
        departures: [departure({ date: "2026-08-01", status: "confirmed" })],
      }),
      destination({
        slug: "dec-few",
        departures: [departure({ date: "2026-12-05", status: "few-seats" })],
      }),
      destination({
        slug: "far-future",
        departures: [departure({ date: "2027-05-01", status: "confirmed" })],
      }),
    ];

    // today = 2026-09-23 → window Sep–Feb; Sep empty, Nov only sold-out, May out of window.
    assert.deepEqual(listAvailableDepartureMonths(catalog, { today, monthsAhead: 6 }), [
      { key: "2026-10", label: "Oct 2026" },
      { key: "2026-12", label: "Dic 2026" },
    ]);
  });

  it("excludes sold-out and past when filtering by month", () => {
    const octLive = destination({
      slug: "oct-live",
      departures: [departure({ date: "2026-10-09", status: "confirmed" })],
    });
    const octSoldOut = destination({
      slug: "oct-sold",
      departures: [departure({ date: "2026-10-20", status: "sold-out" })],
    });
    const novOnly = destination({
      slug: "nov-only",
      departures: [departure({ date: "2026-11-01", status: "confirmed" })],
    });

    assert.equal(destinationHasActiveDepartureInMonth(octLive, "2026-10", today), true);
    assert.equal(destinationHasActiveDepartureInMonth(octSoldOut, "2026-10", today), false);
    assert.deepEqual(
      filterDestinationsByDepartureMonth([octLive, octSoldOut, novOnly], "2026-10", today).map(
        (d) => d.slug,
      ),
      ["oct-live"],
    );
    assert.deepEqual(
      filterDestinationsByDepartureMonth([octLive, novOnly], null, today).map((d) => d.slug),
      ["oct-live", "nov-only"],
    );
  });

  it("is deterministic for a fixed today across month boundaries", () => {
    const catalog = [
      destination({
        slug: "sep-edge",
        // Same calendar day as `today` still counts as upcoming.
        departures: [departure({ date: "2026-09-23", status: "confirmed" })],
      }),
      destination({
        slug: "feb-edge",
        departures: [departure({ date: "2027-02-28", status: "confirmed" })],
      }),
      destination({
        slug: "mar-out",
        departures: [departure({ date: "2027-03-01", status: "confirmed" })],
      }),
    ];

    assert.deepEqual(listAvailableDepartureMonths(catalog, { today, monthsAhead: 6 }), [
      { key: "2026-09", label: "Sep 2026" },
      { key: "2027-02", label: "Feb 2027" },
    ]);
  });

  it("scopes available months to the region-filtered list and clears an unavailable selection", () => {
    const nacionalOct = destination({
      slug: "salta",
      region: "nacional",
      departures: [departure({ date: "2026-10-10", status: "confirmed" })],
    });
    const internacionalSep = destination({
      slug: "rio-de-janeiro",
      region: "internacional",
      country: "Brasil",
      departures: [departure({ date: "2026-09-27", status: "confirmed" })],
    });
    const catalog = [nacionalOct, internacionalSep];

    const allMonths = listAvailableDepartureMonths(catalog, { today });
    const nacionales = catalog.filter((d) => d.region === "nacional");
    const nacionalMonths = listAvailableDepartureMonths(nacionales, { today });

    assert.deepEqual(
      allMonths.map((m) => m.key),
      ["2026-09", "2026-10"],
    );
    assert.deepEqual(
      nacionalMonths.map((m) => m.key),
      ["2026-10"],
    );

    // Sep was selected under Todos; after switching to Nacionales it is no longer available.
    assert.equal(resolveSelectedDepartureMonth("2026-09", nacionalMonths), null);
    assert.equal(resolveSelectedDepartureMonth("2026-10", nacionalMonths), "2026-10");
    assert.equal(resolveSelectedDepartureMonth(null, nacionalMonths), null);
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
