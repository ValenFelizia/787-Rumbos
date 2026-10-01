import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClusterHub } from "@/components/sections/ClusterHub";
import { getClusterBySlug } from "@/lib/clusters-data";
import { buildPageMetadata } from "@/lib/seo-metadata";

const SLUG = "brasil-desde-cordoba";

export function generateMetadata(): Metadata {
  const cluster = getClusterBySlug(SLUG);
  if (!cluster) return {};
  return buildPageMetadata({
    title: cluster.metaTitle,
    description: cluster.metaDescription,
    path: `/destinos/${SLUG}`,
  });
}

export default function BrasilDesdeCordobaPage() {
  const cluster = getClusterBySlug(SLUG);
  if (!cluster) notFound();
  return <ClusterHub cluster={cluster} />;
}
