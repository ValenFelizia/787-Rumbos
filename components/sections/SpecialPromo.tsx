"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plane, Calendar, Ticket, MapPin, X, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { AGENCY_PHONE, whatsappLink } from "@/lib/constants";
import { DIALOG_CLOSEDBY_ANY, setAutofocus, useModalDialog } from "@/lib/use-modal-dialog";
import type { FeaturedPromo } from "@/lib/catalog/types";

function isPromoActive(endsAt: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(endsAt + "T00:00:00") >= today;
}

function InclusionIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "plane":
      return <Plane aria-hidden="true" className={className} />;
    case "calendar":
      return <Calendar aria-hidden="true" className={className} />;
    case "ticket":
      return <Ticket aria-hidden="true" className={className} />;
    case "map-pin":
      return <MapPin aria-hidden="true" className={className} />;
    default:
      return null;
  }
}

function PromoFlyer({
  promo,
  onNavigate,
  className,
}: {
  promo: FeaturedPromo;
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <Link
      href={`/destinos/${promo.slug}`}
      onClick={onNavigate}
      className={`group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#072a3b] p-2 shadow-xl cursor-pointer transition-colors duration-200 md:hover:border-white/25 ${className ?? ""}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#0b4058]">
        <Image
          src={promo.imageSrc}
          alt={`Folleto Promocional ${promo.title} 787 Rumbos`}
          fill
          sizes="(max-width: 1024px) 200px, 260px"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
    </Link>
  );
}

function PromoPricingAndCtas({
  promo,
  whatsappUrl,
  onNavigate,
}: {
  promo: FeaturedPromo;
  whatsappUrl: string;
  onNavigate: () => void;
}) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <div className="space-y-0.5">
          <span className="text-[9px] text-white/70 uppercase font-black tracking-wider block">
            Tarifa especial desde
          </span>
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-2xl md:text-3xl font-extrabold text-[#dae553]">
              {promo.price}
            </span>
            {promo.priceNote ? (
              <span className="text-[10px] text-white/60">{promo.priceNote}</span>
            ) : null}
          </div>
        </div>
        {promo.taxNote ? (
          <span className="text-[10px] text-white/70 font-medium">{promo.taxNote}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
        <Link
          href={`/destinos/${promo.slug}`}
          onClick={onNavigate}
          className="font-[family-name:var(--font-brand-heading)] inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/95 text-[#0b4058] px-5 py-3 text-xs font-black shadow-md transition-all duration-200 active:scale-[0.97] cursor-pointer text-center"
        >
          <span>Ver detalles en la web</span>
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
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

export function SpecialPromo({ promo }: { promo: FeaturedPromo | null }) {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const dialogRef = useModalDialog(isModalOpen, closeModal);

  if (!promo || !isPromoActive(promo.endsAt) || !isBannerVisible) return null;

  const whatsappUrl = whatsappLink(AGENCY_PHONE.whatsapp, promo.whatsappMsg);

  return (
    <>
      {/* ─── BANNER DE NOTIFICACIÓN SUPERIOR (TOP BAR) ─── */}
      <div className="relative z-[40] flex w-full items-center bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-center text-xs font-semibold text-white">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-controls="special-promo-dialog"
          onClick={() => setIsModalOpen(true)}
          className="flex w-full select-none items-center justify-center py-2.5 pl-10 pr-10 transition duration-300 hover:brightness-110 active:scale-[0.99]"
        >
          <span className="font-[family-name:var(--font-brand-heading)] tracking-wider">
            {promo.topBarText}
          </span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsBannerVisible(false);
          }}
          aria-label="Ocultar anuncio"
          className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white/90 transition duration-200 hover:bg-white/10 hover:text-white"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      {/* ─── MODAL DETALLADO DE PROMOCIÓN ─── */}
      <dialog
        id="special-promo-dialog"
        ref={dialogRef}
        {...DIALOG_CLOSEDBY_ANY}
        aria-labelledby="special-promo-title"
        inert={!isModalOpen}
        className="open:flex flex-col mt-auto mb-0 mx-auto sm:m-auto w-full sm:w-[calc(100%-2rem)] max-w-4xl max-h-[90dvh] overflow-hidden rounded-t-3xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b4058] to-[#004e6a] p-0 text-white shadow-2xl"
      >
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#f7a92a]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        {/* Header sticky: badges + close */}
        <div className="relative z-10 flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-5 pt-5 pb-3 sm:px-8 sm:pt-8 sm:pb-4">
          <div className="flex flex-wrap items-center gap-2 pr-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 border border-red-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">
              {promo.badgeText}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[#dae553]">
              {promo.charterText}
            </span>
          </div>
          <button
            ref={setAutofocus}
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
                promo={promo}
                onNavigate={closeModal}
                className="aspect-[4/5] w-full max-w-[160px]"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h1
                  id="special-promo-title"
                  className="font-[family-name:var(--font-brand-heading)] text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-white text-balance"
                >
                  {promo.title}
                </h1>
                <p className="text-white/80 text-xs md:text-sm leading-relaxed text-pretty">
                  {promo.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 pt-1">
                {promo.inclusions.map((inc, i) => (
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
              <PromoPricingAndCtas promo={promo} whatsappUrl={whatsappUrl} onNavigate={closeModal} />
            </div>
          </div>

          {/* Folleto — solo desktop */}
          <div className="relative z-10 hidden shrink-0 items-center justify-center px-8 py-8 lg:flex lg:w-[40%]">
            <PromoFlyer
              promo={promo}
              onNavigate={closeModal}
              className="aspect-[4/5] w-full max-w-[280px]"
            />
          </div>
        </div>

        {/* Footer sticky — solo mobile: precio + CTAs siempre visibles */}
        <div className="relative z-10 shrink-0 border-t border-white/10 bg-[#0b4058]/95 px-5 py-4 backdrop-blur-sm sm:px-8 lg:hidden">
          <PromoPricingAndCtas promo={promo} whatsappUrl={whatsappUrl} onNavigate={closeModal} />
        </div>
      </dialog>
    </>
  );
}
