"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import {
  DESTINOS_CURRENCY_FILTER_OPTIONS,
  DESTINOS_SORT_OPTIONS,
  filterDestinationsByCurrency,
  filterDestinationsByDepartureMonth,
  formatDepartureMonthLabel,
  getActiveUpcomingDepartures,
  getListedPrice,
  getTransportLabel,
  groupDestinationsForSort,
  hasExpiredListedPrice,
  isPriceSortMode,
  listAvailableDepartureMonths,
  resolveSelectedDepartureMonth,
  type DepartureMonthKey,
  type DestinosCurrencyFilter,
  type DestinosSortMode,
} from "@/lib/catalog/logic";
import type { DestinationPage } from "@/lib/catalog/types";
import { clustersData, getClusterCardStats } from "@/lib/clusters-data";
import { AGENCY_PHONE, whatsappLink } from "@/lib/constants";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ClusterCard } from "@/components/sections/ClusterCard";
import { CTA_PRIMARY_LABEL } from "@/components/conversion";
import { useModal } from "@/lib/context/ModalContext";

function CardListedPrice({ dest }: { dest: DestinationPage }) {
  const listed = getListedPrice(dest);
  if (listed) {
    return (
      <div>
        <p className="leading-none">
          <span className="text-xs font-bold text-[#006183] mr-1">Desde</span>
          <span className="text-xl font-extrabold text-[#0b4058] tabular-nums">
            {listed.currency === "USD" ? "USD" : "$"}
            {listed.amount.toLocaleString("es-AR")}
          </span>
        </p>
        <p className="text-[10px] text-[#0b4058]/60 mt-0.5">
          {dest.priceNote || "por persona en base doble"}
        </p>
      </div>
    );
  }
  if (hasExpiredListedPrice(dest)) {
    return <p className="text-sm font-bold text-[#0b4058]/70">Consultá precio actualizado</p>;
  }
  return <p className="text-sm font-bold text-[#0b4058]/70">Consultar tarifa</p>;
}

