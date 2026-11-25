/**
 * Genera las variantes WebP (`w640`, `w1280`, `w1920`) para documentos de `media`
 * que tengan algún tamaño faltante, sin cambiar `filename` ni `url` del original.
 *
 * Usa el pipeline de upload de Payload (`payload.update` con `overwriteExistingFiles: true`)
 * para evitar el sufijo `-1`/`-2` de `getSafeFileName` y escribir en el storage activo
 * (`media/` en local o Vercel Blob cuando `BLOB_READ_WRITE_TOKEN` está configurado).
 *
 * Orden obligatorio para ejecutar en producción (una sola vez):
 *   0. Avisar que nadie edite ni suba imágenes en `/admin` mientras corre el script.
 *   1. Hacer backup de TODOS los originales a una carpeta FUERA de `media/` del repo
 *      (p. ej. `/tmp/regen-backup`). En producción `afterChange` borra el original y las
 *      variantes viejas en Blob antes de subir los nuevos; si falla la subida, Postgres
 *      hace rollback pero Blob no, y sin `--source` un reintento no puede descargar el original.
 *   2. Correr `npm run cms:regen-sizes -- --dry-run` (sin `--source` o con `--source <backup>`)
 *      para verificar qué documentos necesitan variantes y pasar el preflight.
 *   3. Correr un canario: `npm run cms:regen-sizes -- --limit 1 --source <backup>`.
 *   4. Verificar el sitio en producción (imagen original + variantes `w640/w1280/w1920`).
 *   5. Correr el resto: `npm run cms:regen-sizes -- --source <backup>`.
 *
 * Uso: npm run cms:regen-sizes [-- --dry-run] [-- --limit <n>] [-- --source <dir>]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createLocalReq, getPayload, type File, type Payload } from "payload";
import config from "../payload.config";
import type { Media } from "../payload-types";

type MediaSizeName = keyof NonNullable<Media["sizes"]>;

type CliOptions = {
  dryRun: boolean;
  limit: number | null;
  sourceDir: string | null;
};

const REQUIRED_SIZES: readonly MediaSizeName[] = ["w640", "w1280", "w1920"];

const ALLOWED_EXT_BY_MIME: Record<string, readonly string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

function parseCliArgs(argv: readonly string[]): CliOptions {
  let dryRun = false;
  let limit: number | null = null;
  let sourceDir: string | null = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") continue;
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--limit" || arg.startsWith("--limit=")) {
      const raw = arg === "--limit" ? argv[++i] : arg.slice("--limit=".length);
      if (!raw || raw.startsWith("--") || !/^\d+$/.test(raw)) {
        throw new Error(`--limit requiere un entero positivo (recibido: ${raw ?? "nada"})`);
      }
      const parsed = Number(raw);
      if (!Number.isSafeInteger(parsed) || parsed <= 0) {
        throw new Error(`--limit requiere un entero positivo (recibido: ${raw})`);
      }
      limit = parsed;
      continue;
    }
    if (arg === "--source" || arg.startsWith("--source=")) {
      const raw = arg === "--source" ? argv[++i] : arg.slice("--source=".length);
      if (!raw || raw.startsWith("--")) {
        throw new Error("--source requiere una ruta de directorio");
      }
      sourceDir = raw;
      continue;
    }
    throw new Error(`Opción no reconocida: ${arg}`);
  }

  return { dryRun, limit, sourceDir };
}

function getMissingSizes(doc: Media, sizeNames: readonly MediaSizeName[]): MediaSizeName[] {
  return sizeNames.filter((sizeName) => {
    const entry = doc.sizes?.[sizeName];
    return !entry?.filename || !entry?.url;
  });
}

function isPathInsideOrEqual(candidatePath: string, parentPath: string): boolean {
  const rel = path.relative(parentPath, candidatePath);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

async function resolveRealOrPath(targetPath: string): Promise<string> {
  const resolved = path.resolve(targetPath);
  try {
    return await fs.realpath(resolved);
  } catch {
    return resolved;
  }
}

async function validateSourceDir(sourceDir: string, staticDir: string): Promise<string> {
  const resolvedSource = path.resolve(sourceDir);
  const resolvedStatic = path.resolve(staticDir);
  const [realSource, realStatic] = await Promise.all([
    resolveRealOrPath(resolvedSource),
    resolveRealOrPath(resolvedStatic),
  ]);

  if (
    isPathInsideOrEqual(resolvedSource, resolvedStatic) ||
    isPathInsideOrEqual(realSource, realStatic)
  ) {
    throw new Error(
      `--source (${resolvedSource}) no puede resolver dentro de staticDir (${resolvedStatic}); usá un backup fuera de media/`,
    );
  }

  let stat;
  try {
    stat = await fs.stat(resolvedSource);
  } catch {
    throw new Error(`--source no existe o no es accesible: ${resolvedSource}`);
  }
  if (!stat.isDirectory()) {
    throw new Error(`--source no es un directorio: ${resolvedSource}`);
  }

  return resolvedSource;
}

function assertPreflightDoc(doc: Media): { filename: string; mimeType: string } {
  if (!doc.filename || typeof doc.filename !== "string") {
    throw new Error(`media#${doc.id}: no tiene filename`);
  }
  if (doc.filename.includes("/") || doc.filename.includes("\\") || doc.filename.includes("..")) {
    throw new Error(`media#${doc.id} ${doc.filename}: filename inválido`);
  }

  const mimeType = doc.mimeType?.trim();
  const allowedExts = mimeType ? ALLOWED_EXT_BY_MIME[mimeType] : undefined;
  if (!mimeType || !allowedExts) {
    throw new Error(
      `media#${doc.id} ${doc.filename}: mimeType '${doc.mimeType ?? ""}' no permitido en preflight (solo image/jpeg e image/png)`,
    );
  }

  const ext = path.posix.extname(doc.filename);
  if (!ext) {
    throw new Error(`media#${doc.id} ${doc.filename}: falta extensión de archivo`);
  }
  if (ext !== ext.toLowerCase()) {
    throw new Error(
      `media#${doc.id} ${doc.filename}: extensión '${ext}' debe estar en minúsculas`,
    );
  }
  if (!allowedExts.includes(ext)) {
    throw new Error(
      `media#${doc.id} ${doc.filename}: extensión '${ext}' no coincide con mimeType '${mimeType}'`,
    );
  }

  return { filename: doc.filename, mimeType };
}

async function fileFromResponse(
  filename: string,
  mimeType: string,
  response: Response,
  source: string,
): Promise<File> {
  if (response.status !== 200) {
    throw new Error(
      `${source} devolvió HTTP ${response.status} para ${filename} (se esperaba HTTP 200)`,
    );
  }
  const data = Buffer.from(await response.arrayBuffer());
  if (data.byteLength === 0) {
    throw new Error(`${source} devolvió cuerpo vacío para ${filename}`);
  }
  return {
    data,
    mimetype: mimeType,
    name: filename,
    size: data.byteLength,
  };
}

async function loadOriginalFile(
  payload: Payload,
  doc: Media,
  filename: string,
  mimeType: string,
  sourceDir: string | null,
): Promise<File> {
  if (sourceDir !== null) {
    const filePath = path.resolve(sourceDir, filename);
    const data = await fs.readFile(filePath);
    if (data.byteLength === 0) {
      throw new Error(`Archivo vacío en --source: ${filePath}`);
    }
    return {
      data,
      mimetype: mimeType,
      name: filename,
      size: data.byteLength,
    };
  }

  const uploadConfig = payload.collections.media.config.upload;
  if (!uploadConfig.disableLocalStorage) {
    const staticDir = uploadConfig.staticDir || path.resolve(process.cwd(), "media");
    const filePath = path.resolve(staticDir, filename);
    const data = await fs.readFile(filePath);
    if (data.byteLength === 0) {
      throw new Error(`Archivo vacío en staticDir: ${filePath}`);
    }
    return {
      data,
      mimetype: mimeType,
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
      return fileFromResponse(filename, mimeType, response, "Storage handler");
    }
  }

  if (doc.url && /^https?:\/\//.test(doc.url)) {
    const response = await fetch(doc.url);
    return fileFromResponse(filename, mimeType, response, `GET ${doc.url}`);
  }

  throw new Error(`No hay storage disponible para leer ${filename}`);
}

async function main(): Promise<void> {
  // `cms:regen-sizes` termina con `--` para que `payload run` reenvíe los flags.
  const options = parseCliArgs(process.argv.slice(2));
  const payload = await getPayload({ config });

  const uploadConfig = payload.collections.media.config.upload;
  const configuredSizes = (uploadConfig.imageSizes ?? []).map((size) => size.name);
  for (const required of REQUIRED_SIZES) {
    if (!configuredSizes.includes(required)) {
      throw new Error(`Falta imageSize '${required}' en la colección media`);
    }
  }

  const staticDir = path.resolve(uploadConfig.staticDir || path.resolve(process.cwd(), "media"));
  const resolvedSourceDir =
    options.sourceDir !== null ? await validateSourceDir(options.sourceDir, staticDir) : null;

  const result = await payload.find({
    collection: "media",
    depth: 0,
    limit: 0,
    overrideAccess: true,
    pagination: false,
    sort: "id",
  });

  const docs = result.docs as Media[];
  const pendingDocs: Array<{
    doc: Media;
    filename: string;
    mimeType: string;
    missing: MediaSizeName[];
  }> = [];
  let skippedCount = 0;

  for (const doc of docs) {
    const missing = getMissingSizes(doc, REQUIRED_SIZES);
    if (missing.length === 0) {
      console.log(`media#${doc.id} ${doc.filename ?? "(sin filename)"}: skip (all sizes present)`);
      skippedCount += 1;
      continue;
    }

    const { filename, mimeType } = assertPreflightDoc(doc);
    pendingDocs.push({ doc, filename, mimeType, missing });
    if (options.limit !== null && pendingDocs.length >= options.limit) {
      break;
    }
  }

  if (resolvedSourceDir !== null) {
    for (const item of pendingDocs) {
      const backupFilePath = path.resolve(resolvedSourceDir, item.filename);
      if (!isPathInsideOrEqual(backupFilePath, resolvedSourceDir)) {
        throw new Error(`media#${item.doc.id} ${item.filename}: ruta fuera de --source`);
      }
      let stat;
      try {
        stat = await fs.stat(backupFilePath);
      } catch {
        throw new Error(
          `media#${item.doc.id} ${item.filename}: falta el archivo en --source (${backupFilePath})`,
        );
      }
      if (!stat.isFile()) {
        throw new Error(
          `media#${item.doc.id} ${item.filename}: no es un archivo regular en --source (${backupFilePath})`,
        );
      }
      if (stat.size === 0) {
        throw new Error(
          `media#${item.doc.id} ${item.filename}: archivo vacío en --source (${backupFilePath})`,
        );
      }
    }
  }

  if (options.dryRun) {
    for (const item of pendingDocs) {
      console.log(
        `media#${item.doc.id} ${item.filename}: would regenerate [${item.missing.join(", ")}]`,
      );
    }
    const limitNote = options.limit !== null ? `, limit ${options.limit}` : "";
    console.log(
      `regen-sizes (dry-run): ${pendingDocs.length} would regenerate, ${skippedCount} skipped${limitNote}, ${docs.length} total`,
    );
    return;
  }

  let updatedCount = 0;
  for (const item of pendingDocs) {
    const { doc, filename, mimeType, missing } = item;
    try {
      const file = await loadOriginalFile(payload, doc, filename, mimeType, resolvedSourceDir);
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
      console.log(
        `media#${doc.id} ${doc.filename}: regenerated [${missing.join(", ")}] (${generated})`,
      );
      updatedCount += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`media#${doc.id} ${filename}: ERROR ${message}`);
      // `payload run` fuerza process.exit(0) al terminar el import, pisando process.exitCode.
      process.exit(1);
    }
  }

  const limitNote = options.limit !== null ? `, limit ${options.limit}` : "";
  console.log(
    `regen-sizes: ${updatedCount} regenerated, ${skippedCount} skipped${limitNote}, ${docs.length} total`,
  );
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`regen-sizes: ERROR ${message}`);
  process.exit(1);
}
