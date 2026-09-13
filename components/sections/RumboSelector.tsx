"use client";

/**
 * Selector de intención en la home: el usuario elige qué tipo de viaje busca
 * y entra al hub correspondiente (o al cotizador, en “a medida”).
 *
 * No reemplaza el catálogo de destinos con precio: lo precede.
 */
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  PrimaryCta,
  SecondaryCta,
  CTA_SLA_TEXT,
} from "@/components/conversion";
import { useModal } from "@/lib/context/ModalContext";

type RumboMedia = {
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  chip?: string;
  imagePosition?: string;
  sizes: string;
  titleSize: "hero" | "tile";
};

const CARD_SHELL =
  "group relative block w-full overflow-hidden rounded-[22px] bg-[#0b4058] text-left cursor-pointer md:rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6b451] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-0.5";

function RumboCardFace({
  title,
  subtitle,
  image,
  alt,
  chip,
  imagePosition = "object-center",
  sizes,
  titleSize,
}: RumboMedia) {
  return (
    <>
      <Image
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        loading="eager"
        className={`object-cover ${imagePosition} motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]`}
      />
      {/* Gradiente localizado al texto: no oscurece la foto entera. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b4058]/82 via-[#0b4058]/28 via-40% to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
        {chip ? (
          <span className="mb-2 inline-block rounded-full bg-[#dae553] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0b4058]">
            {chip}
          </span>
        ) : null}
        <h3
          className={`font-[family-name:var(--font-elaine)] font-bold tracking-tight text-white [text-shadow:0_1px_14px_rgba(11,64,88,0.55)] text-balance ${
            titleSize === "hero"
              ? "text-[1.65rem] leading-tight md:text-[2.35rem]"
              : "text-[1.35rem] leading-tight md:text-[1.55rem]"
          }`}
        >
          {title}
        </h3>
        <p className="mt-1 max-w-md text-sm leading-snug text-white/92 [text-shadow:0_1px_10px_rgba(11,64,88,0.5)] text-pretty md:text-[0.95rem]">
          {subtitle}
        </p>
      </div>
    </>
  );
}

export function RumboSelector() {
  const { openModal } = useModal();

  return (
    <section
      aria-labelledby="rumbo-selector-heading"
      className="bg-[#f8f1e7]"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-16">
        <header className="mb-8 max-w-2xl md:mb-10">
          <h2
            id="rumbo-selector-heading"
            className="font-[family-name:var(--font-elaine)] text-3xl font-extrabold tracking-tight text-[#0b4058] md:text-4xl text-balance"
          >
            ¿Qué rumbo estás buscando?
          </h2>
          <p className="mt-3 flex items-start gap-1.5 text-sm text-[#0b4058]/65">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>Atendemos en el hall de arribos · Vía Bariloche</span>
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#0b4058]/80 md:text-base text-pretty">
            Elegí cómo querés viajar. Te asesoramos acá, en el local.
          </p>
        </header>

        <nav aria-label="Elegí tu rumbo">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-4">
              <Link
                href="/aereos"
                className={`${CARD_SHELL} min-h-[240px] md:min-h-[420px] md:w-[58%]`}
              >
                <RumboCardFace
                  chip="Aéreos"
                  title="Quiero un vuelo"
                  subtitle="Pasajes de múltiples aerolíneas, saliendo de Córdoba."
                  image="/rumbos/vuelos.jpg"
                  alt="Ala de un avión sobre las nubes al atardecer"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  titleSize="hero"
                />
              </Link>

              <div className="flex min-h-0 flex-col gap-3 md:w-[42%] md:gap-4">
                <Link
                  href="/destinos/brasil-desde-cordoba"
                  className={`${CARD_SHELL} min-h-[200px] md:min-h-0 md:flex-1`}
                >
                  <RumboCardFace
                    title="Quiero playa"
                    subtitle="Brasil y Caribe desde Córdoba."
                    image="/rumbos/playa.jpg"
                    alt="Agua turquesa y velero en Porto de Galinhas, Brasil"
                    sizes="(max-width: 768px) 100vw, 42vw"
                    titleSize="tile"
                  />
                </Link>
                <Link
                  href="/destinos/argentina-en-bus-desde-cordoba"
                  className={`${CARD_SHELL} min-h-[200px] md:min-h-0 md:flex-1`}
                >
                  <RumboCardFace
                    title="Quiero recorrer Argentina"
                    subtitle="Salidas en bus desde Córdoba · Vía Bariloche"
                    image="/rumbos/argentina.jpg"
                    alt="Cataratas del Iguazú, un clásico del turismo argentino"
                    sizes="(max-width: 768px) 100vw, 42vw"
                    titleSize="tile"
                  />
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch md:gap-4">
              <Link
                href="/destinos/salidas-grupales-desde-cordoba"
                className={`${CARD_SHELL} min-h-[200px] sm:flex-1 md:min-h-[248px]`}
              >
                <RumboCardFace
                  title="Quiero una salida grupal"
                  subtitle="Fechas confirmadas desde Córdoba."
                    image="/rumbos/grupal.jpg"
                  alt="Centro Cívico de Bariloche junto al lago Nahuel Huapi"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  titleSize="tile"
                />
              </Link>
              <button
                type="button"
                onClick={() => openModal()}
                className={`${CARD_SHELL} min-h-[200px] sm:flex-1 md:min-h-[248px]`}
                aria-label="Lo armamos con vos — abre el cotizador personalizado"
              >
                <RumboCardFace
                  title="Lo armamos con vos"
                  subtitle="Cotizamos fechas y presupuesto por WhatsApp."
                    image="/rumbos/medida.jpg"
                  alt="Local de 787 Rumbos en el hall de arribos del Aeropuerto de Córdoba"
                  imagePosition="object-[22%_center]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  titleSize="tile"
                />
              </button>
            </div>
          </div>
        </nav>

        <div className="mt-10 rounded-[24px] bg-[#0b4058] px-6 py-8 md:px-10 md:py-9">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-xl">
              <p className="font-[family-name:var(--font-elaine)] text-2xl font-bold tracking-tight text-white md:text-[1.75rem] text-balance">
                ¿Ya tenés fechas o destino?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70 text-pretty">
                Contanos lo que ya sabés y lo armamos juntos. {CTA_SLA_TEXT}.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:self-start xl:shrink-0 xl:self-auto">
              <PrimaryCta
                onClick={() => openModal()}
                aria-label="Armar viaje — abre el cotizador personalizado"
                className="font-bold whitespace-nowrap"
              />
              <SecondaryCta
                aria-label="Escribinos por WhatsApp — abre el chat directo"
                className="font-bold whitespace-nowrap"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
