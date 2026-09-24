/**
 * Snapshot HTML normalizado del sitio, para probar que el render con CMS
 * coincide con el de antes de la migración.
 *
 * Qué se conserva: title, meta description, canonical, Open Graph, JSON-LD,
 * headings h1–h3, links <a> (sin /_next), imágenes (alt + url original) y el
 * texto visible del body. Se descartan <script> (salvo JSON-LD ya parseado),
 * <style>, srcset y los hashes de /_next/static.
 *
 * La comparación vale para capturas del mismo día calendario: el build filtra
 * salidas con la fecha de hoy. Si el día cambió, recapturá el golden desde
 * master (`npm run snapshot:html`) antes de comparar. `capturedAt` guarda esa
 * fecha. No se puede fijar el "hoy" de la app con una variable de entorno.
 *
 * Uso:
 *   node scripts/html-snapshot.mjs [baseUrl]
 *   node scripts/html-snapshot.mjs --compare [baseUrl]
 *
 * baseUrl por defecto: http://localhost:3100 (o SNAPSHOT_BASE_URL).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const goldenDir = join(root, "e2e", "golden");
const pagesDir = join(goldenDir, "pages");
const catalogPath = join(goldenDir, "catalog.json");

const HUBS = [
  "/destinos/brasil-desde-cordoba",
  "/destinos/caribe-desde-cordoba",
  "/destinos/argentina-en-bus-desde-cordoba",
  "/destinos/salidas-grupales-desde-cordoba",
];

const CONTENT_FIELDS = [
  "title",
  "metaDescription",
  "canonical",
  "og",
  "jsonLd",
  "headings",
  "links",
  "images",
  "text",
];

function todayStamp(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function decodeEntities(value) {
  return value.replace(
    /&(#x[0-9a-fA-F]+|#\d+|amp|lt|gt|quot|apos|nbsp);/g,
    (match, ent) => {
      const name = String(ent).toLowerCase();
      if (name === "amp") return "&";
      if (name === "lt") return "<";
      if (name === "gt") return ">";
      if (name === "quot") return '"';
      if (name === "apos") return "'";
      if (name === "nbsp") return " ";
      if (name.startsWith("#x")) {
        return String.fromCodePoint(Number.parseInt(name.slice(2), 16));
      }
      if (name.startsWith("#")) {
        return String.fromCodePoint(Number.parseInt(name.slice(1), 10));
      }
      return match;
    },
  );
}

function collapse(value) {
  return decodeEntities(value).replace(/\s+/g, " ").trim();
}

function getAttr(tag, name) {
  const re = new RegExp(
    `\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`,
    "i",
  );
  const match = tag.match(re);
  if (!match) return null;
  return decodeEntities(match[2] ?? match[3] ?? "");
}

function collectTags(html, tagName) {
  const re = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return html.match(re) ?? [];
}

function fileNameFor(pathname) {
  if (pathname === "/") return "home.json";
  if (pathname === "/sitemap.xml") return "sitemap.json";
  return `${pathname.replace(/^\//, "").replaceAll("/", "-")}.json`;
}

function readCatalog() {
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  if (!Array.isArray(catalog.destinations)) {
    throw new Error(`${catalogPath} no tiene destinations[]`);
  }
  return catalog;
}

function pagePaths(catalog) {
  const paths = ["/", "/destinos"];
  for (const dest of catalog.destinations) {
    paths.push(`/destinos/${dest.slug}`);
  }
  for (const hub of HUBS) {
    if (!paths.includes(hub)) paths.push(hub);
  }
  paths.push("/sitemap.xml");
  return paths;
}

function decodeRepeated(value) {
  let current = value;
  for (let i = 0; i < 2; i += 1) {
    try {
      const next = decodeURIComponent(current);
      if (next === current) break;
      current = next;
    } catch {
      break;
    }
  }
  return current;
}

function normalizeImageSrc(src) {
  if (!src) return "";
  let url;
  try {
    url = new URL(src, "http://snapshot.local");
  } catch {
    return src;
  }
  if (url.pathname === "/_next/image") {
    const original = url.searchParams.get("url");
    return original ? decodeRepeated(original) : "";
  }
  if (url.pathname.includes("/_next/static/")) {
    return url.pathname.replace(/\.[a-f0-9]{8,}(?=\.)/g, "");
  }
  if (url.origin === "http://snapshot.local") {
    return `${url.pathname}${url.search}`;
  }
  return url.href;
}

function scrubBuildNoise(value) {
  return value.replace(/\/_next\/static\/[^\s"'<>]*/g, "/_next/static");
}

