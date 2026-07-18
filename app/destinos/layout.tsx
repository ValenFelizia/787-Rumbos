import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Destinos y paquetes desde Córdoba | 787 Rumbos",
  description:
    "Explorá salidas grupales y paquetes a medida desde Córdoba: Argentina, Brasil, Caribe y más. Asesoramiento humano por WhatsApp.",
  alternates: {
    canonical: "https://www.787rumbos.com.ar/destinos",
  },
  openGraph: {
    title: "Destinos y paquetes desde Córdoba | 787 Rumbos",
    description:
      "Catálogo de destinos de 787 Rumbos: salidas confirmadas y viajes a medida desde Córdoba.",
    url: "https://www.787rumbos.com.ar/destinos",
  },
};

export default function DestinosLayout({ children }: { children: ReactNode }) {
  return children;
}
