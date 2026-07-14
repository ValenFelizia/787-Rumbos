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

## T-003 — Prueba social (activa)

**Estado:** reclamada. Sección en home activa sin mocks; esperando primeras reseñas reales.

### Hecho en web

- Sección después de destacados: CTA “Dejar reseña en Google”
- Datos: `lib/testimonials-data.ts` (vacío) → al cargar entradas autorizadas se muestran solas
- Links en `lib/constants.ts`:
  - Ficha Maps: `GOOGLE_MAPS_LINK` / `GOOGLE_REVIEWS_LINK` → `https://maps.app.goo.gl/ZnVX6SQ7UtDXgbpm7`
  - Escribir reseña: `GOOGLE_WRITE_REVIEW_LINK` → `https://g.page/r/CZ_gdDN4llrIEBI/review`
  - QR (mismo destino): `public/qr-resenas-787.png` → `GOOGLE_REVIEW_QR_SRC`

### Mensaje para pedir reseña (WhatsApp / oral)

> Hola! Gracias por viajar con 787 Rumbos.
> Si te sirvió nuestra atención, ¿nos dejás una reseña en Google? Nos ayuda muchísimo:
> https://g.page/r/CZ_gdDN4llrIEBI/review
> Sin presión y solo si te nace. ¡Gracias!

(Sin incentivos, sin pedir 5 estrellas, sin texto dictado.)

### QR en el local

Usar `public/qr-resenas-787.png` (impresión / mostrador). Apunta al mismo `g.page/.../review`.

### Cuando lleguen reseñas

1. Curar 2–3 con autorización (nombre, destino, cita breve).
2. Agregar a `lib/testimonials-data.ts`.
3. Casos fuertes: acompañamiento en imprevistos / documentación especial.

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
