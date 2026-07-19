"use client";

import Image from "next/image";
import Link from "next/link";
import {
  destinationsData,
  DestinationPage,
  getTransportLabel,
} from "@/lib/destinations-data";
import { Plane, Bus, ArrowRight, Calendar } from "lucide-react";
import {
  PrimaryCta,
  SecondaryCta,
  CTA_PRIMARY_LABEL,
} from "@/components/conversion";
import { useModal } from "@/lib/context/ModalContext";

export function FeaturedDestinations() {
  const { openModal } = useModal();
  const featuredSlugs = ["salta", "bariloche", "rio-de-janeiro", "cataratas-del-iguazu"];

  const featured = featuredSlugs
    .map((slug) => destinationsData.find((d) => d.slug === slug))
    .filter((d): d is DestinationPage => !!d);

  return (
    <section id="destinos" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h2 className="font-[family-name:var(--font-brand-heading)] text-3xl font-extrabold tracking-tight md:text-4xl text-[#0b4058] text-balance">
            ¿Cuál es tu próximo rumbo?
          </h2>
          <p className="max-w-xl text-[#0b4058]/80 text-sm md:text-base leading-relaxed text-pretty">
            Explorá nuestras próximas salidas grupales confirmadas desde Córdoba, o planificá tu próximo destino a medida.
          </p>
        </div>
        <Link
          href="/destinos"
          className="font-[family-name:var(--font-brand-heading)] inline-flex shrink-0 items-center gap-2 self-start md:self-auto rounded-xl border-2 border-[#0b4058] bg-transparent px-5 py-2.5 text-xs font-bold text-[#0b4058] transition-all duration-200 hover:bg-[#0b4058] hover:text-white active:scale-[0.96]"
        >
          <span>Explorar todos</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((dest) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const activeDeps = dest.departures.filter(
            (dep) => new Date(dep.date + "T00:00:00") >= today && dep.status !== "sold-out"
          );

          const hasActiveDeps = activeDeps.length > 0;
          const nextDep = hasActiveDeps ? activeDeps[0] : null;
          const transportType = nextDep?.transport ?? "mix";

          return (
            <article
              key={dest.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#0b4058]/10 bg-white shadow-sm shadow-[#0b4058]/5 transition-colors duration-200 hover:border-[#0b4058]/25"
            >
              <Link
                href={`/destinos/${dest.slug}`}
                className="relative block h-56 w-full overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b4058]"
                aria-label={`Ver detalles de ${dest.name}`}
              >
                <Image
                  src={dest.heroImage}
                  alt={`${dest.name} — paquete de viaje con 787 Rumbos`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 border border-black/5 rounded-t-2xl pointer-events-none" />

                <div className="absolute top-3 left-3 bg-[#0b4058]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {dest.region === "nacional" ? "Nacional" : "Internacional"}
                </div>

                {nextDep ? (
                  <div className="absolute bottom-3 right-3 bg-[#dae553] text-[#0b4058] px-2.5 py-1 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" aria-hidden />
                    <span>Salida: {nextDep.displayDate}</span>
                  </div>
                ) : (
                  <div className="absolute bottom-3 right-3 bg-white/95 text-[#0b4058]/70 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm border border-black/5">
                    Consultar fechas
                  </div>
                )}
              </Link>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <h3 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold tracking-tight text-[#0b4058] group-hover:text-[#006183] transition-colors duration-200">
                    <Link
                      href={`/destinos/${dest.slug}`}
                      className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b4058]"
                    >
                      {dest.name}
                    </Link>
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#0b4058]/70">
                    {transportType === "aereo" || transportType === "mix" ? (
                      <Plane className="h-3.5 w-3.5 text-sky-600 shrink-0" aria-hidden />
                    ) : (
                      <Bus className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden />
                    )}
                    <span className="font-semibold uppercase tracking-wider text-[10px] mr-1">
                      {getTransportLabel(transportType)}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="italic">
                      {nextDep ? `${nextDep.nights} noches` : "Itinerario flexible"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#0b4058]/5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10px] text-[#0b4058]/50 uppercase font-black tracking-wider">
                      Tarifa base
                    </span>
                    {dest.priceFrom ? (
                      <div className="text-right">
                        <div>
                          <span className="text-[10px] font-bold text-[#006183] mr-1">Desde</span>
                          <span className="text-lg font-extrabold text-[#0b4058] tabular-nums">
                            {dest.currency === "USD" ? "USD" : "$"}
                            {dest.priceFrom.toLocaleString("es-AR")}
                          </span>
                        </div>
                        {dest.priceNote && (
                          <p className="text-[10px] text-[#0b4058]/60 mt-0.5">{dest.priceNote}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-[#0b4058]/80">Consultar precio</span>
                    )}
                  </div>

                  <Link
                    href={`/destinos/${dest.slug}`}
                    className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0b4058] hover:bg-[#006183] text-white py-2.5 text-xs font-bold transition-all duration-200 active:scale-[0.96]"
                  >
                    <span>{hasActiveDeps ? "Ver detalles y salidas" : "Consultar este destino"}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => openModal(dest.name)}
                    aria-label={`Armar viaje: ${dest.name} — abre el cotizador`}
                    className="font-[family-name:var(--font-elaine)] flex w-full items-center justify-center rounded-xl border-2 border-[#f7a92a] bg-transparent px-3 py-2.5 text-xs font-bold text-[#0b4058] transition-all duration-200 hover:bg-gradient-to-r hover:from-[#f7a92a] hover:to-[#e6b451] active:scale-[0.96] cursor-pointer"
                  >
                    {CTA_PRIMARY_LABEL}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-[#0b4058] to-[#00516e] text-white p-8 md:p-12 rounded-3xl mt-16 shadow-xl shadow-[#0b4058]/10 text-center relative overflow-hidden flex flex-col items-center justify-center gap-6 border border-white/5">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <h3 className="font-[family-name:var(--font-brand-heading)] text-2xl md:text-3xl font-extrabold tracking-tight text-white text-balance">
            ¿Buscás otro destino?
          </h3>
          <p className="text-white/80 text-xs md:text-sm leading-relaxed text-pretty">
            Tenemos salidas confirmadas adicionales y armamos itinerarios a medida nacionales e internacionales con la financiación que necesitás. También podés consultarnos por cualquier otro destino.
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <PrimaryCta
            onClick={() => openModal()}
            aria-label="Armar viaje — abre el cotizador personalizado"
            className="font-bold"
          />
          <SecondaryCta
            aria-label="Escribinos por WhatsApp — abre el chat directo"
            className="font-bold"
          />
        </div>
        <Link
          href="/destinos"
          className="font-[family-name:var(--font-brand-heading)] relative z-10 inline-flex items-center gap-2 rounded-xl border border-white/30 bg-transparent px-6 py-2.5 text-sm font-bold text-white/90 transition-all duration-200 hover:bg-white/10 active:scale-[0.96] cursor-pointer"
        >
          <span>Explorar todos los destinos</span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>

        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}
