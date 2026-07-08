import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_404_LINK } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b4058] to-[#006183] text-white px-6">
      <div className="relative z-10 max-w-md w-full text-center space-y-8 py-12">
        {/* Elemento decorativo */}
        <div className="mx-auto w-24 h-24 rounded-full bg-[#f7a92a]/10 flex items-center justify-center animate-pulse">
          <span className="text-4xl">✈️</span>
        </div>

        <div className="space-y-4">
          <h1 className="font-[family-name:var(--font-brand-heading)] text-7xl font-extrabold text-[#dae553] tracking-tight">
            404
          </h1>
          <h2 className="font-[family-name:var(--font-brand-heading)] text-2xl font-bold">
            Esta página no existe, pero tu próximo viaje sí.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto">
            El camino que buscabas no está disponible, pero estamos listos para ayudarte a armar la aventura que querés.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={WHATSAPP_404_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-brand-heading)] inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7a92a] to-[#e6b451] text-[#0b4058] px-6 py-3.5 font-bold shadow-lg shadow-[#f7a92a]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
          >
            <WhatsAppIcon size={16} className="h-4 w-4 shrink-0" />
            Consultar por WhatsApp
          </a>
          <Link
            href="/"
            className="font-[family-name:var(--font-brand-heading)] text-sm font-semibold text-white/80 hover:text-white transition-colors py-2 underline decoration-[#dae553]/50 hover:decoration-[#dae553]"
          >
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Círculos decorativos sutiles */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#dae553]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#f7a92a]/5 blur-3xl" />
    </main>
  );
}
