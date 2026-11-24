import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { serializeJsonLd } from "./json-ld-script";

describe("serializeJsonLd", () => {
  it("escapes < characters while preserving JSON structure", () => {
    const input = { name: "</script><script>alert(1)</script>", n: 1 };
    const output = serializeJsonLd(input);

    assert.equal(output.includes("<"), false);
    assert.deepEqual(JSON.parse(output), input);
  });
});
