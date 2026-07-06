/**
 * lib/destinations-data.ts
 *
 * Modelo de datos centralizado para las páginas de destinos individuales.
 * Soporta destinos evergreen, monedas mixtas (ARS/USD), tipos de transporte,
 * excursiones opcionales y lógica inteligente de vencimiento de salidas.
 */

export interface Departure {
  date: string;          // Formato ISO "YYYY-MM-DD"
  displayDate: string;   // Ej: "8 de Julio"
  priceFrom?: number;    // Opcional, si difiere del precio base del destino
  currency?: "ARS" | "USD";
  status: "confirmed" | "few-seats" | "sold-out" | "inquire";
  transport: "aereo" | "bus" | "bus-cama" | "mix";
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
  description: string;
  highlights: string[];
  typicalInclusions: string[];
  optionalExcursions?: string[];
  travelTip?: string;
  priceFrom?: number;      // Precio base orientativo
  currency: "ARS" | "USD";
  priceNote?: string;      // "por persona en base doble"
  departures: Departure[];
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
      "Asistencia al viajero"
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
        date: "2026-07-08",
        displayDate: "8 de Julio",
        status: "sold-out",
        transport: "aereo",
        nights: 4,
        note: "Vacaciones de Julio"
      },
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
      "Asistencia médica de viaje"
    ],
    travelTip: "Las aguas de Río Hondo son ricas en sales minerales y sodio. Se recomienda tomar baños de inmersión cortos (15-20 min) para un efecto óptimo de relajación.",
    priceFrom: 329000,
    currency: "ARS",
    priceNote: "por persona en base doble",
    departures: [
      {
        date: "2026-07-05",
        displayDate: "5 de Julio",
        status: "sold-out",
        transport: "bus",
        nights: 8
      },
      {
        date: "2026-07-08",
        displayDate: "8 de Julio",
        status: "sold-out",
        transport: "bus",
        nights: 8
      },
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
    ]
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
      "Asistencia al viajero nacional"
    ],
    travelTip: "No dejes de subir al Cerro Campanario: National Geographic la calificó como una de las 8 vistas panorámicas más bellas del mundo.",
    priceFrom: 597000,
    currency: "ARS",
    priceNote: "por persona en base doble",
    departures: [] // Sin salidas activas en este momento (Paquete a medida)
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
      "Asistencia médica integral"
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
    ]
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
      "Asistencia al viajero"
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
      "Asistencia médica de viaje"
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
      "Seguro médico internacional de alta cobertura",
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
    ]
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
      "Asistencia médica internacional",
      "Coordinación local"
    ],
    travelTip: "Para comprar artesanías y comer comida local a precios más accesibles, camina dos o tres cuadras en paralelo alejándote de la Quinta Avenida.",
    priceFrom: 1720,
    currency: "USD",
    priceNote: "por persona en base doble",
    departures: []
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
      "Asistencia al viajero internacional"
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
    ]
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
      "Asistencia médica internacional",
      "Asistencia receptiva local"
    ],
    travelTip: "La visita a las piscinas naturales depende 100% de la tabla de mareas. Consultá el horario de marea baja cada día para ir en jangada.",
    priceFrom: 1250,
    currency: "USD",
    priceNote: "por persona en base doble",
    departures: []
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
      "Asistencia médica internacional de alta cobertura"
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
      "Coordinador permanente y guías de habla hispana"
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
      "Asistencia médica de viaje con cobertura internacional"
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
  }
];

export function getDestinationBySlug(slug: string): DestinationPage | undefined {
  return destinationsData.find(d => d.slug === slug);
}

export function getAllDestinationSlugs(): string[] {
  return destinationsData.map(d => d.slug);
}
