/**
 * components/sections/ValueProposition.tsx
 *
 * Diferenciales verificables de la agencia: oficina en el aeropuerto,
 * experiencia en transporte y oferta aérea + terrestre.
 * Sección estática con tarjetas fijas (no usa un array porque son exactamente 3
 * y cada una tiene su propio ícono diferente).
 */
import { Bus, MapPin, Plane } from "lucide-react";


export function ValueProposition() {
  return (
    <section className="border-y border-[#0b4058]/10 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight md:text-4xl text-balance">
          Por qué viajar con 787 Rumbos
        </h2>
        <p className="mt-5 max-w-4xl text-[1.02rem] leading-relaxed text-[#0b4058]/80 text-pretty">
          Trabajamos desde el hall de arribos del Aeropuerto de Córdoba, dentro del local oficial
          de Vía Bariloche. Combinamos años en transporte turístico con una oferta clara: vuelos,
          paquetes y pasajes de ómnibus nacionales, con el mismo equipo de punta a punta.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-7 border-t-4 border-[#e6b451] shadow-md shadow-[#0b4058]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0b4058]/15">
            <MapPin className="h-8 w-8 text-[#e6b451]" />
            <h3 className="font-[family-name:var(--font-elaine)] mt-4 text-xl font-bold">
              Oficina en el aeropuerto
            </h3>
            <p className="mt-2 text-sm text-[#0b4058]/80 text-pretty">
              Encontranos en el hall de arribos, en el local oficial de Vía Bariloche. Presencia
              física real, no solo un número de WhatsApp.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-7 border-t-4 border-[#e6b451] shadow-md shadow-[#0b4058]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0b4058]/15">
            <Bus className="h-8 w-8 text-[#e6b451]" />
            <h3 className="font-[family-name:var(--font-elaine)] mt-4 text-xl font-bold">
              Experiencia en transporte
            </h3>
            <p className="mt-2 text-sm text-[#0b4058]/80 text-pretty">
              Años en el rubro del transporte junto a Vía Bariloche nos dan criterio para recomendarte
              la mejor opción de viaje desde Córdoba.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-7 border-t-4 border-[#e6b451] shadow-md shadow-[#0b4058]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0b4058]/15">
            <Plane className="h-8 w-8 text-[#e6b451]" />
            <h3 className="font-[family-name:var(--font-elaine)] mt-4 text-xl font-bold">
              Aéreo y terrestre
            </h3>
            <p className="mt-2 text-sm text-[#0b4058]/80 text-pretty">
              Paquetes con vuelos, salidas grupales y pasajes de ómnibus nacionales emitidos en el
              acto, según lo que más te convenga.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
