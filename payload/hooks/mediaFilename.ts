import { APIError, type CollectionBeforeOperationHook } from "payload";
import { normalizeUploadName, resolveUniqueMediaFilename } from "../media/filename";

/**
 * `getSafeFileName` de Payload solo exige unicidad del `filename` completo, pero
 * `generateWebpImageName` descarta la extensión original (`<basename>-w640.webp`).
 * `beforeOperation` corre antes de `generateFileData`, último punto donde se
 * puede reescribir `req.file.name` antes de generar el nombre final y las variantes.
 */
export const ensureUniqueMediaFilename: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
  if (operation !== "create" && operation !== "update") return args;

  const uploadArgs = args as { duplicateFromID?: number | string; overwriteExistingFiles?: boolean };
  // Duplicar copia el archivo sin pasar por este chequeo, y `disableDuplicate` solo
  // lo bloquea en la Local API: el endpoint REST de duplicate llega acá igual.
  if (operation === "create" && uploadArgs.duplicateFromID != null) {
    throw new APIError("No se pueden duplicar imágenes. Subí el archivo de nuevo.", 400);
  }

  const file = req.file;
  if (!file?.name) return args;
  if (operation === "update" && uploadArgs.overwriteExistingFiles) return args;

  const existing = await req.payload.find({
    collection: "media",
    depth: 0,
    limit: 0,
    overrideAccess: true,
    pagination: false,
    req,
    select: {
      filename: true,
    },
  });

  // El filename actual del propio doc cuenta como ocupado: un reemplazo con el mismo
  // basename recibe un nombre nuevo (como ya hacía `getSafeFileName` con nombres
  // idénticos), así nunca cae en el basename de otro doc ni reutiliza URLs cacheadas.
  const takenFilenames = existing.docs.map((doc) => doc.filename);

  const uniqueName = resolveUniqueMediaFilename(
    normalizeUploadName(file.name, file.mimetype),
    takenFilenames,
  );
  if (uniqueName !== file.name) {
    req.file = { ...file, name: uniqueName };
  }

  return args;
};
