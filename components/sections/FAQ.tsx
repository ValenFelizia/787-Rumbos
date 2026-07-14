/**
 * components/sections/FAQ.tsx
 *
 * Preguntas frecuentes — home comercial o por destino.
 * Emite schema FAQPage a partir de los `items` recibidos.
 */
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  faqItems as defaultFaqItems,
  faqAnswerToPlainText,
  WHATSAPP_FAQ_LINK,
  type FaqAnswerSegment,
  type FaqItem,
} from "@/lib/constants";

function renderFaqAnswer(segments: FaqAnswerSegment[]) {
  return segments.map((segment, index) => {
    if (segment.type === "text") {
      return <span key={index}>{segment.value}</span>;
    }

    return (
      <a
        key={index}
        href={segment.href}
        target={segment.external ? "_blank" : undefined}
        rel={segment.external ? "noopener noreferrer" : undefined}
        className="font-semibold text-[#006183] underline decoration-[#006183]/30 underline-offset-2 transition-colors hover:text-[#0b4058] hover:decoration-[#0b4058]/40"
        aria-label={
          segment.label === "WhatsApp"
            ? "Consultar por WhatsApp con 787 Rumbos"
            : segment.label === "línea de urgencias"
              ? "WhatsApp de urgencias — viaje en curso"
              : segment.label === "Cómo llegar"
                ? "Ver ubicación del local en Google Maps"
                : segment.label
        }
      >
        {segment.label}
      </a>
    );
  });
}

export interface FAQProps {
  items?: FaqItem[];
  id?: string;
  headingId?: string;
  title?: string;
  description?: ReactNode;
  /** Variante más compacta para páginas de destino */
  compact?: boolean;
}

export function FAQ({
  items = defaultFaqItems,
  id = "preguntas-frecuentes",
  headingId = "faq-heading",
  title = "Preguntas frecuentes",
  description,
  compact = false,
}: FAQProps) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqAnswerToPlainText(item.answer),
      },
    })),
  };

  const defaultDescription = (
    <>
      Si necesitás resolver una duda más específica,{" "}
      <a
        href={WHATSAPP_FAQ_LINK}
        className="font-semibold text-[#006183] underline decoration-[#006183]/30 underline-offset-2 transition-colors hover:text-[#0b4058] hover:decoration-[#0b4058]/40"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar por WhatsApp con 787 Rumbos"
      >
        consultanos
      </a>
      .
    </>
  );

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={
        compact
          ? "border-t border-[#0b4058]/10 bg-white"
          : "border-t border-[#0b4058]/10 bg-[#f9f9f9]"
      }
    >
      <div
        className={
          compact
            ? "mx-auto w-full max-w-6xl px-6 py-12 md:py-14"
            : "mx-auto w-full max-w-6xl px-6 py-20"
        }
      >
        <div className="mb-10 max-w-2xl">
          <h2
            id={headingId}
            className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight md:text-4xl text-balance"
          >
            {title}
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-[#0b4058]/80 text-pretty">
            {description ?? defaultDescription}
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.id}
              className="group rounded-2xl border border-[#0b4058]/10 bg-white shadow-sm shadow-[#0b4058]/5 transition-[border-color,box-shadow] duration-200 open:border-[#a2c745]/40 open:shadow-md open:shadow-[#0b4058]/10"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-[family-name:var(--font-elaine)] text-base font-bold text-[#0b4058] marker:content-none md:text-lg [&::-webkit-details-marker]:hidden">
                <span className="text-pretty">{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-[#006183] transition-transform duration-200 motion-safe:group-open:rotate-180"
                />
              </summary>
              <div className="border-t border-[#0b4058]/5 px-6 pb-5 pt-4 text-sm leading-relaxed text-[#0b4058]/85 md:text-[0.95rem] text-pretty">
                {renderFaqAnswer(item.answer)}
              </div>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
