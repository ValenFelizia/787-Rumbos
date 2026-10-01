import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AirlineLanding } from "@/components/sections/AirlineLanding";
import {
  getAirlineBySlug,
  getPublishedAirlineSlugs,
} from "@/lib/airlines-data";
import { buildPageMetadata } from "@/lib/seo-metadata";

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

  return buildPageMetadata({
    title: airline.metaTitle,
    description: airline.metaDescription,
    path: `/aereos/${slug}`,
  });
}

export default async function AirlinePage({ params }: Props) {
  const { slug } = await params;
  const airline = getAirlineBySlug(slug);
  if (!airline || !airline.published) notFound();
  return <AirlineLanding airline={airline} />;
}
