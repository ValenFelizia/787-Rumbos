/**
 * Carga idempotente del catálogo estático en Payload.
 * Upsert por slug. Las imágenes de `public/destinos` se suben una vez
 * y guardan `legacyPath` para que el render siga usando esa ruta.
 *
 * Uso: npm run cms:seed
 * Admin inicial si existen SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "../payload.config";
import type { FaqItem } from "../lib/constants";
import { whatsappDestinoFaq } from "../lib/catalog/logic";
import type { Departure, DestinationPage } from "../lib/catalog/types";
import { destinationsData } from "./seed-data/destinations";

const seedContext = { disableRevalidate: true };

const payload = await getPayload({ config });

async function ensureAdmin(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("seed: sin SEED_ADMIN_EMAIL/PASSWORD, no se crea admin");
    return;
  }

  const existing = await payload.find({
    collection: "users",
    limit: 1,
    overrideAccess: true,
    where: { email: { equals: email } },
  });
  if (existing.docs[0]) {
    console.log(`seed: admin ya existe (${email})`);
    return;
  }

  await payload.create({
    collection: "users",
    data: { email, password, role: "admin" },
    overrideAccess: true,
    context: seedContext,
  });
  console.log(`seed: admin creado (${email})`);
}

async function ensureMedia(publicPath: string, alt: string): Promise<number> {
  const existing = await payload.find({
    collection: "media",
    limit: 1,
    overrideAccess: true,
    where: { legacyPath: { equals: publicPath } },
  });
  if (existing.docs[0]) return existing.docs[0].id;

  const absolute = path.join(process.cwd(), "public", publicPath);
  if (!existsSync(absolute)) {
    throw new Error(`No existe el archivo público ${publicPath}`);
  }

  const created = await payload.create({
    collection: "media",
    data: { alt, legacyPath: publicPath },
    filePath: absolute,
    overrideAccess: true,
    context: seedContext,
  });
  return created.id;
}

function answerBlocks(name: string, answer: FaqItem["answer"]) {
  const whatsappHref = whatsappDestinoFaq(name);
  return answer.map((part) => {
    if (part.type === "text") {
      return { blockType: "text" as const, value: part.value };
    }
    if (part.href === whatsappHref) {
      return { blockType: "whatsapp" as const, label: part.label };
    }
    return {
      blockType: "link" as const,
      label: part.label,
      href: part.href,
      external: Boolean(part.external),
    };
  });
}

function departureData(dep: Departure) {
  return {
    date: dep.date,
    displayDate: dep.displayDate,
    priceFrom: dep.priceFrom ?? null,
    currency: dep.currency ?? null,
    status: dep.status,
    transport: dep.transport,
    nights: dep.nights,
    note: dep.note ?? null,
    program: dep.program ?? null,
    stayLabel: dep.stayLabel ?? null,
    priceIsFinal: Boolean(dep.priceIsFinal),
    priceValidUntil: null,
  };
}

async function destinationData(dest: DestinationPage, sortOrder: number) {
  const heroImage = await ensureMedia(
    dest.heroImage,
    `Viajar a ${dest.name} con 787 Rumbos`,
  );
  const flyerImage = dest.flyerImage
    ? await ensureMedia(dest.flyerImage, `Folleto Promocional de ${dest.name}`)
    : null;

  return {
    slug: dest.slug,
    name: dest.name,
    country: dest.country,
    region: dest.region,
    metaTitle: dest.metaTitle,
    metaDescription: dest.metaDescription,
    h1: dest.h1 ?? null,
    heroImage,
    flyerImage,
    description: dest.description,
    highlights: dest.highlights.map((text) => ({ text })),
    typicalInclusions: dest.typicalInclusions.map((text) => ({ text })),
    optionalExcursions: (dest.optionalExcursions ?? []).map((text) => ({ text })),
    travelTip: dest.travelTip ?? null,
    priceFrom: dest.priceFrom ?? null,
    currency: dest.currency,
    priceNote: dest.priceNote ?? null,
    priceValidUntil: null,
    departures: dest.departures.map(departureData),
    faq: (dest.faq ?? []).map((item) => ({
      faqId: item.id,
      question: item.question,
      answer: answerBlocks(dest.name, item.answer),
    })),
    sortOrder,
    lastReviewedAt: null,
    reviewedBy: null,
    _status: "published" as const,
  };
}

async function upsertDestination(dest: DestinationPage, sortOrder: number): Promise<"created" | "updated"> {
  const data = await destinationData(dest, sortOrder);
  const existing = await payload.find({
    collection: "destinations",
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: dest.slug } },
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "destinations",
      id: existing.docs[0].id,
      data,
      draft: false,
      overrideAccess: true,
      context: seedContext,
    });
    return "updated";
  }

  await payload.create({
    collection: "destinations",
    data,
    draft: false,
    overrideAccess: true,
    context: seedContext,
  });
  return "created";
}

async function main(): Promise<void> {
  await ensureAdmin();

  let created = 0;
  let updated = 0;
  for (const [index, dest] of destinationsData.entries()) {
    const result = await upsertDestination(dest, index);
    if (result === "created") created += 1;
    else updated += 1;
    console.log(`seed: ${result} ${dest.slug}`);
  }

  console.log(`seed: ${created} creados, ${updated} actualizados, ${destinationsData.length} destinos`);
}

await main();
