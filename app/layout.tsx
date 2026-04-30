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
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

/** Metadatos del sitio (título, descripción, íconos) leídos por Next.js para SEO y pestaña del navegador. */
export const metadata: Metadata = {
  title: '787 Rumbos | Agencia de Viajes',
  description: 'Tu viaje, nuestra prioridad. Atención humana y personalizada.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

/**
 * `children` es un prop especial de React: representa el “hueco” donde Next.js
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
      <body className="font-sans antialiased">
        {children}
        {/* Analytics solo en producción para no contaminar datos en desarrollo */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
