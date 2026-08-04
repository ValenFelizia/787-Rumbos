import { expect, test } from "@playwright/test";

/**
 * Smoke tests — si algo fundamental se rompe (404 en home, cotizador muerto),
 * estos tests fallan rápido. Corren en Chromium vía Playwright.
 *
 * Cómo leerlos: cada `test(...)` es un escenario; `page.goto` navega;
 * `expect(...)` afirma algo visible o cierto en la página.
 */

test.describe("rutas críticas", () => {
  test("home carga con la marca y el CTA principal", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: /787 Rumbos: tu agencia en el Aeropuerto de Córdoba/i,
      }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("button", {
          name: /abre el cotizador personalizado/i,
        })
        .first(),
    ).toBeVisible();
  });

  test("listado de destinos responde", async ({ page }) => {
    await page.goto("/destinos");
    await expect(page).toHaveURL(/\/destinos\/?$/);
    await expect(
      page.getByRole("heading", { name: /elegí tu próximo rumbo/i }),
    ).toBeVisible();
  });

  test("ficha de destino (salta) responde", async ({ page }) => {
    await page.goto("/destinos/salta");
    await expect(page).toHaveURL(/\/destinos\/salta\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("página legal responde", async ({ page }) => {
    await page.goto("/legal");
    await expect(
      page.getByRole("heading", { name: /información legal/i }),
    ).toBeVisible();
  });

  test("hub de aéreos responde", async ({ page }) => {
    await page.goto("/aereos");
    await expect(page).toHaveURL(/\/aereos\/?$/);
    await expect(
      page.getByRole("heading", { name: /pasajes aéreos desde córdoba/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /cotizar vuelo por whatsapp/i }).first(),
    ).toBeVisible();
  });

  test("landing LATAM Córdoba responde", async ({ page }) => {
    await page.goto("/aereos/latam-cordoba");
    await expect(page).toHaveURL(/\/aereos\/latam-cordoba\/?$/);
    await expect(
      page.getByRole("heading", { name: /pasajes latam en córdoba/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /cotizar latam por whatsapp/i }).first(),
    ).toBeVisible();
  });

  test("landing GOL Córdoba responde", async ({ page }) => {
    await page.goto("/aereos/gol-cordoba");
    await expect(page).toHaveURL(/\/aereos\/gol-cordoba\/?$/);
    await expect(
      page.getByRole("heading", { name: /pasajes gol en córdoba/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /cotizar gol por whatsapp/i }).first(),
    ).toBeVisible();
  });
});

test.describe("cotizador", () => {
  test("el CTA principal abre el modal de cotización", async ({ page }) => {
    const response = await page.goto("/");

    expect(response).not.toBeNull();
    expect(response?.headers()["content-security-policy"]).toContain(
      "upgrade-insecure-requests",
    );
    expect(response?.headers()["strict-transport-security"]).toContain(
      "max-age=63072000",
    );

    await page
      .getByRole("button", {
        name: /abre el cotizador personalizado/i,
      })
      .first()
      .click();

    const dialog = page.getByRole("dialog", { name: /armá tu viaje a medida/i });
    await expect(dialog).toBeVisible();
    await expect(
      page.getByLabel(/a dónde querés viajar/i),
    ).toBeVisible();
  });
});
