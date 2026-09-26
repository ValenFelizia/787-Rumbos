/**
 * Destinos relacionados (QOL-09).
 * Membership desde `clusters-data` (única fuente); sin arrays mágicos de slugs.
 * Fallback: misma región, por cercanía al índice de catálogo (`sortOrder` CMS).
 */
import { getClusterMateSlugs } from "@/lib/clusters-data";
import type { DestinationPage } from "./types";

function catalogIndex(destinations: DestinationPage[]): Map<string, number> {
  const index = new Map<string, number>();
  destinations.forEach((dest, i) => {
    if (!index.has(dest.slug)) index.set(dest.slug, i);
  });
  return index;
}

function byCatalogOrder(
  a: DestinationPage,
  b: DestinationPage,
  orderIndex: Map<string, number>,
): number {
  const ia = orderIndex.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
  const ib = orderIndex.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
  if (ia !== ib) return ia - ib;
  return a.name.localeCompare(b.name, "es");
}

function byNearestCatalogOrder(
  a: DestinationPage,
  b: DestinationPage,
  currentIndex: number,
  orderIndex: Map<string, number>,
): number {
  const ia = orderIndex.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
  const ib = orderIndex.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
  const da = Math.abs(ia - currentIndex);
  const db = Math.abs(ib - currentIndex);
  if (da !== db) return da - db;
  if (ia !== ib) return ia - ib;
  return a.name.localeCompare(b.name, "es");
}

/**
 * Relacionados: pares del mismo cluster fijo primero (orden de catálogo /
 * `sortOrder`, priorizando mismo país), luego misma región por cercanía de
 * `sortOrder`. Sin peers de cluster → solo el fallback de región.
 */
export function getRelatedDestinations(
  destinations: DestinationPage[],
  slug: string,
  limit = 3,
): DestinationPage[] {
  const current = destinations.find((d) => d.slug === slug);
  if (!current) return [];

  const orderIndex = catalogIndex(destinations);
  const currentIndex = orderIndex.get(slug) ?? 0;
  const mateSlugs = new Set(getClusterMateSlugs(slug));
  const picked = new Set<string>([slug]);
  const result: DestinationPage[] = [];

  const take = (candidates: DestinationPage[]) => {
    for (const dest of candidates) {
      if (result.length >= limit) return;
      if (picked.has(dest.slug)) continue;
      picked.add(dest.slug);
      result.push(dest);
    }
  };

  const others = destinations.filter((d) => d.slug !== slug);

  const clusterMates = others
    .filter((d) => mateSlugs.has(d.slug))
    .sort((a, b) => {
      const countryDiff =
        Number(b.country === current.country) - Number(a.country === current.country);
      if (countryDiff !== 0) return countryDiff;
      return byCatalogOrder(a, b, orderIndex);
    });
  take(clusterMates);

  if (result.length < limit) {
    const sameRegion = others
      .filter((d) => d.region === current.region && !picked.has(d.slug))
      .sort((a, b) => byNearestCatalogOrder(a, b, currentIndex, orderIndex));
    take(sameRegion);
  }

  return result;
}
