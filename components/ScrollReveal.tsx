"use client";

/**
 * components/ScrollReveal.tsx
 *
 * Wrapper de animación de entrada por scroll.
 *
 * Por qué 'use client':
 * Este componente usa `useEffect` (ciclo de vida del navegador) y
 * `IntersectionObserver` (API del navegador). Ambas APIs no existen en el
 * servidor, por eso necesita correr en el cliente. Los Server Components
 * que lo usen pueden seguir siendo Server Components — solo este wrapper
 * es un Client Component.
 *
 * Cómo funciona:
 * 1. El elemento empieza invisible y desplazado (clase CSS `reveal-on-scroll`
 *    definida en globals.css).
 * 2. IntersectionObserver observa el elemento.
 * 3. Cuando el 15% del elemento entra en el viewport, agrega la clase `revealed`
 *    que activa la transición CSS (opacity 0→1, translateY 24px→0).
 * 4. El observer deja de observar el elemento (unobserve) para que la animación
 *    solo ocurra una vez, no cada vez que el usuario sube y baja.
 *
 * Uso:
 *   <ScrollReveal>
 *     <section>...cualquier contenido...</section>
 *   </ScrollReveal>
 *
 * El prop `delay` permite escalonar múltiples elementos (en ms, ej: delay={200}).
 */
import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Retraso opcional antes de que empiece la transición (en ms). Útil para escalonar elementos. */
  delay?: number;
  className?: string;
}

export function ScrollReveal({ children, delay = 0, className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Si el usuario prefiere movimiento reducido, mostrar el elemento directamente
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      el.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Aplicar delay si se especificó
          if (delay > 0) {
            setTimeout(() => el.classList.add("revealed"), delay);
          } else {
            el.classList.add("revealed");
          }
          // Una sola vez — dejar de observar
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    // Cleanup: desconectar el observer si el componente se desmonta
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`}>
      {children}
    </div>
  );
}
