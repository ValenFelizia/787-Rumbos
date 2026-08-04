"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackWaClick, type WaSurface } from "@/lib/wa-analytics";

type TrackedWhatsAppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  surface: WaSurface;
  airline?: string;
};

/**
 * Enlace a WhatsApp que emite `wa_click` antes de abrir el chat.
 * Usar en superficies RSC (hub, landings, footer) sin convertir la sección a client.
 */
export function TrackedWhatsAppLink({
  surface,
  airline,
  onClick,
  children,
  ...props
}: TrackedWhatsAppLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackWaClick({ surface, airline });
    onClick?.(event);
  }

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
