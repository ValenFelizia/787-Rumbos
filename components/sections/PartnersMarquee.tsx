/**
 * components/sections/PartnersMarquee.tsx
 *
 * Banner animado infinito de aerolíneas socias.
 * Aporta credibilidad mostrando con quién opera 787 Rumbos directamente.
 */
import Image from "next/image";
import { partnerLogos } from "@/lib/constants";

export function PartnersMarquee() {
  return (
    <section
      aria-label="Aerolíneas asociadas"
      className="w-full overflow-hidden border-y border-[#0b4058]/5 bg-white py-6 md:py-8"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Título de sección sutil */}
        <p className="mb-6 text-center font-[family-name:var(--font-elaine)] text-xs font-semibold uppercase tracking-wider text-[#0b4058]/40">
          Volá con las mejores aerolíneas
        </p>
        
        {/* Contenedor del carrusel */}
        <div className="relative flex w-full overflow-hidden">
          {/* Track de movimiento */}
          {/* ponytail: duplicate logo list to enable seamless loop using pure CSS transform animation */}
          <div className="flex shrink-0 gap-12 md:gap-20 animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
            {/* Lista original */}
            {partnerLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center grayscale opacity-50 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
              >
                <Image
                  src={logo.imageSrc}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="h-8 w-auto object-contain md:h-9"
                />
              </div>
            ))}
            
            {/* Lista duplicada para loop infinito (oculta para lectores de pantalla) */}
            {partnerLogos.map((logo, index) => (
              <div
                key={`${logo.name}-clone-${index}`}
                aria-hidden="true"
                className="flex items-center justify-center grayscale opacity-50 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
              >
                <Image
                  src={logo.imageSrc}
                  alt=""
                  width={logo.width}
                  height={logo.height}
                  className="h-8 w-auto object-contain md:h-9"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
