/**
 * Checks that every <img> and og:image on the live site loads.
 *
 * Crawls the home page and each /destinos/<slug> page linked from it,
 * then requests every image URL. Exits 1 and lists the broken ones.
 *
 * Usage: node scripts/check-site-images.mjs [baseUrl]
 */
const base = (process.argv[2] ?? "https://www.787rumbos.com.ar").replace(/\/$/, "");

const TIMEOUT_MS = 60_000;

const decode = (value) => value.replaceAll("&amp;", "&");

async function fetchHtml(pagePath) {
  const res = await fetch(base + pagePath, {
    headers: { "cache-control": "no-cache" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${pagePath} -> HTTP ${res.status}`);
  return res.text();
}

function imageUrls(html) {
  const urls = new Set();
  for (const [, src] of html.matchAll(/<img\b[^>]*?\ssrc="([^"]+)"/g)) urls.add(decode(src));
  for (const [, srcset] of html.matchAll(/<img\b[^>]*?\ssrcset="([^"]+)"/gi)) {
    for (const candidate of srcset.split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) urls.add(decode(url));
    }
  }
  for (const [, src] of html.matchAll(/<meta\s+property="og:image"\s+content="([^"]+)"/g)) {
    urls.add(decode(src));
  }
  return [...urls].filter((url) => !url.startsWith("data:"));
}

const home = await fetchHtml("/");
const destinoPaths = [
  ...new Set([...home.matchAll(/href="(\/destinos\/[a-z0-9-]+)"/g)].map(([, href]) => href)),
];

const pages = new Map([["/", home]]);
for (const destinoPath of destinoPaths) pages.set(destinoPath, await fetchHtml(destinoPath));

const usedBy = new Map();
for (const [pagePath, html] of pages) {
  for (const url of imageUrls(html)) {
    const absolute = new URL(url, base).href;
    usedBy.set(absolute, [...(usedBy.get(absolute) ?? []), pagePath]);
  }
}

const broken = [];
for (const url of usedBy.keys()) {
  const pagesUsing = usedBy.get(url).join(", ");
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/")) broken.push(`${res.status} ${url} (${pagesUsing})`);
  } catch (error) {
    broken.push(`${error.name} ${url} (${pagesUsing})`);
  }
}

console.log(`${pages.size} pages, ${usedBy.size} images checked.`);
if (broken.length) {
  console.error(`\n${broken.length} broken images:\n${broken.join("\n")}`);
  process.exit(1);
}
console.log("All images OK.");
