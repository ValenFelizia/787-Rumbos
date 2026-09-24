# 787 Rumbos — Trabajo activo

> Estado operativo del proyecto. Los requisitos y restricciones duraderas están en
> [specs.md](./specs.md); decisiones en [decisions.md](./decisions.md); el diagnóstico
> SEO/producto de contexto permanece en
> [../docs/marketing-growth-audit.md](../docs/marketing-growth-audit.md).

## In Progress

## Ready to Land

- [ ] T-056 — Dejar que un asistente de IA edite el catálogo por MCP, solo en borrador
  - Owner: Valen
  - Agent: Cursor (Opus orchestrating, Grok subagent)
  - Scope: rol `asistente`; guard de borrador en el hook editorial; `@payloadcms/plugin-mcp@3.75.0` (destinos find/create/update, imágenes find, prompt `cargar-flyer`); migración `mcp_bot`; usuario demo y clave local; smoke 401; `scripts/qa-mcp.mjs`; D-007
  - Target: `master`
  - Updated: 2026-09-24
  - Landing: draft PR hacia master desde `cursor/payload-mcp-bot-76cb`
  - Verification: lint 0 errores (1 warning previo en `Footer.tsx`); typecheck ok; unit 19/19; parity 0 diferencias (23 destinos y promo); smoke 16/16; qa-editorial 10/10; qa-mcp 8/8 (a–h). Golden HTML del 2026-09-23, no se comparó: el script vale para el mismo día calendario.

## Blocked

## Pending

### Aéreos SEO — follow-ups post #11

> Issue #11 cerrado. Hub + LATAM + GOL + medición WA en master. Siguientes candidatas: Avianca/JetSmart.

- [ ] T-042 — Landings Avianca + JetSmart cuando haya go comercial
  - Owner: Valen
  - Agent: —
  - Scope: `airlinesData` + copy propio; no publicar espejos
  - Target: `master`
  - Depends on: confirmar matices de trámites vs baseline GOL/LATAM (decisions.md).
  - Note: Candidatas definidas. Baseline operativo ya documentado; solo falta go/no-go y matices.
  - Acceptance: landings propias publicadas o diferidas con motivo; sin doorway.

### Contenido y operación

- [ ] T-004 — Mantener el catálogo y las promociones vigentes
  - Owner: Valen
  - Depends on: T-008
  - Note: catálogo y promo se revisan en `/admin`, en «Para revisar». Instagram sigue en `lib/instagram-posts.ts` (revisión manual mensual; captions evergreen). Hubs, aéreos y testimonios siguen en `lib/`. La revalidación diaria de Next no reemplaza el control comercial.



### Próxima ola de producto

- [ ] T-014 — Analizar automatización ligera de salidas grupales desde Instagram
  - Owner: Valen
  - Note: alcance previsto en el flujo editorial de salidas grupales y posibles integraciones Instagram/Meta. Investigar si se puede reducir la carga de cargar salidas a mano cuando ya se publican en Instagram. Se reevalúa después de T-008: la automatización podría alimentar el CMS. Evaluar opciones, costos, límites de Meta, mantenimiento y riesgo; entregar recomendación go/no-go antes de implementar. Un canal WhatsApp para los agencieros se analiza en T-058.

- [ ] T-005 — Crear el hub de escapadas de fin de semana largo
  - Owner: Valen
  - Depends on: inventario y copy verificables.
  - Note: alcance previsto en `app/destinos/**`, `lib/**` y contenido propio asociado.

- [ ] T-006 — Extender el contenido SEO solo con demanda validada
  - Owner: Valen
  - Note: alcance previsto en FAQs de destinos, blog mínimo e interlinking editorial. Ampliar FAQs cuando existan consultas reales; priorizar artículos breves con intención de búsqueda concreta. El cluster aéreos del issue #11 (T-032→T-036) es demanda validada aparte; no esperar blog genérico.

- [ ] T-007 — Mejorar la medición de conversiones
  - Owner: Valen
  - Depends on: Google Business Profile activo y una necesidad real de embudos o campañas medibles.
  - Note: alcance previsto en eventos de CTA de WhatsApp y, solo si hace falta, atribución más fina. T-036 cubre eventos mínimos del cluster aéreos con el stack actual (Vercel Analytics). No agregar GA4 ni un tracker de leads mientras no haya una necesidad operativa.

