# Handoff

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
