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
  const cancún = destination({
    slug: "cancun",
    name: "Cancún",
    region: "internacional",
    country: "México",
  });

  // Catalog order ≈ Payload sortOrder (Salta first, F1 would be later — not pinned).
  const catalog = [
    salta,
    mendoza,
    termas,
    cataratas,
    salar,
    rio,
    porto,
    camboriu,
    cancún,
  ];

  it("prefers cluster mates over same-region strangers", () => {
    const related = getRelatedDestinations(catalog, "rio-de-janeiro", 3);
    // Mates in catalog order: porto, camboriu; then fill from same region (nearest).
    assert.deepEqual(
      related.map((d) => d.slug),
      ["porto-de-galinhas", "camboriu", "salar-de-uyuni"],
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
    const related = getRelatedDestinations(catalog, "mendoza", 2);
    assert.deepEqual(
      related.map((d) => d.slug),
      ["salta", "termas-rio-hondo"],
    );
  });

  it("orders Brasil cluster mates by catalog sortOrder (not a duplicate mate array)", () => {
    const bahia = destination({
      slug: "salvador-de-bahia",
      name: "Salvador",
      region: "internacional",
      country: "Brasil",
    });
    const withBahia = [...catalog, bahia];
    const related = getRelatedDestinations(withBahia, "salvador-de-bahia", 3);
    assert.deepEqual(
      related.map((d) => d.slug),
      ["rio-de-janeiro", "porto-de-galinhas", "camboriu"],
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
