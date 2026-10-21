import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DepartureListing, DestinationListing } from "@/lib/catalog/listing";
import { getClusterBySlug, getClusterDestinations } from "@/lib/clusters-data";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { destinationsData } from "../../scripts/seed-data/destinations";
import { describeClusterListings, describeDestinationListing, META_DESCRIPTION_MAX } from "./offer-description";

const TODAY = new Date(2026, 9, 21);

const PORTO = "Porto de Galinhas, salida 8 de Enero, desde USD 1.670.";
const RIO = "Río de Janeiro, salida 30 de Diciembre, desde USD 1.719.";
const CATARATAS = "Cataratas del Iguazú, salida 18 de Noviembre, desde $620.000.";
const BRASIL = "Brasil: F1 Grand Premio de São Paulo, salida 5 de Noviembre, desde USD 2.770.";

function departure(overrides: Partial<DepartureListing> = {}): DepartureListing {
  return {
    date: "2026-11-01",
    displayDate: "1 de Noviembre",
    status: "confirmed",
    transport: "aereo",
    nights: 7,
    ...overrides,
  };
}

function listing(overrides: Partial<DestinationListing> = {}): DestinationListing {
  return {
    slug: "playa",
    name: "Playa",
    country: "Brasil",
    region: "internacional",
    heroImage: "/destinos/playa.jpg",
    currency: "USD",
    departures: [departure()],
    ...overrides,
  };
}

function seed(slug: string) {
  const dest = destinationsData.find((row) => row.slug === slug);
  assert.ok(dest, slug);
  return dest;
}

function playas(count: number): string {
  return Array.from({ length: count }, () => "Playa").join(" ");
}

