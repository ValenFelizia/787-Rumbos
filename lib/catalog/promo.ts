import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { isPriceExpired, getTodayLocal } from "@/lib/catalog/logic";
import type { FeaturedPromo, PromoIcon } from "@/lib/catalog/types";

const CONSULT_PRICE = "Consultá precio actualizado";

const PROMO_ICONS: readonly PromoIcon[] = ["plane", "calendar", "ticket", "map-pin"];

type MediaLike = {
  legacyPath?: string | null;
  url?: string | null;
} | null;

type DestinationRel = {
  slug?: string | null;
} | null;

export type FeaturedPromoDoc = {
  enabled?: boolean | null;
  destination?: DestinationRel | number | string | null;
  endsAt?: string | null;
  topBarText?: string | null;
  badgeText?: string | null;
  charterText?: string | null;
  title?: string | null;
  description?: string | null;
  price?: string | null;
  priceNote?: string | null;
  taxNote?: string | null;
  priceValidUntil?: string | null;
  image?: MediaLike | number | string | null;
  whatsappMsg?: string | null;
  inclusions?: { label?: string | null; icon?: string | null }[] | null;
};

function isoDay(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match?.[1];
}

function mediaUrl(media: FeaturedPromoDoc["image"]): string | undefined {
  if (!media || typeof media === "string" || typeof media === "number") return undefined;
  if (media.legacyPath) return media.legacyPath;
  if (media.url) return media.url;
  return undefined;
}

function destinationSlug(value: FeaturedPromoDoc["destination"]): string | undefined {
  if (!value || typeof value === "string" || typeof value === "number") return undefined;
  if (typeof value.slug === "string" && value.slug !== "") return value.slug;
  return undefined;
}

function isPromoIcon(value: string | null | undefined): value is PromoIcon {
  return PROMO_ICONS.some((icon) => icon === value);
}

/**
 * Documento publicado → objeto de la home.
 * Sin vigencia el precio se muestra. Si `priceValidUntil` venció, el monto
 * pasa a «Consultá precio actualizado» y se vacían las notas.
 * `today` se inyecta en tests; en el sitio es la fecha local.
 */
export function mapFeaturedPromo(
  doc: FeaturedPromoDoc | null | undefined,
  today = getTodayLocal(),
): FeaturedPromo | null {
  if (!doc || doc.enabled === false) return null;

  const slug = destinationSlug(doc.destination);
  const imageSrc = mediaUrl(doc.image);
  const endsAt = isoDay(doc.endsAt);
  if (!slug || !imageSrc || !endsAt) return null;

  const inclusions = (doc.inclusions ?? []).flatMap((row) => {
    if (!row?.label || !isPromoIcon(row.icon)) return [];
    return [{ label: row.label, icon: row.icon }];
  });

  const expired = isPriceExpired(doc.priceValidUntil, today);
  return {
    slug,
    endsAt,
    topBarText: doc.topBarText ?? "",
    badgeText: doc.badgeText ?? "",
    charterText: doc.charterText ?? "",
    title: doc.title ?? "",
    description: doc.description ?? "",
    price: expired ? CONSULT_PRICE : (doc.price ?? ""),
    priceNote: expired ? "" : (doc.priceNote ?? ""),
    taxNote: expired ? "" : (doc.taxNote ?? ""),
    imageSrc,
    whatsappMsg: doc.whatsappMsg ?? "",
    inclusions,
  };
}

async function loadFeaturedPromo(): Promise<FeaturedPromo | null> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({
    slug: "featuredPromo",
    depth: 1,
    overrideAccess: false,
  });
  return mapFeaturedPromo(doc as FeaturedPromoDoc);
}

export const getFeaturedPromo = unstable_cache(loadFeaturedPromo, ["promo"], {
  tags: ["promo"],
  revalidate: 86_400,
});
