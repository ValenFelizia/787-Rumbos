# 787 Rumbos — Landing Page Overhaul Specs

> **Última actualización**: 2026-06-14
> **Estado**: Aprobado — listo para implementar
> **Branch principal de trabajo**: `development`
> **Branch separada**: `feature/testimonials` (ver Fase 4.3)

---

## Contexto

Landing page de una agencia de viajes con sede en el Aeropuerto de Córdoba, Argentina.
Stack: Next.js 15 + React 19 + TypeScript + Tailwind CSS v4. Deploy en Vercel.
Objetivo: Pulir la landing existente para que se sienta premium, cargue rápido, y esté técnicamente preparada para escalar.

### Decisiones clave tomadas

| Decisión | Resultado |
|----------|-----------|
| Hosting/deploy | Vercel (ya configurado) |
| Visión de escalabilidad | Single-page por ahora, arquitectura preparada para crecer |
| Manual de marca | Respetar al máximo (tipografías Elaine Sans / Zalando Sans, iconografía propia) |
| Canal de conversión | WhatsApp (único canal, es donde cierran ventas) |
| Limpieza de deps | Agresiva — eliminar todo lo que no se use |
| Animaciones | Premium — scroll reveal, parallax sutil, micro-interacciones |
| Testimonios | Sección nueva, pero en branch separada hasta tener datos reales |
| Dispositivo principal | Mobile-first (tráfico desde Instagram/WhatsApp) |
| SEO | Básico bien hecho (Open Graph, structured data, meta tags) |
| Destinos | Ilustrativos (no paquetes reales en venta) — ver nota en §4.2 |

---

## Fase 1 — Performance

### 1.1 Activar optimización de imágenes de Next.js

**Archivo**: `next.config.mjs`

**Spec**:
- Eliminar `images: { unoptimized: true }`
- Eliminar `typescript: { ignoreBuildErrors: true }` (arreglar errores TS si aparecen)
- Resultado: Next.js + Vercel generan automáticamente WebP/AVIF, resize por breakpoint, y lazy loading.

**Criterio de aceptación**:
- `npm run build` pasa sin errores
- Las imágenes se sirven como WebP en Vercel (verificar en Network tab)

### 1.2 Refactorizar hero image

**Archivo**: `app/page.tsx` (sección Hero)

**Spec**:
- Reemplazar `bg-[url('/hero-bg.jpg')]` (CSS background) por un `<Image>` de Next.js con:
  - `priority` (es LCP, no debe tener lazy loading)
  - `fill` + `className="object-cover"`
  - `sizes="100vw"`
  - `placeholder="blur"` con `blurDataURL` generado (import estático o base64 manual)
  - `quality={80}` (buen balance calidad/peso)
- Mantener el overlay de gradiente como un `<div>` posicionado encima con `absolute`

**Criterio de aceptación**:
- Hero se renderiza idéntico visualmente
- LCP < 2.5s en Lighthouse mobile (throttled)
- La imagen del hero se carga con `priority` (no lazy)

### 1.3 Optimizar imágenes restantes

**Archivos**: Todos los `<Image>` en `page.tsx`

**Spec**:
- Agregar `sizes` prop a cada `<Image>`:
  - Destinos: `sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"`
  - Nosotros: `sizes="(max-width: 768px) 100vw, 42vw"`
  - Logo: `sizes` no necesario (es pequeño y tiene `width/height` explícitos)
- Verificar que las imágenes debajo del fold usen `loading="lazy"` (default de Next.js `<Image>`)
- Las imágenes fuente en `/public` se mantienen como están (Next.js las optimiza al vuelo en Vercel)

**Criterio de aceptación**:
- Page weight total < 1 MB en carga inicial
- Todas las imágenes below-the-fold cargan lazy

### 1.4 Limpiar imágenes no usadas de `/public`

**Spec**:
- Eliminar: `placeholder.jpg`, `placeholder.svg`, `placeholder-logo.png`, `placeholder-logo.svg`, `placeholder-user.jpg`
- Verificar que `icon.svg`, `icon-dark-32x32.png`, `icon-light-32x32.png` se usen — si no, eliminar

**Criterio de aceptación**:
- `/public` solo contiene archivos referenciados en el código

---

## Fase 2 — Identidad de Marca

### 2.1 Tipografías de marca

**Spec**:
- Copiar a `/public/fonts/`:
  - `elaine-sans.medium.ttf`
  - `elaine-sans.semibold.ttf`
  - `elaine-sans.bold.ttf`
  - `ZalandoSans-VariableFont_wdth,wght.ttf`
