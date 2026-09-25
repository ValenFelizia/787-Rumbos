# Plan UX/QoL — Destinos, clusters y cotizador

> **Tipo:** auditoría + backlog (solo documentación).  
> **Fecha:** 2026-09-24  
> **Rama base:** `master` (post PR #40 Payload CMS; guía editorial en [`docs/guia-cms-agencieros.md`](./guia-cms-agencieros.md)).  
> **Contexto de negocio:** los destinos **anuncian salidas** y califican consultas a WhatsApp. No es un e-commerce.  
> **Entorno de prueba:** Postgres local no estaba disponible en el agente. La auditoría de UI se hizo contra producción [`www.787rumbos.com.ar`](https://www.787rumbos.com.ar) + lectura de código. Capturas en `/opt/cursor/artifacts/` (no van en el repo).

---

## 1. Auditoría del estado actual

### 1.1 Mapa de piezas relevantes

| Área | Archivos / componentes |
| --- | --- |
| Listado `/destinos` | `app/(site)/destinos/page.tsx`, `destinos-view.tsx` |
| Detalle destino | `app/(site)/destinos/[slug]/page.tsx` |
| Clusters SEO | `lib/clusters-data.ts`, `components/sections/ClusterHub.tsx`, páginas estáticas bajo `app/(site)/destinos/*-desde-cordoba/` |
| Precio “desde” | Payload `priceFrom` + `currency` + `priceValidUntil` (`payload/collections/Destinations.ts`); reglas `getListedPrice` / `hasExpiredListedPrice` en `lib/catalog/logic.ts` |
| Catálogo público | `lib/catalog/repository.ts` (orden `sortOrder`), `lib/catalog/map.ts` |
| Cotizador | `components/sections/QuoteModal.tsx`, `lib/context/ModalContext` |
| CTAs | `components/conversion/*`, `components/sections/Navbar.tsx` |
| Home → destinos | `RumboSelector.tsx`, `FeaturedDestinations.tsx` |

### 1.2 Capturas de referencia (producción)

| Vista | Archivo |
| --- | --- |
| `/destinos` desktop | `destinos_desktop.png` |
| `/destinos` mobile | `destinos_mobile.png` |
| Cluster Brasil | `cluster_brasil_desktop.png` |
| Detalle Río desktop | `destino_detail_desktop.png` |
| Detalle Río mobile | `destino_detail_mobile.png` |
| Cotizador paso 1 | `cotizador_desktop.png` |
| Cotizador paso 2 | `cotizador_step2_desktop.png` |

### 1.3 `/destinos` — hallazgos

1. **Filtro único y grueso.** Segmented control `Todos | Nacionales | Internacionales` en cliente (`DestinosView`). No hay ordenar, mes, transporte ni cluster como filtro activo.
2. **Chips de cluster encima del filtro.** Cuatro links a hubs SEO (`clustersData`). En mobile consumen casi todo el primer viewport: el usuario no ve tarjetas sin scrollear.
3. **Sin control de orden.** El orden efectivo es `sortOrder` de Payload + hardcode que pinnea `f1-grand-premio-sao-paulo` al tope (`destinos-view.tsx`).
4. **Precios bajo el fold de la tarjeta.** En desktop, la primera fila muestra imagen + “Próxima salida”, pero el bloque “Tarifa base / Desde …” queda fuera del viewport inicial de la card. Impacto: se prioriza foto/fecha (bien) pero el pedido de “ordenar por precio” no se puede ni imaginar en UI.
5. **CTA de card = solo “Ver salidas y detalles”.** En home (`FeaturedDestinations`) hay también “Armar viaje” (abre cotizador). En el listado completo no: inconsistencia de conversión.
6. **Estados vacíos/filtro.** No hay empty state si el filtro devolviera 0 (hoy improbable). No hay loading skeleton (SSR ok). Error de catálogo cae en fallo de página, no en UI recuperable.
7. **Contenido de hubs hardcodeado.** Títulos/copy/slugs de cluster viven en `lib/clusters-data.ts`, no en Payload. Cambiar un chip o un CTA de cluster exige deploy (no encaja del todo con D-006).

### 1.4 Clusters y detalle — hallazgos

**Cómo se llega hoy a un cluster**

| Entrada | Destino |
| --- | --- |
| Chips en `/destinos` | `/destinos/{cluster.slug}` |
| `RumboSelector` (home) | Brasil → hub playa (Brasil); Argentina bus → hub bus; salidas grupales → hub grupales. **Caribe no tiene tile propio** (queda mezclado en “Quiero playa” → Brasil). |
| Breadcrumb / link “Ver más” en detalle | `getPrimaryClusterForDestination` |
| SEO / sitemap | hubs indexables |

**Cómo se llega a un detalle**

| Entrada | Destino |
| --- | --- |
| Grid `/destinos` | `/destinos/{slug}` |
| Grid del `ClusterHub` | mismo slug |
| Home “Próximas salidas” | mismo slug |
| Relacionados | `getRelatedDestinations` (clusters fijos hardcodeados en `logic.ts`) |

**Fricción**

1. **Mismo namespace URL** para hubs y destinos (`/destinos/...`). Funciona (rutas estáticas ganan a `[slug]`), pero el usuario no distingue “categoría” vs “ficha” hasta leer el layout.
2. **ClusterHub no muestra precio ni próxima fecha concreta** — solo contador “N salidas” / “A medida”. Pierde el argumento comercial que el listado sí tiene.
3. **Detalle desktop:** panel sticky de salidas + CTA WhatsApp por fecha — alineado al negocio. Bien.
4. **Detalle mobile:** las salidas quedan **debajo** de descripción, highlights, incluye, tip y nota aclaratoria. El CTA calificado aparece tarde.
5. **Sin FAB / sticky WhatsApp** en scroll de listado o detalle mobile (solo nav hamburger + CTAs del menú).
6. **Relacionados:** clusters mate hardcodeados en `lib/catalog/logic.ts` (no Payload). Agregar un destino a un “grupo” de relacionados requiere código.

### 1.5 Precio en Payload — modelo real (base para ordenar)

| Fuente | Campos | Uso en UI |
| --- | --- | --- |
| Destino | `priceFrom?`, `currency` (ARS\|USD, required, default ARS), `priceNote?`, `priceValidUntil?` | Tarifa base de ficha/listado vía `getListedPrice` |
| Salida | `priceFrom?`, `currency?`, `priceIsFinal?`, `priceValidUntil?` (fallback a destino) | Card de salida en detalle |

Reglas ya implementadas (`lib/catalog/logic.ts`):

- “Desde” listado = **mínimo** entre precios de salidas hoteleras activas (sin `stayLabel`); si no hay, cae al `priceFrom` del destino.
- Si la vigencia venció → no se muestra monto → “Consultá precio actualizado”.
- Monedas mixtas en el catálogo: **sí** (seed/prod: nacionales en ARS, muchos internacionales en USD). `getListedPrice` **no convierte**.

Implicaciones para sort precio:

- Comparar `587000` ARS con `1850` USD como números es incorrecto y engañoso.
- Destinos sin precio / precio vencido / solo “Consultar” deben ir al **final**, no al inicio del “más barato”.
- El sort debe usar la misma función que la UI (`getListedPrice`), no el `priceFrom` crudo del documento (puede diferir del mínimo de salidas).

### 1.6 Cotizador — hallazgos

1. Flujo 3 pasos sólido (destino → fecha/pasajeros → aerolínea) con focus trap, Escape, `aria-*` razonables.
2. **Sugerencias hardcodeadas** desde `featuredDestinations` en `lib/constants.ts` (+ Cancún, Playa del Carmen, Ushuaia). **No lee el catálogo Payload.** Riesgo: chips desactualizados / destinos sin ficha.
3. Destino = texto libre (bien para “a medida”); no hay autocomplete del catálogo.
4. Al abrir desde home con destino preseleccionado salta al paso 2; desde `/destinos` las cards **no** abren el cotizador.
5. Bypass WhatsApp presente (bien). Submit arma mensaje y abre WA en cliente (sin backend) — correcto.

### 1.7 QoL site-wide que afecta estos flujos

| Tema | Hallazgo |
| --- | --- |
| Nav | En `/destinos` los links “Servicios/Preguntas/…” apuntan a `/#…` (home). Ok, pero desde catálogo se pierde contexto. |
| Mobile nav | CTAs solo dentro del menú hamburguesa en rutas no-home (desktop sí muestra Armar viaje + WA). |
| A11y filtros | Botones de región sin `aria-pressed` / `role="tablist"` explícito. |
| Performance | Imágenes con `sizes` razonables; listado es client component solo por el filtro — aceptable. Sin paginación (catálogo ~20–25 ítems: ok). |
| Copy | Nota legal en detalle es larga y empuja salidas en mobile. |

### 1.8 Fricciones ordenadas por impacto

| # | Impacto | Fricción |
| --- | --- | --- |
| 1 | Alto | No se puede ordenar/filtrar por lo que el usuario pregunta (“¿cuál es más barato?”, “¿hay algo en octubre?”). |
| 2 | Alto | En mobile, salidas/WhatsApp del detalle llegan tarde. |
| 3 | Medio-alto | Primer viewport mobile de `/destinos` = hero + 4 chips, cero tarjetas. |
| 4 | Medio | Clusters sin precio/fecha; Caribe poco visible desde home. |
| 5 | Medio | Cotizador desacoplado del catálogo CMS. |
| 6 | Medio | Inconsistencia CTA listado vs home (falta “Armar viaje” / WA en card). |
| 7 | Bajo-medio | Hardcodes F1 + clusters mates + chips de sugerencia. |
| 8 | Bajo | Sidebar tipo shop: **no existe hoy**; el riesgo es introducirlo. |

---

## 2. Recomendación de arquitectura de información (clusters)

### Alternativa A — Mantener (status quo)

- `/destinos` flat + chips de texto a hubs + `[slug]` detalle.
- **Pros:** SEO ya indexado; poco trabajo; breadcrumbs funcionan.
- **Contras:** chips débiles; Caribe poco descubrible; “categoría vs ficha” confusa; hubs subutilizados.

### Alternativa B — Hub visual primero (recomendada)

- En `/destinos`, **antes del grid**, una fila de **4 cards de cluster** (imagen + título corto + 1 línea + contador de destinos/salidas) en lugar de (o además de, más compactos) los chips de texto.
- Debajo: toolbar ligera (filtro región + orden) + grid completo “Todos los destinos”.
- URLs **sin cambiar** (`/destinos/brasil-desde-cordoba`, etc.).
- **Pros:** refuerza intención “desde Córdoba” sin parecer marketplace; mejora mobile (cards > 4 pills largas); Caribe gana presencia; cero migración de URLs.
- **Contras:** un poco más de scroll en desktop; hay que diseñar cards que no se sientan “tienda”.

### Alternativa C — Nested routes `/destinos/brasil/[slug]`

- **Pros:** IA más “correcta”.
- **Contras:** redirects 301, sitemap, breadcrumbs, hardcodes, riesgo SEO. **Desproporcionado** al beneficio.

**Recomendación:** **B**. Dejar C para si algún día el catálogo crece mucho (>40 destinos) y hay evidencia de confusión en analytics.

Opcional posterior (no bloquea B): mover copy de clusters a un global/colección Payload para que encargados editen sin deploy (ítem de backlog P2).

---

## 3. Filtrado / ordenamiento — evaluación y recomendación

### Opción 1 — Panel izquierdo tipo shop (facetas)

- **Pros:** escalable si el catálogo crece.
- **Contras:** estética e-commerce (preocupación explícita de Valentín); en mobile termina en drawer; sugiere “comprar online”; mantenimiento de facetas.

### Opción 2 — Solo sort + chips compactos (recomendada)

Toolbar horizontal bajo el hero:

1. Segmented **Todos / Nacionales / Internacionales** (ya existe).
2. Select **Ordenar:** Destacados (default = `sortOrder` CMS) · Precio ↑ · Precio ↓ · Próxima salida.
3. Chips opcionales de un solo nivel: **Mes de salida** (próximos 6 meses con al menos 1 salida) y/o **Transporte** (Aéreo / Bus). Máximo ~1 fila; no facet tree.

- **Pros:** light; no parece Despegar; encaja con “anunciar salidas”; sort precio cubre el pedido concreto; mes filtra por salidas (el producto real).
- **Contras:** menos potencia que un panel; mezclar muchas chips puede ensuciar.

### Opción 3 — Solo cluster landings + sin filtros en `/destinos`

- **Pros:** ultra simple.
- **Contras:** no resuelve sort por precio ni “octubre”; el listado completo queda pobre.

**Recomendación:** **Opción 2**. Explicitamente **no** implementar panel izquierdo en esta etapa.

### Reglas de sort por precio (aceptación técnica)

1. Clave de orden = `getListedPrice(dest)` (mismo “desde” que la card).
2. **Nunca** comparar ARS vs USD en la misma escala numérica.
3. Comportamiento recomendado al elegir Precio ↑ / ↓:
   - Mostrar chip auxiliar **Moneda: Todas | ARS | USD** (default: Todas).
   - Con **Todas**: ordenar dentro de cada moneda (bloque ARS y bloque USD, con subtítulo discreto) **o** exigir elegir moneda antes de aplicar sort (más seguro; UX un click más).
   - **Default de producto sugerido:** al elegir sort por precio, default moneda = la mayoritaria del filtro activo; si hay mix, mostrar ambos bloques con encabezado “En pesos” / “En dólares”.
4. Sin precio / vencido / “Consultar” → **siempre al final** (en ambos sentidos de sort).
5. Empate de monto → `sortOrder` CMS, luego nombre.
6. **Sin schema Payload** para el sort en sí (campo ya existe). Schema solo si se agrega flag `featured` o se elimina el hardcode F1.

---

## 4. Cotizador — hallazgos y mejoras propuestas

| ID plan | Mejora | Notas |
| --- | --- | --- |
| Ver backlog QOL-07 | Sugerencias desde catálogo publicado | Reemplazar `featuredDestinations` estático |
| QOL-08 | Autocomplete ligero de slugs/nombres Payload | Texto libre se mantiene para destinos off-catalog |
| QOL-05 (relacionado) | Abrir cotizador desde card de `/destinos` con `openModal(name)` | Paridad con home |
| — | No agregar pasos ni formularios server-side | Fuera de alcance; WA sigue siendo el cierre |

No hace falta schema para sugerencias si se leen destinos publicados vía props SSR → client (o endpoint existente). Evitar hardcode.

---

## 5. Backlog (1 ítem = 1 rama / 1 PR a `master`)

| ID | Título | Scope (archivos/áreas) | ¿Schema Payload? | Esfuerzo | Prioridad | Criterios de aceptación | Proof del PR futuro | Deps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **QOL-01** | Ordenar `/destinos` por precio (↑/↓) y por próxima salida | `destinos-view.tsx`, helpers en `lib/catalog/logic.ts` (+ tests), UI select Ordenar | **N** | M | **P0** | Select visible desktop/mobile; Precio usa `getListedPrice`; sin precio al final; ARS/USD no se mezclan numéricamente (bloques o chip moneda); Destacados = `sortOrder` sin pin F1 hardcode **o** pin documentado vía campo | `npm run test:unit` + screenshot listado ordenado + lint/typecheck | — |
| **QOL-02** | Chip moneda al ordenar + copy “Desde / por persona” siempre visible arriba en card | `destinos-view.tsx`, opcionalmente `FeaturedDestinations.tsx` | **N** (usa `priceNote` existente; default copy ya en UI) | S | **P0** | Con sort precio, chip ARS\|USD\|Todas; en card, precio o “Consultá…” visible sin depender de scroll interno excesivo (reordenar bloque precio bajo el título si hace falta) | Screenshot desktop+mobile | QOL-01 (o mismo PR si se prefiere unificar; preferible separado si QOL-01 ya grande) |
| **QOL-03** | Cards de cluster en `/destinos` (IA alt. B) | `destinos-view.tsx`, posible `ClusterCard` en `components/sections/`, assets en `public/` o media | **N** corto plazo (copy sigue en `clusters-data.ts`) | M | **P1** | 4 cards visuales sustituyen o compactan chips; mobile muestra ≥1 card de cluster + inicio del grid sin 4 pills largas a full-width stacked de forma dominante; links iguales | Screenshot `/destinos` mobile+desktop | — |
| **QOL-04** | Filtro por mes de salida (chips) | `destinos-view.tsx`, `getActiveUpcomingDepartures` | **N** | M | **P1** | Chip “Oct 2026” etc. solo meses con ≥1 salida activa; filtrar destinos con al menos una salida ese mes; vacíos → empty state con CTA WA | Screenshot + unit test helper | QOL-01 opcional |
| **QOL-05** | CTA “Armar viaje” + mensaje WA en cards de `/destinos` | `destinos-view.tsx`, conversion components | **N** | S | **P1** | Paridad con home: secundario abre cotizador prefilled; no reemplaza “Ver salidas”; tracking coherente | Screenshot card + abrir modal | — |
| **QOL-06** | Detalle mobile: atajo a salidas / CTA sticky | `[slug]/page.tsx` (+ CSS sticky bar) | **N** | M | **P1** | En mobile, tras hero: link/botón “Ver fechas y consultar”; o barra sticky inferior “Consultar por WhatsApp” que use salida más próxima o viaje a medida | Screenshot mobile detail scroll | — |
| **QOL-07** | Cotizador: sugerencias desde Payload | `QuoteModal.tsx`, pasar nombres desde server layout/page o context | **N** | S | **P1** | Chips = subset de destinos publicados (p.ej. con salidas activas o top `sortOrder`); texto libre intacto; sin lista de `constants.featuredDestinations` | Screenshot paso 1 + test e2e existente cotizador | — |
| **QOL-08** | ClusterHub: mostrar “Desde” + próxima salida en cards | `ClusterHub.tsx` | **N** | S | **P1** | Misma lógica de precio/fecha que listado; “A medida” si no hay salidas | Screenshot cluster Brasil | — |
| **QOL-09** | Quitar hardcode F1 + mates de relacionados | `destinos-view.tsx`, `lib/catalog/logic.ts`; opcional campo | **Y** si se agrega `pinToTop` / `relatedGroup`; **N** si solo se usa `sortOrder` + clusters existentes | S–M | **P2** | F1 no está hardcodeado; relacionados usan membership de cluster Payload o `clusters-data` sin arrays mágicos duplicados | test:unit + review CMS | Decisión producto pin |
| **QOL-10** | Empty/loading/a11y de filtros en `/destinos` | `destinos-view.tsx` | **N** | S | **P2** | `aria-pressed` en filtros; empty state si 0 resultados + CTA WA; anuncio `aria-live` del conteo | a11y smoke / screenshot empty forzado | QOL-04 |
| **QOL-11** | Clusters editables en Payload (global o colección) | `payload/`, seed, `clusters-data` → repository, migración | **Y** | L | **P2** | Encargado edita título/intro/CTA/slugs de destinos del hub sin deploy; front lee CMS; paridad seed | `cms:migrate` + `test:parity` + `/admin` | Decisión editorial |
| **QOL-12** | Tile Caribe en `RumboSelector` o retitular “Playa” | `RumboSelector.tsx` | **N** (copy UI; clusters siguen en lib) | S | **P2** | Usuario puede ir a Caribe sin pasar solo por Brasil; no romper D-001 home | Screenshot home | Decisión marketing |

**Fuera de este backlog (consciente):** rewrites de copy marketing; panel shop; pagos; schema de conversión de moneda; migraciones contra DB remota desde este plan.

---

## 6. Decisiones de producto / marketing pendientes

Cada ítem incluye **default recomendado** para no bloquear implementación.

| # | Pregunta | Default recomendado |
| --- | --- | --- |
| D1 | ¿Seguimos mostrando precios “desde” en listado público? | **Sí.** Ya es parte del producto y de la guía CMS; sin precio la web pierde ancla. Mantener disclaimer de referencial. |
| D2 | ¿UI de filtros: sidebar shop vs chips+sort? | **Chips + sort (opción 2).** No sidebar. |
| D3 | Con monedas mixtas, ¿bloques ARS/USD o forzar chip moneda? | **Bloques con encabezado** al ordenar por precio; chip moneda como refinamiento. |
| D4 | ¿Qué priorizar en el primer viewport de `/destinos` mobile: clusters o grid? | **1–2 cluster cards compactas + inicio del grid**; hero más bajo. |
| D5 | ¿CTA primario de card de listado: ver ficha, cotizador o WA directo? | **Primario = ver ficha/salidas** (califica con contexto); secundario = Armar viaje / WA. Evitar WA genérico sin fecha en el listado. |
| D6 | ¿Caribe necesita entrada propia en home? | **Sí**, tile o subtítulo explícito bajo “Quiero playa” (QOL-12). |
| D7 | ¿F1 debe seguir pineado? | **Solo vía `sortOrder` (o flag CMS)**, no hardcode. Si deja de ser prioridad comercial, el encargado lo baja. |
| D8 | ¿Migrar copy de clusters a Payload ahora? | **No en P0.** Primero UX front (QOL-03/08); Payload clusters en P2 (QOL-11) si duele el deploy. |
| D9 | Copy del sticky WA en mobile detalle | **“Consultar fechas por WhatsApp”** → mensaje con destino (+ próxima salida si hay). |
| D10 | ¿Filtro por transporte en v1? | **No.** Primero precio + mes; transporte en iteración si analytics lo pide. |

---

## 7. Notas para implementadores

- Todo string comercial nuevo de destinos/clusters/precios debe salir de Payload o de campos ya existentes; no reintroducir catálogos hardcodeados (`featuredDestinations` en cotizador es deuda actual).
- Roles: no complicar el panel. Preferir UI front pura (QOL-01…08, 10, 12). Schema solo cuando el editor gana control real (QOL-09/11).
- Probar con seed local (`cms:migrate` + `cms:seed`) o preview Neon; no migrar producción a mano desde PRs de UX.
- Proof mínimo por PR: lint + typecheck + test:unit afectados + 1 screenshot de la superficie tocada.

---

## 8. Resumen ejecutivo

El sitio ya convierte bien en **detalle** (salidas → WhatsApp). El mayor gap de QoL está en el **listado**: no se puede ordenar por el “desde” que el CMS ya modela, el primer pantallazo mobile es chips SEO, y el cotizador no mira el catálogo publicado. La dirección de producto recomendada es **refinar, no shopificar**: sort + chips ligeros, clusters como cards de entrada, y CTAs sticky en mobile — cada uno como PR chico e independiente.
)