- [ ] T-009 — Evaluar pauta controlada
  - Owner: Valen
  - Depends on: GBP verificado y una forma estable de medir el origen de las consultas.
  - Note: solo si la presencia local y la medición básica ya están cubiertas. Preferir intención específica (local / destino) frente a keywords genéricas de comparadores.

### CMS — backlog post T-008

- [ ] T-055 — Dar de alta a los agencieros y completar la primera carga de vigencias
  - Owner: Valen
  - Note: crear en `/admin` un `encargado` y los `agente`, y pasarles `docs/guia-cms-agencieros.md`. Hoy «Para revisar» lista los 23 destinos sin «Precio vigente hasta»: la tarea queda cumplida cuando esa lista esté vacía o con motivo. El seed no se vuelve a correr en producción.

- [ ] T-049 — Hacer editables en el CMS los hubs y las landings de aerolíneas
  - Owner: Valen
  - Note: hoy viven en `lib/clusters-data.ts` y `lib/airlines-data.ts`; pasarlos al CMS cuando el catálogo de T-008 esté estable.

- [ ] T-050 — Pasar testimonios e Instagram al CMS
  - Owner: Valen
  - Note: `lib/testimonials-data.ts` y `lib/instagram-posts.ts` siguen en código; moverlos cuando el flujo editorial del catálogo esté asentado.

- [ ] T-051 — Derivar `featuredDestinations` del cotizador desde la base
  - Owner: Valen
  - Note: la lista de `lib/constants.ts` que usa el cotizador debe salir del catálogo en Postgres, no de un array fijo.

- [ ] T-052 — Alertar cada semana el contenido vencido o por revisar
  - Owner: Valen
  - Note: Vercel Cron que avise por email o WhatsApp lo que la vista «Para revisar» marca (precios por vencer, sin salidas, sin revisión).

- [ ] T-053 — Live preview de borradores y guía corta para agencieros
  - Owner: Valen
  - Note: la guía corta está en `docs/guia-cms-agencieros.md`. Sigue pendiente previsualizar un borrador en el sitio.

- [ ] T-054 — Avisar en el admin si un texto libre menciona un precio vencido
  - Owner: Valen
  - Note: el fail-safe tapa el precio estructurado, no las menciones en la descripción, la meta description o las FAQ. Un aviso al guardar, si el texto tiene `$` o `USD` y la vigencia está vencida o vacía, alcanza para la primera versión.

- [ ] T-057 — Conectar Grok Bot al MCP del catálogo
  - Owner: Valen
  - Note: xAI soporta herramientas MCP remotas con bearer auth en su API. Definir dónde corre el bot y quién puede hablarle. Crear su propia clave de API, distinta de la de QA.

- [ ] T-058 — Analizar un agente por WhatsApp para los agencieros
  - Owner: Valen
  - Note: el objetivo es cero fricción para los padres de Valen: mandan un flyer o un texto a un número de WhatsApp y el agente carga borradores por MCP, respondiendo con un resumen y el enlace para aprobar. Evaluar WhatsApp Business Cloud API vs Twilio vs alternativas, costo, número (no puede ser el número público de la agencia, o evaluarlo), identidad y allowlist de remitentes, políticas de Meta (ventana de 24 h y templates) y hosting. Entregar go/no-go antes de implementar. Se relaciona con T-014.

## Deferred

- [ ] T-027 — Incorporar fotos nuevas del local/equipo y evaluar reemplazos
  - Owner: Valen
  - Updated: 2026-07-18
  - Depends on: T-023.
  - Reason: hoy solo hay `nosotros-local.jpg` (local real) y `nosotros.jpg` (FIT); Valen pedirá más fotos a la familia en los próximos días.
  - Resume when: Valen tenga un lote nuevo de fotos del local/equipo y quiera decidir qué reemplazar (prioridad: sustituir o reencuadrar FIT si hay evidencia más fuerte en el aeropuerto).
  - Note: sesión corta de curaduría — no rediseñar la firma; elegir 1–2 assets y actualizar Hero/AboutUs/alts.


## Recently Completed

Retention: 12