- Registrar con `@font-face` en `globals.css` (con `font-display: swap`)
- Crear utilidades de fuente o usar `next/localFont`:
  - `elaineSans` → títulos (h1, h2, h3, CTAs)
  - `zalandoSans` → cuerpo de texto
- Eliminar imports de `Montserrat`, `Inter` de `page.tsx`
- Eliminar imports de `Geist`, `Geist_Mono` de `layout.tsx`
- Actualizar `--font-sans` y `--font-mono` en `globals.css`

**Criterio de aceptación**:
- No hay fuentes de Google Fonts cargándose (verificar en Network tab)
- Los títulos usan Elaine Sans, el cuerpo usa Zalando Sans
- `font-display: swap` evita FOIT

### 2.2 Iconografía de marca

**Spec**:
- Copiar los 4 iconos relevantes de `elementos gráficos/Iconos/` a `/public/icons/` (variante apropiada para fondo claro)
- Los 4 iconos de marca representan: avión ✈️ (01), hotel 🏨 (02), brújula 🧭 (03), maleta 🧳 (04)
- Reemplazar iconos de Lucide en la sección **Servicios** por los iconos de marca usando `<Image>` o `<img>`
- Reemplazar iconos de Lucide en la sección **Propuesta de valor** por iconos de marca donde aplique
- Mantener Lucide para: iconos funcionales (Send/WhatsApp, MapPin, Instagram, Timer, Wallet) y elementos de UI menores

**Criterio de aceptación**:
- Las secciones de servicios y propuesta de valor usan iconos de la marca
- Los iconos funcionales (UI) siguen usando Lucide
- No se pierden iconos ni se rompen layouts

### 2.3 Degradados y paleta de marca como CSS custom properties

**Spec**:
- Definir en `globals.css`:
  ```css
  :root {
    --brand-azul-petroleo: #0b4058;
    --brand-azul-medio: #006183;
    --brand-dorado: #f7a92a;
    --brand-dorado-claro: #e6b451;
    --brand-limon: #dae553;
    --brand-verde: #a2c745;
    --brand-crema: #f9f9f9;
    --brand-blanco: #ffffff;
    --gradient-brand-warm: linear-gradient(135deg, #f7a92a, #e6b451);
    --gradient-brand-dark: linear-gradient(135deg, #0b4058, #006183);
  }
  ```
- Reemplazar colores hardcodeados en Tailwind (`bg-[#0b4058]`, `text-[#006183]`, etc.) por `bg-[var(--brand-azul-petroleo)]` o clases custom
- Evaluar incorporar los degradados PNG del manual como CSS gradients equivalentes

**Nota**: No reemplazar _todos_ los colores inline de golpe; hacerlo gradualmente durante la componentización (Fase 3) para no generar un diff inmanejable.

**Criterio de aceptación**:
- Los colores de marca están centralizados en variables CSS
- Cambiar un color de marca requiere editar un solo lugar

---

## Fase 3 — Arquitectura y Limpieza

### 3.1 Componentización

**Spec**:
- Crear directorio `components/sections/`
- Extraer cada sección de `page.tsx` a un componente:

| Componente | Responsabilidad |
|-----------|----------------|
| `Navbar.tsx` | Barra superior sticky con logo y CTA |
| `Hero.tsx` | Sección hero con imagen, títulos, CTAs |
| `ValueProposition.tsx` | "Tu viaje, nuestra prioridad" + 3 tarjetas |
| `AboutUs.tsx` | "De la terminal al mundo" con foto e historia |
| `FeaturedDestinations.tsx` | Grid de tarjetas de destinos |
| `Services.tsx` | Grid de servicios |
| `TrustBar.tsx` | **NUEVA** — Badges de confianza (AFIP, Cámara, Legajo) |
| `CTASection.tsx` | **NUEVA** — CTA de cierre antes del footer |
| `Footer.tsx` | Pie de página |

- `page.tsx` queda como compositor:
  ```tsx
  export default function Home() {
    return (
      <main>
        <Navbar />
        <Hero />
        <TrustBar />
        <ValueProposition />
        <AboutUs />
        <FeaturedDestinations />
        <Services />
        {/* <Testimonials /> — ver feature/testimonials branch */}
        <CTASection />
        <Footer />
      </main>
    );
  }
  ```
- Los datos constantes (`featuredDestinations`, `services`, `whatsappApiLink`) se mueven a `lib/constants.ts`

