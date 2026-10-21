import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  departureBadgeSelectable,
  destinationHasActiveDepartureInMonth,
  filterDestinationsByCurrency,
  filterDestinationsByDepartureMonth,
  formatCardOriginLine,
  formatDepartureMonthLabel,
  formatHomeCardPriceClause,
  formatShownMoney,
  formatShownPrice,
  formatShownPriceParts,
  getCardOrigin,
  getDepartureBadge,
  getDepartureMonthKey,
  getDeparturePublishedPrice,
  getListedPrice,
  getQuoteSuggestionNames,
  groupDestinationsForSort,
  hasExpiredListedPrice,
  isPriceExpired,
  isPriceSortMode,
  listAvailableDepartureMonths,
  readHomeDeparture,
  resolveSelectedDepartureMonth,
} from "./logic";
import type { Departure, DestinationPage } from "./types";
import { destinationsData } from "../../scripts/seed-data/destinations";

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

  it("inherits destination base when no departure publishes its own price", () => {
    const dest = destination({
      priceFrom: 410000,
      departures: [departure(), departure({ date: "2026-11-01" })],
    });
    assert.deepEqual(getListedPrice(dest, today), { amount: 410000, currency: "ARS" });
  });

  it("uses explicit departure prices only (Río: 1719, not stale base 980)", () => {
    const rio = destination({
      slug: "rio-de-janeiro",
      name: "Río de Janeiro",
      country: "Brasil",
      region: "internacional",
      currency: "USD",
      priceFrom: 980,
      priceValidUntil: "2026-12-31",
      departures: [
        departure({ date: "2026-10-12", status: "few-seats" }),
        departure({
          date: "2026-12-30",
          displayDate: "30 de Diciembre",
          priceFrom: 1719,
          currency: "USD",
        }),
      ],
    });
    assert.deepEqual(getListedPrice(rio, today), { amount: 1719, currency: "USD" });
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

const cardToday = new Date(2026, 9, 18);

describe("getCardOrigin", () => {
  it("reads Córdoba o Ezeiza from the note before transport", () => {
    assert.equal(
      getCardOrigin({ transport: "aereo", note: "Andes. Córdoba o Ezeiza" }),
      "cordoba-or-ezeiza",
    );
    assert.equal(
      getCardOrigin({ transport: "bus", note: "Salida en bus. Córdoba o Ezeiza" }),
      "cordoba-or-ezeiza",
    );
  });

  it("prints Bus only for bus transport without that phrase", () => {
    assert.equal(getCardOrigin({ transport: "bus", note: "Cupos limitados" }), "bus");
    assert.equal(getCardOrigin({ transport: "bus-cama" }), "bus");
  });

  it("omits a Córdoba-only note on a flight", () => {
    assert.equal(
      getCardOrigin({
        transport: "aereo",
        note: "Vuelo directo SKY desde Córdoba",
      }),
      "omit",
    );
    assert.equal(formatCardOriginLine("omit"), null);
    assert.equal(formatCardOriginLine("bus"), "Bus");
    assert.equal(formatCardOriginLine("cordoba-or-ezeiza"), "Córdoba o Ezeiza");
  });
});

describe("readHomeDeparture", () => {
  it("reads Salvador on 2026-10-18 as 26 de Diciembre at USD 1545", () => {
    const salvador = destinationsData.find((dest) => dest.slug === "salvador-de-bahia");
    assert.ok(salvador);
    const view = readHomeDeparture(salvador, cardToday);
    assert.equal(view?.dateIso, "2026-12-26");
    assert.equal(view?.displayDate, "26 de Diciembre");
    assert.deepEqual(view?.price, {
      kind: "amount",
      currency: "USD",
      amount: 1545,
      quotedAs: "desde",
    });
    assert.equal(view?.origin, "cordoba-or-ezeiza");
  });

  it("keeps the nearest departure when a later one is cheaper", () => {
    const dest = destination({
      priceFrom: 100,
      departures: [
        departure({
          date: "2026-11-01",
          displayDate: "1 de Noviembre",
          priceFrom: 2000,
          currency: "USD",
        }),
        departure({
          date: "2026-12-01",
          displayDate: "1 de Diciembre",
          priceFrom: 900,
          currency: "USD",
        }),
      ],
    });
    const view = readHomeDeparture(dest, cardToday);
    assert.equal(view?.dateIso, "2026-11-01");
    assert.equal(view?.displayDate, "1 de Noviembre");
    assert.equal(view?.price.kind === "amount" && view.price.amount, 2000);
  });

  it("on the same date prefers hotel over solo aéreo, then the cheaper hotel", () => {
    const dest = destination({
      departures: [
        departure({
          date: "2026-11-01",
          displayDate: "1 de Noviembre",
          priceFrom: 850,
          currency: "USD",
          stayLabel: "Sin hotel",
          priceIsFinal: true,
          program: "Solo aéreo",
        }),
        departure({
          date: "2026-11-01",
          displayDate: "1 de Noviembre",
          priceFrom: 1402,
          currency: "USD",
          program: "Morro",
        }),
        departure({
          date: "2026-11-01",
          displayDate: "1 de Noviembre",
          priceFrom: 1284,
          currency: "USD",
          program: "Vila Galé",
        }),
      ],
    });
    const view = readHomeDeparture(dest, cardToday);
    assert.equal(view?.price.kind === "amount" && view.price.amount, 1284);
    assert.equal(view?.nights, 7);
  });

  it("inherits destination base when no hotel departure publishes its own price (Porto shape)", () => {
    const porto = destinationsData.find((dest) => dest.slug === "porto-de-galinhas");
    assert.ok(porto);
    const view = readHomeDeparture(porto, cardToday);
    assert.equal(view?.dateIso, "2027-01-08");
    assert.equal(view?.displayDate, "8 de Enero");
    assert.deepEqual(view?.price, {
      kind: "amount",
      currency: "USD",
      amount: 1670,
      quotedAs: "desde",
    });
    const first = porto.departures.find((dep) => dep.date === "2027-01-08");
    assert.ok(first);
    assert.equal(first.priceFrom, undefined);
    assert.deepEqual(getDeparturePublishedPrice(porto, first, cardToday), {
      amount: 1670,
      currency: "USD",
    });
  });

  it("does not inherit dest.priceFrom when a sibling hotel departure has its own price (Río)", () => {
    const dest = destination({
      priceFrom: 980,
      currency: "USD",
      departures: [
        departure({
          date: "2026-11-01",
          displayDate: "1 de Noviembre",
          priceFrom: undefined,
        }),
        departure({
          date: "2026-12-30",
          displayDate: "30 de Diciembre",
          priceFrom: 1719,
          currency: "USD",
        }),
      ],
    });
    const view = readHomeDeparture(dest, cardToday);
    assert.equal(view?.dateIso, "2026-11-01");
    assert.deepEqual(view?.price, { kind: "ask" });
  });

  it("asks when the departure price is already expired", () => {
    const dest = destination({
      priceFrom: 500,
      departures: [
        departure({
          date: "2026-11-01",
          displayDate: "1 de Noviembre",
          priceFrom: 2000,
          currency: "USD",
          priceValidUntil: "2026-10-01",
        }),
      ],
    });
    assert.deepEqual(readHomeDeparture(dest, cardToday)?.price, { kind: "ask" });
  });

  it("marks a closed fare as final", () => {
    const dest = destination({
      departures: [
        departure({
          date: "2026-11-01",
          displayDate: "1 de Noviembre",
          priceFrom: 850,
          currency: "USD",
          priceIsFinal: true,
        }),
      ],
    });
    assert.deepEqual(readHomeDeparture(dest, cardToday)?.price, {
      kind: "amount",
      currency: "USD",
      amount: 850,
      quotedAs: "final",
    });
  });

  it("returns null when every departure is past or sold out", () => {
    const dest = destination({
      departures: [
        departure({ date: "2026-09-01", status: "confirmed" }),
        departure({ date: "2026-11-01", status: "sold-out" }),
      ],
    });
    assert.equal(readHomeDeparture(dest, cardToday), null);
  });
});

describe("formatShownPrice", () => {
  it("keeps currency and amount as one money token", () => {
    assert.equal(formatShownMoney("USD", 3375), "USD 3.375");
    assert.equal(formatShownMoney("ARS", 620000), "$620.000");
  });

  it("prints the card string and the chat clause from the same amount", () => {
    assert.equal(formatShownPrice({ kind: "ask" }), "Consultá precio");
    assert.equal(formatHomeCardPriceClause({ kind: "ask" }), "precio a consultar");
    const usd = {
      kind: "amount" as const,
      currency: "USD" as const,
      amount: 1545,
      quotedAs: "desde" as const,
    };
    const ars = {
      kind: "amount" as const,
      currency: "ARS" as const,
      amount: 620000,
      quotedAs: "desde" as const,
    };
    const finalFare = {
      kind: "amount" as const,
      currency: "USD" as const,
      amount: 1670,
      quotedAs: "final" as const,
    };
    assert.equal(formatShownPrice(usd), "Desde USD 1.545");
    assert.equal(formatHomeCardPriceClause(usd), "desde USD 1.545");
    assert.equal(formatShownPrice(ars), "Desde $620.000");
    assert.equal(formatHomeCardPriceClause(ars), "desde $620.000");
    assert.equal(formatShownPrice(finalFare), "Final USD 1.670");
    assert.equal(formatHomeCardPriceClause(finalFare), "final USD 1.670");
  });

  it("decomposes price into structured qualifier and amount for cards", () => {
    assert.deepEqual(formatShownPriceParts({ kind: "ask" }), {
      kind: "ask",
      label: "Consultá precio",
    });
    assert.deepEqual(formatShownPriceParts(null), {
      kind: "ask",
      label: "Consultá precio",
    });
    const usd = {
      kind: "amount" as const,
      currency: "USD" as const,
      amount: 1545,
      quotedAs: "desde" as const,
    };
    assert.deepEqual(formatShownPriceParts(usd), {
      kind: "amount",
      prefix: "desde USD",
      amount: "1.545",
    });
    const ars = {
      kind: "amount" as const,
      currency: "ARS" as const,
      amount: 620000,
      quotedAs: "desde" as const,
    };
    assert.deepEqual(formatShownPriceParts(ars), {
      kind: "amount",
      prefix: "desde",
      amount: "$620.000",
    });
    const finalFare = {
      kind: "amount" as const,
      currency: "USD" as const,
      amount: 1670,
      quotedAs: "final" as const,
    };
    assert.deepEqual(formatShownPriceParts(finalFare), {
      kind: "amount",
      prefix: "final USD",
      amount: "1.670",
    });
  });
});

describe("getDepartureBadge", () => {
  it("asks when the status is inquire", () => {
    const badge = getDepartureBadge(
      { date: "2026-11-18", status: "inquire" },
      cardToday,
    );
    assert.deepEqual(badge, { kind: "inquire", label: "Consultar disponibilidad" });
    assert.equal(departureBadgeSelectable(badge), true);
  });

  it("treats an unknown status as inquire", () => {
    const badge = getDepartureBadge(
      { date: "2026-11-18", status: "waitlist" },
      cardToday,
    );
    assert.equal(badge.label, "Consultar disponibilidad");
    assert.notEqual(badge.label, "Salida Confirmada");
  });

  it("keeps confirmed and few-seats outside the three-day window", () => {
    assert.deepEqual(
      getDepartureBadge({ date: "2026-10-22", status: "confirmed" }, cardToday),
      { kind: "confirmed", label: "Salida Confirmada" },
    );
    assert.deepEqual(
      getDepartureBadge({ date: "2026-10-22", status: "few-seats" }, cardToday),
      { kind: "few-seats", label: "Últimos Cupos" },
    );
  });

  it("asks for places inside three days, even when the fare was confirmed", () => {
    const soon = getDepartureBadge({ date: "2026-10-21", status: "confirmed" }, cardToday);
    assert.deepEqual(soon, { kind: "soon", label: "Consultar Lugares" });
    assert.equal(departureBadgeSelectable(soon), true);
    assert.equal(
      getDepartureBadge({ date: "2026-10-20", status: "few-seats" }, cardToday).kind,
      "soon",
    );
    assert.equal(JSON.stringify(soon).includes("animate-pulse"), false);
  });

  it("closes sold-out and past departures", () => {
    const sold = getDepartureBadge({ date: "2026-10-19", status: "sold-out" }, cardToday);
    assert.deepEqual(sold, { kind: "sold-out", label: "Cupos Completos" });
    assert.equal(departureBadgeSelectable(sold), false);
    const past = getDepartureBadge({ date: "2026-10-17", status: "confirmed" }, cardToday);
    assert.deepEqual(past, { kind: "past", label: "Viaje Realizado" });
    assert.equal(departureBadgeSelectable(past), false);
  });
});
