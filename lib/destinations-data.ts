/**
 * lib/destinations-data.ts
 *
 * Modelo de datos centralizado para las páginas de destinos individuales.
 * Soporta destinos evergreen, monedas mixtas (ARS/USD), tipos de transporte,
 * excursiones opcionales y lógica inteligente de vencimiento de salidas.
 */
import type { FaqItem } from "@/lib/constants";

export type TransportType = "aereo" | "bus" | "bus-cama" | "mix";

/** Etiqueta legible para UI; el valor canónico en datos sigue sin tilde (`aereo`). */
export function getTransportLabel(transport: TransportType): string {
  switch (transport) {
    case "aereo":
      return "Aéreo";
    case "bus":
      return "Bus";
    case "bus-cama":
      return "Bus Coche Cama";
    case "mix":
      return "Aéreo / Bus";
  }
}

export interface Departure {
  date: string;          // Formato ISO "YYYY-MM-DD"
  displayDate: string;   // Ej: "8 de Julio"
  priceFrom?: number;    // Opcional, si difiere del precio base del destino
  currency?: "ARS" | "USD";
  status: "confirmed" | "few-seats" | "sold-out" | "inquire";
  transport: TransportType;
  nights: number;
  note?: string;
}

export interface DestinationPage {
  slug: string;
  name: string;
  country: string;
  region: "nacional" | "internacional";
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  flyerImage?: string; // ponytail: added for rendering flyer promo image if available
  description: string;
  highlights: string[];
  typicalInclusions: string[];
  optionalExcursions?: string[];
  travelTip?: string;
  priceFrom?: number;      // Precio base orientativo
  currency: "ARS" | "USD";
  priceNote?: string;      // "por persona en base doble"
  departures: Departure[];
  /** FAQ específicas del destino (Fase 13.2). Opcional: solo destinos prioritarios. */
  faq?: FaqItem[];
}

/** WhatsApp con tracking por página de destino (FAQ / detalle). */
function whatsappDestinoFaq(destino: string): string {
  return `https://api.whatsapp.com/send?phone=5493516157398&text=${encodeURIComponent(
    `Hola 787 Rumbos! Quiero consultar por un viaje a ${destino}. (Web - FAQ Destino)`
  )}`;
}

