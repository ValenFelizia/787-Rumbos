/**
 * lib/clusters-data.ts
 *
 * Hubs SEO de categoría ("desde Córdoba"). Listan solo destinos reales
 * del catálogo — sin copy genérico de guía turística.
 */
import { getActiveUpcomingDepartures } from "@/lib/catalog/logic";
import type { DestinationPage } from "@/lib/catalog/types";

export type ClusterId = "brasil" | "caribe" | "argentina-bus" | "salidas-grupales";

export interface ClusterPage {
  id: ClusterId;
  slug: string;
  title: string;
  /** Título corto para cards en `/destinos` (QOL-03). */
  shortTitle: string;
  /** Una línea de apoyo bajo el título corto. */
  cardLine: string;
  /** Imagen de la card en el listado (assets locales; no Payload aún — D8). */
  cardImage: string;
  cardImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  /** Intro corta (~150–200 palabras máx. en total con bullets). */
  intro: string;
  howWeWork: string[];
  ctaLabel: string;
  whatsappText: string;
  /** Slugs fijos; si vacío, se resuelve dinámicamente (salidas grupales). */
  destinationSlugs?: string[];
}

export const clustersData: ClusterPage[] = [
  {
    id: "brasil",
    slug: "brasil-desde-cordoba",
    title: "Paquetes a Brasil desde Córdoba",
    shortTitle: "Brasil desde Córdoba",
    cardLine: "Río, playa y eventos · a medida o grupales",
    cardImage: "/destinos/rio.jpg",
    cardImageAlt: "Río de Janeiro — paquetes a Brasil desde Córdoba",
    metaTitle: "Paquetes a Brasil desde Córdoba | 787 Rumbos",
    metaDescription:
      "Río, Porto de Galinhas, Camboriú y Bahía desde Córdoba. Paquetes a medida o grupales. Cotizá tu viaje por WhatsApp con atención humana.",
    intro:
      "Armamos paquetes a Brasil desde Córdoba: playa, ciudad o eventos. Cotizás por WhatsApp con una persona real y te enviamos opciones claras según fechas y presupuesto.",
    howWeWork: [
      "Salidas grupales cuando hay cupos, o paquete 100% a tu medida.",
      "Aéreo, hotel y asistencia internacional. El plan y la ciudad de salida figuran en cada ficha.",
      "También salidas en bus a balnearios como Camboriú, por convenio terrestre.",
      "Oficina en el Aeropuerto de Córdoba y seguimiento durante el viaje.",
    ],
    ctaLabel: "Cotizar Brasil por WhatsApp",
    whatsappText:
      "Hola 787 Rumbos! Quiero consultar por un viaje a Brasil desde Córdoba. (Web - Cluster Brasil)",
    destinationSlugs: [
      "rio-de-janeiro",
      "porto-de-galinhas",
      "camboriu",
      "f1-grand-premio-sao-paulo",
      "salvador-de-bahia",
      "imbassai",
      "guarajuba",
      "praia-do-forte",
    ],
  },
  {
    id: "caribe",
    slug: "caribe-desde-cordoba",
    title: "Caribe desde Córdoba",
    shortTitle: "Caribe desde Córdoba",
    cardLine: "All Inclusive · Cancún, Riviera Maya y RD",
    cardImage: "/destinos/cancun.jpg",
    cardImageAlt: "Cancún — paquetes al Caribe desde Córdoba",
    metaTitle: "Paquetes al Caribe desde Córdoba | 787 Rumbos",
    metaDescription:
      "Cancún, Riviera Maya, Punta Cana y Bayahibe. All Inclusive, traslados y asistencia. La ciudad de salida se confirma al consultar.",
    intro:
      "El Caribe mexicano es uno de los pedidos más fuertes: playa, All Inclusive y resorts familiares. Cuando hay cupos, también publicamos República Dominicana. Te armamos opciones claras con vuelos, hotel y asistencia.",
    howWeWork: [
      "Paquetes a medida o salidas cuando hay cupos publicados.",
      "All Inclusive, Family Plan y hoteles según tu estilo de viaje.",
      "Aéreo, traslados y asistencia incluidos en el cupo. La ciudad de salida se confirma al consultar.",
      "Oficina en el Aeropuerto de Córdoba para resolver dudas en persona.",
    ],
    ctaLabel: "Cotizar Caribe por WhatsApp",
    whatsappText:
      "Hola 787 Rumbos! Quiero consultar por un viaje al Caribe desde Córdoba. (Web - Cluster Caribe)",
    destinationSlugs: ["cancun", "playa-del-carmen", "riviera-maya", "punta-cana", "bayahibe"],
  },
  {
    id: "argentina-bus",
    slug: "argentina-en-bus-desde-cordoba",
    title: "Argentina en bus desde Córdoba",
    shortTitle: "Argentina en bus",
    cardLine: "Bus y bus cama · Termas, Cataratas y más",
    cardImage: "/destinos/cataratas.jpg",
    cardImageAlt: "Cataratas del Iguazú — salidas en bus desde Córdoba",
    metaTitle: "Viajes en bus por Argentina desde Córdoba | 787 Rumbos",
    metaDescription:
      "Salidas en bus y bus cama desde Córdoba: Termas, Cataratas, Salar y más. También boletería oficial de Vía Bariloche en el aeropuerto.",
    intro:
      "Si preferís tierra, armamos salidas bus desde Córdoba. Además, en el hall de arribos del aeropuerto somos boletería oficial de Vía Bariloche, Vía Tac y El Valle.",
    howWeWork: [
      "Salidas grupales o paquetes 100% a tu medida, coordinadas con hotel y asistencia nacional.",
      "Opción de pasaje de ómnibus suelto si solo necesitás el traslado.",
      "Asesoramiento humano para elegir fechas y régimen (pensión, desayuno, etc.).",
    ],
    ctaLabel: "Consultar viaje en bus",
    whatsappText:
      "Hola 787 Rumbos! Quiero consultar por un viaje en bus desde Córdoba. (Web - Cluster Argentina Bus)",
    destinationSlugs: [
      "termas-rio-hondo",
      "cataratas-del-iguazu",
      "salar-de-uyuni",
    ],
  },
  {
    id: "salidas-grupales",
    slug: "salidas-grupales-desde-cordoba",
    title: "Salidas grupales desde Córdoba",
    shortTitle: "Salidas grupales",
    cardLine: "Fechas confirmadas · cupos publicados",
    cardImage: "/rumbos/grupal.jpg",
    cardImageAlt: "Salidas grupales confirmadas desde Córdoba",
    metaTitle: "Salidas grupales confirmadas desde Córdoba | 787 Rumbos",
    metaDescription:
      "Próximas salidas grupales de 787 Rumbos desde Córdoba: fechas, cupos y destinos. Cotizá por WhatsApp con atención humana.",
    intro:
      "Acá reunimos las salidas con fecha y cupos publicados. Si no ves la tuya, igual armamos un viaje a medida para las fechas que elijas.",
    howWeWork: [
      "Fecha, noches y transporte ya definidos: viajás con el grupo.",
      "Cupos limitados: te confirmamos disponibilidad al instante por WhatsApp.",
      "Si la salida se agotó, te proponemos la siguiente o un paquete a medida.",
    ],
    ctaLabel: "Consultar salidas grupales",
    whatsappText:
      "Hola 787 Rumbos! Quiero ver las próximas salidas grupales desde Córdoba. (Web - Cluster Salidas Grupales)",
    // destinationSlugs omitido → se resuelve con salidas activas
  },
];

