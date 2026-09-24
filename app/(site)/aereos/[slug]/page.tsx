import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AirlineLanding } from "@/components/sections/AirlineLanding";
import {
  airlineCanonicalUrl,
  getAirlineBySlug,
  getPublishedAirlineSlugs,
} from "@/lib/airlines-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedAirlineSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const airline = getAirlineBySlug(slug);
  if (!airline || !airline.published) return {};

  const canonical = airlineCanonicalUrl(slug);
  return {
    title: airline.metaTitle,
    description: airline.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: airline.metaTitle,
      description: airline.metaDescription,
      url: canonical,
    },
  };
}

export default async function AirlinePage({ params }: Props) {
  const { slug } = await params;
  const airline = getAirlineBySlug(slug);
  if (!airline || !airline.published) notFound();
  return <AirlineLanding airline={airline} />;
}
