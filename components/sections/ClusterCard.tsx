/**
 * Compact cluster hub card for `/destinos` (QOL-03 / IA alt. B).
 * Editorial tile → hub SEO — not a shop category card.
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type ClusterCardProps = {
  href: string;
  title: string;
  line: string;
  image: string;
  imageAlt: string;
  destinationCount: number;
  departureCount: number;
  className?: string;
};

function formatCountLabel(destinationCount: number, departureCount: number): string {
  const destLabel =
    destinationCount === 1 ? "1 destino" : `${destinationCount} destinos`;
  if (departureCount <= 0) return destLabel;
  const depLabel =
    departureCount === 1 ? "1 salida" : `${departureCount} salidas`;
  return `${destLabel} · ${depLabel}`;
}

export function ClusterCard({
  href,
  title,
  line,
  image,
  imageAlt,
  destinationCount,
  departureCount,
  className = "",
}: ClusterCardProps) {
  const countLabel = formatCountLabel(destinationCount, departureCount);

  return (
    <Link
      href={href}
      className={`group relative flex h-[9.5rem] flex-col justify-end overflow-hidden rounded-2xl bg-[#0b4058] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b451] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 md:h-[11.25rem] ${className}`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 78vw, 25vw"
        className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b4058]/90 via-[#0b4058]/45 to-transparent"
      />
      <div className="relative z-10 space-y-1 p-3.5 md:p-4">
        <span className="font-[family-name:var(--font-brand-heading)] block text-base font-bold leading-tight tracking-tight text-white text-balance md:text-lg">
          {title}
        </span>
        <p className="line-clamp-1 text-xs leading-snug text-white/85 text-pretty md:text-[0.8125rem]">
          {line}
        </p>
        <p className="flex items-center justify-between gap-2 pt-0.5 text-[11px] font-semibold text-[#dae553] md:text-xs">
          <span>{countLabel}</span>
          <ArrowRight
            className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </p>
      </div>
    </Link>
  );
}
