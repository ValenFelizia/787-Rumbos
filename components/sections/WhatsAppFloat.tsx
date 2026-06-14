"use client";

/**
 * components/sections/WhatsAppFloat.tsx
 *
 * Botón flotante de WhatsApp — visible solo en mobile (md:hidden).
 *
 * Por qué 'use client':
 * Usamos `useState` + `useEffect` para detectar cuando el footer entra
 * en el viewport y ocultar el botón (evitar superposición). También
 * IntersectionObserver, que es una API del navegador.
 *
 * Por qué solo en mobile:
 * En desktop el CTA de la navbar y los botones de sección siempre son
 * visibles. En mobile el usuario puede estar en la mitad de la página
 * sin un CTA a la vista — el botón flotante resuelve eso.
 *
 * Comportamiento:
 * - Aparece después de 3 segundos (no interrumpir la primera impresión)
 * - Se oculta cuando el footer entra en el viewport (no pisar el copyright)
 * - Pulse animation sutil para llamar la atención sin ser molesto
 */
import { useEffect, useState, useRef } from "react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_LINK } from "@/lib/constants";

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [hiddenByFooter, setHiddenByFooter] = useState(false);
  const footerRef = useRef<Element | null>(null);

  useEffect(() => {
    // Mostrar después de 3 segundos
    const showTimer = setTimeout(() => setVisible(true), 3000);

    // Ocultar cuando el footer entra en el viewport
    footerRef.current = document.querySelector("footer");
    let observer: IntersectionObserver | null = null;

    if (footerRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => setHiddenByFooter(entry.isIntersecting),
        { threshold: 0.1 }
      );
      observer.observe(footerRef.current);
    }

    return () => {
      clearTimeout(showTimer);
      observer?.disconnect();
    };
  }, []);

  const isShown = visible && !hiddenByFooter;

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp — abre WhatsApp"
      className={`
        fixed bottom-5 right-5 z-50
        flex h-14 w-14 items-center justify-center
        rounded-full bg-[#25d366] text-white
        shadow-lg shadow-black/20
        transition-all duration-500
        md:hidden
        ${isShown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}
      `}
    >
      {/* Anillo de pulse — solo se activa si el usuario no prefiere movimiento reducido */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25d366] motion-safe:animate-ping opacity-30"
      />
      <WhatsAppIcon size={28} />
    </a>
  );
}
