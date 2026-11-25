import type { CollectionBeforeOperationHook } from "payload";
import { resolveUniqueMediaFilename, sanitizeMediaFilename } from "../media/filename";

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
  const file = req.file;
  if (!file?.name) return args;

  const uploadArgs = args as { id?: number | string; overwriteExistingFiles?: boolean };
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

  const docId = operation === "update" ? uploadArgs.id : undefined;
  const takenFilenames = existing.docs
    .filter((doc) => {
      if (docId == null || String(doc.id) !== String(docId)) return true;
      // En update sin `overwriteExistingFiles`, `getSafeFileName` incrementa si el
      // archivo entrante repite el `filename` actual del doc; conservarlo acá evita
      // que ese salto caiga en el basename de otro documento.
      return doc.filename === sanitizeMediaFilename(file.name);
    })
    .map((doc) => doc.filename);

  const uniqueName = resolveUniqueMediaFilename(file.name, takenFilenames);
  if (uniqueName !== file.name) {
    req.file = { ...file, name: uniqueName };
  }

  return args;
};
