import Image from "next/image";
import {
  INSTAGRAM_PROFILE_URL,
  instagramPosts,
} from "@/lib/instagram-posts";

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
          {instagramPosts.map((post) => {
            const href = post.permalink ?? INSTAGRAM_PROFILE_URL;
            const opensSpecificPost = Boolean(post.permalink);

            return (
              <a
                key={post.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={
                  opensSpecificPost
                    ? `Ver publicación de Instagram: ${post.alt}`
                    : `Ver @787rumbos en Instagram (publicación pendiente de enlace)`
                }
                className="group relative aspect-square overflow-hidden rounded-xl border border-[#0b4058]/10 bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.96] cursor-pointer"
              >
                <Image
                  src={post.imageSrc}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 border border-black/5 rounded-xl pointer-events-none" />

                <div className="absolute inset-0 bg-[#0b4058]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
                  <svg
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>

                  <p className="text-[10px] leading-relaxed line-clamp-3 text-white/95 text-pretty">
                    {post.caption}
                  </p>

                  <span className="text-[9px] font-black uppercase tracking-wider text-[#dae553]">
                    {opensSpecificPost ? "Ver publicación →" : "Ver en Instagram →"}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Botón de Conversión */}
        <div className="mt-12 text-center">
          <a
            href={INSTAGRAM_PROFILE_URL}
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
              aria-hidden
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
