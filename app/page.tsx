/**
 * app/page.tsx — Compositor de la página de inicio (`/`).
 *
 * Este archivo ya no contiene lógica ni JSX extenso. Su única responsabilidad
 * es ensamblar las secciones en el orden correcto. Cada sección vive en su
 * propio componente dentro de `components/sections/`, lo que permite:
 *   - Editar una sección sin tocar el resto.
 *   - Reutilizar secciones en otras páginas si el sitio crece.
 *   - Mantener el archivo principal legible de un vistazo.
 *
 * Futuras secciones a agregar aquí (ver todo.md y specs.md):
 *   - <TrustBar />      → badges de confianza bajo el hero (Fase 4.4)
 *   - <Testimonials />  → branch feature/testimonials, no mergear hasta tener datos reales
 *   - <CTASection />    → CTA de cierre antes del footer (Fase 4.5)
 */
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { AboutUs } from "@/components/sections/AboutUs";
import { FeaturedDestinations } from "@/components/sections/FeaturedDestinations";
import { Services } from "@/components/sections/Services";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <Navbar />
      <Hero />
      <ValueProposition />
      <AboutUs />
      <FeaturedDestinations />
      <Services />
      {/* <TrustBar />    → Fase 4.4 */}
      {/* <Testimonials /> → branch feature/testimonials */}
      {/* <CTASection />  → Fase 4.5 */}
      <Footer />
    </main>
  );
}