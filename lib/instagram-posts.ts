/**
 * lib/instagram-posts.ts
 *
 * Piezas curadas del feed social de la home.
 * `permalink` apunta a la publicación; si falta, el CTA cae al perfil.
 */
export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/787rumbos/";

export interface InstagramPost {
  id: number;
  imageSrc: string;
  caption: string;
  alt: string;
  /** URL de la publicación; omitir si aún no está disponible. */
  permalink?: string;
}

export const instagramPosts: InstagramPost[] = [
  {
    id: 1,
    imageSrc: "/instagram/post1.jpg",
    caption:
      "3 TIPS para tus viajes: 1. Recuerdos: dejá un espacio en la valija. 2. Viví el momento sin cámara. 3. Conectá, sonreí y agradecé. ¡Guardá este post para tu próxima aventura! 🎒✨",
    alt: "Flyer informativo con 3 tips para viajes por 787 Rumbos",
    permalink: "https://www.instagram.com/p/DXNbJLojSyi/",
  },
  {
    id: 2,
    imageSrc: "/instagram/post2.png",
    caption:
      "¿Planeando tu próximo viaje? Recordá que podés financiar tus pasajes en cuotas. Consultá las opciones de financiación vigentes con nuestros asesores. ✈️💳",
    alt: "Vista aérea desde la ventana de un avión con nubes",
    permalink: "https://www.instagram.com/p/DYVkVO9DTf9/",
  },
  {
    id: 3,
    imageSrc: "/instagram/post3.png",
    caption: "¡Un descanso bien merecido!🌴🍹",
    alt: "Playa paradisíaca en el Caribe con reposeras y palmeras",
    // Permalink pendiente: Valen aún no encontró el post original.
  },
  {
    id: 4,
    imageSrc: "/instagram/post4.png",
    caption:
      "🌴 Brasil te espera ✈️. Playas increíbles, calor todo el año y opciones para todos los gustos.",
    alt: "Vista panorámica de playas de Brasil con aguas cristalinas y arena blanca",
    permalink: "https://www.instagram.com/p/DXIXc_yjbu2/",
  },
  {
    id: 5,
    imageSrc: "/instagram/post5.png",
    caption:
      "Viajar se disfruta el doble cuando se comparte. Una playa, un brindis, una escapada juntos… 💛🌊🥂",
    alt: "Grupo de personas haciendo trekking en un sendero montañoso",
    permalink: "https://www.instagram.com/p/DUvVM4HEcR-/",
  },
  {
    id: 6,
    imageSrc: "/instagram/post6.png",
    caption:
      "El Caribe te está esperando 🌴☀️. Playas de agua turquesa, all inclusive, vuelos desde Córdoba y todo resuelto para que vos solo disfrutes.",
    alt: "Playa paradisíaca en el Caribe con reposeras y palmeras",
    permalink: "https://www.instagram.com/p/DUOAUP2jT_q/",
  },
];
