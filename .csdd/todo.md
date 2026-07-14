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

- [ ] T-011 — Reordenar la home alrededor del diferencial verificable
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: `components/sections/Hero.tsx`, `components/sections/ValueProposition.tsx` y orden de secciones en `app/page.tsx`
  - Depends on: T-012 para el texto definitivo de acompañamiento.
  - Updated: 2026-07-13
  - Note: hacer explícitos en la primera pantalla la oficina en el Aeropuerto de Córdoba y la oferta aérea + terrestre; subir la experiencia en transporte/Vía Bariloche, mover Servicios antes de Comunidad y reducir el protagonismo de “sin bots”. No requiere un rediseño visual. Copy de acompañamiento/tiempos de respuesta queda provisorio hasta T-012.

- [ ] T-013 — Pulir la presentación del catálogo y el feed social
  - Owner: Valen
  - Scope: tarjetas de `app/destinos/page.tsx`, `components/sections/FeaturedDestinations.tsx`, `components/sections/InstagramFeed.tsx` y datos asociados
  - Note: usar un formato monetario compartido y legible, mostrar “aéreo” con tilde y enlazar cada pieza de Instagram a su publicación cuando la URL esté disponible. Mantener las descripciones completas en las fichas: el listado ya limita visualmente el texto a tres líneas.

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
