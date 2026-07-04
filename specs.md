# 787 Rumbos — Landing Page Overhaul Specs

> **Última actualización**: 2026-07-04
> **Estado**: Fases 1 a 8 completadas. Integración de Vía Bariloche completada.
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
*   **Carrusel de Socios (`PartnersMarquee.tsx`):** Se integró el logotipo oficial de Vía Bariloche (`/partners/viabariloche.png`) con dimensiones de 150x40px. El título de sección se cambió a **"Viajá con las mejores compañías"** para englobar el transporte aéreo y terrestre de manera coherente.
*   **Ficha de Servicios (`Services.tsx`):** Agregada la tarjeta de servicio **"Pasajes de Ómnibus"** con el icono `Ticket` de Lucide. El grid se amplió a **5 columnas** en pantallas anchas (`xl:grid-cols-5`) manteniendo la simetría visual.
*   **Ubicación en el Footer (`Footer.tsx`):** Dirección simplificada a una sola línea con una aclaración pequeña y elegante justo debajo:
    `Av. La Voz del Interior 8500, Córdoba`
    `(Hall de arribos, local de Vía Bariloche)`

---

## Fases Pendientes y Siguientes Pasos

### Fase 9 — Expansión de Destinos (Páginas Dinámicas)
*   **Objetivo:** Crear la ruta dinámica `app/destinos/[slug]/page.tsx` para optimizar el posicionamiento orgánico de palabras clave específicas (ej. "paquetes a río de janeiro desde cordoba").
*   **Estructura del Contenido a recopilar:**
    *   Título comercial (ej. "Río de Janeiro Clásico").
    *   Itinerario descriptivo sugerido.
    *   Detalle de servicios incluidos (Vuelos con equipaje, noches de hotel, traslados, seguro médico).
    *   Precios de referencia y esquemas de financiación.
    *   WhatsApp link personalizado por destino.

### Fase 10 — Blog de Viajes y SEO Local
*   **Objetivo:** Publicar artículos informativos para capturar búsquedas de cola larga desde Córdoba (ej. "cómo viajar con equipaje de mano en flybondi", "mejor época para viajar a brasil").
*   **Tecnología:** Inicialmente con rutas estáticas en markdown o un archivo JSON. Si la frecuencia aumenta, escalar a un Headless CMS ligero.

---

## Constraints Técnicas de Desarrollo

1.  **No agregar dependencias npm adicionales:** Mantener el bundle liviano. Toda interactividad o animación debe resolverse con CSS vanilla, Tailwind v4 y JavaScript nativo (`IntersectionObserver`, Web APIs).
2.  **Estrategia de Ramas:**
    *   `development`: Es la rama de trabajo diaria. Todo cambio se sube y valida aquí.
    *   `master` / `main`: Rama de producción. **Nunca subir cambios directamente a master.** El usuario realiza la integración de desarrollo a producción de forma manual tras validar en local.
3.  **Respetar la identidad:** Elaine Sans para encabezados/botones y Zalando Sans para cuerpo de texto.
4.  **No usar placeholders:** Usar imágenes reales o assets libres limpios e integrados correctamente.
5.  **Aesthetics First:** Los deños deben verse premium, con un balance de contrastes acorde a las pautas de marca (azul petróleo de fondo, detalles en dorado y verde limón).
