import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FAQ } from "@/components/sections/FAQ";
import {
  destinationsData,
  getDestinationBySlug,
  getRelatedDestinations,
  getActiveUpcomingDepartures,
  getUpcomingDepartures,
  getTransportLabel,
  type Departure,
} from "@/lib/destinations-data";
import { getPrimaryClusterForDestination } from "@/lib/clusters-data";
import { AGENCY_PHONE, whatsappLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import {
  Calendar,
  Check,
  AlertCircle,
  Compass,
  ArrowLeft,
  Plane,
  Bus,
  Sparkles,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. Generar metadatos dinámicos por destino
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) return {};

  return {
    title: destination.metaTitle,
    description: destination.metaDescription,
    alternates: {
      canonical: `https://www.787rumbos.com.ar/destinos/${slug}`,
    },
    openGraph: {
      title: destination.metaTitle,
      description: destination.metaDescription,
      url: `https://www.787rumbos.com.ar/destinos/${slug}`,
      images: [
        {
          url: destination.heroImage,
          width: 800,
          height: 600,
          alt: `Viajar a ${destination.name} con 787 Rumbos`,
        },
      ],
    },
  };
}

// 2. Generar parámetros estáticos para SSG en build time
export async function generateStaticParams() {
  return destinationsData.map((dest) => ({
    slug: dest.slug,
  }));
}

// 3. Función auxiliar para evaluar el estado inteligente de una salida
function getDepartureStatus(dep: Departure): {
  label: string;
  colorClass: string;
  isSelectable: boolean;
  isPast: boolean;
  isSoldOut: boolean;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const depDate = new Date(dep.date + "T00:00:00");

  if (depDate < today) {
    return {
      label: "Viaje Realizado",
      colorClass: "bg-gray-100 text-gray-400 border-gray-200 line-through",
      isSelectable: false,
      isPast: true,
      isSoldOut: false,
    };
  }

  if (dep.status === "sold-out") {
    return {
      label: "Cupos Completos",
      colorClass: "bg-red-50 text-red-500 border-red-100 line-through font-semibold",
      isSelectable: false,
      isPast: false,
      isSoldOut: true,
    };
  }

  // Si faltan menos de 3 días para salir, forzar estado a consulta
  const diffTime = depDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) {
    return {
      label: "Consultar Lugares",
      colorClass: "bg-amber-50 text-amber-600 border-amber-200 font-semibold animate-pulse",
      isSelectable: true,
      isPast: false,
      isSoldOut: false,
    };
  }

  if (dep.status === "few-seats") {
    return {
      label: "Últimos Cupos",
      colorClass: "bg-orange-50 text-orange-600 border-orange-200 font-semibold",
      isSelectable: true,
      isPast: false,
      isSoldOut: false,
    };
  }

  return {
    label: "Salida Confirmada",
    colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100 font-semibold",
    isSelectable: true,
    isPast: false,
    isSoldOut: false,
  };
}

// 4. Generador de link de WhatsApp personalizado por salida
function getWhatsAppDepartureLink(destinoName: string, displayDate: string): string {
  return whatsappLink(
    AGENCY_PHONE.whatsapp,
    `Hola, quiero consultar disponibilidad para la salida a ${destinoName} del ${displayDate}. (Web - Detalle Destino)`,
  );
}

// 5. Generador de link de WhatsApp genérico para cotización a medida
function getWhatsAppCustomLink(destinoName: string): string {
  return whatsappLink(
    AGENCY_PHONE.whatsapp,
    `Hola, quiero consultar para armar un viaje a medida a ${destinoName}. (Web - Detalle Destino)`,
  );
}

