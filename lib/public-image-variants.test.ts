import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import imageLoader from "./image-loader";
import {
  EXCLUDED_PUBLIC_RASTERS,
  getOptimizablePublicRasterBase,
  VARIANT_WIDTHS,
} from "./public-image-variants.mjs";

const RASTER_EXT_RE = /\.(?:jpe?g|png)$/i;
const PUBLIC_DIR = path.join(process.cwd(), "public");
/** Absorb millisecond-order checkout jitter when git writes `-w*.webp` before `.jpg`. */
const CHECKOUT_MTIME_SKEW_MS = 500;

function walkFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      out.push(fullPath);
    }
  }
  return out.sort();
}

describe("public image variants on disk", () => {
  it("every public raster mapped by imageLoader has all three up-to-date WebP variants", () => {
    const rasters = walkFiles(PUBLIC_DIR).filter((file) => RASTER_EXT_RE.test(file));
    assert.ok(rasters.length > 0, "Expected raster files under public/");

    for (const sourcePath of rasters) {
      const relPosix = path.relative(PUBLIC_DIR, sourcePath).split(path.sep).join("/");
      const publicSrc = `/${relPosix}`;
      const base = getOptimizablePublicRasterBase(publicSrc);
      const loaderSample = imageLoader({ src: publicSrc, width: VARIANT_WIDTHS[0] });

      if (!base) {
        assert.equal(
          loaderSample,
          publicSrc,
          `Excluded public raster ${publicSrc} should be returned unchanged by imageLoader`,
        );
        assert.ok(
          EXCLUDED_PUBLIC_RASTERS.has(publicSrc.toLowerCase()),
          `Unexpected unmapped public raster ${publicSrc}`,
        );
        continue;
      }

      const sourceStat = statSync(sourcePath);

      for (const width of VARIANT_WIDTHS) {
        const mapped = imageLoader({ src: publicSrc, width });
        assert.notEqual(mapped, publicSrc, `Expected imageLoader to map ${publicSrc} at ${width}`);
        assert.equal(mapped, `${base}-w${width}.webp`);

        const variantPath = path.join(PUBLIC_DIR, mapped.slice(1));
        let variantStat;
        try {
          variantStat = statSync(variantPath);
        } catch {
          assert.fail(
            `Missing WebP variant ${mapped} for ${publicSrc}. Run \`npm run images:public\`.`,
          );
        }

        assert.ok(
          variantStat.size > 0,
          `Empty WebP variant ${mapped} for ${publicSrc}. Run \`npm run images:public\`.`,
        );
        assert.ok(
          variantStat.mtimeMs + CHECKOUT_MTIME_SKEW_MS >= sourceStat.mtimeMs,
          `Stale WebP variant ${mapped} is older than ${publicSrc}. Run \`npm run images:public\`.`,
        );
      }
    }
  });

  it("every entry in EXCLUDED_PUBLIC_RASTERS exists under public/", () => {
    for (const publicSrc of EXCLUDED_PUBLIC_RASTERS) {
      const diskPath = path.join(PUBLIC_DIR, publicSrc.slice(1));
      assert.ok(
        statSync(diskPath).isFile(),
        `Excluded public raster ${publicSrc} does not exist on disk`,
      );
    }
  });
});
