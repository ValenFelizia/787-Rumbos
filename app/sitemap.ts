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
import { destinationsData } from "@/lib/destinations-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://787rumbos.com.ar";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/destinos`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  const destinationPages = destinationsData.map((dest) => ({
    url: `${baseUrl}/destinos/${dest.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...destinationPages];
}
