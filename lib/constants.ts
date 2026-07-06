/**
 * lib/constants.ts — Datos y configuración central de la aplicación.
 *
 * Centralizar los datos aquí tiene dos ventajas:
 * 1. Un solo lugar para editar cuando cambia un destino, servicio o número de teléfono.
 * 2. Los componentes importan lo que necesitan sin duplicar datos entre archivos.
 *
 * En el futuro, si se integra un CMS (Sanity, Strapi, etc.), estos arrays
 * se reemplazarían por fetches a la API y los componentes no tendrían que cambiar.
 */
import { BedDouble, Bus, HeartPulse, Plane, Ticket } from "lucide-react";

// ─── Links de WhatsApp ────────────────────────────────────────────────────────

/** Número de atención al cliente — abre WhatsApp con mensaje genérico. */
export const WHATSAPP_LINK =
  "https://api.whatsapp.com/send?phone=5493516157398&text=Hola%2C%20quiero%20consultar%20por%20un%20viaje.";

/** Genera un link de WhatsApp con el mensaje pre-rellenado para un destino específico. */
export function whatsappDestino(destino: string): string {
  return `https://api.whatsapp.com/send?phone=5493516157398&text=Hola%2C%20quiero%20consultar%20por%20un%20viaje%20a%20${encodeURIComponent(destino)}.`;
}

/** Ubicación del local en Google Maps (Aeropuerto de Córdoba). */
export const GOOGLE_MAPS_LINK =
  "https://maps.google.com/?q=Aeropuerto+Internacional+Ingeniero+Aeron%C3%A1utico+Ambrosio+Taravella";

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export type FaqAnswerSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string; external?: boolean };

export interface FaqItem {
  id: string;
  question: string;
  answer: FaqAnswerSegment[];
}

/** Convierte segmentos de respuesta a texto plano para schema FAQPage. */
export function faqAnswerToPlainText(segments: FaqAnswerSegment[]): string {
  return segments
    .map((segment) => (segment.type === "text" ? segment.value : segment.label))
    .join("");
}

export const faqItems: FaqItem[] = [
  {
    id: "local-fisico",
    question: "¿Tienen un local físico?",
    answer: [
      {
        type: "text",
        value:
          "Sí. Contamos con oficina en el Hall de arribos del Aeropuerto Internacional de Córdoba, dentro del local oficial de Vía Bariloche (Av. La Voz del Interior 8500). Podés visitarnos de lunes a viernes de 8:30 a 18:00 hs y sábados de 8:30 a 13:00 hs. ",
      },
      { type: "link", label: "Cómo llegar", href: GOOGLE_MAPS_LINK, external: true },
      { type: "text", value: "." },
    ],
  },
  {
    id: "como-reservar",
    question: "¿Cómo puedo reservar un viaje?",
    answer: [
      { type: "text", value: "Escribinos por " },
      {
        type: "link",
        label: "WhatsApp",
        href: WHATSAPP_LINK,
        external: true,
      },
      {
        type: "text",
        value:
          ", contanos a dónde querés viajar y nosotros nos encargamos de armarte la mejor propuesta. También podés acercarte a nuestra oficina en el aeropuerto o usar el cotizador de la web.",
      },
    ],
  },
  {
    id: "que-incluyen",
    question: "¿Qué incluyen los paquetes?",
    answer: [
      {
        type: "text",
        value:
          "Cada paquete es distinto y lo armamos según lo que buscás. Por lo general incluyen como mínimo traslados, alojamiento y asistencia al viajero. Otros suman vuelos, excursiones, pensión completa o servicios adicionales. Siempre te enviamos el detalle completo antes de confirmar.",
      },
    ],
  },
  {
    id: "salida-cordoba",
    question: "¿Los paquetes son sí o sí desde Córdoba?",
    answer: [
      {
        type: "text",
        value:
          "No, para nada. Si bien estamos en Córdoba y muchas de nuestras salidas grupales parten desde acá, armamos viajes desde cualquier ciudad de Argentina e incluso desde el exterior.",
      },
    ],
  },
  {
    id: "medida-vs-grupal",
    question: "¿Cuál es la diferencia entre un paquete a medida y una salida grupal?",
    answer: [
      {
        type: "text",
        value:
          "Una salida grupal tiene fecha, cupos e itinerario ya definidos: viajás con otros pasajeros en las mismas condiciones. Un paquete a medida lo diseñamos para vos: elegís fechas, hotel, noches y servicios según tu pedido. En ambos casos te asesora una persona real, no un bot.",
      },
    ],
  },
  {
    id: "medios-pago",
    question: "¿Qué medios de pago y financiación ofrecen?",
    answer: [
      {
        type: "text",
        value:
          "Aceptamos distintos medios de pago según el paquete y contamos con opciones de financiación vigentes. Las alternativas pueden variar según el destino y la fecha de salida. Consultá las opciones disponibles con un asesor por ",
      },
      {
        type: "link",
        label: "WhatsApp",
        href: WHATSAPP_LINK,
        external: true,
      },
      { type: "text", value: "." },
    ],
  },
  {
    id: "asistencia-viajero",
    question: "¿Qué es la asistencia al viajero?",
    answer: [
      {
        type: "text",
        value:
          "Es una cobertura médica para imprevistos durante tu viaje: consultas, medicación, traslados por emergencia y otros servicios según el plan. En muchos destinos internacionales es un requisito de ingreso. Te indicamos la cobertura adecuada según tu destino y duración del viaje.",
      },
    ],
  },
  {
    id: "pasajes-omnibus",
    question: "¿También venden pasajes de ómnibus?",
    answer: [
      {
        type: "text",
        value:
          "Sí. Somos boletería oficial de Vía Bariloche, Vía Tac y El Valle en el Aeropuerto de Córdoba. Podés comprar pasajes de ómnibus nacionales además de consultar por vuelos y paquetes turísticos.",
      },
    ],
  },
  {
    id: "post-venta",
    question: "¿Me acompañan si surge un problema durante el viaje?",
    answer: [
      {
        type: "text",
        value:
          "Sí. Nuestra atención no termina cuando comprás el pasaje: te acompañamos antes, durante y después del viaje. Si surge un inconveniente, escribinos por ",
      },
      {
        type: "link",
        label: "WhatsApp",
        href: WHATSAPP_LINK,
        external: true,
      },
      {
        type: "text",
        value: " y te ayudamos a resolverlo con atención humana.",
      },
    ],
  },
];

