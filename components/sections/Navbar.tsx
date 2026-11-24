"use client";
/**
 * components/sections/Navbar.tsx
 *
 * Barra sticky. En desktop, los CTAs se ocultan mientras #hero ocupa el viewport
 * (T-028 / T-030 / T-043) para no duplicar el par del Hero; al scrollear fuera
 * reaparecen.
 */
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { PrimaryCta, SecondaryCta } from "@/components/conversion";
import { useModal } from "@/lib/context/ModalContext";
import { DIALOG_CLOSEDBY_ANY, setAutofocus, useModalDialog } from "@/lib/use-modal-dialog";

/** Sticky nav clearance; hero still below this → CTAs del nav ocultos. */
const NAV_CLEARANCE_PX = 80;
const NAVBAR_PRIMARY_CTA_GLOW_CLASS = "navbar-primary-cta";

/**
 * ¿El Hero sigue ocupando viewport debajo del nav?
 * Fail-closed: sin #hero asumimos que sí (CTAs ocultos en home).
 * Evita el IntersectionObserver del primer paint, que a veces reportaba
 * isIntersecting=false y dejaba los CTAs visibles hasta el próximo scroll.
 */
function isHeroOccupyingViewport(): boolean {
  const hero = document.getElementById("hero");
  if (!hero) return true;
  return hero.getBoundingClientRect().bottom > NAV_CLEARANCE_PX;
}

type NavbarProps = {
  /** The home route needs deterministic SSR markup before client hydration. */
  isHome?: boolean;
};

export function Navbar({ isHome = false }: NavbarProps) {
  const { openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  // Home: arrancar ocultos (Hero ya lleva el par). Otras rutas: siempre visibles.
  // Keep this route decision server-deterministic to avoid a hydration flash.
  const [showDesktopCtas, setShowDesktopCtas] = useState(!isHome);
  const desktopCtasRef = useRef<HTMLDivElement>(null);
  const logoLinkRef = useRef<HTMLAnchorElement>(null);
  const menuDialogRef = useModalDialog(isOpen, () => setIsOpen(false));

  // The menu is mobile-only; crossing to desktop width (e.g. rotating a phone) closes it
  // instead of leaving an invisible modal that keeps the page inert, then moves focus to
  // the visible logo because native close() tries to restore to the hidden hamburger button.
  useEffect(() => {
    if (!isOpen) return;
    const desktop = window.matchMedia("(min-width: 48rem)");
    const closeOnDesktop = () => {
      if (!desktop.matches) return;
      menuDialogRef.current?.close();
      logoLinkRef.current?.focus();
    };
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [isOpen, menuDialogRef]);

  // T-028/T-043: CTAs desktop siguen la geometría del Hero (sync + scroll/resize).
  useEffect(() => {
    if (!isHome) {
      setShowDesktopCtas(true);
      return;
    }

    const syncCtaVisibility = () => {
      setShowDesktopCtas(!isHeroOccupyingViewport());
    };

    // Lectura síncrona ya en el primer frame — no esperar un callback async.
    syncCtaVisibility();
    const rafId = window.requestAnimationFrame(syncCtaVisibility);

    window.addEventListener("scroll", syncCtaVisibility, { passive: true });
    window.addEventListener("resize", syncCtaVisibility);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", syncCtaVisibility);
      window.removeEventListener("resize", syncCtaVisibility);
    };
  }, [isHome]);

  // Si los CTAs se ocultan con foco dentro, devolverlo al logo.
  useEffect(() => {
    if (showDesktopCtas || !desktopCtasRef.current) return;
    if (desktopCtasRef.current.contains(document.activeElement)) {
      logoLinkRef.current?.focus();
    }
  }, [showDesktopCtas]);

  const navLinks = [
    { label: "Inicio", href: "/#hero" },
    { label: "Destinos", href: "/destinos" },
    { label: "Aéreos", href: "/aereos" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Preguntas", href: "/#preguntas-frecuentes" },
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
              sizes="140px"
              className="h-10 w-auto object-contain md:h-12"
            />
          </Link>

          <div className="hidden md:flex min-w-0 flex-1 items-center justify-center gap-5 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-[family-name:var(--font-brand-heading)] shrink-0 whitespace-nowrap text-sm font-semibold text-white/70 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
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
              <div className="navbar-cta-clip min-w-0">
                <div
                  ref={desktopCtasRef}
                  data-testid="desktop-navbar-ctas"
                  className="flex items-center gap-2 pr-0.5"
                  aria-hidden={!showDesktopCtas}
                  {...(!showDesktopCtas ? { inert: true } : {})}
                >
                  <PrimaryCta
                    size="sm"
                    onClick={() => openModal()}
                    aria-label="Armar viaje — abre el cotizador personalizado"
                    className={`${NAVBAR_PRIMARY_CTA_GLOW_CLASS} whitespace-nowrap`}
                  />
                  <SecondaryCta
                    size="sm"
                    surface="nav"
                    aria-label="Escribinos por WhatsApp — abre el chat directo"
                    className="whitespace-nowrap"
                  />
                </div>
              </div>
            </div>

            <button
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

      <dialog
        id="mobile-navigation-dialog"
        ref={menuDialogRef}
        {...DIALOG_CLOSEDBY_ANY}
        aria-label="Menú de navegación"
        inert={!isOpen}
        className="open:flex fixed inset-0 m-0 h-full w-full max-h-none max-w-none flex-col border-0 bg-[#0b4058] p-0 text-white backdrop:bg-transparent"
      >
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0b4058]/90">
          <Link href="/" onClick={() => setIsOpen(false)} className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="Logo 787 Rumbos"
              width={280}
              height={56}
              sizes="140px"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            ref={setAutofocus}
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
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-[family-name:var(--font-brand-heading)] text-2xl font-bold text-white/95 hover:text-[#dae553] transition-colors py-2 block border-b border-white/5"
              >
                {link.label}
              </Link>
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
              className={`${NAVBAR_PRIMARY_CTA_GLOW_CLASS} font-bold`}
            />
            <SecondaryCta
              size="full"
              surface="nav"
              onClick={() => setIsOpen(false)}
              aria-label="Escribinos por WhatsApp — abre el chat directo"
              className="font-bold"
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
