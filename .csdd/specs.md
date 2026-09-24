# 787 Rumbos — Especificaciones vigentes

> **Última actualización:** 2026-09-23
> **Estado:** la base del producto está implementada. El cluster indexable de
> **pasajes aéreos** (issue #11) está publicado e interlinkeado; quedan medición
> de CTAs (T-036) y priorización de más aerolíneas (T-037). En paralelo, la ola
> de performance de la home sigue con auditoría de HTML inicial (issue #16 /
> T-039) y re-medición Lighthouse/CWV (T-029). El baseline de seguridad HTTP,
> higiene de dependencias y CI/smoke está implementado. El catálogo y la promo
> destacada viven en Payload CMS (T-008, D-006).

El estado operativo vive en [todo.md](./todo.md). El diagnóstico SEO y de
producto que sirve de contexto, pero no de lista de trabajo activa, se
conserva en [../docs/marketing-growth-audit.md](../docs/marketing-growth-audit.md).

## Negocio y propuesta de valor

787 Rumbos es una agencia de viajes de Córdoba, Argentina, con atención humana
por WhatsApp. La web debe captar consultas calificadas, reforzar confianza y
guiar al usuario hacia ese canal; no reemplaza la atención comercial humana.

- Mix comercial actual: los **pasajes aéreos** son la principal línea de la
  agencia; también se ofrece **asistencia al viajero** y **paquetes turísticos**,
  que siguen siendo una línea visible y válida en la web. La arquitectura
  indexable debe reflejar esa prioridad sin borrar el catálogo de destinos.
- Frase operativa hacia la que se apunta el cluster de aéreos: venta de pasajes
  aéreos de múltiples aerolíneas, con atención humana y presencial en el
  Aeropuerto de Córdoba.
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
| Teléfono de agencia (principal) | 0351 768-8623 (`+54 9 351 768-8623`) — CTAs, schema, NAP, GBP (`AGENCY_PHONE`) |
| Línea de urgencias (viaje en curso) | Mismo número que agencia (`URGENT_PHONE` = `AGENCY_PHONE`). Canal único oficial; no publicar números personales. |
| Google Maps / GBP | [maps.app.goo.gl/ZnVX6SQ7UtDXgbpm7](https://maps.app.goo.gl/ZnVX6SQ7UtDXgbpm7) (place `787 Rumbos`) |
| Coordenadas (schema) | `-31.3172806, -64.2131382` |
| Place key (Maps) | `0x94329becff1264df:0xc85a96783374e09f` · feature `/g/11nr4bc4fc` |
| Reseñas (escribir) | [g.page/r/CZ_gdDN4llrIEBI/review](https://g.page/r/CZ_gdDN4llrIEBI/review) (`GOOGLE_WRITE_REVIEW_LINK`) |
| QR reseñas | `public/qr-resenas-787.png` (`GOOGLE_REVIEW_QR_SRC`) |

Canal público principal: WhatsApp de agencia (`AGENCY_PHONE` en `lib/constants.ts`).
`URGENT_PHONE` apunta al mismo número; el contacto público queda unificado en
+54 9 351 768-8623 (número oficial de la agencia). No publicar números personales
en CTAs, NAP, schema ni citaciones. Footer, schema, Google Business Profile y
citaciones deben reflejar el NAP canónico de la tabla. El enlace de Maps del sitio
(`GOOGLE_MAPS_LINK`) debe apuntar a la ficha de **787 Rumbos**, no a una búsqueda
genérica del aeropuerto.

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
- En la home, “Próximas salidas desde Córdoba” muestra cuatro destinos con
  salidas vigentes. El orden es cantidad de fechas distintas consultables y, ante empate,
  la salida más próxima. Varios programas el mismo día cuentan como una fecha.
  No hay una lista fija de slugs. Cada tarjeta muestra la salida más cercana (D-004).
- Los cupos confirmados de enero 2027 (Salvador, Morro de São Paulo, Praia do Forte
  e Imbassaí), fin de año 2026 (Salvador, Río y Punta Cana) y octubre 2026
  (Punta Cana y Bayahibe) están en el catálogo. En esos cupos la ciudad de salida
  puede ser Córdoba o Ezeiza y se confirma al consultar. El solo aéreo a Salvador
  de enero es precio final USD 850. El crucero Costa Serena no se publica (D-005).
- Cluster de pasajes aéreos (D-001 / D-002, issue #11): rutas indexables bajo
  `/aereos` (hub) y `/aereos/{aerolinea}-cordoba` (landings). Primera landing:
  `/aereos/latam-cordoba`. Datos en `lib/airlines-data.ts`; layouts
  `AereosHub` / `AirlineLanding`; solo aerolíneas con `published: true` se
  generan en build. Cada landing de aerolínea debe dejar explícito que
  787 Rumbos es **agencia independiente**, no oficina oficial de la marca,
  salvo autorización comercial documentada. Contenido propio mínimo: H1/metadata
  de compra/asesoramiento, qué gestiona la agencia, presencia en el aeropuerto,
  horarios/ubicación, FAQ útil, CTA WhatsApp, breadcrumbs/schema válidos e
  interlinking al hub (y a asistencia/contacto cuando existan). No doorway
  pages ni copy corporativo de terceros. La home **no** se rediseña por esta
  ola: solo enlaces y retoques menores de copy (ver D-001). Hub y landings
  `published` están en el sitemap (`app/sitemap.ts`). Interlinking desde
  nav, footer y tile de Pasajes Aéreos hacia `/aereos` (T-035).
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
- El motion de la home es mínimo y estratégico (sin librería de animación):
  apertura breve del copy del hero (`.motion-hero-enter`), un gesto de asiento
  del collage en AboutUs (`.motion-about-settle`, solo `transform`) y
  microinteracciones de feedback (p. ej. `active:scale` en CTAs). En desktop,
  el Navbar oculta su par de CTAs mientras `#hero` está a la vista y los revela
  al scrollear fuera (y los vuelve a ocultar al regresar), para no duplicar el
  primer viewport; mobile mantiene los CTAs en el menú. Sin Tab fantasma
  (`inert`). No hay
  scroll-reveal uniforme por sección (`ScrollReveal` retirado): ese patrón
  oculta contenido y se siente genérico. El contenido permanece legible sin
  JavaScript. El marquee de partners existe por overflow y corre más lento;
  con `prefers-reduced-motion` se detiene. En cards de la home se evita el
  stack repetido lift + zoom + sombra; hovers quedan en color/borde u opacity.
  Entradas de modal (SpecialPromo) usan keyframes CSS de opacity/transform.
  La secuencia principal no supera ~600 ms; `prefers-reduced-motion` deja la
  experiencia estática.
- El pulido visual de la home reduce la repetición de cards, radios, bordes y
  sombras: FAQ e Instagram van más planos; el banner intermedio de destinos es
  una franja quieta (el closer petroleum queda en CTASection); ValueProposition
  conserva tres cards sin side-tab dorado ni sombra pesada; Services conserva
  tiles de catálogo. Se preservan identidad petróleo/dorado/lima, tipografías y
  el contenido comercial verificable.
- Las rutas estáticas se revalidan como máximo cada 24 horas mediante ISR para
  recalcular contenido dependiente de fechas sin convertir el sitio en renderizado
  dinámico ni sumar infraestructura. La primera visita posterior al vencimiento
  puede recibir la versión en caché mientras Next regenera la siguiente.
- La interfaz debe seguir siendo responsive, accesible por teclado y respetar
  `prefers-reduced-motion`.
- Vercel Analytics es la medición disponible actualmente. GA4 y eventos
  detallados de WhatsApp solo se incorporan si existe una necesidad operativa de
  embudos, campañas o atribución más fina.

## Gestión de contenido (CMS)

El catálogo de destinos y la promo destacada se leen de Payload (T-008, D-006).
El seed deja `priceValidUntil` vacío: sin vigencia el monto sigue visible y el
render coincide con el catálogo anterior.

- Roles: `admin`, `encargado` y `agente`. Solo `admin` crea, edita y borra
  usuarios y cambia roles. Cada usuario edita su perfil (nombre y contraseña)
  y no se cambia el rol a sí mismo. Borrar destinos: `admin`. Borrar imágenes:
  `admin` o `encargado`. El panel lo abre cualquier usuario con rol.
- Flujo mixto, sin autosave. Un `agente` que crea un destino no lo publica: queda
  en borrador. Sobre un destino ya publicado, publica directo solo campos
  operativos (salidas, precio, moneda, nota, vigencia y la marca de revisión).
  Si al publicar cambió otra cosa, se rechaza el guardado: tiene que usar
  borrador y avisarle a un encargado. Ese borrador marca `pendingApproval`.
  `encargado` y `admin` publican cualquier cambio.
- La promo destacada es un global con borradores. La leen todos los roles; la
  publican `encargado` y `admin`. `endsAt` es AAAA-MM-DD: la barra se ve ese día
  y se oculta al siguiente. Si hay precio, al publicar hace falta
  `priceValidUntil` de hoy o posterior (el seed no corre esta validación). Si
  esa fecha vence, la barra sigue hasta `endsAt` pero el monto pasa a
  «Consultá precio actualizado» y se ocultan la nota y los impuestos.
- Al publicar un destino, si hay precio en la ficha o en una salida no agotada,
  hace falta `priceValidUntil` de hoy o posterior. Una salida nueva o modificada
  no puede estar en el pasado; las que ya estaban y no se tocan siguen. El slug
  es único y kebab-case; cambiar el de un publicado lo hace un encargado o admin.
  La imagen exige texto alternativo. Cada guardado humano estampa
  `lastReviewedAt` y `reviewedBy`. El seed no corre estas validaciones.
- Si la vigencia venció (la de la salida, si tiene; si no, la del destino), la
  UI no muestra el monto y dice «Consultá precio actualizado».
- «Para revisar» lista precios vencidos o que vencen en 7 días, publicados con
  precio y sin vigencia, sin salidas activas, sin revisión hace 30 días o más,
  y borradores pendientes de aprobación.
- Publicar revalida al instante con `revalidateTag` (`catalog` y `promo`). El
  ISR de 24 horas se mantiene para el resto del contenido que depende de la fecha.
- En Vercel hacen falta `DATABASE_URI` (Neon), `PAYLOAD_SECRET` y
  `BLOB_READ_WRITE_TOKEN` (Vercel Blob). El build de producción corre
  `payload migrate` antes de `next build`. El seed de producción se corre una vez.

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
- La imagen social canónica es `public/og-image.jpg` (1200×630, &lt;500 KB),
  referenciada por `openGraph` y `twitter` en `app/layout.tsx`. Regenerar con
  `node scripts/generate-og-image.mjs` si cambia marca o foto base.
- Identidad de head: `theme-color` `#0b4058`; favicons `favicon.svg` +
  `favicon-32x32.png`; manifest `site.webmanifest` (display `browser`, sin PWA
  offline). No publicar `twitter:site` sin handle oficial de X confirmado.
- El apex `787rumbos.com.ar` debe redirigir de forma **permanente** (301/308)
  a `www.787rumbos.com.ar` (configuración de dominio en Vercel).

## Calidad, seguridad y verificación

El producto es un sitio de captación (contenido + CTAs a WhatsApp). No hay pagos
en la web. Payload autentica a los agencieros (usuarios con roles), con Postgres
y secretos de aplicación; `/admin` es `noindex`. El sitio público lee el catálogo
y la promo desde Postgres. La postura de seguridad y testing debe ser proporcional
a esa superficie.

- **Seguridad en alcance:** headers HTTP de endurecimiento en el deploy
  (Next/Vercel), CSP compatible con Analytics y assets propios, políticas de
  framing/referrer/permisos, e higiene de dependencias (auditorías y parches,
  especialmente Next.js). El cotizador no envía datos a un backend propio: arma
  un enlace WhatsApp en el cliente. Con el CMS entran la auth de Payload, los
  secretos `DATABASE_URI`, `PAYLOAD_SECRET` y `BLOB_READ_WRITE_TOKEN` (fuera del
  repo) y el `noindex` de `/admin`.
- **Seguridad fuera de alcance:** WAF dedicado, pentests formales y controles
  pensados para formularios públicos server-side o UGC.
- **JSON-LD:** el `dangerouslySetInnerHTML` usa datos validados del CMS
  (catálogo) o constantes controladas en el repo (hubs, aéreos, FAQ general).
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
  consistencia NAP son la prioridad antes de evaluar pauta paga.
- Si se evalúa pauta, hace falta presencia local verificada y alguna forma
  estable de medir de dónde vienen las consultas. No se agrega medición compleja
  (GA4, embudos, CRM) mientras Vercel Analytics cubra lo necesario.
- El catálogo y la promo destacada están en Payload (D-006). La vigencia del
  precio la controla el CMS. La revisión manual mensual sigue para testimonios,
  hubs, aéreos e Instagram, que todavía no están en el panel.
- El blog y la expansión de FAQs deben responder a demanda validada; evitar
  contenido genérico sin intención de búsqueda. El cluster de aéreos (issue #11)
  cuenta como demanda validada por la línea comercial principal e intención local
  (LATAM Córdoba y similares); no contradice T-006.

## Forma de trabajo y ramas

- `.csdd/` es la fuente de verdad versionada para estado operativo y
  especificaciones; cada verdad debe vivir en el documento que corresponda.
- El trabajo se hace en ramas de feature, con pull requests hacia `master`.
  Valen revisa y mergea los PRs.
- El historial de implementación no se mantiene en el estado activo: Git es la
  fuente para el detalle histórico y el análisis extenso permanece en `docs/`.
