import type { FeaturedPromo } from "@/lib/catalog/types";

/** Valores históricos de la promo. El seed los sube al global; la paridad los compara. */
export const promoSeed: FeaturedPromo = {
  slug: "f1-grand-premio-sao-paulo",
  endsAt: "2026-11-05",
  topBarText: "🏎️ Salida Especial Charter: F1 GP de São Paulo (5 de Nov). ¡Últimos cupos! Ver Detalles →",
  badgeText: "🏎️ EVENTO DESTACADO F1",
  charterText: "✈️ VUELO CHARTER DIRECTO",
  title: "Grand Premio de São Paulo",
  description: "Viví la adrenalina de la Fórmula 1 en el histórico circuito de Interlagos con todo incluido. Salida directa especial el 5 de Noviembre desde Córdoba y Rosario. ¡Cupos limitados!",
  price: "USD 2.770",
  priceNote: "por persona en base doble",
  taxNote: "+ USD 260 de gastos e impuestos",
  imageSrc: "/destinos/gp-sao-paulo.png",
  whatsappMsg: "Hola 787 Rumbos! Quiero consultar disponibilidad y detalles del paquete para el Vuelo Charter F1 Grand Premio de Sao Paulo del 5 de Noviembre. (Web - Promo F1)",
  inclusions: [
    { label: "Aéreo Charter COR-ROS / GRU", icon: "plane" },
    { label: "4 Noches de hotel con desayuno", icon: "calendar" },
    { label: "Entrada Sector G-A-HEINEKEN", icon: "ticket" },
    { label: "Traslados Autódromo + Kit F1", icon: "map-pin" },
  ],
};
