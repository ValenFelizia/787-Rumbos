/**
 * Crea o reusa la clave MCP del asistente de QA local.
 * Solo si existe asistente@787rumbos.test (SEED_DEMO_USERS=true).
 * Escribe MCP_QA_API_KEY en .env si todavía no está. No la imprime.
 *
 *   npx payload run scripts/ensure-mcp-qa-key.ts
 */
import { createHmac, randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { getPayload } from "payload";
import config from "../payload.config";

const email = "asistente@787rumbos.test";
const envPath = ".env";

function readEnvKey(): string | undefined {
  const fromProcess = process.env.MCP_QA_API_KEY?.trim();
  if (fromProcess) return fromProcess;
  try {
    const match = /^MCP_QA_API_KEY=(.*)$/m.exec(readFileSync(envPath, "utf8"));
    const value = match?.[1]?.trim();
    return value || undefined;
  } catch {
    return undefined;
  }
}

function writeEnvKey(apiKey: string): void {
  const current = readFileSync(envPath, "utf8");
  if (/^MCP_QA_API_KEY=/m.test(current)) {
    writeFileSync(envPath, current.replace(/^MCP_QA_API_KEY=.*$/m, `MCP_QA_API_KEY=${apiKey}`));
    return;
  }
  const suffix = current.endsWith("\n") ? "" : "\n";
  writeFileSync(envPath, `${current}${suffix}MCP_QA_API_KEY=${apiKey}\n`);
}

const payload = await getPayload({ config });

const users = await payload.find({
  collection: "users",
  limit: 1,
  overrideAccess: true,
  where: { email: { equals: email } },
});
const user = users.docs[0];
if (!user) {
  console.log(`mcp-key: no existe ${email}. Corré el seed con SEED_DEMO_USERS=true.`);
  process.exit(1);
}

const apiKey = readEnvKey() ?? randomBytes(24).toString("hex");
const index = createHmac("sha256", payload.secret).update(apiKey).digest("hex");
const existing = await payload.find({
  collection: "payload-mcp-api-keys",
  limit: 1,
  overrideAccess: true,
  where: { apiKeyIndex: { equals: index } },
});

if (!existing.docs[0]) {
  await payload.create({
    collection: "payload-mcp-api-keys",
    overrideAccess: true,
    data: {
      user: user.id,
      label: "QA local",
      description: "Clave local del asistente de prueba. No usar en producción.",
      enableAPIKey: true,
      apiKey,
      destinations: { find: true, create: true, update: true },
      media: { find: true },
      "payload-mcp-prompt": { cargarFlyer: true },
    },
  });
  console.log("mcp-key: clave creada para el asistente de QA");
} else {
  console.log("mcp-key: la clave de QA ya estaba en la base");
}

if (!process.env.MCP_QA_API_KEY) {
  writeEnvKey(apiKey);
}
console.log("mcp-key: MCP_QA_API_KEY quedó en .env (no se imprime)");
