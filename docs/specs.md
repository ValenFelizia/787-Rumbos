# 787 Rumbos — Landing Page Overhaul Specs

> **Última actualización**: 2026-07-06
> **Estado**: Fases 1 a 9D completadas. Nueva etapa abierta: crecimiento orgánico/local, comunidad, medición y pauta controlada.
> **Branch principal de trabajo**: `development` (Las integraciones a `master`/`main` las realiza el usuario manualmente tras chequear en local).

---

## Contexto de Negocio y Alianza Estratégica

787 Rumbos es una agencia de viajes con sede física en el Aeropuerto Internacional Ing. Aeronáutico Ambrosio Taravella de Córdoba, Argentina. 

### Modelo de Sostenibilidad y Co-Branding
*   **El Local Físico:** La oficina física de la agencia se encuentra en el hall central de arribos del aeropuerto de Córdoba. Comparten local físico con **Vía Bariloche** y **Vía Tac** (boletería oficial de ómnibus).
*   **Sinergia Operativa:** Vía Bariloche financia el local físico. Para hacerlo sostenible (dado que la venta de pasajes de colectivo de media/larga distancia en el aeropuerto es baja), los dueños operan la agencia de turismo emisivo (787 Rumbos) en el mismo espacio.
*   **Propuesta de Valor Terrestre:** Además de pasajes aéreos y paquetes, 787 Rumbos emite pasajes de ómnibus nacionales de Vía Bariloche, Vía Tac y El Valle, actuando como boletería oficial en el aeropuerto de Córdoba.
*   **Enfoque de Conversión:** El único canal de venta es **WhatsApp**. El sitio web sirve para captar tráfico calificado, generar confianza (resaltando la ubicación en el aeropuerto) y pre-procesar los leads mediante un cotizador rápido para derivar al chat.

### Datos Oficiales (NAP / Google Business Profile)
Estos datos están sincronizados en el footer, schema JSON-LD, y Google Maps para la verificación del negocio:
*   **Nombre comercial:** `787 Rumbos`
*   **Dirección física:** `Av. La Voz del Interior 8500, Córdoba, Argentina`
*   **Indicaciones de local:** `Hall de arribos, dentro del local oficial de Vía Bariloche (Aeropuerto de Córdoba)`
*   **Código Postal:** `X5147XAA`
*   **Teléfono de contacto / WhatsApp principal:** `0351 344-8724` (Internacional: `+54 9 351 344-8724` o `+54 9 351 615-7398`)

---

## Fases Completadas e Implementadas

### Fase 1 a 6 — Performance, Identidad, Arquitectura, UI/UX y SEO Inicial ✅
*   Activación de optimización de imágenes (`next/image`) y peso de página inicial < 1 MB.
*   Fuentes integradas localmente en `globals.css`: *Elaine Sans* (títulos) y *Zalando Sans* (cuerpo de texto).
*   Componentización total: Secciones extraídas a `components/sections/` y `page.tsx` simplificado como compositor.
*   Limpieza radical de dependencias redundantes (remoción de Radix UI, React Hook Form, date-fns, sonner, etc.).
*   Optimización de accesibilidad (Lighthouse > 90) y SEO semántico básico.

### Fase 7 — SEO Local y Credibilidad ✅
*   **Structured Data:** Integrado schema JSON-LD con tipo `TravelAgency` + `LocalBusiness` en `app/layout.tsx`.
*   **Footer Mejorado:** Reestructurado a 4 columnas incluyendo enlaces oficiales de interés (Agencia Córdoba Turismo, Cámara de Turismo de Córdoba, Estado de Vuelos AA2000).
*   **Barras de Confianza:** Logos de AFIP y Cámara de Turismo enlazados a sus destinos oficiales en `TrustBar.tsx` y footer.

### Fase 8 — Conversión Interactiva (Quiz/Cotizador) ✅
*   **Estado Global:** Implementado `ModalContext.tsx` para coordinar la apertura/cierre y pre-selección de destinos del cotizador desde cualquier CTA de la web.
*   **Asistente de Cotización (`QuoteModal.tsx`):**
    *   **Paso 1: Destino.** Input de texto libre con píldoras de sugerencias rápidas autocompletables (Río, Bariloche, Cartagena, Ushuaia).
    *   **Paso 2: Fechas y Pasajeros.** Selectores dinámicos generados con JS de los próximos 12 meses + contadores numéricos interactivos de pasajeros (Adultos y Menores).
    *   **Paso 3: Aerolíneas.** Selector visual de logos con la opción *"Sin preferencia"* pre-seleccionada por defecto.
    *   **Bypass de Formulario:** Enlace directo inferior para saltar al WhatsApp sin realizar el quiz.
    *   **Prevención de Submit Prematuro:** Interceptación del evento de submit del navegador en los pasos 1 y 2 para evitar redirecciones accidentales.
    *   **React Node Recycling Fix:** Los botones del modal implementan claves de renderizado únicas (`key="back-btn"`, `key="next-btn"`, `key="submit-btn"`) para evitar que el navegador asocie y propague un evento de clic al botón de submit tras mutar el nodo en el paso 3.
