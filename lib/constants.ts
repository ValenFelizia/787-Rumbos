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

