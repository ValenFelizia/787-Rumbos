"use client";

import type { AnchorHTMLAttributes } from "react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_LINK } from "@/lib/constants";
import { CTA_SECONDARY_LABEL } from "./cta-copy";

const SIZE_CLASSES = {
  sm: "rounded-full px-5 py-2 text-xs md:py-2.5 md:text-sm",
  md: "rounded-full px-6 py-3.5 text-sm sm:py-3",
  lg: "rounded-full px-8 py-3.5 text-base",
  full: "w-full rounded-xl py-3.5 text-sm",
} as const;

type SecondaryCtaSize = keyof typeof SIZE_CLASSES;

type SecondaryCtaProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  size?: SecondaryCtaSize;
  label?: string;
  href?: string;
};

/**
 * Acción secundaria canónica: WhatsApp directo.
 * Ícono WA solo aquí (y en equivalentes que abren chat).
 */
export function SecondaryCta({
  size = "md",
  label = CTA_SECONDARY_LABEL,
  href = WHATSAPP_LINK,
  className = "",
  ...props
}: SecondaryCtaProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-[family-name:var(--font-elaine)] inline-flex items-center justify-center gap-2 bg-[#0B6B5F] font-semibold text-white transition-colors hover:bg-[#09574E] active:scale-[0.96] cursor-pointer ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      <WhatsAppIcon size={16} className="h-4 w-4 shrink-0" />
      {label}
    </a>
  );
}
