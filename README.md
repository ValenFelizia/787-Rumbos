# 787 Rumbos

Sitio de captación para **787 Rumbos**, agencia de viajes en Córdoba (Argentina), con oficina en el hall de arribos del Aeropuerto Internacional Ingeniero Aeronáutico Ambrosio Taravella (local Vía Bariloche).

La web refuerza confianza y guía consultas calificadas a WhatsApp. No reemplaza la atención comercial humana.

**Sitio:** [787-rumbos.vercel.app](https://787-rumbos.vercel.app/)

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Estilos | Tailwind CSS 4, tipografías Elaine Sans + Zalando Sans |
| Iconos | Lucide React |
| Analytics | Vercel Analytics |
| Calidad | ESLint, `tsc --noEmit`, Playwright smoke, GitHub Actions CI |
| Deploy | Vercel |

## Qué incluye el producto

- Home con hero, propuesta de valor (aeropuerto + aéreo/terrestre), catálogo destacado, testimonios (reseñas Google autorizadas), servicios, feed de Instagram, FAQ y CTAs a WhatsApp
- Cotizador de 3 pasos en modal (arma el mensaje de WhatsApp en el cliente; sin backend propio)
- Catálogo de destinos con rutas dinámicas (`/destinos/[slug]`), SEO por destino y hubs temáticos (Brasil, Caribe, Argentina en bus, salidas grupales)
- Página legal, sitemap, metadatos OG y datos estructurados (LocalBusiness / FAQPage)
- Headers HTTP de endurecimiento (CSP, nosniff, frame denial, etc.) en el deploy

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

| Script | Uso |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build y servidor de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin emitir |
| `npm run audit:deps` | `npm audit` (nivel high) |
| `npm run test:e2e` | Smoke tests Playwright |

## Estructura útil

```
app/                  # Rutas App Router (home, destinos, hubs, legal)
components/sections/  # Secciones de UI
lib/
  constants.ts        # NAP, teléfonos, WhatsApp, horarios, CTAs
  destinations-data.ts
  testimonials-data.ts
  clusters-data.ts
  instagram-posts.ts
.csdd/                # Estado operativo y specs del proyecto (CSDD)
e2e/                  # Smoke tests
```

**Contenido comercial:** precios, salidas, promociones y testimonios viven en `lib/*-data.ts` y `lib/constants.ts`. Deben ser reales y vigentes. Datos NAP (dirección, teléfonos, Maps) deben coincidir con Google Business Profile.

## Ramas y forma de trabajo

- `development` — rama de trabajo diaria
- `master` — producción / integración tras validar
- Estado y requisitos del producto: [`.csdd/todo.md`](./.csdd/todo.md) y [`.csdd/specs.md`](./.csdd/specs.md)
- Análisis de crecimiento (contexto, no backlog): [`docs/marketing-growth-audit.md`](./docs/marketing-growth-audit.md)

## Contacto canónico (web)

| Rol | Valor |
| --- | --- |
| Agencia (CTAs / cotización) | +54 9 351 344-8724 |
| Urgencias (viaje en curso) | +54 9 351 615-7398 — footer/FAQ, no CTAs comerciales |
| Oficina | lun–vie 8:30–18:00 · sáb 8:30–13:00 |
| Maps / GBP | [maps.app.goo.gl/ZnVX6SQ7UtDXgbpm7](https://maps.app.goo.gl/ZnVX6SQ7UtDXgbpm7) |
