import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPageMetadata } from "./seo-metadata";
import { SITE_ORIGIN } from "./site-url";

describe("buildPageMetadata", () => {
  it("canonical y OG/Twitter usan el host www", () => {
    const meta = buildPageMetadata({
      title: "Destinos y paquetes desde Córdoba | 787 Rumbos",
      description: "Catálogo de destinos.",
      path: "/destinos",
    });

    assert.equal(meta.alternates?.canonical, `${SITE_ORIGIN}/destinos`);
    assert.equal(
      (meta.openGraph as { url?: string } | undefined)?.url,
      `${SITE_ORIGIN}/destinos`,
    );
  });

  it("twitter:title/description coinciden con los valores de la página", () => {
    const title = "Paquetes a Bariloche desde Córdoba | 787 Rumbos";
    const description =
      "Bariloche desde Córdoba con una agencia del Aeropuerto de Córdoba.";
    const meta = buildPageMetadata({
      title,
      description,
      path: "/destinos/bariloche",
      images: [
        {
          url: "/destinos/bariloche.jpg",
          width: 800,
          height: 600,
          alt: "Viajar a Bariloche con 787 Rumbos",
        },
      ],
    });

    assert.equal(
      meta.alternates?.canonical,
      `${SITE_ORIGIN}/destinos/bariloche`,
    );
    assert.equal(meta.title, title);
    assert.equal(meta.description, description);

    const og = meta.openGraph as {
      title?: string;
      description?: string;
      url?: string;
      images?: unknown;
    };
    assert.equal(og.title, title);
    assert.equal(og.description, description);
    assert.equal(og.url, `${SITE_ORIGIN}/destinos/bariloche`);
    assert.deepEqual(og.images, [
      {
        url: `${SITE_ORIGIN}/destinos/bariloche.jpg`,
        width: 800,
        height: 600,
        alt: "Viajar a Bariloche con 787 Rumbos",
      },
    ]);

    const twitter = meta.twitter as {
      title?: string;
      description?: string;
      images?: unknown;
      card?: string;
    };
    assert.equal(twitter.card, "summary_large_image");
    assert.equal(twitter.title, title);
    assert.equal(twitter.description, description);
    assert.deepEqual(twitter.images, [
      {
        url: `${SITE_ORIGIN}/destinos/bariloche.jpg`,
        width: 800,
        height: 600,
        alt: "Viajar a Bariloche con 787 Rumbos",
      },
    ]);
  });

  it("deja intacta una og:image que ya es absoluta", () => {
    const blob =
      "https://abc123.public.blob.vercel-storage.com/hero.png";
    const meta = buildPageMetadata({
      title: "Puerto Madryn",
      description: "Paquete.",
      path: "/destinos/puerto-madryn",
      images: [{ url: blob, width: 800, height: 600, alt: "Puerto Madryn" }],
    });
    const og = meta.openGraph as { images?: { url: string }[] };
    assert.equal(og.images?.[0]?.url, blob);
  });

  it("home canonical usa el origen www", () => {
    const meta = buildPageMetadata({
      title: "787 Rumbos | Agencia de Viajes en Córdoba",
      description: "Agencia en el Aeropuerto de Córdoba.",
      path: "/",
    });
    assert.equal(meta.alternates?.canonical, SITE_ORIGIN);
  });
});
