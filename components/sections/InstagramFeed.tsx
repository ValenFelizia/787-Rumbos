import Image from "next/image";

interface InstagramPost {
  id: number;
  imageSrc: string;
  caption: string;
  alt: string;
}

const instagramPosts: InstagramPost[] = [
  {
    id: 1,
    imageSrc: "/instagram/post1.jpg",
    caption: "3 TIPS para tus viajes: 1. Recuerdos: dejá un espacio en la valija. 2. Viví el momento sin cámara. 3. Conectá, sonreí y agradecé. ¡Guardá este post para tu próxima aventura! 🎒✨",
    alt: "Flyer informativo con 3 tips para viajes por 787 Rumbos"
  },
  {
    id: 2,
    imageSrc: "/instagram/post2.png",
    caption: "¿Planeando tu próximo viaje? Recordá que podés financiar tus pasajes en cuotas. Consultá las opciones de financiación vigentes con nuestros asesores. ✈️💳",
    alt: "Vista aérea desde la ventana de un avión con nubes"
  },
  {
    id: 3,
    imageSrc: "/instagram/post3.png",
    caption: "¡Un descanso bien merecido!🌴🍹",
    alt: "Playa paradisíaca en el Caribe con reposeras y palmeras"
  },
  {
    id: 4,
    imageSrc: "/instagram/post4.png",
    caption: "🌴 Brasil te espera en Junio 2026 ✈️. Playas increíbles, calor todo el año y opciones para todos los gustos.",
    alt: "Vista panorámica de playas de Brasil con aguas cristalinas y arena blanca"
  },
  {
    id: 5,
    imageSrc: "/instagram/post5.png",
    caption: "Viajar se disfruta el doble cuando se comparte. Una playa, un brindis, una escapada juntos… 💛🌊🥂",
    alt: "Grupo de personas haciendo trekking en un sendero montañoso"
  },
  {
    id: 6,
    imageSrc: "/instagram/post6.png",
    caption: "El Caribe te está esperando 🌴☀️. Playas de agua turquesa, all inclusive, vuelos desde Córdoba y todo resuelto para que vos solo disfrutes.",
    alt: "Playa paradisíaca en el Caribe con reposeras y palmeras"
  }
];

export function InstagramFeed() {
  return (
    <section className="bg-white border-t border-[#0b4058]/5 py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Encabezado */}
        <div className="mb-12 text-center space-y-3">
          <h2 className="font-[family-name:var(--font-brand-heading)] text-3xl font-extrabold tracking-tight md:text-4xl text-[#0b4058]">
            Comunidad 787 Rumbos
          </h2>
          <p className="max-w-xl mx-auto text-[#0b4058]/80 text-sm md:text-base leading-relaxed text-pretty">
            Compartimos consejos, novedades de aerolíneas, fotos reales de viajes y las próximas salidas en nuestra cuenta.
          </p>
        </div>

        {/* Grilla de Publicaciones */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/787rumbos/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl border border-[#0b4058]/10 bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.96] cursor-pointer"
            >
              {/* Imagen */}
              <Image
                src={post.imageSrc}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Outline de imagen para mantener profundidad uniforme */}
              <div className="absolute inset-0 border border-black/5 rounded-xl pointer-events-none" />

              {/* Overlay en Hover */}
              <div className="absolute inset-0 bg-[#0b4058]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
                <svg
                  className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>

                <p className="text-[10px] leading-relaxed line-clamp-3 text-white/95">
                  {post.caption}
                </p>

                <span className="text-[9px] font-black uppercase tracking-wider text-[#dae553]">
                  Ver en Instagram →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Botón de Conversión */}
        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/787rumbos/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-brand-heading)] inline-flex items-center gap-2 rounded-xl bg-[#0b4058] hover:bg-[#006183] text-white px-7 py-3 text-xs font-black shadow-md transition-all duration-200 active:scale-[0.96] cursor-pointer"
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>Seguinos en @787rumbos</span>
          </a>
        </div>
      </div>
    </section>
  );
}
