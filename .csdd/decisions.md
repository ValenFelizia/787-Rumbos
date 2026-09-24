# 787 Rumbos — Decisiones

> Elecciones consecuentes y su racional. El comportamiento observable queda en
> [specs.md](./specs.md); el estado operativo en [todo.md](./todo.md).

## Accepted

### D-001 — Expansión comercial vía páginas aditivas (issue #11)

- **Status:** Accepted
- **Date:** 2026-07-28
- **Source:** [GitHub #11](https://github.com/ValenFelizia/787-Rumbos/issues/11) + dirección explícita de Valen
- **Decision:** Reposicionar la web hacia el negocio real (los pasajes aéreos son la principal línea comercial) **añadiendo slugs indexables**, no rediseñando la home. Los paquetes siguen siendo una línea visible y válida; la home conserva ritmo, identidad y estructura actuales.
- **Rationale:** La arquitectura indexable hoy está concentrada en destinos/paquetes. Google Search Console necesita URLs propias para intenciones de compra aérea (p. ej. LATAM Córdoba). Tocar poco la home reduce riesgo de regresión visual/conversión y acelera el valor SEO.
- **Home budget (techo duro):**
  - Sí: link en nav, footer y tile de Servicios hacia el hub de aéreos; interlinking; a lo sumo un ajuste menor de copy de apoyo en hero/propuesta de valor.
  - No: reordenar secciones, cambiar sistema visual/motion, convertir el primer viewport en “boletería aérea”, ni bajar el catálogo de paquetes a un rincón.
- **Rejected alternatives:**
  - Rediseño profundo de la home para “parecer” negocio de aéreos.
  - Reemplazar el eje de paquetes en la narrativa pública.
  - Páginas doorway masivas por aerolínea sin contenido propio.
- **Consequences:** El trabajo se descompone en hub + landings de aerolínea + SEO técnico + retoques de enlace; la ola de home visual (T-021→T-028) se considera baseline a preservar.

### D-002 — Arquitectura de URLs para aéreos

- **Status:** Accepted
- **Date:** 2026-07-28
- **Source:** issue #11 (decisiones pendientes) + D-001
- **Decision:** Un solo cluster bajo `/aereos`:
  - `/aereos` — hub de pasajes aéreos (multi-aerolínea, atención en aeropuerto, CTA WhatsApp).
  - `/aereos/{aerolinea}-cordoba` — landing por aerolínea con intención local (primera: `/aereos/latam-cordoba`).
- **Rationale:**
  - “Aéreos” nombra el producto que se vende; evita un segundo hub fino `/aerolineas` que duplicaría intención.
  - El sufijo `-cordoba` alinea con los hubs existentes (`brasil-desde-cordoba`, etc.) y captura búsqueda local.
  - Escala por datos (`lib/` + ruta dinámica o páginas tipadas), no por copy-paste.
- **Rejected alternatives:**
  - Solo `/aerolineas/...` sin hub de producto.
  - `/aereos` + `/aerolineas` en paralelo (riesgo de contenido similar y dilución).
  - Slugs sin “córdoba” en landings locales (pierde la intención que justifica la página).
  - Meter landings de aerolínea bajo `/destinos/` (mezcla catálogo de paquetes con boletería).
- **Constraints:**
  - Cada landing debe declarar con claridad que **787 Rumbos es agencia independiente**, no oficina oficial de la aerolínea (salvo autorización comercial explícita).
  - No publicar rutas/políticas de la aerolínea que caduquen sin dueño de mantenimiento.
  - No crear página de aerolínea sin contenido propio útil (FAQ, qué gestionamos, CTA, ubicación).
- **Revisit when:** haya go comercial para más landings, o si Search Console muestre canibalización hub ↔ landing.

### D-004 — La home destaca salidas por vigencia, no por lista fija

- **Status:** Accepted
- **Date:** 2026-09-21
- **Source:** Valen (publicar Porto de Galinhas en “Próximas salidas” y que la sección siga al catálogo)
- **Decision:** Las cuatro cards de “Próximas salidas desde Córdoba” salen de `getHomeFeaturedDestinations`: destinos con salidas consultables, ordenados por cantidad de fechas y, si empatan, por la salida más próxima. El orden del catálogo desempata el resto.
- **Rationale:** Una lista fija dejó a Bariloche sin fechas y dejó afuera a Porto, que concentra las salidas nuevas. Ordenar solo por la fecha más cercana escondería Porto detrás de salidas sueltas de septiembre y octubre.
- **Rejected alternatives:**
  - Seguir con Salta, Bariloche, Río y Cataratas hardcodeados.
  - Ordenar únicamente por la salida más próxima.
- **Consequences:** la grilla cambia cuando cambian las fechas del catálogo. Varios programas el mismo día cuentan como una sola fecha, para que un destino no suba en la home por repetir la misma salida.

### D-005 — No publicar el crucero de fin de año ni fijar la ciudad de salida

- **Status:** Accepted
- **Date:** 2026-09-21
- **Source:** Valen, sobre los flyers de Brasil verano 2027, República Dominicana y fin de año
- **Decision:** El crucero grupal Costa Serena (27/12, desde USD 2.725) no se publica. En los cupos nuevos de esos flyers la web no afirma que la salida sea desde Córdoba: puede ser Córdoba o Ezeiza y se confirma al consultar.
- **Rationale:** El flyer del crucero no trae puertos, ciudad de embarque ni categoría de cabina. Fer tiene el resto, y la consigna es no publicar más de lo que está en el flyer. Un precio en la web se leería como un producto cerrado. La ciudad de salida tampoco está impresa y varía según el cupo.
- **Rejected alternatives:**
  - Publicar el crucero solo con el texto del flyer y un CTA a consultar el itinerario.
  - Asumir Córdoba como origen porque el resto del sitio dice “desde Córdoba”.
- **Consequences:** no hay ficha de crucero. Las fichas nuevas dicen que la ciudad de salida se confirma al consultar. Las salidas de septiembre que ya decían SKY desde Córdoba conservan ese origen.

### D-006 — CMS embebido: Payload 3 + Postgres para catálogo y promo

- **Status:** Accepted
- **Date:** 2026-09-23
- **Source:** Valen — fricción de mantener precios/destinos a mano; caso Cataratas del Iguazú vencido
- **Decision:** El catálogo de destinos y la promo destacada salen del TypeScript estático y pasan a **Payload CMS 3** embebido en la misma app Next.js, con Postgres (Neon en producción) y Vercel Blob para media. El flujo editorial es mixto: el rol `agente` publica directo solo los campos operativos (salidas, estados, precios, nota de precio y vigencia) de un destino ya publicado; cualquier otro cambio, o un destino nuevo, queda en borrador hasta que lo apruebe `encargado` o `admin`. Si `priceValidUntil` venció, la ficha no muestra el monto y dice «Consultá precio actualizado».
- **Rationale:** Los datos quedan en un Postgres propio. El panel vive en el mismo Next, con tipos TypeScript, borradores, versiones e historial, y permisos por campo. El panel es responsive y en español, para que lo usen 2–4 agencieros desde el celular. Neon y Vercel Blob entran en sus free tiers.
- **Rejected alternatives:**
  - Sanity (SaaS): los datos quedan en una nube ajena y el flujo mixto de publicación es menos directo.
  - Supabase + panel a medida: auth, validación y auditoría quedan a cargo propio.
  - CMS basado en Git (Decap, Keystatic): no hay base de datos y cada edición es un deploy.
  - Google Sheets: la validación es débil para precios, slugs y vigencias.
- **Consequences:** la app se parte en los route groups `app/(site)` y `app/(payload)`. La dependencia es grande y está justificada por el flujo editorial. Se reabre el alcance de seguridad: autenticación, secretos de base (`DATABASE_URL` de la integración de Neon), `PAYLOAD_SECRET` y `BLOB_READ_WRITE_TOKEN`, y CI con Postgres. Payload queda fijado en 3.75.0 mientras el sitio siga en Next 15.5 (3.76+ exige Next 16). El comportamiento queda en [specs.md](./specs.md) (T-008).

## Open / needs human input

Landings publicadas y siguientes candidatas (alimenta T-042):

1. **Publicadas:** LATAM y GOL (`/aereos/latam-cordoba`, `/aereos/gol-cordoba`).
2. **Siguientes candidatas** (cuando haya go comercial y contenido propio): Avianca y JetSmart.
3. Otras compañías del marquee (Copa, Air Europa, Arajet, etc.) quedan fuera de esta ola; no se publican landings sin contenido útil propio (D-002).

Alcance operativo por compañía (Valen, 2026-08-04), aplicable a LATAM/GOL y baseline para las siguientes:

- **Resolvemos / ayudamos:** emisión, cambios, equipaje, apoyo con check-in, y comunicación/mediación con la aerolínea ante inconvenientes vinculados a la reserva.
- **Wording:** siempre agencia independiente (no oficina oficial), salvo autorización comercial explícita.

Pendiente fino para las siguientes landings:

1. ¿Hay matices de trámites distintos para Avianca / JetSmart respecto del baseline de arriba?
2. ¿Hay relación comercial autorizada con alguna aerolínea que permita un wording más fuerte que “agencia independiente”? Por defecto: independiente.
