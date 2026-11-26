import assert from "node:assert/strict";
import { describe, it } from "node:test";
import imageLoader from "./image-loader";

describe("imageLoader", () => {
  it("picks the smallest variant width >= requested width, capping at 1920", () => {
    const src = "/api/media/file/portogalinhas-1.jpg";
    assert.equal(imageLoader({ src, width: 320 }), "/api/media/file/portogalinhas-1-w640.webp");
    assert.equal(imageLoader({ src, width: 640 }), "/api/media/file/portogalinhas-1-w640.webp");
    assert.equal(imageLoader({ src, width: 641 }), "/api/media/file/portogalinhas-1-w1280.webp");
    assert.equal(imageLoader({ src, width: 1280 }), "/api/media/file/portogalinhas-1-w1280.webp");
    assert.equal(imageLoader({ src, width: 1281 }), "/api/media/file/portogalinhas-1-w1920.webp");
    assert.equal(imageLoader({ src, width: 1920 }), "/api/media/file/portogalinhas-1-w1920.webp");
    assert.equal(imageLoader({ src, width: 3840 }), "/api/media/file/portogalinhas-1-w1920.webp");
  });

  it("supports jpeg, png, webp, avif, case-insensitive extensions, and dots in basename", () => {
    assert.equal(
      imageLoader({ src: "/api/media/file/salta.jpeg", width: 640 }),
      "/api/media/file/salta-w640.webp",
    );
    assert.equal(
      imageLoader({ src: "/api/media/file/gp-sao-paulo.png", width: 800 }),
      "/api/media/file/gp-sao-paulo-w1280.webp",
    );
    assert.equal(
      imageLoader({ src: "/api/media/file/cancun.webp", width: 640 }),
      "/api/media/file/cancun-w640.webp",
    );
    assert.equal(
      imageLoader({ src: "/api/media/file/rio.de.janeiro.AVIF", width: 1500 }),
      "/api/media/file/rio.de.janeiro-w1920.webp",
    );
  });

  it("handles absolute URLs pointing to /api/media/file/...", () => {
    assert.equal(
      imageLoader({
        src: "https://www.787rumbos.com.ar/api/media/file/bariloche.jpg",
        width: 640,
      }),
      "/api/media/file/bariloche-w640.webp",
    );
    assert.equal(
      imageLoader({
        src: "http://localhost:3000/api/media/file/mendoza.png",
        width: 1280,
      }),
      "/api/media/file/mendoza-w1280.webp",
    );
  });

  it("maps local public/ rasters to pre-generated WebP variants", () => {
    assert.equal(imageLoader({ src: "/hero-bg.jpg", width: 320 }), "/hero-bg-w640.webp");
    assert.equal(imageLoader({ src: "/hero-bg.jpg", width: 640 }), "/hero-bg-w640.webp");
    assert.equal(imageLoader({ src: "/hero-bg.jpg", width: 641 }), "/hero-bg-w1280.webp");
    assert.equal(imageLoader({ src: "/hero-bg.jpg", width: 1280 }), "/hero-bg-w1280.webp");
    assert.equal(imageLoader({ src: "/hero-bg.jpg", width: 1920 }), "/hero-bg-w1920.webp");
    assert.equal(imageLoader({ src: "/hero-bg.jpg", width: 3840 }), "/hero-bg-w1920.webp");

    assert.equal(
      imageLoader({ src: "/rumbos/vuelos.jpg", width: 640 }),
      "/rumbos/vuelos-w640.webp",
    );
    assert.equal(
      imageLoader({ src: "/instagram/post2.png", width: 640 }),
      "/instagram/post2-w640.webp",
    );
    assert.equal(
      imageLoader({ src: "/destinos/cancun.jpg", width: 1280 }),
      "/destinos/cancun-w1280.webp",
    );
    assert.equal(
      imageLoader({ src: "/partners/viabariloche.png", width: 640 }),
      "/partners/viabariloche-w640.webp",
    );
    assert.equal(
      imageLoader({ src: "/destinos/salta.JPEG", width: 640 }),
      "/destinos/salta-w640.webp",
    );
  });

  it("returns excluded public assets, SVGs, query strings, and external URLs unchanged", () => {
    for (const src of [
      "/og-image.jpg",
      "/afip.jpg",
      "/afip.jpg?v=20260503",
      "/favicon-32x32.png",
      "/icon-192.png",
      "/icon-512.png",
      "/qr-resenas-787.png",
      "/hero-bg.jpg?v=2",
      "/hero-bg-w640.webp",
      "/partners/latam.svg",
      "/favicon.svg",
      "/api/media/file/icon.svg",
      "https://abc123.public.blob.vercel-storage.com/puerto-madryn.png",
      "https://example.com/images/photo.jpg",
      "https://www.787rumbos.com.ar/hero-bg.jpg",
      "//example.com/hero-bg.jpg",
      "/api/media/file/portogalinhas-1.jpg?version=2",
    ]) {
      assert.equal(imageLoader({ src, width: 640 }), src);
    }
  });
});