**Criterio de aceptación**:
- `page.tsx` tiene < 30 líneas
- Cada componente de sección es autónomo
- La página se ve y funciona idéntico antes y después

### 3.2 Limpieza de dependencias

**Spec**:
- **Eliminar archivos**:
  - Todos los archivos en `components/ui/` (57 archivos)
  - `components/theme-provider.tsx`
  - `components.json`
  - `styles/globals.css` (duplicado de `app/globals.css`)
  - `hooks/` (si está vacío o sin uso)
  - Placeholders en `/public` (ver §1.4)

- **Eliminar dependencias de `package.json`**:
  - Todos los `@radix-ui/*`
  - `@hookform/resolvers`, `react-hook-form`
  - `recharts`
  - `react-day-picker`, `date-fns`
  - `embla-carousel-react`
  - `cmdk`
  - `input-otp`
  - `react-resizable-panels`
  - `sonner`
  - `vaul`
  - `zod`
  - `class-variance-authority`
  - `clsx`
  - `tailwind-merge`
  - `tailwindcss-animate`, `tw-animate-css`
  - `next-themes`
  - `@vercel/analytics` → **CONSERVAR** (se usa en layout.tsx)

- **Conservar**:
  - `next`, `react`, `react-dom` (core)
  - `lucide-react` (iconos funcionales)
  - `autoprefixer`, `postcss`, `tailwindcss`, `@tailwindcss/postcss` (estilos)
  - `typescript`, `@types/*` (dev)
  - `@vercel/analytics` (analytics)

- Después de limpiar: `rm -rf node_modules package-lock.json && npm install`

**Criterio de aceptación**:
- `npm run build` pasa sin errores
- `node_modules` se reduce significativamente
- No quedan imports rotos

### 3.3 Limpiar globals.css

**Spec**:
- Eliminar todas las variables CSS de shadcn que no se usen (dark mode, sidebar, chart, popover, etc.)
- Eliminar `@import 'tw-animate-css'`
- Eliminar `@custom-variant dark`
- Conservar solo: variables de marca (§2.3), tipografías (§2.1), y estilos base necesarios
- El archivo debe ser legible y documentado

**Criterio de aceptación**:
- `globals.css` tiene < 60 líneas (actualmente 126)
- Todas las variables definidas se usan en al menos un lugar

---

## Fase 4 — UI/UX y Diseño

### 4.1 Hero mejorado

**Spec**:
- Reemplazar overlay `bg-black/40` por un degradado de marca: `linear-gradient(to right, rgba(11,64,88,0.85) 0%, rgba(11,64,88,0.4) 60%, transparent 100%)` (más intenso a la izquierda donde va el texto)
- Parallax sutil en la imagen de fondo (CSS transform-based, no `background-attachment: fixed` que tiene problemas en mobile)
- Badge "Experiencias a tu medida" con animación de entrada (fade-in + slide-up con delay)
- CTA primario: cambiar texto de "Consultar por WhatsApp" → **"Armá tu viaje ahora"** (con ícono de Send)
- CTA secundario "Financiación disponible": mantener como badge informativo
- Agregar micro-copy debajo del CTA: "Respondemos en menos de 2 horas" (si es verdad)

**Nota sobre micro-copy**: Confirmar con los dueños si el tiempo de respuesta es real. No poner datos falsos.

**Criterio de aceptación**:
- El hero se siente premium y diferenciado
- El texto es siempre legible sobre el fondo (contraste WCAG AA mínimo)
- El parallax no causa jank en mobile

### 4.2 Destinos — Decisiones sobre datos ilustrativos

**Contexto**: Los destinos NO son paquetes reales en venta. Son ilustrativos.

**Spec**:
- Mantener los 4 destinos como inspiración/portfolio visual
- Cambiar el subtítulo de "Inspirate con algunas propuestas del mes" → "Algunos de los destinos que podemos armar para vos" (más honesto)
- Agregar CTA en cada tarjeta: "Consultá por este destino" que abra WhatsApp con mensaje pre-rellenado: "Hola, quiero consultar por un viaje a {destino}."
- **NO** agregar precios ya que no son paquetes reales

**Nota sobre sistema dinámico de paquetes**: Implementar un CMS o admin panel para que los dueños manejen destinos es un proyecto aparte. Si la agencia crece, esto se puede abordar en una Fase futura con un headless CMS (ej. Sanity, Strapi) o incluso un JSON estático que editen en GitHub. Pero no ahora.

**Criterio de aceptación**:
- Cada tarjeta tiene un CTA funcional a WhatsApp con mensaje específico por destino
- El copy no promete paquetes que no existen

