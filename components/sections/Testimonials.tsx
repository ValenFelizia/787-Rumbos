/**
 * components/sections/Testimonials.tsx
 *
 * Sección de Testimonios y Reseñas de clientes.
 * Presenta las experiencias en tarjetas elegantes con estrellas, avatar y destino.
 * Por el momento, esta sección está estructurada y lista para mostrarse
 * en producción una vez que se cuente con testimonios reales.
 */
import { Star } from "lucide-react";

export interface Testimonial {
  name: string;
  destination: string;
  text: string;
  rating: number;
  date: string;
}

// ponytail: keep mock data inside the component file until real data arrives, avoids constant file bloat
const mockTestimonials: Testimonial[] = [
  {
    name: "Claudio G.",
    destination: "Río de Janeiro, Brasil",
    text: "Excelente atención y acompañamiento de Fernanda en todo momento. El paquete a Río estuvo impecable, los traslados a término y el hotel súper cómodo. Muy recomendable viajar así.",
    rating: 5,
    date: "Marzo 2026",
  },
  {
    name: "Mariela S.",
    destination: "Bariloche, Argentina",
    text: "Elegimos 787 Rumbos por la comodidad de tener oficina física en el aeropuerto. La financiación en cuotas nos facilitó todo. Viajamos sin preocupaciones y siempre respondieron rápido.",
    rating: 5,
    date: "Mayo 2026",
  },
  {
    name: "Federico B.",
    destination: "Ushuaia, Argentina",
    text: "Una atención humana que ya no se encuentra en las webs de viajes comunes. Nos armaron un itinerario a medida que superó nuestras expectativas. Sin dudas volveremos a cotizar con ellos.",
    rating: 5,
    date: "Junio 2026",
  },
];

export function Testimonials() {
  return (
    <section id="testimonios" className="bg-[#f9f9f9] border-t border-[#0b4058]/10">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight md:text-4xl">
            La experiencia de nuestros viajeros
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#0b4058]/75 max-w-2xl mx-auto">
            Opiniones reales de pasajeros que confiaron en 787 Rumbos para planificar sus vacaciones.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {mockTestimonials.map((t, idx) => (
            <article
              key={`${t.name}-${idx}`}
              className="rounded-2xl bg-white p-7 border border-[#0b4058]/5 shadow-sm shadow-[#0b4058]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0b4058]/10"
            >
              {/* Estrellas */}
              <div className="flex gap-0.5 mb-4" aria-label={`Calificación: ${t.rating} de 5 estrellas`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-[#f7a92a] text-[#f7a92a]" />
                ))}
              </div>

              {/* Texto del testimonio */}
              <p className="text-sm text-[#0b4058]/85 italic leading-relaxed mb-6">
                &quot;{t.text}&quot;
              </p>

              {/* Autor info */}
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4 mt-auto">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006183]/10 font-bold text-[#006183] text-sm">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-elaine)] text-sm font-bold text-[#0b4058]">
                    {t.name}
                  </h3>
                  <p className="text-xs text-[#0b4058]/60">
                    Viajó a <span className="font-semibold">{t.destination}</span> · {t.date}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
