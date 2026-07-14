# Handoff

## T-012 — Acompañamiento (cerrada)

**Estado:** completada. Política en `specs.md`; copy alineado en hero, AboutUs, ValueProp, FAQ, footer y schema.

### Preguntas para agencieros (no bloquean T-012)

1. **Reembolsos / cancelaciones:** ¿hay política escrita (plazos, quién gestiona, qué cubre la agencia vs proveedor)? ¿Cuándo conviene publicarla?
2. **Reclamos formales:** ¿canal y pasos si un pasajero quiere reclamar por escrito (más allá de WhatsApp)?
3. **Exclusiones FAQ:** ¿está bien el texto actual (no guardia 24/7, no reemplazan AssistCard/aerolínea, sin garantía de reubicación/reembolso) o falta/sobra algo?
4. **“Salida acompañada”** (nota en catálogo): ¿significa guía/coordinador en destino, o solo seguimiento remoto de la agencia?
5. **GBP / fotos (T-002):** ¿cuándo pueden verificar la ficha y pasar fotos reales del local/equipo?

Cuando haya respuestas de 1–2, abrir tarea o ampliar FAQ/legal; no reabrir T-012 solo por eso.

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
