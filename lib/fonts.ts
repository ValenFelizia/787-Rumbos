/**
 * lib/fonts.ts — Fuentes tipográficas de marca de 787 Rumbos.
 *
 * Usamos `next/localFont` (y no @font-face en CSS) porque Next.js:
 * - Genera el preload automático en el <head>, evitando FOIT (Flash of Invisible Text)
 * - Aplica `font-display: swap` por defecto
 * - Sirve las fuentes desde el mismo dominio (sin requests a Google/externos)
 * - Crea una clase CSS única que podemos pasar como className a cualquier elemento
 *
 * Jerarquía tipográfica de 787 Rumbos (según manual de marca):
 *   - Elaine Sans → títulos, CTAs, textos destacados
 *   - Zalando Sans → cuerpo de texto, párrafos, etiquetas
 *
 * Los archivos .woff2 son subsets generados desde los .ttf con
 * `npm run fonts:subset`; no editarlos a mano.
 */
import localFont from "next/font/local";

/** Elaine Sans — tipografía de titulares de la marca.
 *  Disponible en tres pesos: medium (400), semibold (600) y bold (700). */
export const elaineSans = localFont({
  src: [
    {
      path: "../public/fonts/elaine-sans.medium.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/elaine-sans.semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/elaine-sans.bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-elaine",
  display: "swap",
});

/** Zalando Sans — tipografía de cuerpo de la marca.
 *  Variable font: soporta cualquier peso entre 100 y 900. */
export const zalandoSans = localFont({
  src: "../public/fonts/ZalandoSans-VariableFont_wdth,wght.woff2",
  variable: "--font-zalando",
  display: "swap",
});
