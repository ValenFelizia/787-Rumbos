"use client";

import type { ButtonHTMLAttributes } from "react";
import { CTA_PRIMARY_LABEL } from "./cta-copy";

const SIZE_CLASSES = {
  sm: "rounded-full px-5 py-2 text-xs md:py-2.5 md:text-sm",
  md: "rounded-full px-6 py-3.5 text-sm sm:py-3",
  lg: "rounded-full px-8 py-3.5 text-base",
  full: "w-full rounded-xl py-3.5 text-sm",
} as const;

type PrimaryCtaSize = keyof typeof SIZE_CLASSES;

type PrimaryCtaProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: PrimaryCtaSize;
  label?: string;
};

/**
 * Acción primaria canónica: abre el asistente de consulta (Armar viaje).
 * Sin ícono de WhatsApp — el resultado no es chat directo.
 */
export function PrimaryCta({
  size = "md",
  label = CTA_PRIMARY_LABEL,
  className = "",
  type = "button",
  ...props
}: PrimaryCtaProps) {
  return (
    <button
      type={type}
      className={`font-[family-name:var(--font-elaine)] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#f7a92a] to-[#e6b451] font-semibold text-[#0b4058] shadow-md shadow-[#f7a92a]/30 transition-[filter,box-shadow,transform] duration-300 hover:brightness-105 hover:shadow-lg hover:shadow-[#f7a92a]/40 active:scale-[0.96] cursor-pointer ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
}
