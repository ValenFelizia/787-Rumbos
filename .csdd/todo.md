# 787 Rumbos — Trabajo activo

> Estado operativo del proyecto. Los requisitos y restricciones duraderas están en
> [specs.md](./specs.md); el análisis de crecimiento ampliado permanece en
> [../docs/marketing-growth-audit.md](../docs/marketing-growth-audit.md).

## In Progress

## Ready to Land

- [ ] T-020 — Revisar y corregir el smoke test del cotizador
  - Owner: Valen
  - Agent: Codex
  - Scope: configuración de build E2E, Playwright, smoke del cotizador y workflow de CI.
  - Target: `master`
  - Base: `a32dfde`
  - Updated: 2026-07-18
  - Landing: revisión humana del diff; después fusionar `development` → `master`.
  - Verification: `npm run test:e2e` y `CI=1 npm run test:e2e:ci` pasan 5/5; el smoke confirma CSP con `upgrade-insecure-requests` y HSTS. Lint sin errores (1 warning preexistente en Footer), typecheck, build normal y build E2E de 29 páginas pasan.
  - Note: la causa verificada no era el CSP sino reutilizar un servidor viejo y compartir `.next` entre desarrollo y producción. La implementación `c1e7ea3` aísla E2E en `.next-e2e` y puerto 3100 sin debilitar headers.
  - Acceptance: el smoke del cotizador pasa en el flujo local/CI representativo, los headers de producción conservan su intención de seguridad y las verificaciones relacionadas quedan documentadas.

- [ ] T-022 — Unificar la arquitectura y el lenguaje de los CTAs de la home
  - Owner: Valen
  - Agent: Cursor Grok
  - Scope: `components/conversion/**`, `components/sections/Navbar.tsx`, `components/sections/Hero.tsx`, `components/sections/CTASection.tsx`, `components/sections/FeaturedDestinations.tsx`, `components/sections/QuoteModal.tsx`, `.csdd/todo.md`, `.csdd/specs.md`
  - Target: `development`
  - Landing: `development`
  - Updated: 2026-07-18
  - Depends on: T-021.
  - Note: primaria `Armar viaje` / secundaria `Escribinos por WhatsApp` en Navbar, Hero, CTA final, banner y cards de destinos (`openModal(name)` en cards); SLA con horario; SpecialPromo fuera de alcance. Modal submit sigue `Cotizar por WhatsApp`.
  - Verification: lint y typecheck; teclado en par primario/secundario; preselección desde card abre paso 2 del cotizador.
  - Acceptance: cada CTA anticipa correctamente su resultado, la misma intención conserva el mismo nombre y los dos caminos pueden completarse con teclado en desktop y mobile.

## Blocked

## Pending

### Visual, conversión y motion

- [ ] T-023 — Convertir la presencia humana en el aeropuerto en la firma visual de la home
  - Owner: Valen
  - Updated: 2026-07-18
  - Depends on: T-022.
  - Note: articular Hero, TrustBar y AboutUs alrededor de “personas reales dentro del Aeropuerto de Córdoba”, usando las fotos reales del equipo y el local como evidencia temprana. Conservar Elaine Sans, Zalando Sans y la paleta petróleo/dorado/lima; evitar recursos genéricos de aviación que cualquier agencia podría usar.
  - Acceptance: las primeras dos pantallas comunican ubicación física, atención humana y salida desde Córdoba; existe una composición coherente para desktop y mobile y la firma sigue siendo reconocible sin animación.

- [ ] T-024 — Implementar un sistema de motion mínimo y estratégico
  - Owner: Valen
  - Updated: 2026-07-18
  - Depends on: T-021 y T-023.
  - Note: reemplazar el reveal uniforme de secciones por un máximo de dos o tres momentos con propósito: apertura breve del hero, gesto propio del bloque humano y microinteracciones simples. Calmar el marquee, eliminar combinaciones repetidas de lift + zoom + sombra y resolver las clases de animación declaradas pero ausentes en SpecialPromo sin sumar una librería salvo necesidad demostrada.
  - Acceptance: el contenido es visible por defecto aunque JavaScript falle; la secuencia principal no supera aproximadamente 600 ms; sólo se animan `transform`/`opacity` o superficies pequeñas justificadas; `prefers-reduced-motion` produce una experiencia estática completa.

- [ ] T-025 — Reducir la repetición visual y pulir el ritmo completo de la home
  - Owner: Valen
  - Updated: 2026-07-18
  - Depends on: T-022 a T-024.
  - Note: revisar ValueProposition, destinos, testimonios, AboutUs, Services, Instagram, FAQ, promo y cierre para que no compartan por reflejo la misma combinación de card, radio, borde y sombra. Conservar cards donde aportan una affordance real y variar composición, densidad y pausas sin alterar el contenido comercial aprobado.
  - Acceptance: la home mantiene jerarquía y conversión, elimina los cuatro anti-patrones accionables de la auditoría Impeccable y conserva una lectura clara desde 390 px hasta desktop amplio.

- [ ] T-026 — Cerrar la mejora visual con QA responsive, accesible y de rendimiento
  - Owner: Valen
  - Updated: 2026-07-18
  - Depends on: T-021 a T-025.
  - Note: verificar la home completa en desktop y mobile, navegación por teclado, focus visible, modales, `prefers-reduced-motion`, contenido sin JavaScript, hover/touch, estabilidad visual y ausencia de motion costoso. Ejecutar lint, typecheck, build y smokes relevantes sin ampliar la suite de forma desproporcionada.
  - Acceptance: no quedan bloqueos P0/P1 de la crítica, no hay contenido oculto por fallos del reveal y la experiencia reducida conserva toda la información y conversión.

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

## Recently Completed

Retention: 12

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
  - Note: baseline implementado: ESLint flat + `typecheck`, Playwright y CI en `.github/workflows/ci.yml`. Una regresión de entorno descubierta en el smoke del cotizador se sigue por separado en T-020; T-018 conserva el cierre de la capacidad base y no afirma que el follow-up esté resuelto.

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
