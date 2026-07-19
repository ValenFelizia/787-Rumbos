"use client";
import Image from "next/image";
import { PrimaryCta, SecondaryCta, CTA_SLA_TEXT } from "@/components/conversion";
import { useModal } from "@/lib/context/ModalContext";

export function Hero() {
  const { openModal } = useModal();

  return (
    <section className="relative flex min-h-[calc(100vh-73px)] items-center overflow-hidden">
      {/* Imagen de fondo optimizada — priority evita lazy loading en el LCP */}
      <Image
        src="/hero-bg.jpg"
        alt="Paisaje de viaje — 787 Rumbos agencia de viajes en Córdoba"
        fill
        priority
        quality={80}
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Overlay: en mobile de abajo hacia arriba (el texto está centrado),
          en desktop de izquierda a derecha (el texto está alineado a la izquierda) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b4058]/90 via-[#0b4058]/60 to-[#0b4058]/30 md:bg-gradient-to-r md:from-[#0b4058]/85 md:via-[#0b4058]/50 md:to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-white md:py-28">
        <div className="motion-hero-enter max-w-3xl space-y-6">
          <h1
            className="font-[family-name:var(--font-elaine)] text-[2rem] font-extrabold leading-tight tracking-tight sm:text-4xl md:text-6xl text-balance"
          >
            787 Rumbos: tu agencia en el Aeropuerto de Córdoba
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/90 md:text-[1.08rem]">
            Paquetes aéreos y pasajes terrestres con Vía Bariloche y Vía Tac. Te asesoramos por WhatsApp o en persona para que viajes con tranquilidad y con nuestro respaldo de principio a fin.
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
          <p className="pl-1 text-xs text-white/70">{CTA_SLA_TEXT}</p>
        </div>
      </div>
    </section>
  );
}
