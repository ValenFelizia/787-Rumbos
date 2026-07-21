# 787 Rumbos — Trabajo activo

> Estado operativo del proyecto. Los requisitos y restricciones duraderas están en
> [specs.md](./specs.md); el análisis de crecimiento ampliado permanece en
> [../docs/marketing-growth-audit.md](../docs/marketing-growth-audit.md).

## In Progress

## Ready to Land

## Blocked

## Pending

### Visual, conversión y motion

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
  - Note: alcance previsto en FAQs de destinos, blog mínimo e interlinking editorial. Ampliar FAQs cuando existan consultas reales; priorizar artículos breves con intención de búsqueda concreta.

- [ ] T-007 — Mejorar la medición de conversiones
  - Owner: Valen
  - Depends on: Google Business Profile activo y necesidad de embudos o campañas medibles.
  - Note: alcance previsto en eventos de CTA de WhatsApp, UTMs y evaluación de GA4.

- [ ] T-008 — Evaluar un CMS cuando el catálogo manual deje de escalar
  - Owner: Valen
  - Note: alcance previsto en el modelo y gestión de contenido de destinos. No introducir un CMS antes de que editar `destinations-data.ts` manualmente sea un problema real. Relacionada con T-014: si la automatización de salidas cubre el dolor, puede retrasar o evitar un CMS.

- [ ] T-009 — Ejecutar pauta controlada
  - Owner: Valen
  - Depends on: GBP verificado y tracking de leads estable.
  - Note: alcance previsto en Google Ads e Instagram/Meta Ads.



## Deferred

- [ ] T-029 — Auditar Lighthouse / Core Web Vitals de la home
  - Owner: Valen
  - Updated: 2026-07-20
  - Depends on: T-026.
  - Reason: T-026 cierra QA funcional/a11y/motion sin ampliar a medición de performance; Lighthouse/CWV merecen una pasada dedicada.
  - Resume when: Valen quiera una baseline de performance (LCP/CLS/INP u oportunamente post-T-026).
  - Note: no bloquear el cierre de la ola visual; reporte + fixes solo si hay P0/P1 claros.

- [ ] T-027 — Incorporar fotos nuevas del local/equipo y evaluar reemplazos
  - Owner: Valen
  - Updated: 2026-07-18
  - Depends on: T-023.
  - Reason: hoy solo hay `nosotros-local.jpg` (local real) y `nosotros.jpg` (FIT); Valen pedirá más fotos a la familia en los próximos días.
  - Resume when: Valen tenga un lote nuevo de fotos del local/equipo y quiera decidir qué reemplazar (prioridad: sustituir o reencuadrar FIT si hay evidencia más fuerte en el aeropuerto).
  - Note: sesión corta de curaduría — no rediseñar la firma; elegir 1–2 assets y actualizar Hero/AboutUs/alts.


## Recently Completed

Retention: 12

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

