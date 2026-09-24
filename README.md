# 787 Rumbos

Sitio de captación para **787 Rumbos**, agencia de viajes en Córdoba (Argentina), con oficina en el hall de arribos del Aeropuerto Internacional Ingeniero Aeronáutico Ambrosio Taravella (local Vía Bariloche).

La web refuerza confianza y guía consultas calificadas a WhatsApp. No reemplaza la atención comercial humana.

**Sitio:** [787-rumbos.vercel.app](https://787-rumbos.vercel.app/) · canónico: [www.787rumbos.com.ar](https://www.787rumbos.com.ar/)

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Contenido | Payload CMS 3.75, Postgres, Vercel Blob en producción |
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
- Se prioriza resolver el problema de negocio antes que agregar complejidad. El cluster de aéreos se resolvió con slugs indexables y datos en `lib/`. El catálogo y la promo destacada viven en Payload CMS (D-006).
- No hay pagos en la web. El cotizador arma un enlace de WhatsApp en el cliente. Los agencieros entran por `/admin` (Payload, Postgres).
- CI ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) levanta Postgres, migra y carga el seed, y corre lint, TypeScript, tests unitarios, paridad del catálogo, build y smoke tests Playwright de rutas, CTAs críticos y `/admin`.
- La postura de seguridad y testing es proporcional a esa superficie: headers HTTP, higiene de dependencias y smokes. El detalle está en [`.csdd/specs.md`](./.csdd/specs.md).

## Desarrollo local

