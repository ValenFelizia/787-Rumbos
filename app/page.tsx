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

      <section className="relative flex min-h-[calc(100vh-73px)] items-center bg-[url('/hero-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-24 text-white md:py-28">
          <div className="max-w-3xl space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#dae553]/30 px-4 py-2 text-sm font-medium text-white">
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
              <a
                href={whatsappApiLink}
                target="_blank"
                rel="noreferrer"
                className={`${montserrat.className} inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7a92a] to-[#e6b451] px-6 py-3 font-semibold text-[#0b4058] shadow-md shadow-[#f7a92a]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#f7a92a]/40`}
              >
                <Send className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#a2c745] bg-white/95 px-4 py-2 text-sm text-[#006183] shadow-sm shadow-[#0b4058]/10">
                <Wallet className="h-4 w-4" />
                Financiación disponible
              </span>
            </div>
          </div>
        </div>
      </section>

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

      <section className="bg-[#f9f9f9]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-12 md:items-center md:gap-12">
          <div className="group overflow-hidden rounded-2xl shadow-md shadow-[#0b4058]/10 md:col-span-5">
            <Image
              src="/nosotros.png"
              alt="Fundadores de 787 Rumbos"
              width={800}
              height={600}
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

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl`}>
              Destinos destacados
            </h2>
            <p className="mt-2 text-[#0b4058]/75">Inspirate con algunas propuestas del mes.</p>
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
                  alt={destination.name}
                  fill
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
              </div>
            </article>
          ))}
        </div>
      </section>

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
      </footer>
    </main>
  );
}