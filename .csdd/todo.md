# 787 Rumbos — Trabajo activo

> Estado operativo del proyecto. Los requisitos y restricciones duraderas están en
> [specs.md](./specs.md); decisiones en [decisions.md](./decisions.md); el análisis
> de crecimiento ampliado permanece en
> [../docs/marketing-growth-audit.md](../docs/marketing-growth-audit.md).

## In Progress

### Visual, conversión y motion

- [ ] T-029 — Auditar Lighthouse / Core Web Vitals de la home
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: auditoría Lighthouse/CWV de la home (prod o build local representativo); fixes solo P0/P1 claros; `.csdd/todo.md` al cerrar
  - Target: `development`
  - Updated: 2026-07-21
  - Depends on: T-026.
  - Note: baseline mobile prod Perf 81 / A11y 86 / LCP 4.8s. Fixes locales: hero JPEG 3.4MB→382KB; Hero RSC + `HeroActions`; `fetchPriority=high` + `decoding=sync`; logo nav sin `priority`; SecondaryCta `#0B6B5F`; P2 contraste/headings/stars/touch/name. Verificación local post-fix: Perf ~80 / A11y **100** / LCP simulado ~5.3s (fases: load ~132ms + render delay ~146ms vs ~950ms antes). Re-medir en prod tras deploy.
  - Acceptance: hay baseline documentada; P0/P1 de performance accionables están resueltos o explicitados con motivo; sin degradar conversión/a11y.

## Ready to Land

## Blocked

## Pending

### Visual, conversión y motion

### Aéreos SEO — issue #11

> Plan de acción (D-001 / D-002). Orden sugerido: patrón de datos → hub → LATAM →
> interlinking ligero → SEO técnico/medición. Home: solo enlaces y copy menor.

- [ ] T-032 — Modelo de datos y layout reutilizable para aéreos
  - Owner: Valen
  - Agent: —
  - Scope: `lib/airlines-data.ts` (o equivalente), componente de landing/hub de aéreos; sin tocar ritmo de home
  - Target: `development`
  - Depends on: D-002.
  - Note: Separar estructura/UI de datos por aerolínea (slug, nombre, meta, intro, qué gestionamos, FAQ, WA text). Criterio de “página justificada”: contenido propio útil, no solo renombrar la marca. Reusar patrones de `ClusterHub` donde sirvan, sin meter aéreos bajo `/destinos/`.
  - Acceptance: se puede agregar una aerolínea nueva editando datos + assets mínimos, sin duplicar una page completa.

- [ ] T-033 — Publicar hub `/aereos`
  - Owner: Valen
  - Agent: —
  - Scope: `app/aereos/**`, datos del hub, sitemap
  - Target: `development`
  - Depends on: T-032.
  - Note: Hub multi-aerolínea: propuesta (pasajes de varias compañías + atención en aeropuerto), listado de landings publicadas, CTA cotizar/WhatsApp, NAP/horarios, enlace a destinos/paquetes como cross-sell. Metadata/OG/canonical propios.
  - Acceptance: `/aereos` indexable, en sitemap, con contenido útil y CTA; no es un thin redirect.

- [ ] T-034 — Landing `/aereos/latam-cordoba`
  - Owner: Valen
  - Agent: —
  - Scope: datos LATAM + ruta bajo `/aereos/`; schema FAQ/Breadcrumb si aplica
  - Target: `development`
  - Depends on: T-032.
  - Note: H1/meta orientados a compra/asesoramiento LATAM en Córdoba. Disclaimer de agencia independiente. Presencia en aeropuerto, horarios, FAQ de pasaje, CTA WA, interlink a `/aereos` y (si existe) asistencia/contacto. Sin copiar copy corporativo LATAM ni fingir boletería oficial abandonada.
  - Acceptance: página publicada, no huérfana, disclaimer claro, contenido propio suficiente.

