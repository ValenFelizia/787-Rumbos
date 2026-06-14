/**
 * components/sections/CTASection.tsx
 *
 * Sección de cierre — último empujón de conversión antes del footer.
 * Se diferencia del CTA del hero en tono: allá es "vení a conocernos",
 * acá es más cálido: "¿ya sabés a dónde querés ir? hablemos".
 *
 * Fondo con degradado de marca para marcar visualmente el cierre de
 * la página y crear contraste con la sección de servicios (crema).
 */
import { Send } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";

export function CTASection() {
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

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-center">
        <h2 className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight text-white md:text-4xl">
          ¿Ya sabés a dónde querés ir?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed text-white/80">
          Mandanos un mensaje y lo organizamos juntos. Sin formularios, sin esperas:
          hablás directo con nosotros por WhatsApp.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            aria-label="Iniciar consulta por WhatsApp — abre WhatsApp en una nueva pestaña"
            className="font-[family-name:var(--font-elaine)] inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#f7a92a] to-[#e6b451] px-8 py-3.5 text-base font-bold text-[#0b4058] shadow-lg shadow-[#f7a92a]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#f7a92a]/30"
          >
            <Send className="h-4 w-4" />
            Hablemos por WhatsApp
          </a>
          <span className="text-sm text-white/50">Respondemos en menos de 2 horas</span>
        </div>
      </div>
    </section>
  );
}
