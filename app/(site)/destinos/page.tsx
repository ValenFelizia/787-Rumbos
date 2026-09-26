import { DestinosView } from "./destinos-view";
import { getFeaturedPromo } from "@/lib/catalog/promo";
import { getAllDestinations } from "@/lib/catalog/repository";

export default async function DestinosIndex() {
  const [destinations, promo] = await Promise.all([getAllDestinations(), getFeaturedPromo()]);
  const promoBadge =
    promo && promo.badgeText.trim() !== ""
      ? { slug: promo.slug, badgeText: promo.badgeText }
      : null;
  return <DestinosView destinations={destinations} promoBadge={promoBadge} />;
}
