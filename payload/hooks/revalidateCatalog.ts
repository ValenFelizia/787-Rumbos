import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

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
