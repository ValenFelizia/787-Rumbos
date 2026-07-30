/**
 * components/sections/AereosHub.tsx
 *
 * Layout del hub `/aereos`. Lista solo aerolíneas `published` + CTA WhatsApp.
 * Identidad y ritmo alineados a ClusterHub; sin cards decorativas.
 */
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FAQ } from "@/components/sections/FAQ";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import {
  AEREOS_BASE_PATH,
  aereosHub,
  getPublishedAirlines,
} from "@/lib/airlines-data";
import {
  AGENCY_PHONE,
  GOOGLE_MAPS_LINK,
  OFFICE_HOURS,
  whatsappLink,
} from "@/lib/constants";
import { ArrowRight, Check, MapPin } from "lucide-react";

export function AereosHub() {
  const airlines = getPublishedAirlines();
  const whatsappUrl = whatsappLink(
    AGENCY_PHONE.whatsapp,
    aereosHub.whatsappText
  );

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b4058] to-[#006183] px-6 py-16 text-white md:py-20">
        <div className="relative z-10 mx-auto max-w-4xl space-y-5">
          <nav aria-label="Breadcrumb" className="text-xs text-white/70 md:text-sm">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition-colors hover:text-[#dae553]">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-[#dae553]" aria-current="page">
                Aéreos
              </li>
            </ol>
          </nav>

          <h1 className="font-[family-name:var(--font-elaine)] text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            {aereosHub.title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-pretty text-white/85 md:text-lg">
            {aereosHub.intro}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-elaine)] inline-flex items-center gap-2 rounded-xl bg-[#dae553] px-6 py-3 text-sm font-black text-[#0b4058] shadow-md transition-all hover:bg-[#c3cf3e] active:scale-[0.96]"
          >
            <WhatsAppIcon size={16} className="h-4 w-4" />
            {aereosHub.ctaLabel}
          </a>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-14 px-6 py-12">
        <div className="max-w-2xl space-y-4">
          <h2 className="font-[family-name:var(--font-elaine)] text-xl font-bold tracking-tight md:text-2xl">
            Cómo cotizamos tu vuelo
          </h2>
          <ul className="space-y-3">
            {aereosHub.howWeWork.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-[#0b4058]/90 md:text-base"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[#0b4058] p-1 text-[#dae553]" />
                <span className="leading-snug text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <h2 className="font-[family-name:var(--font-elaine)] text-xl font-bold tracking-tight md:text-2xl">
            Algunas de las aerolíneas con las que trabajamos
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-[#0b4058]/80 text-pretty md:text-base">
            Empezá por la que te interesa. Si no la ves acá, igual cotizamos:
            escribinos y te armamos opciones.
          </p>

          {airlines.length === 0 ? (
            <p className="text-sm text-[#0b4058]/80">
              Pronto vamos a publicar landings por aerolínea. Mientras tanto,{" "}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#006183] underline decoration-[#006183]/30 underline-offset-2"
              >
                cotizá por WhatsApp
              </a>
              .
            </p>
          ) : (
            <ul className="divide-y divide-[#0b4058]/10 border-y border-[#0b4058]/10">
              {airlines.map((airline) => (
                <li key={airline.id}>
                  <Link
                    href={`${AEREOS_BASE_PATH}/${airline.slug}`}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-white/60"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      {airline.logo ? (
                        <span className="flex h-10 w-28 shrink-0 items-center justify-start rounded-lg bg-white px-2">
                          <Image
                            src={airline.logo.src}
                            alt={airline.logo.alt}
                            width={airline.logo.width}
                            height={airline.logo.height}
                            className="h-5 w-auto max-w-full object-contain object-left"
                          />
                        </span>
                      ) : null}
                      <span className="min-w-0">
                        <span className="font-[family-name:var(--font-elaine)] block text-base font-bold tracking-tight group-hover:text-[#006183]">
                          {airline.displayName} en Córdoba
                        </span>
                        <span className="mt-0.5 block text-sm text-[#0b4058]/70">
                          Cotización y emisión con atención humana
                        </span>
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#0b4058]/40 transition-transform group-hover:translate-x-1 group-hover:text-[#006183]" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="max-w-2xl space-y-3 border-t border-[#0b4058]/10 pt-10">
          <h2 className="font-[family-name:var(--font-elaine)] flex items-center gap-2 text-xl font-bold tracking-tight md:text-2xl">
            <MapPin className="h-5 w-5 text-[#e6b451]" aria-hidden />
            Oficina en el aeropuerto
          </h2>
          <p className="text-sm leading-relaxed text-[#0b4058]/85 text-pretty md:text-base">
            Hall de arribos, Aeropuerto Internacional de Córdoba, dentro del
            local oficial de Vía Bariloche. {OFFICE_HOURS.weekdays}.{" "}
            {OFFICE_HOURS.saturday}. {OFFICE_HOURS.sunday}.
          </p>
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-semibold text-[#006183] underline decoration-[#006183]/30 underline-offset-2 hover:text-[#0b4058]"
          >
            Ver ubicación en Maps
          </a>
        </div>

        <div className="max-w-2xl space-y-3">
          <p className="text-sm leading-relaxed text-[#0b4058]/80 text-pretty md:text-base">
            {aereosHub.crossSellNote}{" "}
            <Link
              href="/destinos"
              className="font-semibold text-[#006183] underline decoration-[#006183]/30 underline-offset-2 hover:text-[#0b4058]"
            >
              Ver destinos
            </Link>
            .
          </p>
        </div>
      </section>

      <FAQ
        items={aereosHub.faq}
        id="aereos-faq"
        headingId="aereos-faq-heading"
        title="Preguntas frecuentes sobre pasajes aéreos"
        compact
        description={
          <>
            ¿Otra duda?{" "}
            <a
              href={whatsappUrl}
              className="font-semibold text-[#006183] underline decoration-[#006183]/30 underline-offset-2 transition-colors hover:text-[#0b4058]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribinos por WhatsApp
            </a>
            .
          </>
        }
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="space-y-5 rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b4058] to-[#00516e] p-8 text-center text-white md:p-10">
          <h2 className="font-[family-name:var(--font-elaine)] text-2xl font-extrabold tracking-tight text-balance md:text-3xl">
            ¿Cotizamos tu vuelo?
          </h2>
          <p className="mx-auto max-w-xl text-sm text-pretty text-white/80">
            Contanos origen, destino, fechas y pasajeros. Te respondemos con
            opciones concretas en horario de atención.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-elaine)] inline-flex items-center gap-2 rounded-xl bg-[#dae553] px-8 py-3.5 text-sm font-black text-[#0b4058] shadow-md transition-all hover:bg-[#c3cf3e] active:scale-[0.96]"
          >
            <WhatsAppIcon size={16} className="h-5 w-5" />
            {aereosHub.ctaLabel}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