- [ ] T-035 — Interlinking ligero home / nav / footer (sin rediseño)
  - Owner: Valen
  - Agent: —
  - Scope: `Navbar`, `Footer`, tile Pasajes Aéreos en `Services`/`constants`; copy menor hero/ValueProp solo si hace falta
  - Target: `development`
  - Depends on: T-033.
  - Note: Techo D-001: link “Aéreos” o equivalente en nav; Servicios → `/aereos`; footer; opcional 1 línea de apoyo mencionando pasajes aéreos multi-aerolínea. No reordenar secciones ni cambiar motion/identidad. Paquetes siguen visibles.
  - Acceptance: desde home/nav se llega al hub; el primer viewport sigue leyéndose como la home actual.

- [ ] T-036 — SEO técnico del cluster + medición de CTAs
  - Owner: Valen
  - Agent: —
  - Scope: `app/sitemap.ts`, metadata/OG/canonical, JSON-LD válido; eventos Analytics en CTAs de landings
  - Target: `development`
  - Depends on: T-033, T-034.
  - Note: Incluir hub + landings en sitemap. Schema solo donde sea válido (`TravelAgency`/`LocalBusiness`, `BreadcrumbList`, `FAQPage`). Eventos Vercel Analytics (o el stack actual) para WA/cotizar desde hub y LATAM. Smoke de rutas nuevas en CI si el harness lo permite sin inflar alcance.
  - Acceptance: URLs en sitemap; sin regresiones graves de a11y/perf/SEO; clics WA atribuibles a la landing.

- [ ] T-037 — Priorizar próximas 2–3 aerolíneas con datos reales
  - Owner: Valen
  - Agent: —
  - Scope: `.csdd/decisions.md` (open questions) + datos; sin publicar landings hasta priorizar
  - Target: `development`
  - Depends on: input comercial de Valen (ventas/consultas post-LATAM).
  - Note: Cerrar preguntas abiertas de `decisions.md`. Solo entonces abrir tareas de implementación por aerolínea. Evitar páginas espejo.
  - Acceptance: lista priorizada documentada; go/no-go por compañía según contenido propio disponible.

### Contenido y operación

- [ ] T-004 — Mantener el catálogo y las promociones vigentes
  - Owner: Valen
  - Note: alcance previsto en `lib/destinations-data.ts`, `lib/instagram-posts.ts`, promociones y contenido comercial relacionado. Revisión manual mensual de precios, salidas, campañas y feed social. Priorizar captions evergreen en la home; retirar o corregir piezas vencidas. La revalidación diaria de Next evita que las páginas estáticas dependientes de fechas queden congeladas hasta el siguiente deploy, pero no reemplaza el control comercial humano.



### Próxima ola de producto

- [ ] T-014 — Analizar automatización ligera de salidas grupales desde Instagram
  - Owner: Valen
  - Note: alcance previsto en el flujo editorial de salidas grupales, posibles integraciones Instagram/Meta y alternativas sin hardcode ni Headless CMS. Investigar si se puede reducir la carga de cargar salidas a mano cuando ya se publican en Instagram, sin introducir un CMS. Evaluar opciones, costos, límites de Meta, mantenimiento y riesgo; entregar recomendación go/no-go antes de implementar.

- [ ] T-005 — Crear el hub de escapadas de fin de semana largo
  - Owner: Valen
  - Depends on: inventario y copy verificables.
  - Note: alcance previsto en `app/destinos/**`, `lib/**` y contenido propio asociado.

- [ ] T-006 — Extender el contenido SEO solo con demanda validada
  - Owner: Valen
  - Note: alcance previsto en FAQs de destinos, blog mínimo e interlinking editorial. Ampliar FAQs cuando existan consultas reales; priorizar artículos breves con intención de búsqueda concreta. El cluster aéreos del issue #11 (T-032→T-036) es demanda validada aparte; no esperar blog genérico.

- [ ] T-007 — Mejorar la medición de conversiones
  - Owner: Valen
  - Depends on: Google Business Profile activo y necesidad de embudos o campañas medibles.
  - Note: alcance previsto en eventos de CTA de WhatsApp, UTMs y evaluación de GA4. T-036 cubre eventos mínimos del cluster aéreos con el stack actual.

