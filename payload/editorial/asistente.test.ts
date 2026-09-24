import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ASISTENTE_DRAFT_ONLY_MESSAGE, decideAsistenteSave } from "./asistente";

describe("decideAsistenteSave", () => {
  it("rechaza publicar, crear o actualizar sin borrador", () => {
    for (const input of [
      { role: "asistente", status: "published", draft: true },
      { role: "asistente", status: "published", draft: false },
      { role: "asistente", status: "draft", draft: false },
      { role: "asistente", status: undefined, draft: false },
      { role: "asistente", status: undefined, draft: undefined },
    ]) {
      assert.deepEqual(decideAsistenteSave(input), {
        allowed: false,
        message: ASISTENTE_DRAFT_ONLY_MESSAGE,
      });
    }
  });

  it("permite un borrador explícito y lo marca para revisión", () => {
    assert.deepEqual(decideAsistenteSave({ role: "asistente", status: "draft", draft: true }), {
      allowed: true,
      pendingApproval: true,
    });
    assert.deepEqual(decideAsistenteSave({ role: "asistente", status: undefined, draft: true }), {
      allowed: true,
      pendingApproval: true,
    });
  });

  it("no interviene en los otros roles", () => {
    for (const role of ["admin", "encargado", "agente", null]) {
      assert.equal(decideAsistenteSave({ role, status: "published", draft: false }), null);
    }
  });
});
