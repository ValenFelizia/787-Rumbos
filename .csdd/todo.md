# 787 Rumbos — Trabajo activo

> Estado operativo del proyecto. Los requisitos y restricciones duraderas están en
> [specs.md](./specs.md); el análisis de crecimiento ampliado permanece en
> [../docs/marketing-growth-audit.md](../docs/marketing-growth-audit.md).

## Bloqueado por contenido u operación

- [ ] T-003 — Resolver la prueba social
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-14
  - Note: implementado en `development` — 3 citas Google (Matias, Magalí, Denisse) + atribución “Reseña en Google” + CTAs. Tipografía imperfecta de Denisse conservada. **Pendiente revisión humana** (UI + merge a main). Operativo: seguir pidiendo reseñas; monitorear listado público en Maps.

- [ ] T-004 — Mantener el catálogo y las promociones vigentes
  - Owner: Valen
  - Scope: `lib/destinations-data.ts`, promociones y contenido comercial relacionado
  - Note: revisar mensualmente precios, salidas y vigencia; retirar o corregir promociones vencidas.

## Próxima ola de producto

- [ ] T-014 — Analizar automatización ligera de salidas grupales desde Instagram
  - Owner: Valen
  - Scope: flujo editorial de salidas grupales, posibles integraciones Instagram/Meta y alternativas sin hardcode ni Headless CMS
  - Note: investigar si se puede reducir la carga de cargar salidas a mano cuando ya se publican en Instagram, sin introducir un CMS. Evaluar opciones (API Graph, export manual asistido, sheet/CSV, webhook, scrapes desaconsejados, etc.), costos, límites de Meta, mantenimiento y riesgo; entregar recomendación go/no-go antes de implementar.

- [ ] T-005 — Crear el hub de escapadas de fin de semana largo
  - Owner: Valen
  - Scope: `app/destinos/**`, `lib/**` y contenido propio asociado
  - Depends on: inventario y copy verificables.

- [ ] T-006 — Extender el contenido SEO solo con demanda validada
  - Owner: Valen
  - Scope: FAQs de destinos, blog mínimo e interlinking editorial
  - Note: ampliar FAQs cuando existan consultas reales; priorizar artículos breves con intención de búsqueda concreta.

- [ ] T-007 — Mejorar la medición de conversiones
  - Owner: Valen
  - Scope: eventos de CTA de WhatsApp, UTMs y evaluación de GA4
  - Depends on: Google Business Profile activo y necesidad de embudos o campañas medibles.

- [ ] T-008 — Evaluar un CMS cuando el catálogo manual deje de escalar
  - Owner: Valen
  - Scope: modelo y gestión de contenido de destinos
  - Note: no introducir un CMS antes de que editar `destinations-data.ts` manualmente sea un problema real. Relacionada con T-014: si la automatización de salidas cubre el dolor, puede retrasar o evitar un CMS.

- [ ] T-009 — Ejecutar pauta controlada
  - Owner: Valen
  - Scope: Google Ads e Instagram/Meta Ads
  - Depends on: GBP verificado y tracking de leads estable.

## Completado recientemente

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

- [x] T-011 — Reordenar la home alrededor del diferencial verificable
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: released
  - Updated: 2026-07-13
  - Note: hero y propuesta de valor priorizan aeropuerto + aéreo/terrestre + transporte/Vía Bariloche; Servicios va antes de Comunidad. El microcopy de tiempos de respuesta y el alcance definitivo del acompañamiento quedan para T-012.

- [x] T-010 — Auditar el análisis de posicionamiento y convertirlo en trabajo verificable
  - Owner: Valen
  - Agent: Codex
  - Scope: released
  - Updated: 2026-07-13
  - Note: auditoría contrastada con código, versión pública y políticas oficiales; conclusiones incorporadas en `specs.md`, este estado operativo y la adenda de `docs/marketing-growth-audit.md`.

- [x] T-001 — Migrar el estado del proyecto a CSDD
  - Owner: Valen
  - Agent: Codex
  - Scope: released
  - Updated: 2026-07-12
  - Note: `todo.md` y `specs.md` se trasladaron desde `docs/`, se ajustaron a sus roles CSDD y se conservaron los documentos de análisis como contexto no operativo.