- [ ] T-008 — Evaluar un CMS cuando el catálogo manual deje de escalar
  - Owner: Valen
  - Note: alcance previsto en el modelo y gestión de contenido de destinos. No introducir un CMS antes de que editar `destinations-data.ts` manualmente sea un problema real. Relacionada con T-014: si la automatización de salidas cubre el dolor, puede retrasar o evitar un CMS.

- [ ] T-009 — Ejecutar pauta controlada
  - Owner: Valen
  - Depends on: GBP verificado y tracking de leads estable.
  - Note: alcance previsto en Google Ads e Instagram/Meta Ads.



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

- [x] T-030 — Fix hide de CTAs del Navbar en el primer paint del Hero
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-29
  - Note: Se reemplazó el `IntersectionObserver` por verificación geométrica sincrónica (fail-closed) para evitar el destello de los CTAs del nav durante el primer render del Hero.

- [x] T-038 — Unificar número de contacto en el teléfono principal (+54 9 351 615-7398)
  - Owner: Valen
  - Agent: Antigravity
  - Scope: released
  - Updated: 2026-07-29
  - Note: Se actualizó `AGENCY_PHONE` al número 351 615-7398 en `lib/constants.ts` afectando a todos los CTAs, schemas y enlaces de la web. En `Footer.tsx` se dejó un único ítem de contacto por WhatsApp. El número previo (351 344-8724) se resguarda para la futura sección de venta de pasajes aéreos.

