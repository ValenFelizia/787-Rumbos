import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig, GenerateImageName, ImageSize } from "payload";
import { isAdminOrEncargado, isAuthenticated } from "../access";
import {
  revalidateCatalogAfterChange,
  revalidateCatalogAfterDelete,
} from "../hooks/revalidateCatalog";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const IMAGE_SIZE_WIDTHS = [640, 1280, 1920] as const;

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
    afterChange: [revalidateCatalogAfterChange],
    afterDelete: [revalidateCatalogAfterDelete],
  },
  upload: {
    staticDir: path.resolve(dirname, "../../media"),
    mimeTypes: ["image/*"],
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
