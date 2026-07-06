# 787 Rumbos — TODO

> Derivado de `[specs.md](./specs.md)`. Actualizar a medida que avanzamos.
> Convención: `[ ]` pendiente · `[/]` en progreso · `[x]` completado
>
> **Branch activa**: `development` (salvo donde se indique)

---

## Fase 1 — Performance ✅

- [x] **1.1** Activar optimización de imágenes en `next.config.mjs`
  - [x] Eliminar `images: { unoptimized: true }` → reemplazado por `formats: ["image/avif", "image/webp"]`
  - [x] Eliminar `typescript: { ignoreBuildErrors: true }`
  - [x] Build verificado sin errores ✓
- [x] **1.2** Refactorizar hero image
  - [x] Reemplazar `bg-[url('/hero-bg.jpg')]` por `<Image>` de Next.js
  - [x] Agregar `priority`, `fill`, `sizes="100vw"`, `quality={80}`
  - [x] Overlay reemplazado por degradado de marca (`from-[#0b4058]/85`)
  - [x] CTA hero: "Consultar por WhatsApp" → "Armá tu viaje ahora"
  - [x] Micro-copy agregado: "Respondemos en menos de 2 horas"
  - [x] `aria-label` agregado al CTA de WhatsApp del hero
  - [x] Badge genérico "Experiencias a tu medida" eliminado
  - [ ] `placeholder="blur"` con blurDataURL (pendiente — requiere import estático, baja prioridad)
- [x] **1.3** Optimizar imágenes restantes
  - [x] Agregar `sizes` a imagen de "nosotros" — corregido blur (width 64 → 200)
  - [x] Agregar `sizes` + alt mejorado a imágenes de destinos
  - [x] Lazy loading en imágenes below-the-fold (default de Next.js `<Image>`)
- [x] **1.4** Limpiar imágenes no usadas de `/public`
  - [x] Eliminados: placeholder.jpg, placeholder.svg, placeholder-logo.*, placeholder-user.jpg
  - [x] Eliminados: icon.svg, icon-dark-32x32.png, icon-light-32x32.png, apple-icon.png
- [x] **Verificación Fase 1**: Build limpio ✓ · Bundle 106 kB ✓

---



## Fase 2 — Identidad de Marca ✅ (unificada con Fase 4)

- [x] **2.1** Tipografías de marca
  - [x] Copiar Elaine Sans (medium/semibold/bold) y Zalando Sans a `/public/fonts/`
  - [x] Registrar con `next/localFont` en `lib/fonts.ts` con CSS variables
  - [x] Reemplazar Montserrat → Elaine Sans en 13 ocurrencias (títulos, CTAs, headings)
  - [x] Zalando Sans como fuente base de body vía `globals.css`
  - [x] Eliminar imports de Google Fonts de todos los componentes
- [ ] **2.2** Iconografía de marca propia
  - [ ] Copiar iconos de marca a `/public/icons/` y reemplazar Lucide en secciones clave
  - [ ] (Baja prioridad — Lucide funciona bien como fallback)
- [x] **2.3** Paleta de marca como CSS variables
  - [x] Variables `--brand-*` definidas en `:root` de `globals.css`
  - [x] Gradientes de marca como variables CSS

---



## Fase 3 — Arquitectura y Limpieza ✅

- [x] **3.1** Componentización
  - [x] Crear `components/sections/Navbar.tsx`
  - [x] Crear `components/sections/Hero.tsx`
  - [x] Crear `components/sections/ValueProposition.tsx`
  - [x] Crear `components/sections/AboutUs.tsx`
  - [x] Crear `components/sections/FeaturedDestinations.tsx`
  - [x] Crear `components/sections/Services.tsx`
  - [x] Crear `components/sections/Footer.tsx`
  - [x] Crear `lib/constants.ts` (destinos, servicios, links WhatsApp, helper `whatsappDestino()`)
  - [x] Reducir `page.tsx` a < 30 líneas (compositor) — quedó en 30 líneas exactas
  - [x] Build verificado — página visualmente idéntica ✓