function DestinationCard({ dest }: { dest: DestinationPage }) {
  const { openModal } = useModal();
  const activeDepartures = getActiveUpcomingDepartures(dest);
  const isF1 = dest.slug === "f1-grand-premio-sao-paulo";

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
        isF1
          ? "border-red-600/30 shadow-red-600/5 hover:border-red-600/40 hover:shadow-red-600/10"
          : "border-[#0b4058]/10 shadow-[#0b4058]/5 hover:border-[#0b4058]/20 hover:shadow-[#0b4058]/15"
      }`}
    >
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={dest.heroImage}
          alt={`${dest.name} — paquete de viaje con 787 Rumbos`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b4058]/55 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 bg-white/95 text-[#0b4058] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 border border-black/5">
          <MapPin className="h-3.5 w-3.5 text-[#e6b451] shrink-0" aria-hidden />
          <span>{dest.country}</span>
        </div>
        {activeDepartures.length > 0 ? (
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
            <div className="min-w-0 flex items-center gap-2 rounded-lg bg-[#dae553] px-3 py-2 text-[#0b4058] shadow-sm">
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <div className="min-w-0 leading-tight">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#0b4058]/70">
                  Próxima salida
                </p>
                <p className="text-xs font-extrabold truncate">
                  {activeDepartures[0].displayDate}
                  <span className="font-semibold text-[#0b4058]/70">
                    {" "}
                    · {getTransportLabel(activeDepartures[0].transport)}
                  </span>
                </p>
              </div>
            </div>
            {activeDepartures.length > 1 && (
              <span className="shrink-0 rounded-lg bg-white/95 px-2.5 py-2 text-[10px] font-bold text-[#0b4058] border border-black/5 tabular-nums">
                +{activeDepartures.length - 1} más
              </span>
            )}
          </div>
        ) : (
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-flex rounded-lg bg-white/95 px-3 py-2 text-xs font-bold text-[#0b4058]/75 border border-black/5">
              Consultar fechas
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#006183] bg-[#006183]/5 px-2 py-0.5 rounded">
              {dest.region === "nacional" ? "Nacional" : "Internacional"}
            </span>
            {isF1 && (
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-white bg-red-600 px-2 py-0.5 rounded">
                🏎️ Salida Especial
              </span>
            )}
          </div>
          <h2 className="font-[family-name:var(--font-brand-heading)] text-2xl font-bold tracking-tight text-[#0b4058] group-hover:text-[#006183] transition-colors duration-200">
            {dest.name}
          </h2>
          {/* Precio alto en la card (QOL-02): visible junto al título, sin depender del bloque inferior */}
          <CardListedPrice dest={dest} />
          <p className="text-sm text-[#0b4058]/80 line-clamp-3 leading-relaxed text-pretty">
            {dest.description}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#0b4058]/5">
          <Link
            href={`/destinos/${dest.slug}`}
            className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b4058] hover:bg-[#006183] text-white py-3 text-sm font-bold transition-all duration-200 active:scale-[0.96]"
          >
            <span>Ver salidas y detalles</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          {/* QOL-05: secundario abre cotizador prefilled (paridad con FeaturedDestinations / D5) */}
          <button
            type="button"
            onClick={() => openModal(dest.name)}
            aria-label={`Armar viaje: ${dest.name} — abre el cotizador`}
            className="font-[family-name:var(--font-elaine)] flex w-full items-center justify-center rounded-xl border-2 border-[#f7a92a] bg-transparent px-3 py-3 text-sm font-bold text-[#0b4058] transition-all duration-200 hover:bg-gradient-to-r hover:from-[#f7a92a] hover:to-[#e6b451] active:scale-[0.96] cursor-pointer"
          >
            {CTA_PRIMARY_LABEL}
          </button>
        </div>
      </div>
    </article>
  );
}

function monthFilterEmptyWhatsApp(monthLabel: string): string {
  return whatsappLink(
    AGENCY_PHONE.whatsapp,
    `Hola 787 Rumbos! Estuve mirando salidas de ${monthLabel} en la web y no encontré lo que buscaba. ¿Me ayudan a armar algo para ese mes? (Web - Destinos filtro mes)`,
  );
}

export function DestinosView({ destinations }: { destinations: DestinationPage[] }) {
  const [filter, setFilter] = useState<"todos" | "nacional" | "internacional">("todos");
  const [sortMode, setSortMode] = useState<DestinosSortMode>("featured");
  const [currencyFilter, setCurrencyFilter] = useState<DestinosCurrencyFilter>("all");
  const [monthKey, setMonthKey] = useState<DepartureMonthKey | null>(null);

  const showCurrencyChip = isPriceSortMode(sortMode);

  const filteredByRegion = destinations.filter((d) => {
    if (filter === "todos") return true;
    return d.region === filter;
  });

  // Chips scoped to the active region so a visible month never yields 0 for that region.
  const monthOptions = listAvailableDepartureMonths(filteredByRegion);
  const effectiveMonth = resolveSelectedDepartureMonth(monthKey, monthOptions);

  // Pipeline: region → month → currency (when sorting by price) → sort/grouping
  const filteredByMonth = filterDestinationsByDepartureMonth(
    filteredByRegion,
    effectiveMonth,
  );

  const currencyScoped = showCurrencyChip
    ? filterDestinationsByCurrency(filteredByMonth, currencyFilter)
    : filteredByMonth;

  const destinationGroups = groupDestinationsForSort(currencyScoped, sortMode, {
    catalogOrder: destinations,
  });

  const resultCount = destinationGroups.reduce((sum, group) => sum + group.items.length, 0);
  const selectedMonthLabel = effectiveMonth
    ? formatDepartureMonthLabel(effectiveMonth)
    : null;
  // Fallback empty state (kept for future filters); region-scoped chips avoid the common case.
  const showMonthEmpty = Boolean(effectiveMonth && resultCount === 0);

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <Navbar />

      {/* Header Section — lower on mobile so cluster cards + grid start fit (D4) */}
      <section className="bg-gradient-to-b from-[#0b4058] to-[#006183] text-white py-10 md:py-16 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto space-y-3 md:space-y-4">
          <h1 className="font-[family-name:var(--font-brand-heading)] text-3xl md:text-6xl font-extrabold tracking-tight text-balance">
            Elegí tu próximo rumbo
          </h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm md:text-lg text-pretty">
            Explorá nuestras salidas grupales confirmadas y paquetes a medida. Asesoramiento 100% humano desde Córdoba.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Main Catalog Section */}
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-12">
        {/* Hubs SEO — visual cluster cards (QOL-03 / IA alt. B); horizontal scroll on mobile */}
        <nav aria-label="Catálogos desde Córdoba" className="mb-8 md:mb-10">
          <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
            {clustersData.map((cluster) => {
              const stats = getClusterCardStats(cluster, destinations);
              return (
                <ClusterCard
                  key={cluster.id}
                  href={`/destinos/${cluster.slug}`}
                  title={cluster.shortTitle}
                  line={cluster.cardLine}
                  image={cluster.cardImage}
                  imageAlt={cluster.cardImageAlt}
                  destinationCount={stats.destinationCount}
                  departureCount={stats.departureCount}
                  className="w-[min(72vw,17.5rem)] shrink-0 snap-start md:w-auto"
                />
              );
            })}
          </div>
        </nav>

        {/* Region filter + Ordenar + Moneda (QOL-02); month chips in their own row below */}
        <div className="mb-5 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-3">
          <div
            className="bg-white p-1.5 rounded-full border border-[#0b4058]/10 shadow-sm flex gap-1"
            role="group"
            aria-label="Filtrar por región"
          >
            {(["todos", "nacional", "internacional"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilter(type)}
                aria-pressed={filter === type}
                className={`px-5 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 capitalize cursor-pointer active:scale-95 ${
                  filter === type
                    ? "bg-[#0b4058] text-white shadow-sm"
                    : "text-[#0b4058]/70 hover:text-[#0b4058] hover:bg-[#0b4058]/5"
                }`}
              >
                {type === "todos" ? "Todos" : type === "nacional" ? "Nacionales" : "Internacionales"}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2.5 text-sm text-[#0b4058]/75">
            <span className="font-semibold tracking-wide">Ordenar</span>
            <select
              value={sortMode}
              onChange={(e) => {
                const next = e.target.value as DestinosSortMode;
                setSortMode(next);
                if (!isPriceSortMode(next)) setCurrencyFilter("all");
              }}
              aria-label="Ordenar destinos"
              className="min-w-[12.5rem] appearance-none rounded-full border border-[#0b4058]/15 bg-white bg-[length:0.85rem] bg-[right_0.85rem_center] bg-no-repeat py-2 pl-4 pr-9 text-sm font-semibold text-[#0b4058] shadow-sm transition-colors hover:border-[#0b4058]/30 focus:border-[#0b4058]/40 focus:outline-none focus:ring-2 focus:ring-[#0b4058]/15 cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230b4058' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              }}
            >
              {DESTINOS_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {showCurrencyChip ? (
            <div
              className="inline-flex flex-wrap items-center gap-2 text-sm text-[#0b4058]/75"
              role="group"
              aria-label="Filtrar por moneda"
            >
              <span className="font-semibold tracking-wide">Moneda:</span>
              <div className="bg-white p-1 rounded-full border border-[#0b4058]/10 shadow-sm flex gap-0.5">
                {DESTINOS_CURRENCY_FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCurrencyFilter(option.value)}
                    aria-pressed={currencyFilter === option.value}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                      currencyFilter === option.value
                        ? "bg-[#0b4058] text-white shadow-sm"
                        : "text-[#0b4058]/70 hover:text-[#0b4058] hover:bg-[#0b4058]/5"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Month-of-departure chips (own row under region/sort/currency) */}
        {monthOptions.length > 0 ? (
          <div
            className="mb-12 flex flex-col items-center gap-3"
            role="group"
            aria-label="Filtrar por mes de salida"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0b4058]/45">
              Mes de salida
            </p>
            <div className="flex max-w-full flex-wrap justify-center gap-2">
              {monthOptions.map((option) => {
                const selected = effectiveMonth === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setMonthKey(selected ? null : option.key)}
                    aria-pressed={selected}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                      selected
                        ? "border-[#0b4058] bg-[#0b4058] text-white shadow-sm"
                        : "border-[#0b4058]/15 bg-white text-[#0b4058]/75 shadow-sm hover:border-[#0b4058]/30 hover:text-[#0b4058]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-12" />
        )}

        {/* Grid of Destinations (bloques de moneda solo al ordenar por precio con mix) */}
        {showMonthEmpty && selectedMonthLabel ? (
          <div
            className="rounded-3xl border border-[#0b4058]/10 bg-white px-6 py-12 text-center shadow-sm"
            role="status"
            aria-live="polite"
          >
            <h2 className="font-[family-name:var(--font-brand-heading)] text-2xl font-extrabold tracking-tight text-[#0b4058]">
              No hay salidas en {selectedMonthLabel}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#0b4058]/70 text-pretty">
              Con el filtro actual no encontramos destinos con salida activa ese mes. Escribinos y te
              armamos opciones a medida.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setMonthKey(null)}
                className="rounded-xl border border-[#0b4058]/20 bg-white px-5 py-3 text-sm font-bold text-[#0b4058] transition-colors hover:border-[#0b4058]/35 hover:bg-[#0b4058]/5 cursor-pointer"
              >
                Ver todos los meses
              </button>
              <a
                href={monthFilterEmptyWhatsApp(selectedMonthLabel)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-brand-heading)] inline-flex items-center gap-2 rounded-xl bg-[#dae553] px-5 py-3 text-sm font-black text-[#0b4058] shadow-md transition-all duration-200 hover:bg-[#c3cf3e] active:scale-[0.96]"
              >
                <WhatsAppIcon size={14} className="h-5 w-5 shrink-0" />
                <span>Consultar salidas de {selectedMonthLabel}</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {destinationGroups.map((group, groupIndex) => (
              <div key={group.heading ?? `group-${groupIndex}`} className="space-y-5">
                {group.heading ? (
                  <h3 className="font-[family-name:var(--font-brand-heading)] text-sm font-bold uppercase tracking-[0.18em] text-[#0b4058]/45">
                    {group.heading}
                  </h3>
                ) : null}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((dest) => (
                    <DestinationCard key={dest.slug} dest={dest} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Banner Editorial Final */}
        <div className="bg-gradient-to-br from-[#0b4058] to-[#00516e] text-white p-8 md:p-12 rounded-3xl mt-16 shadow-xl shadow-[#0b4058]/10 text-center relative overflow-hidden flex flex-col items-center justify-center gap-6 border border-white/5">
          <div className="space-y-2 relative z-10 max-w-2xl">
            <h3 className="font-[family-name:var(--font-brand-heading)] text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              ¿No encontrás tu destino ideal?
            </h3>
            <p className="text-white/80 text-xs md:text-sm leading-relaxed text-pretty">
              ¡No te preocupés! Recordá que 787 Rumbos es una agencia totalmente flexible. Tenemos convenios directos con múltiples operadores y aerolíneas para diseñar a medida el viaje de tus sueños a cualquier lugar del mundo.
            </p>
          </div>
          <a
            href={whatsappLink(
              AGENCY_PHONE.whatsapp,
              "Hola, estuve viendo la web pero no encontré el destino que buscaba. Me gustaría consultar por...",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-brand-heading)] relative z-10 inline-flex items-center gap-2 rounded-xl bg-[#dae553] hover:bg-[#c3cf3e] text-[#0b4058] px-8 py-3.5 text-sm font-black shadow-md transition-all duration-200 active:scale-[0.96] cursor-pointer"
          >
            <WhatsAppIcon size={14} className="h-5 w-5 shrink-0" />
            <span>Consultar por mi viaje a medida</span>
          </a>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
