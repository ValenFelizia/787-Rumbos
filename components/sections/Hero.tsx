/**
 * components/sections/Hero.tsx
 *
 * Sección hero — primera impresión al entrar al sitio.
 *
 * Puntos clave de performance:
 * - La imagen usa `priority` porque es el LCP (Largest Contentful Paint):
 *   el elemento más grande y visible en el viewport inicial. Con priority,
 *   Next.js le dice al navegador que la precargue antes de otros recursos.
 * - `fill` + `object-cover` replican el comportamiento de background-image CSS
 *   pero con optimización automática (WebP/AVIF, resize por breakpoint).
 * - `sizes="100vw"` indica que la imagen ocupa el 100% del ancho de pantalla,
 *   para que Next.js genere el srcset correcto.
 */
import Image from "next/image";
import { Send, Wallet } from "lucide-react";
import { Montserrat } from "next/font/google";
import { WHATSAPP_LINK } from "@/lib/constants";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700", "800"] });

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-73px)] items-center overflow-hidden">
      {/* Imagen de fondo optimizada — priority evita lazy loading en el LCP */}
      <Image
        src="/hero-bg.jpg"
        alt="Paisaje de viaje — 787 Rumbos agencia de viajes en Córdoba"
        fill
        priority
        quality={80}
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Overlay: degradado de marca — más intenso a la izquierda donde va el texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b4058]/85 via-[#0b4058]/50 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 text-white md:py-28">
        <div className="max-w-3xl space-y-7">
          <h1
            className={`${montserrat.className} text-4xl font-extrabold leading-tight tracking-tight md:text-6xl`}
          >
            Descubrí el mundo con el acompañamiento cercano de 787 Rumbos
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/90 md:text-[1.08rem]">
            Diseñamos propuestas personalizadas para que viajes con tranquilidad, respaldo y una
            atención realmente humana de principio a fin.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                aria-label="Consultar por WhatsApp — abre WhatsApp en una nueva pestaña"
                className={`${montserrat.className} inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7a92a] to-[#e6b451] px-6 py-3 font-semibold text-[#0b4058] shadow-md shadow-[#f7a92a]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#f7a92a]/40`}
              >
                <Send className="h-4 w-4" />
                Armá tu viaje ahora
              </a>
              {/* Micro-copy de confianza */}
              <span className="pl-1 text-xs text-white/70">Respondemos en menos de 2 horas</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#a2c745] bg-white/95 px-4 py-2 text-sm text-[#006183] shadow-sm shadow-[#0b4058]/10">
              <Wallet className="h-4 w-4" />
              Financiación disponible
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
