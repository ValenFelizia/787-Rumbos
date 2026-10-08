/**
 * Wires the synthetic Porto 2 Life sample clip to Porto de Galinhas.
 *
 * Runs ONLY when:
 * - VERCEL_ENV=preview (Vercel preview deployments), or
 * - SEED_HOTEL_VIDEO_PREVIEW=true (local / CI explicit opt-in)
 *
 * Never runs when VERCEL_ENV=production. Does not touch the production DB.
 *
 * The clip is a synthetic ffmpeg sample for the pilot preview.
 * The real Fer phone clip comes later (compress with the ffmpeg recipe in docs).
 *
 * Uso: npx payload run scripts/seed-hotel-video-preview.ts
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "../payload.config";

const SEED_DIR = path.join(process.cwd(), "scripts/seed-data/hotel-video");
const VIDEO_FILE = path.join(SEED_DIR, "porto-2-life-sample.mp4");
/** Served from `public/` so next/image works without relying on Blob/API static. */
const POSTER_PUBLIC_PATH = "/destinos/porto-2-life-poster.jpg";
const POSTER_FILE = path.join(process.cwd(), "public", POSTER_PUBLIC_PATH);
const DEST_SLUG = "porto-de-galinhas";
const HOTEL_NAME = "Porto 2 Life";
const VIDEO_ALT = "Muestra sintética — hotel Porto 2 Life en Porto de Galinhas";
const POSTER_ALT = "Portada sintética — hotel Porto 2 Life en Porto de Galinhas";
const CAPTION = "Muestra sintética del piloto (el clip real se carga después).";

const seedContext = { disableRevalidate: true, skipEditorialValidation: true };

function shouldRun(): boolean {
  if (process.env.VERCEL_ENV === "production") return false;
  if (process.env.VERCEL_ENV === "preview") return true;
  return process.env.SEED_HOTEL_VIDEO_PREVIEW === "true";
}

async function main(): Promise<void> {
  if (!shouldRun()) {
    console.log(
      "seed-hotel-video-preview: skip (solo preview / SEED_HOTEL_VIDEO_PREVIEW=true; nunca production)",
    );
    return;
  }

  if (!existsSync(VIDEO_FILE) || !existsSync(POSTER_FILE)) {
    throw new Error(
      `seed-hotel-video-preview: faltan ${VIDEO_FILE} o ${POSTER_FILE}`,
    );
  }

  const payload = await getPayload({ config });

  const destination = await payload.find({
    collection: "destinations",
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: DEST_SLUG } },
  });
  const dest = destination.docs[0];
  if (!dest) {
    console.log(`seed-hotel-video-preview: no está ${DEST_SLUG}, skip`);
    return;
  }

  // Idempotent: reuse existing sample docs by alt / legacyPath when present.
  let videoId: number;
  const existingVideo = await payload.find({
    collection: "videos",
    limit: 1,
    overrideAccess: true,
    where: { alt: { equals: VIDEO_ALT } },
  });
  if (existingVideo.docs[0]) {
    videoId = existingVideo.docs[0].id;
    console.log(`seed-hotel-video-preview: video ya existe (#${videoId})`);
  } else {
    const created = await payload.create({
      collection: "videos",
      data: { alt: VIDEO_ALT },
      filePath: VIDEO_FILE,
      overrideAccess: true,
      context: seedContext,
    });
    videoId = created.id;
    console.log(`seed-hotel-video-preview: video creado (#${videoId})`);
  }

  let posterId: number;
  const existingPoster = await payload.find({
    collection: "media",
    limit: 1,
    overrideAccess: true,
    where: {
      or: [
        { legacyPath: { equals: POSTER_PUBLIC_PATH } },
        { alt: { equals: POSTER_ALT } },
      ],
    },
  });
  if (existingPoster.docs[0]) {
    posterId = existingPoster.docs[0].id;
    // Ensure legacyPath points at the public asset (next/image + SSG).
    if (existingPoster.docs[0].legacyPath !== POSTER_PUBLIC_PATH) {
      await payload.update({
        collection: "media",
        id: posterId,
        data: { legacyPath: POSTER_PUBLIC_PATH, alt: POSTER_ALT },
        overrideAccess: true,
        context: seedContext,
      });
      console.log(`seed-hotel-video-preview: poster #${posterId} → legacyPath ${POSTER_PUBLIC_PATH}`);
    } else {
      console.log(`seed-hotel-video-preview: poster ya existe (#${posterId})`);
    }
  } else {
    const created = await payload.create({
      collection: "media",
      data: { alt: POSTER_ALT, legacyPath: POSTER_PUBLIC_PATH },
      filePath: POSTER_FILE,
      overrideAccess: true,
      context: seedContext,
    });
    posterId = created.id;
    console.log(`seed-hotel-video-preview: poster creado (#${posterId})`);
  }

  await payload.update({
    collection: "destinations",
    id: dest.id,
    data: {
      hotelVideo: {
        file: videoId,
        poster: posterId,
        hotelName: HOTEL_NAME,
        caption: CAPTION,
      },
    },
    draft: false,
    overrideAccess: true,
    context: seedContext,
  });

  console.log(
    `seed-hotel-video-preview: ${DEST_SLUG} → hotel "${HOTEL_NAME}" (muestra sintética)`,
  );
}

await main();
