import { DestinosView } from "./destinos-view";
import { toDestinationListings, type ClusterCardProps } from "@/lib/catalog/listing";
import { getFeaturedPromo } from "@/lib/catalog/promo";
import { getAllDestinations } from "@/lib/catalog/repository";
import { clustersData, getClusterCardStats } from "@/lib/clusters-data";

export default async function DestinosIndex() {
  const [destinations, promo] = await Promise.all([getAllDestinations(), getFeaturedPromo()]);
  const promoBadge =
    promo && promo.badgeText.trim() !== ""
      ? { slug: promo.slug, badgeText: promo.badgeText }
      : null;

  // Slim DTO before the client boundary — drop detail-only fields from RSC payload.
  const listings = toDestinationListings(destinations);

  const clusterCards: ClusterCardProps[] = clustersData.map((cluster) => {
    const stats = getClusterCardStats(cluster, listings);
    return {
      href: `/destinos/${cluster.slug}`,
      title: cluster.shortTitle,
      line: cluster.cardLine,
      image: cluster.cardImage,
      imageAlt: cluster.cardImageAlt,
      destinationCount: stats.destinationCount,
      departureCount: stats.departureCount,
    };
  });

  return (
    <DestinosView
      destinations={listings}
      clusterCards={clusterCards}
      promoBadge={promoBadge}
    />
  );
}
