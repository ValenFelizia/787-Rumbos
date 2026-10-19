"use client";

import Image from "next/image";
import Link from "next/link";
import {
  formatCardOriginLine,
  formatHomeCardPriceClause,
  formatShownPriceParts,
  getTransportLabel,
  readHomeDeparture,
} from "@/lib/catalog/logic";
import type { DestinationListing } from "@/lib/catalog/listing";
import { waHref } from "@/lib/wa-recipe";
import { Plane, Bus, ArrowRight, Calendar } from "lucide-react";
import { PrimaryCta, SecondaryCta } from "@/components/conversion";
import { useModal } from "@/lib/context/ModalContext";

export function FeaturedDestinations({
  destinations,
}: {
  destinations: DestinationListing[];
}) {
  const { openModal } = useModal();
  const featured = destinations;

  return (
    <section id="destinos" className="mx-auto w-full max-w-6xl px-6 py-14 md:py-16">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h2 className="font-[family-name:var(--font-brand-heading)] text-3xl font-extrabold tracking-tight md:text-4xl text-[#0b4058] text-balance">
            Próximas salidas
          </h2>
          <p className="max-w-xl text-[#0b4058]/80 text-sm md:text-base leading-relaxed text-pretty">
            Salidas grupales con fecha. Si no está el destino que buscás, lo armamos a medida.
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
          const view = readHomeDeparture(dest);
          const hasActiveDeps = view !== null;
          const transportType = view?.transport ?? "mix";
          const shownPrice = view?.price ?? { kind: "ask" as const };
          const priceParts = formatShownPriceParts(shownPrice);
          const originText = view ? formatCardOriginLine(view.origin) : null;

          return (
            <article
              key={dest.slug}
              className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#0b4058]/10 bg-white shadow-sm shadow-[#0b4058]/5 transition-colors duration-200 hover:border-[#0b4058]/25"
            >
              <Link
                href={`/destinos/${dest.slug}`}
                className="relative block h-56 w-full overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b4058]"
              >
                <Image
                  src={dest.heroImage}
                  alt={`Ver detalles de ${dest.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 border border-black/5 rounded-t-2xl pointer-events-none" aria-hidden />

                <div
                  aria-hidden
                  className="absolute top-3 left-3 bg-[#0b4058]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                >
                  {dest.region === "nacional" ? "Nacional" : "Internacional"}
                </div>

                {view ? (
                  <div
                    aria-hidden
                    className="absolute bottom-3 right-3 bg-[#dae553] text-[#0b4058] px-2.5 py-1 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1"
                  >
                    <Calendar className="h-3 w-3 shrink-0" aria-hidden />
                    <span>Salida: {view.displayDate}</span>
                  </div>
                ) : (
                  <div
                    aria-hidden
                    className="absolute bottom-3 right-3 bg-white/95 text-[#0b4058]/70 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm border border-black/5"
                  >
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

                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#0b4058]/70">
                    {transportType === "aereo" || transportType === "mix" ? (
                      <Plane className="h-3.5 w-3.5 text-sky-600 shrink-0" aria-hidden />
                    ) : (
                      <Bus className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden />
                    )}
                    <span className="font-semibold uppercase tracking-wider text-[10px]">
                      {view?.origin === "bus" ? "Bus" : getTransportLabel(transportType)}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="italic">
                      {view ? `${view.nights} noches` : "Itinerario flexible"}
                    </span>
                    {originText && view?.origin === "cordoba-or-ezeiza" ? (
                      <>
                        <span aria-hidden>·</span>
                        <span className="text-[11px] text-[#0b4058]/70">{originText}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#0b4058]/5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                    <span className="text-[10px] text-[#0b4058]/75 uppercase font-black tracking-wider">
                      Tarifa base
                    </span>
                    <div className="min-w-0 text-right">
                      {priceParts.kind === "amount" ? (
                        <div>
                          <div className="flex flex-wrap items-baseline justify-end gap-x-1.5">
                            <span className="text-xs font-bold text-[#006183]">
                              {priceParts.prefix}
                            </span>
                            <span className="whitespace-nowrap tabular-nums text-lg font-extrabold text-[#0b4058]">
                              {priceParts.amount}
                            </span>
                          </div>
                          {dest.priceNote ? (
                            <p className="mt-0.5 text-[10px] text-[#0b4058]/75 text-pretty">{dest.priceNote}</p>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-[#0b4058]/80">
                          {priceParts.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/destinos/${dest.slug}`}
                    className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0b4058] hover:bg-[#006183] text-white py-2.5 text-xs font-bold transition-all duration-200 active:scale-[0.96]"
                  >
                    <span>{hasActiveDeps ? "Ver detalles y salidas" : "Consultar este destino"}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>

                  {view && dest.name.trim() ? (
                    <SecondaryCta
                      size="full"
                      label="Consultar esta salida"
                      href={waHref({
                        id: "home-card",
                        destinationName: dest.name,
                        displayDate: view.displayDate,
                        priceClause: formatHomeCardPriceClause(shownPrice),
                      })}
                      aria-label={`Consultar esta salida a ${dest.name} por WhatsApp`}
                    />
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-14 border-t border-[#0b4058]/15 pt-10 text-center">
        <div className="mx-auto max-w-2xl space-y-3">
          <h3 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold tracking-tight text-[#0b4058] md:text-2xl text-balance">
            ¿Buscás otro destino?
          </h3>
          <p className="text-sm leading-relaxed text-[#0b4058]/75 text-pretty">
            Tenemos más salidas y armamos itinerarios a medida, nacionales e internacionales. También podés consultarnos por cualquier otro destino.
          </p>
        </div>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <PrimaryCta
            onClick={() => openModal()}
            aria-label="Armar viaje — abre el cotizador personalizado"
            className="font-bold"
          />
          <SecondaryCta
            href={waHref({ id: "home-grid" })}
            aria-label="Escribinos por WhatsApp — abre el chat directo"
            className="font-bold"
          />
        </div>
        <Link
          href="/destinos"
          className="font-[family-name:var(--font-brand-heading)] mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#006183] transition-colors hover:text-[#0b4058]"
        >
          <span>Explorar todos los destinos</span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </section>
  );
}
