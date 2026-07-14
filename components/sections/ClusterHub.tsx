/**
 * components/sections/ClusterHub.tsx
 *
 * Layout compartido para hubs SEO de categoría.
 * Lista solo destinos reales del catálogo + CTA WhatsApp.
 */
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import {
  getClusterDestinations,
  type ClusterPage,
} from "@/lib/clusters-data";
import { getActiveUpcomingDepartures } from "@/lib/destinations-data";
import { AGENCY_PHONE, whatsappLink } from "@/lib/constants";
import { ArrowLeft, ArrowRight, Calendar, Check, MapPin } from "lucide-react";

export function ClusterHub({ cluster }: { cluster: ClusterPage }) {
  const destinations = getClusterDestinations(cluster);
  const whatsappUrl = whatsappLink(AGENCY_PHONE.whatsapp, cluster.whatsappText);

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <Navbar />

      <section className="bg-gradient-to-b from-[#0b4058] to-[#006183] text-white py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-4xl space-y-5">
          <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-[#dae553] transition-colors">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/destinos" className="hover:text-[#dae553] transition-colors">
                  Destinos
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[#dae553] font-semibold" aria-current="page">
                {cluster.title}
              </li>
            </ol>
          </nav>

          <Link
            href="/destinos"
            className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#dae553] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>

          <h1 className="font-[family-name:var(--font-brand-heading)] text-3xl md:text-5xl font-extrabold tracking-tight text-balance">
            {cluster.title}
          </h1>
          <p className="max-w-2xl text-white/85 text-base md:text-lg leading-relaxed text-pretty">
            {cluster.intro}
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 space-y-14">
        {/* Cómo lo armamos */}
        <div className="max-w-2xl space-y-4">
          <h2 className="font-[family-name:var(--font-brand-heading)] text-xl md:text-2xl font-bold tracking-tight">
            Cómo lo armamos en 787 Rumbos
          </h2>
          <ul className="space-y-3">
            {cluster.howWeWork.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm md:text-base text-[#0b4058]/90">
                <Check className="h-5 w-5 text-[#dae553] shrink-0 bg-[#0b4058] rounded-full p-1 mt-0.5" />
                <span className="leading-snug text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Grid de destinos */}
        <div className="space-y-6">
          <h2 className="font-[family-name:var(--font-brand-heading)] text-xl md:text-2xl font-bold tracking-tight">
            Destinos en este catálogo
          </h2>

          {destinations.length === 0 ? (
            <div className="rounded-2xl border border-[#0b4058]/10 bg-white p-8 text-center space-y-4">
              <p className="text-sm text-[#0b4058]/80 text-pretty">
                Ahora no hay salidas grupales publicadas con cupos. Igual armamos tu viaje a medida para las fechas que elijas.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-brand-heading)] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b4058] hover:bg-[#006183] text-white px-6 py-3 text-sm font-bold transition-all active:scale-[0.96]"
              >
                <WhatsAppIcon size={16} className="h-4 w-4" />
                Armar viaje a medida
              </a>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {destinations.map((dest) => {
                const activeDepartures = getActiveUpcomingDepartures(dest);
                return (
                  <article
                    key={dest.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#0b4058]/10 bg-white shadow-sm shadow-[#0b4058]/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#0b4058]/20"
                  >
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={dest.heroImage}
                        alt={`${dest.name} — paquete con 787 Rumbos`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#0b4058] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 border border-black/5">
                        <MapPin className="h-3.5 w-3.5 text-[#e6b451]" />
                        {dest.country}
                      </div>
                      {activeDepartures.length > 0 ? (
                        <div className="absolute top-4 right-4 bg-[#dae553] text-[#0b4058] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {activeDepartures.length}{" "}
                          {activeDepartures.length === 1 ? "salida" : "salidas"}
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 bg-white/95 text-[#0b4058]/80 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-black/5">
                          A medida
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                      <div className="space-y-2">
                        <h3 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold tracking-tight group-hover:text-[#006183] transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-[#0b4058]/80 line-clamp-3 leading-relaxed text-pretty">
                          {dest.description}
                        </p>
                      </div>
                      <Link
                        href={`/destinos/${dest.slug}`}
                        className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b4058] hover:bg-[#006183] text-white py-3 text-sm font-bold transition-all active:scale-[0.96]"
                      >
                        Ver detalles
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA cierre */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0b4058] to-[#00516e] text-white p-8 md:p-10 text-center space-y-5 border border-white/5">
          <h2 className="font-[family-name:var(--font-brand-heading)] text-2xl md:text-3xl font-extrabold tracking-tight text-balance">
            ¿Arrancamos tu cotización?
          </h2>
          <p className="text-white/80 text-sm max-w-xl mx-auto text-pretty">
            Contanos fechas y cantidad de pasajeros. Te respondemos con opciones concretas.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-brand-heading)] inline-flex items-center gap-2 rounded-xl bg-[#dae553] hover:bg-[#c3cf3e] text-[#0b4058] px-8 py-3.5 text-sm font-black shadow-md transition-all active:scale-[0.96]"
          >
            <WhatsAppIcon size={16} className="h-5 w-5" />
            {cluster.ctaLabel}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
