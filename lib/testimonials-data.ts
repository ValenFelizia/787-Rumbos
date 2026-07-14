/**
 * Testimonios curados con autorización explícita del cliente.
 * Vacío a propósito: la home no publica ejemplos. Cuando haya reseñas/testimonios
 * reales, agregarlos acá y la sección `Testimonials` los mostrará sola.
 */
export interface Testimonial {
  name: string;
  destination: string;
  text: string;
  rating: number;
  date: string;
  /** Origen opcional (Google, Instagram, autorización directa). */
  source?: "google" | "instagram" | "direct";
}

export const testimonials: Testimonial[] = [];
