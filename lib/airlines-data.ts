/**
 * lib/airlines-data.ts
 *
 * Cluster SEO de pasajes aéreos (D-002): hub `/aereos` + landings
 * `/aereos/{aerolinea}-cordoba`. Contenido propio por aerolínea; no doorway pages.
 *
 * Para publicar otra aerolínea: agregar un `AirlinePage` con `published: true`
 * y logo en `/public/partners` si hace falta. La ruta dinámica ya la resuelve.
 */
import {
  GOOGLE_MAPS_LINK,
  OFFICE_HOURS,
  WHATSAPP_LINK,
  type FaqItem,
} from "@/lib/constants";

export const AEREOS_BASE_PATH = "/aereos" as const;
export const AEREOS_CANONICAL_ORIGIN = "https://www.787rumbos.com.ar" as const;

export interface AirlineLogo {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface AirlinePage {
  /** Identificador estable (no es el slug de URL). */
  id: string;
  /** Slug completo bajo `/aereos/`, p. ej. `latam-cordoba`. */
  slug: string;
  /** Nombre corto para UI (LATAM, GOL…). */
  shortName: string;
  /** Nombre comercial completo. */
  displayName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /**
   * Relación con la marca: siempre visible.
   * Por defecto: agencia independiente (D-002).
   */
  independenceNote: string;
  /** Qué puede gestionar 787 Rumbos respecto de esta aerolínea. */
  whatWeHandle: string[];
  /** Qué se deriva a la aerolínea u otros canales. */
  whatWeRefer: string[];
  faq: FaqItem[];
  ctaLabel: string;
  whatsappText: string;
  logo?: AirlineLogo;
  /**
   * Solo `published: true` entra al hub, sitemap y `generateStaticParams`.
   * Usar `false` para borradores sin contenido suficiente.
   */
  published: boolean;
}

export interface AereosHubContent {
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  howWeWork: string[];
  crossSellNote: string;
  ctaLabel: string;
  whatsappText: string;
  faq: FaqItem[];
}

export const aereosHub: AereosHubContent = {
  metaTitle: "Pasajes aéreos desde Córdoba | 787 Rumbos",
  metaDescription:
    "Comprá pasajes aéreos de múltiples aerolíneas visitándonos en el Aeropuerto de Córdoba. ¡También podés cotizar por WhatsApp!",
  title: "Pasajes aéreos desde Córdoba",
  intro:
    "En 787 Rumbos emitimos pasajes de varias aerolíneas con asesoramiento humano: te cotizamos por WhatsApp o en persona. No somos un comparador anónimo: hablás con el mismo equipo de punta a punta.",
  howWeWork: [
    "Cotizamos vuelos nacionales e internacionales según tus fechas y presupuesto.",
    "Trabajamos con múltiples aerolíneas; te mostramos opciones claras, no un listado infinito.",
    "Atención presencial en nuestra oficina del aeropuerto, dentro del local de Vía Bariloche.",
    "Podés sumar asistencia al viajero y, si querés, un paquete o pasaje terrestre.",
  ],
  crossSellNote:
    "Si además del vuelo necesitás hotel, traslados o una salida armada, mirá también nuestros destinos o escribinos y lo resolvemos en la misma consulta.",
  ctaLabel: "Cotizar vuelo por WhatsApp",
  whatsappText:
    "Hola 787 Rumbos! Quiero cotizar un pasaje aéreo desde Córdoba. (Web - Hub Aéreos)",
  faq: [
    {
      id: "aereos-multiples",
      question: "¿Con qué aerolíneas trabajan?",
      answer: [
        {
          type: "text",
          value:
            "Emitimos con varias compañías (entre ellas LATAM, Copa, JetSmart, GOL, Avianca, Air Europa y Arajet, según la ruta). La mejor opción depende de fechas, conexiones y tarifa: te asesoramos caso por caso.",
        },
      ],
    },
    {
      id: "aereos-donde",
      question: "¿Dónde puedo comprar o consultar un pasaje?",
      answer: [
        {
          type: "text",
          value: `Por WhatsApp o en nuestra oficina del Aeropuerto de Córdoba (${OFFICE_HOURS.short}). `,
        },
        {
          type: "link",
          label: "Cómo llegar",
          href: GOOGLE_MAPS_LINK,
          external: true,
        },
        { type: "text", value: "." },
      ],
    },
    {
      id: "aereos-vs-paquetes",
      question: "¿Solo venden pasajes o también paquetes?",
      answer: [
        {
          type: "text",
          value:
            "Vendemos pasajes aéreos sueltos y también armamos paquetes o salidas cuando lo necesitás. Empezá por el vuelo o por el viaje completo: te guiamos según lo que busques.",
        },
      ],
    },
  ],
};

/**
 * Landings por aerolínea. Agregar entradas nuevas acá; no clonar `page.tsx`.
 * Requisito D-002: contenido propio útil + disclaimer de independencia.
 */
export const airlinesData: AirlinePage[] = [
  {
    id: "latam",
    slug: "latam-cordoba",
    shortName: "LATAM",
    displayName: "LATAM Airlines",
    metaTitle: "Pasajes LATAM en Córdoba | 787 Rumbos",
    metaDescription:
      "Cotizá y comprá pasajes LATAM en Córdoba con atención humana. Agencia de viajes independiente. 787 Rumbos.",
    h1: "Pasajes LATAM en Córdoba",
    intro:
      "Si buscás comprar o cotizar un vuelo LATAM desde Córdoba, en 787 Rumbos te asesoramos en persona o por WhatsApp. Emitimos pasajes de LATAM y de otras aerolíneas según tu itinerario.",
    independenceNote:
      "787 Rumbos es una agencia de viajes independiente. No somos una oficina oficial ni sucursal de LATAM Airlines.",
    whatWeHandle: [
      "Cotización y emisión de pasajes LATAM según disponibilidad y tarifa.",
      "Cambios vinculados a tu reserva, según la tarifa y políticas de LATAM.",
      "Orientación sobre equipaje y ayuda con el check-in cuando hace falta.",
      "Comparación con otras aerolíneas cuando otra opción te conviene más.",
      "Comunicación y mediación con la aerolínea si surge un inconveniente con la reserva.",
      "Asistencia al viajero (p. ej. AssistCard / InterAssist) si la sumás a la propuesta.",
    ],
    whatWeRefer: [
      "Embarque, estado de vuelo en tiempo real y beneficios del programa de millas (LATAM Pass): se gestionan con la aerolínea.",
      "Reembolsos o resoluciones finales sujetas a la tarifa y políticas de LATAM: te orientamos y mediamos; la decisión final depende del proveedor.",
    ],
    faq: [
      {
        id: "latam-oficial",
        question: "¿787 Rumbos es una oficina oficial de LATAM?",
        answer: [
          {
            type: "text",
            value:
              "No. Somos una agencia de viajes independiente. Vendemos pasajes de LATAM y de otras aerolíneas, con atención humana; no representamos institucionalmente a LATAM Airlines.",
          },
        ],
      },
      {
        id: "latam-comprar",
        question: "¿Puedo comprar pasajes LATAM en el aeropuerto de Córdoba?",
        answer: [
          {
            type: "text",
            value: `Sí. Podés venir a nuestra oficina o escribirnos por `,
          },
          {
            type: "link",
            label: "WhatsApp",
            href: WHATSAPP_LINK,
            external: true,
          },
          {
            type: "text",
            value: `. El detalle de ubicación y horarios está más arriba en esta página.`,
          },
        ],
      },
      {
        id: "latam-otras",
        question: "¿Solo trabajan con LATAM?",
        answer: [
          {
            type: "text",
            value:
              "No. LATAM es una de las compañías con las que emitimos; también cotizamos otras aerolíneas según la ruta. Si LATAM no es la mejor opción para tus fechas, te lo decimos.",
          },
        ],
      },
      {
        id: "latam-cotizar",
        question: "¿Cómo cotizo un vuelo LATAM?",
        answer: [
          {
            type: "text",
            value:
              "Escribinos por WhatsApp con origen, destino, fechas y cantidad de pasajeros. Te respondemos con opciones concretas en horario de atención.",
          },
        ],
      },
      {
        id: "latam-cambios",
        question: "¿Qué pasa si necesito cambiar o cancelar el pasaje?",
        answer: [
          {
            type: "text",
            value:
              "Depende de la tarifa emitida y de las políticas de LATAM. Te ayudamos a gestionar el cambio o la cancelación vinculada a tu reserva; la resolución final la define la aerolínea según las condiciones de tu ticket.",
          },
        ],
      },
    ],
    ctaLabel: "Cotizar LATAM por WhatsApp",
    whatsappText:
      "Hola 787 Rumbos! Quiero cotizar un pasaje LATAM desde Córdoba. (Web - LATAM Córdoba)",
    logo: {
      src: "/partners/latam.svg",
      width: 130,
      height: 40,
      alt: "LATAM Airlines",
    },
    published: true,
  },
  {
    id: "gol",
    slug: "gol-cordoba",
    shortName: "GOL",
    displayName: "GOL Linhas Aéreas",
    metaTitle: "Pasajes GOL en Córdoba | 787 Rumbos",
    metaDescription:
      "Cotizá y comprá pasajes GOL en Córdoba con atención humana. Agencia de viajes independiente. 787 Rumbos.",
    h1: "Pasajes GOL en Córdoba",
    intro:
      "Si buscás comprar o cotizar un vuelo GOL desde Córdoba, en 787 Rumbos te asesoramos en persona o por WhatsApp. Emitimos pasajes de GOL y de otras aerolíneas según tu itinerario.",
    independenceNote:
      "787 Rumbos es una agencia de viajes independiente. No somos una oficina oficial ni sucursal de GOL Linhas Aéreas.",
    whatWeHandle: [
      "Cotización y emisión de pasajes GOL según disponibilidad y tarifa.",
      "Cambios vinculados a tu reserva, según la tarifa y políticas de GOL.",
      "Orientación sobre equipaje y ayuda con el check-in cuando hace falta.",
      "Comparación con otras aerolíneas cuando otra opción te conviene más.",
      "Comunicación y mediación con la aerolínea si surge un inconveniente con la reserva.",
      "Asistencia al viajero (p. ej. AssistCard / InterAssist) si la sumás a la propuesta.",
    ],
    whatWeRefer: [
      "Embarque, estado de vuelo en tiempo real y beneficios del programa de millas de GOL: se gestionan con la aerolínea.",
      "Reembolsos o resoluciones finales sujetas a la tarifa y políticas de GOL: te orientamos y mediamos; la decisión final depende del proveedor.",
    ],
    faq: [
      {
        id: "gol-oficial",
        question: "¿787 Rumbos es una oficina oficial de GOL?",
        answer: [
          {
            type: "text",
            value:
              "No. Somos una agencia de viajes independiente. Vendemos pasajes de GOL y de otras aerolíneas, con atención humana; no representamos institucionalmente a GOL Linhas Aéreas.",
          },
        ],
      },
      {
        id: "gol-comprar",
        question: "¿Puedo comprar pasajes GOL en el aeropuerto de Córdoba?",
        answer: [
          {
            type: "text",
            value: `Sí. Podés venir a nuestra oficina o escribirnos por `,
          },
          {
            type: "link",
            label: "WhatsApp",
            href: WHATSAPP_LINK,
            external: true,
          },
          {
            type: "text",
            value: `. El detalle de ubicación y horarios está más arriba en esta página.`,
          },
        ],
      },
      {
        id: "gol-otras",
        question: "¿Solo trabajan con GOL?",
        answer: [
          {
            type: "text",
            value:
              "No. GOL es una de las compañías con las que emitimos; también cotizamos otras aerolíneas según la ruta. Si GOL no es la mejor opción para tus fechas, te lo decimos.",
          },
        ],
      },
      {
        id: "gol-cotizar",
        question: "¿Cómo cotizo un vuelo GOL?",
        answer: [
          {
            type: "text",
            value:
              "Escribinos por WhatsApp con origen, destino, fechas y cantidad de pasajeros. Te respondemos con opciones concretas en horario de atención.",
          },
        ],
      },
      {
        id: "gol-cambios",
        question: "¿Qué pasa si necesito cambiar el pasaje o el equipaje?",
        answer: [
          {
            type: "text",
            value:
              "Te ayudamos con cambios y consultas de equipaje vinculados a tu reserva, según la tarifa y las políticas de GOL. Si hay un inconveniente, también podemos mediar la comunicación con la aerolínea; la resolución final depende del proveedor.",
          },
        ],
      },
      {
        id: "gol-checkin",
        question: "¿Me ayudan con el check-in?",
        answer: [
          {
            type: "text",
            value:
              "Sí. Podemos orientarte y ayudarte con el check-in cuando hace falta. El embarque y el estado del vuelo en tiempo real siguen dependiendo de GOL.",
          },
        ],
      },
    ],
    ctaLabel: "Cotizar GOL por WhatsApp",
    whatsappText:
      "Hola 787 Rumbos! Quiero cotizar un pasaje GOL desde Córdoba. (Web - GOL Córdoba)",
    logo: {
      src: "/partners/gol.svg",
      width: 100,
      height: 40,
      alt: "GOL Linhas Aéreas",
    },
    published: true,
  },
];

export function getAirlineBySlug(slug: string): AirlinePage | undefined {
  return airlinesData.find((airline) => airline.slug === slug);
}

export function getPublishedAirlines(): AirlinePage[] {
  return airlinesData.filter((airline) => airline.published);
}

export function getPublishedAirlineSlugs(): string[] {
  return getPublishedAirlines().map((airline) => airline.slug);
}

export function airlineCanonicalPath(slug: string): string {
  return `${AEREOS_BASE_PATH}/${slug}`;
}

export function airlineCanonicalUrl(slug: string): string {
  return `${AEREOS_CANONICAL_ORIGIN}${airlineCanonicalPath(slug)}`;
}

export function aereosHubCanonicalUrl(): string {
  return `${AEREOS_CANONICAL_ORIGIN}${AEREOS_BASE_PATH}`;
}
