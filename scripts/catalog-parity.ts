/**
 * Compara el catálogo publicado en Postgres con e2e/golden/catalog.json.
 * Ignora clave ausente vs undefined. Si alguna parte FAQ quedó como
 * `whatsapp`, la reexpande al href antes de comparar.
 *
 * Uso: npm run test:parity
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "../payload.config";
import { whatsappDestinoFaq } from "../lib/catalog/logic";
import { mapDestination, type DestinationDoc } from "../lib/catalog/map";
import type { DestinationPage } from "../lib/catalog/types";

const goldenPath = path.join(process.cwd(), "e2e/golden/catalog.json");

function expandWhatsapp(dest: DestinationPage): DestinationPage {
  if (!dest.faq) return dest;
  const href = whatsappDestinoFaq(dest.name);
  return {
    ...dest,
    faq: dest.faq.map((item) => ({
      ...item,
      answer: item.answer.map((part) => {
        if (part.type === "link") return part;
        const raw = part as { type?: string; label?: string };
        if (raw.type === "whatsapp") {
          return { type: "link" as const, label: raw.label ?? "WhatsApp", href, external: true };
        }
        return part;
      }),
    })),
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function diffAt(label: string, expected: unknown, actual: unknown, out: string[]): void {
  if (Object.is(expected, actual)) return;
  if (Array.isArray(expected) || Array.isArray(actual)) {
    if (!Array.isArray(expected) || !Array.isArray(actual)) {
      out.push(`${label}: tipo de array distinto`);
      return;
    }
    if (expected.length !== actual.length) {
      out.push(`${label}: largo ${expected.length} vs ${actual.length}`);
    }
    const length = Math.max(expected.length, actual.length);
    for (let index = 0; index < length; index += 1) {
      diffAt(`${label}[${index}]`, expected[index], actual[index], out);
    }
    return;
  }
  if (isObject(expected) || isObject(actual)) {
    if (!isObject(expected) || !isObject(actual)) {
      out.push(`${label}: ${JSON.stringify(expected)} !== ${JSON.stringify(actual)}`);
      return;
    }
    const keys = new Set([...Object.keys(expected), ...Object.keys(actual)]);
    for (const key of keys) {
      const left = Object.prototype.hasOwnProperty.call(expected, key) ? expected[key] : undefined;
      const right = Object.prototype.hasOwnProperty.call(actual, key) ? actual[key] : undefined;
      if (left === undefined && right === undefined) continue;
      diffAt(`${label}.${key}`, left, right, out);
    }
    return;
  }
  out.push(`${label}: ${JSON.stringify(expected)} !== ${JSON.stringify(actual)}`);
}

const payload = await getPayload({ config });
const result = await payload.find({
  collection: "destinations",
  depth: 1,
  draft: false,
  limit: 0,
  overrideAccess: true,
  pagination: false,
  sort: "sortOrder",
  where: { _status: { equals: "published" } },
});

const actual = result.docs.map((doc) => expandWhatsapp(mapDestination(doc as DestinationDoc)));
const golden = JSON.parse(readFileSync(goldenPath, "utf8")) as { destinations: DestinationPage[] };
const expected = golden.destinations.map((dest) => expandWhatsapp(JSON.parse(JSON.stringify(dest))));
const normalizedActual = JSON.parse(JSON.stringify(actual)) as DestinationPage[];

const differences: string[] = [];
diffAt("destinations", expected, normalizedActual, differences);

if (differences.length === 0) {
  console.log(`parity: 0 differences (${actual.length} destinos)`);
} else {
  console.error(`parity: ${differences.length} differences`);
  for (const line of differences.slice(0, 40)) console.error(line);
  if (differences.length > 40) console.error(`… y ${differences.length - 40} más`);
  process.exitCode = 1;
}
