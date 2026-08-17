/**
 * app/page.tsx — Compositor de la página de inicio (`/`).
 *
 * Ensambla las secciones en orden. Cada sección vive en `components/sections/`.
 * Motion estratégico vive en Hero / AboutUs (CSS), no en reveals por sección.
 */
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { PartnersMarquee } from "@/components/sections/PartnersMarquee";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { AboutUs } from "@/components/sections/AboutUs";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { FeaturedDestinations } from "@/components/sections/FeaturedDestinations";
import { SpecialPromo } from "@/components/sections/SpecialPromo";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <SpecialPromo />
      <Navbar isHome />
      <Hero />
      <TrustBar />
      <AboutUs />
      <PartnersMarquee />
      <ValueProposition />
      <FeaturedDestinations />
      <Testimonials />
      <Services />
      <InstagramFeed />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
