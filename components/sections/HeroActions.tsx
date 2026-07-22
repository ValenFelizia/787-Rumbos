"use client";

import { PrimaryCta, SecondaryCta, CTA_SLA_TEXT } from "@/components/conversion";
import { useModal } from "@/lib/context/ModalContext";

/** CTAs del hero — isla cliente; la imagen LCP vive en el RSC padre. */
export function HeroActions() {
  const { openModal } = useModal();

  return (
    <div className="motion-hero-enter max-w-3xl space-y-6">
      <h1 className="font-[family-name:var(--font-elaine)] text-[2rem] font-extrabold leading-tight tracking-tight sm:text-4xl md:text-6xl text-balance">
        787 Rumbos: tu agencia en el Aeropuerto de Córdoba
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-white/90 md:text-[1.08rem]">
        Paquetes aéreos y pasajes terrestres con Vía Bariloche y Vía Tac. Te asesoramos por
        WhatsApp o en persona para que viajes con tranquilidad y con nuestro respaldo de
        principio a fin.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryCta
            onClick={() => openModal()}
            aria-label="Armar viaje — abre el cotizador personalizado"
          />
          <SecondaryCta
            className="shadow-md shadow-black/10"
            aria-label="Escribinos por WhatsApp — abre el chat directo"
          />
        </div>
      </div>
      <p className="pl-1 text-xs text-white/80">{CTA_SLA_TEXT}</p>
    </div>
  );
}
