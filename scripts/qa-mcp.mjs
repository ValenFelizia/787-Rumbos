/**
 * QA del catálogo por MCP contra un Next ya levantado.
 *
 *   node --env-file=.env scripts/qa-mcp.mjs
 *
 * Usa MCP_QA_API_KEY (scripts/ensure-mcp-qa-key.ts) y los usuarios demo.
 * Al final vuelve a correr el seed.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const mcpUrl = `${base}/api/mcp`;
const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const demoPassword = process.env.SEED_DEMO_PASSWORD;
const logPath = "/opt/cursor/artifacts/qa-mcp.log";

const lines = [];
function log(line) {
  const text = String(line);
  lines.push(text);
  console.log(text);
}

function fail(message) {
  const error = new Error(message);
  error.qa = true;
  throw error;
}

function envKey() {
  if (process.env.MCP_QA_API_KEY?.trim()) return process.env.MCP_QA_API_KEY.trim();
  const match = /^MCP_QA_API_KEY=(.*)$/m.exec(readFileSync(".env", "utf8"));
  const value = match?.[1]?.trim();
  if (!value) fail("falta MCP_QA_API_KEY en el entorno y en .env");
  return value;
}

async function login(email, password) {
  const response = await fetch(`${base}/api/users/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.token) {
    fail(`login ${email} → ${response.status} ${JSON.stringify(body).slice(0, 300)}`);
  }
  return body.token;
}

function authHeaders(token, json = true) {
  const headers = { Authorization: `JWT ${token}` };
  if (json) headers["content-type"] = "application/json";
  return headers;
}

async function connect(apiKey) {
  const transport = new StreamableHTTPClientTransport(new URL(mcpUrl), {
    requestInit: {
      headers: { Authorization: `Bearer ${apiKey}` },
    },
  });
  const client = new Client({ name: "qa-mcp", version: "1.0.0" });
  await client.connect(transport);
  return { client, transport };
}

function toolText(result) {
  const content = Array.isArray(result?.content) ? result.content : [];
  return content.map((item) => (typeof item?.text === "string" ? item.text : "")).join("\n");
}

function jsonBlocks(text) {
  const blocks = [];
  const re = /```json\n([\s\S]*?)\n```/g;
  let match;
  while ((match = re.exec(text))) {
    blocks.push(JSON.parse(match[1]));
  }
  return blocks;
}

function cleanRow(row) {
  const next = {};
  for (const [key, value] of Object.entries(row ?? {})) {
    if (value != null && value !== "") next[key] = value;
  }
  return next;
}

async function pageText(path) {
  const response = await fetch(`${base}${path}`, { cache: "no-store" });
  return { status: response.status, html: await response.text(), headers: response.headers };
}

async function waitFor(check) {
  let last = "";
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const result = await check();
    if (result.ok) return result.detail;
    last = result.detail;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  fail(last);
}

const results = [];
async function scenario(name, run) {
  try {
    const detail = await run();
    results.push(true);
    log(`PASS ${name} — ${detail}`);
  } catch (error) {
    results.push(false);
    log(`FAIL ${name} — ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function main() {
  if (!adminEmail || !adminPassword || !demoPassword) {
    fail("Faltan SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD o SEED_DEMO_PASSWORD");
  }
  execFileSync("npx", ["payload", "run", "scripts/ensure-mcp-qa-key.ts"], {
    stdio: "inherit",
    env: process.env,
  });
  const apiKey = envKey();
  log(`qa base ${base}`);

  await scenario("g sin clave responde 401", async () => {
    const response = await fetch(mcpUrl, {
      method: "POST",
      headers: {
        accept: "application/json, text/event-stream",
        "content-type": "application/json",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: "1", method: "tools/list", params: {} }),
    });
    const robots = response.headers.get("x-robots-tag") || "";
    if (response.status !== 401) fail(`HTTP ${response.status}`);
    if (!robots.includes("noindex")) fail(`401 sin noindex (${robots || "sin header"})`);
    return `HTTP 401; X-Robots-Tag=${robots}`;
  });

  const { client, transport } = await connect(apiKey);
  try {
    let tools = [];
    await scenario("a lista las herramientas", async () => {
      const listed = await client.listTools();
      tools = listed.tools ?? [];
      const names = tools.map((tool) => tool.name).sort();
      log(`tools: ${names.join(", ") || "(ninguna)"}`);
      if (names.length === 0) fail("no hay herramientas");
      return names.join(", ");
    });

    const names = new Set(tools.map((tool) => tool.name));

    await scenario("e no hay delete", async () => {
      const deleteNames = [...names].filter((name) => /delete/i.test(name));
      if (deleteNames.length > 0) fail(`herramientas de borrado: ${deleteNames.join(", ")}`);
      try {
        await client.callTool({ name: "deleteDestinations", arguments: { id: 1 } });
        fail("deleteDestinations respondió");
      } catch (error) {
        if (error && typeof error === "object" && "qa" in error) throw error;
        const message = error instanceof Error ? error.message : String(error);
        return `no está en la lista; la llamada falló (${message.slice(0, 160)})`;
      }
    });

    await scenario("f no expone usuarios ni la promo", async () => {
      const blocked = [...names].filter((name) => /user|promo|global/i.test(name));
      if (blocked.length > 0) fail(blocked.join(", "));
      return "sin users, featuredPromo ni globals";
    });

    let destination;
    await scenario("b encuentra cataratas-del-iguazu", async () => {
      if (!names.has("findDestinations")) fail("falta findDestinations");
      const result = await client.callTool({
        name: "findDestinations",
        arguments: {
          where: JSON.stringify({ slug: { equals: "cataratas-del-iguazu" } }),
          limit: 1,
          depth: 0,
        },
      });
      const text = toolText(result);
      const docs = jsonBlocks(text);
      destination = Array.isArray(docs[0]?.docs) ? docs[0].docs[0] : docs[0];
      if (!destination?.id || destination.slug !== "cataratas-del-iguazu") {
        fail(text.slice(0, 500));
      }
      return `id=${destination.id}; salidas=${destination.departures?.length ?? 0}`;
    });

    const marker = "5 de Diciembre";
    await scenario("c guarda el flyer como borrador y el sitio no cambia", async () => {
      if (!destination) fail("sin destino");
      const departures = (destination.departures ?? []).map(cleanRow);
      departures.push({
        date: "2026-12-05",
        displayDate: marker,
        status: "inquire",
        transport: "bus-cama",
        nights: 3,
        priceFrom: 640000,
        currency: "ARS",
        priceValidUntil: "2026-12-31",
      });
      const result = await client.callTool({
        name: "updateDestinations",
        arguments: {
          id: destination.id,
          draft: true,
          _status: "draft",
          departures,
          priceValidUntil: "2026-12-31",
        },
      });
      const text = toolText(result);
      if (result?.isError || /error updating/i.test(text) || !/updated successfully/i.test(text)) {
        fail(text.slice(0, 700));
      }

      const asistente = await login("asistente@787rumbos.test", demoPassword);
      const me = await fetch(`${base}/api/users/me`, { headers: authHeaders(asistente, false) });
      const meBody = await me.json();
      const userId = meBody.user?.id;
      const draft = await fetch(`${base}/api/destinations/${destination.id}?depth=0&draft=true`, {
        headers: authHeaders(asistente, false),
      });
      const draftBody = await draft.json();
      const dates = (draftBody.departures ?? []).map((row) => row.displayDate);
      if (!dates.includes(marker)) fail(`borrador sin la salida: ${dates.join(", ") || draft.status}`);
      if (draftBody.pendingApproval !== true) fail(`pendingApproval=${draftBody.pendingApproval}`);
      if (draftBody._status !== "draft") fail(`_status=${draftBody._status}`);
      if (userId == null || draftBody.reviewedBy !== userId) {
        fail(`reviewedBy=${draftBody.reviewedBy} asistente=${userId}`);
      }
      const page = await pageText("/destinos/cataratas-del-iguazu");
      if (page.html.includes(marker)) fail("la página pública muestra el borrador");
      return `borrador pendingApproval reviewedBy=${userId}; público sin «${marker}»`;
    });

    await scenario("d publicar se rechaza", async () => {
      if (!destination) fail("sin destino");
      const result = await client.callTool({
        name: "updateDestinations",
        arguments: {
          id: destination.id,
          draft: false,
          _status: "published",
          priceValidUntil: "2026-12-31",
        },
      });
      const text = toolText(result);
      if (!text.includes("Los asistentes de IA solo guardan borradores. Un encargado revisa y publica.")) {
        fail(text.slice(0, 700));
      }
      const page = await pageText("/destinos/cataratas-del-iguazu");
      if (page.html.includes(marker)) fail("publicar rechazado pero el sitio cambió");
      return "rechazado con el mensaje en español; el sitio sigue igual";
    });

    await scenario("h el encargado publica y el sitio muestra la salida", async () => {
      if (!destination) fail("sin destino");
      const encargado = await login("encargado@787rumbos.test", demoPassword);
      const draftRes = await fetch(`${base}/api/destinations/${destination.id}?depth=0&draft=true`, {
        headers: authHeaders(encargado, false),
      });
      const draftBody = await draftRes.json();
      if (!draftRes.ok) fail(`GET draft ${draftRes.status}`);
      const data = { ...draftBody, _status: "published" };
      for (const key of ["id", "createdAt", "updatedAt", "collection"]) delete data[key];
      const saved = await fetch(`${base}/api/destinations/${destination.id}?depth=0`, {
        method: "PATCH",
        headers: authHeaders(encargado),
        body: JSON.stringify(data),
      });
      const savedText = await saved.text();
      if (saved.status < 200 || saved.status >= 300) fail(`PATCH ${saved.status} ${savedText.slice(0, 400)}`);
      const detail = await waitFor(async () => {
        const page = await pageText("/destinos/cataratas-del-iguazu");
        const shown = page.html.includes(marker);
        return { ok: page.status === 200 && shown, detail: `HTTP ${page.status}; «${marker}»=${shown}` };
      });
      return `PATCH ${saved.status}; ${detail}`;
    });
  } finally {
    await transport.close().catch(() => {});
  }
}

try {
  await main();
} catch (error) {
  log(`FAIL script — ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  const passed = results.filter(Boolean).length;
  if (results.length > 0) log(`qa ${passed}/${results.length} pass`);
  if (passed !== results.length) process.exitCode = 1;
  try {
    execFileSync("npm", ["run", "cms:seed"], {
      stdio: "inherit",
      env: { ...process.env, SEED_DEMO_USERS: "true" },
    });
    log("restore: seed ok");
  } catch (error) {
    log(`restore falló: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
  mkdirSync("/opt/cursor/artifacts", { recursive: true });
  writeFileSync(logPath, `${lines.join("\n")}\n`);
}
