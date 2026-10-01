import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SITE_ORIGIN,
  getMetadataBase,
  getSiteOrigin,
  siteUrl,
} from "./site-url";

describe("getSiteOrigin", () => {
  it("usa el origen www por defecto", () => {
    assert.equal(getSiteOrigin({}), SITE_ORIGIN);
    assert.equal(SITE_ORIGIN, "https://www.787rumbos.com.ar");
  });

  it("ignora localhost / 127.0.0.1 de NEXT_PUBLIC_SERVER_URL", () => {
    assert.equal(
      getSiteOrigin({ NEXT_PUBLIC_SERVER_URL: "http://localhost:3000" }),
      SITE_ORIGIN,
    );
    assert.equal(
      getSiteOrigin({ NEXT_PUBLIC_SERVER_URL: "http://127.0.0.1:3100" }),
      SITE_ORIGIN,
    );
  });

  it("normaliza apex y preview a www", () => {
    assert.equal(
      getSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://787rumbos.com.ar" }),
      SITE_ORIGIN,
    );
    assert.equal(
      getSiteOrigin({
        NEXT_PUBLIC_SERVER_URL: "https://787-rumbos.vercel.app",
      }),
      SITE_ORIGIN,
    );
    assert.equal(
      getSiteOrigin({
        NEXT_PUBLIC_SITE_URL: "https://www.787rumbos.com.ar",
      }),
      SITE_ORIGIN,
    );
  });
});

describe("siteUrl", () => {
  it("arma URLs absolutas con www", () => {
    assert.equal(siteUrl("/"), SITE_ORIGIN);
    assert.equal(siteUrl(""), SITE_ORIGIN);
    assert.equal(siteUrl("/destinos"), `${SITE_ORIGIN}/destinos`);
    assert.equal(
      siteUrl("/destinos/bariloche"),
      `${SITE_ORIGIN}/destinos/bariloche`,
    );
    assert.equal(
      siteUrl("destinos/bariloche/"),
      `${SITE_ORIGIN}/destinos/bariloche`,
    );
  });
});

describe("getMetadataBase", () => {
  it("apunta al origen www", () => {
    assert.equal(getMetadataBase({}).origin, SITE_ORIGIN);
  });
});
