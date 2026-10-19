/**
 * Closed chat openers for the conversion audit.
 * Callers pass a recipe. The tag string is compiled here.
 */
import type { ClusterId } from "@/lib/clusters-data";
import { AGENCY_PHONE, whatsappLink } from "@/lib/constants";

export type WaRecipe =
  | { id: "home-hero" }
  | { id: "home-grid" }
  | { id: "footer" }
  | {
      id: "home-card";
      destinationName: string;
      displayDate: string;
      /** Chat clause. Copied, not parsed. */
      priceClause: string;
    }
  | {
      id: "ficha";
      destinationName: string;
      displayDate: string | null;
    }
  | {
      id: "detail-date";
      destinationName: string;
      displayDate: string;
      program: string | null;
    }
  | { id: "detail-bespoke"; destinationName: string }
  | { id: "cluster"; clusterId: ClusterId }
  | { id: "quote-bypass" };

type WebTag =
  | { kind: "inicio" }
  | { kind: "inicio-grilla" }
  | { kind: "inicio-departure"; destination: string }
  | { kind: "pie" }
  | { kind: "ficha"; destination: string }
  | { kind: "detalle-destino" }
  | { kind: "cluster"; clusterId: ClusterId }
  | { kind: "cotizador-directo" };

const CLUSTER_LABEL = {
  brasil: "Brasil",
  caribe: "Caribe",
  "argentina-bus": "Argentina Bus",
  "salidas-grupales": "Salidas Grupales",
} as const satisfies Record<ClusterId, string>;

const CLUSTER_BODY = {
  brasil: "Hola 787 Rumbos! Quiero consultar por un viaje a Brasil desde Córdoba.",
  caribe: "Hola 787 Rumbos! Quiero consultar por un viaje al Caribe desde Córdoba.",
  "argentina-bus": "Hola 787 Rumbos! Quiero consultar por un viaje en bus desde Córdoba.",
  "salidas-grupales":
    "Hola 787 Rumbos! Quiero ver las próximas salidas grupales desde Córdoba.",
} as const satisfies Record<ClusterId, string>;

const GENERAL_BODY = "Hola 787 Rumbos! Quería hacer una consulta general...";

function renderTag(tag: WebTag): string {
  switch (tag.kind) {
    case "inicio":
      return "(Web - Inicio)";
    case "inicio-grilla":
      return "(Web - Inicio grilla)";
    case "inicio-departure":
      return `(Web - Inicio ${tag.destination})`;
    case "pie":
      return "(Web - Pie)";
    case "ficha":
      return `(Web - Ficha ${tag.destination})`;
    case "detalle-destino":
      return "(Web - Detalle Destino)";
    case "cluster":
      return `(Web - Cluster ${CLUSTER_LABEL[tag.clusterId]})`;
    case "cotizador-directo":
      return "(Web - Cotizador Directo)";
  }
}

function withTag(body: string, tag: WebTag): string {
  return `${body} ${renderTag(tag)}`;
}

function present(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function requireName(name: string): string {
  const trimmed = present(name);
  if (!trimmed) throw new Error("destination name is empty");
  return trimmed;
}

/**
 * First segment before " de ", otherwise the first word.
 * Porto de Galinhas → Porto. Cataratas del Iguazú → Cataratas.
 */
export function destinationShortName(name: string): string {
  const trimmed = name.trim();
  const [beforeDe, ...rest] = trimmed.split(/\s+de\s+/i);
  if (rest.length > 0 && beforeDe) return beforeDe;
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function messageFor(recipe: WaRecipe): string {
  switch (recipe.id) {
    case "home-hero":
      return withTag(GENERAL_BODY, { kind: "inicio" });
    case "home-grid":
      return withTag(GENERAL_BODY, { kind: "inicio-grilla" });
    case "footer":
      return withTag(GENERAL_BODY, { kind: "pie" });
    case "home-card": {
      const name = requireName(recipe.destinationName);
      const date = present(recipe.displayDate);
      const priceClause = present(recipe.priceClause);
      if (!date) throw new Error("home-card date is empty");
      if (!priceClause) throw new Error("home-card price clause is empty");
      return withTag(
        `Hola, vi ${name} en la web. Salida del ${date}, ${priceClause}.`,
        { kind: "inicio-departure", destination: destinationShortName(name) },
      );
    }
    case "ficha": {
      const name = requireName(recipe.destinationName);
      const date = present(recipe.displayDate);
      const body = date
        ? `Hola, vi ${name} en la web y quiero consultar por la salida del ${date}`
        : `Hola, vi ${name} en la web y quiero consultar fechas`;
      return withTag(body, { kind: "ficha", destination: destinationShortName(name) });
    }
    case "detail-date": {
      const name = requireName(recipe.destinationName);
      const date = present(recipe.displayDate);
      if (!date) throw new Error("detail-date date is empty");
      const program = present(recipe.program);
      const programSuffix = program ? ` (${program})` : "";
      return withTag(
        `Hola, quiero consultar disponibilidad para la salida a ${name} del ${date}${programSuffix}.`,
        { kind: "detalle-destino" },
      );
    }
    case "detail-bespoke": {
      const name = requireName(recipe.destinationName);
      return withTag(
        `Hola, quiero consultar para armar un viaje a medida a ${name}.`,
        { kind: "detalle-destino" },
      );
    }
    case "cluster":
      return withTag(CLUSTER_BODY[recipe.clusterId], {
        kind: "cluster",
        clusterId: recipe.clusterId,
      });
    case "quote-bypass":
      return withTag(
        "Hola 787 Rumbos! Quería consultar directamente con un asesor...",
        { kind: "cotizador-directo" },
      );
  }
}

/** Agency WhatsApp URL for one recipe. Same recipe, same string. */
export function waHref(recipe: WaRecipe): string {
  return whatsappLink(AGENCY_PHONE.whatsapp, messageFor(recipe));
}