Hace falta Postgres. El catálogo y la promo pública salen de ahí. El detalle de roles, paridad y deploy está en [CMS](#cms).

```bash
sudo apt-get install -y postgresql
sudo service postgresql start   # o: sudo pg_ctlcluster 16 main start
sudo -u postgres psql -c "CREATE ROLE rumbos LOGIN PASSWORD 'rumbos';"
sudo -u postgres psql -c "CREATE DATABASE rumbos_cms OWNER rumbos;"
cp .env.example .env            # completá PAYLOAD_SECRET
npm install
npm run cms:migrate
npm run cms:seed
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). El panel está en [http://localhost:3000/admin](http://localhost:3000/admin) (`noindex`). Si definís `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` en `.env` antes del seed, ese es el primer admin.

Sin `BLOB_READ_WRITE_TOKEN` las imágenes nuevas quedan en `media/` (gitignored). Las del catálogo actual siguen en `public/destinos`.

| Script | Uso |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build y servidor de producción |
| `npm run cms:migrate` | Aplica migraciones de Payload |
| `npm run cms:seed` | Carga idempotente del catálogo |
| `npm run test:parity` | Compara Postgres con el golden del catálogo |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin emitir |
| `npm run audit:deps` | `npm audit` (nivel high) |
| `npm run test:e2e` | Smoke tests Playwright |
| `npm run vercel-build` | En Vercel: migraciones y después `next build` |

## CMS

En `/admin` se editan los destinos (ficha, salidas, precios, vigencia) y la promo destacada de la home. Testimonios, hubs, aéreos e Instagram siguen en `lib/`. Guía corta para el equipo: [`docs/guia-cms-agencieros.md`](./docs/guia-cms-agencieros.md).

- `admin` crea usuarios, cambia roles y borra destinos. Publica cualquier cambio.
- `encargado` publica cualquier cambio de un destino y edita la promo. Puede borrar imágenes.
- `agente` publica directo solo salidas, precios, nota y vigencia de un destino ya publicado. El resto, o un destino nuevo, queda en borrador con «Pendiente de aprobación». No edita la promo.
- `asistente` es para un bot. Lee destinos (también borradores), crea y actualiza solo como borrador, y puede subir imágenes. No publica, no borra, no toca usuarios ni la promo. El borrador queda pendiente y un encargado publica.
- No hay autoguardado. Publicar un precio exige «Precio vigente hasta» de hoy o posterior. Si esa fecha pasa, el sitio no muestra el monto y dice «Consultá precio actualizado». La barra de la promo se oculta el día después de «Se oculta después del».

### Agentes de IA (MCP)

El catálogo se puede editar por MCP en `https://www.787rumbos.com.ar/api/mcp` (en local, `http://127.0.0.1:3100/api/mcp`). Sin clave responde 401. Las reglas son las mismas que en el panel: el servidor las aplica, el bot no las puede saltear.

Un admin crea el usuario en `/admin` con rol **Asistente (IA)** y, en **MCP → Claves de API**, una clave asociada a ese usuario. Habilita la clave, y en Destinos: buscar, crear y actualizar. En Imágenes: buscar. No habilita borrar. La clave se copia una vez y no se commitea. Revocarla es borrar o desactivar esa clave.

Cursor se conecta con un `.cursor/mcp.json` local (no va al repo). La clave sale de una variable de entorno:

```json
{
  "mcpServers": {
    "787-rumbos": {
      "url": "https://www.787rumbos.com.ar/api/mcp",
      "headers": {
        "Authorization": "Bearer ${env:MCP_API_KEY}"
      }
    }
  }
}
```

El bot puede buscar destinos e imágenes, y crear o actualizar destinos solo como borrador (`draft: true`, `_status: "draft"`). No publica, no borra, y no ve usuarios ni la promo destacada. Un encargado o un admin publica. Cualquier cliente MCP que hable Streamable HTTP remoto y mande `Authorization: Bearer` sirve para lo mismo (por ejemplo las herramientas MCP remotas de la API de xAI). La indicación `cargar-flyer` resume las reglas editoriales: no inventar datos que no estén en el flyer y no asumir que la salida es desde Córdoba.

Payload queda en 3.75: 3.76 pide Next 16 y el sitio está en Next 15.5.

Paridad, con el golden del mismo día calendario:

```bash
npm run test:parity          # Postgres vs e2e/golden/catalog.json (destinos y promo)
npm run snapshot:compare     # HTML de 30 páginas contra e2e/golden/pages
```

Producción (Vercel, ya configurada):

- **Base:** Neon (AWS US East 1) vía la integración de Vercel. Inyecta `DATABASE_URL` y crea un branch de base por cada preview, así los PRs no tocan producción. No cargues `DATABASE_URI` en Vercel: tiene prioridad y haría que los previews usen la base de producción.
- **Imágenes:** store de Vercel Blob con acceso **público** (`BLOB_READ_WRITE_TOKEN`). El adapter de Payload 3.75 no sube a stores privados.
- **Secreto:** `PAYLOAD_SECRET` en Production y Preview. Si cambia, se cierran todas las sesiones.
- **Deploy:** Vercel corre `npm run vercel-build` (`payload migrate && next build`), así cada deploy aplica las migraciones pendientes.
- **Contenido:** el seed ya se corrió una vez y no se repite. Desde ahí, destinos y promo se editan solo en `/admin`; `scripts/seed-data/` queda como datos de CI y desarrollo. Los usuarios nuevos los crea un `admin` en `/admin`.
- Si hace falta correr algo contra producción desde una PC (por ejemplo una migración manual), cargá las variables en la sesión de la terminal, no en `.env`, y cerrala al terminar.

## Estructura útil

```
app/
  (site)/             # Sitio público
  (payload)/          # Panel /admin y API de Payload
components/sections/  # Secciones de UI
lib/
  constants.ts        # NAP, teléfonos, WhatsApp, horarios, CTAs
  catalog/            # Tipos, reglas y lectura del catálogo en Postgres
  airlines-data.ts
  testimonials-data.ts
  clusters-data.ts
  instagram-posts.ts
.csdd/                # Specs, decisiones y estado operativo (CSDD)
docs/                 # Guía del panel y análisis de contexto
e2e/                  # Smoke tests
NOTICE.md             # Uso y derechos del repositorio
```

**Contenido comercial:** destinos, salidas, precios y la promo destacada se editan en `/admin`. Testimonios, hubs, aéreos e Instagram siguen en `lib/`. Tienen que ser reales y vigentes. Los datos NAP (dirección, teléfonos, Maps) tienen que coincidir con Google Business Profile.

## Ramas y forma de trabajo

- El trabajo se hace en ramas de feature, con pull requests hacia `master`. Valen revisa y mergea los PRs.
- `master` — producción
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
