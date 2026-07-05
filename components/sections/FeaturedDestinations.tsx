import Image from "next/image";
import Link from "next/link";
import { destinationsData, DestinationPage } from "@/lib/destinations-data";
import { Plane, Bus, ArrowRight, Calendar, MapPin } from "lucide-react";

export function FeaturedDestinations() {
  // Seleccionamos exactamente los 4 destinos destacados de forma ordenada
  const featuredSlugs = ["salta", "bariloche", "rio-de-janeiro", "cataratas-del-iguazu"];
  
  const featured = featuredSlugs
    .map(slug => destinationsData.find(d => d.slug === slug))
    .filter((d): d is DestinationPage => !!d);

  return (
    <section id="destinos" className="mx-auto w-full max-w-6xl px-6 py-20">
      {/* Header de la sección */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <span className="text-[11px] uppercase font-black tracking-widest text-[#006183] bg-[#006183]/5 px-3 py-1 rounded-full border border-[#006183]/10">
            Catálogo destacado
          </span>
          <h2 className="font-[family-name:var(--font-brand-heading)] text-3xl font-extrabold tracking-tight md:text-4xl text-[#0b4058] text-balance">
            ¿Cuál es tu próximo rumbo?
          </h2>
          <p className="max-w-xl text-[#0b4058]/80 text-sm md:text-base leading-relaxed text-pretty">
            Explorá nuestras próximas salidas grupales confirmadas desde Córdoba, o planificá tu próximo destino a medida.
          </p>
        </div>
      </div>

      {/* Grilla de Destinos */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((dest) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Filtrar salidas futuras activas
          const activeDeps = dest.departures.filter(
            (dep) => new Date(dep.date + "T00:00:00") >= today && dep.status !== "sold-out"
          );

          const hasActiveDeps = activeDeps.length > 0;
          const nextDepDate = hasActiveDeps ? activeDeps[0].displayDate : null;
          const transportType = hasActiveDeps ? activeDeps[0].transport : "mix";

          return (
            <Link
              key={dest.slug}
              href={`/destinos/${dest.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#0b4058]/10 bg-white shadow-sm shadow-[#0b4058]/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0b4058]/20 hover:shadow-xl hover:shadow-[#0b4058]/15 active:scale-[0.96] cursor-pointer"
            >
              {/* Contenedor Imagen */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={dest.heroImage}
                  alt={`${dest.name} — paquete de viaje con 787 Rumbos`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* 1px image outline for consistent depth */}
                <div className="absolute inset-0 border border-black/5 rounded-t-2xl pointer-events-none" />
                
                {/* Badges superiores */}
                <div className="absolute top-3 left-3 bg-[#0b4058]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {dest.region === "nacional" ? "Nacional" : "Internacional"}
                </div>

                {nextDepDate ? (
                  <div className="absolute top-3 right-3 bg-[#dae553] text-[#0b4058] px-2.5 py-1 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>Salida: {nextDepDate}</span>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#0b4058] px-2.5 py-1 rounded-full text-[10px] font-black shadow-sm">
                    A Medida
                  </div>
                )}
              </div>

              {/* Contenido Ficha */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <h3 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold tracking-tight text-[#0b4058] group-hover:text-[#006183] transition-colors duration-200">
                    {dest.name}
                  </h3>
                  
                  {/* Duración y Transporte */}
                  <div className="flex items-center gap-1.5 text-xs text-[#0b4058]/70">
                    {transportType === "aereo" ? (
                      <Plane className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    ) : (
                      <Bus className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span className="font-semibold uppercase tracking-wider text-[10px] mr-1">
                      {transportType === "bus-cama" ? "Bus Coche Cama" : transportType}
                    </span>
                    <span>·</span>
                    <span className="italic">
                      {hasActiveDeps ? `${activeDeps[0].nights} noches` : "Itinerario flexible"}
                    </span>
                  </div>
                </div>

                {/* Precio y CTA */}
                <div className="space-y-4 pt-3 border-t border-[#0b4058]/5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-[#0b4058]/50 uppercase font-black tracking-wider">Tarifa base</span>
                    {dest.priceFrom ? (
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#006183] mr-1">Desde</span>
                        <span className="text-lg font-extrabold text-[#0b4058]">
                          {dest.currency === "USD" ? "USD" : "$"}{dest.priceFrom.toLocaleString("es-AR")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-[#0b4058]/80">Consultar precio</span>
                    )}
                  </div>

                  <div className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0b4058] hover:bg-[#006183] text-white py-2.5 text-xs font-bold transition-all duration-200">
                    <span>Ver detalles y salidas</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Banner Editorial Final */}
      <div className="bg-gradient-to-br from-[#0b4058] to-[#00516e] text-white p-8 md:p-12 rounded-3xl mt-16 shadow-xl shadow-[#0b4058]/10 text-center relative overflow-hidden flex flex-col items-center justify-center gap-6 border border-white/5">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <h3 className="font-[family-name:var(--font-brand-heading)] text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            ¿Buscás otro destino?
          </h3>
          <p className="text-white/80 text-xs md:text-sm leading-relaxed text-pretty">
            Tenemos salidas confirmadas adicionales y armamos itinerarios a medida nacionales e internacionales con la financiación que necesitás. Conversá con tu asesor directo.
          </p>
        </div>
        <Link
          href="/destinos"
          className="font-[family-name:var(--font-brand-heading)] relative z-10 inline-flex items-center gap-2 rounded-xl bg-[#dae553] hover:bg-[#c3cf3e] text-[#0b4058] px-8 py-3.5 text-xs font-black shadow-md transition-all duration-200 active:scale-[0.96] cursor-pointer"
        >
          <span>Explorar todos los destinos</span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
        
        {/* Subtle decorative background light */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}
