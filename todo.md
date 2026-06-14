# 787 Rumbos — TODO

> Derivado de [`specs.md`](./specs.md). Actualizar a medida que avanzamos.
> Convención: `[ ]` pendiente · `[/]` en progreso · `[x]` completado
>
> **Branch**: `development` (salvo donde se indique)

---

## Fase 1 — Performance

- [x] **1.1** Activar optimización de imágenes en `next.config.mjs`
  - [x] Eliminar `images: { unoptimized: true }` → reemplazado por `formats: ["image/avif", "image/webp"]`
  - [x] Eliminar `typescript: { ignoreBuildErrors: true }`
  - [ ] Verificar `npm run build` sin errores (en progreso...)
- [x] **1.2** Refactorizar hero image
  - [x] Reemplazar `bg-[url('/hero-bg.jpg')]` por `<Image>` de Next.js
  - [x] Agregar `priority`, `fill`, `sizes="100vw"`, `quality={80}`
  - [x] Overlay reemplazado por degradado de marca (`from-[#0b4058]/85`)
  - [x] CTA hero: "Consultar por WhatsApp" → "Armá tu viaje ahora"
  - [x] Micro-copy agregado: "Respondemos en menos de 2 horas"
  - [x] `aria-label` agregado al CTA de WhatsApp del hero
  - [x] Subtexto destinos: "propuestas del mes" → texto más honesto
  - [ ] `placeholder="blur"` con blurDataURL (pendiente — requiere import estático)
- [x] **1.3** Optimizar imágenes restantes
  - [x] Agregar `sizes` a imagen de "nosotros"
  - [x] Agregar `sizes` + alt mejorado a imágenes de destinos
  - [x] CTA por tarjeta de destino con mensaje pre-rellenado por destino
  - [x] Lazy loading en imágenes below-the-fold (default de Next.js `<Image>`)
- [x] **1.4** Limpiar imágenes no usadas de `/public`
  - [x] Eliminados: placeholder.jpg, placeholder.svg, placeholder-logo.*, placeholder-user.jpg
  - [x] Eliminados: icon.svg, icon-dark-32x32.png, icon-light-32x32.png, apple-icon.png
- [ ] **Verificación Fase 1**: `npm run build` en progreso...

---

## Fase 2 — Identidad de Marca

- [ ] **2.1** Tipografías de marca
  - [ ] Copiar fuentes Elaine Sans + Zalando Sans a `/public/fonts/`
  - [ ] Registrar `@font-face` en `globals.css` con `font-display: swap`
  - [ ] Configurar con `next/localFont` o `@font-face` directo
  - [ ] Reemplazar Montserrat → Elaine Sans (títulos)
  - [ ] Reemplazar Inter → Zalando Sans (cuerpo)
  - [ ] Eliminar imports de Geist/Geist_Mono de `layout.tsx`
  - [ ] Verificar que no se cargan fuentes de Google Fonts
- [ ] **2.2** Iconografía de marca
  - [ ] Copiar iconos relevantes (avión, hotel, brújula, maleta) a `/public/icons/`
  - [ ] Reemplazar iconos Lucide en sección Servicios
  - [ ] Reemplazar iconos Lucide en sección Propuesta de Valor
  - [ ] Mantener Lucide para iconos funcionales (Send, MapPin, Instagram, etc.)
- [ ] **2.3** Paleta de marca como CSS variables
  - [ ] Definir custom properties en `:root` de `globals.css`
  - [ ] Definir gradientes de marca como variables
  - [ ] Migrar colores hardcodeados gradualmente durante componentización

---

## Fase 3 — Arquitectura y Limpieza

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
  - [ ] Verificar que la página se ve idéntica antes y después (build en curso...)
- [x] **3.2** Limpieza de dependencias
  - [x] Eliminar todos los archivos en `components/ui/` (57 archivos)
  - [x] Eliminar `components/theme-provider.tsx`
  - [x] Eliminar `components.json`
  - [x] Eliminar `styles/` (globals.css duplicado)
  - [x] Eliminar `hooks/` (use-mobile.ts, use-toast.ts — boilerplate shadcn)
  - [x] Eliminar `lib/utils.ts` (solo tenía cn() de shadcn) y recrear `lib/constants.ts` limpio
  - [x] Eliminar 126 paquetes npm no usados (`npm uninstall` masivo)
  - [x] Eliminar `tw-animate-css` de devDependencies
  - [x] De 193 paquetes → 66 paquetes
  - [ ] Verificar `npm run build` sin errores (en curso...)
- [x] **3.3** Limpiar `globals.css`
  - [x] Eliminar variables shadcn no usadas (dark, sidebar, chart, etc.) — 126 líneas → 45
  - [x] Eliminar `@import 'tw-animate-css'`
  - [x] Eliminar `@custom-variant dark`
  - [x] Definir paleta de marca como variables CSS (--brand-azul-petroleo, --brand-dorado, etc.)
  - [x] Definir gradientes de marca como variables CSS

