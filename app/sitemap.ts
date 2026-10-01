import type { MetadataRoute } from "next";
import {
  aereosHubCanonicalUrl,
  airlineCanonicalUrl,
  getPublishedAirlines,
} from "@/lib/airlines-data";
import { getAllDestinations } from "@/lib/catalog/repository";
import { clustersData } from "@/lib/clusters-data";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 86_400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const destinationsData = await getAllDestinations();

  const staticPages = [
    {
      url: siteUrl("/"),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: siteUrl("/destinos"),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: aereosHubCanonicalUrl(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: siteUrl("/legal"),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  const airlinePages = getPublishedAirlines().map((airline) => ({
    url: airlineCanonicalUrl(airline.slug),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const clusterPages = clustersData.map((cluster) => ({
    url: siteUrl(`/destinos/${cluster.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const destinationPages = destinationsData.map((dest) => ({
    url: siteUrl(`/destinos/${dest.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...airlinePages,
    ...clusterPages,
    ...destinationPages,
  ];
}
