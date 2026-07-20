/**
 * components/sections/AboutUs.tsx
 *
 * Historia y presencia física. Primaria: local en el aeropuerto.
 * Secundaria: equipo en feria (FIT) — framing honesto, no como aeropuerto.
 */
import Image from "next/image";
import { MapPin } from "lucide-react";
import { GOOGLE_MAPS_LINK } from "@/lib/constants";

export function AboutUs() {
  return (
    <section id="nosotros" className="bg-[#f9f9f9]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-12 md:items-center md:gap-12 md:py-16">
        <div className="motion-about-settle relative md:col-span-5 pb-10 md:pb-12 pr-10 md:pr-12">
          <div className="overflow-hidden rounded-3xl border border-[#0b4058]/10 shadow-lg shadow-[#0b4058]/5">
            <Image
              src="/nosotros-local.jpg"
              alt="Local de 787 Rumbos y Vía Bariloche en el hall de arribos del Aeropuerto de Córdoba"
              width={800}
              height={600}
              sizes="(max-width: 768px) 100vw, 42vw"
              className="h-[260px] w-full object-cover object-[center_30%] md:h-[380px]"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[55%] md:w-[60%] overflow-hidden rounded-2xl border-4 md:border-[6px] border-white shadow-2xl">
            <Image
              src="/nosotros.jpg"
              alt="Integrante del equipo 787 Rumbos en una feria de turismo"
              width={500}
              height={375}
              sizes="(max-width: 768px) 55vw, 25vw"
              className="h-[150px] w-full object-cover object-top md:h-[220px]"
            />
          </div>
        </div>

        <div className="md:col-span-7 md:pl-4">
          <h2 className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight md:text-4xl text-balance">
            De la terminal al mundo
          </h2>
          <p className="mt-5 max-w-2xl text-[1.03rem] leading-relaxed text-[#0b4058]/80 text-pretty">
            Llevamos años dedicados al rubro del transporte y el turismo. Conocemos lo que significa viajar porque lo vivimos todos los días desde nuestro local en el aeropuerto, junto a las boleterías oficiales de Vía Bariloche en el hall de arribos. Decidimos abrir 787 Rumbos para ir un paso más allá y ofrecer a nuestros pasajeros el acompañamiento cercano que siempre quisimos darles.
          </p>

          <div className="mt-6 border-l-4 border-[#e6b451] pl-4 py-1 space-y-2 max-w-2xl">
            <p className="text-xs font-bold text-[#0b4058] uppercase tracking-wider">
              ¿Dónde encontrarnos?
            </p>
            <p className="text-xs text-[#0b4058]/80 leading-relaxed text-pretty">
              Buscá nuestra oficina oficial en la boletería de <strong>Vía Bariloche</strong>{" "}
              directamente en la zona de <strong>Arribos</strong> del Aeropuerto Internacional de
              Córdoba.
            </p>
            <p className="text-xs text-[#0b4058]/80 leading-relaxed text-pretty">
              <strong>Servicios integrales:</strong> Presupuestamos tus paquetes turísticos a
              medida, pasajes aéreos y también emitimos pasajes terrestres de ómnibus nacionales en
              el acto.
            </p>
          </div>
          <div className="mt-8">
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#0b4058] hover:bg-[#0b4058] hover:text-white text-[#0b4058] px-6 py-3 text-sm font-bold shadow-sm transition-all duration-200 active:scale-[0.97] cursor-pointer"
              aria-label="Cómo llegar a nuestra oficina en el Aeropuerto de Córdoba"
            >
              <MapPin className="h-4 w-4 shrink-0 text-current" />
              <span>Cómo llegar a nuestra oficina</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
