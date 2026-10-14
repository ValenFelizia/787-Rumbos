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
        description:
          "Solo para imágenes del seed que siguen en /public (p. ej. /destinos/salta.png). Dejá vacío en cargas nuevas: el sitio usa la URL del archivo (Blob o /api/media/file/...).",
        position: "sidebar",
      },
    },
  ],
};
