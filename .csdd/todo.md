# 787 Rumbos — Trabajo activo

> Estado operativo del proyecto. Los requisitos y restricciones duraderas están en
> [specs.md](./specs.md); el análisis de crecimiento ampliado permanece en
> [../docs/marketing-growth-audit.md](../docs/marketing-growth-audit.md).

## Bloqueado por contenido u operación

- [ ] T-002 — Completar la presencia de Google Business Profile
  - Owner: Valen
  - Scope: Google Business Profile, datos NAP y activos operativos relacionados
  - Blocked by: verificación de la ficha, fotos reales del local/equipo y disponibilidad para publicar.
  - Note: incluye categoría, horarios, publicaciones, reseñas y citaciones locales coherentes.

- [ ] T-003 — Resolver la prueba social publicada
  - Owner: Valen
  - Scope: `components/sections/Testimonials.tsx`, `app/page.tsx` y contenido curado de Instagram
  - Blocked by: decisión sobre retirar los testimonios de ejemplo visibles o sustituirlos por tres testimonios con autorización.
  - Note: el requisito prohíbe presentar testimonios ficticios; el estado actual del código renderiza datos de ejemplo y debe reconciliarse antes de considerar esta tarea completada.

- [ ] T-004 — Mantener el catálogo y las promociones vigentes
  - Owner: Valen
  - Scope: `lib/destinations-data.ts`, promociones y contenido comercial relacionado
  - Note: revisar mensualmente precios, salidas y vigencia; retirar o corregir promociones vencidas.

## Próxima ola de producto

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
  - Note: no introducir un CMS antes de que editar `destinations-data.ts` manualmente sea un problema real.

- [ ] T-009 — Ejecutar pauta controlada
  - Owner: Valen
  - Scope: Google Ads e Instagram/Meta Ads
  - Depends on: GBP verificado y tracking de leads estable.

## Completado recientemente

- [x] T-001 — Migrar el estado del proyecto a CSDD
  - Owner: Valen
  - Agent: Codex
  - Scope: released
  - Updated: 2026-07-12
  - Note: `todo.md` y `specs.md` se trasladaron desde `docs/`, se ajustaron a sus roles CSDD y se conservaron los documentos de análisis como contexto no operativo.
