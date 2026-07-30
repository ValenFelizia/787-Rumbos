/**
 * components/sections/AirlineLanding.tsx
 *
 * Layout reutilizable para `/aereos/{aerolinea}-cordoba`.
 * Todo el copy variable viene de `AirlinePage` — no clonar este archivo por marca.
 */
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FAQ } from "@/components/sections/FAQ";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import {
  AEREOS_BASE_PATH,
  type AirlinePage,
} from "@/lib/airlines-data";
import {
  AGENCY_PHONE,
  GOOGLE_MAPS_LINK,
  OFFICE_HOURS,
  whatsappLink,
} from "@/lib/constants";
import { ArrowLeft, Check, MapPin } from "lucide-react";

export function AirlineLanding({ airline }: { airline: AirlinePage }) {
  const whatsappUrl = whatsappLink(
    AGENCY_PHONE.whatsapp,
    airline.whatsappText
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://www.787rumbos.com.ar/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Aéreos",
        item: `https://www.787rumbos.com.ar${AEREOS_BASE_PATH}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: airline.h1,
        item: `https://www.787rumbos.com.ar${AEREOS_BASE_PATH}/${airline.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b4058] to-[#006183] px-6 py-16 text-white md:py-20">
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-start gap-5">
          <nav aria-label="Breadcrumb" className="text-xs text-white/70 md:text-sm">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition-colors hover:text-[#dae553]">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={AEREOS_BASE_PATH}
                  className="transition-colors hover:text-[#dae553]"
                >
                  Aéreos
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-[#dae553]" aria-current="page">
                {airline.shortName}
              </li>
            </ol>
          </nav>

          <Link
            href={AEREOS_BASE_PATH}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#dae553] transition-colors hover:text-white md:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a pasajes aéreos
          </Link>

          {airline.logo ? (
            <div className="flex h-10 w-fit max-w-[9rem] items-center rounded-lg bg-white px-3">
              <Image
                src={airline.logo.src}
                alt={airline.logo.alt}
                width={airline.logo.width}
                height={airline.logo.height}
                className="h-5 w-auto max-w-full object-contain object-left"
              />
            </div>
          ) : null}

          <h1 className="font-[family-name:var(--font-elaine)] text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            {airline.h1}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-pretty text-white/85 md:text-lg">
            {airline.intro}
          </p>
          <p className="max-w-2xl border-l-2 border-[#dae553]/80 pl-4 text-sm leading-relaxed text-pretty text-white/75">
            {airline.independenceNote}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-elaine)] inline-flex items-center gap-2 rounded-xl bg-[#dae553] px-6 py-3 text-sm font-black text-[#0b4058] shadow-md transition-all hover:bg-[#c3cf3e] active:scale-[0.96]"
          >
            <WhatsAppIcon size={16} className="h-4 w-4" />
            {airline.ctaLabel}
          </a>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-14 px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-elaine)] text-xl font-bold tracking-tight md:text-2xl">
              Qué resolvemos con {airline.shortName}
            </h2>
            <ul className="space-y-3">
              {airline.whatWeHandle.map((item) => (
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

          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-elaine)] text-xl font-bold tracking-tight md:text-2xl">
              Qué se gestiona con la aerolínea
            </h2>
            <ul className="space-y-3">
              {airline.whatWeRefer.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-[#0b4058]/80 md:text-base"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b4058]/35"
                    aria-hidden
                  />
                  <span className="leading-snug text-pretty">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-2xl space-y-3 border-t border-[#0b4058]/10 pt-10">
          <h2 className="font-[family-name:var(--font-elaine)] flex items-center gap-2 text-xl font-bold tracking-tight md:text-2xl">
            <MapPin className="h-5 w-5 text-[#e6b451]" aria-hidden />
            Atención en el Aeropuerto de Córdoba
          </h2>
          <p className="text-sm leading-relaxed text-[#0b4058]/85 text-pretty md:text-base">
            Hall de arribos, Aeropuerto Internacional de Córdoba, dentro del
            local oficial de Vía Bariloche. {OFFICE_HOURS.weekdays}.{" "}
            {OFFICE_HOURS.saturday}. {OFFICE_HOURS.sunday}.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#006183] underline decoration-[#006183]/30 underline-offset-2 hover:text-[#0b4058]"
            >
              Ver ubicación en Maps
            </a>
            <Link
              href={AEREOS_BASE_PATH}
              className="font-semibold text-[#006183] underline decoration-[#006183]/30 underline-offset-2 hover:text-[#0b4058]"
            >
              Ver pasajes aéreos
            </Link>
            <Link
              href="/#contacto"
              className="font-semibold text-[#006183] underline decoration-[#006183]/30 underline-offset-2 hover:text-[#0b4058]"
            >
              Contacto
            </Link>
          </div>
        </div>
      </section>

      <FAQ
        items={airline.faq}
        id={`${airline.id}-faq`}
        headingId={`${airline.id}-faq-heading`}
        title={`Preguntas frecuentes sobre ${airline.shortName} en Córdoba`}
        compact
        description={
          <>
            ¿Otra consulta?{" "}
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
            Cotizá tu vuelo {airline.shortName}
          </h2>
          <p className="mx-auto max-w-xl text-sm text-pretty text-white/80">
            Contanos fechas y cantidad de pasajeros. Te respondemos con opciones
            concretas, de {airline.shortName} u otra aerolínea si te conviene más.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-elaine)] inline-flex items-center gap-2 rounded-xl bg-[#dae553] px-8 py-3.5 text-sm font-black text-[#0b4058] shadow-md transition-all hover:bg-[#c3cf3e] active:scale-[0.96]"
          >
            <WhatsAppIcon size={16} className="h-5 w-5" />
            {airline.ctaLabel}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
