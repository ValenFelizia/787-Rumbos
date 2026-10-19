import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ClusterId } from "./clusters-data";
import { AGENCY_PHONE } from "./constants";
import { formatHomeCardPriceClause, readHomeDeparture } from "./catalog/logic";
import { destinationsData } from "../scripts/seed-data/destinations";
import { destinationShortName, waHref, type WaRecipe } from "./wa-recipe";

function textOf(recipe: WaRecipe): string {
  const url = waHref(recipe);
  const parsed = new URL(url);
  assert.equal(parsed.origin + parsed.pathname, "https://api.whatsapp.com/send");
  assert.equal(parsed.searchParams.get("phone"), AGENCY_PHONE.whatsapp);
  const text = parsed.searchParams.get("text");
  assert.ok(text);
  return text;
}

describe("destinationShortName", () => {
  it("keeps the first segment before de, otherwise the first word", () => {
    assert.equal(destinationShortName("Porto de Galinhas"), "Porto");
    assert.equal(destinationShortName("Salvador de Bahía"), "Salvador");
    assert.equal(destinationShortName("Cataratas del Iguazú"), "Cataratas");
    assert.equal(destinationShortName("Imbassaí"), "Imbassaí");
    assert.equal(destinationShortName("  porto DE galinhas "), "porto");
  });
});

describe("waHref", () => {
  it("tags the general chats by surface", () => {
    assert.equal(
      textOf({ id: "home-hero" }),
      "Hola 787 Rumbos! Quería hacer una consulta general... (Web - Inicio)",
    );
    assert.equal(
      textOf({ id: "home-grid" }),
      "Hola 787 Rumbos! Quería hacer una consulta general... (Web - Inicio grilla)",
    );
    assert.equal(
      textOf({ id: "footer" }),
      "Hola 787 Rumbos! Quería hacer una consulta general... (Web - Pie)",
    );
    assert.equal(
      textOf({ id: "quote-bypass" }),
      "Hola 787 Rumbos! Quería consultar directamente con un asesor... (Web - Cotizador Directo)",
    );
  });

  it("copies the home-card clause and shortens the tag", () => {
    assert.equal(
      textOf({
        id: "home-card",
        destinationName: " Porto de Galinhas ",
        displayDate: " 8 de Enero ",
        priceClause: " desde USD 1.545 ",
      }),
      "Hola, vi Porto de Galinhas en la web. Salida del 8 de Enero, desde USD 1.545. (Web - Inicio Porto)",
    );
    assert.equal(
      textOf({
        id: "home-card",
        destinationName: "Cataratas del Iguazú",
        displayDate: "18 de Noviembre",
        priceClause: "precio a consultar",
      }),
      "Hola, vi Cataratas del Iguazú en la web. Salida del 18 de Noviembre, precio a consultar. (Web - Inicio Cataratas)",
    );
    assert.equal(
      textOf({
        id: "home-card",
        destinationName: "Imbassaí",
        displayDate: "2 de Enero",
        priceClause: "desde $620.000",
      }),
      "Hola, vi Imbassaí en la web. Salida del 2 de Enero, desde $620.000. (Web - Inicio Imbassaí)",
    );
  });

  it("builds the Salvador home card from the departure the card shows", () => {
    const salvador = destinationsData.find((dest) => dest.slug === "salvador-de-bahia");
    assert.ok(salvador);
    const view = readHomeDeparture(salvador, new Date(2026, 9, 18));
    assert.ok(view);
    assert.equal(
      textOf({
        id: "home-card",
        destinationName: salvador.name,
        displayDate: view.displayDate,
        priceClause: formatHomeCardPriceClause(view.price),
      }),
      "Hola, vi Salvador de Bahía en la web. Salida del 26 de Diciembre, desde USD 1.545. (Web - Inicio Salvador)",
    );
  });

  it("tags the ficha with the short name and drops a blank date", () => {
    assert.equal(
      textOf({
        id: "ficha",
        destinationName: "Salvador de Bahía",
        displayDate: "26 de Diciembre",
      }),
      "Hola, vi Salvador de Bahía en la web y quiero consultar por la salida del 26 de Diciembre (Web - Ficha Salvador)",
    );
    assert.equal(
      textOf({ id: "ficha", destinationName: "Cancún", displayDate: "   " }),
      "Hola, vi Cancún en la web y quiero consultar fechas (Web - Ficha Cancún)",
    );
  });

  it("keeps the detail sentences and omits a blank program", () => {
    assert.equal(
      textOf({
        id: "detail-date",
        destinationName: "Salvador de Bahía",
        displayDate: "26 de Diciembre",
        program: "Vila Galé Salvador",
      }),
      "Hola, quiero consultar disponibilidad para la salida a Salvador de Bahía del 26 de Diciembre (Vila Galé Salvador). (Web - Detalle Destino)",
    );
    assert.equal(
      textOf({
        id: "detail-date",
        destinationName: "Salvador de Bahía",
        displayDate: "26 de Diciembre",
        program: "  ",
      }),
      "Hola, quiero consultar disponibilidad para la salida a Salvador de Bahía del 26 de Diciembre. (Web - Detalle Destino)",
    );
    assert.equal(
      textOf({ id: "detail-bespoke", destinationName: "Imbassaí" }),
      "Hola, quiero consultar para armar un viaje a medida a Imbassaí. (Web - Detalle Destino)",
    );
  });

  it("keeps each cluster sentence byte for byte", () => {
    const expected: Record<ClusterId, string> = {
      brasil:
        "Hola 787 Rumbos! Quiero consultar por un viaje a Brasil desde Córdoba. (Web - Cluster Brasil)",
      caribe:
        "Hola 787 Rumbos! Quiero consultar por un viaje al Caribe desde Córdoba. (Web - Cluster Caribe)",
      "argentina-bus":
        "Hola 787 Rumbos! Quiero consultar por un viaje en bus desde Córdoba. (Web - Cluster Argentina Bus)",
      "salidas-grupales":
        "Hola 787 Rumbos! Quiero ver las próximas salidas grupales desde Córdoba. (Web - Cluster Salidas Grupales)",
    };
    const ids: Record<ClusterId, true> = {
      brasil: true,
      caribe: true,
      "argentina-bus": true,
      "salidas-grupales": true,
    };
    for (const clusterId of Object.keys(ids) as ClusterId[]) {
      assert.equal(textOf({ id: "cluster", clusterId }), expected[clusterId]);
    }
  });

  it("returns the same url for the same recipe", () => {
    const recipe: WaRecipe = { id: "footer" };
    assert.equal(waHref(recipe), waHref(recipe));
  });

  it("rejects an empty destination, date, or price clause", () => {
    assert.throws(() =>
      waHref({
        id: "home-card",
        destinationName: "  ",
        displayDate: "8 de Enero",
        priceClause: "desde USD 1.545",
      }),
    );
    assert.throws(() =>
      waHref({
        id: "home-card",
        destinationName: "Porto de Galinhas",
        displayDate: " ",
        priceClause: "desde USD 1.545",
      }),
    );
    assert.throws(() =>
      waHref({
        id: "home-card",
        destinationName: "Porto de Galinhas",
        displayDate: "8 de Enero",
        priceClause: " ",
      }),
    );
    assert.throws(() =>
      waHref({ id: "ficha", destinationName: "", displayDate: null }),
    );
    assert.throws(() =>
      waHref({ id: "detail-bespoke", destinationName: "   " }),
    );
  });
});
