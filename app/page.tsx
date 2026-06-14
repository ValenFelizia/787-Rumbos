/**
 * Comentarios añadidos con fines educativos.
 * page.tsx — Página de inicio (`/`).
 *
 * En el App Router, este archivo exporta el componente por defecto que Next.js
 * renderiza como `children` dentro de `app/layout.tsx`. Toda la landing está
 * declarada en un solo árbol JSX: datos en constantes al inicio y composición
 * con secciones semánticas más navegación y pie de página.
 */
import {
  BedDouble,
  Bus,
  Heart,
  HeartPulse,
  Instagram,
  MapPin,
  Plane,
  Send,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
  Wallet,
} from "lucide-react";
import { Inter, Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });
const whatsappApiLink =
  "https://api.whatsapp.com/send?phone=5493516157398&text=Hola%2C%20quiero%20consultar%20por%20un%20viaje.";

/** Lista de destinos: cada objeto describe una tarjeta (nombre, duración, ruta de imagen). */
const featuredDestinations = [
  {
    name: "Río de Janeiro",
    duration: "7 noches / 8 días",
    imageSrc: "/destino1.jpg",
  },
  {
    name: "Bariloche",
    duration: "5 noches / 6 días",
    imageSrc: "/destino2.jpg",
  },
  {
    name: "Cartagena",
    duration: "6 noches / 7 días",
    imageSrc: "/destino3.jpg",
  },
  {
    name: "Ushuaia",
    duration: "4 noches / 5 días",
    imageSrc: "/destino4.jpg",
  },
];

/**
 * Servicios: cada ítem incluye título, texto y referencia a un icono de Lucide.
 * Guardar el componente del icono en la propiedad `icon` permite renderizarlo
 * dinámicamente dentro del `.map()` (ver más abajo).
 */
const services = [
  {
    title: "Pasajes Aéreos",
    description: "Vuelos nacionales e internacionales con las mejores conexiones.",
    icon: Plane,
  },
  {
    title: "Alojamiento",
    description: "Hoteles y hospedajes seleccionados según tu estilo de viaje.",
    icon: BedDouble,
  },
  {
    title: "Traslados",
    description: "Movilidad segura aeropuerto-hotel-aeropuerto en destino.",
    icon: Bus,
  },
  {
    title: "Asistencia Médica",
    description: "Cobertura para que viajes tranquilo en cada tramo del recorrido.",
    icon: HeartPulse,
  },
];