### 4.3 Testimonios (branch `feature/testimonials`)

> ⚠️ **Esta feature va en branch separada** y NO se mergea a `development` hasta tener datos reales.

**Spec**:
- Crear componente `Testimonials.tsx`
- Layout: 2-3 tarjetas en grid horizontal (1 col mobile, 3 col desktop)
- Cada testimonial: nombre (primer nombre), destino, párrafo corto, rating con estrellas (opcional)
- Los datos se definen como constante en `lib/constants.ts` (migrable a CMS en el futuro)
- Placeholder data para desarrollo:
  ```ts
  const testimonials = [
    { name: "María", destination: "Río de Janeiro", text: "..." , rating: 5 },
    { name: "Carlos", destination: "Bariloche", text: "...", rating: 5 },
    { name: "Laura", destination: "Cartagena", text: "...", rating: 5 },
  ];
  ```

**Criterio de aceptación**:
- Componente funcional con datos placeholder
- No se mergea a `main`/`production` hasta reemplazar placeholders con datos reales

### 4.4 Trust Bar (nueva sección)

**Spec**:
- Ubicación: inmediatamente debajo del hero
- Contenido: badges de AFIP + Cámara de Turismo + "Legajo 20455" + "Financiación disponible" en una barra horizontal
- Fondo: `--brand-azul-petroleo` o gradiente oscuro de marca
- Layout: flex horizontal centrado, responsive (2x2 en mobile, 4 inline en desktop)
- Mover los badges del footer aquí (mantener en footer también pero como referencia secundaria)

**Criterio de aceptación**:
- Los elementos de confianza son visibles sin scrollear más de 1 viewport

### 4.5 CTA de cierre (nueva sección)

**Spec**:
- Ubicación: entre Servicios y Footer
- Fondo: degradado de marca o azul petróleo con textura sutil
- Título: "¿Listo para tu próximo viaje?" o similar
- CTA: "Hablá con nosotros" → WhatsApp
- Diferenciación del hero CTA: tono más cálido, menos "venta" y más "conversación"

**Criterio de aceptación**:
- El usuario tiene un CTA final visible antes del footer

### 4.6 Animaciones

**Spec**:
- **Scroll reveal**: Implementar con `IntersectionObserver` nativo (no librerías externas)
  - Cada sección hace fade-in + translate-y(20px) al entrar en viewport
  - Threshold: 0.15 (se activa cuando el 15% de la sección es visible)
  - Animación: `opacity 0→1, transform translateY(20px)→0` en 600ms con `ease-out`
  - Una sola vez (no re-animar al scrollear arriba)
- **Parallax hero**: transform-based (translateY al scrollear), limitado al hero, desactivado en `prefers-reduced-motion`
- **Micro-interacciones**:
  - Hover en tarjetas: ya existentes, mejorar con transición de borde sutil
  - Hover en CTAs: ya existentes, mantener
  - Navbar: transición de transparente a opaco al scrollear (implementar con IntersectionObserver en el hero)
- **`prefers-reduced-motion`**: Todas las animaciones deben respetar esta preferencia y desactivarse

**Criterio de aceptación**:
- Las animaciones son fluidas (60fps, no causan jank)
- `prefers-reduced-motion: reduce` desactiva todas las animaciones
- No se instalan dependencias externas para animaciones

### 4.7 Variación visual entre secciones

