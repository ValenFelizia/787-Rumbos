"use client";
/**
 * components/sections/Navbar.tsx
 *
 * Barra de navegación sticky. Permanece visible al hacer scroll.
 * Contiene el logo, enlaces de navegación con anclas y CTAs.
 * En mobile se colapsa en un menú hamburguesa premium.
 */
import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useModal } from "@/lib/context/ModalContext";
import { WHATSAPP_LINK } from "@/lib/constants";

export function Navbar() {
  const { openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Inicio", href: "/#" },
    { label: "Destinos", href: "/#destinos" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0b4058]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 md:py-4">
        {/* Logo */}
        <a href="/" className="inline-flex items-center transition duration-300 hover:opacity-90">
          <Image
            src="/logo.png"
            alt="Logo 787 Rumbos"
            width={280}
            height={56}
            priority
            className="h-10 w-auto object-contain md:h-12"
          />
        </a>

        {/* Enlaces de navegación en Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-[family-name:var(--font-brand-heading)] text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Botón de Cotizar & Hamburguesa */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal()}
            aria-label="Cotizar viaje a medida"
            className="hidden sm:inline-flex font-[family-name:var(--font-brand-heading)] items-center justify-center rounded-full bg-gradient-to-r from-[#f7a92a] to-[#e6b451] text-[#0b4058] shadow-sm shadow-[#f7a92a]/30 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-md hover:shadow-[#f7a92a]/40 cursor-pointer px-5 py-2 md:py-2.5 text-xs md:text-sm md:gap-2"
          >
            <WhatsAppIcon size={14} className="h-3.5 w-3.5 shrink-0" />
            <span>Cotizar viaje</span>
          </button>

          {/* Botón de Menú Hamburguesa en Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            className="md:hidden text-white hover:text-[#dae553] p-1.5 transition-colors focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable en Mobile */}
      {/* ponytail: smooth native CSS transition, zero extra packages */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-350 ease-in-out border-t border-white/5 bg-[#0b4058] ${
          isOpen ? "max-h-[380px] opacity-100 py-6" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-6 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-[family-name:var(--font-brand-heading)] text-base font-semibold text-white/80 hover:text-[#dae553] transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-2 border-t border-white/10 pt-4">
            <button
              onClick={() => {
                setIsOpen(false);
                openModal();
              }}
              className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f7a92a] to-[#e6b451] text-[#0b4058] py-3 text-sm font-bold shadow-md cursor-pointer"
            >
              <WhatsAppIcon size={16} className="h-4 w-4 shrink-0" />
              Cotizar viaje
            </button>
            <a
              href={WHATSAPP_LINK}
              onClick={() => setIsOpen(false)}
              className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white py-3 text-sm font-bold transition-colors"
            >
              <WhatsAppIcon size={16} className="h-4 w-4 shrink-0" />
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