function stripNonContent(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function innerText(fragment) {
  const withoutTags = fragment.replace(/<[^>]+>/g, " ");
  return collapse(scrubBuildNoise(withoutTags));
}

function extractJsonLd(html) {
  const blocks = [];
  const re =
    /<script\b[^>]*\btype\s*=\s*(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(re)) {
    const raw = match[1].trim();
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      blocks.push(raw);
    }
  }
  return blocks;
}

function extractOg(html) {
  const og = {};
  for (const tag of collectTags(html, "meta")) {
    const property = getAttr(tag, "property");
    if (!property || !property.toLowerCase().startsWith("og:")) continue;
    const key = property.slice(3);
    const content = getAttr(tag, "content") ?? "";
    const value = key === "image" ? normalizeImageSrc(content) : collapse(content);
    if (og[key] == null) {
      og[key] = value;
    } else if (Array.isArray(og[key])) {
      og[key].push(value);
    } else {
      og[key] = [og[key], value];
    }
  }
  return og;
}

function extractCanonical(html) {
  for (const tag of collectTags(html, "link")) {
    const rel = (getAttr(tag, "rel") ?? "").toLowerCase();
    if (rel.split(/\s+/).includes("canonical")) {
      return getAttr(tag, "href") ?? "";
    }
  }
  return "";
}

function extractMetaDescription(html) {
  for (const tag of collectTags(html, "meta")) {
    const name = (getAttr(tag, "name") ?? "").toLowerCase();
    if (name === "description") return collapse(getAttr(tag, "content") ?? "");
  }
  return "";
}

function extractTitle(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match ? collapse(match[1]) : "";
}

function extractHeadings(body) {
  const headings = [];
  const re = /<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  for (const match of body.matchAll(re)) {
    const text = innerText(match[2]);
    if (text) headings.push(text);
  }
  return headings;
}

function extractLinks(body) {
  const links = [];
  for (const tag of collectTags(body, "a")) {
    const href = getAttr(tag, "href");
    if (!href || href.includes("/_next")) continue;
    links.push(href);
  }
  return links;
}

function extractImages(body) {
  const images = [];
  for (const tag of collectTags(body, "img")) {
    const src = normalizeImageSrc(getAttr(tag, "src") ?? "");
    const alt = collapse(getAttr(tag, "alt") ?? "");
    if (!src && !alt) continue;
    images.push({ alt, src });
  }
  return images;
}

function normalizeHtml(pathname, html, capturedAt) {
  const jsonLd = extractJsonLd(html);
  const title = extractTitle(html);
  const metaDescription = extractMetaDescription(html);
  const canonical = extractCanonical(html);
  const og = extractOg(html);
  const stripped = stripNonContent(html);
  const bodyMatch = stripped.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : stripped;
  return {
    capturedAt,
    path: pathname,
    title,
    metaDescription,
    canonical,
    og,
    jsonLd,
    headings: extractHeadings(body),
    links: extractLinks(body),
    images: extractImages(body),
    text: innerText(body),
  };
}

function normalizeSitemap(html, capturedAt) {
  const links = [];
  for (const match of html.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)) {
    links.push(collapse(match[1]));
  }
  return {
    capturedAt,
    path: "/sitemap.xml",
    title: "",
    metaDescription: "",
    canonical: "",
    og: {},
    jsonLd: [],
    headings: [],
    links,
    images: [],
    text: innerText(stripNonContent(html)),
  };
}

