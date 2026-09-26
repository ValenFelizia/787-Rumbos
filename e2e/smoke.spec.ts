import { expect, test } from "@playwright/test";

/**
 * Smoke tests — si algo fundamental se rompe (404 en home, cotizador muerto),
 * estos tests fallan rápido. Corren en Chromium vía Playwright.
 *
 * Cómo leerlos: cada `test(...)` es un escenario; `page.goto` navega;
 * `expect(...)` afirma algo visible o cierto en la página.
 */

test.describe("rutas críticas", () => {
  test("el selector de rumbo deriva vuelos al hub de aéreos", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /qué rumbo estás buscando/i }),
    ).toBeVisible();
    await page.getByRole("link", { name: /quiero un vuelo/i }).click();
    await expect(page).toHaveURL(/\/aereos\/?$/);
    await expect(
      page.getByRole("heading", { name: /pasajes aéreos desde córdoba/i }),
    ).toBeVisible();
  });

  test("la card a medida abre el cotizador", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: /lo armamos con vos/i })
      .click();
    await expect(
      page.getByRole("dialog", { name: /armá tu viaje a medida/i }),
    ).toBeVisible();
  });

  test("la home destaca las salidas con más fechas vigentes", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#destinos");
    await expect(
      section.getByRole("heading", { name: "Próximas salidas desde Córdoba" }),
    ).toBeVisible();
    await expect(
      section.getByRole("heading", { name: "Porto de Galinhas", level: 3 }),
    ).toBeVisible();
    await expect(section.getByRole("link", { name: "Ver detalles y salidas" })).toHaveCount(4);
  });

  test("salvador publica enero, morro y el solo aéreo", async ({ page }) => {
    await page.goto("/destinos/salvador-de-bahia");
    await expect(page.getByText("Vila Galé Salvador").first()).toBeVisible();
    await expect(page.getByText("Salvador y Morro de São Paulo").first()).toBeVisible();
    await expect(page.getByText("Solo aéreo a Salvador").first()).toBeVisible();
    await expect(page.getByText(/USD\s*850/).first()).toBeVisible();
  });

  test("punta cana y bayahibe publican octubre 2026", async ({ page }) => {
    await page.goto("/destinos/punta-cana");
    await expect(page.getByRole("heading", { name: "Paquetes a Punta Cana" })).toBeVisible();
    await expect(page.getByText("Whala! Bávaro").first()).toBeVisible();
    await expect(page.getByText("15 de Octubre").first()).toBeVisible();
    await page.goto("/destinos/bayahibe");
    await expect(page.getByText("Solo adultos").first()).toBeVisible();
  });

  test("home carga con la marca, la promo y el CTA principal", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /Salida Especial Charter: F1 GP de São Paulo/i }),
    ).toBeVisible();
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

  test("filtros de destinos: aria-pressed, live region y empty state (QOL-10)", async ({
    page,
  }) => {
    await page.goto("/destinos");

    const regionGroup = page.getByRole("group", { name: /filtrar por región/i });
    const todos = regionGroup.getByRole("button", { name: /^todos$/i });
    const nacionales = regionGroup.getByRole("button", { name: /^nacionales$/i });

    await expect(todos).toHaveAttribute("aria-pressed", "true");
    await expect(nacionales).toHaveAttribute("aria-pressed", "false");

    const live = page.getByTestId("destinos-result-live");
    await expect(live).toHaveAttribute("aria-live", "polite");
    await expect(live).toHaveText("");

    await nacionales.click();
    await expect(nacionales).toHaveAttribute("aria-pressed", "true");
    await expect(todos).toHaveAttribute("aria-pressed", "false");
    await expect(live).toHaveText(/\d+ destinos?/);

    // Fuerza 0 resultados: nacionales (ARS) + sort precio + moneda USD
    await page.getByLabel(/ordenar/i).selectOption("price-asc");
    const currencyGroup = page.getByRole("group", { name: /filtrar por moneda/i });
    await currencyGroup.getByRole("button", { name: /^usd$/i }).click();
    await expect(currencyGroup.getByRole("button", { name: /^usd$/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(live).toHaveText("0 destinos");

    const empty = page.getByTestId("destinos-filter-empty");
    await expect(empty).toBeVisible();
    await expect(
      empty.getByRole("heading", { name: /no hay destinos con estos filtros/i }),
    ).toBeVisible();
    await expect(empty.getByRole("link", { name: /whatsapp/i })).toHaveAttribute(
      "href",
      /api\.whatsapp\.com/,
    );

    await empty.getByRole("button", { name: /ver todos/i }).click();
    await expect(empty).toHaveCount(0);
    await expect(todos).toHaveAttribute("aria-pressed", "true");
    await expect(live).not.toHaveText("0 destinos");
  });

  test("Armar viaje en card de destinos abre el cotizador en paso 2 prefilled", async ({
    page,
  }) => {
    await page.goto("/destinos");

    const armarViaje = page
      .getByRole("button", { name: /Armar viaje: .+ — abre el cotizador/ })
      .first();
    await expect(armarViaje).toBeVisible();

    const ariaLabel = await armarViaje.getAttribute("aria-label");
    const destName = ariaLabel?.match(/^Armar viaje: (.+) — abre el cotizador$/)?.[1];
    expect(destName).toBeTruthy();

    await armarViaje.click();

    const dialog = page.getByRole("dialog", { name: /armá tu viaje a medida/i });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("progressbar", { name: /progreso de la cotización/i }),
    ).toHaveAttribute("aria-valuetext", "Paso 2 de 3");
    await expect(
      dialog.getByLabel(/cuándo tenés pensado viajar/i),
    ).toBeVisible();

    await dialog.getByRole("button", { name: /atrás/i }).click();
    await expect(dialog.getByLabel(/a dónde querés viajar/i)).toHaveValue(
      destName!,
    );
  });

  test("cards de cluster en destinos abren el hub SEO", async ({ page }) => {
    await page.goto("/destinos");
    const hubs = page.getByRole("navigation", { name: /catálogos desde córdoba/i });
    await expect(hubs.getByRole("link", { name: /brasil desde córdoba/i })).toBeVisible();
    await hubs.getByRole("link", { name: /brasil desde córdoba/i }).click();
    await expect(page).toHaveURL(/\/destinos\/brasil-desde-cordoba\/?$/);
    await expect(
      page.getByRole("heading", { name: /paquetes a brasil desde córdoba/i }),
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

test.describe("mcp", () => {
  test("sin clave, /api/mcp responde 401 y noindex", async ({ request }) => {
    const response = await request.post("/api/mcp", {
      headers: {
        accept: "application/json, text/event-stream",
        "content-type": "application/json",
      },
      data: {
        jsonrpc: "2.0",
        id: "1",
        method: "tools/list",
        params: {},
      },
    });
    expect(response.status()).toBe(401);
    expect(response.headers()["x-robots-tag"] ?? "").toContain("noindex");
  });
});

test.describe("admin", () => {
  test("el login de /admin responde", async ({ page }) => {
    const response = await page.goto("/admin");
    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);
    await expect(page.locator("form")).toBeVisible();
    // Sin usuarios en la base, Payload muestra "crear primer usuario" con dos campos de contraseña.
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
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

    // Chips = subset del catálogo Payload (no lista estática de constants).
    await expect(dialog.getByText(/destinos populares/i)).toBeVisible();
    const suggestionChips = dialog.locator('button[aria-pressed]');
    await expect(suggestionChips.first()).toBeVisible();
    expect(await suggestionChips.count()).toBeGreaterThan(0);
    expect(await suggestionChips.count()).toBeLessThanOrEqual(6);
  });
});

test.describe("navbar en el hero", () => {
  test("mantiene los CTAs desktop ocultos desde el HTML inicial y al volver arriba", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });

    expect(response).not.toBeNull();
    const initialHtml = await response!.text();
    const initialDesktopCtaMarkup = initialHtml.match(
      /<div[^>]*data-testid="desktop-navbar-ctas"[^>]*>/
    )?.[0];

    expect(initialDesktopCtaMarkup).toContain('aria-hidden="true"');
    expect(initialDesktopCtaMarkup).toContain('inert=""');

    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    const navCtaGroup = nav.getByTestId("desktop-navbar-ctas");
    const navCtaGrid = nav.locator("div.opacity-0").first();
    const navCta = nav.locator('button[aria-label^="Armar viaje"]').first();

    await expect(navCtaGroup).toHaveAttribute("aria-hidden", "true");
    await expect(navCtaGroup).toHaveAttribute("inert", "");
    await expect(navCtaGrid).toHaveCSS("opacity", "0");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(navCta).toBeVisible();
    await expect(navCtaGroup).toHaveAttribute("aria-hidden", "false");

    const glowGeometry = await navCta.evaluate((button) => {
      const clipContainer = button.closest<HTMLElement>(".navbar-cta-clip");
      if (!clipContainer) return null;

      const clipStyles = window.getComputedStyle(clipContainer);
      return {
        boxShadow: window.getComputedStyle(button).boxShadow,
        overflow: clipStyles.overflow,
        overflowClipMargin: Number.parseFloat(clipStyles.overflowClipMargin),
      };
    });

    expect(glowGeometry).not.toBeNull();
    expect(glowGeometry?.boxShadow).not.toBe("none");
    expect(glowGeometry?.overflow).toBe("clip");
    expect(glowGeometry?.overflowClipMargin).toBeGreaterThanOrEqual(24);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(navCtaGroup).toHaveAttribute("aria-hidden", "true");
    await expect(navCtaGrid).toHaveCSS("opacity", "0");

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(nav.locator("div.opacity-0").first()).toHaveCSS("opacity", "0");
  });
});
