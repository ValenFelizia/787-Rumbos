"use client";
import Image from "next/image";
import { Timer } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { featuredDestinations } from "@/lib/constants";
import { useModal } from "@/lib/context/ModalContext";

export function FeaturedDestinations() {
  const { openModal } = useModal();

  return (
    <section id="destinos" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight md:text-4xl text-balance">
            Destinos destacados
          </h2>
          <p className="mt-2 text-[#0b4058]/75 text-pretty">
            Algunos de los destinos que podemos armar para vos.
          </p>
        </div>
      </div>
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
        {featuredDestinations.map((destination) => (
          <article
            key={destination.name}
            className="group overflow-hidden rounded-2xl border border-[#0b4058]/10 bg-white shadow-sm shadow-[#0b4058]/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#0b4058]/20 hover:shadow-xl hover:shadow-[#0b4058]/15"
          >
            <div className="relative h-52 w-full">
              <Image
                src={destination.imageSrc}
                alt={`${destination.name} — paquete de viaje con 787 Rumbos`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="space-y-3 p-6">
              <h3
                className="font-[family-name:var(--font-elaine)] text-[1.35rem] font-bold leading-tight transition-colors duration-300 group-hover:text-[#006183]"
              >
                {destination.name}
              </h3>
              <p className="flex items-center gap-2 text-sm font-medium text-[#0b4058]/80">
                <Timer className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                {destination.duration}
              </p>
              <button
                onClick={() => openModal(destination.name)}
                aria-label={`Consultar por viaje a ${destination.name} — abre el cotizador personalizado`}
                className="font-[family-name:var(--font-elaine)] mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b4058] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#006183] active:scale-[0.96] transition-transform duration-200 cursor-pointer"
              >
                <WhatsAppIcon size={14} className="h-3.5 w-3.5" />
                Consultá este destino
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
