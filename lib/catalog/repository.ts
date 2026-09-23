import "server-only";

import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  getAllDestinationSlugs as slugsOf,
  getDestinationBySlug as findBySlug,
  getHomeFeaturedDestinations as featuredOf,
  getRelatedDestinations as relatedOf,
} from "@/lib/catalog/logic";
import { mapDestination, type DestinationDoc } from "@/lib/catalog/map";
import type { DestinationPage } from "@/lib/catalog/types";

async function loadPublishedDestinations(): Promise<DestinationPage[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "destinations",
    depth: 1,
    draft: false,
    limit: 0,
    overrideAccess: false,
    pagination: false,
    sort: "sortOrder",
    where: {
      _status: { equals: "published" },
    },
  });

  return result.docs.map((doc) => mapDestination(doc as DestinationDoc));
}

export const getAllDestinations = unstable_cache(
  loadPublishedDestinations,
  ["catalog"],
  { tags: ["catalog"], revalidate: 86_400 },
);

export async function getDestinationBySlug(slug: string): Promise<DestinationPage | undefined> {
  return findBySlug(await getAllDestinations(), slug);
}

export async function getHomeFeaturedDestinations(limit = 4): Promise<DestinationPage[]> {
  return featuredOf(await getAllDestinations(), limit);
}

export async function getRelatedDestinations(slug: string, limit = 3): Promise<DestinationPage[]> {
  return relatedOf(await getAllDestinations(), slug, limit);
}

export async function getAllDestinationSlugs(): Promise<string[]> {
  return slugsOf(await getAllDestinations());
}
