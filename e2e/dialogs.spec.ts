import { expect, test } from "@playwright/test";
import { getTodayLocal } from "@/lib/catalog/logic";
import { promoSeed } from "@/scripts/seed-data/promo";

function isPromoSeedActive() {
  return new Date(promoSeed.endsAt + "T00:00:00") >= getTodayLocal();
}

test.describe("quote modal", () => {
  test("opens from CTA with focus inside, traps Tab, and closes via Escape, close button, and backdrop", async ({
    page,
  }) => {
    await page.goto("/");

    const cta = page.getByRole("button", { name: /armar viaje/i }).first();
    await expect(cta).toBeVisible();
    await cta.click();

    const dialog = page.getByRole("dialog", { name: /armá tu viaje a medida/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(":focus")).toHaveCount(1);

    let dialogFocusedSteps = 0;
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      const focusedCount = await page.locator(":focus").count();
      await expect(dialog.locator(":focus")).toHaveCount(focusedCount);
      dialogFocusedSteps += focusedCount;
    }
    expect(dialogFocusedSteps).toBeGreaterThanOrEqual(10);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(cta).toBeFocused();

    await cta.click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /cerrar modal/i }).click();
    await expect(dialog).toBeHidden();
    await expect(cta).toBeFocused();

    await cta.click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(dialog).toBeHidden();
  });

  test("step 3 airline preference is a native radio group with keyboard arrow navigation", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /armar viaje/i }).first().click();
    const dialog = page.getByRole("dialog", { name: /armá tu viaje a medida/i });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/¿a dónde querés viajar\?/i).fill("Brasil");
    await dialog.getByRole("button", { name: /siguiente/i }).click();
    await dialog.getByRole("button", { name: /siguiente/i }).click();

    const radiogroup = dialog.getByRole("radiogroup", { name: /preferencia de aerolínea/i });
    await expect(radiogroup).toBeVisible();

    const radios = radiogroup.getByRole("radio");
    await expect(radios).toHaveCount(8);

    const noPref = radiogroup.getByRole("radio", { name: /sin preferencia/i });
    await expect(noPref).toBeChecked();

    await radiogroup.getByText("GOL", { exact: true }).click();
    const gol = radiogroup.getByRole("radio", { name: "GOL" });
    await expect(gol).toBeChecked();

    await page.keyboard.press("ArrowRight");
    await expect(radiogroup.getByRole("radio", { name: "Avianca" })).toBeChecked();
    await expect(gol).not.toBeChecked();
  });
});

test.describe("mobile navigation dialog", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens with focus inside, returns focus on Escape, closes on nav link, and hands off to quote modal", async ({
    page,
  }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /abrir menú de navegación/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const menuDialog = page.getByRole("dialog", { name: "Menú de navegación" });
    await expect(menuDialog).toBeVisible();
    await expect(menuDialog.locator(":focus")).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(menuDialog).toBeHidden();
    await expect(menuButton).toBeFocused();

    await menuButton.click();
    await expect(menuDialog).toBeVisible();
    await menuDialog.getByRole("link", { name: "Servicios" }).click();
    await expect(menuDialog).toBeHidden();

    await menuButton.click();
    await expect(menuDialog).toBeVisible();
    await menuDialog.getByRole("button", { name: /armar viaje/i }).click();
    await expect(menuDialog).toBeHidden();

    const quoteDialog = page.getByRole("dialog", { name: /armá tu viaje a medida/i });
    await expect(quoteDialog).toBeVisible();
    await expect(quoteDialog.locator(":focus")).toHaveCount(1);
  });
});

test.describe("mobile navigation dialog on rotation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("crossing to desktop width closes the menu and leaves the page usable", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /abrir menú de navegación/i }).click();
    const menuDialog = page.getByRole("dialog", { name: "Menú de navegación" });
    await expect(menuDialog).toBeVisible();

    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(menuDialog).toBeHidden();

    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: /787 Rumbos/i })).toBeFocused();
    await nav.getByRole("link", { name: "Destinos", exact: true }).click();
    await expect(page).toHaveURL(/\/destinos$/);
  });
});

test.describe("special promo dialog", () => {
  test("opens with focus inside, returns focus on Escape, and closes on outside click", async ({
    page,
  }) => {
    test.skip(!isPromoSeedActive(), "Seed promo is expired");

    await page.goto("/");

    const trigger = page.getByRole("button", { name: promoSeed.topBarText });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: promoSeed.title });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(":focus")).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(dialog).toBeHidden();
  });
});
