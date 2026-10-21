import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClusterHub } from "@/components/sections/ClusterHub";
import { getAllDestinations } from "@/lib/catalog/repository";
import { getClusterBySlug, getClusterDestinations } from "@/lib/clusters-data";
import { describeClusterListings } from "@/lib/seo/offer-description";
import { buildPageMetadata } from "@/lib/seo-metadata";

const SLUG = "brasil-desde-cordoba";

export async function generateMetadata(): Promise<Metadata> {
  const cluster = getClusterBySlug(SLUG);
  if (!cluster) return {};
  const members = getClusterDestinations(cluster, await getAllDestinations());
  return buildPageMetadata({
    title: cluster.metaTitle,
    description: describeClusterListings(members),
    path: `/destinos/${SLUG}`,
  });
}

export default function BrasilDesdeCordobaPage() {
  const cluster = getClusterBySlug(SLUG);
  if (!cluster) notFound();
  return <ClusterHub cluster={cluster} />;
}
