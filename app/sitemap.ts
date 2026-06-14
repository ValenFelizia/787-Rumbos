/**
 * app/sitemap.ts — Generador de sitemap para Next.js App Router.
 *
 * Next.js llama automáticamente a esta función en build time y genera
 * el archivo /sitemap.xml que los buscadores usan para descubrir páginas.
 *
 * Por ahora solo hay una URL (la landing page). Si en el futuro se agregan
 * rutas (/destinos/bariloche, /blog, etc.), se agregan al array.
 *
 * La URL de changeFrequency indica con qué frecuencia puede cambiar la página:
 *   - 'yearly'   → contenido muy estático (términos, sobre nosotros)
 *   - 'monthly'  → landing pages que se actualizan ocasionalmente
 *   - 'weekly'   → blogs, catálogos
 *   - 'daily'    → noticias, feeds
 *
 * Priority (0.0 a 1.0): importancia relativa entre páginas del mismo sitio.
 * La raíz siempre es 1.0.
 */
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://787rumbos.com.ar",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
