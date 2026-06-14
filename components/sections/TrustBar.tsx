/**
 * components/sections/TrustBar.tsx
 *
 * Barra de confianza — aparece inmediatamente debajo del hero.
 * Objetivo: que el visitante vea las señales de legitimidad (AFIP, Cámara,
 * habilitación) antes de scrollear, no al llegar al footer.
 *
 * Contenido:
 *   - Agencia habilitada con legajo oficial
 *   - Miembro de la Cámara de Turismo de Córdoba
 *   - Financiación disponible
 *   - Presencia local (aeropuerto)
 *
 * Fondo oscuro (azul petróleo) para crear una transición visual clara
 * entre el hero y la sección siguiente (blanca).
 */
import { BadgeCheck, Building2, CreditCard, MapPin } from "lucide-react";

const trustItems = [
  {
    icon: BadgeCheck,
    label: "Agencia habilitada",
    sublabel: "Legajo 20455",
  },
  {
    icon: Building2,
    label: "Cámara de Turismo",
    sublabel: "Provincia de Córdoba",
  },
  {
    icon: CreditCard,
    label: "Financiación disponible",
    sublabel: "Consultá opciones",
  },
  {
    icon: MapPin,
    label: "En el Aeropuerto",
    sublabel: "Córdoba, Argentina",
  },
];

export function TrustBar() {
  return (
    <section
      aria-label="Credenciales y confianza"
      className="border-b border-white/10 bg-[#0b4058]"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px px-6 py-0 md:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex flex-col items-center gap-1 px-4 py-5 text-center transition-colors duration-200 hover:bg-white/5"
            >
              <Icon className="h-5 w-5 text-[#dae553]" />
              <span className="font-[family-name:var(--font-elaine)] text-sm font-semibold text-white">
                {item.label}
              </span>
              <span className="text-xs text-white/60">{item.sublabel}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