describe("describeDestinationListing", () => {
  it("quotes Porto, Río, and Cataratas on 2026-10-21", () => {
    const porto = seed("porto-de-galinhas");
    const rio = seed("rio-de-janeiro");
    const cataratas = seed("cataratas-del-iguazu");
    const portoText = describeDestinationListing(porto, TODAY);
    const rioText = describeDestinationListing(rio, TODAY);
    const cataratasText = describeDestinationListing(cataratas, TODAY);

    assert.equal(portoText, PORTO);
    assert.equal(rioText, RIO);
    assert.equal(cataratasText, CATARATAS);
    for (const text of [portoText, rioText, cataratasText]) {
      assert.ok(text.length <= META_DESCRIPTION_MAX);
      assert.equal(META_DESCRIPTION_MAX, 155);
      assert.doesNotMatch(text, /desde córdoba/i);
      assert.doesNotMatch(text, /atenci[oó]n humana/i);
      assert.doesNotMatch(text, /v[ií]a bariloche/i);
      assert.doesNotMatch(text, /andes/i);
    }
  });

  it("keeps a desde Córdoba title and copies one description to og and twitter", () => {
    const porto = seed("porto-de-galinhas");
    const description = describeDestinationListing(porto, TODAY);
    const meta = buildPageMetadata({
      title: porto.metaTitle,
      description,
      path: "/destinos/porto-de-galinhas",
    });

    assert.match(String(porto.metaTitle), /desde Córdoba/);
    assert.equal(meta.title, porto.metaTitle);
    assert.equal(meta.description, description);
    const og = meta.openGraph as { description?: string } | undefined;
    const twitter = meta.twitter as { description?: string } | undefined;
    assert.equal(og?.description, description);
    assert.equal(twitter?.description, description);
  });

  it("returns the same string on a second call and does not change departures", () => {
    const porto = seed("porto-de-galinhas");
    const before = JSON.stringify(porto.departures);
    const once = describeDestinationListing(porto, TODAY);
    const twice = describeDestinationListing(porto, TODAY);
    assert.equal(once, twice);
    assert.equal(once, PORTO);
    assert.equal(JSON.stringify(porto.departures), before);
  });

  it("names the nearest unpriced date and leaves the later fare out", () => {
    const text = describeDestinationListing(
      listing({
        name: "Río de Janeiro",
        priceFrom: 980,
        departures: [
          departure({ date: "2026-11-01", displayDate: "1 de Noviembre" }),
          departure({
            date: "2026-12-30",
            displayDate: "30 de Diciembre",
            priceFrom: 1719,
            currency: "USD",
          }),
        ],
      }),
      TODAY,
    );
    assert.equal(text, "Río de Janeiro, salida 1 de Noviembre. Consultá precio.");
    assert.doesNotMatch(text, /1719|980/);
  });

  it("prints the nearer fare when a later departure is cheaper", () => {
    const text = describeDestinationListing(
      listing({
        name: "Cerca",
        departures: [
          departure({ priceFrom: 2000, currency: "USD" }),
          departure({
            date: "2026-12-01",
            displayDate: "1 de Diciembre",
            priceFrom: 900,
            currency: "USD",
          }),
        ],
      }),
      TODAY,
    );
    assert.equal(text, "Cerca, salida 1 de Noviembre, desde USD 2.000.");
  });

  it("prints final for a closed fare", () => {
    const text = describeDestinationListing(
      listing({
        name: "Cerrado",
        departures: [departure({ priceFrom: 850, currency: "USD", priceIsFinal: true })],
      }),
      TODAY,
    );
    assert.equal(text, "Cerrado, salida 1 de Noviembre, final USD 850.");
    assert.doesNotMatch(text, /desde/);
  });

  it("asks for departures and a price when the listing has no departure", () => {
    const text = describeDestinationListing(
      listing({ name: "Camboriú", priceFrom: 599, departures: [] }),
      TODAY,
    );
    assert.equal(text, "Camboriú. Consultá salidas y precio.");
    assert.doesNotMatch(text, /599/);
  });

  it("treats a non-finite amount as unpriced", () => {
    for (const amount of [Number.NaN, Number.POSITIVE_INFINITY]) {
      const text = describeDestinationListing(
        listing({
          departures: [departure({ priceFrom: amount, currency: "USD" })],
        }),
        TODAY,
      );
      assert.equal(text, "Playa, salida 1 de Noviembre. Consultá precio.");
      assert.doesNotMatch(text, /NaN|Infinity/);
    }
  });

  it("does not copy a wholesaler note or a dual-origin note", () => {
    const bariloche = describeDestinationListing(
      listing({
        name: "Mendoza",
        departures: [departure({ note: "Vía Bariloche", priceFrom: 100, currency: "USD" })],
      }),
      TODAY,
    );
    const andes = describeDestinationListing(
      listing({
        name: "Mendoza",
        departures: [
          departure({ note: "Andes. Córdoba o Ezeiza", priceFrom: 100, currency: "USD" }),
        ],
      }),
      TODAY,
    );
    assert.equal(bariloche, "Mendoza, salida 1 de Noviembre, desde USD 100.");
    assert.equal(andes, "Mendoza, salida 1 de Noviembre, desde USD 100.");
    assert.doesNotMatch(andes, /desde córdoba|andes|ezeiza/i);
  });

  it("replaces a banned sentence instead of deleting the phrase", () => {
    const named = describeDestinationListing(
      listing({
        name: "Playa desde Córdoba",
        departures: [departure({ priceFrom: 100, currency: "USD" })],
      }),
      TODAY,
    );
    const wholesaler = describeDestinationListing(
      listing({
        name: "Vía  Bariloche",
        departures: [departure({ priceFrom: 100, currency: "USD" })],
      }),
      TODAY,
    );
    assert.equal(named, "Este destino. Consultá salidas y precio.");
    assert.equal(wholesaler, "Este destino. Consultá salidas y precio.");
    assert.doesNotMatch(named, /desde córdoba|USD/i);
  });

  it("ignores a display date that is not a day-and-month label", () => {
    const text = describeDestinationListing(
      listing({
        departures: [
          departure({
            date: "2026-11-05",
            displayDate: "sale con Via Tac",
            priceFrom: 100,
            currency: "USD",
          }),
        ],
      }),
      TODAY,
    );
    assert.equal(text, "Playa, salida 5 de Noviembre, desde USD 100.");
    assert.doesNotMatch(text, /tac/i);
  });

  it("drops a long money token whole and keeps the date", () => {
    const name = playas(19);
    const text = describeDestinationListing(
      listing({
        name,
        departures: [departure({ priceFrom: 10_000_000, currency: "USD" })],
      }),
      TODAY,
    );
    assert.equal(text, `${name}, salida 1 de Noviembre. Consultá precio.`);
    assert.equal(text.length <= META_DESCRIPTION_MAX, true);
    assert.equal(text.includes("USD 10.000.000"), false);
    assert.equal(text.includes("10.000.000"), false);
  });

  it("drops the date when the dated sentence still exceeds 155", () => {
    const name = playas(20);
    const text = describeDestinationListing(
      listing({
        name,
        departures: [departure({ priceFrom: 10_000_000, currency: "USD" })],
      }),
      TODAY,
    );
    assert.equal(text, `${name}. Consultá salidas y precio.`);
    assert.equal(text.includes("Noviembre"), false);
    assert.equal(text.includes("USD"), false);
    assert.ok(text.length <= META_DESCRIPTION_MAX);
  });

  it("cuts on a word boundary with no ellipsis", () => {
    const name = playas(22);
    const full = `${name}. Consultá salidas y precio.`;
    const text = describeDestinationListing(
      listing({
        name,
        departures: [departure({ priceFrom: 1670, currency: "USD" })],
      }),
      TODAY,
    );
    assert.equal(text, `${name}. Consultá salidas y`);
    assert.equal(text.includes("..."), false);
    assert.equal(text.includes("…"), false);
    assert.equal(text.includes("USD"), false);
    assert.ok(text.length <= META_DESCRIPTION_MAX);
    assert.equal(full.startsWith(text), true);
    assert.match(full[text.length] ?? "", /\s/);
  });

  it("leaves out a token that is itself longer than 155", () => {
    const text = describeDestinationListing(
      listing({
        name: "A".repeat(180),
        departures: [departure({ priceFrom: 1670, currency: "USD" })],
      }),
      TODAY,
    );
    assert.equal(text, "Consultá salidas y precio.");
    assert.equal(text.includes("A"), false);
    assert.ok(text.length <= META_DESCRIPTION_MAX);
  });
});

