/**
 * Subsetea las fuentes de marca de public/fonts (.ttf) a .woff2.
 *
 * `npm run fonts:subset` regenera los .woff2 junto a cada .ttf.
 * `npm run fonts:subset -- --check` verifica los .woff2 ya generados:
 * cobertura de glifos y, en fuentes variables, que los ejes sigan presentes.
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import * as hb from "harfbuzzjs";
import subsetFont from "subset-font";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontsDir = join(root, "public", "fonts");

// El contenido viene del CMS: cubrimos latín completo, puntuación tipográfica,
// símbolos de moneda y flechas para no perder glifos al editar desde Payload.
const UNICODE_RANGES = [
  "U+0020-007E",
  "U+00A0-00FF",
  "U+0100-017F",
  "U+2010-2027",
  "U+2030-203A",
  "U+20AC",
  "U+2122",
  "U+2190-2193",
  "U+2212",
];

// El sitio no usa `font-stretch`: fijar wdth en su default (100) no cambia
// nada visible y reduce Zalando a menos de la mitad.
const PINNED_AXES = {
  "ZalandoSans-VariableFont_wdth,wght.ttf": { wdth: 100 },
};

const CHECK_STRING ="ÁÉÍÓÚáéíóúÑñÜü¿¡°ºª€$%&@“”‘’–—…·•→";

function unicodeSetFromRanges(ranges) {
  const codepoints = new Set();
  for (const range of ranges) {
    const [start, end = start] = range
      .replace("U+", "")
      .split("-")
      .map((value) => Number.parseInt(value, 16));
    for (let cp = start; cp <= end; cp += 1) codepoints.add(cp);
  }
  return codepoints;
}

function textFromCodepoints(codepoints) {
  return String.fromCodePoint(...[...codepoints].sort((a, b) => a - b));
}

// harfbuzzjs no lee WOFF2: lo pasamos por subset-font (keepAllGlyphs no quita
// nada) para inspeccionar el archivo que realmente se sirve.
async function faceFromWoff2(buffer) {
  const sfnt = await subsetFont(buffer, undefined, {
    keepAllGlyphs: true,
    targetFormat: "sfnt",
  });
  return new hb.Face(new hb.Blob(sfnt));
}

async function ttfFiles() {
  const entries = await readdir(fontsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ttf"))
    .map((entry) => entry.name)
    .sort();
}

function formatBytes(bytes) {
  return `${bytes.toLocaleString("en-US")} B`;
}

async function generate() {
  const text = textFromCodepoints(unicodeSetFromRanges(UNICODE_RANGES));

  for (const file of await ttfFiles()) {
    const sourcePath = join(fontsDir, file);
    const targetPath = join(fontsDir, `${parse(file).name}.woff2`);
    const source = await readFile(sourcePath);

    const subset = await subsetFont(source, text, {
      targetFormat: "woff2",
      variationAxes: PINNED_AXES[file],
    });
    await writeFile(targetPath, subset);

    const before = (await stat(sourcePath)).size;
    const after = subset.length;
    const saved = (((before - after) / before) * 100).toFixed(1);
    console.log(
      `${file} → ${parse(targetPath).base}: ${formatBytes(before)} → ${formatBytes(after)} (-${saved}%)`,
    );
  }
}

async function check() {
  let failures = 0;

  for (const ttf of await ttfFiles()) {
    const woff2 = `${parse(ttf).name}.woff2`;
    const buffer = await readFile(join(fontsDir, woff2));
    const face = await faceFromWoff2(buffer);
    const source = new hb.Face(new hb.Blob(await readFile(join(fontsDir, ttf))));
    const unicodes = new Set(face.collectUnicodes());

    const missing = [...CHECK_STRING].filter(
      (char) => !unicodes.has(char.codePointAt(0)),
    );
    const axes = Object.keys(face.getAxisInfos());
    const pinned = Object.keys(PINNED_AXES[ttf] ?? {});
    const lostAxes = Object.keys(source.getAxisInfos()).filter(
      (axis) => !axes.includes(axis) && !pinned.includes(axis),
    );
    const problems = [
      ...(missing.length > 0 ? [`faltan ${missing.join(" ")}`] : []),
      ...(lostAxes.length > 0 ? [`perdió ejes ${lostAxes.join(", ")}`] : []),
    ];

    if (problems.length > 0) failures += 1;
    console.log(
      `${woff2}: ${problems.length === 0 ? "OK" : problems.join("; ")}` +
        ` — ${unicodes.size} glifos, ejes: ${axes.length > 0 ? axes.join(", ") : "ninguno"}`,
    );
  }

  if (failures > 0) {
    throw new Error(`${failures} archivo(s) con glifos o ejes faltantes`);
  }
}

if (process.argv.includes("--check")) {
  await check();
} else {
  await generate();
}
