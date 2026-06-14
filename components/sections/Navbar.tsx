/**
 * components/sections/Navbar.tsx
 *
 * Barra de navegación sticky. Permanece visible al hacer scroll.
 * Contiene el logo (link a raíz) y el CTA principal de WhatsApp.
 *
 * Por qué es un Server Component (sin 'use client'):
 * No tiene estado local ni event handlers propios — el link de WhatsApp
 * es un <a> estándar. Si en el futuro se agrega un menú hamburguesa
 * con estado abierto/cerrado, habrá que agregar 'use client'.
 */
import Image from "next/image";
import { Send } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";

export function Navbar() {
  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 z-20 border-b border-white/10 bg-[#0b4058]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 md:py-4">
        <a href="/" className="inline-flex items-center transition duration-300 hover:opacity-90">
          <Image
            src="/logo.png"
            alt="Logo 787 Rumbos"
            width={280}
            height={56}
            priority
            className="h-12 w-auto object-contain md:h-14"
          />
        </a>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          aria-label="Consultar por WhatsApp — abre WhatsApp en una nueva pestaña"
          className="font-[family-name:var(--font-elaine)] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7a92a] to-[#e6b451] px-4 py-2 text-xs font-semibold text-[#0b4058] shadow-sm shadow-[#f7a92a]/30 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-md hover:shadow-[#f7a92a]/40 md:px-5 md:py-2.5 md:text-sm"
        >
          <Send className="h-4 w-4" />
          Consultar por WhatsApp
        </a>
      </div>
    </nav>
  );
}
