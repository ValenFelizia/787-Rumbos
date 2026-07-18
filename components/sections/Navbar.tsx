"use client";
/**
 * components/sections/Navbar.tsx
 *
 * Barra de navegación sticky. Permanece visible al hacer scroll.
 * Contiene el logo, enlaces de navegación con anclas y CTAs.
 * En mobile se despliega un overlay a pantalla completa (h-[100dvh])
 * que bloquea el scroll del cuerpo para una experiencia óptima y fluida.
 */
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useModal } from "@/lib/context/ModalContext";
import { WHATSAPP_LINK } from "@/lib/constants";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function Navbar() {
  const { openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDivElement>(null);
  const closeMenuButtonRef = useRef<HTMLButtonElement>(null);

  // El menú mobile funciona como overlay modal: foco contenido, Escape y retorno al disparador.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => closeMenuButtonRef.current?.focus());

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key !== "Tab" || !menuDialogRef.current) return;

      const focusableElements = Array.from(
        menuDialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (e.shiftKey && (activeElement === firstElement || !menuDialogRef.current.contains(activeElement))) {
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
  }, [isOpen]);

  const navLinks = [
    { label: "Inicio", href: "/#" },
    { label: "Destinos", href: "/destinos" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Preguntas frecuentes", href: "/#preguntas-frecuentes" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ];

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="sticky top-0 z-40 border-b border-white/10 bg-[#0b4058]/90 backdrop-blur-md"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center transition duration-300 hover:opacity-90">
            <Image
              src="/logo.png"
              alt="Logo 787 Rumbos"
              width={280}
              height={56}
              priority
              className="h-10 w-auto object-contain md:h-12"
            />
          </Link>

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
              className="hidden sm:inline-flex font-[family-name:var(--font-brand-heading)] items-center justify-center rounded-full bg-gradient-to-r from-[#f7a92a] to-[#e6b451] text-[#0b4058] shadow-sm shadow-[#f7a92a]/30 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-md hover:shadow-[#f7a92a]/40 active:scale-[0.96] transition-transform duration-200 cursor-pointer px-5 py-2 md:py-2.5 text-xs md:text-sm md:gap-2"
            >
              <WhatsAppIcon size={14} className="h-6 w-6 shrink-0" />
              <span className="font-semibold">Consultar por WhatsApp</span>
            </button>

            {/* Botón de Menú Hamburguesa en Mobile */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Abrir menú de navegación"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-dialog"
              className="md:hidden p-1.5 text-white transition-colors hover:text-[#dae553]"
            >
              <Menu aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Menú Desplegable a Pantalla Completa en Mobile */}
      {/* ponytail: full viewport height (dvh) overlay with vertical scroll fallback, locks body scroll */}
      <div
        id="mobile-navigation-dialog"
        ref={menuDialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-0 z-50 md:hidden flex flex-col bg-[#0b4058] transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-2"
          }`}
      >
        {/* Cabecera del menú móvil */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0b4058]/90">
          <Link href="/" onClick={() => setIsOpen(false)} className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="Logo 787 Rumbos"
              width={280}
              height={56}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            ref={closeMenuButtonRef}
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú de navegación"
            className="p-1.5 text-white transition-colors hover:text-[#dae553]"
          >
            <X aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {/* Cuerpo del menú móvil con scroll si es necesario */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-[family-name:var(--font-brand-heading)] text-2xl font-bold text-white/95 hover:text-[#dae553] transition-colors py-2 block border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setIsOpen(false);
                openModal();
              }}
              className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f7a92a] to-[#e6b451] text-[#0b4058] py-3.5 text-sm font-bold shadow-md cursor-pointer active:scale-[0.96] transition-transform duration-200"
            >
              <WhatsAppIcon size={16} className="h-4 w-4 shrink-0" />
              Cotizar viaje
            </button>
            <a
              href={WHATSAPP_LINK}
              onClick={() => setIsOpen(false)}
              className="font-[family-name:var(--font-brand-heading)] flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white py-3.5 text-sm font-bold transition-colors active:scale-[0.96] transition-transform duration-200"
            >
              <WhatsAppIcon size={16} className="h-4 w-4 shrink-0" />
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