- [x] T-008 — Migrar catálogo y promo destacada a Payload CMS (D-006)
  - Owner: Valen
  - Agent: Cursor (Opus orchestrating, Grok subagents)
  - Scope: released
  - Updated: 2026-09-24
  - Landed: PR #40 on `master` (`7cd9db3`)
  - Note: Payload 3.75 + Neon (US East 1) + Vercel Blob público en producción. Seed corrido una vez; paridad 0 contra el sitio anterior. Previews con branch de Neon propio. Alta de usuarios y primera carga de vigencias → T-055.

- [x] T-048 — Publicar cupos de Brasil, fin de año y República Dominicana
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-09-21
  - Landed: `a67ba22` on `master`
  - Note: cupos de enero 2027, fin de año 2026 y República Dominicana. Ciudad de salida a consultar. Crucero no publicado (D-005).

- [x] T-047 — Destacar en la home los destinos con más salidas vigentes
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-09-21
  - Landed: PR #39 on `master`
  - Note: la home ordena por cantidad de fechas distintas. Tras los cupos nuevos muestra Porto, Salvador, Imbassaí y Praia do Forte.

- [x] T-045 — Publicar el WhatsApp oficial de agencia (+54 9 351 768-8623)
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-08-28
  - Landed: PR #30 on `master`
  - Note: canal público único = número oficial de agencia. Fuente única: `AGENCY_PHONE` (CTAs, schema, footer, wa.me/tel). No publicar números personales.

- [x] T-044 — Corregir el glow incompleto del CTA “Armar viaje” en la navbar (issue #26)
  - Owner: Valen
  - Agent: Codex
  - Scope: released
  - Updated: 2026-08-17
  - Landed: PR #27 on `master`
  - Note: la sombra desplazada no era la única causa; `overflow-hidden` recortaba el halo. Se reemplaza por clipping con margen visual, manteniendo el colapso horizontal de los CTAs.

- [x] T-043 — Corregir el flash de CTAs del Navbar al cargar el Hero (issue #25)
  - Owner: Valen
  - Agent: Codex
  - Scope: released
  - Updated: 2026-08-17
  - Landed: PR #28 on `master`
  - Note: el estado inicial del home se hace determinista con `isHome`, evitando depender de `usePathname()` durante render/hidratación. Se preservan transición geométrica, `aria-hidden`, `inert`, foco y CTAs mobile.

- [x] T-029 — Auditar Lighthouse / Core Web Vitals de la home
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-08-04
  - Landed: PR #21 on `master`
  - Note: baseline mobile prod Perf 71 / A11y 100 / BP 100 / SEO 100; LCP 4.5s; CLS 0. P1: sizes logos/AboutUs/partners; a11y Services/Footer; sin priority en flyer promo. Residuales aceptados: LCP/TTFB hero; main-thread; AFIP raw img.

- [x] T-037 — Publicar landing GOL Córdoba y cerrar la primera ola de aéreos (issue #11)
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-08-04
  - Note: `/aereos/gol-cordoba` published; LATAM alineada a trámites reales; independencia explícita. Issue #11 cerrado. Siguientes landings → T-042.

- [x] T-036 — SEO técnico del cluster + medición de CTAs
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-08-04
  - Landed: PR #19 on `master`
  - Note: `wa_click` en nav/footer/hub/landings; smoke `/aereos` + LATAM.

- [x] T-041 — Normalizar metadatos, URL canónica e identidad web (issue #15)
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-08-04
  - Landed: PR #18 on `master`
  - Note: description ~140; theme-color; favicons SVG/32/192/512; manifest; canonical `/legal`; apex→www 308. Issue #15 cerrado vía merge.

- [x] T-040 — Renovar y optimizar la imagen Open Graph (issue #14)
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-08-03
  - Note: `og-image.jpg` 1200×630 / ~108 KB; logo + subtítulo aeropuerto + meta “Pasajes aéreos · Ómnibus · Paquetes a medida”; openGraph/twitter en layout; script `scripts/generate-og-image.mjs`. PNG legacy eliminado. Post-deploy: purgar caché LinkedIn/WhatsApp al validar preview.

- [x] T-039 — Auditar y reducir el HTML inicial de la homepage (issue #16)
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-08-03
  - Note: Baseline prod ~217 KB / ~25 KB br / ~32 KB gzip. Casi la mitad es payload RSC de Next. Decisión con Valen: no micro-opts ni recortes de contenido; umbral 200 KB de opengraph.to no justifica cambios. Issue #16 cerrado.

