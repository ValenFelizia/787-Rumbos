/**
 * Prueba social cerca del catálogo.
 * Sin testimonios curados: invita a reseñar en Google.
 * Con testimonios autorizados en `lib/testimonials-data.ts`: los muestra y mantiene el CTA.
 */
import { Star, ExternalLink } from "lucide-react";
import {
  GOOGLE_REVIEWS_LINK,
  GOOGLE_WRITE_REVIEW_LINK,
} from "@/lib/constants";
import { testimonials, type Testimonial } from "@/lib/testimonials-data";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Calificación: ${rating} de 5 estrellas`}>
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-[#e6b451] text-[#e6b451]" />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="border-t-4 border-[#e6b451] bg-white pt-6">
      <Stars rating={t.rating} />
      <p className="mt-4 text-sm leading-relaxed text-[#0b4058]/85 text-pretty">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="mt-5 border-t border-[#0b4058]/10 pt-4">
        <p className="font-[family-name:var(--font-elaine)] text-sm font-bold text-[#0b4058]">
          {t.name}
        </p>
        <p className="mt-0.5 text-xs text-[#0b4058]/60">
          Viajó a {t.destination} · {t.date}
        </p>
      </div>
    </article>
  );
}

export function Testimonials() {
  const hasReviews = testimonials.length > 0;

  return (
    <section
      id="testimonios"
      className="border-y border-[#0b4058]/10 bg-white"
      aria-labelledby="testimonios-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <h2
              id="testimonios-heading"
              className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight text-[#0b4058] md:text-4xl text-balance"
            >
              {hasReviews
                ? "Lo que cuentan quienes ya viajaron"
                : "Tu opinión también construye confianza"}
            </h2>
            <p className="text-sm leading-relaxed text-[#0b4058]/75 md:text-base text-pretty">
              {hasReviews
                ? "Experiencias reales de pasajeros que eligieron 787 Rumbos. Si viajaste con nosotros, sumá tu reseña en Google."
                : "Estamos reuniendo reseñas reales en Google. Si ya viajaste con nosotros, tu experiencia ayuda a la próxima familia que está eligiendo agencia."}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <a
              href={GOOGLE_WRITE_REVIEW_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b4058] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#006183] active:scale-[0.97]"
            >
              Dejar reseña en Google
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
            </a>
            {hasReviews && (
              <a
                href={GOOGLE_REVIEWS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#0b4058] px-5 py-3 text-sm font-bold text-[#0b4058] transition-all duration-200 hover:bg-[#0b4058] hover:text-white active:scale-[0.97]"
              >
                Ver en Maps
              </a>
            )}
          </div>
        </div>

        {hasReviews && (
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <TestimonialCard key={`${t.name}-${idx}`} t={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
