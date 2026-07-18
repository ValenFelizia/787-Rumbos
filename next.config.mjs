/**
 * next.config.mjs — configuración de Next.js.
 *
 * Además de imágenes, aquí definimos headers HTTP de seguridad (T-017).
 * Un "header" es una instrucción que el servidor manda al navegador junto con
 * cada página. No cambia el diseño: cambia qué le permite hacer el navegador
 * (embeber el sitio en iframes, cargar scripts de terceros, etc.).
 *
 * Cómo verificarlos en local:
 * 1. `npm run dev`
 * 2. Abrí DevTools → Network → la petición del documento HTML → Response Headers
 */

/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const distDir = process.env.NEXT_DIST_DIR ?? ".next";

/**
 * Content-Security-Policy (CSP): lista blanca de orígenes permitidos.
 * Si un atacante inyectara un <script> malicioso, el navegador lo bloquearía
 * salvo que coincida con estas reglas.
 *
 * Notas para este proyecto:
 * - 'unsafe-inline' / 'unsafe-eval': Next.js aún los necesita en varios casos
 *   sin un esquema de nonces (más avanzado). Es un baseline razonable, no el
 *   CSP más estricto posible.
 * - va.vercel-scripts.com: Analytics en desarrollo; en producción suele ir por
 *   '/_vercel/insights/*' (cubierto por 'self').
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  // Evita que el navegador "adivine" el tipo de un archivo (MIME sniffing).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controla cuánta URL se manda como referrer al salir del sitio.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Defensa en profundidad vs clickjacking (además de frame-ancestors en CSP).
  { key: "X-Frame-Options", value: "DENY" },
  // Apaga APIs del navegador que esta web no usa.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // HSTS solo en build de producción: fuerza HTTPS en visitas siguientes.
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig = {
  distDir,
  images: {
    // Formatos modernos: Next.js + Vercel sirven WebP/AVIF automáticamente
    // según lo que soporte el navegador del visitante.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Aplica a todas las rutas del sitio.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
