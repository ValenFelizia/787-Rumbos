import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Términos y Condiciones y Políticas de Privacidad | 787 Rumbos",
  description:
    "Información legal de 787 Rumbos. Términos y condiciones de contratación de servicios turísticos y políticas de privacidad.",
  alternates: {
    canonical: "https://www.787rumbos.com.ar/legal",
  },
  openGraph: {
    title: "Términos y Condiciones y Políticas de Privacidad | 787 Rumbos",
    description:
      "Información legal de 787 Rumbos. Términos y condiciones de contratación de servicios turísticos y políticas de privacidad.",
    url: "https://www.787rumbos.com.ar/legal",
  },
};

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#0b4058]">
      <Navbar />
      
      <article className="mx-auto max-w-4xl px-6 py-28 md:py-32">
        <h1 className="font-[family-name:var(--font-brand-heading)] text-3xl font-extrabold md:text-5xl mb-8 border-b border-[#0b4058]/10 pb-4">
          Información Legal y Términos de Uso
        </h1>

        <section className="space-y-6 text-sm text-[#0b4058]/95 leading-relaxed">
          <div>
            <h2 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold text-[#0b4058] mb-3">
              1. Datos del Titular
            </h2>
            <p>
              El presente sitio web es operado por <strong>MARIA FERNANDA RAMOS</strong> (en adelante, &quot;787 Rumbos&quot;), con CUIT <strong>27-26220871-6</strong> y legajo oficial de habilitación turística N° <strong>20455</strong>. El domicilio legal se constituye en Av. La Voz del Interior 8500, Córdoba, Argentina.
            </p>
          </div>

          <hr className="border-t border-[#0b4058]/10" />

          <div>
            <h2 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold text-[#0b4058] mb-3">
              2. Términos y Condiciones de Contratación
            </h2>
            <p className="mb-2">
              787 Rumbos actúa como agente intermediario entre los viajeros y los distintos prestadores de servicios turísticos (tales como aerolíneas, empresas de transporte terrestre, hoteles y prestadores de asistencia médica).
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Tarifas y Disponibilidad:</strong> Todas las tarifas publicadas u ofrecidas de manera orientativa están sujetas a disponibilidad y cambios sin previo aviso por parte de los proveedores directos hasta el momento de la confirmación y emisión del servicio.
              </li>
              <li>
                <strong>Políticas de Cancelación y Reembolso:</strong> Cada servicio contratado está sujeto a las condiciones particulares de cancelación, reprogramación y devolución establecidas por el respectivo prestador (aerolínea, hotel, transportista, etc.). 787 Rumbos gestionará los reclamos correspondientes, pero no es responsable de las penalidades aplicadas por los proveedores.
              </li>
              <li>
                <strong>Documentación de Viaje:</strong> Es de exclusiva responsabilidad del pasajero contar con la documentación personal, visados y requisitos sanitarios vigentes exigidos por las autoridades de los países de destino y de tránsito.
              </li>
            </ul>
          </div>

          <hr className="border-t border-[#0b4058]/10" />

          <div>
            <h2 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold text-[#0b4058] mb-3">
              3. Política de Privacidad (Ley N° 25.326)
            </h2>
            <p className="mb-2">
              De conformidad con la Ley de Protección de Datos Personales N° 25.326, 787 Rumbos se compromete a proteger la privacidad de la información personal de sus usuarios y clientes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Recopilación de Datos:</strong> Los datos solicitados mediante nuestro cotizador interactivo (destino, cantidad de pasajeros y fechas tentativas) son de carácter informativo y se procesan temporalmente para pre-armar la propuesta de viaje.
              </li>
              <li>
                <strong>Transferencia a WhatsApp:</strong> Al interactuar con el cotizador y hacer clic en el envío, la información se procesa para que el usuario pueda contactarnos de forma voluntaria a través de la aplicación WhatsApp, iniciando una conversación directa de atención al cliente.
              </li>
              <li>
                <strong>Uso de la Información:</strong> No compartimos, vendemos ni distribuimos los datos personales de nuestros clientes con terceros ajenos a la prestación de los servicios turísticos expresamente contratados.
              </li>
            </ul>
          </div>

          <hr className="border-t border-[#0b4058]/10" />

          <div>
            <h2 className="font-[family-name:var(--font-brand-heading)] text-xl font-bold text-[#0b4058] mb-3">
              4. Derecho de Arrepentimiento (Ley N° 24.240)
            </h2>
            <p>
              Conforme a lo dispuesto por el artículo 34 de la Ley N° 24.240 de Defensa del Consumidor, los usuarios tienen derecho a revocar la aceptación del servicio dentro del plazo de diez (10) días corridos contados a partir de la fecha de contratación o recepción del contrato/voucher, lo que suceda último, sin responsabilidad alguna. Dado que la comercialización y perfeccionamiento de las reservas de 787 Rumbos se realiza mediante asesoramiento humano y atención por WhatsApp y canales formales, las solicitudes de revocación deberán canalizarse formalmente por los mismos medios de contacto informados en este sitio web.
            </p>
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
}
