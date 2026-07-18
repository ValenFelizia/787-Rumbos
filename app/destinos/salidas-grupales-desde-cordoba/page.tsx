import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClusterHub } from "@/components/sections/ClusterHub";
import { getClusterBySlug } from "@/lib/clusters-data";

const SLUG = "salidas-grupales-desde-cordoba";

export function generateMetadata(): Metadata {
  const cluster = getClusterBySlug(SLUG);
  if (!cluster) return {};
  return {
    title: cluster.metaTitle,
    description: cluster.metaDescription,
    alternates: { canonical: `https://www.787rumbos.com.ar/destinos/${SLUG}` },
    openGraph: {
      title: cluster.metaTitle,
      description: cluster.metaDescription,
      url: `https://www.787rumbos.com.ar/destinos/${SLUG}`,
    },
  };
}

export default function SalidasGrupalesPage() {
  const cluster = getClusterBySlug(SLUG);
  if (!cluster) notFound();
  return <ClusterHub cluster={cluster} />;
}
