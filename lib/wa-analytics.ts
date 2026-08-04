/**
 * Eventos cortos de WhatsApp para Vercel Analytics.
 * Props: strings/numbers/booleans únicamente (límite del SDK).
 */
import { track } from "@vercel/analytics";

export type WaSurface =
  | "nav"
  | "footer"
  | "aereos_hub"
  | "airline_landing";

export type WaClickProps = {
  surface: WaSurface;
  /** id estable de aerolínea (`latam`, `gol`, …) cuando aplica */
  airline?: string;
};

export function trackWaClick({ surface, airline }: WaClickProps): void {
  if (airline) {
    track("wa_click", { surface, airline });
    return;
  }
  track("wa_click", { surface });
}