*   **Navbar Adaptativo (Opción B):**
    *   **Desktop:** Muestra el botón de texto premium `Cotizar Viaje` junto al icono de WhatsApp.
    *   **Mobile:** Colapsa inteligentemente en un botón circular dorado con el icono de WhatsApp, dejando la cabecera limpia y optimizando el espacio en pantallas táctiles de 360px.
*   **CTAs Contextuales:** Las tarjetas de destinos destacados abren el modal pre-seleccionando el destino y saltando directamente al paso 2.

### Integración de Vía Bariloche / Vía Tac ✅
*   **Carrusel de Socios (`PartnersMarquee.tsx`):** Se integró el logotipo oficial de Vía Bariloche (`/partners/viabariloche.png`) con dimensiones de 150x40px. El título de sección se cambió a **"Viajá con las mejores compañías"** para englobar el transporte aéreo y terrestre de manera coherente. Loop CSS seamless: un solo track con dos secuencias idénticas animado a `translate3d(-50%, 0, 0)` (evita solapamiento y saltos al reiniciar).
*   **Ficha de Servicios (`Services.tsx`):** Agregada la tarjeta de servicio **"Pasajes de Ómnibus"** con el icono `Ticket` de Lucide. El grid se amplió a **5 columnas** en pantallas anchas (`xl:grid-cols-5`) manteniendo la simetría visual.
*   **Ubicación en el Footer (`Footer.tsx`):** Dirección simplificada a una sola línea con una aclaración pequeña y elegante justo debajo:
    `Av. La Voz del Interior 8500, Córdoba`
    `(Hall de arribos, local de Vía Bariloche)`

---

## Fases Pendientes y Siguientes Pasos

### Fase 9A — Confianza, Conversión y UX (Ola 1) ← PRÓXIMA
> Derivada de la auditoría de marketing/UX/SEO del 2026-07-04.

*   **Compliance Legal:** Crear página `/legal` con T&C, Política de Privacidad y datos del titular (CUIT, Razón Social, Legajo). Agregar botón de Defensa del Consumidor y datos legales en el footer.
*   **Imagen OG:** Diseñar imagen 1200×630px para previews de links en WhatsApp/redes. Actualmente usa `logo.png` como fallback (se ve cortado en previews rectangulares).
*   **Navegación:** Agregar links por anclas en desktop (Inicio, Destinos, Servicios, Contacto) + menú hamburguesa en mobile. Preparación para la futura expansión multipágina.
*   **Testimonios:** Crear estructura del componente `Testimonials.tsx` para integrar datos reales en 1-2 semanas. No publicar hasta tener testimonios verificados.
*   **SEO técnico:** Agregar `openingHours` y `hasMap` al JSON-LD. Página 404 personalizada con CTA.

### Fase 9B — Expansión de Destinos (Páginas Dinámicas)
*   **Objetivo:** Crear la ruta dinámica `app/destinos/[slug]/page.tsx` para optimizar el posicionamiento orgánico de palabras clave específicas (ej. "paquetes a río de janeiro desde cordoba").
*   **Fuente de datos:** Publicaciones de Instagram de @787rumbos (la agenciera sube al menos un paquete por semana con itinerario, destino, días, hotel y precios).
*   **Tipo de contenido:** Mixto — info real de destinos + precios "desde" orientativos + CTA a WhatsApp.
*   **Cantidad inicial:** 4 a 8 destinos reales (extraídos de Instagram).
*   **Estructura del Contenido:**
    *   Descripción del destino (optimizada para SEO long-tail).
    *   Itinerario sugerido (resumido desde publicaciones de Instagram).
    *   Precio "desde" orientativo (se actualiza periódicamente).
    *   Galería de imágenes optimizadas.
    *   WhatsApp link personalizado por destino.

### Ola 2 — Social Proof y Contenido (entre 9A y 9B)
*   **Sección Instagram estática curada:** Grid de 4-6 imágenes descargadas de las mejores publicaciones de @787rumbos, con link al perfil. Actualización manual mensual. Sin APIs ni widgets externos.
*   **FAQ (evaluación futura):** Sección de preguntas frecuentes para SEO (featured snippets) y reducción de fricción.

### Fase 10 — Blog de Viajes y SEO Local
*   **Objetivo:** Publicar artículos informativos para capturar búsquedas de cola larga desde Córdoba (ej. "cómo viajar con equipaje de mano en flybondi", "mejor época para viajar a brasil").
*   **Tecnología:** Inicialmente con rutas estáticas en markdown o un archivo JSON. Si la frecuencia aumenta, escalar a un Headless CMS ligero.

---

## Diferenciadores Estratégicos (Confirmados)

Pilares de marca validados durante la auditoría del 2026-07-04:

