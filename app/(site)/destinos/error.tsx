"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { AGENCY_PHONE, whatsappLink } from "@/lib/constants";

const WHATSAPP_CATALOG_ERROR = whatsappLink(
  AGENCY_PHONE.whatsapp,
  "Hola 787 Rumbos! Quería ver los destinos en la web pero la página no cargó. ¿Me ayudan a armar un viaje? (Web - Destinos error de catálogo)",
);

/**
 * Error boundary del segmento `/destinos` (QOL-10).
 * Si falla la carga del catálogo, mostramos UI recuperable en español
 * en lugar de tumbar toda la página.
 */
export default function DestinosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[destinos] catalog/page error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <section className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-full rounded-3xl border border-[#0b4058]/10 bg-white px-6 py-12 shadow-sm">
          <h1 className="font-[family-name:var(--font-brand-heading)] text-2xl font-extrabold tracking-tight text-[#0b4058] md:text-3xl">
            No pudimos cargar los destinos
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#0b4058]/70 text-pretty">
            Hubo un problema al traer el catálogo. Probá de nuevo en un momento o
            escribinos por WhatsApp y te armamos el viaje a mano.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-[#0b4058]/20 bg-white px-5 py-3 text-sm font-bold text-[#0b4058] transition-colors hover:border-[#0b4058]/35 hover:bg-[#0b4058]/5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7a92a]"
            >
              Reintentar
            </button>
            <a
              href={WHATSAPP_CATALOG_ERROR}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-brand-heading)] inline-flex items-center gap-2 rounded-xl bg-[#dae553] px-5 py-3 text-sm font-black text-[#0b4058] shadow-md transition-all duration-200 hover:bg-[#c3cf3e] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7a92a]"
            >
              <WhatsAppIcon size={14} className="h-5 w-5 shrink-0" />
              <span>Consultar por WhatsApp</span>
            </a>
            <Link
              href="/"
              className="w-full basis-full pt-1 text-sm font-semibold text-[#0b4058]/70 underline decoration-[#dae553]/60 hover:text-[#0b4058] hover:decoration-[#dae553]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
