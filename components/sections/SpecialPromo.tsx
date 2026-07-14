"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plane, Calendar, Ticket, MapPin, X, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { AGENCY_PHONE, whatsappLink } from "@/lib/constants";

// ─── CONFIGURACIÓN DE LA PROMOCIÓN DESTACADA ────────────────────────────────
// Para cambiar el evento destacado en el futuro (ej: Disney, Copa América, etc.),
// simplemente editá este objeto. Los íconos soportados son: 'plane', 'calendar', 'ticket', 'map-pin'.
const PROMO_CONFIG = {
  slug: "f1-grand-premio-sao-paulo",
  /** ISO date: el banner se oculta automáticamente el día siguiente a la salida. */
  endsAt: "2026-11-05",
  topBarText: "🏎️ Salida Especial Charter: F1 GP de São Paulo (5 de Nov). ¡Últimos cupos! Ver Detalles →",
  badgeText: "🏎️ EVENTO DESTACADO F1",
  charterText: "✈️ VUELO CHARTER DIRECTO",
  title: "Grand Premio de São Paulo",
  description: "Viví la adrenalina de la Fórmula 1 en el histórico circuito de Interlagos con todo incluido. Salida directa especial el 5 de Noviembre desde Córdoba y Rosario. ¡Cupos limitados!",
  price: "USD 2.770",
  priceNote: "por persona en base doble",
  taxNote: "+ USD 260 de gastos e impuestos",
  imageSrc: "/destinos/gp-sao-paulo.png",
  whatsappMsg: "Hola 787 Rumbos! Quiero consultar disponibilidad y detalles del paquete para el Vuelo Charter F1 Grand Premio de Sao Paulo del 5 de Noviembre. (Web - Promo F1)",
  inclusions: [
    { label: "Aéreo Charter COR-ROS / GRU", icon: "plane" },
    { label: "4 Noches de hotel con desayuno", icon: "calendar" },
    { label: "Entrada Sector G-A-HEINEKEN", icon: "ticket" },
    { label: "Traslados Autódromo + Kit F1", icon: "map-pin" }
  ]
};

function isPromoActive(endsAt: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(endsAt + "T00:00:00") >= today;
}

// Mapeo dinámico de íconos
function InclusionIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "plane":
      return <Plane className={className} />;
    case "calendar":
      return <Calendar className={className} />;
    case "ticket":
      return <Ticket className={className} />;
    case "map-pin":
      return <MapPin className={className} />;
    default:
      return null;
  }
}

export function SpecialPromo() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isPromoActive(PROMO_CONFIG.endsAt) || !isBannerVisible) return null;

  const whatsappUrl = whatsappLink(AGENCY_PHONE.whatsapp, PROMO_CONFIG.whatsappMsg);

  return (
    <>
      {/* ─── BANNER DE NOTIFICACIÓN SUPERIOR (TOP BAR) ─── */}
      <div 
        className="relative w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-2.5 px-10 text-center text-xs font-semibold cursor-pointer select-none transition-all duration-300 hover:brightness-110 active:scale-[0.99] z-[40] flex items-center justify-center group"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="font-[family-name:var(--font-brand-heading)] tracking-wider">
          {PROMO_CONFIG.topBarText}
        </span>

        {/* Botón de cerrar banner */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Evitamos abrir el modal al cerrar el banner
            setIsBannerVisible(false);
          }}
          aria-label="Ocultar anuncio de Fórmula 1"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/75 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ─── MODAL DETALLADO DE PROMOCIÓN ─── */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
          onClick={() => setIsModalOpen(false)} // Cerrar al hacer clic en el backdrop
        >
          {/* Tarjeta del Modal */}
          <div 
            className="relative w-full max-w-4xl bg-gradient-to-br from-[#0b4058] to-[#004e6a] text-white rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-6 md:p-10 my-8 flex flex-col lg:flex-row gap-8 animate-scale-up"
            onClick={(e) => e.stopPropagation()} // Detener propagación para no cerrar el modal al hacer clic adentro
          >
            {/* Botón Cerrar Modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Cerrar modal de promoción"
              className="absolute right-4 top-4 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Decoración de luces */}
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#f7a92a]/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

            {/* Columna Izquierda: Información */}
            <div className="space-y-5 lg:w-[60%] relative z-10 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Pill Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 border border-red-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                    {PROMO_CONFIG.badgeText}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[#dae553]">
                    {PROMO_CONFIG.charterText}
                  </span>
                </div>

                {/* Títulos */}
                <div className="space-y-2">
                  <h3 className="font-[family-name:var(--font-brand-heading)] text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-white text-balance">
                    {PROMO_CONFIG.title}
                  </h3>
                  <p className="text-white/80 text-xs md:text-sm leading-relaxed text-pretty">
                    {PROMO_CONFIG.description}
                  </p>
                </div>

                {/* Grilla de Inclusiones */}
                <div className="grid gap-3 sm:grid-cols-2 pt-1">
                  {PROMO_CONFIG.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-white/5 border border-white/5 rounded-xl p-2.5">
                      <InclusionIcon name={inc.icon} className="h-4 w-4 text-[#dae553] shrink-0" />
                      <span className="text-[11px] font-semibold text-white/90 leading-snug">{inc.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarifas y CTAs */}
              <div className="space-y-4 pt-4 border-t border-white/10 mt-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-white/50 uppercase font-black tracking-wider block">Tarifa especial desde</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl md:text-3xl font-extrabold text-[#dae553]">{PROMO_CONFIG.price}</span>
                      <span className="text-[10px] text-white/60">{PROMO_CONFIG.priceNote}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/50 font-medium">
                    {PROMO_CONFIG.taxNote}
                  </span>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/destinos/${PROMO_CONFIG.slug}`}
                    onClick={() => setIsModalOpen(false)}
                    className="font-[family-name:var(--font-brand-heading)] inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/95 text-[#0b4058] px-5 py-3 text-xs font-black shadow-md transition-all duration-200 active:scale-[0.97] cursor-pointer text-center"
                  >
                    <span>Ver detalles en la web</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  </Link>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-brand-heading)] inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white px-5 py-3 text-xs font-black shadow-md transition-all duration-200 active:scale-[0.97] cursor-pointer text-center"
                  >
                    <WhatsAppIcon size={14} className="h-3.5 w-3.5 shrink-0" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Folleto Promocional */}
            <div className="flex justify-center items-center lg:w-[40%]">
              <Link
                href={`/destinos/${PROMO_CONFIG.slug}`}
                onClick={() => setIsModalOpen(false)}
                className="group relative block aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#072a3b] p-2 shadow-xl cursor-pointer transition-all duration-300 ease-out md:hover:-translate-y-1 md:hover:rotate-1"
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#0b4058]">
                  <Image
                    src={PROMO_CONFIG.imageSrc}
                    alt={`Folleto Promocional ${PROMO_CONFIG.title} 787 Rumbos`}
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    priority
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                {/* Shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
