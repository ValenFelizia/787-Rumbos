/**
 * app/page.tsx — Compositor de la página de inicio (`/`).
 *
 * Ensambla las secciones en orden. Cada sección vive en `components/sections/`.
 * Las secciones se envuelven en <ScrollReveal> para el efecto de entrada por scroll.
 * El hero NO tiene ScrollReveal porque es el primer elemento visible — no tiene
 * sentido que empiece invisible.
 */
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { PartnersMarquee } from "@/components/sections/PartnersMarquee";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { AboutUs } from "@/components/sections/AboutUs";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { FeaturedDestinations } from "@/components/sections/FeaturedDestinations";
import { SpecialPromo } from "@/components/sections/SpecialPromo"; // ponytail: added for São Paulo F1 promo
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/sections/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <SpecialPromo />
      <Navbar />
      <Hero />
      <TrustBar />
      {/* AboutUs temprano: evidencia humana/lugar antes del catálogo */}
      <AboutUs />
      <PartnersMarquee />
      <ScrollReveal>
        <ValueProposition />
      </ScrollReveal>
      <ScrollReveal>
        <FeaturedDestinations />
      </ScrollReveal>
      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal>
        <Services />
      </ScrollReveal>
      <ScrollReveal>
        <InstagramFeed />
      </ScrollReveal>
      <ScrollReveal>
        <FAQ />
      </ScrollReveal>
      <ScrollReveal>
        <CTASection />
      </ScrollReveal>
      <Footer />
    </main>
  );
}
