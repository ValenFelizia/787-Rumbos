import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { destinationInquiryWhatsAppLink } from "@/lib/whatsapp-inquiry";

type DestinationMobileStickyBarProps = {
  destinationName: string;
  /** `displayDate` of the nearest active upcoming departure, if any. */
  nextDepartureDisplayDate?: string | null;
};

/**
 * Mobile-only sticky WhatsApp CTA for destination detail.
 * Desktop keeps the existing sticky departures panel; per-departure CTAs stay unchanged.
 */
export function DestinationMobileStickyBar({
  destinationName,
  nextDepartureDisplayDate,
}: DestinationMobileStickyBarProps) {
  const href = destinationInquiryWhatsAppLink({
    destinationName,
    departureDisplayDate: nextDepartureDisplayDate,
    source: "detail",
  });

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#0b4058]/10 bg-white/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center px-4 py-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-brand-heading)] inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#1DA851] active:scale-[0.98]"
          aria-label={`Consultar fechas de ${destinationName} por WhatsApp`}
        >
          <WhatsAppIcon size={18} className="h-[18px] w-[18px] shrink-0" aria-hidden />
          Consultar fechas por WhatsApp
        </a>
      </div>
    </div>
  );
}