1.  **Atención humana 100%** — Nada de bots ni chatbots. Cada cliente habla con una persona real.
2.  **Ubicación DENTRO del aeropuerto** — Oficina física en el hall de arribos. No "cerca del aeropuerto", dentro.
3.  **Background en transporte terrestre** — Experiencia operando Vía Bariloche. Conocimiento profundo del rubro.
4.  **Precios competitivos** — Acuerdos directos con aerolíneas y mayoristas.
5.  **Especialización en viajes desde Córdoba** — No es Buenos Aires-céntrica. Conocen las rutas, conexiones y realidad del pasajero cordobés.
6.  **Atención post-venta** — Acompañamiento durante y después del viaje.

> Estos diferenciadores deben reflejarse de forma prominente en la sección ValueProposition y en las futuras páginas de destinos.

---

## Estado de Herramientas Externas

| Herramienta | Estado | Nota |
|-------------|--------|------|
| Google Search Console | ✅ Activo | 1 página indexada, 2 sin indexar |
| Vercel Analytics | ✅ Activo | `@vercel/analytics` en producción |
| Google Business Profile | ⏳ En verificación | Crítico para SEO local y Google Reviews |
| Instagram | ✅ Activo (@787rumbos) | Publicaciones semanales de paquetes — fuente de datos para destinos |

---

## Nueva Etapa Estratégica — Crecimiento, Marketing y SEO Local

> Derivada de la auditoría competitiva, marketing, UI/UX, turismo y SEO del 2026-07-06.  
> Documento completo: [`marketing-growth-audit.md`](./marketing-growth-audit.md)

### Diagnóstico

La web ya no debe tratarse como una landing aislada. Con destinos multipágina, promos especiales, datos legales, cotizador y base SEO técnica, el cuello de botella pasa a ser distribución y autoridad externa: Google Business Profile, reseñas, citaciones locales, contenido recurrente, backlinks y medición real de leads por WhatsApp.

### Competencia Relevante

787 Rumbos no debe competir frontalmente con OTAs gigantes como Despegar, Almundo o Booking. El benchmark útil son agencias locales/medianas con foco en atención humana, salidas desde Córdoba, WhatsApp, financiación y catálogo visible: Planisferio Viajes, Reiseburo, Tijuca Travel, Departure Viajes, Domundo y Buteler.

### Posicionamiento Recomendado

> Agencia de viajes en el Aeropuerto de Córdoba: paquetes, vuelos, ómnibus y salidas grupales con atención humana por WhatsApp.

### Prioridades de Crecimiento

1. **Google Business Profile y Maps:** completar verificación, fotos reales del local/equipo, posts semanales, servicios/productos y objetivo de 20 reseñas reales en 60 días.
2. **Prueba social:** testimonios verificados, feed curado de Instagram, fotos reales de viajeros/local y respuestas públicas a reseñas.
3. **SEO long-tail desde Córdoba:** clusters por Brasil, Caribe, Argentina, salidas grupales, viajes en bus y páginas/artículos informacionales.
4. **Medición de WhatsApp:** UTMs, mensajes pre-rellenados por fuente, eventos de analytics y registro simple de leads.
5. **Pauta controlada:** Google Ads solo para búsquedas locales o de destino con intención clara; Instagram/Meta para promos concretas y remarketing.

### Fases Nuevas

* **Fase 11 — Fundación de Distribución Local:** GBP, reseñas, fotos, citaciones NAP y tracking básico.
* **Fase 12 — Conversión y Confianza:** testimonios, Instagram curado, FAQ comercial general (home, Fase 12.3 ✅), página/bloque del local en aeropuerto y medición fina de CTAs.
* **Fase 13 — SEO de Crecimiento:** categorías por demanda (✅ ola 1: Brasil, Argentina en bus, Salidas grupales), blog corto, FAQ por destino (✅ ola 1: 7 prioritarios + schema, highlights, breadcrumbs, related), interlinking y backlinks locales. Higiene: salidas pasadas podadas + SpecialPromo con `endsAt`.
* **Fase 14 — Pauta Controlada:** Google Ads Search local/destino, Instagram Ads para promos y reporte mensual de costo por lead/venta.

---

## Constraints Técnicas de Desarrollo

1.  **No agregar dependencias npm innecesarias:** Mantener el bundle liviano. Toda interactividad o animación debe resolverse con CSS vanilla, Tailwind v4 y JavaScript nativo (`IntersectionObserver`, Web APIs). Las dependencias se permiten cuando son la solución inteligente, no la perezosa.
2.  **Estrategia de Ramas:**
    *   `development`: Es la rama de trabajo diaria. Todo cambio se sube y valida aquí.
    *   `master` / `main`: Rama de producción. **Nunca subir cambios directamente a master.** El usuario realiza la integración de desarrollo a producción de forma manual tras validar en local.
3.  **Respetar la identidad:** Elaine Sans para encabezados/botones y Zalando Sans para cuerpo de texto.
4.  **No usar placeholders:** Usar imágenes reales o assets libres limpios e integrados correctamente.
5.  **Aesthetics First:** Los diseños deben verse premium, con un balance de contrastes acorde a las pautas de marca (azul petróleo de fondo, detalles en dorado y verde limón).
6.  **Documentación:** Actualizar `docs/todo.md` y `docs/specs.md` a medida que se implementan cambios.

