/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Formatos modernos: Next.js + Vercel sirven WebP/AVIF automáticamente
    // según lo que soporte el navegador del visitante.
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
