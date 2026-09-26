import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { filterEmptyWhatsAppHref } from "./destinos-filter-empty-helpers";

export { formatDestinosResultCount, filterEmptyWhatsAppHref } from "./destinos-filter-empty-helpers";

export function DestinosFilterEmpty({
  monthLabel,
  onReset,
}: {
  monthLabel?: string | null;
  onReset: () => void;
}) {
  const title = monthLabel
    ? `No hay salidas en ${monthLabel}`
    : "No hay destinos con estos filtros";
  const description = monthLabel
    ? "Con el filtro actual no encontramos destinos con salida activa ese mes. Escribinos y te armamos opciones a medida."
    : "Con la combinación de filtros actual no encontramos destinos. Probá resetear o escribinos y te armamos opciones a medida.";
  const whatsappLabel = monthLabel
    ? `Consultar salidas de ${monthLabel}`
    : "Consultar por WhatsApp";

  return (
    <div
      className="rounded-3xl border border-[#0b4058]/10 bg-white px-6 py-12 text-center shadow-sm"
      role="region"
      aria-labelledby="destinos-filter-empty-title"
      data-testid="destinos-filter-empty"
    >
      <h2
        id="destinos-filter-empty-title"
        className="font-[family-name:var(--font-brand-heading)] text-2xl font-extrabold tracking-tight text-[#0b4058]"
      >
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#0b4058]/70 text-pretty">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-[#0b4058]/20 bg-white px-5 py-3 text-sm font-bold text-[#0b4058] transition-colors hover:border-[#0b4058]/35 hover:bg-[#0b4058]/5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7a92a]"
        >
          Ver todos
        </button>
        <a
          href={filterEmptyWhatsAppHref({ monthLabel })}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-brand-heading)] inline-flex items-center gap-2 rounded-xl bg-[#dae553] px-5 py-3 text-sm font-black text-[#0b4058] shadow-md transition-all duration-200 hover:bg-[#c3cf3e] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7a92a]"
        >
          <WhatsAppIcon size={14} className="h-5 w-5 shrink-0" />
          <span>{whatsappLabel}</span>
        </a>
      </div>
    </div>
  );
}