export const destinationsData: DestinationPage[] = [
  {
    slug: "salta",
    name: "Salta",
    country: "Argentina",
    region: "nacional",
    metaTitle: "Paquetes a Salta desde Córdoba en Aéreo | 787 Rumbos",
    metaDescription: "Viajá a Salta con salida desde Córdoba. Incluye aéreos, alojamiento con desayuno, traslados y city tour. Salidas confirmadas y financiación.",
    heroImage: "/destinos/salta.png",
    description: "Conocida como 'La Linda', Salta ofrece una mezcla única de historia colonial, peñas folclóricas y paisajes andinos de ensueño. Podrás recorrer sus iglesias coloniales, subir al Cerro San Bernardo en teleférico y saborear las mejores empanadas del país en sus históricas peñas.",
    highlights: [
      "Plaza 9 de Julio y Cabildo Histórico",
      "Teleférico San Bernardo y vistas de la ciudad",
      "Peñas folclóricas de la calle Balcarce",
      "Quebrada de las Conchas camino a Cafayate"
    ],
    typicalInclusions: [
      "Aéreo directo desde Córdoba (equipaje incluido)",
      "3 o 4 noches de alojamiento con desayuno",
      "Traslados aeropuerto / hotel / aeropuerto",
      "City Tour pedestre por la ciudad",
      "Asistencia al viajero nacional (InterAssist)"
    ],
    optionalExcursions: [
      "Excursión de día completo a Cafayate con degustación en bodega",
      "Cachi y el Parque Nacional Los Cardones",
      "Salinas Grandes y Purmamarca",
      "Tren a las Nubes (San Antonio de los Cobres)",
      "Quebrada de Humahuaca (Jujuy)"
    ],
    travelTip: "Las empanadas salteñas tradicionales son más pequeñas y se comen calientes acompañadas con una copa de vino Torrontés local en Cafayate.",
    priceFrom: 587000,
    currency: "ARS",
    priceNote: "por persona en base doble",
    departures: [
      {
        date: "2026-08-15",
        displayDate: "15 de Agosto",
        status: "confirmed",
        transport: "aereo",
        nights: 3,
        note: "Fin de semana largo"
      },
      {
        date: "2026-10-10",
        displayDate: "10 de Octubre",
        status: "few-seats",
        transport: "aereo",
        nights: 4,
        note: "Cupos limitados"
      },
      {
        date: "2026-11-21",
        displayDate: "21 de Noviembre",
        status: "confirmed",
        transport: "aereo",
        nights: 3
      }
    ]
  },
  {
    slug: "mendoza",
    name: "Mendoza",
    country: "Argentina",
    region: "nacional",
    metaTitle: "Paquetes a Mendoza desde Córdoba en Aéreo | 787 Rumbos",
    metaDescription: "Viajá a Mendoza con aéreo desde Córdoba. Incluye hotel con desayuno, traslados, excursión al Camino del Vino y bodegas. Consultá tarifas y armá tu viaje.",
    heroImage: "/destinos/mendoza.jpg",
    description: "La capital del vino argentino te espera entre viñedos infinitos y la imponente Cordillera de los Andes. Mendoza combina bodegas de clase mundial, gastronomía de autor y paisajes de alta montaña en una escapada ideal para disfrutar en pareja o con amigos, recorriendo el legendario Camino del Vino.",
    highlights: [
      "Camino del Vino y bodegas de Luján de Cuyo",
      "Vistas a la Cordillera y al Cerro Aconcagua",
      "Parque General San Martín y su Rosedal",
      "Gastronomía regional y maridajes en bodega"
    ],
    typicalInclusions: [
      "Aéreo Córdoba - Mendoza - Córdoba (COR-MZA / MZA-CBA)",
      "Alojamiento en Hotel Raíces Aconcagua, habitación doble ejecutiva con desayuno",
      "Traslados aeropuerto Mendoza / hotel / aeropuerto",
      "Excursión Bus Vitivinícola: Camino del Vino \"El Sol\" (día completo)",
      "Asistencia al viajero nacional (InterAssist)"
    ],
    optionalExcursions: [
      "Alta montaña: Puente del Inca y monumento al Aconcagua",
      "Maipú y bodegas históricas con almuerzo gourmet",
      "Potrerillos, dique y actividades al aire libre",
      "Cañón del Atuel y San Rafael (excursión de varios días)"
    ],
    travelTip: "En las bodegas, el sol mendocino es intenso: usá sombrero, protector solar y ropa cómoda. Si vas en temporada alta, reservá con anticipación las degustaciones y cenas en viñedos.",
    priceFrom: 460029,
    currency: "ARS",
    priceNote: "por persona en base doble",
    departures: [] // Sin salidas grupales confirmadas (paquete a medida)
  },
  {
    slug: "termas-rio-hondo",
    name: "Termas de Río Hondo",
    country: "Argentina",
    region: "nacional",
    metaTitle: "Viajes a Termas de Río Hondo en Bus desde Córdoba | 787 Rumbos",
    metaDescription: "Salidas grupales en bus a Termas de Río Hondo. Pensión completa en Hotel Principado, traslados y coordinador permanente.",
    heroImage: "/destinos/termas.jpg",
    description: "El centro termal más importante de Argentina te espera para vivir unos días de relajación absoluta. Disfrutá de aguas termales con propiedades medicinales, paseos costaneros y una gastronomía regional inigualable, en un ambiente diseñado para el descanso.",
    highlights: [
      "Baños termales terapéuticos",
      "Nueva Costanera y el Dique Frontal",
      "Isla del Sol y Reserva Natural",
      "Gastronomía típica: chivito santiagueño"
    ],
    typicalInclusions: [
      "Traslado en Bus Mix ida y vuelta desde Córdoba",
      "8 noches de alojamiento en Hotel Principado",
      "Régimen de Pensión Completa (bebida incluida en almuerzo y cena)",
      "Coordinador permanente en viaje",
      "Asistencia médica nacional (InterAssist)"
    ],
    travelTip: "Las aguas de Río Hondo son ricas en sales minerales y sodio. Se recomienda tomar baños de inmersión cortos (15-20 min) para un efecto óptimo de relajación.",
    priceFrom: 329000,
    currency: "ARS",
    priceNote: "por persona en base doble",
    departures: [
      {
        date: "2026-07-11",
        displayDate: "11 de Julio",
        status: "few-seats",
        transport: "bus",
        nights: 8,
        note: "Vacaciones de invierno"
      },
      {
        date: "2026-07-14",
        displayDate: "14 de Julio",
        status: "confirmed",
        transport: "bus",
        nights: 8
      },
      {
        date: "2026-07-17",
        displayDate: "17 de Julio",
        status: "confirmed",
        transport: "bus",
        nights: 8
      }
    ],
    faq: [
      {
        id: "termas-incluye",
        question: "¿Qué incluye el viaje a Termas de Río Hondo?",
        answer: [
          {
            type: "text",
            value:
              "Nuestras salidas grupales típicas incluyen traslado en bus desde Córdoba, alojamiento en Hotel Principado con pensión completa (bebida en almuerzo y cena), coordinador permanente e asistencia médica nacional. El detalle exacto se confirma al cotizar.",
          },
        ],
      },
      {
        id: "termas-duracion",
        question: "¿Cuántos días dura la salida?",
        answer: [
          {
            type: "text",
            value:
              "Las salidas publicadas suelen ser de 8 noches. Si preferís otras fechas o menos días, armamos un paquete a medida.",
          },
        ],
      },
      {
        id: "termas-transporte",
        question: "¿Salgo en bus desde Córdoba?",
        answer: [
          {
            type: "text",
            value:
              "Sí. Las salidas grupales a Termas parten en bus desde Córdoba, ida y vuelta. También podemos cotizar otras combinaciones si lo necesitás.",
          },
        ],
      },
      {
        id: "termas-mejor-epoca",
        question: "¿Cuál es la mejor época para ir a las Termas?",
        answer: [
          {
            type: "text",
            value:
              "Se puede disfrutar todo el año. El invierno es muy pedido para el relax termal; en vacaciones de julio conviene reservar con anticipación porque los cupos se agotan rápido.",
          },
        ],
      },
      {
        id: "termas-cotizar",
        question: "¿Cómo consulto disponibilidad?",
        answer: [
          { type: "text", value: "Escribinos por " },
          {
            type: "link",
            label: "WhatsApp",
            href: whatsappDestinoFaq("Termas de Río Hondo"),
            external: true,
          },
          {
            type: "text",
            value:
              " con la fecha que te interesa y te confirmamos cupos y precio actualizado.",
          },
        ],
      },
    ],
  },
  {
    slug: "bariloche",
    name: "Bariloche",
    country: "Argentina",
    region: "nacional",
    metaTitle: "Paquetes a Bariloche desde Córdoba | 787 Rumbos",
    metaDescription: "Conocé Bariloche y la Patagonia. Paquetes con aéreos o bus, hoteles seleccionados y excursiones clásicas como Circuito Chico.",
    heroImage: "/destinos/bariloche.jpg",
    description: "Ubicada a orillas del Lago Nahuel Huapi, Bariloche te deslumbra con sus bosques, cerros nevados y la mayor tradición chocolatera del país. Perfecta tanto en invierno para disfrutar de la nieve como en verano para realizar senderismo y navegación lacustre.",
    highlights: [
      "Circuito Chico y Cerro Campanario",
      "Cerro Catedral, el centro de esquí más grande de Sudamérica",
      "Visita a chocolaterías artesanales del centro cívico",
      "Paseo en barco a Isla Victoria y Bosque de Arrayanes"
    ],
    typicalInclusions: [
      "Aéreo directo Córdoba - Bariloche - Córdoba",
      "5 noches de alojamiento c/desayuno",
      "Traslados in/out aeropuerto-hotel",
      "Excursión clásica Circuito Chico incluida",
      "Asistencia al viajero nacional (InterAssist)"
    ],
    travelTip: "No dejes de subir al Cerro Campanario: National Geographic la calificó como una de las 8 vistas panorámicas más bellas del mundo.",
    priceFrom: 597000,
    currency: "ARS",
    priceNote: "por persona en base doble",
    departures: [], // Sin salidas activas en este momento (Paquete a medida)
    faq: [
      {
        id: "bariloche-incluye",
        question: "¿Qué incluyen los paquetes a Bariloche?",
        answer: [
          {
            type: "text",
            value:
              "En general: aéreo Córdoba–Bariloche, noches de hotel con desayuno, traslados aeropuerto–hotel, Circuito Chico e asistencia al viajero. Podemos sumar o sacar servicios según lo que busques.",
          },
        ],
      },
      {
        id: "bariloche-epoca",
        question: "¿Conviene ir en invierno o en verano?",
        answer: [
          {
            type: "text",
            value:
              "Depende de lo que quieras vivir. En invierno: nieve y Cerro Catedral. En verano: lagos, senderismo y navegación. Ambos son excelentes; te ayudamos a elegir según fechas y presupuesto.",
          },
        ],
      },
      {
        id: "bariloche-bus-o-avion",
        question: "¿Puedo ir en bus o solo en avión?",
        answer: [
          {
            type: "text",
            value:
              "Cotizamos ambas opciones. El aéreo es más rápido; el bus suele ser más económico. Contanos tu prioridad y armamos la mejor combinación.",
          },
        ],
      },
      {
        id: "bariloche-asistencia",
        question: "¿Incluye asistencia al viajero?",
        answer: [
          {
            type: "text",
            value:
              "Sí, en los paquetes estándar incluimos asistencia nacional (InterAssist). Si viajás con menores o querés mayor cobertura, te asesoramos sobre el plan adecuado.",
          },
        ],
      },
      {
        id: "bariloche-cotizar",
        question: "¿Cómo armo mi viaje a Bariloche?",
        answer: [
          { type: "text", value: "Escribinos por " },
          {
            type: "link",
            label: "WhatsApp",
            href: whatsappDestinoFaq("Bariloche"),
            external: true,
          },
          {
            type: "text",
            value:
              " con fechas aproximadas y cantidad de pasajeros. Te armamos una propuesta a medida desde Córdoba.",
          },
        ],
      },
    ],
  },
  {
    slug: "cataratas-del-iguazu",
    name: "Cataratas del Iguazú",
    country: "Argentina",
    region: "nacional",
    metaTitle: "Viajes a Cataratas del Iguazú desde Córdoba | 787 Rumbos",
    metaDescription: "Paquetes turísticos a Cataratas del Iguazú con salidas en bus o aéreo desde Córdoba. Visitá lado argentino y brasileño.",
    heroImage: "/destinos/cataratas.jpg",
    description: "Una de las 7 Maravillas Naturales del Mundo. Dejate ensordecer por la majestuosa Garganta del Diablo y recorre las pasarelas que te sumergen directo en la selva misionera, apreciando la caída de agua más espectacular del planeta.",
    highlights: [
      "Garganta del Diablo en el Parque Nacional Iguazú",
      "Paseo náutico 'Gran Aventura' bajo los saltos",
      "Parque Nacional do Iguaçu (Lado brasileño)",
      "Hito de las Tres Fronteras (Argentina, Brasil, Paraguay)"
    ],
    typicalInclusions: [
      "Pasaje en Bus Coche Cama o Aéreo desde Córdoba",
      "4 noches de alojamiento con desayuno",
      "Traslados a los parques nacionales",
      "Coordinador permanente y guías locales",
      "Asistencia médica nacional (InterAssist)"
    ],
    travelTip: "Llevá siempre una muda de ropa extra y protector para el celular en la excursión del lado argentino, ¡la bruma de la Garganta del Diablo te va a mojar por completo!",
    priceFrom: 410000,
    currency: "ARS",
    priceNote: "por persona en base doble",
    departures: [
      {
        date: "2026-08-14",
        displayDate: "14 de Agosto",
        status: "confirmed",
        transport: "bus-cama",
        nights: 4,
        note: "Salida grupal en bus"
      },
      {
        date: "2026-10-09",
        displayDate: "9 de Octubre",
        status: "inquire",
        transport: "aereo",
        nights: 4
      }
    ],
    faq: [
      {
        id: "iguazu-incluye",
        question: "¿Qué incluye el paquete a Cataratas?",
        answer: [
          {
            type: "text",
            value:
              "Según la salida: pasaje en bus coche cama o aéreo desde Córdoba, noches de hotel con desayuno, traslados a los parques, coordinación e asistencia al viajero. Entradas a los parques y excursiones náuticas pueden cotizarse aparte.",
          },
        ],
      },
      {
        id: "iguazu-lados",
        question: "¿Se visita el lado argentino y el brasileño?",
        answer: [
          {
            type: "text",
            value:
              "Sí, en los itinerarios estándar se contempla ambos parques. El lado argentino tiene más pasarelas; el brasileño ofrece una vista panorámica espectacular. Te detallamos el programa al cotizar.",
          },
        ],
      },
      {
        id: "iguazu-bus-avion",
        question: "¿Conviene ir en bus o en avión?",
        answer: [
          {
            type: "text",
            value:
              "El bus coche cama suele ser más económico; el aéreo ahorra tiempo de viaje. Tenemos salidas en ambas modalidades: elegí según presupuesto y días disponibles.",
          },
        ],
      },
      {
        id: "iguazu-documentos",
        question: "¿Necesito pasaporte para el lado brasileño?",
        answer: [
          {
            type: "text",
            value:
              "Los argentinos pueden ingresar a Brasil con DNI vigente en buen estado. Igual te confirmamos requisitos vigentes al armar el viaje, porque pueden actualizarse.",
          },
        ],
      },
      {
        id: "iguazu-cotizar",
        question: "¿Cómo reservo una salida a Iguazú?",
        answer: [
          { type: "text", value: "Escribinos por " },
          {
            type: "link",
            label: "WhatsApp",
            href: whatsappDestinoFaq("Cataratas del Iguazú"),
            external: true,
          },
          {
            type: "text",
            value: " indicando la fecha de la lista o si preferís fechas a medida.",
          },
        ],
      },
    ],
  },
  {
    slug: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    region: "nacional",
    metaTitle: "Escapadas a Buenos Aires desde Córdoba | 787 Rumbos",
    metaDescription: "Paquetes a Buenos Aires desde Córdoba. Viajes de fin de semana con hotel, traslados y excursiones por San Telmo, Recoleta y Palermo.",
    heroImage: "/destinos/buenosaires.jpg",
    description: "La cosmopolita capital argentina te deslumbra con su vibrante cartelera teatral, librerías históricas, arquitectura de influencia europea y sus barrios de identidades marcadas como La Boca, San Telmo y Palermo.",
    highlights: [
      "Show de tango y cena en San Telmo",
      "Teatro Colón y Avenida Corrientes",
      "Paseo Caminito y barrio de La Boca",
      "Bosques de Palermo y Recoleta"
    ],
    typicalInclusions: [
      "Pasaje en bus coche cama o aéreo desde Córdoba",
      "3 noches de alojamiento en hotel céntrico",
      "City Tour guiado por la ciudad",
      "Traslados in/out terminal/aeropuerto",
      "Asistencia al viajero nacional (InterAssist)"
    ],
    travelTip: "Los domingos no te pierdas la Feria de San Telmo, repleta de antigüedades, artistas callejeros y bailarines de tango al aire libre.",
    priceFrom: 360000,
    currency: "ARS",
    priceNote: "por persona en base doble",
    departures: []
  },
  {
    slug: "ushuaia",
    name: "Ushuaia",
    country: "Argentina",
    region: "nacional",
    metaTitle: "Paquetes al Fin del Mundo: Ushuaia desde Córdoba | 787 Rumbos",
    metaDescription: "Conocé Ushuaia y Tierra del Fuego. Salidas con aéreos desde Córdoba, navegación del Canal Beagle y Tren del Fin del Mundo.",
    heroImage: "/destinos/ushuaia.jpg",
    description: "Ubicada en el extremo sur del continente, Ushuaia te ofrece una asombrosa combinación de glaciares, lagos de origen glaciar y bosques subantárticos a orillas del Canal Beagle. Una experiencia verdaderamente única en los confines de la tierra.",
    highlights: [
      "Navegación del Canal Beagle y Faro Les Éclaireurs",
      "Parque Nacional Tierra del Fuego y Tren del Fin del Mundo",
      "Laguna Esmeralda y Glaciar Martial",
      "Gastronomía marina: centolla y merluza negra"
    ],
    typicalInclusions: [
      "Aéreo Córdoba - Ushuaia - Córdoba",
      "4 noches de alojamiento con desayuno",
      "Traslados in/out aeropuerto-hotel",
      "Navegación del Canal Beagle incluida",
      "Asistencia al viajero nacional (InterAssist)"
    ],
    travelTip: "Ushuaia tiene un clima sumamente cambiante. Vestirse en capas ('sistema cebolla') es fundamental incluso en pleno verano.",
    priceFrom: 820000,
    currency: "ARS",
    priceNote: "por persona en base doble",
    departures: [
      {
        date: "2026-09-18",
        displayDate: "18 de Septiembre",
        status: "confirmed",
        transport: "aereo",
        nights: 4,
        note: "Primavera en el Fin del Mundo"
      }
    ]
  },
  {
    slug: "cancun",
    name: "Cancún",
    country: "México",
    region: "internacional",
    metaTitle: "Paquetes a Cancún desde Córdoba | 787 Rumbos",
    metaDescription: "Viajá al Caribe mexicano. Vuelos desde Córdoba a Cancún, hotelería All Inclusive frente al mar y traslados incluidos.",
    heroImage: "/destinos/cancun.jpg",
    description: "El paraíso del Caribe te espera con sus playas de arena blanca que no se calienta con el sol y su mar de infinitos tonos de azul. Cancún combina a la perfección el relax All Inclusive de sus resorts con excursiones arqueológicas y parques de aventura.",
    highlights: [
      "Playas de la Zona Hotelera y relax total",
      "Excursión arqueológica a Chichén Itzá",
      "Visita e inmersión en cenotes sagrados",
      "Isla Mujeres en catamarán"
    ],
    typicalInclusions: [
      "Aéreo internacional desde Córdoba (vía Copa o LATAM)",
      "7 noches en hotel All Inclusive seleccionado",
      "Traslados aeropuerto / hotel / aeropuerto",
      "Seguro médico internacional de alta cobertura (AssistCard)",
      "Asesoramiento personalizado para excursiones"
    ],
    travelTip: "La moneda local es el Peso Mexicano, pero los dólares estadounidenses son ampliamente aceptados en toda la zona turística.",
    priceFrom: 1850,
    currency: "USD",
    priceNote: "por persona en base doble",
    departures: [
      {
        date: "2026-11-08",
        displayDate: "8 de Noviembre",
        status: "confirmed",
        transport: "aereo",
        nights: 7,
        note: "Salida acompañada"
      }
    ],
    faq: [
      {
        id: "cancun-requisitos",
        question: "¿Qué documentos necesito para viajar a Cancún?",
        answer: [
          {
            type: "text",
            value:
              "Pasaporte vigente (recomendamos al menos 6 meses de validez) y, según el caso, visa u otros requisitos según tu nacionalidad. Te guiamos con la documentación y la asistencia al viajero exigida.",
          },
        ],
      },
      {
        id: "cancun-incluye",
        question: "¿Los paquetes son All Inclusive?",
        answer: [
          {
            type: "text",
            value:
              "Podemos armar All Inclusive frente al mar o hoteles con desayuno, según tu estilo. Los paquetes típicos incluyen aéreo desde Córdoba, traslados, hotel y AssistCard. Excursiones (Chichén Itzá, cenotes, Isla Mujeres) se cotizan aparte o se suman al paquete.",
          },
        ],
      },
      {
        id: "cancun-epoca",
        question: "¿Cuál es la mejor época para Cancún?",
        answer: [
          {
            type: "text",
            value:
              "El Caribe mexicano se disfruta casi todo el año. Noviembre a abril suele tener clima más estable; en temporada de lluvias/huracanes te avisamos riesgos y alternativas. Contanos tus fechas y te orientamos.",
          },
        ],
      },
      {
        id: "cancun-asistencia",
        question: "¿Es obligatoria la asistencia al viajero?",
        answer: [
          {
            type: "text",
            value:
              "Para destinos internacionales recomendamos (y en muchos casos exigimos) cobertura médica adecuada. En nuestros paquetes incluimos AssistCard de alta cobertura; te explicamos qué cubre según el plan.",
          },
        ],
      },
      {
        id: "cancun-cotizar",
        question: "¿Cómo cotizo Cancún desde Córdoba?",
        answer: [
          { type: "text", value: "Escribinos por " },
          {
            type: "link",
            label: "WhatsApp",
            href: whatsappDestinoFaq("Cancún"),
            external: true,
          },
          {
            type: "text",
            value:
              " con fechas, cantidad de pasajeros y si preferís All Inclusive. Te armamos opciones con vuelos desde Córdoba.",
          },
        ],
      },
    ],
  },
  {
    slug: "playa-del-carmen",
    name: "Playa del Carmen",
    country: "México",
    region: "internacional",
    metaTitle: "Vacaciones en Playa del Carmen desde Córdoba | 787 Rumbos",
    metaDescription: "Disfrutá del corazón de la Riviera Maya. Hoteles sobre la Quinta Avenida o All Inclusive frente al mar con vuelos desde Córdoba.",
    heroImage: "/destinos/playadelcarmen.jpg",
    description: "Playa del Carmen ofrece una atmósfera más bohemia e integrada que Cancún. Con su famosa Quinta Avenida repleta de gastronomía y tiendas, es la base perfecta para explorar parques ecológicos, playas paradisíacas e islas como Cozumel.",
    highlights: [
      "Quinta Avenida y su vida nocturna y comercial",
      "Parques ecológicos Xcaret y Xel-Há",
      "Ruinas arqueológicas de Tulum frente al mar Caribe",
      "Cruce en ferry a la Isla de Cozumel"
    ],
    typicalInclusions: [
      "Aéreo internacional saliendo de Córdoba",
      "7 noches en hotel seleccionado (All Inclusive o c/desayuno)",
      "Traslados in/out aeropuerto-hotel",
      "Asistencia médica internacional (AssistCard)",
      "Coordinación local"
    ],
    travelTip: "Para comprar artesanías y comer comida local a precios más accesibles, camina dos o tres cuadras en paralelo alejándote de la Quinta Avenida.",
    priceFrom: 1720,
    currency: "USD",
    priceNote: "por persona en base doble",
    departures: [],
    faq: [
      {
        id: "pdc-vs-cancun",
        question: "¿Playa del Carmen o Cancún?",
        answer: [
          {
            type: "text",
            value:
              "Cancún concentra resorts All Inclusive en la zona hotelera. Playa del Carmen tiene más vida peatonal (Quinta Avenida) y queda más cerca de Tulum, Xcaret y Cozumel. Te ayudamos a elegir según si buscás relax de resort o más movimiento.",
          },
        ],
      },
      {
        id: "pdc-incluye",
        question: "¿Qué incluye un paquete a Playa del Carmen?",
        answer: [
          {
            type: "text",
            value:
              "Aéreo desde Córdoba, hotel (All Inclusive o con desayuno), traslados y asistencia internacional. Parques y ferry a Cozumel se pueden sumar según tu presupuesto.",
          },
        ],
      },
      {
        id: "pdc-requisitos",
        question: "¿Qué requisitos hay para México?",
        answer: [
          {
            type: "text",
            value:
              "Pasaporte vigente y los requisitos migratorios vigentes para tu nacionalidad. Te confirmamos todo al cotizar para que viajes sin sorpresas.",
          },
        ],
      },
      {
        id: "pdc-excursiones",
        question: "¿Puedo visitar Tulum y Xcaret?",
        answer: [
          {
            type: "text",
            value:
              "Sí. Desde Playa del Carmen son excursiones muy pedidas. Las cotizamos aparte o las integramos al paquete según lo que quieras vivir.",
          },
        ],
      },
      {
        id: "pdc-cotizar",
        question: "¿Cómo consulto por Playa del Carmen?",
        answer: [
          { type: "text", value: "Escribinos por " },
          {
            type: "link",
            label: "WhatsApp",
            href: whatsappDestinoFaq("Playa del Carmen"),
            external: true,
          },
          {
            type: "text",
            value: " y te armamos opciones desde Córdoba.",
          },
        ],
      },
    ],
  },
  {
    slug: "riviera-maya",
    name: "Riviera Maya",
    country: "México",
    region: "internacional",
    metaTitle: "Paquetes a Riviera Maya All Inclusive desde Córdoba | 787 Rumbos",
    metaDescription:
      "Riviera Maya con hotel 5 estrellas All Inclusive. Ocean Coral & Turquesa, 8 noches, traslados y asistencia. Family Plan desde Córdoba.",
    heroImage: "/destinos/riviera-maya.jpg",
    description:
      "La Riviera Maya concentra playas de arena blanca, cenotes y ruinas mayas a pocos kilómetros. Ideal para familias y parejas que buscan un resort All Inclusive de categoría frente al Caribe, con excursiones a Tulum, Cozumel y parques ecológicos a un paso.",
    highlights: [
      "Resort Ocean Coral & Turquesa 5 estrellas All Inclusive",
      "Playas del Caribe mexicano y aguas turquesa",
      "Base perfecta para Tulum, cenotes y Cozumel",
      "Family Plan pensado para viajar en familia"
    ],
    typicalInclusions: [
      "Aéreo internacional desde Córdoba",
      "8 noches en Ocean Coral & Turquesa (5★) All Inclusive",
      "Traslados aeropuerto / hotel / aeropuerto",
      "Asistencia al viajero internacional (AssistCard)",
      "Asesoramiento para excursiones en destino"
    ],
    optionalExcursions: [
      "Ruinas de Tulum frente al mar",
      "Parques Xcaret / Xel-Há",
      "Ferry a Isla Cozumel",
      "Cenotes y Chichén Itzá"
    ],
    travelTip:
      "El Family Plan suele ser la opción más conveniente si viajan adultos con menores. Confirmá edades de los chicos al cotizar: impactan en tarifa e impuestos.",
    priceFrom: 1795,
    currency: "USD",
    priceNote: "por persona en Family Plan. + USD 265 de impuestos",
    departures: [],
    faq: [
      {
        id: "rm-hotel",
        question: "¿En qué hotel se hospedan?",
        answer: [
          {
            type: "text",
            value:
              "El paquete de referencia es en Ocean Coral & Turquesa, resort 5 estrellas All Inclusive en la Riviera Maya. Si preferís otra categoría o ubicación, te armamos alternativas.",
          },
        ],
      },
      {
        id: "rm-family",
        question: "¿Qué es el Family Plan?",
        answer: [
          {
            type: "text",
            value:
              "Es una tarifa pensada para familias (adultos + menores) con condiciones especiales según edades. El precio publicado es orientativo desde USD 1795 + impuestos; te cotizamos el total exacto según composición del grupo.",
          },
        ],
      },
      {
        id: "rm-incluye",
        question: "¿Qué incluye el paquete a Riviera Maya?",
        answer: [
          {
            type: "text",
            value:
              "Aéreo desde Córdoba, 8 noches All Inclusive, traslados y asistencia al viajero. Las excursiones (Tulum, parques, Cozumel) se pueden sumar según lo que quieras vivir.",
          },
        ],
      },
      {
        id: "rm-vs-cancun",
        question: "¿Riviera Maya, Cancún o Playa del Carmen?",
        answer: [
          {
            type: "text",
            value:
              "Cancún concentra la zona hotelera clásica; Playa del Carmen tiene más vida peatonal; Riviera Maya suele referirse a resorts All Inclusive un poco más al sur, ideales para relax en familia. Te orientamos según tu estilo de viaje.",
          },
        ],
      },
      {
        id: "rm-cotizar",
        question: "¿Cómo cotizo Riviera Maya desde Córdoba?",
        answer: [
          { type: "text", value: "Escribinos por " },
          {
            type: "link",
            label: "WhatsApp",
            href: whatsappDestinoFaq("Riviera Maya"),
            external: true,
          },
          {
            type: "text",
            value:
              " con fechas, cantidad de adultos y menores. Te enviamos el Family Plan y otras opciones.",
          },
        ],
      },
    ],
  },
  {
    slug: "rio-de-janeiro",
    name: "Río de Janeiro",
    country: "Brasil",
    region: "internacional",
    metaTitle: "Paquetes a Río de Janeiro desde Córdoba | 787 Rumbos",
    metaDescription: "Viajá a Río de Janeiro. Salidas grupales o individuales desde Córdoba. Copacabana, Pan de Azúcar y Cristo Redentor.",
    heroImage: "/destinos/rio.jpg",
    description: "La 'Cidade Maravilhosa' enamora a todo viajero. Enmarcada por montañas selváticas y playas icónicas, Río combina la bossa nova de Ipanema, el ritmo del samba y hitos mundiales como el Cristo Redentor en el Cerro del Corcovado.",
    highlights: [
      "Subida al Cristo Redentor y vistas de la bahía",
      "Teleférico al morro Pan de Azúcar al atardecer",
      "Tarde de sol en Copacabana e Ipanema",
      "Escalera de Selarón y el barrio bohemio de Santa Teresa"
    ],
    typicalInclusions: [
      "Aéreo directo o c/conexión desde Córdoba",
      "7 noches de alojamiento con desayuno en Copacabana",
      "Traslados in/out en destino",
      "City Tour clásico c/Cristo y Pan de Azúcar",
      "Asistencia al viajero internacional (AssistCard)"
    ],
    travelTip: "Para una experiencia carioca auténtica, disfrutá de una caipiriña helada en los quioscos de la costanera al caer la tarde.",
    priceFrom: 980,
    currency: "USD",
    priceNote: "por persona en base doble",
    departures: [
      {
        date: "2026-09-05",
        displayDate: "5 de Septiembre",
        status: "confirmed",
        transport: "aereo",
        nights: 7,
        note: "Primavera carioca"
      },
      {
        date: "2026-10-12",
        displayDate: "12 de Octubre",
        status: "few-seats",
        transport: "aereo",
        nights: 7
      }
    ],
    faq: [
      {
        id: "rio-requisitos",
        question: "¿Qué necesito para viajar a Río desde Argentina?",
        answer: [
          {
            type: "text",
            value:
              "Los argentinos ingresan a Brasil con DNI vigente en buen estado (o pasaporte). Te confirmamos requisitos actualizados al cotizar, incluyendo asistencia al viajero recomendada.",
          },
        ],
      },
      {
        id: "rio-incluye",
        question: "¿Qué incluye un paquete a Río de Janeiro?",
        answer: [
          {
            type: "text",
            value:
              "En general: aéreo desde Córdoba, noches en Copacabana con desayuno, traslados, city tour con Cristo y Pan de Azúcar, y AssistCard. Podemos ajustar noches, hotel y excursiones a tu medida.",
          },
        ],
      },
      {
        id: "rio-epoca",
        question: "¿Cuál es la mejor época para ir a Río?",
        answer: [
          {
            type: "text",
            value:
              "Río se disfruta todo el año. Septiembre–noviembre suele tener buen clima y menos aglomeración que el Carnaval. En verano hace más calor y humedad; te orientamos según tus fechas.",
          },
        ],
      },
      {
        id: "rio-salidas",
        question: "¿Hay salidas grupales o solo a medida?",
        answer: [
          {
            type: "text",
            value:
              "Publicamos salidas cuando hay cupos confirmados y también armamos viajes individuales a tu fecha. Revisá el panel de salidas de esta página o consultanos por WhatsApp.",
          },
        ],
      },
      {
        id: "rio-cotizar",
        question: "¿Cómo cotizo Río desde Córdoba?",
        answer: [
          { type: "text", value: "Escribinos por " },
          {
            type: "link",
            label: "WhatsApp",
            href: whatsappDestinoFaq("Río de Janeiro"),
            external: true,
          },
          {
            type: "text",
            value:
              " con fechas y cantidad de pasajeros. Te enviamos opciones claras con precio orientativo.",
          },
        ],
      },
    ],
  },
  {
    slug: "porto-de-galinhas",
    name: "Porto de Galinhas",
    country: "Brasil",
    region: "internacional",
    metaTitle: "Viajes a Porto de Galinhas desde Córdoba | 787 Rumbos",
    metaDescription: "Conocé las piscinas naturales del noreste de Brasil. Paquetes turísticos con aéreos desde Córdoba y traslados.",
    heroImage: "/destinos/portogalinhas.jpg",
    description: "Famoso por sus piscinas naturales de aguas templadas y transparentes formadas entre arrecifes de coral. Porto de Galinhas es el refugio tropical ideal en el noreste de Brasil, combinando encanto de aldea de pescadores con hotelería de primer nivel.",
    highlights: [
      "Paseo en jangada a las piscinas naturales de arrecife",
      "Playa de Muro Alto con aguas calmas como una laguna",
      "Paseo en buggy de punta a punta por las playas",
      "Centro peatonal repleto de gastronomía y artesanías"
    ],
    typicalInclusions: [
      "Aéreo internacional desde Córdoba a Recife",
      "7 noches de alojamiento con régimen seleccionado",
      "Traslado Recife - Porto de Galinhas - Recife",
      "Asistencia médica internacional (AssistCard)",
      "Asistencia receptiva local"
    ],
    travelTip: "La visita a las piscinas naturales depende 100% de la tabla de mareas. Consultá el horario de marea baja cada día para ir en jangada.",
    priceFrom: 1250,
    currency: "USD",
    priceNote: "por persona en base doble",
    departures: []
  },
  {
    slug: "camboriu",
    name: "Camboriú",
    country: "Brasil",
    region: "internacional",
    metaTitle: "Viajes a Camboriú en bus desde Córdoba | 787 Rumbos",
    metaDescription:
      "Paquete a Camboriú en bus semicama desde Córdoba. 7 noches en Hotel Sagres con desayuno y cena, asistencia al viajero. Desde USD 599.",
    heroImage: "/destinos/camboriu.jpg",
    description:
      "Balneario de Santa Catarina famoso por su playa urbana, el teleférico Unipraias y la vida nocturna. Camboriú es una de nuestras salidas clásicas en bus desde Córdoba, con convenio terrestre y hotelería céntrica para disfrutar playa y ciudad sin complicaciones.",
    highlights: [
      "Playa central y paseo peatonal frente al mar",
      "Teleférico Unipraias y vistas panorámicas",
      "Vida nocturna y gastronomía de balneario",
      "Salida en bus semicama desde Córdoba"
    ],
    typicalInclusions: [
      "Traslado en bus semicama ida y vuelta desde Córdoba",
      "7 noches de alojamiento en Hotel Sagres",
      "Régimen con desayuno y cena incluidos",
      "Asistencia al viajero",
      "Coordinación del viaje"
    ],
    optionalExcursions: [
      "Balneario Camboriú y miradores",
      "Betos World / parques temáticos",
      "Paseo a Florianópolis (día completo)",
      "Compras en Itajaí / Brás"
    ],
    travelTip:
      "El bus semicama es una opción cómoda y económica para llegar a la playa brasileña. Llevá abrigo liviano para el viaje nocturno y documento de viaje vigente (DNI o pasaporte).",
    priceFrom: 599,
    currency: "USD",
    priceNote: "por persona en base doble",
    departures: [],
    faq: [
      {
        id: "camboriu-bus",
        question: "¿Cómo es el viaje en bus a Camboriú?",
        answer: [
          {
            type: "text",
            value:
              "Salís desde Córdoba en bus semicama. Es una de nuestras salidas estándar por convenio con el transportista terrestre: cómoda, con precio competitivo y sin depender de aéreos.",
          },
        ],
      },
      {
        id: "camboriu-incluye",
        question: "¿Qué incluye el paquete a Camboriú?",
        answer: [
          {
            type: "text",
            value:
              "Bus semicama ida y vuelta, 7 noches en Hotel Sagres, desayuno y cena, y asistencia al viajero. Excursiones opcionales se cotizan aparte.",
          },
        ],
      },
      {
        id: "camboriu-requisitos",
        question: "¿Qué documentos necesito para Brasil?",
        answer: [
          {
            type: "text",
            value:
              "Los argentinos suelen ingresar con DNI vigente en buen estado (o pasaporte). Te confirmamos requisitos actualizados al cotizar.",
          },
        ],
      },
      {
        id: "camboriu-cotizar",
        question: "¿Cómo consulto por Camboriú?",
        answer: [
          { type: "text", value: "Escribinos por " },
          {
            type: "link",
            label: "WhatsApp",
            href: whatsappDestinoFaq("Camboriú"),
            external: true,
          },
          {
            type: "text",
            value:
              " y te confirmamos próximas salidas, cupos y el total del paquete.",
          },
        ],
      },
    ],
  },
  {
    slug: "peru",
    name: "Perú Clásico",
    country: "Perú",
    region: "internacional",
    metaTitle: "Paquetes a Perú desde Córdoba: Lima, Cusco y Puno | 787 Rumbos",
    metaDescription: "Recorré la historia y arqueología de Perú en un solo viaje. Incluye Machu Picchu, Valle Sagrado y el Lago Titicaca en Puno.",
    heroImage: "/destinos/peru.jpg",
    description: "Una inmersión profunda en el corazón del Imperio Incaico. Este paquete integra la gastronomía de Lima, los templos y fortalezas de Cusco y el Valle Sagrado, la mística ciudadela de Machu Picchu y la navegación del sagrado Lago Titicaca en Puno.",
    highlights: [
      "Ciudadela de Machu Picchu con boleto de tren escénico",
      "Valle Sagrado de los Incas: Pisac y Ollantaytambo",
      "City Tour gastronómico e histórico en Lima",
      "Navegación del Lago Titicaca y las Islas Flotantes de los Uros"
    ],
    typicalInclusions: [
      "Aéreos internacionales saliendo de Córdoba",
      "10 noches de alojamiento en hoteles seleccionados",
      "Boletos de tren Expedition/Vistadome y buses a Machu Picchu",
      "Excursiones y traslados internos incluidos c/guía local",
      "Asistencia médica internacional de alta cobertura (AssistCard)"
    ],
    travelTip: "En Cusco y el Valle Sagrado (a más de 3400 msnm), descansa las primeras horas y toma té de coca para aclimatarte y evitar el mal de altura.",
    priceFrom: 2434,
    currency: "USD",
    priceNote: "por persona en base doble",
    departures: []
  },
  {
    slug: "sudeste-asiatico",
    name: "Sudeste Asiático",
    country: "Tailandia, Camboya y Singapur",
    region: "internacional",
    metaTitle: "Viajes grupales al Sudeste Asiático desde Córdoba | 787 Rumbos",
    metaDescription: "El viaje de tu vida. Recorré los templos de Bangkok, los templos de Angkor en Camboya y la futurista Singapur.",
    heroImage: "/destinos/sudesteasiatico.jpg",
    description: "Un recorrido inolvidable que contrasta el misticismo budista de Tailandia, las imponentes ruinas de los templos de Angkor en Camboya y la vanguardia futurista y ordenada de Singapur. El viaje ideal para buscadores de cultura y paisajes exóticos.",
    highlights: [
      "Templos de Bangkok: Gran Palacio y Wat Pho",
      "Amanecer en Angkor Wat (Camboya), patrimonio de la UNESCO",
      "Gardens by the Bay y Marina Bay Sands en Singapur",
      "Playas tropicales y calidez de su cultura local"
    ],
    typicalInclusions: [
      "Aéreos internacionales saliendo de Córdoba",
      "14 noches de alojamiento en hoteles de categoría superior",
      "Vuelos internos e inter-países incluidos",
      "Traslados privados, excursiones y entradas a los templos",
      "Coordinador permanente y guías de habla hispana",
      "Asistencia médica internacional (AssistCard)"
    ],
    travelTip: "Para visitar templos religiosos, es obligatorio vestir ropa que cubra hombros y rodillas. Llevá calzado fácil de sacar, ya que en muchos recintos sagrados se entra descalzo.",
    priceFrom: 4650,
    currency: "USD",
    priceNote: "por persona en base doble",
    departures: []
  },
  {
    slug: "salar-de-uyuni",
    name: "Salar de Uyuni y Norte Grande",
    country: "Bolivia y Argentina",
    region: "internacional",
    metaTitle: "Salidas Grupales a Salar de Uyuni y Tilcara desde Córdoba | 787 Rumbos",
    metaDescription: "Salida grupal en Bus Coche Cama al Salar de Uyuni, Salta y Tilcara. Coordinador permanente, excursiones y pensión completa en tramos.",
    heroImage: "/destinos/salar-de-uyuni.jpg",
    description: "Una travesía andina inolvidable por los desiertos de sal más grandes del mundo. El itinerario conecta el norte argentino (Salta y Tilcara) con el altiplano boliviano, ofreciendo el espectáculo natural de Uyuni en una experiencia grupal completamente coordinada.",
    highlights: [
      "Salar de Uyuni full day con puesta del sol",
      "Quebrada de Humahuaca y cerro de los Siete Colores en Purmamarca",
      "Pucará de Tilcara e historia precolombina",
      "Quebrada de las Conchas y visita a bodega en Cafayate"
    ],
    typicalInclusions: [
      "Bus grupal Coche Cama ida y vuelta desde Córdoba",
      "6 noches de alojamiento (2 Tilcara, 2 Uyuni, 2 Salta) con desayuno",
      "Traslados in/out y excursiones en programa",
      "Coordinador permanente del grupo",
      "Asistencia médica internacional (AssistCard)"
    ],
    travelTip: "El Salar de Uyuni es el desierto de sal continuo más alto del mundo (3650 msnm). Traé abrigo fuerte e impermeable: la temperatura baja abruptamente al ponerse el sol.",
    priceFrom: 564,
    currency: "USD",
    priceNote: "por persona en base doble (más USD 93 de tasas e impuestos)",
    departures: [
      {
        date: "2026-09-09",
        displayDate: "9 de Septiembre",
        status: "confirmed",
        transport: "bus-cama",
        nights: 6,
        note: "Gran Vuelta al Norte"
      }
    ]
  },
  {
    slug: "f1-grand-premio-sao-paulo",
    name: "F1 Grand Premio de São Paulo",
    country: "Brasil",
    region: "internacional",
    metaTitle: "Vuelo Charter GP São Paulo F1 desde Córdoba y Rosario | 787 Rumbos",
    metaDescription: "Viajá al Gran Premio de Fórmula 1 en Interlagos. Paquete con vuelo charter desde Córdoba y Rosario, 4 noches de hotel, traslados y entradas al autódromo.",
    heroImage: "/destinos/gp-sao-paulo-hero.jpg",
    flyerImage: "/destinos/gp-sao-paulo.png",
    description: "Viví la máxima adrenalina del automovilismo mundial con nuestro paquete exclusivo para el Grand Premio de São Paulo de Fórmula 1 en el histórico Autódromo de Interlagos. Te ofrecemos una solución llave en mano con vuelo charter directo, alojamiento seleccionado, traslados especiales al autódromo y tus entradas ya aseguradas para disfrutar del rugido de los motores sin preocuparte por nada.",
    highlights: [
      "Vuelo Charter directo desde Córdoba (COR) y Rosario (ROS)",
      "Entradas aseguradas para el sector G-A-HEINEKEN",
      "Kit exclusivo de Fórmula 1 para el evento",
      "Traslados especiales de ida y vuelta al Autódromo de Interlagos"
    ],
    typicalInclusions: [
      "Vuelo Charter ida y vuelta COR-ROS / GRU",
      "4 noches de alojamiento en hotel seleccionado con desayuno",
      "Traslados de llegada y salida (In-Out)",
      "Traslados diarios al Autódromo (Sábado y Domingo)",
      "Entradas para el Sector G-A-HEINEKEN",
      "Kit de Fórmula 1 de obsequio",
      "Asistencia médica internacional (AssistCard)"
    ],
    travelTip: "El sector G-A-HEINEKEN ofrece una excelente visibilidad en una de las rectas más rápidas de Interlagos. Se recomienda llevar ropa cómoda, gorra, protector solar y abrigo ligero, ya que el clima en São Paulo puede ser muy cambiante durante el día.",
    priceFrom: 2770,
    currency: "USD",
    priceNote: "por persona en base doble. + USD 260 de gastos e impuestos",
    departures: [
      {
        date: "2026-11-05",
        displayDate: "5 de Noviembre",
        status: "confirmed",
        transport: "aereo",
        nights: 4,
        note: "Vuelo Charter Especial F1 COR/ROS"
      }
    ],
    faq: [
      {
        id: "f1-incluye",
        question: "¿Qué incluye el paquete del GP de São Paulo?",
        answer: [
          {
            type: "text",
            value:
              "Vuelo charter COR/ROS–GRU, 4 noches de hotel con desayuno, traslados in/out, traslados al autódromo sábado y domingo, entradas sector G-A-HEINEKEN, kit F1 y AssistCard. Los gastos e impuestos se detallan aparte en la cotización.",
          },
        ],
      },
      {
        id: "f1-salidas",
        question: "¿Desde qué ciudades sale el charter?",
        answer: [
          {
            type: "text",
            value:
              "El vuelo charter especial contempla Córdoba (COR) y Rosario (ROS). Confirmamos horarios y puntos de embarque al reservar.",
          },
        ],
      },
      {
        id: "f1-entradas",
        question: "¿Las entradas al autódromo están incluidas?",
        answer: [
          {
            type: "text",
            value:
              "Sí, el paquete incluye entradas para el sector G-A-HEINEKEN. Es un sector con buena visibilidad en una de las rectas rápidas de Interlagos.",
          },
        ],
      },
      {
        id: "f1-cupos",
        question: "¿Hasta cuándo hay cupos?",
        answer: [
          {
            type: "text",
            value:
              "Los cupos del charter y del hotel son limitados. Te recomendamos consultar pronto: la demanda del GP suele agotar lugares con anticipación.",
          },
        ],
      },
      {
        id: "f1-cotizar",
        question: "¿Cómo reservo el paquete F1?",
        answer: [
          { type: "text", value: "Escribinos por " },
          {
            type: "link",
            label: "WhatsApp",
            href: whatsappDestinoFaq("F1 Grand Premio de São Paulo"),
            external: true,
          },
          {
            type: "text",
            value:
              " indicando ciudad de embarque (Córdoba o Rosario) y cantidad de pasajeros.",
          },
        ],
      },
    ],
  }
];