---

## Fase 4 — UI/UX y Diseño

- [ ] **4.1** Hero mejorado
  - [ ] Reemplazar overlay por degradado de marca (más intenso donde va el texto)
  - [ ] Implementar parallax sutil (CSS transform-based)
  - [ ] Animación de entrada del badge "Experiencias a tu medida"
  - [ ] Cambiar CTA: "Consultar por WhatsApp" → "Armá tu viaje ahora"
  - [ ] Evaluar micro-copy debajo del CTA (confirmar dato real con dueños)
- [ ] **4.2** Destinos mejorados
  - [ ] Cambiar subtítulo a algo más honesto (no son paquetes reales)
  - [ ] Agregar CTA por tarjeta con mensaje pre-rellenado por destino
- [ ] **4.3** Testimonios (**branch `feature/testimonials`**)
  - [ ] Crear `Testimonials.tsx` con datos placeholder
  - [ ] Layout: 1 col mobile, 3 col desktop
  - [ ] NO mergear a production hasta tener datos reales
- [ ] **4.4** Trust Bar (nueva)
  - [ ] Crear `TrustBar.tsx` debajo del hero
  - [ ] Incluir: AFIP, Cámara de Turismo, Legajo, Financiación
  - [ ] Responsive: 2x2 mobile, 4 inline desktop
- [ ] **4.5** CTA de cierre (nueva)
  - [ ] Crear `CTASection.tsx` entre Servicios y Footer
  - [ ] Copy diferenciado del hero (tono más cálido)
- [ ] **4.6** Animaciones
  - [ ] Implementar scroll reveal con IntersectionObserver
  - [ ] Transición navbar transparente → opaco
  - [ ] Mejorar hovers en tarjetas
  - [ ] Respetar `prefers-reduced-motion`
- [ ] **4.7** Variación visual entre secciones
  - [ ] Alternar fondos (blanco, crema, azul petróleo)
  - [ ] Verificar que no hay 3 secciones con mismo fondo seguidas

---

## Fase 5 — SEO y Meta

- [ ] **5.1** Open Graph y meta tags
  - [ ] Mejorar title y description en `layout.tsx`
  - [ ] Agregar Open Graph tags completos
  - [ ] Agregar Twitter Card tags
  - [ ] Crear imagen OG (1200x630px)
  - [ ] Eliminar `generator: 'v0.app'`
- [ ] **5.2** Robots, sitemap, structured data
  - [ ] Crear `public/robots.txt`
  - [ ] Crear `app/sitemap.ts`
  - [ ] Agregar JSON-LD `TravelAgency` + `LocalBusiness`
- [ ] **5.3** Accesibilidad básica
  - [ ] Agregar `aria-label` a links de WhatsApp/Instagram
  - [ ] Agregar `aria-label` al `<nav>`
  - [ ] Definir focus states visibles
  - [ ] Mejorar alt texts de imágenes de destinos
  - [ ] Verificar contraste WCAG AA en hero
  - [ ] Lighthouse Accessibility > 90

---

## Fase 6 — Mobile-First Polish

- [ ] **6.1** Responsive desde 360px
  - [ ] Testar en 360px, 390px, 414px, 768px, 1024px, 1280px+
  - [ ] Ajustar font-size de h1 en mobile
  - [ ] Verificar no hay overflow horizontal
  - [ ] Touch targets >= 44x44px
- [ ] **6.2** Navbar mobile
  - [ ] Implementar hamburger menu (< 768px)
  - [ ] Links de ancla a secciones
  - [ ] Animación slide-down o drawer
- [ ] **6.3** WhatsApp floating button (mobile)
  - [ ] Botón flotante bottom-right (solo mobile)
  - [ ] Pulse animation sutil
  - [ ] Ocultar cuando footer es visible

---

## Post-launch / Futuro (no parte de este sprint)

- [ ] Considerar headless CMS para gestión de destinos por parte de los dueños
- [ ] Blog / contenido SEO si crece el tráfico orgánico
- [ ] Página de destino individual (`/destinos/bariloche`) si se activan paquetes reales
- [ ] Dark mode (solo si hay demanda real)
- [ ] i18n (español/inglés/portugués) si buscan turismo receptivo

---

## Notas y Cambios

| Fecha | Nota |
|-------|------|
| 2026-06-14 | Plan inicial creado y aprobado por el usuario |
| 2026-06-14 | Confirmado: destinos son ilustrativos, no paquetes reales |
| 2026-06-14 | Confirmado: testimonios van en branch separada |
| 2026-06-14 | Confirmado: branching strategy → `main` ← `development` ← `feature/testimonials` |
