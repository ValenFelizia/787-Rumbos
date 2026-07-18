import { defineConfig, devices } from "@playwright/test";

const e2ePort = 3100;
const e2eBaseURL = `http://127.0.0.1:${e2ePort}`;

/**
 * Playwright — tests end-to-end (E2E) en un navegador real.
 * Los "smoke tests" son chequeos mínimos: ¿la app abre y las rutas críticas
 * responden? No reemplazan probar a mano todo el catálogo.
 *
 * Local: `npm run test:e2e` (construye en `.next-e2e` y sirve en :3100).
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: e2eBaseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // El script local y el workflow de CI construyen `.next-e2e` antes de Playwright.
    // Ejecutar Next directamente permite que Playwright cierre todo el proceso.
    command: `node node_modules/next/dist/bin/next start -p ${e2ePort}`,
    url: e2eBaseURL,
    // Un servidor persistente puede corresponder a otro build y falsear el smoke.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