export default function Home() {
  return (
    <main className={`${inter.className} min-h-screen bg-[#f9f9f9] text-[#0b4058]`}>
      {/* Barra superior: marca y enlace de contacto; se repite en todas las secciones visibles al hacer scroll */}
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#0b4058]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 md:py-4">
          <a href="/" className="inline-flex items-center transition duration-300 hover:opacity-90">
            <Image
              src="/logo.png"
              alt="Logo 787 Rumbos"
              width={280}
              height={56}
              priority
              className="h-12 w-auto object-contain md:h-14"
            />
          </a>
          <a
            href={whatsappApiLink}
            target="_blank"
            rel="noreferrer"
            className={`${montserrat.className} inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7a92a] to-[#e6b451] px-4 py-2 text-xs font-semibold text-[#0b4058] shadow-sm shadow-[#f7a92a]/30 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-md hover:shadow-[#f7a92a]/40 md:px-5 md:py-2.5 md:text-sm`}
          >
            <Send className="h-4 w-4" />
            Consultar por WhatsApp
          </a>
        </div>
      </nav>

      {/* Hero: primera impresión — titular, texto de apoyo y llamadas a la acción.
          La imagen de fondo usa el componente <Image> de Next.js con `priority` porque
          es el LCP (Largest Contentful Paint): el elemento más grande de la página y el
          que Google mide para calcular el score de performance. Con `fill` + `object-cover`
          replicamos el comportamiento visual del antiguo background-image CSS, pero ahora
          Next.js genera automáticamente versiones WebP/AVIF y las sirve desde el CDN de Vercel. */}
      <section className="relative flex min-h-[calc(100vh-73px)] items-center overflow-hidden">
        {/* Imagen de fondo optimizada — priority evita lazy loading en el LCP */}
        <Image
          src="/hero-bg.jpg"
          alt="Paisaje de viaje — 787 Rumbos agencia de viajes en Córdoba"
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay: degradado de marca (más intenso a la izquierda donde va el texto) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b4058]/85 via-[#0b4058]/50 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-24 text-white md:py-28">
          <div className="max-w-3xl space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#dae553]/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[#dae553]" />
              Experiencias a tu medida
            </span>
            <h1
              className={`${montserrat.className} text-4xl font-extrabold leading-tight tracking-tight md:text-6xl`}
            >
              Descubrí el mundo con el acompañamiento cercano de 787 Rumbos
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/90 md:text-[1.08rem]">
              Diseñamos propuestas personalizadas para que viajes con tranquilidad, respaldo y una
              atención realmente humana de principio a fin.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <a
                  href={whatsappApiLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Consultar por WhatsApp — abre WhatsApp en una nueva pestaña"
                  className={`${montserrat.className} inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7a92a] to-[#e6b451] px-6 py-3 font-semibold text-[#0b4058] shadow-md shadow-[#f7a92a]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#f7a92a]/40`}
                >
                  <Send className="h-4 w-4" />
                  Armá tu viaje ahora
                </a>
                {/* Micro-copy de confianza: debajo del CTA principal */}
                <span className="pl-1 text-xs text-white/70">Respondemos en menos de 2 horas</span>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#a2c745] bg-white/95 px-4 py-2 text-sm text-[#006183] shadow-sm shadow-[#0b4058]/10">
                <Wallet className="h-4 w-4" />
                Financiación disponible
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Propuesta de valor: mensaje central y tres pilares fijos (tarjetas estáticas, sin lista desde array) */}
      <section className="border-y border-[#0b4058]/10 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl`}>
            Tu viaje, nuestra prioridad
          </h2>
          <p className="mt-5 max-w-4xl text-[1.02rem] leading-relaxed text-[#0b4058]/80">
            En 787 Rumbos creemos que cada pasajero es único. No usamos respuestas automáticas ni
            te dejamos solo. Nuestro mayor capital es la atención humana: te escuchamos, entendemos
            lo que buscás y te acompañamos personalmente desde el primer mensaje de WhatsApp hasta
            que volvés a casa con una sonrisa.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl bg-white p-7 shadow-md shadow-[#0b4058]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0b4058]/15">
              <Heart className="h-8 w-8 text-[#e6b451]" />
              <h3 className={`${montserrat.className} mt-4 text-xl font-bold`}>Pasión por viajar</h3>
              <p className="mt-2 text-sm text-[#0b4058]/80">
                Cada propuesta lleva nuestra dedicación y cuidado por los detalles.
              </p>
            </article>
            <article className="rounded-2xl bg-white p-7 shadow-md shadow-[#0b4058]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0b4058]/15">
              <Users className="h-8 w-8 text-[#e6b451]" />
              <h3 className={`${montserrat.className} mt-4 text-xl font-bold`}>Atención humana</h3>
              <p className="mt-2 text-sm text-[#0b4058]/80">
                Hablás directo con nosotros. Te asesoramos con paciencia y calidez en cada paso.
              </p>
            </article>
            <article className="rounded-2xl bg-white p-7 shadow-md shadow-[#0b4058]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0b4058]/15">
              <ShieldCheck className="h-8 w-8 text-[#e6b451]" />
              <h3 className={`${montserrat.className} mt-4 text-xl font-bold`}>
                Respaldo y experiencia
              </h3>
              <p className="mt-2 text-sm text-[#0b4058]/80">
                Años en el rubro del transporte turístico nos avalan para recomendarte siempre la
                mejor opción.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* “Quiénes somos”: narrativa de la agencia con imagen y texto en dos columnas */}
      <section className="bg-[#f9f9f9]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-12 md:items-center md:gap-12">
          <div className="group overflow-hidden rounded-2xl shadow-md shadow-[#0b4058]/10 md:col-span-5">
            <Image
              src="/nosotros.png"
              alt="Equipo de 787 Rumbos — agencia de viajes en el Aeropuerto de Córdoba"
              width={800}
              height={600}
              sizes="(max-width: 768px) 100vw, 42vw"
              className="h-[300px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] md:h-[420px]"
            />
          </div>
          <div className="md:col-span-7 md:pl-4">
            <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl`}>
              De la terminal al mundo
            </h2>
            <p className="mt-5 max-w-2xl text-[1.03rem] leading-relaxed text-[#0b4058]/80">
              Llevamos años dedicados al rubro del transporte y el turismo. Conocemos lo que
              significa viajar porque lo vivimos todos los días desde nuestro local en el
              aeropuerto. Decidimos abrir 787 Rumbos para ir un paso más allá y ofrecer a nuestros
              pasajeros el acompañamiento total que siempre quisimos darles.
            </p>
          </div>
        </div>
      </section>

      {/*
        Destinos destacados: las tarjetas se generan desde `featuredDestinations`.

        Cómo funciona `.map()` aquí:
        1) `featuredDestinations` es un array de objetos; `.map()` recorre cada elemento
           y, por cada uno, ejecuta la función flecha y devuelve un nuevo array del mismo
           tamaño cuyos ítems son nodos React (aquí, un <article> por destino).
        2) La función recibe `destination`: el objeto actual (name, duration, imageSrc).
           Esas propiedades se “inyectan” en el JSX como expresiones entre llaves:
           `destination.name` en el título y el alt de la imagen, `destination.imageSrc`
           en `Image`, `destination.duration` en el párrafo.
        3) `key={destination.name}` le dice a React qué fila es cuál en la lista. Las keys
           deben ser estables y únicas entre hermanos para que el reconciliador pueda
           actualizar el DOM de forma eficiente cuando el array cambie.
        4) El resultado del `.map()` es un array de elementos; React lo acepta como hijos
           del contenedor (grid) y lo renderiza en orden.
      */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl`}>
              Destinos destacados
            </h2>
            <p className="mt-2 text-[#0b4058]/75">Algunos de los destinos que podemos armar para vos.</p>
          </div>
        </div>
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
          {featuredDestinations.map((destination) => (
            <article
              key={destination.name}
              className="group overflow-hidden rounded-2xl border border-[#0b4058]/10 bg-white shadow-sm shadow-[#0b4058]/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#0b4058]/20 hover:shadow-xl hover:shadow-[#0b4058]/15"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={destination.imageSrc}
                  alt={`${destination.name} — paquete de viaje con 787 Rumbos`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="space-y-3 p-6">
                <h3
                  className={`${montserrat.className} text-[1.35rem] font-bold leading-tight transition-colors duration-300 group-hover:text-[#006183]`}
                >
                  {destination.name}
                </h3>
                <p className="flex items-center gap-2 text-sm font-medium text-[#0b4058]/80">
                  <Timer className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  {destination.duration}
                </p>
                {/* CTA por destino: el mensaje de WhatsApp se pre-rellena con el nombre del destino */}
                <a
                  href={`https://api.whatsapp.com/send?phone=5493516157398&text=Hola%2C%20quiero%20consultar%20por%20un%20viaje%20a%20${encodeURIComponent(destination.name)}.`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Consultar por viaje a ${destination.name} — abre WhatsApp`}
                  className={`${montserrat.className} mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b4058] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#006183]`}
                >
                  <Send className="h-3.5 w-3.5" />
                  Consultá este destino
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/*
        Servicios: otra lista construida con `.map()`, esta vez sobre `services`.

        Diferencia clave con destinos: cada ítem trae `icon: Plane`, etc. En React los
        nombres de componente deben empezar con mayúscula. Por eso dentro del callback
        hacemos `const Icon = service.icon`: guardamos la referencia al componente en
        una variable con mayúscula y luego renderizamos `<Icon />`. Si escribiéramos
        `<service.icon />` fallaría la sintaxis; si renderizáramos el icono como función
        sin asignarlo a una variable en mayúscula, React lo trataría como elemento DOM.

        El flujo de datos es el mismo: por cada `service`, `service.title` y
        `service.description` alimentan el texto; `key={service.title}` identifica la fila.
      */}
      <section className="border-t border-[#0b4058]/10 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl`}>
            Servicios que resolvemos por vos
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="rounded-2xl border border-[#0b4058]/10 bg-[#f9f9f9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#a2c745] hover:bg-white hover:shadow-xl hover:shadow-[#0b4058]/10"
                >
                  <Icon className="h-8 w-8 text-[#006183]" />
                  <h3 className={`${montserrat.className} mt-4 text-lg font-bold`}>{service.title}</h3>
                  <p className="mt-2 text-sm text-[#0b4058]/80">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pie: datos legales, ubicación y enlaces; contenido fijo, no depende de arrays */}
      <footer className="bg-[#0b4058] text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-14 md:grid-cols-3">
          <div>
            <Image
              src="/logo.png"
              alt="Logo 787 Rumbos"
              width={300}
              height={64}
              className="h-12 w-auto object-contain brightness-0 invert md:h-14"
            />
            <p className="mt-4 text-sm text-white/80">
              Agencia habilitada - Legajo 20455.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#dae553]" />
              Aeropuerto Internacional de Córdoba, Av. Voz del Interior 8500
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#dae553]" />
              Asesoramiento profesional y cobertura integral
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <a
              href={whatsappApiLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white/90 transition hover:text-[#dae553]"
            >
              <Send className="h-4 w-4" />
              Atención Personalizada: +54 9 351 615-7398
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=5493513448724"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white/90 transition hover:text-[#dae553]"
            >
              <Send className="h-4 w-4" />
              Administración/Agencia: +54 9 351 344-8724
            </a>
            <a
              href="https://www.instagram.com/787rumbos/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white/90 transition hover:text-[#dae553]"
            >
              <Instagram className="h-4 w-4" />
              Instagram: @787rumbos
            </a>
          </div>
        </div>
        <div className="mx-auto mt-8 flex w-full max-w-6xl flex-wrap items-center justify-center gap-6 border-t border-white/10 px-6 pb-8 pt-8">
          <a
            href="http://qr.afip.gob.ar/?qr=Huvxa1kUae-1lE_yjNzL2w,,"
            target="_F960AFIPInfo"
            rel="noreferrer"
            className="inline-flex h-12 items-center transition-opacity hover:opacity-80"
          >
            <img
              src="/afip.jpg?v=20260503"
              alt="Data Fiscal ARCA"
              className="h-full w-auto object-contain"
            />
          </a>
    
          <div className="inline-flex h-12 items-center">
            <Image
              src="/camara-turismo.png"
              alt="Miembro Cámara de Turismo de la Provincia de Córdoba"
              width={200}
              height={80}
              sizes="200px"
              className="h-full w-auto object-contain transition-opacity hover:opacity-80"
            />
          </div>
          <p className="text-center text-sm text-white/70">
            ©787 Rumbos® - Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}