import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";

export type SeoImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type BuildPageMetadataInput = {
  title: string;
  description: string;
  /** Ruta del sitio, p. ej. `/destinos/bariloche`. */
  path: string;
  /** Si se omite, Twitter/OG reusan `description`. */
  socialDescription?: string;
  images?: SeoImage[];
};

/**
 * Metadata de página con canonical + Open Graph + Twitter alineados.
 * Las páginas que overridean title/description deben pasar por acá (o
 * declarar `twitter` a mano) para no heredar el card genérico del layout.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  socialDescription,
  images,
}: BuildPageMetadataInput): Metadata {
  const url = siteUrl(path);
  const social = socialDescription ?? description;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: social,
      url,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: social,
      ...(images ? { images } : {}),
    },
  };
}
