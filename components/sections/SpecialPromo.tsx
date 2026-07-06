"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plane, Calendar, Ticket, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

// ponytail: keep this promo component simple, high-impact, and self-contained.
// No external animation libraries. Uses native CSS transitions and Tailwind.

export function SpecialPromo() {
  // Prefilled WhatsApp message for F1 GP Sao Paulo
  const whatsappMsg = "Hola 787 Rumbos! Quiero consultar disponibilidad y detalles del paquete para el Vuelo Charter F1 Grand Premio de Sao Paulo del 5 de Noviembre.";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=5493516157398&text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b4058] to-[#004e6a] text-white border border-white/10 shadow-2xl">
        {/* Subtle decorative background lights */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#f7a92a]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid gap-10 p-8 md:p-12 lg:grid-cols-12 lg:items-center">
          {/* Columna Izquierda: Información */}
          <div className="space-y-6 lg:col-span-7">
            {/* Pill Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 border border-red-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                🏎️ EVENTO DESTACADO F1
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#dae553]">
                ✈️ VUELO CHARTER DIRECTO
              </span>
            </div>

            {/* Título principal */}
            <div className="space-y-3">
              <h2 className="font-[family-name:var(--font-brand-heading)] text-3xl font-extrabold tracking-tight md:text-5xl leading-tight text-white text-balance">
                Grand Premio de São Paulo
              </h2>
              <p className="text-white/80 text-sm md:text-base leading-relaxed text-pretty">
                Viví la adrenalina de la Fórmula 1 en el histórico circuito de Interlagos con todo incluido. Salida directa especial el <strong className="text-[#dae553]">5 de Noviembre</strong> desde Córdoba y Rosario. ¡Cupos limitados!
              </p>
            </div>

            {/* Grilla de Características / Inclusiones */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3">
                <Plane className="h-5 w-5 text-[#dae553] shrink-0" />
                <span className="text-xs font-semibold text-white/90">Aéreo Charter COR-ROS / GRU</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3">
                <Calendar className="h-5 w-5 text-[#dae553] shrink-0" />
                <span className="text-xs font-semibold text-white/90">4 Noches de hotel con desayuno</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3">
                <Ticket className="h-5 w-5 text-[#dae553] shrink-0" />
                <span className="text-xs font-semibold text-white/90">Entrada Sector G-A-HEINEKEN</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3">
                <MapPin className="h-5 w-5 text-[#dae553] shrink-0" />
                <span className="text-xs font-semibold text-white/90">Traslados In/Out Autódromo + Kit F1</span>
              </div>
            </div>

            {/* Tarifas y Precios */}
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-white/10 pt-5">
              <div className="space-y-0.5">
                <span className="text-[10px] text-white/50 uppercase font-black tracking-wider">Tarifa especial desde</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#dae553]">USD 2.770</span>
                  <span className="text-xs text-white/60">por persona en base doble</span>
                </div>
              </div>
              <span className="text-xs text-white/50 font-medium">
                + USD 260 de gastos e impuestos
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-4 sm:flex-row pt-2">
              <Link
                href="/destinos/f1-grand-premio-sao-paulo"
                className="font-[family-name:var(--font-brand-heading)] inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/95 text-[#0b4058] px-6 py-3.5 text-sm font-black shadow-md transition-transform duration-200 active:scale-[0.97] cursor-pointer"
              >
                <span>Ver detalles del paquete</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 hover:translate-x-0.5" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-brand-heading)] inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white px-6 py-3.5 text-sm font-black shadow-md transition-transform duration-200 active:scale-[0.97] cursor-pointer"
              >
                <WhatsAppIcon size={16} className="h-4 w-4 shrink-0" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Previsualización de Folleto (Efecto de tarjeta flotante) */}
          <div className="flex justify-center lg:col-span-5">
            <Link
              href="/destinos/f1-grand-premio-sao-paulo"
              className="group relative block aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#072a3b] p-3 shadow-xl cursor-pointer transition-all duration-300 ease-out md:hover:-translate-y-1.5 md:hover:rotate-1 md:hover:shadow-2xl md:hover:shadow-black/40"
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#0b4058]">
                <Image
                  src="/destinos/gp-sao-paulo.png"
                  alt="Folleto Promocional F1 GP Sao Paulo 787 Rumbos"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  priority
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Shine overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
