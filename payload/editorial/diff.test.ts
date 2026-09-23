import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { changedFields, nonOperationalChanges } from "./diff";

const published = {
  id: 4,
  updatedAt: "2026-09-01T00:00:00.000Z",
  createdAt: "2026-08-01T00:00:00.000Z",
  _status: "published",
  pendingApproval: false,
  name: "Cataratas del Iguazú",
  description: "La Garganta del Diablo.",
  priceFrom: 410000,
  currency: "ARS",
  priceNote: "por persona en base doble",
  priceValidUntil: null,
  heroImage: 12,
  departures: [
    {
      id: "row-a",
      date: "2026-10-09",
      displayDate: "9 de Octubre",
      priceFrom: 410000,
      priceIsFinal: false,
      status: "inquire",
    },
  ],
};

describe("changedFields", () => {
  it("treats an operational price edit as allowed", () => {
    const incoming = {
      ...published,
      priceFrom: 390000,
      priceValidUntil: "2026-12-31T00:00:00.000Z",
      departures: [
        {
          id: "row-a",
          date: "2026-10-09",
          displayDate: "9 de Octubre",
          priceFrom: 380000,
          status: "inquire",
        },
      ],
    };
    assert.deepEqual(nonOperationalChanges(published, incoming), []);
    assert.deepEqual(changedFields(published, incoming), [
      "departures",
      "priceFrom",
      "priceValidUntil",
    ]);
  });

  it("rejects a non-operational description change", () => {
    const incoming = {
      description: "Texto nuevo que no es operativo.",
      priceFrom: 410000,
    };
    assert.deepEqual(nonOperationalChanges(published, incoming), ["description"]);
  });

  it("ignores array row ids, timestamps and status", () => {
    const incoming = {
      id: 99,
      updatedAt: "2026-09-23T12:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      _status: "draft",
      pendingApproval: true,
      description: "La Garganta del Diablo.",
      heroImage: { id: 12, url: "/destinos/cataratas.jpg", alt: "Cataratas" },
      departures: [
        {
          id: "otro-id",
          date: "2026-10-09",
          displayDate: "9 de Octubre",
          priceFrom: "410000",
          priceIsFinal: false,
          status: "inquire",
        },
      ],
    };
    assert.deepEqual(changedFields(published, incoming), []);
  });
});
