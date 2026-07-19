/**
 * components/sections/TrustBar.tsx
 *
 * Franja de presencia bajo el hero: lugar físico + credenciales.
 * No es un strip de íconos genéricos — la firma es el aeropuerto de Córdoba.
 */
import Image from "next/image";
import { GOOGLE_MAPS_LINK } from "@/lib/constants";

const credentials = [
  {
    label: "Agencia habilitada",
    sublabel: "Legajo 20455",
  },
  {
    label: "Cámara de Turismo",
    sublabel: "Provincia de Córdoba",
    href: "https://camaracbaturismo.org.ar/",
  },
  {
    label: "Financiación",
    sublabel: "Consultá opciones",
  },
];

export function TrustBar() {
  return (
    <section
      aria-label="Presencia en el aeropuerto y credenciales"
      className="border-b border-white/10 bg-[#0b4058]"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:gap-10 md:py-5">
        <a
          href={GOOGLE_MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-w-0 flex-1 items-center gap-4 outline-none focus-visible:ring-2 focus-visible:ring-[#dae553] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b4058] rounded-lg"
        >
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-white/15 md:h-[4.5rem] md:w-28">
            <Image
              src="/nosotros-local.jpg"
              alt=""
              fill
              sizes="112px"
              className="object-cover object-[center_35%]"
              aria-hidden
            />
          </div>
          <div className="min-w-0 text-left">
            <p className="font-[family-name:var(--font-elaine)] text-sm font-semibold text-white md:text-base">
              Hall de arribos · Aeropuerto de Córdoba
            </p>
            <p className="mt-0.5 text-xs text-white/65 md:text-sm">
              Local oficial de Vía Bariloche —{" "}
              <span className="text-[#dae553] underline-offset-2 group-hover:underline">
                Cómo llegar
              </span>
            </p>
          </div>
        </a>

        <ul className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-8 md:gap-6">
          {credentials.map((item) => {
            const body = (
              <>
                <span className="font-[family-name:var(--font-elaine)] block text-xs font-semibold text-white sm:text-sm">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[10px] text-white/55 sm:text-xs">
                  {item.sublabel}
                </span>
              </>
            );

            return (
              <li key={item.label} className="text-center md:text-left">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded outline-none transition-colors hover:text-[#dae553] focus-visible:ring-2 focus-visible:ring-[#dae553]"
                  >
                    {body}
                  </a>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
