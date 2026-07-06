"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { destinationsData, DestinationPage } from "@/lib/destinations-data";
import { MapPin, Calendar, ArrowRight, Plane, Bus } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export default function DestinosIndex() {
  const [filter, setFilter] = useState<"todos" | "nacional" | "internacional">("todos");

  const filteredDestinations = destinationsData.filter(d => {
    if (filter === "todos") return true;
    return d.region === filter;
  });

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-b from-[#0b4058] to-[#006183] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <h1 className="font-[family-name:var(--font-brand-heading)] text-4xl md:text-6xl font-extrabold tracking-tight text-balance">
            Elegí tu próximo rumbo
          </h1>
          <p className="max-w-2xl mx-auto text-white/80 text-base md:text-lg text-pretty">
            Explorá nuestras salidas grupales confirmadas y paquetes a medida. Asesoramiento 100% humano desde Córdoba.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Main Catalog Section */}
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        {/* Filters */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-full border border-[#0b4058]/10 shadow-sm flex gap-1">
            {(["todos", "nacional", "internacional"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 capitalize cursor-pointer active:scale-95 ${
                  filter === type
                    ? "bg-[#0b4058] text-white shadow-sm"
                    : "text-[#0b4058]/70 hover:text-[#0b4058] hover:bg-[#0b4058]/5"
                }`}
              >
                {type === "todos" ? "Todos" : type === "nacional" ? "Nacionales" : "Internacionales"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Destinations */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((dest: DestinationPage) => {
            const activeDepartures = dest.departures.filter(dep => {
              const depDate = new Date(dep.date + "T00:00:00");
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return depDate >= today && dep.status !== "sold-out";
            });

            return (
              <article
                key={dest.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#0b4058]/10 bg-white shadow-sm shadow-[#0b4058]/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0b4058]/20 hover:shadow-xl hover:shadow-[#0b4058]/15"
              >
                {/* Destination Image */}
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={dest.heroImage}
                    alt={`${dest.name} — paquete de viaje con 787 Rumbos`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#0b4058] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 border border-black/5">
                    <MapPin className="h-3.5 w-3.5 text-[#e6b451]" />
                    <span>{dest.country}</span>
                  </div>
                  {activeDepartures.length > 0 && (
                    <div className="absolute top-4 right-4 bg-[#dae553] text-[#0b4058] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{activeDepartures.length} {activeDepartures.length === 1 ? "salida" : "salidas"}</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#006183] bg-[#006183]/5 px-2 py-0.5 rounded">
                        {dest.region === "nacional" ? "Nacional" : "Internacional"}
                      </span>
                    </div>
                    <h2 className="font-[family-name:var(--font-brand-heading)] text-2xl font-bold tracking-tight text-[#0b4058] group-hover:text-[#006183] transition-colors duration-200">
                      {dest.name}
                    </h2>
                    <p className="text-sm text-[#0b4058]/80 line-clamp-3 leading-relaxed text-pretty">
                      {dest.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-[#0b4058]/5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-[#0b4058]/60 font-semibold">Tarifa base</span>
                      {dest.priceFrom ? (
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#006183] mr-1">Desde</span>
                          <span className="text-2xl font-extrabold text-[#0b4058]">
                            {dest.currency === "USD" ? "USD" : "$"}{dest.priceFrom.toLocaleString("es-AR")}
                          </span>
                          <p className="text-[10px] text-[#0b4058]/60 mt-0.5">{dest.priceNote || "por persona en base doble"}</p>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-[#0b4058]/70">Consultar tarifa</span>
                      )}
                    </div>

                    <Link
                      href={`/destinos/${dest.slug}`}
                      className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b4058] hover:bg-[#006183] text-white py-3 text-sm font-bold transition-all duration-200 active:scale-[0.96]"
                    >
                      <span>Ver salidas y detalles</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Banner Editorial Final */}
        <div className="bg-gradient-to-br from-[#0b4058] to-[#00516e] text-white p-8 md:p-12 rounded-3xl mt-16 shadow-xl shadow-[#0b4058]/10 text-center relative overflow-hidden flex flex-col items-center justify-center gap-6 border border-white/5">
          <div className="space-y-2 relative z-10 max-w-2xl">
            <h3 className="font-[family-name:var(--font-brand-heading)] text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              ¿No encontrás tu destino ideal?
            </h3>
            <p className="text-white/80 text-xs md:text-sm leading-relaxed text-pretty">
              ¡No te preocupes! Recordá que 787 Rumbos es una agencia totalmente flexible. Tenemos convenios directos con múltiples operadores y aerolíneas para diseñar a medida el viaje de tus sueños a cualquier lugar del mundo.
            </p>
          </div>
          <a
            href="https://api.whatsapp.com/send?phone=5493516157398&text=Hola%2C%20estuve%20viendo%20la%20web%20pero%20no%20encontr%C3%A9%20el%20destino%20que%20buscaba.%20Me%20gustar%C3%ADa%20consultar%20por..."
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-brand-heading)] relative z-10 inline-flex items-center gap-2 rounded-xl bg-[#dae553] hover:bg-[#c3cf3e] text-[#0b4058] px-8 py-3.5 text-xs font-black shadow-md transition-all duration-200 active:scale-[0.96] cursor-pointer"
          >
            <WhatsAppIcon size={14} className="h-3.5 w-3.5 shrink-0" />
            <span>Consultar por mi viaje a medida</span>
          </a>
          
          {/* Sutiles luces decorativas */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
