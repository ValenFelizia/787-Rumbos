import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DepartureListing } from "@/lib/catalog/listing";
import { getClusterBySlug, getClusterDestinations } from "@/lib/clusters-data";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { destinationsData } from "../../scripts/seed-data/destinations";
import {
  describeClusterListings,
  describeDestinationListing,
  META_DESCRIPTION_MAX,
  type OfferDescriptionInput,
} from "./offer-description";

const TODAY = new Date(2026, 9, 21);

const PORTO =
  "Paquete a Porto de Galinhas, salida 8 de Enero, desde USD 1.670. Paquete con aéreo, hotel y traslados.";
const RIO =
  "Paquete a Río de Janeiro, salida 30 de Diciembre, desde USD 1.719. Paquete con aéreo, hotel y traslados.";
const CATARATAS =
  "Paquete a Cataratas del Iguazú, salida 18 de Noviembre, desde $620.000. Paquete con hotel y traslados.";
const BRASIL =
  "Paquetes a Brasil: Porto, Camboriú, Salvador. Próxima salida 26 de Diciembre, desde USD 1.545. Paquete con aéreo, hotel y traslados.";

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

function listing(overrides: Partial<OfferDescriptionInput> = {}): OfferDescriptionInput {
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
      assert.ok(text.length >= 100 && text.length <= META_DESCRIPTION_MAX);
      assert.equal(META_DESCRIPTION_MAX, 155);
      assert.match(text, /^Paquete a /);
      assert.doesNotMatch(text, /desde córdoba/i);
      assert.doesNotMatch(text, /ezeiza/i);
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
    assert.equal(text, "Paquete a Río de Janeiro, salida 1 de Noviembre. Consultá precio. 7 noches con aéreo.");
    assert.match(text, /^Paquete a /);
    assert.doesNotMatch(text, /1719|980/);
    assert.doesNotMatch(text, /desde córdoba/i);
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
    assert.equal(text, "Paquete a Cerca, salida 1 de Noviembre, desde USD 2.000. 7 noches con aéreo.");
  });

  it("prints final for a closed fare", () => {
    const text = describeDestinationListing(
      listing({
        name: "Cerrado",
        departures: [departure({ priceFrom: 850, currency: "USD", priceIsFinal: true })],
      }),
      TODAY,
    );
    assert.equal(text, "Paquete a Cerrado, salida 1 de Noviembre, final USD 850. 7 noches con aéreo.");
    assert.doesNotMatch(text, /desde/);
  });

  it("asks for departures and a price when the listing has no departure", () => {
    const text = describeDestinationListing(
      listing({ name: "Camboriú", priceFrom: 599, departures: [] }),
      TODAY,
    );
    assert.equal(text, "Paquete a Camboriú. Consultá salidas y precio.");
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
      assert.equal(text, "Paquete a Playa, salida 1 de Noviembre. Consultá precio. 7 noches con aéreo.");
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
    assert.equal(bariloche, "Paquete a Mendoza, salida 1 de Noviembre, desde USD 100. 7 noches con aéreo.");
    assert.equal(andes, "Paquete a Mendoza, salida 1 de Noviembre, desde USD 100. 7 noches con aéreo.");
    assert.doesNotMatch(andes, /desde córdoba|andes|ezeiza/i);
    assert.doesNotMatch(bariloche, /bariloche/i);
  });

  it("keeps All Inclusive from the quoted row and drops a wholesaler phrase in that note", () => {
    const text = describeDestinationListing(
      listing({
        name: "Cancún",
        departures: [
          departure({
            note: "Vía Bariloche. All Inclusive",
            priceFrom: 100,
            currency: "USD",
          }),
        ],
      }),
      TODAY,
    );
    assert.equal(text, "Paquete a Cancún, salida 1 de Noviembre, desde USD 100. 7 noches All Inclusive.");
    assert.doesNotMatch(text, /bariloche/i);
  });

  it("prefers All Inclusive over the package nouns when inclusions say both", () => {
    const text = describeDestinationListing(
      listing({
        name: "Cancún",
        typicalInclusions: ["Aéreo desde Córdoba", "Hotel All Inclusive", "Traslados"],
        departures: [departure({ priceFrom: 1850, currency: "USD" })],
      }),
      TODAY,
    );
    assert.equal(
      text,
      "Paquete a Cancún, salida 1 de Noviembre, desde USD 1.850. 7 noches All Inclusive.",
    );
    assert.doesNotMatch(text, /Paquete con|córdoba/i);
  });

  it("reads All Inclusive from the hotel row the price quotes, not from a same-day solo aéreo", () => {
    const ignored = describeDestinationListing(
      listing({
        name: "Salvador",
        departures: [
          departure({
            priceFrom: 850,
            currency: "USD",
            stayLabel: "Sin hotel",
            priceIsFinal: true,
            note: "All Inclusive solo",
          }),
          departure({
            priceFrom: 1284,
            currency: "USD",
            note: "8 noches con desayuno",
          }),
        ],
      }),
      TODAY,
    );
    assert.equal(
      ignored,
      "Paquete a Salvador, salida 1 de Noviembre, desde USD 1.284. 7 noches con aéreo.",
    );
    assert.doesNotMatch(ignored, /All Inclusive|final/);

    const quoted = describeDestinationListing(
      listing({
        name: "Salvador",
        departures: [
          departure({
            priceFrom: 850,
            currency: "USD",
            stayLabel: "Sin hotel",
            priceIsFinal: true,
            note: "Solo aéreo",
          }),
          {
            ...departure({
              priceFrom: 1284,
              currency: "USD",
              note: "8 noches con desayuno",
            }),
            program: "Grand Palladium All Inclusive",
          },
        ],
      }),
      TODAY,
    );
    assert.equal(
      quoted,
      "Paquete a Salvador, salida 1 de Noviembre, desde USD 1.284. 7 noches All Inclusive.",
    );
  });

  it("names evidenced package nouns and falls back to nights when inclusions do not", () => {
    const partial = describeDestinationListing(
      listing({
        typicalInclusions: ["Traslados in/out"],
        departures: [departure({ priceFrom: 100, currency: "USD" })],
      }),
      TODAY,
    );
    const nightsOnly = describeDestinationListing(
      listing({
        name: "Termas",
        departures: [
          departure({ transport: "bus", nights: 4, priceFrom: 100, currency: "USD" }),
        ],
      }),
      TODAY,
    );
    assert.equal(
      partial,
      "Paquete a Playa, salida 1 de Noviembre, desde USD 100. Paquete con aéreo y traslados.",
    );
    assert.equal(nightsOnly, "Paquete a Termas, salida 1 de Noviembre, desde USD 100. 4 noches.");
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
    assert.equal(named, "Paquete a Este destino. Consultá salidas y precio.");
    assert.equal(wholesaler, "Paquete a Este destino. Consultá salidas y precio.");
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
    assert.equal(text, "Paquete a Playa, salida 5 de Noviembre, desde USD 100. 7 noches con aéreo.");
    assert.doesNotMatch(text, /tac/i);
  });

  it("drops the intent tail before it drops the price", () => {
    const name = playas(16);
    const text = describeDestinationListing(
      listing({
        name,
        departures: [departure({ priceFrom: 10_000_000, currency: "USD" })],
      }),
      TODAY,
    );
    assert.equal(text, `Paquete a ${name}, salida 1 de Noviembre, desde USD 10.000.000.`);
    assert.equal(text.includes("noches"), false);
    assert.ok(text.length <= META_DESCRIPTION_MAX);
  });

  it("drops a long money token whole and keeps the date", () => {
    const name = playas(17);
    const text = describeDestinationListing(
      listing({
        name,
        departures: [departure({ priceFrom: 10_000_000, currency: "USD" })],
      }),
      TODAY,
    );
    assert.equal(text, `Paquete a ${name}, salida 1 de Noviembre. Consultá precio.`);
    assert.equal(text.length <= META_DESCRIPTION_MAX, true);
    assert.equal(text.includes("USD 10.000.000"), false);
    assert.equal(text.includes("10.000.000"), false);
  });

  it("drops the date when the dated sentence still exceeds 155", () => {
    const name = playas(18);
    const text = describeDestinationListing(
      listing({
        name,
        departures: [departure({ priceFrom: 10_000_000, currency: "USD" })],
      }),
      TODAY,
    );
    assert.equal(text, `Paquete a ${name}. Consultá salidas y precio.`);
    assert.equal(text.includes("Noviembre"), false);
    assert.equal(text.includes("USD"), false);
    assert.ok(text.length <= META_DESCRIPTION_MAX);
  });

  it("cuts on a word boundary with no ellipsis", () => {
    const name = playas(22);
    const full = `Paquete a ${name}. Consultá salidas y precio.`;
    const text = describeDestinationListing(
      listing({
        name,
        departures: [departure({ priceFrom: 1670, currency: "USD" })],
      }),
      TODAY,
    );
    assert.equal(
      text,
      "Paquete a Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa Playa. Consultá",
    );
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
  it("quotes the earliest priced beach and the three leads that include it", () => {
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
    assert.ok(text.length >= 120 && text.length <= META_DESCRIPTION_MAX);
    assert.doesNotMatch(text, /f1|grand premio|fórmula|formula|são paulo|sao paulo/i);
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

  it("lists beaches and skips event packages when nothing else is priced", () => {
    const text = describeClusterListings(
      [
        listing({
          slug: "f1-grand-premio-sao-paulo",
          name: "F1 Grand Premio de São Paulo",
          departures: [
            departure({
              date: "2026-11-05",
              displayDate: "5 de Noviembre",
              priceFrom: 2770,
              currency: "USD",
            }),
          ],
        }),
        listing({
          slug: "rio-de-janeiro",
          name: "Río de Janeiro",
          departures: [departure()],
        }),
        listing({
          slug: "formula-1-extra",
          name: "Fórmula 1",
          departures: [departure({ priceFrom: 10, currency: "USD" })],
        }),
        listing({
          slug: "porto-de-galinhas",
          name: "Porto de Galinhas",
          departures: [],
        }),
        listing({
          slug: "monaco-gp",
          name: "Grand Premio de Mónaco",
          departures: [departure({ priceFrom: 20, currency: "USD" })],
        }),
        listing({
          slug: "camboriu",
          name: "Camboriú",
          priceFrom: 599,
          departures: [],
        }),
      ],
      TODAY,
    );
    assert.equal(text, "Paquetes a Brasil: Río, Porto, Camboriú. Consultá salidas y precio.");
    assert.doesNotMatch(text, /f1|grand premio|fórmula|formula|são paulo|2770|599|USD|\$/i);
  });

  it("keeps a short head and does not strip do", () => {
    const text = describeClusterListings(
      [
        listing({
          slug: "fe-de-mar",
          name: "Fe de Mar",
          departures: [
            departure({
              date: "2026-11-05",
              displayDate: "5 de Noviembre",
              priceFrom: 10,
              currency: "USD",
            }),
          ],
        }),
        listing({
          slug: "praia-do-forte",
          name: "Praia do Forte",
          departures: [
            departure({
              date: "2026-12-01",
              displayDate: "1 de Diciembre",
              priceFrom: 20,
              currency: "USD",
            }),
          ],
        }),
      ],
      TODAY,
    );
    assert.equal(
      text,
      "Paquetes a Brasil: Fe de Mar, Praia do Forte. Próxima salida 5 de Noviembre, desde USD 10. 7 noches con aéreo.",
    );
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
    assert.equal(
      text,
      "Paquetes a Brasil: Temprano, Tarde. Próxima salida 1 de Diciembre, desde USD 500. 7 noches con aéreo.",
    );
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
    assert.equal(
      sameCurrency,
      "Paquetes a Brasil: Caro, Barato. Próxima salida 5 de Noviembre, desde USD 3.000. 7 noches con aéreo.",
    );
    assert.equal(
      mixed,
      "Paquetes a Brasil: Pesos, Dolares. Próxima salida 5 de Noviembre, desde $9.000.000. 7 noches con aéreo.",
    );
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
    assert.equal(
      text,
      "Paquetes: Cataratas, Río. Próxima salida 1 de Noviembre, desde $620.000. 7 noches con aéreo.",
    );
    assert.doesNotMatch(text, /Argentina|Brasil/);
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
    assert.equal(shared, "Paquetes a Brasil: Uno, Dos. Consultá salidas y precio.");
    assert.equal(mixed, "Paquetes: Uno, Dos. Consultá salidas y precio.");
  });

  it("drops the intent tail before it drops the hub price", () => {
    const beach = "B".repeat(22);
    const text = describeClusterListings(
      [
        listing({
          slug: "a",
          name: beach,
          departures: [departure({ priceFrom: 100, currency: "USD" })],
        }),
        listing({
          slug: "b",
          name: beach,
          departures: [departure({ priceFrom: 100, currency: "USD" })],
        }),
        listing({
          slug: "c",
          name: beach,
          departures: [departure({ priceFrom: 100, currency: "USD" })],
        }),
      ],
      TODAY,
    );
    assert.equal(
      text,
      `Paquetes a Brasil: ${beach}, ${beach}, ${beach}. Próxima salida 1 de Noviembre, desde USD 100.`,
    );
    assert.equal(text.includes("noches"), false);
    assert.ok(text.length <= META_DESCRIPTION_MAX);
  });
});
