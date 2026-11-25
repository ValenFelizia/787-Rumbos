/**
 * Genera las variantes WebP (`w640`, `w1280`, `w1920`) para documentos de `media`
 * que tengan algún tamaño faltante, sin cambiar `filename` ni `url` del original.
 *
 * Usa el pipeline de upload de Payload (`payload.update` con `overwriteExistingFiles: true`)
 * para evitar el sufijo `-1`/`-2` de `getSafeFileName` y escribir en el storage activo
 * (`media/` en local o Vercel Blob cuando `BLOB_READ_WRITE_TOKEN` está configurado).
 *
 * Uso: npm run cms:regen-sizes [-- --dry-run]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createLocalReq, getPayload, type File, type Payload } from "payload";
import config from "../payload.config";
import type { Media } from "../payload-types";

type MediaSizeName = keyof NonNullable<Media["sizes"]>;

const REQUIRED_SIZES: readonly MediaSizeName[] = ["w640", "w1280", "w1920"];

const MIME_BY_EXT: Record<string, string> = {
  avif: "image/avif",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
};

function getMissingSizes(doc: Media, sizeNames: readonly MediaSizeName[]): MediaSizeName[] {
  return sizeNames.filter((sizeName) => {
    const entry = doc.sizes?.[sizeName];
    return !entry?.filename || !entry?.url;
  });
}

function resolveMimeType(
  filename: string,
  headerContentType: string | null,
  docMimeType: string | null | undefined,
): string {
  const fromDoc = docMimeType?.trim();
  if (fromDoc) return fromDoc;
  const fromHeader = headerContentType?.split(";")[0]?.trim();
  if (fromHeader && fromHeader.startsWith("image/")) return fromHeader;
  const ext = path.extname(filename).slice(1).toLowerCase();
  const fromExt = MIME_BY_EXT[ext];
  if (fromExt) return fromExt;
  throw new Error(`No se pudo determinar mimeType para ${filename}`);
}

async function fileFromResponse(
  filename: string,
  docMimeType: string | null | undefined,
  response: Response,
  source: string,
): Promise<File> {
  if (!response.ok) {
    throw new Error(`${source} devolvió HTTP ${response.status} para ${filename}`);
  }
  const data = Buffer.from(await response.arrayBuffer());
  return {
    data,
    mimetype: resolveMimeType(filename, response.headers.get("content-type"), docMimeType),
    name: filename,
    size: data.byteLength,
  };
}

async function loadOriginalFile(payload: Payload, doc: Media): Promise<File> {
  if (!doc.filename) {
    throw new Error(`media#${doc.id} no tiene filename`);
  }
  const filename = doc.filename;
  const uploadConfig = payload.collections.media.config.upload;

  if (!uploadConfig.disableLocalStorage) {
    const staticDir = uploadConfig.staticDir || path.resolve(process.cwd(), "media");
    const filePath = path.resolve(staticDir, filename);
    const data = await fs.readFile(filePath);
    return {
      data,
      mimetype: resolveMimeType(filename, null, doc.mimeType),
      name: filename,
      size: data.byteLength,
    };
  }

  const req = await createLocalReq({}, payload);
  for (const handler of uploadConfig.handlers ?? []) {
    const response = await handler(req, {
      doc,
      headers: new Headers(),
      params: { collection: "media", filename },
    });
    if (response instanceof Response) {
      return fileFromResponse(filename, doc.mimeType, response, "Storage handler");
    }
  }

  if (doc.url && /^https?:\/\//.test(doc.url)) {
    const response = await fetch(doc.url);
    return fileFromResponse(filename, doc.mimeType, response, `GET ${doc.url}`);
  }

  throw new Error(`No hay storage disponible para leer ${filename}`);
}

async function main(): Promise<void> {
  // `cms:regen-sizes` ends with `--` so `payload run` passes `--dry-run` through.
  const dryRun = process.argv.includes("--dry-run");
  const payload = await getPayload({ config });

  const configuredSizes = (payload.collections.media.config.upload.imageSizes ?? []).map(
    (size) => size.name,
  );
  for (const required of REQUIRED_SIZES) {
    if (!configuredSizes.includes(required)) {
      throw new Error(`Falta imageSize '${required}' en la colección media`);
    }
  }

  const result = await payload.find({
    collection: "media",
    depth: 0,
    limit: 0,
    overrideAccess: true,
    pagination: false,
    sort: "id",
  });

  const docs = result.docs as Media[];
  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const doc of docs) {
    const missing = getMissingSizes(doc, REQUIRED_SIZES);
    if (missing.length === 0) {
      console.log(`media#${doc.id} ${doc.filename ?? "(sin filename)"}: skip (all sizes present)`);
      skippedCount += 1;
      continue;
    }

    if (dryRun) {
      console.log(
        `media#${doc.id} ${doc.filename ?? "(sin filename)"}: would regenerate [${missing.join(", ")}]`,
      );
      updatedCount += 1;
      continue;
    }

    try {
      const file = await loadOriginalFile(payload, doc);
      const updated = (await payload.update({
        collection: "media",
        id: doc.id,
        data: {
          alt: doc.alt,
          ...(typeof doc.focalX === "number" && typeof doc.focalY === "number"
            ? { focalX: doc.focalX, focalY: doc.focalY }
            : {}),
        },
        file,
        overwriteExistingFiles: true,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })) as Media;

      if (updated.filename !== doc.filename || updated.url !== doc.url) {
        throw new Error(
          `filename/url cambió para media#${doc.id}: ${doc.filename} (${doc.url}) -> ${updated.filename} (${updated.url})`,
        );
      }

      const stillMissing = getMissingSizes(updated, REQUIRED_SIZES);
      if (stillMissing.length > 0) {
        throw new Error(
          `faltan tamaños tras regenerar media#${doc.id}: ${stillMissing.join(", ")}`,
        );
      }

      const generated = REQUIRED_SIZES.map(
        (name) => `${name}=${updated.sizes?.[name]?.filename ?? "?"}`,
      ).join(", ");
      console.log(`media#${doc.id} ${doc.filename}: regenerated [${missing.join(", ")}] (${generated})`);
      updatedCount += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`media#${doc.id} ${doc.filename ?? "(sin filename)"}: ERROR ${message}`);
      failedCount += 1;
    }
  }

  if (dryRun) {
    console.log(
      `regen-sizes (dry-run): ${updatedCount} would regenerate, ${skippedCount} skipped, ${docs.length} total`,
    );
  } else {
    console.log(
      `regen-sizes: ${updatedCount} regenerated, ${skippedCount} skipped, ${failedCount} failed, ${docs.length} total`,
    );
  }

  if (failedCount > 0) {
    // `payload run` fuerza process.exit(0) al terminar el import, pisando process.exitCode.
    process.exit(1);
  }
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
