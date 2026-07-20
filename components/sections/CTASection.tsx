"use client";
/**
 * components/sections/CTASection.tsx
 *
 * Sección de cierre — último empujón de conversión antes del footer.
 * Par canónico: Armar viaje (cotizador) + Escribinos por WhatsApp.
 */
import {
  PrimaryCta,
  SecondaryCta,
  CTA_SLA_TEXT,
} from "@/components/conversion";
import { useModal } from "@/lib/context/ModalContext";

export function CTASection() {
  const { openModal } = useModal();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0b4058] to-[#006183]">
      {/* Elemento decorativo de fondo — círculo degradado sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#dae553]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#f7a92a]/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24 text-center">
        <h2 className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight text-white md:text-4xl text-balance">
          ¿Ya sabés a dónde querés ir?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed text-white/80 text-pretty">
          Personalizá tu consulta en el cotizador o hablá directo con un asesor por WhatsApp. Lo organizamos juntos.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <PrimaryCta
              size="lg"
              onClick={() => openModal()}
              aria-label="Armar viaje — abre el cotizador personalizado"
              className="font-bold shadow-lg shadow-[#f7a92a]/20"
            />
            <SecondaryCta
              size="lg"
              aria-label="Escribinos por WhatsApp — abre el chat directo"
              className="font-bold"
            />
          </div>
          <span className="text-sm text-white/50">{CTA_SLA_TEXT}</span>
        </div>
      </div>
    </section>
  );
}
