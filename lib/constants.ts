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

// ─── Teléfonos y WhatsApp ─────────────────────────────────────────────────────

/**
 * Teléfono de agencia — canal público único (CTAs, schema, NAP, GBP).
 * Anteriormente figuraba como teléfono de urgencias.
 * El número anterior (+54 9 351 344-8724) queda reservado para la futura expansión de pasajes aéreos.
 */
export const AGENCY_PHONE = {
  whatsapp: "5493516157398",
  display: "+54 9 351 615-7398",
  /** E.164 para schema / tel: */
  tel: "+5493516157398",
} as const;

/**
 * Alias de compatibilidad: teléfono único de atención.
 */
export const URGENT_PHONE = AGENCY_PHONE;

/** Horario oficial del local en el aeropuerto (atención comercial). */
export const OFFICE_HOURS = {
  weekdays: "Lunes a viernes 8:30–18:00",
  saturday: "Sábados 8:30–13:00",
  sunday: "Domingos cerrado",
  short: "lun–vie 8:30–18:00 · sáb 8:30–13:00",
} as const;

/** Arma un enlace wa.me/api.whatsapp.com con texto prellenado. */
export function whatsappLink(phone: string, text: string): string {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
}

/** CTA comercial / contacto general → agencia */
export const WHATSAPP_LINK = whatsappLink(
  AGENCY_PHONE.whatsapp,
  "Hola 787 Rumbos! Quería hacer una consulta general... (Web - Contacto Directo)",
);

/** Cotizador (bypass o envío) → agencia */
export const WHATSAPP_QUOTE_BYPASS = whatsappLink(
  AGENCY_PHONE.whatsapp,
  "Hola 787 Rumbos! Quería consultar directamente con un asesor... (Web - Cotizador Directo)",
);

/** Urgencias con viaje en curso — no usar en embudos de cotización */
export const WHATSAPP_URGENT_LINK = whatsappLink(
  URGENT_PHONE.whatsapp,
  "Hola 787 Rumbos! Estoy de viaje y necesito ayuda con un imprevisto... (Web - Urgencias)",
);

/** Error 404 → agencia */
export const WHATSAPP_404_LINK = whatsappLink(
  AGENCY_PHONE.whatsapp,
  "Hola 787 Rumbos! Me perdí en la página y necesito ayuda con un viaje... (Web - Error 404)",
);

/** FAQ home → agencia */
export const WHATSAPP_FAQ_LINK = whatsappLink(
  AGENCY_PHONE.whatsapp,
  "Hola 787 Rumbos! Quería consultar por una duda del FAQ... (Web - FAQ)",
);

/** Destino destacado → agencia */
export function whatsappDestino(destino: string): string {
  return whatsappLink(
    AGENCY_PHONE.whatsapp,
    `Hola 787 Rumbos! Quiero consultar por un viaje a ${destino}. (Web - Destino Destacado)`,
  );
}

/**
 * Ficha de Google Maps / Google Business Profile de 787 Rumbos
 * (Hall de arribos, Aeropuerto de Córdoba — no usar búsqueda genérica del aeropuerto).
 */
export const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/ZnVX6SQ7UtDXgbpm7";

/** Place key hex + CID derivados del place GBP (schema / citaciones). */
export const GOOGLE_PLACE_KEY = "0x94329becff1264df:0xc85a96783374e09f";
export const GOOGLE_MAPS_CID = "14437016998493085855";

/** Ver la ficha en Maps (reseñas existentes + datos del local). */
export const GOOGLE_REVIEWS_LINK = GOOGLE_MAPS_LINK;

/** Formulario directo “Escribir una reseña” (GBP → Obtener más reseñas). */
export const GOOGLE_WRITE_REVIEW_LINK =
  "https://g.page/r/CZ_gdDN4llrIEBI/review";

/** QR del mismo enlace de reseña (impresión / mostrador). */
export const GOOGLE_REVIEW_QR_SRC = "/qr-resenas-787.png";

/** Coordenadas del place GBP (schema LocalBusiness). */
export const OFFICE_GEO = {
  latitude: -31.3172806,
  longitude: -64.2131382,
} as const;

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
        value: `Sí. Contamos con oficina en el Hall de arribos del Aeropuerto Internacional de Córdoba, dentro del local oficial de Vía Bariloche (Av. La Voz del Interior 8500). Podés visitarnos ${OFFICE_HOURS.weekdays.toLowerCase()} y ${OFFICE_HOURS.saturday.toLowerCase()}. `,
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
          "Una salida grupal tiene fecha, cupos e itinerario ya definidos: viajás con otros pasajeros en las mismas condiciones. Un paquete a medida lo diseñamos para vos: elegís fechas, hotel, noches y servicios según tu pedido. En ambos casos te asesora una persona real.",
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
          "Es una cobertura médica para imprevistos durante tu viaje: consultas, medicación, traslados por emergencia y otros servicios según el plan. Trabajamos con las principales coberturas del mercado como AssistCard e InterAssist para garantizarte la mejor asistencia médica nacional e internacional. En muchos destinos internacionales es un requisito de ingreso. Te indicamos la cobertura adecuada según tu destino y duración del viaje.",
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
          "Sí. Te acompañamos antes, durante y después del viaje: te ayudamos a gestionar con aerolínea, hotel o asistencia al viajero lo vinculado a tu reserva. La resolución final depende de cada proveedor; no somos una guardia 24/7 ni reemplazamos a la asistencia médica. Si estás de viaje y surge un imprevisto, escribinos a nuestro ",
      },
      {
        type: "link",
        label: "WhatsApp de atención",
        href: WHATSAPP_LINK,
        external: true,
      },
      {
        type: "text",
        value: `.`,
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
  { name: "AssistCard", imageSrc: "/partners/assistcard.png", width: 120, height: 40 },
  { name: "InterAssist", imageSrc: "/partners/interassist.png", width: 130, height: 40 },
];

