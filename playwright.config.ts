import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright — tests end-to-end (E2E) en un navegador real.
 * Los "smoke tests" son chequeos mínimos: ¿la app abre y las rutas críticas
 * responden? No reemplazan probar a mano todo el catálogo.
 *
 * Local: `npm run test:e2e` (levanta el server solo si no hay uno en :3000).
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // En CI el workflow ya corrió `npm run build`; en local construimos acá.
    command: process.env.CI ? "npm run start" : "npm run build && npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
