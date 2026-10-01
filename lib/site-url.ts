/**
 * Origen canónico del sitio público.
 *
 * Fuente única para `metadataBase`, canonical, `og:url` y sitemap.
 * El host preferido es siempre `www` (ver `.csdd/specs.md`).
 *
 * `NEXT_PUBLIC_SERVER_URL` / `NEXT_PUBLIC_SITE_URL` existen para CMS/local
 * (p. ej. `http://localhost:3000`). No deben filtrarse a canonicals de SEO:
 * si apuntan a localhost, apex, preview de Vercel u otro host, caemos al
 * origen www de producción.
 */
export const SITE_ORIGIN = "https://www.787rumbos.com.ar" as const;

const OWN_HOSTS = new Set(["www.787rumbos.com.ar", "787rumbos.com.ar"]);

function readConfiguredUrl(env: NodeJS.ProcessEnv): string | undefined {
  const raw =
    env.NEXT_PUBLIC_SITE_URL?.trim() || env.NEXT_PUBLIC_SERVER_URL?.trim();
  return raw || undefined;
}

/**
 * Origen absoluto usado en metadatos y sitemap.
 * Ignora valores de entorno no canónicos; default seguro = `SITE_ORIGIN`.
 */
export function getSiteOrigin(env: NodeJS.ProcessEnv = process.env): string {
  const raw = readConfiguredUrl(env);
  if (!raw) return SITE_ORIGIN;

  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();

    if (host === "localhost" || host === "127.0.0.1") return SITE_ORIGIN;
    if (host.endsWith(".vercel.app")) return SITE_ORIGIN;
    if (OWN_HOSTS.has(host)) return SITE_ORIGIN;

    // Host desconocido: no publicar un origen accidental en SEO.
    return SITE_ORIGIN;
  } catch {
    return SITE_ORIGIN;
  }
}

/** URL absoluta canónica. `path` puede ser `""`, `"/"` o `"/destinos/bariloche"`. */
export function siteUrl(
  path: string = "/",
  env: NodeJS.ProcessEnv = process.env,
): string {
  const origin = getSiteOrigin(env);
  if (!path || path === "/") return origin;
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${withSlash.replace(/\/+$/, "")}`;
}

export function getMetadataBase(
  env: NodeJS.ProcessEnv = process.env,
): URL {
  return new URL(`${getSiteOrigin(env)}/`);
}
