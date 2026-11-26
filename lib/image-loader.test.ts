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

  it("returns public assets, SVGs, and external URLs unchanged", () => {
    for (const src of [
      "/hero-bg.jpg",
      "/rumbos/vuelos.jpg",
      "/partners/latam.svg",
      "/api/media/file/icon.svg",
      "https://abc123.public.blob.vercel-storage.com/puerto-madryn.png",
      "https://example.com/images/photo.jpg",
      "/api/media/file/portogalinhas-1.jpg?version=2",
    ]) {
      assert.equal(imageLoader({ src, width: 640 }), src);
    }
  });
});
