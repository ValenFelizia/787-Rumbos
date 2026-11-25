import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveUniqueMediaFilename } from "./filename";

describe("resolveUniqueMediaFilename", () => {
  it("keeps the incoming filename when there is no basename clash", () => {
    assert.equal(resolveUniqueMediaFilename("bariloche.jpg", ["salta.png", "mendoza.jpg"]), "bariloche.jpg");
  });

  it("renames x.png to x-1.png when x.jpg exists", () => {
    assert.equal(resolveUniqueMediaFilename("x.png", ["x.jpg"]), "x-1.png");
  });

  it("increments to x-2.png when x and x-1 are already taken", () => {
    assert.equal(resolveUniqueMediaFilename("x.png", ["x.jpg", "x-1.webp"]), "x-2.png");
  });

  it("renames filenames whose basename ends with a reserved size suffix (-w640/-w1280/-w1920)", () => {
    assert.equal(resolveUniqueMediaFilename("hero-w640.jpg", []), "hero-w640-1.jpg");
    assert.equal(resolveUniqueMediaFilename("hero-w1280.png", ["hero-w1280-1.jpg"]), "hero-w1280-2.png");
    assert.equal(resolveUniqueMediaFilename("hero-w1920.webp", []), "hero-w1920-1.webp");
  });

  it("handles multi-dot filenames by splitting on the final dot", () => {
    assert.equal(resolveUniqueMediaFilename("rio.de.janeiro.png", ["rio.de.janeiro.jpg"]), "rio.de.janeiro-1.png");
  });
});
