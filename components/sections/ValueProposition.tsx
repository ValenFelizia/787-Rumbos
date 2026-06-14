/**
 * components/sections/ValueProposition.tsx
 *
 * "Tu viaje, nuestra prioridad" — los tres pilares diferenciales de la agencia.
 * Sección estática con tarjetas fijas (no usa un array porque son exactamente 3
 * y cada una tiene su propio ícono diferente).
 */
import { Heart, ShieldCheck, Users } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700", "800"] });

export function ValueProposition() {
  return (
    <section className="border-y border-[#0b4058]/10 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl`}>
          Tu viaje, nuestra prioridad
        </h2>
        <p className="mt-5 max-w-4xl text-[1.02rem] leading-relaxed text-[#0b4058]/80">
          En 787 Rumbos creemos que cada pasajero es único. No usamos respuestas automáticas ni
          te dejamos solo. Nuestro mayor capital es la atención humana: te escuchamos, entendemos
          lo que buscás y te acompañamos personalmente desde el primer mensaje de WhatsApp hasta
          que volvés a casa con una sonrisa.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-7 shadow-md shadow-[#0b4058]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0b4058]/15">
            <Heart className="h-8 w-8 text-[#e6b451]" />
            <h3 className={`${montserrat.className} mt-4 text-xl font-bold`}>Pasión por viajar</h3>
            <p className="mt-2 text-sm text-[#0b4058]/80">
              Cada propuesta lleva nuestra dedicación y cuidado por los detalles.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-7 shadow-md shadow-[#0b4058]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0b4058]/15">
            <Users className="h-8 w-8 text-[#e6b451]" />
            <h3 className={`${montserrat.className} mt-4 text-xl font-bold`}>Atención humana</h3>
            <p className="mt-2 text-sm text-[#0b4058]/80">
              Hablás directo con nosotros. Te asesoramos con paciencia y calidez en cada paso.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-7 shadow-md shadow-[#0b4058]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0b4058]/15">
            <ShieldCheck className="h-8 w-8 text-[#e6b451]" />
            <h3 className={`${montserrat.className} mt-4 text-xl font-bold`}>
              Respaldo y experiencia
            </h3>
            <p className="mt-2 text-sm text-[#0b4058]/80">
              Años en el rubro del transporte turístico nos avalan para recomendarte siempre la
              mejor opción.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
