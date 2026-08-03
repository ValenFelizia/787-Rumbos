/**
 * Genera public/og-image.jpg (1200×630, <500 KB) para previews sociales.
 * Uso: node scripts/generate-og-image.mjs
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const W = 1200;
const H = 630;
const outPath = join(root, "public", "og-image.jpg");
const legacyPng = join(root, "public", "og-image.png");

const fontPath = join(root, "public", "fonts", "elaine-sans.bold.ttf");
const fontB64 = readFileSync(fontPath).toString("base64");

const logo = await sharp(join(root, "public", "logo.png"))
  .resize({ width: 420, height: 240, fit: "inside" })
  .png()
  .toBuffer();
const logoMeta = await sharp(logo).metadata();

const overlaySvg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0.12">
      <stop offset="0%" stop-color="#061820" stop-opacity="0.94"/>
      <stop offset="40%" stop-color="#0b4058" stop-opacity="0.82"/>
      <stop offset="70%" stop-color="#0b4058" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#0b4058" stop-opacity="0.14"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f7a92a"/>
      <stop offset="100%" stop-color="#e6b451"/>
    </linearGradient>
    <style>
      @font-face {
        font-family: 'ElaineSans';
        src: url('data:font/ttf;base64,${fontB64}') format('truetype');
        font-weight: 700;
      }
      .brand {
        font-family: 'ElaineSans', 'Arial Black', Arial, sans-serif;
        font-weight: 700;
        fill: #ffffff;
      }
      .sub {
        font-family: 'ElaineSans', Arial, sans-serif;
        font-weight: 700;
        fill: #f3f6f8;
      }
      .meta {
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 600;
        fill: #dae553;
      }
    </style>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#veil)"/>
  <rect x="72" y="292" width="88" height="5" rx="2.5" fill="url(#gold)"/>
  <text x="72" y="412" class="sub" font-size="28">Tu agencia en el Aeropuerto de Córdoba</text>
  <text x="72" y="470" class="meta" font-size="20">Pasajes aéreos · Ómnibus · Paquetes a medida</text>
</svg>`);

const photo = await sharp(join(root, "public", "hero-bg.jpg"))
  .resize(W, H, { fit: "cover", position: "centre" })
  .modulate({ brightness: 0.88, saturation: 1.05 })
  .toBuffer();

let best = null;
for (const quality of [82, 78, 72, 68, 64, 60]) {
  const { data, info } = await sharp(photo)
    .composite([
      { input: overlaySvg, top: 0, left: 0 },
      { input: logo, top: 72, left: 72 },
    ])
    .jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:2:0" })
    .toBuffer({ resolveWithObject: true });

  best = { data, info, quality };
  if (data.length < 500 * 1024) break;
}

if (!best || best.data.length >= 500 * 1024) {
  console.error("ERROR: could not get under 500 KB", best?.data.length);
  process.exit(1);
}

writeFileSync(outPath, best.data);
if (existsSync(legacyPng)) unlinkSync(legacyPng);

const finalMeta = await sharp(outPath).metadata();
console.log(
  JSON.stringify(
    {
      path: "public/og-image.jpg",
      width: finalMeta.width,
      height: finalMeta.height,
      bytes: best.data.length,
      kb: Math.round(best.data.length / 1024),
      jpegQuality: best.quality,
      logo: { width: logoMeta.width, height: logoMeta.height },
      under500kb: best.data.length < 500 * 1024,
      removedLegacyPng: true,
    },
    null,
    2,
  ),
);

if (finalMeta.width !== W || finalMeta.height !== H) {
  console.error("ERROR: dimensions mismatch");
  process.exit(1);
}
