import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

type RevalidateContext = {
  disableRevalidate?: boolean;
};

/**
 * `revalidateTag` lanza si no hay un store de Next (seed, migrate).
 * El seed además pasa `context.disableRevalidate` para no depender de ese throw.
 */
export async function revalidateCatalog(context?: RevalidateContext | null): Promise<void> {
  if (context?.disableRevalidate) return;
  try {
    const { revalidateTag } = await import("next/cache");
    revalidateTag("catalog");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`revalidateTag(catalog) omitido: ${message}`);
  }
}

export const revalidateCatalogAfterChange: CollectionAfterChangeHook = ({ context }) => {
  return revalidateCatalog(context);
};

export const revalidateCatalogAfterDelete: CollectionAfterDeleteHook = ({ context }) => {
  return revalidateCatalog(context);
};

/**
 * La home arma la promo con el tag `promo` y el resto con `catalog`.
 * Invalidar los dos saca la barra nueva en el próximo request.
 */
export async function revalidatePromo(context?: RevalidateContext | null): Promise<void> {
  if (context?.disableRevalidate) return;
  try {
    const { revalidateTag } = await import("next/cache");
    revalidateTag("promo");
    revalidateTag("catalog");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`revalidateTag(promo) omitido: ${message}`);
  }
}

export const revalidatePromoAfterChange: GlobalAfterChangeHook = ({ context }) => {
  return revalidatePromo(context);
};
