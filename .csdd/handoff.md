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

Datos canónicos en `specs.md`. Pedido de reseñas / `g.page` / QR → T-003.

---

## T-003 — Prueba social (implementada; pendiente review)

**Estado:** citas + atribución Google en `development`. Valen revisa UI/código antes de merge a `main`. Scope de escritura liberado.

### Hecho

- `lib/testimonials-data.ts`: Matias Manzanelli, Magalí Flores, Denisse (textos literales; typos de Denisse intactos). `destination`/`date` opcionales.
- `Testimonials.tsx`: grilla activa; por cita “Reseña en Google” → Maps; CTAs “Dejar reseña” + “Ver en Maps”; copy “Reseñas reales publicadas en Google…”.
- Decisión de formato: citas curadas con atribución (no widget/embed). Google no ofrece iframe oficial de reseñas.

### Rareza Maps (sigue)

Rating/conteo público vs lista vacía en detalle. Chequeos: incógnito, que un pasajero abra su reseña, responder desde GBP. No bloquea la web.

### Next (post-merge / operativo)

1. Valen: review en local + merge `development` → `main` si OK.
2. Seguir pidiendo reseñas (`g.page` / QR); meta suave ~10+ cuando Maps liste detalle.
3. Cuando Maps muestre detalle: el link “Ver en Maps” / “Reseña en Google” gana más peso verificable.

### Mensaje para pedir reseña (WhatsApp / oral)

> Hola! Gracias por viajar con 787 Rumbos.
> Si te sirvió nuestra atención, ¿nos dejás una reseña en Google? Nos ayuda muchísimo:
> https://g.page/r/CZ_gdDN4llrIEBI/review
> Sin presión y solo si te nace. ¡Gracias!

(Sin incentivos, sin pedir 5 estrellas, sin texto dictado.)

### QR en el local

Usar `public/qr-resenas-787.png` (impresión / mostrador). Apunta al mismo `g.page/.../review`.

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
