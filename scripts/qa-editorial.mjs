/**
 * QA del flujo editorial contra un Next ya levantado.
 *
 *   node --env-file=.env scripts/qa-editorial.mjs
 *
 * Usa SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD y SEED_DEMO_PASSWORD.
 * Los demos tienen que existir (SEED_DEMO_USERS=true en el seed).
 * Al final vuelve a correr el seed para dejar el catálogo publicado.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const demoPassword = process.env.SEED_DEMO_PASSWORD;
const databaseUri = process.env.DATABASE_URI;
const logPath = "/opt/cursor/artifacts/qa-editorial.log";

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

async function findBySlug(token, slug, draft = false) {
  const params = new URLSearchParams({
    depth: "0",
    limit: "1",
    "where[slug][equals]": slug,
  });
  if (draft) params.set("draft", "true");
  const response = await fetch(`${base}/api/destinations?${params}`, {
    headers: authHeaders(token, false),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) fail(`find ${slug} → ${response.status} ${JSON.stringify(body).slice(0, 400)}`);
  const doc = body.docs?.[0];
  if (!doc) fail(`find ${slug} no devolvió documentos`);
  return doc;
}

function editable(doc) {
  const copy = { ...doc };
  for (const key of ["id", "createdAt", "updatedAt", "collection"]) delete copy[key];
  return copy;
}

async function patchDestination(token, id, data, { draft = false } = {}) {
  const params = new URLSearchParams({ depth: "0" });
  if (draft) params.set("draft", "true");
  const response = await fetch(`${base}/api/destinations/${id}?${params}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 500) };
  }
  return { status: response.status, body, text };
}

async function pageText(path) {
  const response = await fetch(`${base}${path}`, { cache: "no-store" });
  return { status: response.status, html: await response.text() };
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
  log(`qa base ${base}`);
  const agente = await login("agente@787rumbos.test", demoPassword);
  const encargado = await login("encargado@787rumbos.test", demoPassword);
  log("logins ok");

  await scenario("1 agente publica precio operativo", async () => {
    const salvador = await findBySlug(agente, "salvador-de-bahia");
    const data = editable(salvador);
    let touched = 0;
    data.departures = (data.departures ?? []).map((row) => {
      if (row.priceFrom !== 850) return row;
      touched += 1;
      return { ...row, priceFrom: 851 };
    });
    if (touched === 0) fail("salvador no tiene salidas en 850");
    data.priceValidUntil = "2026-12-31";
    data._status = "published";
    const saved = await patchDestination(agente, salvador.id, data);
    if (saved.status < 200 || saved.status >= 300) {
      fail(`PATCH ${saved.status} ${saved.text.slice(0, 400)}`);
    }
    const detail = await waitFor(async () => {
      const page = await pageText("/destinos/salvador-de-bahia");
      const visible = page.html.replace(/<!--.*?-->/g, "");
      const shown = /USD\s*851/.test(visible);
      return { ok: page.status === 200 && shown, detail: `PATCH ${saved.status}; página ${page.status}; USD 851=${shown}` };
    });
    return detail;
  });

  const marker = "QA-FASE2-DESCRIPCION";
  await scenario("2 agente no publica descripción; el borrador no sale al sitio", async () => {
    const mendoza = await findBySlug(agente, "mendoza");
    const before = mendoza.description;
    const data = editable(mendoza);
    data.description = `${before} ${marker}`;
    data._status = "published";
    const rejected = await patchDestination(agente, mendoza.id, data);
    if (rejected.status !== 400 || !rejected.text.includes("Cambiaste campos que requieren aprobación")) {
      fail(`publish ${rejected.status} ${rejected.text.slice(0, 400)}`);
    }
    data._status = "draft";
    const drafted = await patchDestination(agente, mendoza.id, data, { draft: true });
    if (drafted.status < 200 || drafted.status >= 300) {
      fail(`draft ${drafted.status} ${drafted.text.slice(0, 400)}`);
    }
    const draftDoc = await findBySlug(agente, "mendoza", true);
    const page = await pageText("/destinos/mendoza");
    const unchanged = !page.html.includes(marker);
    if (draftDoc.pendingApproval !== true || !unchanged) {
      fail(`pendingApproval=${draftDoc.pendingApproval}; público sin marker=${unchanged}`);
    }
    return `publish ${rejected.status}; draft ${drafted.status}; pendingApproval=true; público sin el cambio`;
  });

  await scenario("3 encargado publica el borrador", async () => {
    const mendoza = await findBySlug(encargado, "mendoza", true);
    const data = editable(mendoza);
    data._status = "published";
    data.priceValidUntil = "2026-12-31";
    const approved = await patchDestination(encargado, mendoza.id, data);
    if (approved.status < 200 || approved.status >= 300) {
      fail(`PATCH ${approved.status} ${approved.text.slice(0, 400)}`);
    }
    const detail = await waitFor(async () => {
      const page = await pageText("/destinos/mendoza");
      return { ok: page.html.includes(marker), detail: `marker en público=${page.html.includes(marker)}` };
    });
    const published = await findBySlug(encargado, "mendoza", false);
    if (published.pendingApproval !== false) {
      fail(`pendingApproval=${published.pendingApproval}; ${detail}`);
    }
    return `PATCH ${approved.status}; pendingApproval=false; ${detail}`;
  });

  await scenario("4 publicar con precio y sin vigencia", async () => {
    const rio = await findBySlug(encargado, "rio-de-janeiro");
    const saved = await patchDestination(encargado, rio.id, {
      ...editable(rio),
      _status: "published",
      priceValidUntil: null,
    });
    if (saved.status !== 400 || !saved.text.includes("Indicá hasta cuándo vale el precio")) {
      fail(`PATCH ${saved.status} ${saved.text.slice(0, 400)}`);
    }
    return `PATCH ${saved.status}`;
  });

  await scenario("5 vigencia de ayer oculta el monto", async () => {
    if (!databaseUri) fail("falta DATABASE_URI");
    execFileSync("psql", [
      databaseUri,
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      "UPDATE destinations SET price_valid_until = '2026-09-22T00:00:00.000Z' WHERE slug = 'cataratas-del-iguazu';",
    ], { stdio: "pipe" });
    const cataratas = await findBySlug(agente, "cataratas-del-iguazu");
    const revalidate = await patchDestination(agente, cataratas.id, { _status: "draft" }, { draft: true });
    if (revalidate.status < 200 || revalidate.status >= 300) {
      fail(`revalidate ${revalidate.status} ${revalidate.text.slice(0, 300)}`);
    }
    return waitFor(async () => {
      const page = await pageText("/destinos/cataratas-del-iguazu");
      const hasText = page.html.includes("Consultá precio actualizado");
      const hasAmount = page.html.includes("410000") || page.html.includes("410.000");
      return {
        ok: page.status === 200 && hasText && !hasAmount,
        detail: `revalidate ${revalidate.status}; HTTP ${page.status}; texto=${hasText}; monto=${hasAmount}`,
      };
    });
  });

  await scenario("6 agente crea con status published", async () => {
    const salvador = await findBySlug(agente, "salvador-de-bahia");
    const created = await fetch(`${base}/api/destinations`, {
      method: "POST",
      headers: authHeaders(agente),
      body: JSON.stringify({
        slug: "qa-fase2-borrador",
        name: "QA Fase 2",
        country: "Argentina",
        region: "nacional",
        heroImage: salvador.heroImage,
        description: "Destino de prueba del flujo editorial.",
        metaTitle: "QA Fase 2",
        metaDescription: "No publicar.",
        currency: "ARS",
        sortOrder: 999,
        _status: "published",
      }),
    });
    const body = await created.json().catch(() => ({}));
    const status = body.doc?._status;
    if (!((created.status === 200 || created.status === 201) && status === "draft")) {
      fail(`POST ${created.status}; _status=${status ?? "?"}; ${JSON.stringify(body).slice(0, 300)}`);
    }
    return `POST ${created.status}; _status=draft (forzado a borrador, no rechazado)`;
  });

  await scenario("7 agente no borra destinos", async () => {
    const cataratas = await findBySlug(agente, "cataratas-del-iguazu");
    const removed = await fetch(`${base}/api/destinations/${cataratas.id}`, {
      method: "DELETE",
      headers: authHeaders(agente, false),
    });
    const text = await removed.text();
    if (removed.status !== 403) fail(`DELETE ${removed.status} ${text.slice(0, 200)}`);
    return `DELETE ${removed.status}`;
  });

  const passed = results.filter(Boolean).length;
  log(`qa ${passed}/${results.length} pass`);
  if (passed !== results.length) process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  log(`FAIL script — ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  try {
    if (adminEmail && adminPassword) {
      const token = await login(adminEmail, adminPassword);
      const params = new URLSearchParams({
        depth: "0",
        limit: "1",
        "where[slug][equals]": "qa-fase2-borrador",
      });
      const found = await fetch(`${base}/api/destinations?${params}`, {
        headers: authHeaders(token, false),
      });
      const body = await found.json().catch(() => ({}));
      const id = body.docs?.[0]?.id;
      if (id) {
        const deleted = await fetch(`${base}/api/destinations/${id}`, {
          method: "DELETE",
          headers: authHeaders(token, false),
        });
        log(`restore: delete qa-fase2-borrador → ${deleted.status}`);
      } else {
        log("restore: qa-fase2-borrador no estaba");
      }
    }
    execFileSync("npm", ["run", "cms:seed"], {
      stdio: "inherit",
      env: {
        ...process.env,
        SEED_DEMO_USERS: "true",
      },
    });
    log("restore: seed ok");
  } catch (error) {
    log(`restore falló: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
  mkdirSync("/opt/cursor/artifacts", { recursive: true });
  writeFileSync(logPath, `${lines.join("\n")}\n`);
}
