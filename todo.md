# 787 Rumbos — TODO

> Derivado de [`specs.md`](./specs.md). Actualizar a medida que avanzamos.
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
- [ ] **4.3** Testimonios (**branch `feature/testimonials`**)
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
          el CTA de WhatsApp en la navbar es suficiente acceso en mobile)
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

- [ ] Imagen OG 1200×630px (requiere diseño)
- [ ] Google Business Profile — clave para SEO local en Córdoba
- [ ] Testimonios reales (branch `feature/testimonials` lista para cuando lleguen los datos)
- [ ] Headless CMS si los dueños quieren gestionar destinos sin tocar código
- [ ] Blog / contenido SEO si crece el tráfico orgánico
- [ ] Página de destino individual (`/destinos/bariloche`) si se activan paquetes reales

---

## Notas y Cambios

| Fecha | Nota |
|-------|------|
| 2026-06-14 | Plan inicial creado y aprobado por el usuario |
| 2026-06-14 | Confirmado: destinos son ilustrativos, no paquetes reales |
| 2026-06-14 | Confirmado: testimonios van en branch separada (`feature/testimonials`) |
| 2026-06-14 | Confirmado: branching strategy → `main` ← `development` ← `feature/testimonials` |
| 2026-06-14 | Fases 1→5 completadas y mergeadas a `main` |
| 2026-06-14 | Fase 2 (tipografías) unificada con Fase 4 — implementadas juntas |
| 2026-06-14 | Parallax descartado — puede perjudicar mobile y Core Web Vitals |
