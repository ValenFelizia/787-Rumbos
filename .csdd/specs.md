# 787 Rumbos — Especificaciones vigentes

> **Última actualización:** 2026-07-18
> **Estado:** la base del producto está implementada. Se priorizan la operación
> comercial, la vigencia del contenido y el crecimiento local antes de nuevas
> funcionalidades. El baseline de seguridad HTTP, higiene de dependencias y
> CI/smoke está implementado. Los E2E de producción usan artefactos aislados
> para no colisionar con un servidor de desarrollo local.

El estado operativo vive en [todo.md](./todo.md). El análisis de mercado y
crecimiento que sirve de contexto, pero no de lista de trabajo activa, se
conserva en [../docs/marketing-growth-audit.md](../docs/marketing-growth-audit.md).

## Negocio y propuesta de valor

787 Rumbos es una agencia de viajes de Córdoba, Argentina, con atención humana
por WhatsApp. La web debe captar consultas calificadas, reforzar confianza y
guiar al usuario hacia ese canal; no reemplaza la atención comercial humana.

- La oficina se encuentra en el hall de arribos del Aeropuerto Internacional
  Ingeniero Aeronáutico Ambrosio Taravella, dentro del local oficial de Vía
  Bariloche.
- El servicio combina viajes emisivos, vuelos, paquetes y pasajes de ómnibus del
  Grupo Vía Bariloche, que incluye, entre otras empresas, Vía Tac y El Valle.
  En superficies de alta jerarquía como el hero se pueden mencionar solo Vía
  Bariloche y Vía Tac por reconocimiento de marca y claridad; FAQ y Servicios
  pueden detallar también El Valle.
- La jerarquía del mensaje debe partir de diferenciales verificables: presencia
  física en el aeropuerto, experiencia en transporte y oferta aérea + terrestre.
- La atención humana y el acompañamiento deben explicarse con evidencia y un
  alcance operativo concreto. “Sin bots” / “no un bot” puede vivir como detalle
  secundario (p. ej. FAQ), no como promesa central ni en hubs/hero: en agencias
  de este tamaño la atención humana es la norma, no el diferencial frente a pares.
- Toda promesa pública de tiempo de respuesta o asistencia durante el viaje debe
  corresponder a una operación sostenible y explicitar, donde corresponda, canal,
  horarios, incidencias cubiertas y límites. El sitio no debe sugerir soporte 24/7
  si ese servicio no existe.
- Alcance del acompañamiento (cerrado en T-012): pre + durante + post. El post
  público es mediación/ayuda con proveedores (aerolínea, hotel, asistencia), sin
  política publicada de reembolsos. Durante el viaje se orienta y se gestiona lo
  vinculado a la reserva (más orientación general); no se promete resolver el 100%
  de cualquier problema. Copy preferido: “acompañamiento cercano de punta a punta”,
  “respaldo de principio a fin” (arco temporal, no cobertura absoluta), “mismo equipo
  de punta a punta” (no “la misma persona”). Home: no bloque dedicado de acompañamiento
  en propuesta de valor; detalle en FAQ + AboutUs; casos extraordinarios vía testimonios.
- Límites públicos (FAQ): no guardia médica 24/7, no reemplazo de AssistCard/aerolínea,
  no garantía de reubicación ni reembolso. Política formal de reclamos/reembolsos:
  aplazada hasta definición operativa de la agencia.
- Horario oficial de oficina (aeropuerto): lunes a viernes 8:30–18:00; sábados
  8:30–13:00; domingos cerrado de local. Constante canónica: `OFFICE_HOURS` en
  `lib/constants.ts`. Publicado en FAQ, footer y schema. WhatsApp informal fuera de
  horario puede ocurrir; no se publica como cobertura 24/7.
- SLA comercial: en horario de atención, respuesta en menos de 2 horas vía WhatsApp
  de agencia (`AGENCY_PHONE`). Hero anclado al horario. Imprevistos en viaje: línea
  de urgencias (`URGENT_PHONE`) sin tiempo prometido; visible en footer/FAQ, no en CTAs.

## Datos oficiales y contenido comercial

Los datos NAP publicados en footer, schema y Google Business Profile deben
mantenerse consistentes:

