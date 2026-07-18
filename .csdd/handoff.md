# Handoff

## T-012 — Acompañamiento (cerrada)

**Estado:** completada. Política en `specs.md`; copy alineado en hero, AboutUs, ValueProp, FAQ, footer y schema.

### Preguntas para agencieros (no bloquean T-012)

1. **Reembolsos / cancelaciones:** ¿hay política escrita (plazos, quién gestiona, qué cubre la agencia vs proveedor)? ¿Cuándo conviene publicarla?
2. **Reclamos formales:** ¿canal y pasos si un pasajero quiere reclamar por escrito (más allá de WhatsApp)?
3. **Exclusiones FAQ:** ¿está bien el texto actual (no guardia 24/7, no reemplazan AssistCard/aerolínea, sin garantía de reubicación/reembolso) o falta/sobra algo?
4. **“Salida acompañada”** (nota en catálogo): ¿significa guía/coordinador en destino, o solo seguimiento remoto de la agencia?
Cuando haya respuestas de 1–2, abrir tarea o ampliar FAQ/legal; no reabrir T-012 solo por eso.

---

## T-002 — Google Business Profile (cerrada)

**Estado:** completada. Ficha verificada; Maps + geo en web. Residual no bloqueante: CTA chat WhatsApp en GBP rechazado (click-to-call + WhatsApp del sitio).

Datos canónicos en `specs.md`. La implementación de prueba social cerró en T-003;
el pedido sostenido de reseñas / `g.page` / QR continúa como operación habitual.

---

## T-020 — Smoke test del cotizador

**Estado:** pendiente y asignada a Codex para una sesión posterior. No hay scope de escritura activo en esta sesión.

### Evidencia para retomar

- `npm run test:e2e`: pasan los cuatro smokes de rutas y falla el del cotizador.
- El build de producción agrega `upgrade-insecure-requests`; Playwright sirve `http://127.0.0.1:3000`, por lo que el navegador intenta cargar assets locales por HTTPS y la página queda sin estilos.
- El cotizador publicado en `https://www.787rumbos.com.ar/` abre correctamente y enfoca el destino; no se observó una regresión equivalente en producción.
- Al resolver, conservar el hardening del deploy, lograr el smoke verde en local/CI y volver a ejecutar lint, typecheck, build y E2E.

---

## T-013 — Catálogo y feed social

**Estado:** implementada en `development`. Permalink del post 3 del feed sigue pendiente (cae al perfil `@787rumbos`).

### Hecho

- Labels de transporte legibles (`getTransportLabel`) en destacados y fichas.
- Instagram: datos en `lib/instagram-posts.ts`; permalinks 1, 2, 4, 5, 6; post 3 → perfil.
- Destacados: `priceNote`, estado sin salidas, CTA “Explorar todos” arriba.
- `/destinos`: badge de próxima salida + transporte; contador secundario “+N más”.
- Formato monetario sin cambios (convención de agencia).

### Pendiente menor (no bloquea cierre)

- Cuando Valen encuentre el post 3, añadir `permalink` en `lib/instagram-posts.ts` (id: 3).
