# 787 Rumbos

Sitio de captación para **787 Rumbos**, agencia de viajes en Córdoba (Argentina), con oficina en el hall de arribos del Aeropuerto Internacional Ingeniero Aeronáutico Ambrosio Taravella (local Vía Bariloche).

La web refuerza confianza y guía consultas calificadas a WhatsApp. No reemplaza la atención comercial humana.

**Sitio:** [787-rumbos.vercel.app](https://787-rumbos.vercel.app/) · canónico: [www.787rumbos.com.ar](https://www.787rumbos.com.ar/)

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
- Cluster de pasajes aéreos: hub `/aereos` y landings `/aereos/{aerolinea}-cordoba`
- Página legal, sitemap, metadatos OG y datos estructurados (LocalBusiness / FAQPage)
- Headers HTTP de endurecimiento (CSP, nosniff, frame denial, etc.) en el deploy

## Enfoque de ingeniería

El repo documenta cómo se construye el sitio, no solo el resultado.

- Las decisiones relevantes viven en [`.csdd/decisions.md`](./.csdd/decisions.md): incluyen el racional, alternativas rechazadas y consecuencias. D-001 (páginas aditivas, home conservadora) y D-002 (URLs `/aereos`) son el ejemplo más claro.
- Se prioriza resolver el problema de negocio antes que agregar complejidad. El cluster de aéreos se resolvió con slugs indexables y datos en `lib/`, no con un CMS, un backend ni un rediseño de la home.
- No hay autenticación, base de datos, pagos ni APIs propias que persistan datos. El cotizador arma un enlace de WhatsApp en el cliente.
- CI ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) corre lint, TypeScript, build y smoke tests Playwright de rutas y CTAs críticos.
- La postura de seguridad y testing es proporcional a esa superficie: headers HTTP, higiene de dependencias y smokes. El detalle está en [`.csdd/specs.md`](./.csdd/specs.md).

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
app/                  # Rutas App Router (home, destinos, aéreos, hubs, legal)
components/sections/  # Secciones de UI
lib/
  constants.ts        # NAP, teléfonos, WhatsApp, horarios, CTAs
  destinations-data.ts
  airlines-data.ts
  testimonials-data.ts
  clusters-data.ts
  instagram-posts.ts
.csdd/                # Specs, decisiones y estado operativo (CSDD)
docs/                 # Análisis de contexto (no es backlog)
e2e/                  # Smoke tests
NOTICE.md             # Uso y derechos del repositorio
```

**Contenido comercial:** precios, salidas, promociones y testimonios viven en `lib/*-data.ts` y `lib/constants.ts`. Deben ser reales y vigentes. Datos NAP (dirección, teléfonos, Maps) deben coincidir con Google Business Profile.

## Ramas y forma de trabajo

- `development` — rama de trabajo diaria
- `master` — producción / integración tras validar
- Specs: [`.csdd/specs.md`](./.csdd/specs.md)
- Decisiones: [`.csdd/decisions.md`](./.csdd/decisions.md)
- Estado operativo: [`.csdd/todo.md`](./.csdd/todo.md)
- Diagnóstico SEO/producto (contexto, no backlog): [`docs/marketing-growth-audit.md`](./docs/marketing-growth-audit.md)

## Uso y derechos

El repositorio es público con fines de **referencia y portfolio**. Salvo indicación explícita, no se concede licencia para reutilizar, redistribuir ni explotar comercialmente el código o el material original. Marcas, logos, fotografías, testimonios y assets de terceros pertenecen a sus respectivos titulares.

Detalle: [`NOTICE.md`](./NOTICE.md).

## Contacto canónico (web)

| Rol | Valor |
| --- | --- |
| Agencia / urgencias (único) | +54 9 351 768-8623 — CTAs, footer, FAQ, schema |
| Oficina | lun–vie 8:30–18:00 · sáb 8:30–13:00 |
| Maps / GBP | [maps.app.goo.gl/ZnVX6SQ7UtDXgbpm7](https://maps.app.goo.gl/ZnVX6SQ7UtDXgbpm7) |
