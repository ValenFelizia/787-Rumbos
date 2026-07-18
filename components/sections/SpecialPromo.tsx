"use client";

import { useEffect, useRef, useState } from "react";
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

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function isPromoActive(endsAt: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(endsAt + "T00:00:00") >= today;
}

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

function PromoFlyer({
  onNavigate,
  className,
}: {
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <Link
      href={`/destinos/${PROMO_CONFIG.slug}`}
      onClick={onNavigate}
      className={`group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#072a3b] p-2 shadow-xl cursor-pointer transition-all duration-300 ease-out md:hover:-translate-y-1 md:hover:rotate-1 ${className ?? ""}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#0b4058]">
        <Image
          src={PROMO_CONFIG.imageSrc}
          alt={`Folleto Promocional ${PROMO_CONFIG.title} 787 Rumbos`}
          fill
          sizes="(max-width: 1024px) 200px, 260px"
          priority
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
    </Link>
  );
}

function PromoPricingAndCtas({
  whatsappUrl,
  onNavigate,
}: {
  whatsappUrl: string;
  onNavigate: () => void;
}) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <div className="space-y-0.5">
          <span className="text-[9px] text-white/50 uppercase font-black tracking-wider block">
            Tarifa especial desde
          </span>
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-2xl md:text-3xl font-extrabold text-[#dae553]">
              {PROMO_CONFIG.price}
            </span>
            <span className="text-[10px] text-white/60">{PROMO_CONFIG.priceNote}</span>
          </div>
        </div>
        <span className="text-[10px] text-white/50 font-medium">{PROMO_CONFIG.taxNote}</span>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
        <Link
          href={`/destinos/${PROMO_CONFIG.slug}`}
          onClick={onNavigate}
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
  );
}

export function SpecialPromo() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const promoTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // El modal bloquea el fondo, contiene el foco y lo devuelve al disparador al cerrar.
  useEffect(() => {
    if (!isModalOpen) return;

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : promoTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsModalOpen(false);
        return;
      }

      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (e.shiftKey && (activeElement === firstElement || !dialogRef.current.contains(activeElement))) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocusedElement?.isConnected) previouslyFocusedElement.focus();
    };
  }, [isModalOpen]);

  if (!isPromoActive(PROMO_CONFIG.endsAt) || !isBannerVisible) return null;

  const whatsappUrl = whatsappLink(AGENCY_PHONE.whatsapp, PROMO_CONFIG.whatsappMsg);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* ─── BANNER DE NOTIFICACIÓN SUPERIOR (TOP BAR) ─── */}
      <div className="relative z-[40] flex w-full items-center bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-center text-xs font-semibold text-white">
        <button
          ref={promoTriggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-controls="special-promo-dialog"
          onClick={() => setIsModalOpen(true)}
          className="flex w-full select-none items-center justify-center py-2.5 pl-10 pr-10 transition duration-300 hover:brightness-110 active:scale-[0.99]"
        >
          <span className="font-[family-name:var(--font-brand-heading)] tracking-wider">
            {PROMO_CONFIG.topBarText}
          </span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsBannerVisible(false);
          }}
          aria-label="Ocultar anuncio de Fórmula 1"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-1 text-white/75 transition duration-200 hover:bg-white/10 hover:text-white"
        >
          <X aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ─── MODAL DETALLADO DE PROMOCIÓN ─── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          {/* Sheet / card: viewport-constrained; scroll lives inside, not on the backdrop */}
          <div
            id="special-promo-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="special-promo-title"
            className="relative flex w-full max-w-4xl max-h-[90dvh] flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b4058] to-[#004e6a] text-white shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#f7a92a]/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

            {/* Header sticky: badges + close */}
            <div className="relative z-10 flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-5 pt-5 pb-3 sm:px-8 sm:pt-8 sm:pb-4">
              <div className="flex flex-wrap items-center gap-2 pr-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 border border-red-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                  {PROMO_CONFIG.badgeText}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[#dae553]">
                  {PROMO_CONFIG.charterText}
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeModal}
                aria-label="Cerrar modal de promoción"
                className="shrink-0 p-2 -mr-1 -mt-1 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            {/* Body: mobile scrolls flyer+copy; desktop is two columns */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-8 sm:py-5 lg:w-[60%] lg:pr-4">
                {/* Folleto compacto — solo mobile (antes del copy) */}
                <div className="mb-4 flex justify-center lg:hidden">
                  <PromoFlyer
                    onNavigate={closeModal}
                    className="aspect-[4/5] w-full max-w-[160px]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3
                      id="special-promo-title"
                      className="font-[family-name:var(--font-brand-heading)] text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-white text-balance"
                    >
                      {PROMO_CONFIG.title}
                    </h3>
                    <p className="text-white/80 text-xs md:text-sm leading-relaxed text-pretty">
                      {PROMO_CONFIG.description}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 pt-1">
                    {PROMO_CONFIG.inclusions.map((inc, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 bg-white/5 border border-white/5 rounded-xl p-2.5"
                      >
                        <InclusionIcon name={inc.icon} className="h-4 w-4 text-[#dae553] shrink-0" />
                        <span className="text-[11px] font-semibold text-white/90 leading-snug">
                          {inc.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Precio + CTAs — solo desktop (en mobile van al footer sticky) */}
                <div className="mt-5 hidden border-t border-white/10 pt-4 lg:block">
                  <PromoPricingAndCtas whatsappUrl={whatsappUrl} onNavigate={closeModal} />
                </div>
              </div>

              {/* Folleto — solo desktop */}
              <div className="relative z-10 hidden shrink-0 items-center justify-center px-8 py-8 lg:flex lg:w-[40%]">
                <PromoFlyer
                  onNavigate={closeModal}
                  className="aspect-[4/5] w-full max-w-[280px]"
                />
              </div>
            </div>

            {/* Footer sticky — solo mobile: precio + CTAs siempre visibles */}
            <div className="relative z-10 shrink-0 border-t border-white/10 bg-[#0b4058]/95 px-5 py-4 backdrop-blur-sm sm:px-8 lg:hidden">
              <PromoPricingAndCtas whatsappUrl={whatsappUrl} onNavigate={closeModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
