/**
 * components/sections/Services.tsx
 *
 * Grid de servicios — los 4 servicios principales que ofrece la agencia.
 * Los datos vienen de `lib/constants.ts` (services).
 *
 * Nota sobre iconos dinámicos:
 * Los nombres de componente en React deben empezar con mayúscula.
 * Por eso hacemos `const Icon = service.icon` — guardamos la referencia
 * en una variable con mayúscula y luego renderizamos `<Icon />`.
 * Si escribiéramos `<service.icon />` fallaría; React lo trataría como
 * elemento HTML desconocido en lugar de un componente.
 */
import { Montserrat } from "next/font/google";
import { services } from "@/lib/constants";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700", "800"] });

export function Services() {
  return (
    <section className="border-t border-[#0b4058]/10 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl`}>
          Servicios que resolvemos por vos
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            // Asignación a variable con mayúscula para renderizado dinámico de componente
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="rounded-2xl border border-[#0b4058]/10 bg-[#f9f9f9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#a2c745] hover:bg-white hover:shadow-xl hover:shadow-[#0b4058]/10"
              >
                <Icon className="h-8 w-8 text-[#006183]" />
                <h3 className={`${montserrat.className} mt-4 text-lg font-bold`}>
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-[#0b4058]/80">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