describe("describeClusterListings", () => {
  it("quotes the earliest priced Brasil departure on 2026-10-21", () => {
    const cluster = getClusterBySlug("brasil-desde-cordoba");
    assert.ok(cluster);
    const members = getClusterDestinations(cluster, destinationsData);
    const before = members.map((member) => member.slug);
    const text = describeClusterListings(members, TODAY);
    assert.equal(text, BRASIL);
    assert.equal(describeClusterListings(members, TODAY), text);
    assert.deepEqual(
      members.map((member) => member.slug),
      before,
    );
    assert.ok(text.length <= META_DESCRIPTION_MAX);
    assert.doesNotMatch(text, /desde córdoba/i);
    assert.doesNotMatch(text, /atenci[oó]n humana/i);
    assert.doesNotMatch(cluster.metaDescription, /atenci[oó]n humana/i);
    assert.match(cluster.metaTitle, /desde Córdoba/);

    const meta = buildPageMetadata({
      title: cluster.metaTitle,
      description: text,
      path: "/destinos/brasil-desde-cordoba",
    });
    assert.equal(meta.title, cluster.metaTitle);
    assert.equal(meta.description, text);
    const og = meta.openGraph as { description?: string } | undefined;
    const twitter = meta.twitter as { description?: string } | undefined;
    assert.equal(og?.description, text);
    assert.equal(twitter?.description, text);
  });

  it("keeps a later published fare ahead of an earlier unpriced departure", () => {
    const text = describeClusterListings(
      [
        listing({
          slug: "temprano",
          name: "Temprano",
          priceFrom: undefined,
          departures: [departure({ date: "2026-11-01", displayDate: "1 de Noviembre" })],
        }),
        listing({
          slug: "tarde",
          name: "Tarde",
          departures: [
            departure({
              date: "2026-12-01",
              displayDate: "1 de Diciembre",
              priceFrom: 500,
              currency: "USD",
            }),
          ],
        }),
      ],
      TODAY,
    );
    assert.equal(text, "Brasil: Tarde, salida 1 de Diciembre, desde USD 500.");
  });

  it("breaks a same-day tie by earlier index, not by amount or currency", () => {
    const sameCurrency = describeClusterListings(
      [
        listing({
          slug: "caro",
          name: "Caro",
          departures: [
            departure({
              date: "2026-11-05",
              displayDate: "5 de Noviembre",
              priceFrom: 3000,
              currency: "USD",
            }),
          ],
        }),
        listing({
          slug: "barato",
          name: "Barato",
          departures: [
            departure({
              date: "2026-11-05",
              displayDate: "5 de Noviembre",
              priceFrom: 100,
              currency: "USD",
            }),
          ],
        }),
      ],
      TODAY,
    );
    const mixed = describeClusterListings(
      [
        listing({
          slug: "pesos",
          name: "Pesos",
          currency: "ARS",
          departures: [
            departure({
              date: "2026-11-05",
              displayDate: "5 de Noviembre",
              priceFrom: 9_000_000,
              currency: "ARS",
            }),
          ],
        }),
        listing({
          slug: "dolares",
          name: "Dolares",
          departures: [
            departure({
              date: "2026-11-05",
              displayDate: "5 de Noviembre",
              priceFrom: 10,
              currency: "USD",
            }),
          ],
        }),
      ],
      TODAY,
    );
    assert.equal(sameCurrency, "Brasil: Caro, salida 5 de Noviembre, desde USD 3.000.");
    assert.equal(mixed, "Brasil: Pesos, salida 5 de Noviembre, desde $9.000.000.");
  });

  it("omits the country prefix when members disagree", () => {
    const text = describeClusterListings(
      [
        listing({
          slug: "cataratas",
          name: "Cataratas",
          country: "Argentina",
          departures: [departure({ priceFrom: 620000, currency: "ARS" })],
        }),
        listing({
          slug: "rio",
          name: "Río",
          country: "Brasil",
          departures: [
            departure({
              date: "2026-12-30",
              displayDate: "30 de Diciembre",
              priceFrom: 1719,
              currency: "USD",
            }),
          ],
        }),
      ],
      TODAY,
    );
    assert.equal(text, "Cataratas, salida 1 de Noviembre, desde $620.000.");
  });

  it("asks for departures when no member has an active date", () => {
    const shared = describeClusterListings(
      [
        listing({ slug: "a", name: "Uno", departures: [] }),
        listing({ slug: "b", name: "Dos", departures: [] }),
      ],
      TODAY,
    );
    const mixed = describeClusterListings(
      [
        listing({ slug: "a", name: "Uno", country: "Argentina", departures: [] }),
        listing({ slug: "b", name: "Dos", country: "Brasil", departures: [] }),
      ],
      TODAY,
    );
    assert.equal(shared, "Paquetes a Brasil. Consultá salidas y precio.");
    assert.equal(mixed, "Paquetes. Consultá salidas y precio.");
  });
});