- [x] **3.2** Limpieza de dependencias
  - [x] Eliminar todos los archivos en `components/ui/` (57 archivos)
  - [x] Eliminar `components/theme-provider.tsx`, `components.json`, `styles/`, `hooks/`, `lib/utils.ts`
  - [x] Eliminar 127 paquetes npm no usados — de 193 → 66 paquetes
  - [x] Build verificado sin errores ✓
- [x] **3.3** Limpiar `globals.css`
  - [x] 126 líneas de vars shadcn → 45 líneas con paleta de marca
  - [x] Eliminar `@import 'tw-animate-css'` y `@custom-variant dark`

---



## Fase 4 — UI/UX y Diseño ✅

- [x] **4.1** Hero mejorado
  - [x] Overlay → degradado de marca
  - [x] CTA y micro-copy actualizados (hechos en Fase 1)
  - [ ] Parallax sutil (descartado — puede perjudicar mobile y Core Web Vitals)
- [x] **4.2** Destinos mejorados
  - [x] Subtítulo actualizado ("Algunos de los destinos que podemos armar para vos")
  - [x] CTA por tarjeta con mensaje pre-rellenado por destino
- [ ] **4.3** Testimonios (**branch** `feature/testimonials`)
  - [ ] Pendiente hasta tener datos reales de clientes
  - [ ] NO mergear a production hasta tener datos reales
- [x] **4.4** Trust Bar
  - [x] `TrustBar.tsx` debajo del hero (Legajo, Cámara, Financiación, Aeropuerto)
  - [x] Responsive: 2×2 mobile, 4 inline desktop
- [x] **4.5** CTA de cierre
  - [x] `CTASection.tsx` entre Servicios y Footer
  - [x] Copy diferenciado del hero, degradado de marca, elementos decorativos
- [x] **4.6** Animaciones
  - [x] Scroll reveal con IntersectionObserver (`components/ScrollReveal.tsx`)
  - [x] Respeta `prefers-reduced-motion` ✓
  - [x] Una sola animación por elemento (unobserve post-trigger) ✓
- [x] **4.7** Ícono WhatsApp en CTAs
  - [x] `components/icons/WhatsAppIcon.tsx` — SVG oficial (reemplaza avioncito Send/Telegram)
  - [x] Aplicado en Navbar, Hero, FeaturedDestinations, CTASection

---



## Fase 5 — SEO y Meta ✅

- [x] **5.1** Open Graph y meta tags
  - [x] Title y description mejorados con keywords locales
  - [x] Open Graph tags completos (título, descripción, URL, locale, siteName)
  - [x] URL canónica configurada
  - [x] Eliminar `generator: 'v0.app'`
  - [ ] Imagen OG 1200×630px (pendiente — requiere diseño o screenshot de la página)
- [x] **5.2** Robots, sitemap, structured data
  - [x] `public/robots.txt` creado
  - [x] `app/sitemap.ts` — genera `/sitemap.xml` automáticamente en build
  - [x] JSON-LD `TravelAgency` + `LocalBusiness` en `layout.tsx`
- [x] **5.3** Accesibilidad básica
  - [x] `aria-label` en todos los links de WhatsApp/Instagram/AFIP
  - [x] `aria-label` en el `<nav>`
  - [x] Alt texts descriptivos en todas las imágenes
  - [ ] Focus states visibles (pendiente — Fase 6)
  - [ ] Lighthouse Accessibility > 90 (pendiente verificación)

---



## Fase 6 — Mobile-First Polish ✅

- [x] **6.1** Responsive desde 360px — Hero
  - [x] Gradient adaptativo: `bg-gradient-to-t` mobile, `bg-gradient-to-r` desktop (md+)
  - [x] H1: `text-[2rem]` en mobile → `sm:text-4xl` → `md:text-6xl`
  - [x] CTAs: `flex-col` en mobile, `sm:flex-row` en sm+
  - [x] Micro-copy centrado en mobile, alineado a izquierda en sm+
  - [x] Touch targets >= 44px en CTAs principales (`py-3.5`)
