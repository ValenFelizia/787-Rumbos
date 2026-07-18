/**
 * ESLint (flat config) — reglas estáticas sobre el código.
 * "Lint" = detectar errores/anti-patrones sin ejecutar la app
 * (imports rotos, hooks mal usados, etc.).
 *
 * Usamos el preset oficial de Next.js (core-web-vitals + TypeScript).
 */
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".next-e2e/**",
      "node_modules/**",
      ".agents/**",
      "next-env.d.ts",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
