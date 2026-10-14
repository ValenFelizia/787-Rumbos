import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveMediaUrl } from "./media-url";

const publicLegacy = new Set(["/destinos/salta.png", "/destinos/bariloche.jpg"]);

function isPublicAsset(path: string): boolean {
  return publicLegacy.has(path);
}

describe("resolveMediaUrl", () => {
  it("usa legacyPath solo cuando el archivo vive en /public", () => {
    assert.equal(
      resolveMediaUrl(
        { legacyPath: "/destinos/salta.png", url: "/api/media/file/salta.png" },
        { isPublicAsset },
      ),
      "/destinos/salta.png",
    );
  });

  it("prefiere media.url cuando legacyPath no existe en /public", () => {
    assert.equal(
      resolveMediaUrl(
        {
          legacyPath: "/destinos/puerto-madryn.png",
          url: "/api/media/file/puerto-madryn.png",
        },
        { isPublicAsset },
      ),
      "/api/media/file/puerto-madryn.png",
    );
  });

  it("prefiere una URL absoluta de Blob sobre legacyPath", () => {
    const blob =
      "https://abc123.public.blob.vercel-storage.com/puerto-madryn.png";
    assert.equal(
      resolveMediaUrl(
        {
          legacyPath: "/destinos/puerto-madryn.png",
          url: blob,
        },
        { isPublicAsset },
      ),
      blob,
    );
  });

  it("devuelve undefined si falta el media o solo hay un id", () => {
    assert.equal(resolveMediaUrl(undefined, { isPublicAsset }), undefined);
    assert.equal(resolveMediaUrl(null, { isPublicAsset }), undefined);
    assert.equal(resolveMediaUrl(27, { isPublicAsset }), undefined);
    assert.equal(resolveMediaUrl("/destinos/salta.png", { isPublicAsset }), undefined);
  });
});