/** Fecha de hoy a medianoche local (para comparar salidas ISO). */
export function getTodayLocal(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/** True si la salida aún no pasó (incluye el día de hoy). */
export function isDepartureUpcoming(dep: Departure, today = getTodayLocal()): boolean {
  return new Date(dep.date + "T00:00:00") >= today;
}

/** Salidas futuras (cualquier status). */
export function getUpcomingDepartures(dest: DestinationPage): Departure[] {
  const today = getTodayLocal();
  return dest.departures.filter((dep) => isDepartureUpcoming(dep, today));
}

/** Salidas futuras consultables (no sold-out). */
export function getActiveUpcomingDepartures(dest: DestinationPage): Departure[] {
  return getUpcomingDepartures(dest).filter((dep) => dep.status !== "sold-out");
}

export function getDestinationBySlug(slug: string): DestinationPage | undefined {
  return destinationsData.find(d => d.slug === slug);
}

/** Relacionados: mismo cluster fijo primero, luego mismo país, luego región. */
export function getRelatedDestinations(
  slug: string,
  limit = 3
): DestinationPage[] {
  const current = getDestinationBySlug(slug);
  if (!current) return [];

  const clusterMateSlugs = new Set<string>();
  // Import lazy via inline to avoid circular deps: cluster mates from known lists
  const fixedClusters: string[][] = [
    ["rio-de-janeiro", "porto-de-galinhas", "camboriu", "f1-grand-premio-sao-paulo"],
    ["cancun", "playa-del-carmen", "riviera-maya"],
    ["termas-rio-hondo", "cataratas-del-iguazu", "salar-de-uyuni"],
  ];
  for (const group of fixedClusters) {
    if (group.includes(slug)) {
      group.forEach((s) => {
        if (s !== slug) clusterMateSlugs.add(s);
      });
    }
  }

  const others = destinationsData.filter((d) => d.slug !== slug);
  const clusterMates = others.filter((d) => clusterMateSlugs.has(d.slug));
  const sameCountry = others.filter(
    (d) => d.country === current.country && !clusterMateSlugs.has(d.slug)
  );
  const sameRegion = others.filter(
    (d) =>
      d.region === current.region &&
      d.country !== current.country &&
      !clusterMateSlugs.has(d.slug)
  );

  return [...clusterMates, ...sameCountry, ...sameRegion].slice(0, limit);
}

export function getAllDestinationSlugs(): string[] {
  return destinationsData.map(d => d.slug);
}
