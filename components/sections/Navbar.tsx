"use client";
/**
 * components/sections/Navbar.tsx
 *
 * Barra sticky. En desktop, los CTAs se ocultan mientras #hero está a la vista
 * (T-028) para no duplicar el par del Hero; al scrollear fuera reaparecen.
 */
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PrimaryCta, SecondaryCta } from "@/components/conversion";
import { useModal } from "@/lib/context/ModalContext";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function Navbar() {
  const { openModal } = useModal();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // Home: arrancar ocultos (Hero ya lleva el par). Otras rutas: siempre visibles.
  const [showDesktopCtas, setShowDesktopCtas] = useState(pathname !== "/");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDivElement>(null);
  const closeMenuButtonRef = useRef<HTMLButtonElement>(null);
  const desktopCtasRef = useRef<HTMLDivElement>(null);
  const logoLinkRef = useRef<HTMLAnchorElement>(null);

  // T-028: CTAs desktop siguen la visibilidad del Hero.
  useEffect(() => {
    if (pathname !== "/") {
      setShowDesktopCtas(true);
      return;
    }

    const hero = document.getElementById("hero");
    if (!hero) {
      setShowDesktopCtas(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Intersecta → Hero a la vista → ocultar CTAs del nav.
        // Sale → revelar; vuelve → ocultar de nuevo.
        setShowDesktopCtas(!entry.isIntersecting);
      },
      {
        // Debajo del sticky nav (~73–80px); un poco de histeresis abajo evita flicker.
        rootMargin: "-80px 0px -15% 0px",
        threshold: 0,
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  // Si los CTAs se ocultan con foco dentro, devolverlo al logo.
  useEffect(() => {
    if (showDesktopCtas || !desktopCtasRef.current) return;
    if (desktopCtasRef.current.contains(document.activeElement)) {
      logoLinkRef.current?.focus();
    }
  }, [showDesktopCtas]);

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

      if (!menuDialogRef.current.contains(activeElement)) {
        e.preventDefault();
        (e.shiftKey ? lastElement : firstElement).focus();
      } else if (e.shiftKey && activeElement === firstElement) {
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
    { label: "Inicio", href: "/#hero" },
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
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3 md:py-4">
          <Link
            ref={logoLinkRef}
            href="/"
            className="inline-flex shrink-0 items-center transition duration-300 hover:opacity-90"
          >
            <Image
              src="/logo.png"
              alt="Logo 787 Rumbos"
              width={280}
              height={56}
              className="h-10 w-auto object-contain md:h-12"
            />
          </Link>

          <div className="hidden md:flex min-w-0 flex-1 items-center justify-center gap-8">
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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div
              className={`hidden sm:grid transition-[grid-template-columns,opacity] duration-300 ease-out motion-reduce:transition-none ${
                showDesktopCtas
                  ? "grid-cols-[1fr] opacity-100"
                  : "grid-cols-[0fr] opacity-0"
              }`}
            >
              <div className="min-w-0 overflow-hidden">
                <div
                  ref={desktopCtasRef}
                  className="flex items-center gap-2 pr-0.5"
                  aria-hidden={!showDesktopCtas}
                  {...(!showDesktopCtas ? { inert: true } : {})}
                >
                  <PrimaryCta
                    size="sm"
                    onClick={() => openModal()}
                    aria-label="Armar viaje — abre el cotizador personalizado"
                    className="shadow-sm shadow-[#f7a92a]/30 whitespace-nowrap"
                  />
                  <SecondaryCta
                    size="sm"
                    aria-label="Escribinos por WhatsApp — abre el chat directo"
                    className="whitespace-nowrap"
                  />
                </div>
              </div>
            </div>

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
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0b4058]/90">
          <Link href="/" onClick={() => setIsOpen(false)} className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="Logo 787 Rumbos"
              width={280}
              height={56}
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
            <PrimaryCta
              size="full"
              onClick={() => {
                setIsOpen(false);
                openModal();
              }}
              aria-label="Armar viaje — abre el cotizador personalizado"
              className="font-bold shadow-md"
            />
            <SecondaryCta
              size="full"
              onClick={() => setIsOpen(false)}
              aria-label="Escribinos por WhatsApp — abre el chat directo"
              className="font-bold"
            />
          </div>
        </div>
      </div>
    </>
  );
}
