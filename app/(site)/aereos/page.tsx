import type { Metadata } from "next";
import { AereosHub } from "@/components/sections/AereosHub";
import { aereosHub } from "@/lib/airlines-data";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: aereosHub.metaTitle,
  description: aereosHub.metaDescription,
  path: "/aereos",
});

export default function AereosPage() {
  return <AereosHub />;
}
