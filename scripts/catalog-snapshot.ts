/**
 * Vuelca el catálogo estático y la promo destacada a e2e/golden/catalog.json.
 *
 * El orden de las claves es el del fuente (no se reordenan). El JSON sale con
 * indentación de 2 espacios. Las respuestas de FAQ se serializan tal cual,
 * incluidos los links de WhatsApp.
 *
 * Uso: npm run snapshot:catalog
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { destinationsData } from "@/scripts/seed-data/destinations";
import { promoSeed } from "@/scripts/seed-data/promo";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "e2e", "golden", "catalog.json");

const snapshot = {
  destinations: destinationsData,
  promo: promoSeed,
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(
  `catalog snapshot: ${snapshot.destinations.length} destinos → ${outPath}`,
);