| Dato | Valor canónico |
| --- | --- |
| Nombre comercial | 787 Rumbos |
| URL pública preferida | `https://www.787rumbos.com.ar/` (`www` es el host canónico) |
| Dirección | Av. La Voz del Interior 8500, Córdoba, Argentina |
| Referencia | Hall de arribos, dentro del local oficial de Vía Bariloche |
| Código postal | X5147XAA |
| Teléfono de agencia (principal) | 0351 344-8724 (`+54 9 351 344-8724`) — CTAs, schema, NAP, GBP |
| Línea de urgencias (viaje en curso) | 0351 615-7398 (`+54 9 351 615-7398`) — footer y FAQ; no CTAs comerciales |
| Google Maps / GBP | [maps.app.goo.gl/ZnVX6SQ7UtDXgbpm7](https://maps.app.goo.gl/ZnVX6SQ7UtDXgbpm7) (place `787 Rumbos`) |
| Coordenadas (schema) | `-31.3172806, -64.2131382` |
| Place key (Maps) | `0x94329becff1264df:0xc85a96783374e09f` · feature `/g/11nr4bc4fc` |
| Reseñas (escribir) | [g.page/r/CZ_gdDN4llrIEBI/review](https://g.page/r/CZ_gdDN4llrIEBI/review) (`GOOGLE_WRITE_REVIEW_LINK`) |
| QR reseñas | `public/qr-resenas-787.png` (`GOOGLE_REVIEW_QR_SRC`) |

Canal público principal: WhatsApp de agencia (`AGENCY_PHONE` en `lib/constants.ts`).
La línea de urgencias (`URGENT_PHONE`) es un celular del equipo para imprevistos con
viaje en curso; no debe monopolizar cotización ni presentarse como “administración”.
Footer, schema, Google Business Profile y citaciones deben reflejar estos roles.
El enlace de Maps del sitio (`GOOGLE_MAPS_LINK`) debe apuntar a la ficha de
**787 Rumbos**, no a una búsqueda genérica del aeropuerto.

Precios, salidas, disponibilidad, promociones, fotos y testimonios deben ser
reales, vigentes y verificables. Las promociones con fecha de finalización deben
ocultarse al vencer. No deben presentarse testimonios ficticios como si fueran
reales. Las solicitudes de reseñas deben dirigirse a clientes reales, sin
incentivos, selección de opiniones positivas ni texto dictado. No existe un
umbral mínimo de cantidad de reseñas en Google para curar testimonios en la web:
con pocas reseñas auténticas y autorización basta para publicarlas (p. ej. 2–3).
El crecimiento del volumen en GBP sigue en paralelo como señal de autoridad local.
Cada testimonio en la web debe poder atribuirse a una reseña o cliente real
(idealmente con enlace o mención de origen Google) para no leerse como fabricado.
El formato visible de precios sigue la convención comercial de la agencia
(`USD`/`$` + monto, alineada a Instagram); no se impone un formateador monetario distinto.
El feed social de la home funciona como prueba de actividad y acceso a Instagram,
no como catálogo sincronizado. Para mantenerlo lightweight se priorizan captions
evergreen y una revisión manual mensual dentro de T-004; no se agrega API de Meta,
CMS ni scraping solo para sostener esa sección.

## Comportamiento vigente del producto

- La landing ofrece CTAs de WhatsApp y un cotizador de tres pasos para
  preclasificar las consultas; los CTAs pueden preseleccionar el destino.
- El catálogo incluye rutas dinámicas de destinos, SEO específico por destino,
  FAQ con schema `FAQPage`, highlights, breadcrumbs, destinos relacionados y
  sitemap actualizado.
- Los hubs de Brasil, Caribe, Argentina en bus y salidas grupales desde Córdoba
  están publicados y enlazados con el catálogo y las fichas de destino.
- La home publica una sección de prueba social cerca del catálogo destacado.
  Los testimonios curados viven en `lib/testimonials-data.ts` (hoy: 3 reseñas
  Google autorizadas). Cada cita con `source: "google"` muestra atribución
  “Reseña en Google” hacia la ficha Maps, más CTAs “Dejar reseña” y “Ver en Maps”.
  Si el array queda vacío, la sección vuelve al estado solo-CTA sin ejemplos
  ficticios. No hay umbral mínimo de volumen en Maps para publicar citas
  autorizadas. El pedido sostenido de reseñas en Google sigue en paralelo
  (autoridad local), sin incentivos ni texto dictado. No se usan widgets de
  terceros ni embeds no oficiales de reseñas Google.
- En la home, el hero y la propuesta de valor priorizan la oficina en el
  Aeropuerto de Córdoba, la experiencia en transporte y la oferta aérea +
  terrestre. La sección de Servicios precede al feed social (“Comunidad”).
- La dirección visual aceptada prioriza la presencia en el Aeropuerto de Córdoba
  como firma diferencial: el hero puede conservar una imagen atmosférica de
  viaje; la evidencia temprana del local y el equipo vive en TrustBar (franja de
  presencia + credenciales) y AboutUs colocado antes del catálogo. FIT se
  presenta como feria/industria, no como aeropuerto. La experiencia debe seguir
  siendo reconocible aun sin animación.
- La home debe distinguir de forma consistente dos caminos de conversión: una
  acción primaria que abre el cotizador y una acción secundaria explícita para
  WhatsApp directo. Labels canónicos: primaria `Armar viaje`, secundaria
  `Escribinos por WhatsApp`; en destinos destacados el detalle conserva su link
  y `Armar viaje` abre el cotizador con preselección. El submit del cotizador
  es `Cotizar por WhatsApp` (sí termina en WA). La misma intención conserva el
  mismo nombre y cada CTA debe anticipar correctamente su resultado.
  El SLA visible junto a los CTAs de conversión es: “En horario de atención,
  respondemos en menos de 2 horas”.
- El motion de la home debe ser mínimo y estratégico: una apertura breve del
  hero, un gesto propio para la prueba humana y microinteracciones simples. No se
  oculta contenido por defecto a la espera de JavaScript, no se añade movimiento
  continuo sin una necesidad de overflow o estado y no se incorpora una librería
  de animación mientras CSS y APIs web nativas alcancen.
- El pulido visual debe reducir la repetición automática de cards, radios,
  bordes, sombras y elevaciones, preservando la identidad petróleo/dorado/lima,
  las tipografías de marca y todo el contenido comercial verificable.
- Las rutas estáticas se revalidan como máximo cada 24 horas mediante ISR para
  recalcular contenido dependiente de fechas sin convertir el sitio en renderizado
  dinámico ni sumar infraestructura. La primera visita posterior al vencimiento
  puede recibir la versión en caché mientras Next regenera la siguiente.
- La interfaz debe seguir siendo responsive, accesible por teclado y respetar
  `prefers-reduced-motion`.
- Vercel Analytics es la medición disponible actualmente. GA4 y eventos
  detallados de WhatsApp solo se incorporan si existe una necesidad operativa de
  embudos, campañas o atribución más fina.

## Restricciones técnicas

- Usar Next.js, React, Tailwind y APIs web nativas antes de añadir dependencias.
  Una dependencia nueva debe resolver una necesidad clara que no justifique una
  implementación liviana.
- Usar `next/image` y assets reales, optimizados y con texto alternativo
  descriptivo. No usar placeholders en contenido publicado.
- Mantener Elaine Sans para títulos, CTAs y texto destacado; Zalando Sans para
  cuerpo y etiquetas.
- Conservar la identidad visual premium: azul petróleo, acentos dorados y verde
  limón, con contraste suficiente.
- Los metadatos, canonical, Open Graph, robots, sitemap y datos estructurados
  deben usar `https://www.787rumbos.com.ar` y seguir alineados con las páginas
  que se publiquen.

## Calidad, seguridad y verificación

El producto es un sitio de captación (contenido estático + CTAs a WhatsApp). No
hay autenticación, base de datos, APIs propias que persistan datos ni pagos en
la web. La postura de seguridad y testing debe ser proporcional a esa superficie.

- **Seguridad en alcance:** headers HTTP de endurecimiento en el deploy
  (Next/Vercel), CSP compatible con Analytics y assets propios, políticas de
  framing/referrer/permisos, e higiene de dependencias (auditorías y parches,
  especialmente Next.js). El cotizador no envía datos a un backend propio: arma
  un enlace WhatsApp en el cliente.
- **Seguridad fuera de alcance (salvo que cambie la arquitectura):** WAF
  dedicado, hardening de auth/sesiones, rate limiting de APIs propias, pentests
  formales, secret scanning de app (hoy no hay secretos de aplicación), y
  controles pensados para formularios server-side o UGC.
- **Si en el futuro aparece CMS, formularios con backend o datos de usuarios:**
  reabrir el alcance (validación/sanitización server-side, secretos, privacidad
  operativa y tests de esos contratos). El `dangerouslySetInnerHTML` de JSON-LD
  solo es aceptable mientras el JSON provenga de datos controlados en el repo.
- **Testing en alcance:** CI que ejecute lint, typecheck y build; smoke tests de
  rutas y CTAs críticos. Tests unitarios solo para utilidades puras con riesgo
  de regresión real. Los smokes de producción deben construir en `.next-e2e`,
  servirse en un puerto dedicado y verificar el cotizador con los headers de
  seguridad del deployment HTTPS intactos.
- **Testing fuera de alcance por ahora:** cobertura alta de componentes,
  snapshots masivos, E2E exhaustivos de todo el catálogo y suites de
  regresión visual.

## Operación y evolución

- Google Business Profile, fotos del local/equipo, reseñas reales, citaciones y
  consistencia NAP son la prioridad antes de aumentar inversión publicitaria.
- La pauta paga requiere GBP verificado y seguimiento estable de leads.
- El CMS se evalúa únicamente cuando mantener `lib/destinations-data.ts` a mano
  resulte una limitación real.
- Catálogo, promociones y feed social se revisan manualmente una vez por mes;
  automatizar ese circuito solo se evalúa si la carga operativa deja de ser razonable.
- El blog y la expansión de FAQs deben responder a demanda validada; evitar
  contenido genérico sin intención de búsqueda.

## Forma de trabajo y ramas

- `.csdd/` es la fuente de verdad versionada para estado operativo y
  especificaciones; cada verdad debe vivir en el documento que corresponda.
- `development` es la rama de trabajo. Las integraciones hacia `master` las
  realiza manualmente el usuario después de validar los cambios.
- El historial de implementación no se mantiene en el estado activo: Git es la
  fuente para el detalle histórico y el análisis extenso permanece en `docs/`.
