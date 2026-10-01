import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Destinos y paquetes desde Córdoba | 787 Rumbos",
  description:
    "Explorá salidas grupales y paquetes a medida desde Córdoba: Argentina, Brasil, Caribe y más. Asesoramiento humano por WhatsApp.",
  path: "/destinos",
  socialDescription:
    "Catálogo de destinos de 787 Rumbos: salidas confirmadas y viajes a medida desde Córdoba.",
});

export default function DestinosLayout({ children }: { children: ReactNode }) {
  return children;
}
