# 787 Rumbos — Trabajo activo

> Estado operativo del proyecto. Los requisitos y restricciones duraderas están en
> [specs.md](./specs.md); el análisis de crecimiento ampliado permanece en
> [../docs/marketing-growth-audit.md](../docs/marketing-growth-audit.md).

## Bloqueado por contenido u operación

- [ ] T-002 — Completar la presencia de Google Business Profile
  - Owner: Valen
  - Scope: Google Business Profile, enlace exacto de Maps, datos NAP, schema `TravelAgency` y activos operativos relacionados
  - Blocked by: verificación de la ficha, definición del teléfono público principal, fotos reales del local/equipo y disponibilidad para publicar.
  - Note: reconciliar el WhatsApp comercial `+54 9 351 615-7398` con el número de administración/agencia `+54 9 351 344-8724`; luego alinear footer, schema, GBP y citaciones. Reemplazar el enlace genérico al aeropuerto por la ficha exacta cuando exista.

- [ ] T-003 — Resolver la prueba social
  - Owner: Valen
  - Scope: `components/sections/Testimonials.tsx`, `app/page.tsx` y contenido curado de Instagram
  - Blocked by: obtener reseñas o testimonios reales con autorización y la URL verificada de Google Business Profile.
  - Note: los testimonios de ejemplo existen en el componente, pero la home no los renderiza. Deben sustituirse antes de habilitar la sección; ubicar la prueba social real cerca de la primera tanda de paquetes. Pedir reseñas auténticas de forma sostenida, sin incentivos, selección sesgada ni texto dictado.

- [ ] T-012 — Definir el alcance operativo del acompañamiento
  - Owner: Valen
  - Scope: política de atención, promesa de respuesta y copy de hero, propuesta de valor y FAQ
  - Blocked by: definir canal, horarios, tipos de incidencias cubiertas, tiempos de respuesta sostenibles y límites del servicio durante el viaje.
  - Note: no publicar ni mantener una promesa que pueda interpretarse como soporte 24/7 hasta contar con una definición operativa verificable.

- [ ] T-004 — Mantener el catálogo y las promociones vigentes
  - Owner: Valen
  - Scope: `lib/destinations-data.ts`, promociones y contenido comercial relacionado
  - Note: revisar mensualmente precios, salidas y vigencia; retirar o corregir promociones vencidas.

## Próxima ola de producto

- [ ] T-014 — Analizar automatización ligera de salidas grupales desde Instagram
  - Owner: Valen
  - Scope: flujo editorial de salidas grupales, posibles integraciones Instagram/Meta y alternativas sin hardcode ni Headless CMS
  - Note: investigar si se puede reducir la carga de cargar salidas a mano cuando ya se publican en Instagram, sin introducir un CMS. Evaluar opciones (API Graph, export manual asistido, sheet/CSV, webhook, scrapes desaconsejados, etc.), costos, límites de Meta, mantenimiento y riesgo; entregar recomendación go/no-go antes de implementar.

- [ ] T-015 — Diagnosticar y corregir el marquee de partners
  - Owner: Valen
  - Scope: `components/sections/PartnersMarquee.tsx`, animación en `app/globals.css` y dependencias si se justifica
  - Note: el loop actual se corta o reinicia de forma brusca; no es smooth. Analizar causa (duplicación del track, `%` vs ancho real, gap/padding, GPU, reduced-motion) y arreglar. Evaluar si una librería externa (p. ej. Embla, Swiper free-mode, o un marquee dedicado) es preferible a seguir con CSS puro; preferir la solución más simple que quede estable.

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
