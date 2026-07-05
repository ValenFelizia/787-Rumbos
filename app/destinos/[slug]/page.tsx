import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { destinationsData, getDestinationBySlug, DestinationPage, Departure } from "@/lib/destinations-data";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { MapPin, Calendar, Check, AlertCircle, Compass, Clock, ArrowLeft, Plane, Bus, Star } from "lucide-react";

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
      canonical: `https://787rumbos.com.ar/destinos/${slug}`,
    },
    openGraph: {
      title: destination.metaTitle,
      description: destination.metaDescription,
      url: `https://787rumbos.com.ar/destinos/${slug}`,
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
  const text = `Hola, quiero consultar disponibilidad para la salida a ${destinoName} del ${displayDate}.`;
  return `https://api.whatsapp.com/send?phone=5493516157398&text=${encodeURIComponent(text)}`;
}

// 5. Generador de link de WhatsApp genérico para cotización a medida
function getWhatsAppCustomLink(destinoName: string): string {
  const text = `Hola, quiero consultar para armar un viaje a medida a ${destinoName}.`;
  return `https://api.whatsapp.com/send?phone=5493516157398&text=${encodeURIComponent(text)}`;
}

export default async function DestinoDetailPage({ params }: Props) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);

  if (!dest) {
    notFound();
  }

  // Filtrar salidas futuras activas
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeUpcomingDepartures = dest.departures.filter((dep) => {
    const depDate = new Date(dep.date + "T00:00:00");
    return depDate >= today && dep.status !== "sold-out";
  });

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
      "telephone": "+543513448724",
      "url": "https://787rumbos.com.ar"
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

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <Navbar />

      {/* Script de JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative h-[45vh] md:h-[55vh] min-h-[300px] w-full overflow-hidden">
        <Image
          src={dest.heroImage}
          alt={`Viajar a ${dest.name} con 787 Rumbos`}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b4058]/95 via-[#0b4058]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full py-10 px-6">
          <div className="mx-auto max-w-6xl space-y-4">
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

            {/* Nota Aclaratoria */}
            <div className="rounded-xl bg-gray-50 border border-gray-200/60 p-5 flex gap-3 text-xs text-gray-500 leading-relaxed">
              <AlertCircle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-pretty">
                <strong>Nota aclaratoria:</strong> Las tarifas publicadas, itinerarios y excursiones son de carácter referencial y corresponden a nuestros paquetes estándar. 787 Rumbos es hiper-flexible y nos adaptamos a tus necesidades. Las tarifas definitivas se confirman al momento de realizar la consulta directa y reserva con el asesor.
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
                  {dest.departures.map((dep, idx) => {
                    const statusInfo = getDepartureStatus(dep);

                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-4 space-y-3 transition-all duration-200 ${
                          statusInfo.isSelectable 
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
                                {dep.transport === "aereo" ? (
                                  <Plane className="h-3 w-3 text-sky-600" />
                                ) : (
                                  <Bus className="h-3 w-3 text-emerald-600" />
                                )}
                                <span className="capitalize">{dep.transport === "bus-cama" ? "Bus Coche Cama" : dep.transport}</span>
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

      <Footer />
    </main>
  );
}
