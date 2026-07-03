"use client";
/**
 * components/sections/Navbar.tsx
 *
 * Barra de navegación sticky. Permanece visible al hacer scroll.
 * Contiene el logo (link a raíz) y el CTA principal de WhatsApp.
 */
import Image from "next/image";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useModal } from "@/lib/context/ModalContext";

export function Navbar() {
  const { openModal } = useModal();

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
        <button
          onClick={() => openModal()}
          aria-label="Cotizar viaje a medida"
          className="font-[family-name:var(--font-elaine)] inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f7a92a] to-[#e6b451] text-[#0b4058] shadow-sm shadow-[#f7a92a]/30 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-md hover:shadow-[#f7a92a]/40 cursor-pointer p-3 text-xs md:px-5 md:py-2.5 md:text-sm md:gap-2"
        >
          <WhatsAppIcon size={16} className="h-4 w-4 shrink-0" />
          <span className="hidden md:inline">Cotizar Viaje</span>
        </button>
      </div>
    </nav>
  );
}