**Spec**:
- Alternar fondos entre secciones para crear ritmo visual:
  1. Navbar: `--brand-azul-petroleo` con blur
  2. Hero: imagen con overlay de marca
  3. Trust Bar: `--brand-azul-petroleo` sólido
  4. Propuesta de valor: blanco
  5. Quiénes somos: `--brand-crema` (#f9f9f9)
  6. Destinos: blanco
  7. Servicios: `--brand-crema`
  8. (Testimonios): blanco
  9. CTA cierre: degradado de marca
  10. Footer: `--brand-azul-petroleo`

**Criterio de aceptación**:
- No hay 3 secciones consecutivas con el mismo fondo
- Las transiciones entre secciones se sienten naturales

---

## Fase 5 — SEO y Meta Tags

### 5.1 Open Graph y meta tags

**Archivo**: `app/layout.tsx`

**Spec**:
- Mejorar metadata de Next.js:
  ```ts
  export const metadata: Metadata = {
    title: '787 Rumbos | Agencia de Viajes en Córdoba',
    description: 'Agencia de viajes en Córdoba, Argentina. Paquetes personalizados a Río de Janeiro, Bariloche, Cartagena y más. Financiación disponible. Asesoramiento humano por WhatsApp.',
    // Eliminar generator: 'v0.app'
    openGraph: {
      title: '787 Rumbos | Agencia de Viajes en Córdoba',
      description: 'Viajá con el respaldo de 787 Rumbos...',
      url: 'https://787rumbos.com.ar', // o la URL real
      siteName: '787 Rumbos',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
      locale: 'es_AR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '787 Rumbos | Agencia de Viajes en Córdoba',
      description: 'Viajá con el respaldo de 787 Rumbos...',
      images: ['/og-image.jpg'],
    },
    // ... robots, canonical, etc.
  };
  ```
- Crear imagen OG (`og-image.jpg`): 1200x630px, con logo de marca y texto atractivo
- Eliminar `generator: 'v0.app'`

**Criterio de aceptación**:
- Al compartir la URL en WhatsApp se ve preview con imagen, título y descripción
- No aparece "v0.app" en el source code

### 5.2 Robots, sitemap y structured data

**Spec**:
- Crear `public/robots.txt` con allow all + referencia a sitemap
- Crear `app/sitemap.ts` con generador de Next.js (una sola URL por ahora: `/`)
- Agregar JSON-LD en `layout.tsx` con schema `TravelAgency` + `LocalBusiness`:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "787 Rumbos",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Voz del Interior 8500",
      "addressLocality": "Córdoba",
      "addressCountry": "AR"
    },
    "telephone": "+5493516157398",
    "url": "https://787rumbos.com.ar"
  }
  ```

**Criterio de aceptación**:
- `robots.txt` accesible en `/robots.txt`
- Sitemap accesible en `/sitemap.xml`
- Schema validable en Google Rich Results Test

### 5.3 Accesibilidad básica

**Spec**:
- `aria-label` en todos los links de WhatsApp e Instagram
- `aria-label` en el `<nav>`
- Focus states visibles (ring) en todos los elementos interactivos
- Verificar contraste WCAG AA en texto sobre imágenes (especialmente hero)
- `alt` descriptivos en imágenes de destinos: incluir contexto ("Vista panorámica de Bariloche — paquete de 5 noches")

**Criterio de aceptación**:
- Lighthouse Accessibility > 90

---

## Fase 6 — Mobile-First Polish

### 6.1 Responsive desde 360px

**Spec**:
- Testar todos los componentes en: 360px (Galaxy S), 390px (iPhone 14), 414px (iPhone Plus), 768px (tablet), 1024px, 1280px+
- Ajustar font-size del h1 en mobile (actualmente `text-4xl` = 36px, puede ser grande en 360px)
- Verificar que ningún elemento cause overflow horizontal
- Touch targets mínimo 44x44px en todos los elementos interactivos

### 6.2 Navbar mobile

**Spec**:
- En mobile (< 768px): mostrar hamburger menu
- El menú despliega links de ancla a cada sección + CTA de WhatsApp
- Animación: slide-down o drawer desde la derecha
- Cerrar al tocar fuera o al navegar

**Nota**: Esto requiere un client component con state (`'use client'`). Es el primer componente que necesitará interactividad del lado del cliente.

### 6.3 WhatsApp floating button (mobile)

**Spec**:
- Botón flotante fijo en bottom-right (solo mobile, `md:hidden`)
- Icono de WhatsApp + subtle pulse animation
- `z-index` alto para estar siempre visible
- Desaparece cuando la sección del footer es visible (para no tapar el CTA del footer)

**Criterio de aceptación**:
- El botón es siempre accesible en mobile sin scrollear al navbar
- No tapa contenido importante
- Touch target >= 48x48px

---

## Constraints generales

- **No agregar dependencias npm** salvo que sea estrictamente necesario y justificado
- **No usar librerías de animación** (Framer Motion, GSAP) — CSS + IntersectionObserver nativo
- **No poner datos falsos en producción** (testimonios, precios, tiempos de respuesta)
- **No romper la URL actual** — si ya hay tráfico, las URLs deben seguir funcionando
- **Respetar `prefers-reduced-motion`** en todas las animaciones
- **Mobile-first**: diseñar para 360px primero, escalar a desktop después

---

## Branching Strategy

```
main (producción actual)
 └── development (todo el trabajo de las fases 1-6)
      └── feature/testimonials (Fase 4.3 — no mergear hasta tener datos reales)
```

- Todo el trabajo va a `development`
- Merge a `main` cuando esté completo y testeado
- `feature/testimonials` se mergea a `development` cuando se tengan testimonios reales
