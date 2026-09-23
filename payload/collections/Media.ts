import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";
import { isAdminOrEncargado, isAuthenticated } from "../access";
import {
  revalidateCatalogAfterChange,
  revalidateCatalogAfterDelete,
} from "../hooks/revalidateCatalog";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Imagen",
    plural: "Imágenes",
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdminOrEncargado,
  },
  hooks: {
    afterChange: [revalidateCatalogAfterChange],
    afterDelete: [revalidateCatalogAfterDelete],
  },
  upload: {
    staticDir: path.resolve(dirname, "../../media"),
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      label: "Texto alternativo",
      type: "text",
      required: true,
    },
    {
      name: "legacyPath",
      label: "Ruta pública original",
      type: "text",
      index: true,
      admin: {
        description: "Si viene del sitio estático, p. ej. /destinos/salta.png. El render la prefiere sobre la URL del archivo.",
        position: "sidebar",
      },
    },
  ],
};