- [x] T-031 — Planificar expansión aéreos SEO (issue #11)
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-28
  - Note: Decisiones D-001 (aditivo, home conservadora) y D-002 (URLs `/aereos` + `/aereos/{aerolinea}-cordoba`). Specs actualizadas con mix comercial y cluster. Tareas T-032→T-037 en Pending. Sin implementación de páginas aún.

- [x] T-026 — Cerrar la mejora visual con QA responsive, accesible y de rendimiento
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-21
  - Landed: `904db23` on `master`
  - Note: lint/typecheck/build OK; e2e 5/5; estático sin ScrollReveal oculto ni P0/P1. Pasada humana Valen sin hallazgos. Lighthouse/CWV diferidos a T-029. Cierra la ola visual T-021→T-028.

- [x] T-028 — Ocultar CTAs del Navbar mientras el Hero está a la vista
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-20
  - Landed: `a087475` on `master`
  - Note: IntersectionObserver sobre `#hero`; desktop hide/reveal con reflow; mobile intacto; `inert` sin Tab fantasma. Revisión humana aprobada.

- [x] T-025 — Reducir la repetición visual y pulir el ritmo completo de la home
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-20
  - Landed: `6c0c480` on `master`
  - Note: FAQ/Instagram más planos; banner de destinos quieto; ValueProp cards middle-ground (sin side-tab/sombra); Services conserva tiles; densidad de padding variada. Revisión humana aprobada.

- [x] T-024 — Implementar un sistema de motion mínimo y estratégico
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-18
  - Landed: `2f9a445` on `master`
  - Note: ScrollReveal eliminado; hero-enter + about-settle; marquee más lento; cards sin lift+zoom+sombra; keyframes SpecialPromo; reduced-motion estático. Revisión humana aprobada.

- [x] T-023 — Convertir la presencia humana en el aeropuerto en la firma visual de la home
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-18
  - Landed: `1344c78` on `master`
  - Note: TrustBar de presencia + AboutUs temprano; hero conserva `hero-bg.jpg` (local full-bleed descartado); FIT con framing honesto. Fotos nuevas → T-027.

- [x] T-020 — Revisar y corregir el smoke test del cotizador
  - Owner: Valen
  - Agent: Codex
  - Scope: released
  - Updated: 2026-07-18
  - Landed: `757194a` on `master`
  - Note: E2E aislado en `.next-e2e` y puerto 3100, sin reutilizar servidores; smoke 5/5 local y CI con CSP/HSTS intactos. La causa era compartir artefactos entre desarrollo y producción, no `upgrade-insecure-requests`.

- [x] T-022 — Unificar la arquitectura y el lenguaje de los CTAs de la home
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-18
  - Landed: `757194a` on `master`
  - Note: CTA primaria `Armar viaje`, secundaria `Escribinos por WhatsApp`, detalle y cotización separados en destinos, preselección conservada y submit final `Cotizar por WhatsApp`; revisión humana aprobada.

- [x] T-021 — Corregir accesibilidad de las interacciones principales
  - Owner: Valen
  - Agent: Codex
  - Scope: released
  - Updated: 2026-07-18
  - Landed: `7eb9f7b` on `master`
  - Note: navegación, promo y cotizador incorporan semántica accesible, foco administrado, Escape, scroll lock y controles anunciados. Revisión humana mobile aprobada; lint sin errores (1 warning preexistente en Footer), typecheck y build de 29 páginas pasan sobre el merge.

- [x] T-003 — Resolver la prueba social
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-18
  - Note: revisión humana completada y sección publicada — 3 citas Google (Matias, Magalí, Denisse), atribución “Reseña en Google” y CTAs. Operativo: seguir pidiendo reseñas reales y monitorear su visibilidad en Maps.

- [x] T-019 — Actualizar README al estado actual del producto
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-17
  - Note: README alineado con stack (Next 15 / React 19 / Tailwind 4), rutas, scripts, CSDD, NAP y flujo `development` → `master`.

- [x] T-018 — Montar CI mínimo y smoke tests de rutas críticas
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-18
  - Note: baseline implementado: ESLint flat + `typecheck`, Playwright y CI en `.github/workflows/ci.yml`. La regresión ambiental descubierta en el smoke del cotizador quedó resuelta por separado en T-020.

- [x] T-017 — Aplicar baseline de seguridad HTTP e higiene de dependencias
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-17
  - Note: headers en `next.config.mjs` (CSP, nosniff, referrer, frame denial, Permissions-Policy, HSTS en prod). Dependabot semanal. Script `audit:deps`. Next parcheado a 15.5.20 (cerró highs de audit; queda moderate de postcss anidado en Next, sin fix seguro vía force).

- [x] T-016 — Mejorar SpecialPromo modal en mobile
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-14
  - Note: sheet mobile (max-h 90dvh, scroll interno, body lock, Escape); folleto arriba + CTAs sticky; desktop 2 cols conservado.

- [x] T-002 — Completar la presencia de Google Business Profile
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-14
  - Note: ficha verificada; fotos/horarios/teléfonos en GBP; Maps + geo/`hasMap`/`sameAs` en web. CTA WhatsApp de chat en GBP rechazado por Google (mitigado con click-to-call + WhatsApp web). Pedido de reseñas y formulario `g.page` pasan a T-003.

- [x] T-012 — Definir el alcance operativo del acompañamiento
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-14
  - Note: grilling cerrado. Specs + FAQ/hero/AboutUs/ValueProp/footer/schema alineados. Reembolsos formales aplazados (preguntas a agencieros en handoff). Roles de teléfono resueltos en web; GBP cerrado en T-002.

- [x] T-015 — Diagnosticar y corregir el marquee de partners
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-14
  - Note: CSS con `-50%` falló varias veces (subpíxel / anchos de Image). Reemplazado por `react-fast-marquee` (`autoFill`, `pauseOnHover`, `prefers-reduced-motion`). Keyframes `.animate-marquee` eliminados de `globals.css`.

- [x] T-013 — Pulir la presentación del catálogo y el feed social
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-14
  - Note: labels de transporte, permalinks IG (post 3 → perfil hasta tener URL), priceNote/empty state/CTA en destacados, badge de próxima salida en `/destinos`. Sin reformateo monetario. Permalink del post 3 queda pendiente en handoff.

