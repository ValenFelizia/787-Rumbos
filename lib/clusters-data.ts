/**
 * lib/clusters-data.ts
 *
 * Hubs SEO de categoría ("desde Córdoba"). Listan solo destinos reales
 * del catálogo — sin copy genérico de guía turística.
 */
import {
  destinationsData,
  getActiveUpcomingDepartures,
  getDestinationBySlug,
  type DestinationPage,
} from "@/lib/destinations-data";

export type ClusterId = "brasil" | "caribe" | "argentina-bus" | "salidas-grupales";

export interface ClusterPage {
  id: ClusterId;
  slug: string;
  title: string;
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
    title: "Brasil desde Córdoba",
    metaTitle: "Paquetes a Brasil desde Córdoba | 787 Rumbos",
    metaDescription:
      "Río, Porto de Galinhas, Camboriú y salidas especiales a Brasil desde Córdoba. Paquetes a medida o grupales con atención humana por WhatsApp.",
    intro:
      "Armamos viajes a Brasil saliendo desde Córdoba: playa, ciudad o eventos. Cotizás por WhatsApp con una persona real y te enviamos opciones claras según fechas y presupuesto.",
    howWeWork: [
      "Salidas grupales cuando hay cupos, o paquete 100% a tu medida.",
      "Aéreos desde Córdoba, hoteles y asistencia internacional (AssistCard).",
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
    metaTitle: "Paquetes al Caribe desde Córdoba | 787 Rumbos",
    metaDescription:
      "Cancún, Playa del Carmen y Riviera Maya desde Córdoba. All Inclusive, Family Plan, traslados y asistencia. Cotizá por WhatsApp.",
    intro:
      "El Caribe mexicano es uno de los pedidos más fuertes desde Córdoba: playa, All Inclusive y resorts familiares. Te armamos opciones claras con vuelos, hotel y asistencia.",
    howWeWork: [
      "Paquetes a medida o salidas cuando hay cupos publicados.",
      "All Inclusive, Family Plan y hoteles según tu estilo de viaje.",
      "Aéreos desde Córdoba, traslados y AssistCard incluidos en la propuesta.",
      "Oficina en el Aeropuerto de Córdoba para resolver dudas en persona.",
    ],
    ctaLabel: "Cotizar Caribe por WhatsApp",
    whatsappText:
      "Hola 787 Rumbos! Quiero consultar por un viaje al Caribe desde Córdoba. (Web - Cluster Caribe)",
    destinationSlugs: ["cancun", "playa-del-carmen", "riviera-maya"],
  },
  {
    id: "argentina-bus",
    slug: "argentina-en-bus-desde-cordoba",
    title: "Argentina en bus desde Córdoba",
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
export function getClusterDestinations(cluster: ClusterPage): DestinationPage[] {
  if (cluster.id === "salidas-grupales") {
    return destinationsData.filter(
      (d) => getActiveUpcomingDepartures(d).length > 0
    );
  }

  const slugs = cluster.destinationSlugs ?? [];
  return slugs
    .map((slug) => getDestinationBySlug(slug))
    .filter((d): d is DestinationPage => Boolean(d));
}

/** Primer cluster al que pertenece un destino (para breadcrumb / link de vuelta). */
export function getPrimaryClusterForDestination(
  slug: string
): ClusterPage | undefined {
  const dest = getDestinationBySlug(slug);
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