- [ ] **6.2** Navbar mobile
  - [ ] Menú hamburguesa (descartado por ahora — la página es una landing de scroll,
    ```
      el CTA de WhatsApp en la navbar es suficiente acceso en mobile)
    ```
  - [ ] Re-evaluar si se agrega navegación por anclas en el futuro
- [x] **6.3** WhatsApp floating button
  - [x] `components/sections/WhatsAppFloat.tsx` — fixed bottom-right, solo mobile (`md:hidden`)
  - [x] Aparece a los 3 segundos (no interrumpe la primera impresión)
  - [x] Se oculta cuando el `<footer>` entra en el viewport (IntersectionObserver)
  - [x] Pulse animation con `motion-safe:animate-ping` (respeta prefers-reduced-motion)
  - [x] `aria-label` correcto para accesibilidad
- [x] **6.4** Focus states y accesibilidad keyboard
  - [x] `:focus-visible` con outline de marca (`--brand-dorado`) en `globals.css`
  - [x] Solo visible en navegación por teclado (no en clicks con mouse)

---



## Post-launch / Futuro (no parte de este sprint)

- [x] **Banner animado de Partners / Aerolíneas (Slider Infinito)**
  - [x] Diseñar el componente `components/sections/PartnersMarquee.tsx`
  - [x] Agregar constantes de partners en `lib/constants.ts` (Aerolíneas, mayoristas de turismo, etc.)
  - [x] Configurar animación de scroll infinito horizontal con CSS puro (keyframe translate en `globals.css`)
  - [x] Ajustar estética premium: logos consistentes en escala de grises/opacidad que pasen a color/100% al hacer hover
  - [x] Optimizar accesibilidad: usar `aria-hidden` en la lista clonada y respetar `prefers-reduced-motion`
  - [x] Definir ubicación óptima (debajo del `TrustBar` para credibilidad temprana, o arriba del `Footer` para cierre)
  - [x] Recopilar y optimizar assets de logos (formato SVG preferentemente o PNG optimizados)
- [ ] Imagen OG 1200×630px (requiere diseño)
- [ ] Testimonios reales (branch `feature/testimonials` lista para cuando lleguen los datos)

---



## Fase 7 — SEO Local y Credibilidad Institucional (Post-V1.0) ✅

- [x] **7.1** Sincronizar Google Business Profile (GBP) con la Web
  - [x] Validar consistencia de datos NAP (Name, Address, Phone) en Footer y JSON-LD con la ficha oficial verificada.
  - [x] Añadir botón de geolocalización tipo "Nuestra oficina" enlazado a Google Maps.
- [x] **7.2** Enlaces Oficiales de Autoridad y Utilidad Local
  - [x] Vincular el logo de la Cámara de Turismo de Córdoba en la `TrustBar` o Footer a su web oficial (`target="_blank"`).
  - [x] Crear sección de "Enlaces de Interés / Links Útiles" en el Footer (Agencia Córdoba Turismo, Cámara de Turismo).
  - [x] Añadir enlace útil al "Estado de Vuelos del Aeropuerto de Córdoba (AA2000)" para captar tráfico orgánico de pasajeros.

---



## Fase 8 — Conversión Interactiva (Quiz/Cotizador) (Post-V1.0) ✅

- [x] **8.1** Asistente de Cotización Rápida
  - [x] Crear un mini-formulario/quiz interactivo de 3 pasos antes de abrir WhatsApp (Destino ➔ Fechas ➔ Pasajeros).
  - [x] Generar mensaje pre-rellenado altamente específico para los dueños de la agencia (ej: "Hola, quiero cotizar un viaje a Río para 2 adultos en Septiembre...").
  - [x] Animaciones y transiciones premium entre pantallas para mantener la experiencia fluida y elegante.

---



## Fase 9A — Confianza, Conversión y UX ✅

> **Origen**: Auditoría de marketing, social proof y UX realizada el 2026-07-04.
> **Objetivo**: Resolver las brechas críticas de confianza legal, social proof y UX
> identificadas antes de expandir a páginas de destinos (Fase 9B).
> **Prioridad**: 🔴 Alta — impacta conversión y credibilidad inmediata.



### 9A.1 — Página Legal y Compliance (`/legal`) ✅

- [x] Crear `app/legal/page.tsx` con:
  - [x] Términos y Condiciones básicos (servicios de intermediación turística)
  - [x] Política de Privacidad (tratamiento de datos, Ley 25.326)
  - [x] Información sobre derecho de arrepentimiento (Ley 24.240)
  - [x] Datos del titular: CUIT, Razón Social, Legajo 20455
- [x] Agregar link a `/legal` en el footer (columna de Enlaces de Interés)
- [x] Agregar metadatos SEO a la página legal (`title`, `description`)



### 9A.2 — Footer: Datos Legales y Defensa del Consumidor ✅

- [x] Agregar al footer (barra inferior, junto a sellos AFIP y Cámara):
  - [x] CUIT y Razón Social visible en texto
  - [x] Legajo 20455 (duplicar desde TrustBar para reforzar credibilidad en zona legal)
  - [x] Botón/link de **Defensa del Consumidor** (`https://autogestion.produccion.gob.ar/consumidores`)
  - [x] Link a la página `/legal` (Términos y Condiciones)



### 9A.3 — Imagen Open Graph (1200×630px) ✅

- [x] Diseñar imagen OG profesional para previews de links:
  - [x] Dimensiones: 1200×630px (formato rectangular para WhatsApp/redes)
  - [x] Contenido: logo 787 Rumbos + paisaje atractivo + texto "Agencia de Viajes en Córdoba"
  - [x] Guardar en `public/og-image.png` (formato original optimizado de alta fidelidad)
- [x] Configurar en `layout.tsx` → `metadata.openGraph.images`
- [x] Verificar preview en WhatsApp y redes sociales



### 9A.4 — Navegación con Anclas + Menú Hamburguesa Mobile ✅

- [x] **Desktop**: agregar links de navegación por anclas en la navbar
  - [x] Links: Inicio, Destinos, Servicios, Contacto
  - [x] Scroll suave (`scroll-behavior: smooth` o JS con `scrollIntoView`)
  - [x] Estilo: links en `text-white/70` con hover `text-white`, coherente con la estética actual
- [x] **Mobile**: menú hamburguesa
  - [x] Icono hamburguesa (3 líneas) que reemplaza los links en pantallas `< md`
  - [x] Panel desplegable con los mismos links + CTAs (Cotizar Viaje, WhatsApp)
  - [x] Animación de apertura/cierre suave (CSS transitions, sin librerías)
  - [x] Cerrar al hacer clic en un link o fuera del menú
  - [x] Implementar sin dependencias npm adicionales (CSS + JS nativo)



### 9A.5 — Sección de Testimonios (estructura lista) ✅

- [x] Crear `components/sections/Testimonials.tsx`:
  - [x] Diseño premium: tarjetas con foto de cliente, nombre, destino visitado, texto del testimonio
  - [x] Layout: carrusel o grid de 3 testimonios en desktop, stack en mobile
  - [x] Estrellas de rating (SVG inline, no librería)
  - [x] Espacio preparado para futuro widget de Google Reviews
- [x] Integrar en `page.tsx` entre Services y CTASection
- [x] **Datos**: usar datos reales cuando estén disponibles (1-2 semanas)
  - [x] Mientras tanto: NO mostrar la sección en producción (comentada en page.tsx)
  - [x] Formato de datos en `lib/constants.ts`: `{ nombre, destino, texto, foto?, rating }`



### 9A.6 — Mejoras JSON-LD y SEO técnico ✅

- [x] Agregar `openingHours` al JSON-LD en `layout.tsx`:
  - [x] `"openingHoursSpecification": { "dayOfWeek": ["Monday"..."Friday"], "opens": "08:00", "closes": "20:00" }`
- [x] Agregar `hasMap` con link a Google Maps
- [x] Revisar `sameAs`: actualmente solo Instagram — agregar más perfiles si existen
- [x] Limpiar import muerto de `Wallet` en `Hero.tsx`



### 9A.7 — Página 404 personalizada ✅

- [x] Crear `app/not-found.tsx`:
  - [x] Diseño coherente con la marca (azul petróleo, tipografía Elaine Sans)
  - [x] Mensaje amigable: "Esta página no existe, pero tu próximo viaje sí"
  - [x] CTA a WhatsApp y link a la home
  - [x] Sin dependencias adicionales

---



## Fase 9B — Arquitectura Multipágina de Destinos ✅

> **Nota**: Renombrada de "Fase 9" a "Fase 9B" para distinguir de la Ola 1 (9A).
> Los destinos se extraerán de las publicaciones de Instagram de la agencia.
> Contenido mixto: info real de destinos + precios "desde" orientativos + CTA a WhatsApp.

- [x] **9B.1** Rutas Dinámicas de Destino (`/destinos/[slug]`) ✅
  - [x] Crear `app/destinos/[slug]/page.tsx` con plantilla premium
  - [x] Crear `app/destinos/page.tsx` — índice con grid de todos los destinos
  - [x] Crear `lib/destinations-data.ts` con datos de 13 destinos reales (extraídos de Instagram y ampliados)
  - [x] Estructura de cada destino:
    - [x] Descripción del destino (optimizada para SEO de larga cola)
    - [x] Excursiones sugeridas e itinerario típico
    - [x] Precio "desde" en ARS/USD orientativo
    - [x] Galería de imágenes reales y libres de derechos
    - [x] CTA a WhatsApp con mensaje pre-rellenado específico por fecha y destino
  - [x] Optimizar metadatos SEO de cada página para búsquedas específicas desde Córdoba
  - [x] Actualizar `sitemap.ts` para incluir rutas de destinos de forma dinámica
  - [x] Internal linking desde tarjetas de `FeaturedDestinations.tsx` a las páginas individuales e índice general
  - [x] Comprobación inteligente de expiración y estado de cupos en salidas grupales.
  - [x] Redirección limpia a cotización a medida cuando no hay salidas activas.



### Fase 9C — Social Proof y Contenido

- [x] **9C.1** Sección Instagram estática curada
  - [x] Crear `components/sections/InstagramFeed.tsx`
  - [x] Descargar 4-6 mejores imágenes de publicaciones recientes de @787rumbos
  - [x] Grid premium con link directo al perfil de Instagram
  - [x] Actualización manual mensual
- [x] **9C.2** Página 404 personalizada (ver 9A.7 si no se completó en Ola 1)

---



## Fase 9D — Promociones Especiales (Vuelo Charter F1 GP São Paulo) ✅

- [x] **9D.1** Agregar F1 Grand Premio de São Paulo a `destinations-data.ts`.
- [x] **9D.2** Copiar imagen de hero generada y folleto promocional a `/public/destinos/`.
- [x] **9D.3** Modificar la vista de detalle `[slug]/page.tsx` para mostrar folletos promocionales si están disponibles (`flyerImage`).
- [x] **9D.4** Diseñar componente premium de banner destacado en la home (`SpecialPromo.tsx`) con estética oscura, acentos de color de F1, datos completos y CTAs específicos.
- [x] **9D.5** Integrar el banner en la Home en `app/page.tsx` con IntersectionObserver scroll reveal.

---



## Fase 10 — Escalabilidad y Gestión

- [ ] **10.1** Integración de Headless CMS (Sanity/Strapi) para que los dueños gestionen destinos sin tocar código.
- [ ] **10.2** Blog de Contenidos / Guías de viaje si crece el tráfico orgánico.

---



## Fase 11 — Fundación de Distribución Local y GBP

> **Origen**: Auditoría competitiva, marketing, turismo y SEO del 2026-07-06.  
> **Documento base**: `[marketing-growth-audit.md](./marketing-growth-audit.md)`  
> **Objetivo**: Resolver el principal cuello de botella actual: baja autoridad externa, pocas señales locales y poco tráfico de intención.

- [ ] **11.1** Completar/verificar Google Business Profile
  - [ ] Categoría principal: Agencia de viajes
  - [ ] Evaluar categorías secundarias sin diluir intención: operador turístico, agencia de excursiones, servicios vinculados
  - [ ] Sincronizar NAP exacto con web, Instagram y directorios
  - [ ] Agregar link de contacto/WhatsApp específico para GBP
  - [ ] Cargar horarios reales
- [ ] **11.2** Subir fotos reales al GBP
  - [ ] Local dentro del Aeropuerto de Córdoba
  - [ ] Mostrador/local de Vía Bariloche
  - [ ] Equipo/personas atendiendo
  - [ ] Flyers o salidas destacadas
  - [ ] Referencias visuales para encontrar el local
- [ ] **11.3** Rutina de publicaciones GBP
  - [ ] 2 publicaciones por semana durante 8 semanas
  - [ ] Alternar ofertas, salidas, consejos y "cómo encontrarnos"
  - [ ] Linkear cada publicación a página de destino o WhatsApp medible
- [ ] **11.4** Reseñas iniciales
  - [ ] Conseguir 10 reseñas reales en 30 días
  - [ ] Conseguir 20 reseñas reales en 60 días
  - [ ] Responder el 100% de reseñas con tono humano y keywords naturales
- [ ] **11.5** Citaciones locales y backlinks base
  - [ ] Revisar presencia en directorios turísticos/locales
  - [ ] Gestionar menciones o links desde aliados/partners si es posible
  - [ ] Verificar consistencia de nombre, dirección y teléfono en todas las plataformas

---



## Fase 12 — Confianza, Comunidad y Conversión

- [ ] **12.1** Prueba social real
  - [ ] Recolectar 3 testimonios reales con nombre, destino y autorización
  - [ ] Activar la sección `Testimonials` cuando haya datos reales
  - [ ] Preparar proceso post-viaje para pedir reseña + testimonio
- [ ] **12.2** Instagram curado en web
  - [x] Completar la Fase 9C.1 con 4-6 publicaciones reales
  - [x] Priorizar piezas con personas, destinos, folletos claros y vigencia
  - [ ] Definir actualización manual mensual
- [x] **12.3** FAQ comercial general
  - [x] Qué incluyen los paquetes
  - [x] Medios de pago y financiación
  - [x] Asistencia al viajero
  - [x] Salidas desde Córdoba
  - [x] Paquetes a medida vs salidas grupales
  - [x] Local físico en aeropuerto, cómo reservar, ómnibus y post-venta
  - [x] Componente `FAQ.tsx` con schema `FAQPage` y ancla `#preguntas-frecuentes`
- [ ] **12.4** Refuerzo del diferencial aeropuerto
  - [ ] Crear contenido específico: "Agencia de viajes en el Aeropuerto de Córdoba"
  - [ ] Explicar cómo llegar al local dentro del hall de arribos
  - [ ] Reforzar servicios mixtos: vuelos, paquetes y ómnibus
- [ ] **12.5** Medición de WhatsApp
  - [ ] Diferenciar mensajes pre-rellenados por fuente: home, destino, GBP, Instagram, Ads
  - [ ] Definir UTMs para campañas y links externos
  - [ ] Crear planilla simple de leads: fecha, fuente, destino, estado, venta/no venta

---



## Fase 13 — SEO de Crecimiento

- [ ] **13.1** Clusters de demanda "desde Córdoba"
  - [ ] Brasil desde Córdoba
  - [ ] Caribe desde Córdoba
  - [ ] Argentina en bus desde Córdoba
  - [ ] Salidas grupales desde Córdoba
  - [ ] Escapadas de fin de semana largo
- [ ] **13.2** FAQ por destino
  - [ ] Agregar preguntas reales de usuarios a cada destino prioritario
  - [ ] Evaluar schema `FAQPage`
  - [ ] Priorizar Río de Janeiro, Brasil/Caribe, Bariloche, Cataratas, Termas y F1
- [ ] **13.3** Interlinking editorial
  - [ ] Linkear destino ↔ categoría ↔ artículos relacionados
  - [ ] Agregar breadcrumbs si se implementa navegación multipágina más profunda
  - [ ] Evitar páginas huérfanas
- [ ] **13.4** Blog mínimo
  - [ ] Publicar 2 piezas mensuales durante 3 meses
  - [ ] Priorizar artículos cortos con intención real, no contenido genérico
  - [ ] Temas iniciales: requisitos Brasil, mejor época para Río, qué incluye un paquete, viajar en bus cama
- [ ] **13.5** Mantenimiento de catálogo
  - [ ] Actualizar precios, salidas y estados al menos una vez por mes
  - [ ] Retirar o marcar correctamente promociones vencidas

---



## Fase 14 — Pauta Controlada

> No iniciar inversión fuerte antes de tener tracking básico de WhatsApp y GBP activo.

- [ ] **14.1** Google Ads Search local
  - [ ] Keywords: agencia de viajes Córdoba, agencia de turismo Córdoba, agencia de viajes aeropuerto Córdoba
  - [ ] Excluir búsquedas demasiado amplias como vuelos baratos/hoteles baratos
  - [ ] Medir costo por click a WhatsApp y costo por lead
- [ ] **14.2** Google Ads por destino
  - [ ] Paquetes a Brasil desde Córdoba
  - [ ] Río de Janeiro desde Córdoba
  - [ ] Caribe desde Córdoba
  - [ ] Salidas grupales desde Córdoba
- [ ] **14.3** Instagram / Meta Ads
  - [ ] Promocionar salidas con fecha concreta
  - [ ] Usar piezas visuales reales, no genéricas
  - [ ] Campañas a WhatsApp solo con mensaje específico por destino/promoción
- [ ] **14.4** Reporte mensual
  - [ ] Gasto
  - [ ] Leads
  - [ ] Costo por lead
  - [ ] Presupuestos enviados
  - [ ] Ventas cerradas
  - [ ] Destinos más consultados

---



## Notas y Cambios


| Fecha      | Nota                                                                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-14 | Plan inicial creado y aprobado por el usuario                                                                                                                                                           |
| 2026-06-14 | Confirmado: destinos son ilustrativos, no paquetes reales                                                                                                                                               |
| 2026-06-14 | Confirmado: testimonios van en branch separada (`feature/testimonials`)                                                                                                                                 |
| 2026-06-14 | Confirmado: branching strategy → `main` ← `development` ← `feature/testimonials`                                                                                                                        |
| 2026-06-14 | Fases 1→5 completadas y mergeadas a `main`                                                                                                                                                              |
| 2026-06-14 | Fase 2 (tipografías) unificada con Fase 4 — implementadas juntas                                                                                                                                        |
| 2026-06-14 | Parallax descartado — puede perjudicar mobile y Core Web Vitals                                                                                                                                         |
| 2026-07-04 | Auditoría de marketing, social proof, UX y SEO completada                                                                                                                                               |
| 2026-07-04 | Decisiones clave: versión legal completa, testimonios en 1-2 semanas, Instagram estático curado, navegación con anclas + hamburguesa mobile, imagen OG 1200×630, destinos reales extraídos de Instagram |
| 2026-07-04 | Fase 9 dividida en 9A (confianza/conversión/UX) y 9B (destinos multipágina)                                                                                                                             |
| 2026-07-04 | Confirmado: legajo 20455 es real y verificado                                                                                                                                                           |
| 2026-07-04 | Confirmado: CUIT y Razón Social disponibles para publicar                                                                                                                                               |
| 2026-07-04 | Confirmado: Google Business Profile en proceso de verificación                                                                                                                                          |
| 2026-07-04 | Confirmado: Google Search Console activo — 1 página indexada                                                                                                                                            |
| 2026-07-06 | Integrado el paquete especial de F1 GP São Paulo con banner destacado en Home y vista de folleto en detalle                                                                                             |
| 2026-07-06 | Auditoría competitiva/marketing/SEO creada; se abren Fases 11 a 14 para GBP, prueba social, SEO de crecimiento y pauta controlada                                                                       |


