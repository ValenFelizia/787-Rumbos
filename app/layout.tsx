/**
 * Comentarios añadidos con fines educativos.
 * layout.tsx (App Router de Next.js)
 *
 * Este archivo define el "Root Layout": el esqueleto HTML común a todas las rutas
 * de la aplicación. Aquí vive la estructura mínima que envuelve cada página:
 * <html> y <body>, estilos globales, fuentes y componentes que deben persistir
 * al navegar (por ejemplo analítica). Es el análogo a un documento HTML base
 * compartido, no el contenido específico de una ruta.
 */
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { elaineSans, zalandoSans } from '@/lib/fonts'
import './globals.css'

/** Metadatos del sitio leídos por Next.js para SEO, pestaña del navegador y previews sociales.
 *  El objeto Metadata de Next.js genera automáticamente las etiquetas <meta> correspondientes
 *  en el <head> del HTML. El campo `openGraph` genera las etiquetas og: que WhatsApp e
 *  Instagram usan para mostrar el preview enriquecido cuando alguien comparte el link.
 */
export const metadata: Metadata = {
  title: '787 Rumbos | Agencia de Viajes en Córdoba',
  description:
    'Agencia de viajes en Córdoba, Argentina. Paquetes personalizados a Río de Janeiro, Bariloche, Cartagena, Ushuaia y más. Financiación disponible. Asesoramiento humano por WhatsApp.',
  metadataBase: new URL('https://787rumbos.com.ar'),
  alternates: {
    canonical: 'https://787rumbos.com.ar',
  },
  openGraph: {
    title: '787 Rumbos | Agencia de Viajes en Córdoba',
    description:
      'Viajá con el respaldo de 787 Rumbos. Atención personalizada, financiación disponible y paquetes a medida desde Córdoba.',
    url: 'https://787rumbos.com.ar',
    siteName: '787 Rumbos',
    locale: 'es_AR',
    type: 'website',
    // og:image se puede agregar aquí cuando tengamos una imagen OG (1200x630px)
    // images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    apple: '/logo.png',
  },
}

/**
 * `children` es un prop especial de React: representa el "hueco" donde Next.js
 * inyecta el árbol de componentes de la ruta activa (por ejemplo `app/page.tsx`
 * para la raíz `/`, u otras carpetas con `page.tsx`). No es un texto fijo: es
 * el resultado de resolver la ruta actual y renderizar su página dentro de este layout.
 * Así se anidan layouts y páginas: este componente no importa la página directamente;
 * el framework pasa el contenido ya resuelto como `children`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  /**
   * JSON-LD (JavaScript Object Notation for Linked Data) — Datos estructurados.
   * Este script no es visible para el usuario pero sí para Google.
   * Permite que Google entienda que este sitio es una agencia de viajes
   * con una ubicación física, número de teléfono y URL propios.
   * Puede generar "rich results" en las búsquedas: resultados con datos
   * de contacto, mapa de Google, horarios, etc. directamente en la SERP.
   *
   * Schema.org es el vocabulario estándar que usan Google, Bing y Yahoo.
   * TravelAgency hereda de LocalBusiness que hereda de Organization.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "787 Rumbos",
    description:
      "Agencia de viajes en Córdoba. Paquetes personalizados, atención humana y financiación disponible.",
    url: "https://787rumbos.com.ar",
    telephone: "+5493516157398",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Voz del Interior 8500",
      addressLocality: "Córdoba",
      addressRegion: "Córdoba",
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -31.3117,
      longitude: -64.208,
    },
    sameAs: ["https://www.instagram.com/787rumbos/"],
    priceRange: "$$",
  };

  return (
    <html lang="es">
      <body className={`${elaineSans.variable} ${zalandoSans.variable} antialiased`}>
        {children}
        {/* Analytics solo en producción para no contaminar datos en desarrollo */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        {/* Datos estructurados JSON-LD — visible para buscadores, no para usuarios */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
