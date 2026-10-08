import path from "path";
import { fileURLToPath } from "url";
import {
  ValidationError,
  type CollectionBeforeValidateHook,
  type CollectionConfig,
} from "payload";
import { isAdminOrEncargado, isAuthenticated } from "../access";
import {
  revalidateCatalogAfterChange,
  revalidateCatalogAfterDelete,
} from "../hooks/revalidateCatalog";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** Hard limit for hotel clips (15 MB). Validated server-side on create/replace. */
export const MAX_VIDEO_BYTES = 15 * 1024 * 1024;

const ALLOWED_VIDEO_MIME = new Set(["video/mp4", "video/webm"]);

function invalidVideo(message: string, req: Parameters<CollectionBeforeValidateHook>[0]["req"]): never {
  throw new ValidationError({
    collection: "videos",
    errors: [{ message, path: "file" }],
    req,
  });
}

/**
 * Rejects non-mp4/webm and files over 15 MB. Runs on create and when a new
 * file replaces an existing one (`req.file` present).
 */
export const validateVideoUpload: CollectionBeforeValidateHook = ({ data, req }) => {
  const file = req.file;
  if (!file) return data;

  const mime = (file.mimetype || "").toLowerCase();
  if (!ALLOWED_VIDEO_MIME.has(mime)) {
    invalidVideo("Solo se permiten videos MP4 o WebM (video/mp4, video/webm).", req);
  }
  if (typeof file.size === "number" && file.size > MAX_VIDEO_BYTES) {
    invalidVideo("El video no puede superar 15 MB. Comprimilo antes de subir (ver receta ffmpeg en la guía).", req);
  }
  return data;
};

export const Videos: CollectionConfig = {
  slug: "videos",
  labels: {
    singular: "Video",
    plural: "Videos",
  },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "filename", "mimeType", "filesize", "updatedAt"],
    description:
      "Clips cortos de hotel (MP4 o WebM, máximo 15 MB). Pensado para el piloto de video en fichas de destino.",
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdminOrEncargado,
  },
  hooks: {
    beforeValidate: [validateVideoUpload],
    afterChange: [revalidateCatalogAfterChange],
    afterDelete: [revalidateCatalogAfterDelete],
  },
  upload: {
    staticDir: path.resolve(dirname, "../../media/videos"),
    mimeTypes: ["video/mp4", "video/webm"],
    // Videos are not resized; keep Payload off image pipelines.
    crop: false,
    focalPoint: false,
  },
  fields: [
    {
      name: "alt",
      label: "Texto alternativo",
      type: "text",
      required: true,
      admin: {
        description: "Descripción corta del clip, p. ej. «Hotel Porto 2 Life — pileta».",
      },
    },
  ],
};
