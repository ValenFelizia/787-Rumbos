/**
 * components/sections/ValueProposition.tsx
 *
 * Diferenciales verificables. Middle ground T-025: conserva las tres cards
 * (preferencia visual) pero sin side-tab dorado ni sombra pesada.
 */
import { Bus, MapPin, Plane } from "lucide-react";

export function ValueProposition() {
  return (
    <section className="border-y border-[#0b4058]/10 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-16">
        <h2 className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight md:text-4xl text-balance">
          Por qué viajar con 787 Rumbos
        </h2>
        <p className="mt-5 max-w-4xl text-[1.02rem] leading-relaxed text-[#0b4058]/80 text-pretty">
          Trabajamos desde el hall de arribos del Aeropuerto de Córdoba, dentro del local oficial
          de Vía Bariloche. Combinamos años en transporte turístico con una oferta clara: vuelos,
          paquetes y pasajes de ómnibus nacionales, con el mismo equipo de punta a punta.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          <article className="rounded-2xl border border-[#0b4058]/10 bg-[#f9f9f9] p-6 md:p-7">
            <MapPin className="h-7 w-7 text-[#e6b451]" />
            <h3 className="font-[family-name:var(--font-elaine)] mt-4 text-xl font-bold">
              Oficina en el aeropuerto
            </h3>
            <p className="mt-2 text-sm text-[#0b4058]/80 text-pretty">
              Encontranos en el hall de arribos, en el local oficial de Vía Bariloche. Presencia
              física real, no solo un número de WhatsApp.
            </p>
          </article>
          <article className="rounded-2xl border border-[#0b4058]/10 bg-[#f9f9f9] p-6 md:p-7">
            <Bus className="h-7 w-7 text-[#e6b451]" />
            <h3 className="font-[family-name:var(--font-elaine)] mt-4 text-xl font-bold">
              Experiencia en transporte
            </h3>
            <p className="mt-2 text-sm text-[#0b4058]/80 text-pretty">
              Años en el rubro del transporte junto a Vía Bariloche nos dan criterio para recomendarte
              la mejor opción de viaje desde Córdoba.
            </p>
          </article>
          <article className="rounded-2xl border border-[#0b4058]/10 bg-[#f9f9f9] p-6 md:p-7">
            <Plane className="h-7 w-7 text-[#e6b451]" />
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
