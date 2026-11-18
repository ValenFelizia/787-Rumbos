import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveMediaUrl } from "./media-url";

describe("resolveMediaUrl", () => {
  it("usa media.url", () => {
    assert.equal(
      resolveMediaUrl({ url: "/api/media/file/salta-1.png" }),
      "/api/media/file/salta-1.png",
    );
  });

  it("devuelve una URL absoluta de Blob tal cual", () => {
    const blob = "https://abc123.public.blob.vercel-storage.com/puerto-madryn.png";
    assert.equal(resolveMediaUrl({ url: blob }), blob);
  });

  it("devuelve undefined si falta el media, solo hay un id o no hay url", () => {
    assert.equal(resolveMediaUrl(undefined), undefined);
    assert.equal(resolveMediaUrl(null), undefined);
    assert.equal(resolveMediaUrl(27), undefined);
    assert.equal(resolveMediaUrl("/destinos/salta.png"), undefined);
    assert.equal(resolveMediaUrl({ url: "  " }), undefined);
  });
});
