/**
 * Mide peso HTML (raw + gzip) y recursos de imagen en el HTML inicial
 * de / y /destinos. Uso:
 *   node scripts/measure-page-weight.mjs [baseUrl]
 *   MEASURE_LABEL=before node scripts/measure-page-weight.mjs http://localhost:3000
 */
import { gzipSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = (process.argv[2] || process.env.MEASURE_BASE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);
const label = process.env.MEASURE_LABEL || "measure";
const outDir = "/opt/cursor/artifacts";
mkdirSync(outDir, { recursive: true });

const PATHS = ["/", "/destinos"];

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
      if (name.startsWith("#x")) return String.fromCodePoint(Number.parseInt(name.slice(2), 16));
      if (name.startsWith("#")) return String.fromCodePoint(Number.parseInt(name.slice(1), 10));
      return match;
    },
  );
}

function getAttr(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i");
  const match = tag.match(re);
  if (!match) return null;
  return decodeEntities(match[2] ?? match[3] ?? "");
}

function collectImgTags(html) {
  return html.match(/<img\b[^>]*>/gi) ?? [];
}

function analyzeImages(html) {
  const imgs = collectImgTags(html);
  const rows = imgs.map((tag) => {
    const src = getAttr(tag, "src") ?? "";
    const sizes = getAttr(tag, "sizes");
    const loading = getAttr(tag, "loading");
    const fetchPriority = getAttr(tag, "fetchpriority") ?? getAttr(tag, "fetchPriority");
    const isPriority =
      fetchPriority === "high" ||
      /\bpriority\b/i.test(tag) ||
      loading === "eager" ||
      (loading == null && fetchPriority === "high");
    // Heurística above-fold: priority/eager o primer hero (sin loading=lazy)
    const aboveFold = loading !== "lazy" && (isPriority || loading === "eager" || fetchPriority === "high");
    return { src: src.slice(0, 120), sizes, loading, fetchPriority, aboveFold };
  });

  // Contar también loading=eager explícitos (RumboSelector etc.)
  const eagerCount = rows.filter((r) => r.loading === "eager" || r.fetchPriority === "high").length;
  const lazyCount = rows.filter((r) => r.loading === "lazy").length;
  const noLazyCount = rows.filter((r) => r.loading !== "lazy").length;

  return {
    totalImgsInHtml: rows.length,
    eagerOrHighPriority: eagerCount,
    explicitLazy: lazyCount,
    notLazy: noLazyCount,
    samples: rows.slice(0, 12),
  };
}

/** Rough RSC payload size: self.__next_f.push chunks / flight script bodies. */
function rscPayloadBytes(html) {
  let total = 0;
  const re =
    /<script[^>]*>\s*self\.__next_f\.push\(([\s\S]*?)\)\s*<\/script>/gi;
  for (const match of html.matchAll(re)) {
    total += Buffer.byteLength(match[1] ?? "", "utf8");
  }
  return total;
}

async function measure(pathname) {
  const url = `${base}${pathname}`;
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const html = await res.text();
  const raw = Buffer.byteLength(html, "utf8");
  const gzip = gzipSync(Buffer.from(html, "utf8")).byteLength;
  const images = analyzeImages(html);
  const rsc = rscPayloadBytes(html);
  return {
    path: pathname,
    url,
    htmlRawBytes: raw,
    htmlGzipBytes: gzip,
    htmlRawKb: Number((raw / 1024).toFixed(1)),
    htmlGzipKb: Number((gzip / 1024).toFixed(1)),
    rscPushPayloadBytes: rsc,
    rscPushPayloadKb: Number((rsc / 1024).toFixed(1)),
    images,
  };
}

const results = [];
for (const path of PATHS) {
  results.push(await measure(path));
}

const report = {
  label,
  measuredAt: new Date().toISOString(),
  base,
  pages: results,
};

const outPath = join(outDir, `page-weight-${label}.json`);
writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify(report, null, 2));
console.log(`\nWrote ${outPath}`);
