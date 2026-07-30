import type { Metadata } from "next";
import { AereosHub } from "@/components/sections/AereosHub";
import {
  aereosHub,
  aereosHubCanonicalUrl,
} from "@/lib/airlines-data";

const canonical = aereosHubCanonicalUrl();

export const metadata: Metadata = {
  title: aereosHub.metaTitle,
  description: aereosHub.metaDescription,
  alternates: { canonical },
  openGraph: {
    title: aereosHub.metaTitle,
    description: aereosHub.metaDescription,
    url: canonical,
  },
};

export default function AereosPage() {
  return <AereosHub />;
}
