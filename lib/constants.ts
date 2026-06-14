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
import { BedDouble, Bus, HeartPulse, Plane } from "lucide-react";

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
  name: string;
  duration: string;
  imageSrc: string;
}

/**
 * Destinos ilustrativos — no son paquetes reales en venta.
 * Representan algunos de los destinos que la agencia puede armar.
 * Para agregar o modificar destinos, editar este array.
 */
export const featuredDestinations: Destination[] = [
  {
    name: "Río de Janeiro",
    duration: "7 noches / 8 días",
    imageSrc: "/destino1.jpg",
  },
  {
    name: "Bariloche",
    duration: "5 noches / 6 días",
    imageSrc: "/destino2.jpg",
  },
  {
    name: "Cartagena",
    duration: "6 noches / 7 días",
    imageSrc: "/destino3.jpg",
  },
  {
    name: "Ushuaia",
    duration: "4 noches / 5 días",
    imageSrc: "/destino4.jpg",
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
];
