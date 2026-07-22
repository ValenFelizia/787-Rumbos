/**
 * Hero full-bleed — Server Component para que el LCP (imagen) no dependa del bundle cliente.
 * CTAs e interacción viven en HeroActions (isla cliente).
 */
import Image from "next/image";
import { HeroActions } from "@/components/sections/HeroActions";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100vh-73px)] items-center overflow-hidden"
    >
      <Image
        src="/hero-bg.jpg"
        alt="Paisaje de viaje — 787 Rumbos agencia de viajes en Córdoba"
        fill
        priority
        fetchPriority="high"
        decoding="sync"
        quality={70}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b4058]/90 via-[#0b4058]/60 to-[#0b4058]/30 md:bg-gradient-to-r md:from-[#0b4058]/85 md:via-[#0b4058]/50 md:to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-white md:py-28">
        <HeroActions />
      </div>
    </section>
  );
}
