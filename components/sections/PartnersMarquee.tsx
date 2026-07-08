/**
 * components/sections/PartnersMarquee.tsx
 *
 * Banner animado infinito de aerolíneas socias.
 * Aporta credibilidad mostrando con quién opera 787 Rumbos directamente.
 *
 * Loop seamless: un solo track con dos secuencias idénticas (cada una con
 * padding-right = gap). Se anima translateX(0 → -50%) para que el reinicio
 * coincida exactamente con el inicio de la segunda secuencia.
 */
import Image from "next/image";
import { partnerLogos } from "@/lib/constants";

function LogoRow({
  logos,
  ariaHidden = false,
}: {
  logos: typeof partnerLogos;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12 md:gap-20 md:pr-20"
      aria-hidden={ariaHidden || undefined}
    >
      {logos.map((logo, index) => (
        <div
          key={ariaHidden ? `${logo.name}-clone-${index}` : logo.name}
          className="flex shrink-0 items-center justify-center py-0.5 grayscale opacity-50 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
        >
          <Image
            src={logo.imageSrc}
            alt={ariaHidden ? "" : logo.name}
            width={logo.width}
            height={logo.height}
            className="h-8 w-auto max-w-none object-contain md:h-9"
          />
        </div>
      ))}
    </div>
  );
}

export function PartnersMarquee() {
  return (
    <section
      aria-label="Compañías asociadas"
      className="w-full overflow-hidden border-y border-[#0b4058]/5 bg-white py-6 md:py-8"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-6 text-center font-[family-name:var(--font-elaine)] text-xs font-semibold uppercase tracking-wider text-[#0b4058]/40">
          Viajá con las mejores compañías
        </p>

        <div className="group relative w-full overflow-hidden">
          {/* Un solo track animado: dos mitades idénticas → -50% = loop sin salto */}
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            <LogoRow logos={partnerLogos} />
            <LogoRow logos={partnerLogos} ariaHidden />
          </div>
        </div>
      </div>
    </section>
  );
}
