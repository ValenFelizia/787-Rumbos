# 787 Rumbos — Decisiones

> Elecciones consecuentes y su racional. El comportamiento observable queda en
> [specs.md](./specs.md); el estado operativo en [todo.md](./todo.md).

## Accepted

### D-001 — Expansión comercial vía páginas aditivas (issue #11)

- **Status:** Accepted
- **Date:** 2026-07-28
- **Source:** [GitHub #11](https://github.com/ValenFelizia/787-Rumbos/issues/11) + dirección explícita de Valen
- **Decision:** Reposicionar la web hacia el negocio real (pasajes aéreos ~80% de facturación) **añadiendo slugs indexables**, no rediseñando la home. Los paquetes siguen siendo una línea visible y válida; la home conserva ritmo, identidad y estructura actuales.
- **Rationale:** La arquitectura indexable hoy está concentrada en destinos/paquetes. Google Search Console necesita URLs propias para intenções de compra aérea (p. ej. LATAM Córdoba). Tocar poco la home reduce riesgo de regresión visual/conversión y acelera el valor SEO.
- **Home budget (techo duro):**
  - Sí: link en nav, footer y tile de Servicios hacia el hub de aéreos; interlinking; a lo sumo un ajuste menor de copy de apoyo en hero/propuesta de valor.
  - No: reordenar secciones, cambiar sistema visual/motion, convertir el primer viewport en “boletería aérea”, ni bajar el catálogo de paquetes a un rincón.
- **Rejected alternatives:**
  - Rediseño profundo de la home para “parecer” negocio de aéreos.
  - Reemplazar el eje de paquetes en la narrativa pública.
  - Páginas doorway masivas por aerolínea sin contenido propio.
- **Consequences:** El trabajo se descompone en hub + landings de aerolínea + SEO técnico + retoques de enlace; la ola de home visual (T-021→T-028) se considera baseline a preservar.

### D-002 — Arquitectura de URLs para aéreos

- **Status:** Accepted
- **Date:** 2026-07-28
- **Source:** issue #11 (decisiones pendientes) + D-001
- **Decision:** Un solo cluster bajo `/aereos`:
  - `/aereos` — hub de pasajes aéreos (multi-aerolínea, atención en aeropuerto, CTA WhatsApp).
  - `/aereos/{aerolinea}-cordoba` — landing por aerolínea con intención local (primera: `/aereos/latam-cordoba`).
- **Rationale:**
  - “Aéreos” nombra el producto que se vende; evita un segundo hub fino `/aerolineas` que duplicaría intención.
  - El sufijo `-cordoba` alinea con los hubs existentes (`brasil-desde-cordoba`, etc.) y captura búsqueda local.
  - Escala por datos (`lib/` + ruta dinámica o páginas tipadas), no por copy-paste.
- **Rejected alternatives:**
  - Solo `/aerolineas/...` sin hub de producto.
  - `/aereos` + `/aerolineas` en paralelo (riesgo de contenido similar y dilución).
  - Slugs sin “córdoba” en landings locales (pierde la intención que justifica la página).
  - Meter landings de aerolínea bajo `/destinos/` (mezcla catálogo de paquetes con boletería).
- **Constraints:**
  - Cada landing debe declarar con claridad que **787 Rumbos es agencia independiente**, no oficina oficial de la aerolínea (salvo autorización comercial explícita).
  - No publicar rutas/políticas de la aerolínea que caduquen sin dueño de mantenimiento.
  - No crear página de aerolínea sin contenido propio útil (FAQ, qué gestionamos, CTA, ubicación).
- **Revisit when:** Valen aporte el ranking real de aerolíneas post-LATAM, o si Search Console muestre canibalización hub ↔ landing.

## Open / needs human input

Priorización comercial de aerolíneas (Valen, 2026-08-04) — alimenta T-037:

1. **Tier 1 (más ventas):** GOL y LATAM (LATAM ya publicada).
2. **Tier 2:** Avianca y JetSmart.
3. **Tier 3:** el resto (Copa, Air Europa, Arajet, etc.).

Preguntas que **sí bloquean** copy fino / 2ª–3ª landing:

1. ¿Qué trámites puede resolver 787 Rumbos por compañía (emisión, cambios, equipaje, check-in) y cuáles se derivan a la aerolínea? (empezar por GOL al ser la próxima a publicar).
2. ¿Hay relación comercial autorizada con LATAM, GOL u otra que permita un wording más fuerte que “agencia independiente”? Por defecto: independiente.
