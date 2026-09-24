import { mcpPlugin } from "@payloadcms/plugin-mcp";
import type { CollectionConfig, Field, PayloadRequest } from "payload";
import { z } from "zod";
import { roleOf } from "../access";

function adminOnly({ req }: { req: PayloadRequest }): boolean {
  return roleOf(req.user) === "admin";
}

const DESTINATION_DESCRIPTION = [
  "Destinos del catálogo de 787 Rumbos (paquetes de viaje / travel packages).",
  "Siempre guardá como borrador: draft=true y _status=\"draft\".",
  "No publiques (_status=\"published\" ni draft=false): un encargado revisa y publica.",
  "No borres. No inventes datos que no estén en el flyer.",
  "Ciudad de salida: no asumas Córdoba. Si el flyer no la dice, no la escribas; puede ser Córdoba o Ezeiza y se confirma al consultar.",
  "departures[].date es YYYY-MM-DD (una salida nueva o modificada tiene que ser de hoy o de un día que viene).",
  "departures[].displayDate es el texto visible, por ejemplo \"8 de Julio\".",
  "departures[].status: confirmed | few-seats | sold-out | inquire.",
  "departures[].transport: aereo | bus | bus-cama | mix.",
  "departures[].nights es un número.",
  "Si hay priceFrom en el destino o en una salida que no esté agotada, priceValidUntil (AAAA-MM-DD, hoy o posterior) es obligatorio para que un humano pueda publicar. Cargalo también en el borrador.",
  "region: nacional | internacional. currency: ARS | USD. slug en kebab-case, único.",
  "heroImage y flyerImage son ids de media que ya existen.",
].join(" ");

const MEDIA_DESCRIPTION = [
  "Imágenes del catálogo (hero y folleto). Solo lectura.",
  "Buscá el id y usalo en heroImage o flyerImage del destino.",
  "No subas archivos por MCP: esta herramienta no recibe el archivo. Una imagen nueva la carga un humano en /admin.",
].join(" ");

const CARGAR_FLYER = [
  "Cargá el flyer como borrador de un destino de 787 Rumbos. No publiques.",
  "Usá findDestinations, y createDestinations o updateDestinations con draft=true y _status=\"draft\".",
  "No borres. No toques usuarios ni la promo destacada.",
  "No inventes precios, fechas, hoteles, cupos ni ciudad de salida que el flyer no traiga.",
  "No asumas que la salida es desde Córdoba.",
  "date: YYYY-MM-DD. displayDate: como «8 de Julio». status: confirmed, few-seats, sold-out o inquire.",
  "transport: aereo, bus, bus-cama o mix. nights: número.",
  "Si hay un monto, cargá priceValidUntil (AAAA-MM-DD). Igual queda en borrador: un encargado revisa y publica.",
  "Si falta un dato, dejalo vacío y decilo en el resumen. No completes huecos.",
].join(" ");

function withSpanishLabels(field: Field): Field {
  if ("fields" in field && Array.isArray(field.fields)) {
    const next = {
      ...field,
      fields: field.fields.map(withSpanishLabels),
    };
    if (next.type === "collapsible" && typeof next.label === "string") {
      const labels: Record<string, string> = {
        Destinations: "Destinos",
        Media: "Imágenes",
        Tools: "Herramientas",
        Prompts: "Indicaciones",
        Resources: "Recursos",
      };
      if (labels[next.label]) next.label = labels[next.label];
    }
    if ("name" in next && next.name === "payload-mcp-prompt") {
      next.label = "Indicaciones";
    }
    return next as Field;
  }

  if (!("name" in field) || typeof field.name !== "string") return field;

  if (field.name === "user") {
    return {
      ...field,
      label: "Usuario",
      access: { create: adminOnly, update: adminOnly },
      admin: {
        ...field.admin,
        description:
          "La clave entra al catálogo con el rol de este usuario. Para un bot, elegí Asistente (IA).",
      },
    } as Field;
  }
  if (field.name === "label") {
    return {
      ...field,
      label: "Nombre",
      admin: {
        ...field.admin,
        description: "Un nombre corto para reconocer la clave, por ejemplo «Grok Bot».",
      },
    } as Field;
  }
  if (field.name === "description") {
    return {
      ...field,
      label: "Para qué sirve",
      admin: {
        ...field.admin,
        description: "Quién la usa. Sirve para revocarla después.",
      },
    } as Field;
  }

  const operationLabels: Record<string, string> = {
    find: "Buscar",
    create: "Crear",
    update: "Actualizar",
    delete: "Borrar",
    cargarFlyer: "Cargar flyer",
  };
  if (operationLabels[field.name]) {
    return { ...field, label: operationLabels[field.name] } as Field;
  }
  return field;
}

function restrictApiKeys(collection: CollectionConfig): CollectionConfig {
  collection.labels = { singular: "Clave de API", plural: "Claves de API" };
  collection.admin = {
    ...collection.admin,
    group: "MCP",
    useAsTitle: "label",
    description:
      "Solo un admin crea y revoca claves. Cada clave actúa como el usuario asociado. Un asistente de IA solo guarda borradores: habilitá buscar, crear y actualizar en Destinos, y buscar en Imágenes. No habilites borrar.",
  };
  collection.access = {
    admin: adminOnly,
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
    unlock: adminOnly,
  };
  collection.fields = collection.fields.map(withSpanishLabels);
  return collection;
}

export const mcp = mcpPlugin({
  userCollection: "users",
  collections: {
    destinations: {
      description: DESTINATION_DESCRIPTION,
      enabled: {
        find: true,
        create: true,
        update: true,
        delete: false,
      },
    },
    media: {
      description: MEDIA_DESCRIPTION,
      enabled: {
        find: true,
      },
    },
  },
  overrideApiKeyCollection: restrictApiKeys,
  mcp: {
    serverOptions: {
      serverInfo: {
        name: "787 Rumbos catálogo",
        version: "1.0.0",
      },
    },
    prompts: [
      {
        name: "cargar-flyer",
        title: "Cargar un flyer como borrador",
        description:
          "Reglas para pasar un flyer de 787 Rumbos al catálogo. Siempre borrador. No inventar datos. No asumir Córdoba como ciudad de salida.",
        argsSchema: {
          notas: z
            .string()
            .optional()
            .describe("Texto leído del flyer, sin completar huecos."),
        },
        handler: ({ notas }) => ({
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: typeof notas === "string" && notas.trim() !== "" ? `${CARGAR_FLYER}\n\nDatos del flyer:\n${notas}` : CARGAR_FLYER,
              },
            },
          ],
        }),
      },
    ],
  },
});
