import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig, GenerateImageName, ImageSize } from "payload";
import { isAdminOrEncargado, isAuthenticated } from "../access";
import { ensureUniqueMediaFilename } from "../hooks/mediaFilename";
import {
  revalidateCatalogAfterChange,
  revalidateCatalogAfterDelete,
} from "../hooks/revalidateCatalog";
import { IMAGE_SIZE_WIDTHS } from "../media/filename";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const generateWebpImageName: GenerateImageName = ({ originalName, sizeName }) =>
  `${originalName}-${sizeName}.webp`;

const imageSizes: ImageSize[] = IMAGE_SIZE_WIDTHS.map((width) => ({
  name: `w${width}`,
  width,
  withoutEnlargement: true,
  formatOptions: {
    format: "webp",
    options: {
      quality: 75,
    },
  },
  generateImageName: generateWebpImageName,
}));

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
    beforeOperation: [ensureUniqueMediaFilename],
    afterChange: [revalidateCatalogAfterChange],
    afterDelete: [revalidateCatalogAfterDelete],
  },
  upload: {
    staticDir: path.resolve(dirname, "../../media"),
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    imageSizes,
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
          "Ya no se usa: el sitio siempre muestra el archivo subido. Dejalo vacío.",
        position: "sidebar",
      },
    },
  ],
};