// ─── Destinos ─────────────────────────────────────────────────────────────────

export interface Destination {
  slug: string;
  name: string;
  duration: string;
  imageSrc: string;
}

/**
 * Destinos destacados para la landing page.
 * Vinculados directamente a las páginas de destino individuales mediante el slug.
 */
export const featuredDestinations: Destination[] = [
  {
    slug: "salta",
    name: "Salta",
    duration: "3 noches / 4 días",
    imageSrc: "/destinos/salta.png",
  },
  {
    slug: "bariloche",
    name: "Bariloche",
    duration: "5 noches / 6 días",
    imageSrc: "/destinos/bariloche.jpg",
  },
  {
    slug: "rio-de-janeiro",
    name: "Río de Janeiro",
    duration: "7 noches / 8 días",
    imageSrc: "/destinos/rio.jpg",
  },
  {
    slug: "cataratas-del-iguazu",
    name: "Cataratas del Iguazú",
    duration: "4 noches / 5 días",
    imageSrc: "/destinos/cataratas.jpg",
  },
];

// ─── Servicios ────────────────────────────────────────────────────────────────

export interface Service {
  title: string;
  description: string;
  // El tipo ElementType permite guardar un componente de React (como un ícono de Lucide)
  // y renderizarlo dinámicamente con <Icon /> dentro de un .map().
  icon: React.ElementType;
}

export const services: Service[] = [
  {
    title: "Pasajes Aéreos",
    description: "Vuelos nacionales e internacionales con las mejores conexiones.",
    icon: Plane,
  },
  {
    title: "Alojamiento",
    description: "Hoteles y hospedajes seleccionados según tu estilo de viaje.",
    icon: BedDouble,
  },
  {
    title: "Traslados",
    description: "Movilidad segura aeropuerto-hotel-aeropuerto en destino.",
    icon: Bus,
  },
  {
    title: "Asistencia Médica",
    description: "Cobertura para que viajes tranquilo en cada tramo del recorrido.",
    icon: HeartPulse,
  },
  {
    title: "Pasajes de Ómnibus",
    description: "Boletería oficial de Vía Bariloche, Vía Tac y El Valle para todo el país.",
    icon: Ticket,
  },
];

// ─── Aerolíneas Aliadas ────────────────────────────────────────────────────────

export interface Partner {
  name: string;
  imageSrc: string;
  width: number;
  height: number;
}

export const partnerLogos: Partner[] = [
  { name: "Copa Airlines", imageSrc: "/partners/copa.png", width: 130, height: 40 },
  { name: "JetSmart", imageSrc: "/partners/jetsmart.svg", width: 110, height: 40 },
  { name: "GOL", imageSrc: "/partners/gol.svg", width: 100, height: 40 },
  { name: "Avianca", imageSrc: "/partners/avianca.svg", width: 120, height: 40 },
  { name: "Air Europa", imageSrc: "/partners/aireuropa.svg", width: 130, height: 40 },
  { name: "LATAM Airlines", imageSrc: "/partners/latam.svg", width: 130, height: 40 },
  { name: "Arajet", imageSrc: "/partners/arajet.png", width: 130, height: 40 },
  { name: "Vía Bariloche", imageSrc: "/partners/viabariloche.png", width: 150, height: 40 },
];