function normalize(pathname, html, capturedAt) {
  if (pathname === "/sitemap.xml") return normalizeSitemap(html, capturedAt);
  return normalizeHtml(pathname, html, capturedAt);
}

function parseArgs(argv) {
  const compare = argv.includes("--compare");
  const positional = argv.filter((arg) => !arg.startsWith("--"));
  const base = (
    positional[0] ||
    process.env.SNAPSHOT_BASE_URL ||
    "http://localhost:3100"
  ).replace(/\/$/, "");
  return { compare, base };
}

async function fetchText(base, pathname) {
  const url = new URL(pathname, `${base}/`);
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`${url} respondió ${response.status}`);
  }
  return response.text();
}

function firstWindow(golden, fresh) {
  const limit = Math.min(golden.length, fresh.length);
  let index = 0;
  while (index < limit && golden[index] === fresh[index]) index += 1;
  const from = Math.max(0, index - 60);
  return {
    golden: golden.slice(from, index + 80),
    fresh: fresh.slice(from, index + 80),
  };
}

function diffPage(golden, fresh) {
  const diffs = [];
  for (const field of [...CONTENT_FIELDS, "capturedAt", "path"]) {
    const left = JSON.stringify(golden[field]);
    const right = JSON.stringify(fresh[field]);
    if (left !== right) diffs.push({ field, ...firstWindow(left, right) });
  }
  return diffs;
}

async function captureAll(base) {
  const catalog = readCatalog();
  const paths = pagePaths(catalog);
  const capturedAt = todayStamp();
  const pages = [];
  for (const pathname of paths) {
    const html = await fetchText(base, pathname);
    pages.push(normalize(pathname, html, capturedAt));
    console.log(`capturado ${pathname}`);
  }
  return pages;
}

function writePages(pages) {
  mkdirSync(pagesDir, { recursive: true });
  for (const page of pages) {
    const file = join(pagesDir, fileNameFor(page.path));
    writeFileSync(file, `${JSON.stringify(page, null, 2)}\n`);
  }
}

async function compareAll(base) {
  const catalog = readCatalog();
  const paths = pagePaths(catalog);
  const capturedAt = todayStamp();
  let failures = 0;
  const goldenDates = new Set();

  for (const pathname of paths) {
    const name = fileNameFor(pathname);
    const file = join(pagesDir, name);
    let golden;
    try {
      golden = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      console.error(`FALTA ${name}`);
      failures += 1;
      continue;
    }
    if (golden.capturedAt) goldenDates.add(golden.capturedAt);
    const fresh = normalize(pathname, await fetchText(base, pathname), capturedAt);
    const diffs = diffPage(golden, fresh);
    if (diffs.length === 0) {
      console.log(`ok   ${name}`);
      continue;
    }
    failures += 1;
    console.log(`diff ${name}`);
    for (const diff of diffs) {
      console.log(`  campo: ${diff.field}`);
      console.log(`  golden: ${diff.golden}`);
      console.log(`  fresh:  ${diff.fresh}`);
    }
  }

  const goldenDate = [...goldenDates].join(", ") || "(sin fecha)";
  if (goldenDate !== capturedAt) {
    console.log(
      `Aviso: el golden es del ${goldenDate} y hoy es ${capturedAt}. Las salidas dependen del día; si reconstruiste el sitio, recapturá el golden desde master antes de tratar las diferencias como un cambio de contenido.`,
    );
  }

  console.log(
    failures === 0
      ? `${paths.length} páginas, 0 diferencias.`
      : `${failures} páginas con diferencias de ${paths.length}.`,
  );
  return failures === 0;
}

const { compare, base } = parseArgs(process.argv.slice(2));

if (compare) {
  const ok = await compareAll(base);
  if (!ok) process.exitCode = 1;
} else {
  const pages = await captureAll(base);
  writePages(pages);
  console.log(`${pages.length} páginas en ${pagesDir} (capturedAt ${pages[0]?.capturedAt ?? todayStamp()})`);
}
