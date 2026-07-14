# 787 Rumbos — Especificaciones vigentes

> **Última actualización:** 2026-07-13
> **Estado:** la base del producto está implementada. Se priorizan la operación
> comercial, la vigencia del contenido y el crecimiento local antes de nuevas
> funcionalidades.

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
- El servicio combina viajes emisivos, vuelos, paquetes y pasajes de ómnibus de
  Vía Bariloche, Vía Tac y El Valle.
- La jerarquía del mensaje debe partir de diferenciales verificables: presencia
  física en el aeropuerto, experiencia en transporte y oferta aérea + terrestre.
  La atención humana y el acompañamiento deben explicarse con evidencia y un
  alcance operativo concreto; “sin bots” no debe funcionar como promesa central.
- Toda promesa pública de tiempo de respuesta o asistencia durante el viaje debe
  corresponder a una operación sostenible y explicitar, donde corresponda, canal,
  horarios, incidencias cubiertas y límites. El sitio no debe sugerir soporte 24/7
  si ese servicio no existe.

## Datos oficiales y contenido comercial

Los datos NAP publicados en footer, schema y Google Business Profile deben
mantenerse consistentes:

| Dato | Valor canónico |
| --- | --- |
| Nombre comercial | 787 Rumbos |
| Dirección | Av. La Voz del Interior 8500, Córdoba, Argentina |
| Referencia | Hall de arribos, dentro del local oficial de Vía Bariloche |
| Código postal | X5147XAA |
| WhatsApp comercial | 0351 615-7398 (`+54 9 351 615-7398`) |
| Administración/agencia | 0351 344-8724 (`+54 9 351 344-8724`) |

Debe existir un canal público principal inequívoco. Una vez definido, footer,
schema, Google Business Profile, enlaces de contacto y citaciones deben reflejar
el rol correcto de cada número sin presentar ambos como alternativas equivalentes.

Precios, salidas, disponibilidad, promociones, fotos y testimonios deben ser
reales, vigentes y verificables. Las promociones con fecha de finalización deben
ocultarse al vencer. No deben presentarse testimonios ficticios como si fueran
reales. Las solicitudes de reseñas deben dirigirse a clientes reales, sin
incentivos, selección de opiniones positivas ni texto dictado.

## Comportamiento vigente del producto

- La landing ofrece CTAs de WhatsApp y un cotizador de tres pasos para
  preclasificar las consultas; los CTAs pueden preseleccionar el destino.
- El catálogo incluye rutas dinámicas de destinos, SEO específico por destino,
  FAQ con schema `FAQPage`, highlights, breadcrumbs, destinos relacionados y
  sitemap actualizado.
- Los hubs de Brasil, Caribe, Argentina en bus y salidas grupales desde Córdoba
  están publicados y enlazados con el catálogo y las fichas de destino.
- La home no publica testimonios mientras solo existan datos de ejemplo. Cuando
  haya prueba social real y autorizada, debe aparecer cerca del catálogo o de un
  punto de decisión comercial, sin desplazar la información esencial de servicios.
- En la home, el hero y la propuesta de valor priorizan la oficina en el
  Aeropuerto de Córdoba, la experiencia en transporte y la oferta aérea +
  terrestre. La sección de Servicios precede al feed social (“Comunidad”).
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
  deben seguir alineados con las páginas que se publiquen.

## Operación y evolución

- Google Business Profile, fotos del local/equipo, reseñas reales, citaciones y
  consistencia NAP son la prioridad antes de aumentar inversión publicitaria.
- La pauta paga requiere GBP verificado y seguimiento estable de leads.
- El CMS se evalúa únicamente cuando mantener `lib/destinations-data.ts` a mano
  resulte una limitación real.
- El blog y la expansión de FAQs deben responder a demanda validada; evitar
  contenido genérico sin intención de búsqueda.

## Forma de trabajo y ramas

- `.csdd/` es la fuente de verdad versionada para estado operativo y
  especificaciones; cada verdad debe vivir en el documento que corresponda.
- `development` es la rama de trabajo. Las integraciones hacia `master` las
  realiza manualmente el usuario después de validar los cambios.
- El historial de implementación no se mantiene en el estado activo: Git es la
  fuente para el detalle histórico y el análisis extenso permanece en `docs/`.
