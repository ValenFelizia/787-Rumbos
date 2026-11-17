/**
 * Seeded catalog images that ship under `public/destinos/`.
 *
 * On Vercel the serverless function has no `public/` on disk, so a runtime
 * `existsSync` check fails during ISR and cards fall back to a 404ing
 * `/api/media/file/...`. `public-media.test.ts` keeps this list in sync.
 */
export const PUBLIC_DESTINO_IMAGES: ReadonlySet<string> = new Set([
  "/destinos/bariloche.jpg",
  "/destinos/bayahibe.jpg",
  "/destinos/buenosaires.jpg",
  "/destinos/camboriu.jpg",
  "/destinos/cancun.jpg",
  "/destinos/cataratas.jpg",
  "/destinos/gp-sao-paulo-hero.jpg",
  "/destinos/gp-sao-paulo.png",
  "/destinos/guarajuba.jpg",
  "/destinos/imbassai.jpg",
  "/destinos/mendoza.jpg",
  "/destinos/peru.jpg",
  "/destinos/playadelcarmen.jpg",
  "/destinos/portogalinhas.jpg",
  "/destinos/praia-do-forte.jpg",
  "/destinos/punta-cana.jpg",
  "/destinos/rio.jpg",
  "/destinos/riviera-maya.jpg",
  "/destinos/salar-de-uyuni.jpg",
  "/destinos/salta.png",
  "/destinos/salvador-de-bahia.jpg",
  "/destinos/sudesteasiatico.jpg",
  "/destinos/termas.jpg",
  "/destinos/ushuaia.jpg",
]);
