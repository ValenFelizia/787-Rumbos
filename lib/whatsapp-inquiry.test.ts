import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDestinationInquiryMessage,
  destinationInquiryWhatsAppLink,
} from "./whatsapp-inquiry";
import { AGENCY_PHONE } from "./constants";

describe("buildDestinationInquiryMessage", () => {
  it("includes destination and next departure date when present", () => {
    assert.equal(
      buildDestinationInquiryMessage({
        destinationName: "Río de Janeiro",
        departureDisplayDate: "12 de Octubre",
        source: "detail",
      }),
      "Hola, vi Río de Janeiro en la web y quiero consultar por la salida del 12 de Octubre",
    );
  });

  it("omits the date clause when there is no active departure", () => {
    assert.equal(
      buildDestinationInquiryMessage({
        destinationName: "Cancún",
        source: "detail",
      }),
      "Hola, vi Cancún en la web y quiero consultar fechas",
    );
  });

  it("treats empty / whitespace date as missing", () => {
    assert.equal(
      buildDestinationInquiryMessage({
        destinationName: "Bariloche",
        departureDisplayDate: "   ",
      }),
      "Hola, vi Bariloche en la web y quiero consultar fechas",
    );
  });

  it("accepts source=cotizador with the same detail shape (QOL-07 hook)", () => {
    assert.equal(
      buildDestinationInquiryMessage({
        destinationName: "Iguazú",
        departureDisplayDate: "5 de Noviembre",
        source: "cotizador",
      }),
      "Hola, vi Iguazú en la web y quiero consultar por la salida del 5 de Noviembre",
    );
    assert.equal(
      buildDestinationInquiryMessage({
        destinationName: "Iguazú",
        source: "cotizador",
      }),
      "Hola, vi Iguazú en la web y quiero consultar fechas",
    );
  });
});

describe("destinationInquiryWhatsAppLink", () => {
  it("reuses the agency number and encodes the prefill", () => {
    const url = destinationInquiryWhatsAppLink({
      destinationName: "Río de Janeiro",
      departureDisplayDate: "12 de Octubre",
    });
    assert.ok(url.startsWith(`https://api.whatsapp.com/send?phone=${AGENCY_PHONE.whatsapp}&text=`));
    const text = decodeURIComponent(url.split("text=")[1] ?? "");
    assert.equal(
      text,
      "Hola, vi Río de Janeiro en la web y quiero consultar por la salida del 12 de Octubre",
    );
  });
});
