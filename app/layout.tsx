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
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        {/* Analytics solo en producción para no contaminar datos en desarrollo */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