export function getClusterBySlug(slug: string): ClusterPage | undefined {
  return clustersData.find((c) => c.slug === slug);
}

export function getClusterById(id: ClusterId): ClusterPage | undefined {
  return clustersData.find((c) => c.id === id);
}

/** Destinos del hub: slugs fijos o, en salidas grupales, los que tienen cupos activos. */
export function getClusterDestinations(
  cluster: ClusterPage,
  destinations: DestinationPage[],
): DestinationPage[] {
  if (cluster.id === "salidas-grupales") {
    return destinations.filter(
      (d) => getActiveUpcomingDepartures(d).length > 0
    );
  }

  const slugs = cluster.destinationSlugs ?? [];
  return slugs
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is DestinationPage => Boolean(d));
}

/** Contadores para cards de cluster en `/destinos` (QOL-03). */
export function getClusterCardStats(
  cluster: ClusterPage,
  destinations: DestinationPage[],
): { destinationCount: number; departureCount: number } {
  const items = getClusterDestinations(cluster, destinations);
  const departureCount = items.reduce(
    (sum, dest) => sum + getActiveUpcomingDepartures(dest).length,
    0,
  );
  return { destinationCount: items.length, departureCount };
}

/** Primer cluster al que pertenece un destino (para breadcrumb / link de vuelta). */
export function getPrimaryClusterForDestination(
  slug: string,
  destinations: DestinationPage[],
): ClusterPage | undefined {
  const dest = destinations.find((d) => d.slug === slug);
  if (!dest) return undefined;

  for (const cluster of clustersData) {
    if (cluster.id === "salidas-grupales") continue;
    if (cluster.destinationSlugs?.includes(slug)) return cluster;
  }

  if (getActiveUpcomingDepartures(dest).length > 0) {
    return getClusterById("salidas-grupales");
  }

  return undefined;
}

export function getAllClusterSlugs(): string[] {
  return clustersData.map((c) => c.slug);
}
