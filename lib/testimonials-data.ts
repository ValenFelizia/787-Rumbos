/**
 * Testimonios curados con autorización explícita del cliente.
 * Origen preferido: reseñas reales de Google Business Profile.
 * Vacío = la sección solo muestra el CTA a dejar reseña.
 */
export interface Testimonial {
  name: string;
  text: string;
  rating: number;
  /** Destino del viaje, si aplica y se conoce. */
  destination?: string;
  /** Fecha aproximada o relativa, si se conoce. */
  date?: string;
  /** Origen (Google, Instagram, autorización directa). */
  source?: "google" | "instagram" | "direct";
}

export const testimonials: Testimonial[] = [
  {
    name: "Matias Manzanelli",
    text: "Nos atendieron super bien, muy amables y nos solucionaron todos nuestros problemas a pesar de haber perdido el vuelo. Lo super recomiendo",
    rating: 5,
    source: "google",
  },
  {
    name: "Magalí Flores",
    text: "Excelente atención. Fernanda nos asesoró y ayudo en todo momento",
    rating: 5,
    source: "google",
  },
  {
    name: "Denisse",
    text: "Muy bien trato , pensado para que el pasajero se sienta totalmente cuidado . Lo recomiendo 100, %",
    rating: 5,
    source: "google",
  },
];
