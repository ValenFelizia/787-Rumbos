import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getClusterMateSlugs } from "@/lib/clusters-data";
import { groupDestinationsForSort } from "./logic";
import { getRelatedDestinations } from "./related";
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

describe("getClusterMateSlugs", () => {
  it("returns fixed-cluster peers from clusters-data (Brasil hub)", () => {
    const mates = getClusterMateSlugs("rio-de-janeiro");
    assert.ok(mates.includes("porto-de-galinhas"));
    assert.ok(mates.includes("camboriu"));
    assert.ok(mates.includes("salvador-de-bahia"));
    assert.ok(!mates.includes("rio-de-janeiro"));
    assert.ok(!mates.includes("cancun"));
  });

  it("returns Caribe peers and empty for unknown slugs", () => {
    assert.deepEqual(
      getClusterMateSlugs("cancun").sort(),
      ["bayahibe", "playa-del-carmen", "punta-cana", "riviera-maya"].sort(),
    );
    assert.deepEqual(getClusterMateSlugs("destino-inexistente"), []);
  });
});

describe("getRelatedDestinations (cluster membership)", () => {
  const salta = destination({
    slug: "salta",
    name: "Salta",
    region: "nacional",
    country: "Argentina",
  });
  const mendoza = destination({
    slug: "mendoza",
    name: "Mendoza",
    region: "nacional",
    country: "Argentina",
  });
  const termas = destination({
    slug: "termas-rio-hondo",
    name: "Termas de Río Hondo",
    region: "nacional",
    country: "Argentina",
  });
  const cataratas = destination({
    slug: "cataratas-del-iguazu",
    name: "Cataratas del Iguazú",
    region: "nacional",
    country: "Argentina",
  });
  const salar = destination({
    slug: "salar-de-uyuni",
    name: "Salar de Uyuni",
    region: "internacional",
    country: "Bolivia",
  });
  const cancún = destination({
    slug: "cancun",
    name: "Cancún",
    region: "internacional",
    country: "México",
  });

  // Prod-like Brasil block (sortOrder ≈ catalog index):
  // rio 10, porto 11, camboriu 12, …, f1 16, salvador 17, imbassai 18,
  // guarajuba 19, praia-do-forte 20. Gaps = non-Brasil destinations.
  const brasilPad = Array.from({ length: 10 }, (_, i) =>
    destination({
      slug: `pad-${i}`,
      name: `Pad ${i}`,
      region: "nacional",
      country: "Argentina",
    }),
  );
  const rio = destination({
    slug: "rio-de-janeiro",
    name: "Río de Janeiro",
    region: "internacional",
    country: "Brasil",
  });
  const porto = destination({
    slug: "porto-de-galinhas",
    name: "Porto de Galinhas",
    region: "internacional",
    country: "Brasil",
  });
  const camboriu = destination({
    slug: "camboriu",
    name: "Camboriú",
    region: "internacional",
    country: "Brasil",
  });
  const gap13 = destination({
    slug: "peru",
    name: "Perú",
    region: "internacional",
    country: "Perú",
  });
  const gap14 = destination({
    slug: "sudeste-asiatico",
    name: "Sudeste Asiático",
    region: "internacional",
    country: "Asia",
  });
  const gap15 = destination({
    slug: "salar-gap",
    name: "Salar gap",
    region: "internacional",
    country: "Bolivia",
  });
  const f1 = destination({
    slug: "f1-grand-premio-sao-paulo",
    name: "F1 Grand Premio de São Paulo",
    region: "internacional",
    country: "Brasil",
  });
  const salvador = destination({
    slug: "salvador-de-bahia",
    name: "Salvador de Bahía",
    region: "internacional",
    country: "Brasil",
  });
  const imbassai = destination({
    slug: "imbassai",
    name: "Imbassaí",
    region: "internacional",
    country: "Brasil",
  });
  const guarajuba = destination({
    slug: "guarajuba",
    name: "Guarajuba",
    region: "internacional",
    country: "Brasil",
  });
  const praiaDoForte = destination({
    slug: "praia-do-forte",
    name: "Praia do Forte",
    region: "internacional",
    country: "Brasil",
  });

  const brasilCatalog = [
    ...brasilPad,
    rio, // 10
    porto, // 11
    camboriu, // 12
    gap13, // 13
    gap14, // 14
    gap15, // 15
    f1, // 16
    salvador, // 17
    imbassai, // 18
    guarajuba, // 19
    praiaDoForte, // 20
  ];

  const catalog = [salta, mendoza, termas, cataratas, salar, cancún];

  it("ranks Brasil mates by nearest sortOrder: rio → porto, camboriu, f1", () => {
    const related = getRelatedDestinations(brasilCatalog, "rio-de-janeiro", 3);
    // Distances from rio@10: porto 1, camboriu 2, f1 6 (next mate).
    assert.deepEqual(
      related.map((d) => d.slug),
      ["porto-de-galinhas", "camboriu", "f1-grand-premio-sao-paulo"],
    );
  });

  it("ranks Brasil mates by nearest sortOrder: salvador → local peers not rio/porto", () => {
    const related = getRelatedDestinations(brasilCatalog, "salvador-de-bahia", 3);
    // Distances from salvador@17: f1 1, imbassai 1, guarajuba 2, praia 3, camboriu 5…
    // Distance-1 tie → higher catalog index (imbassai@18 over f1@16).
    // Documented order: imbassai, f1, guarajuba (praia@20 loses to closer f1).
    // Regression: must NOT be rio / porto / camboriu (far south/southeast).
    assert.deepEqual(
      related.map((d) => d.slug),
      ["imbassai", "f1-grand-premio-sao-paulo", "guarajuba"],
    );
  });

  it("uses argentina-bus cluster mates for Termas", () => {
    const related = getRelatedDestinations(catalog, "termas-rio-hondo", 2);
    assert.deepEqual(
      related.map((d) => d.slug),
      ["cataratas-del-iguazu", "salar-de-uyuni"],
    );
  });

  it("falls back to same region by nearest catalog order without cluster peers", () => {
    // Mendoza is not in any fixed cluster destinationSlugs.
    // salta@0 and termas@2 are both distance 1; higher index wins → termas first.
    const related = getRelatedDestinations(catalog, "mendoza", 2);
    assert.deepEqual(
      related.map((d) => d.slug),
      ["termas-rio-hondo", "salta"],
    );
  });
});

describe("Destacados order without pin", () => {
  it("keeps Payload catalog order; does not move any slug to the front", () => {
    const salta = destination({ slug: "salta", name: "Salta", region: "nacional" });
    const mendoza = destination({ slug: "mendoza", name: "Mendoza", region: "nacional" });
    const f1 = destination({
      slug: "evento-especial",
      name: "Evento especial",
      region: "internacional",
      country: "Brasil",
      currency: "USD",
      priceFrom: 2770,
      departures: [departure({ priceFrom: 2770, currency: "USD" })],
    });
    // Catalog as returned by repository (sortOrder ASC): Salta=0 … evento late.
    const catalog = [salta, mendoza, f1];
    const groups = groupDestinationsForSort(catalog, "featured", { today });
    assert.deepEqual(
      groups[0].items.map((d) => d.slug),
      ["salta", "mendoza", "evento-especial"],
    );
  });
});
