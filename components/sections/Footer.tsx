/**
 * components/sections/Footer.tsx
 *
 * Pie de página con información de contacto, datos legales y badges de confianza.
 * Estructura en tres columnas (1 col en mobile, 3 en desktop):
 *   - Col 1: Logo + habilitación
 *   - Col 2: Dirección y servicios
 *   - Col 3: Contacto (WhatsApp x2, Instagram)
 *
 * El badge de AFIP usa un <img> estándar (no <Image>) porque:
 * 1. AFIP requiere que la imagen sea exactamente la que ellos proveen (no se puede
 *    manipular con optimizadores de terceros).
 * 2. El ?v= al final del src es un cache buster que ellos controlan.
 */
import Image from "next/image";
import { Instagram, MapPin, Send, ShieldCheck, Clock } from "lucide-react";
import {
  AGENCY_PHONE,
  WHATSAPP_LINK,
  OFFICE_HOURS,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer id="contacto" className="bg-[#0b4058] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-14 md:grid-cols-4">
        {/* Columna 1: Logo y habilitación */}
        <div>
          <Image
            src="/logo.png"
            alt="Logo 787 Rumbos"
            width={300}
            height={64}
            className="h-12 w-auto object-contain brightness-0 invert md:h-14"
          />
          <p className="mt-4 text-sm text-white/80">Agencia habilitada - Legajo 20455.</p>
        </div>

        {/* Columna 2: Ubicación y servicios */}
        <div className="space-y-3 text-sm">
          <p className="flex items-start gap-2">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#dae553]" />
            <span>
              Av. La Voz del Interior 8500, Córdoba
              <br />
              <span className="text-xs text-white/70">
                (Planta Baja, local de Vía Bariloche)
              </span>
            </span>
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#dae553]" />
            <span>Asesoramiento profesional y cobertura integral</span>
          </p>
        </div>

        {/* Columna 3: Enlaces de Interés */}
        <div className="space-y-3 text-sm">
          <p className="font-[family-name:var(--font-elaine)] text-xs font-bold uppercase tracking-wider text-white/75">
            Enlaces de Interés
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.cordobaturismo.gov.ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 transition hover:text-[#dae553]"
              >
                Agencia Córdoba Turismo
              </a>
            </li>
            <li>
              <a
                href="https://camaracbaturismo.org.ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 transition hover:text-[#dae553]"
              >
                Cámara de Turismo
              </a>
            </li>
            <li>
              <a
                href="https://www.aa2000.com.ar/cordoba"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 transition hover:text-[#dae553]"
              >
                Estado de Vuelos
              </a>
            </li>
            <li>
              <a
                href="/legal"
                className="text-white/80 transition hover:text-[#dae553]"
              >
                Términos y Condiciones
              </a>
            </li>
            <li>
              <a
                href="https://autogestion.produccion.gob.ar/consumidores"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 transition hover:text-[#dae553]"
              >
                Defensa del Consumidor
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div className="space-y-3 text-sm">
          <p className="font-[family-name:var(--font-elaine)] text-xs font-bold uppercase tracking-wider text-white/75">
            Contacto
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-white/80">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#dae553]" />
              <span>{OFFICE_HOURS.short}</span>
            </li>
            <li>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                aria-label={`WhatsApp de la agencia ${AGENCY_PHONE.display}`}
                className="flex items-center gap-2 text-white/90 transition hover:text-[#dae553]"
              >
                <Send className="h-4 w-4" />
                WhatsApp: {AGENCY_PHONE.display}
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/787rumbos/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram: @787rumbos"
                className="flex items-center gap-2 text-white/90 transition hover:text-[#dae553]"
              >
                <Instagram className="h-4 w-4" />
                Instagram: @787rumbos
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Barra inferior: badges de confianza + copyright */}
      <div className="mx-auto mt-8 flex w-full max-w-6xl flex-col items-center justify-center gap-4 border-t border-white/10 px-6 pb-8 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Badge AFIP — usa <img> estándar, no <Image>. Ver comentario en el JSDoc del componente. */}
          <a
            href="http://qr.afip.gob.ar/?qr=Huvxa1kUae-1lE_yjNzL2w,,"
            target="_F960AFIPInfo"
            rel="noreferrer"
            aria-label="Verificar datos fiscales en AFIP"
            className="inline-flex h-12 items-center transition-opacity hover:opacity-80"
          >
            <img
              src="/afip.jpg?v=20260503"
              alt="Data Fiscal ARCA"
              className="h-full w-auto object-contain"
            />
          </a>

          <a
            href="https://camaracbaturismo.org.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center transition-opacity hover:opacity-80"
            aria-label="Sitio web de la Cámara de Turismo de la Provincia de Córdoba"
          >
            <Image
              src="/camara-turismo.png"
              alt="Miembro Cámara de Turismo de la Provincia de Córdoba"
              width={200}
              height={80}
              sizes="200px"
              className="h-full w-auto object-contain"
            />
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-white/65">
          <span>MARIA FERNANDA RAMOS</span>
          <span className="hidden sm:inline">|</span>
          <span>CUIT: 27-26220871-6</span>
          <span className="hidden sm:inline">|</span>
          <span>Legajo Habilitación N° 20455</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/70">
          <a
            href="/legal"
            className="underline hover:text-[#dae553] transition-colors"
          >
            Términos y Condiciones
          </a>
          <span>·</span>
          <a
            href="https://autogestion.produccion.gob.ar/consumidores"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#dae553] transition-colors"
          >
            Defensa del Consumidor
          </a>
        </div>

        <p className="text-center text-sm text-white/70 mt-1">
          ©787 Rumbos® - Todos los derechos reservados.
        </p>
      </div>

      <p className="pb-5 text-center text-[11px] tracking-wide text-white/65">
        Sitio creado por{" "}
        <a
          href="https://portfolio-vfelizia.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:text-white underline decoration-transparent hover:decoration-white/40"
        >
          V. Felizia
        </a>
      </p>
    </footer>
  );
}
