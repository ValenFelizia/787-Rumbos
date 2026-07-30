/**
 * components/sections/Services.tsx
 *
 * Grid de servicios — tiles con affordance visual de catálogo.
 * Los datos vienen de `lib/constants.ts` (services).
 * Si un servicio tiene `href`, el tile es un enlace (p. ej. Pasajes Aéreos → /aereos).
 */
import Link from "next/link";
import { services } from "@/lib/constants";

export function Services() {
  return (
    <section id="servicios" className="border-t border-[#0b4058]/10 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-16">
        <h2 className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight md:text-4xl">
          Servicios que resolvemos por vos
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service) => {
            const Icon = service.icon;
            const className =
              "rounded-2xl border border-[#0b4058]/10 bg-[#f9f9f9] p-6 transition-colors duration-200 hover:border-[#a2c745] hover:bg-white";
            const body = (
              <>
                <Icon className="h-8 w-8 text-[#006183]" aria-hidden />
                <h3 className="font-[family-name:var(--font-elaine)] mt-4 text-lg font-bold">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-[#0b4058]/80">{service.description}</p>
              </>
            );

            if (service.href) {
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className={`${className} block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006183]`}
                  aria-label={`${service.title}: ver más`}
                >
                  {body}
                </Link>
              );
            }

            return (
              <div key={service.title} className={className}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