export default async function DestinoDetailPage({ params }: Props) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);

  if (!dest) {
    notFound();
  }

  // Solo salidas futuras en el panel (pasadas se podan del catálogo / no se listan)
  const upcomingDepartures = getUpcomingDepartures(dest);
  const activeUpcomingDepartures = getActiveUpcomingDepartures(dest);

  // JSON-LD estructurado
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": `Paquete a ${dest.name} desde Córdoba`,
    "description": dest.description,
    "touristType": "Leisure",
    "provider": {
      "@type": "TravelAgency",
      "name": "787 Rumbos",
      "telephone": AGENCY_PHONE.tel,
      "url": "https://www.787rumbos.com.ar"
    },
    ...(dest.priceFrom && {
      "offers": {
        "@type": "Offer",
        "price": dest.priceFrom.toString(),
        "priceCurrency": dest.currency,
        "availability": activeUpcomingDepartures.length > 0 ? "https://schema.org/InStock" : "https://schema.org/InquiryLimit",
        "priceValidUntil": "2026-12-31"
      }
    })
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://www.787rumbos.com.ar",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinos",
        item: "https://www.787rumbos.com.ar/destinos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: dest.name,
        item: `https://www.787rumbos.com.ar/destinos/${slug}`,
      },
    ],
  };

  const related = getRelatedDestinations(slug, 3);
  const primaryCluster = getPrimaryClusterForDestination(slug);

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative h-[45vh] md:h-[55vh] min-h-[300px] w-full overflow-hidden">
        <Image
          src={dest.heroImage}
          alt={`Viajar a ${dest.name} con 787 Rumbos`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b4058]/95 via-[#0b4058]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full py-10 px-6">
          <div className="mx-auto max-w-6xl space-y-4">
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
                {primaryCluster && primaryCluster.id !== "salidas-grupales" && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link
                        href={`/destinos/${primaryCluster.slug}`}
                        className="hover:text-[#dae553] transition-colors"
                      >
                        {primaryCluster.title}
                      </Link>
                    </li>
                  </>
                )}
                <li aria-hidden="true">/</li>
                <li className="text-[#dae553] font-semibold" aria-current="page">
                  {dest.name}
                </li>
              </ol>
            </nav>

            <Link
              href="/destinos"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#dae553] hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al catálogo</span>
            </Link>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#dae553] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                {dest.region === "nacional" ? "Argentina" : dest.country}
              </span>
              {primaryCluster && primaryCluster.id !== "salidas-grupales" && (
                <Link
                  href={`/destinos/${primaryCluster.slug}`}
                  className="text-xs font-semibold text-white/80 hover:text-[#dae553] underline underline-offset-2 transition-colors"
                >
                  Ver más: {primaryCluster.title}
                </Link>
              )}
            </div>

            <h1 className="font-[family-name:var(--font-brand-heading)] text-3xl md:text-5xl font-extrabold text-white tracking-tight text-balance">
              Paquetes a {dest.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-12 items-start">

          {/* Columna Izquierda: Información de Destino */}
          <div className="lg:col-span-7 space-y-10">
            {/* Descripción */}
            <div className="space-y-4">
              <h2 className="font-[family-name:var(--font-brand-heading)] text-2xl font-bold tracking-tight border-b border-[#0b4058]/10 pb-2">
                Sobre el Destino
              </h2>
              <p className="text-base text-[#0b4058]/90 leading-relaxed text-pretty">
                {dest.description}
              </p>
            </div>

            {/* Highlights */}
            {dest.highlights.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold tracking-tight">
                  Lo imperdible
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {dest.highlights.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-[#0b4058]/90"
                    >
                      <Sparkles className="h-5 w-5 text-[#e6b451] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qué Incluye */}
            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold tracking-tight">
                Qué incluyen nuestros viajes estándar
              </h3>
              <ul className="grid gap-3.5 sm:grid-cols-2">
                {dest.typicalInclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#0b4058]/90">
                    <Check className="h-5 w-5 text-[#dae553] shrink-0 bg-[#0b4058] rounded-full p-1 mt-0.5" />
                    <span className="leading-snug">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Excursiones Opcionales */}
            {dest.optionalExcursions && dest.optionalExcursions.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold tracking-tight">
                  Excursiones sugeridas y opcionales
                </h3>
                <ul className="space-y-3">
                  {dest.optionalExcursions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#0b4058]/85">
                      <Compass className="h-5 w-5 text-[#e6b451] shrink-0 mt-0.5" />
                      <span className="leading-snug">{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Travel Tip */}
            {dest.travelTip && (
              <div className="rounded-2xl bg-amber-50/50 border border-amber-200/50 p-6 flex gap-4">
                <div className="text-2xl shrink-0 mt-0.5">💡</div>
                <div className="space-y-1">
                  <h4 className="font-[family-name:var(--font-brand-heading)] text-sm font-bold text-amber-800">
                    Tip del Viajero
                  </h4>
                  <p className="text-xs text-amber-900/90 leading-relaxed text-pretty">
                    {dest.travelTip}
                  </p>
                </div>
              </div>
            )}

            {/* Folleto Promocional Oficial */}
            {dest.flyerImage && (
              <div className="space-y-4">
                <h3 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold tracking-tight">
                  Folleto Promocional Oficial
                </h3>
                <div className="relative flex justify-center overflow-hidden rounded-2xl border border-[#0b4058]/10 bg-white p-4 shadow-sm">
                  <div className="relative w-full max-w-lg aspect-[4/5]">
                    <Image
                      src={dest.flyerImage}
                      alt={`Folleto Promocional de ${dest.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-contain rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Nota Aclaratoria */}
            <div className="rounded-xl bg-gray-50 border border-gray-200/60 p-5 flex gap-3 text-xs text-gray-500 leading-relaxed">
              <AlertCircle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-pretty">
                <strong>Nota aclaratoria:</strong> Las tarifas publicadas, itinerarios y excursiones son de carácter referencial y corresponden a nuestros paquetes estándar, aunque están sujetos a cambios. En 787 Rumbos nos destacamos por nuestra flexibilidad y paquetes a medida, así que nos adaptamos a tus necesidades. Las tarifas definitivas se confirman al momento de realizar la consulta directa y reserva con el asesor.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Salidas Programadas (Panel Lateral Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">

            {/* Si no hay salidas activas */}
            {activeUpcomingDepartures.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#0b4058]/10 p-7 shadow-md space-y-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#006183]/5 flex items-center justify-center text-xl text-[#006183]">
                  📅
                </div>
                <div className="space-y-2">
                  <h3 className="font-[family-name:var(--font-brand-heading)] text-lg font-bold text-[#0b4058]">
                    ¿Viajamos a tu medida?
                  </h3>
                  <p className="text-xs text-[#0b4058]/80 leading-relaxed text-pretty">
                    Actualmente no hay salidas grupales activas programadas en el catálogo. Sin embargo, armamos presupuestos 100% personalizados para las fechas que vos elijas con tarifas competitivas.
                  </p>
                </div>
                <a
                  href={getWhatsAppCustomLink(dest.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-brand-heading)] inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b4058] hover:bg-[#006183] text-white py-3.5 text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.96] cursor-pointer"
                >
                  <WhatsAppIcon size={16} className="h-4 w-4 shrink-0" />
                  Armar viaje a medida
                </a>
              </div>
            ) : (
              /* Si existen salidas activas */
              <div className="rounded-2xl bg-white border border-[#0b4058]/10 p-6 shadow-md space-y-5">
                <div>
                  <h3 className="font-[family-name:var(--font-brand-heading)] text-lg font-bold text-[#0b4058]">
                    Próximas Salidas Programadas
                  </h3>
                  <p className="text-xs text-[#0b4058]/60 mt-1">
                    Hacé clic en una salida para consultar disponibilidad en WhatsApp.
                  </p>
                </div>

                <div className="space-y-4">
                  {upcomingDepartures.map((dep, idx) => {
                    const statusInfo = getDepartureStatus(dep);

                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-4 space-y-3 transition-all duration-200 ${statusInfo.isSelectable
                          ? "border-gray-200 hover:border-[#0b4058]/30 hover:shadow-md bg-white"
                          : "border-gray-100 bg-gray-50/50"
                          }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <span className="font-semibold text-sm text-[#0b4058] flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-[#006183] shrink-0" />
                              {dep.displayDate}
                            </span>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#0b4058]/70">
                              <span className="flex items-center gap-1">
                                {dep.transport === "aereo" || dep.transport === "mix" ? (
                                  <Plane className="h-3 w-3 text-sky-600" aria-hidden />
                                ) : (
                                  <Bus className="h-3 w-3 text-emerald-600" aria-hidden />
                                )}
                                <span>{getTransportLabel(dep.transport)}</span>
                              </span>
                              <span>·</span>
                              <span>{dep.nights} {dep.nights === 1 ? "noche" : "noches"}</span>
                            </div>
                          </div>

                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${statusInfo.colorClass}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        {dep.note && (
                          <p className="text-[11px] text-[#0b4058]/70 italic leading-snug">
                            💡 {dep.note}
                          </p>
                        )}

                        {/* CTA Salida específica */}
                        {statusInfo.isSelectable && (
                          <a
                            href={getWhatsAppDepartureLink(dest.name, dep.displayDate)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white py-2.5 text-xs font-bold transition-all duration-200 active:scale-[0.96] cursor-pointer"
                          >
                            <WhatsAppIcon size={14} className="h-3.5 w-3.5 shrink-0" />
                            Consultar esta fecha
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Botón secundario a medida */}
                <div className="pt-2 border-t border-[#0b4058]/5">
                  <a
                    href={getWhatsAppCustomLink(dest.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-[#006183] hover:text-[#0b4058] transition-colors py-2 text-center"
                  >
                    ¿Buscás otras fechas? Cotizá a medida
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Destinos relacionados */}
      {related.length > 0 && (
        <section className="border-t border-[#0b4058]/10 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <h2 className="font-[family-name:var(--font-brand-heading)] text-2xl font-bold tracking-tight mb-6">
              También te puede interesar
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/destinos/${item.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#0b4058]/10 bg-[#f9f9f9] transition-all duration-200 hover:border-[#0b4058]/25 hover:shadow-md"
                  >
                    <div className="relative h-36 w-full overflow-hidden">
                      <Image
                        src={item.heroImage}
                        alt={`Paquetes a ${item.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#006183]/70">
                        {item.region === "nacional" ? "Argentina" : item.country}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-brand-heading)] text-lg font-bold text-[#0b4058] group-hover:text-[#006183] transition-colors">
                        {item.name}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ por destino */}
      {dest.faq && dest.faq.length > 0 && (
        <FAQ
          items={dest.faq}
          id={`faq-${slug}`}
          headingId={`faq-heading-${slug}`}
          title={`Preguntas frecuentes sobre ${dest.name}`}
          compact
          description={
            <>
              Dudas típicas de quienes viajan a {dest.name} desde Córdoba. Si tu consulta es otra,{" "}
              <a
                href={getWhatsAppCustomLink(dest.name)}
                className="font-semibold text-[#006183] underline decoration-[#006183]/30 underline-offset-2 transition-colors hover:text-[#0b4058] hover:decoration-[#0b4058]/40"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Consultar por WhatsApp sobre ${dest.name}`}
              >
                escribinos por WhatsApp
              </a>
              .
            </>
          }
        />
      )}

      <Footer />
    </main>
  );
}
