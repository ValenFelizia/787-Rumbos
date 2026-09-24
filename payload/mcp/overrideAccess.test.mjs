/**
 * Las herramientas de colección del plugin MCP 3.75 llaman al local API con
 * `overrideAccess: false` y el usuario de la clave. `createLocalReq` copia ese
 * usuario a `req.user` antes de los hooks. Un argumento `overrideAccess` del
 * cliente no cambia el flag: cae en los datos del documento, no en la operación.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { updateResourceTool } from "../../node_modules/@payloadcms/plugin-mcp/dist/mcp/tools/resource/update.js";

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
};

function captureUpdate() {
  const calls = [];
  let handler;
  const user = {
    id: 9,
    role: "asistente",
    email: "asistente@787rumbos.test",
    collection: "users",
  };
  const req = {
    payload: {
      logger: { info() {}, error() {}, warn() {} },
      update: async (options) => {
        calls.push(options);
        return { id: options.id, _status: "draft" };
      },
    },
  };
  const server = {
    tool(_name, _description, _shape, fn) {
      handler = fn;
    },
  };
  updateResourceTool(
    server,
    req,
    user,
    false,
    "destinations",
    { destinations: { enabled: { find: true, create: true, update: true } } },
    schema,
  );
  return { calls, handler, req, user };
}

describe("updateDestinations de MCP", () => {
  it("opera con overrideAccess false y el usuario de la clave", async () => {
    const { calls, handler, req, user } = captureUpdate();
    assert.equal(typeof handler, "function");
    await handler({ id: 4, draft: true, name: "Cataratas del Iguazú", overrideAccess: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].overrideAccess, false);
    assert.equal(calls[0].draft, true);
    assert.equal(calls[0].user, user);
    assert.equal(calls[0].req, req);
    assert.equal(calls[0].user.role, "asistente");
    const saved = JSON.parse(JSON.stringify(calls[0].data));
    assert.equal(saved.overrideAccess, true);
    assert.equal(saved.name, "Cataratas del Iguazú");
  });
});
