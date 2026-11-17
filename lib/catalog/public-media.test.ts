import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { PUBLIC_DESTINO_IMAGES } from "./public-media";

describe("PUBLIC_DESTINO_IMAGES", () => {
  it("lista exactamente los archivos de public/destinos", () => {
    const onDisk = readdirSync(path.join(process.cwd(), "public", "destinos"))
      .map((file) => `/destinos/${file}`)
      .sort();
    assert.deepEqual([...PUBLIC_DESTINO_IMAGES].sort(), onDisk);
  });
});
