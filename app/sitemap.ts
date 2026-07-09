import type { MetadataRoute } from "next";
import { destinationsData } from "@/lib/destinations-data";
import { clustersData } from "@/lib/clusters-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://787rumbos.com.ar";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/destinos`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  const clusterPages = clustersData.map((cluster) => ({
    url: `${baseUrl}/destinos/${cluster.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const destinationPages = destinationsData.map((dest) => ({
    url: `${baseUrl}/destinos/${dest.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...clusterPages, ...destinationPages];
}
