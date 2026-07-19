/**
 * components/sections/PartnersMarquee.tsx
 *
 * Banner animado infinito de aerolíneas socias.
 * Aporta credibilidad mostrando con quién opera 787 Rumbos directamente.
 *
 * Loop seamless vía react-fast-marquee (mide anchos reales + autoFill).
 */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { partnerLogos } from "@/lib/constants";

export function PartnersMarquee() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section
      aria-label="Compañías asociadas"
      className="w-full overflow-hidden border-y border-[#0b4058]/5 bg-white py-6 md:py-8"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-6 text-center font-[family-name:var(--font-elaine)] text-xs font-semibold uppercase tracking-wider text-[#0b4058]/40">
          Viajá con las mejores compañías
        </p>

        <Marquee
          autoFill
          pauseOnHover
          gradient={false}
          play={!reduceMotion}
          speed={25}
        >
          {partnerLogos.map((logo) => (
            <div
              key={logo.name}
              className="mx-6 flex shrink-0 items-center justify-center py-0.5 grayscale opacity-50 transition-all duration-300 hover:grayscale-0 hover:opacity-100 md:mx-10"
            >
              <Image
                src={logo.imageSrc}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                className="h-8 w-auto max-w-none object-contain md:h-9"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
