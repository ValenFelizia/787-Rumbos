import type { CollectionConfig } from "payload";
import { isAdmin, isAuthenticated } from "../access";
import { enforceEditorialRules } from "../hooks/editorial";
import {
  revalidateCatalogAfterChange,
  revalidateCatalogAfterDelete,
} from "../hooks/revalidateCatalog";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const currencyOptions = [
  { label: "ARS", value: "ARS" },
  { label: "USD", value: "USD" },
];

const answerBlocks = [
  {
    slug: "text",
    labels: { singular: "Texto", plural: "Textos" },
    fields: [
      {
        name: "value",
        label: "Texto",
        type: "textarea" as const,
        required: true,
      },
    ],
  },
  {
    slug: "link",
    labels: { singular: "Enlace", plural: "Enlaces" },
    fields: [
      { name: "label", label: "Etiqueta", type: "text" as const, required: true },
      { name: "href", label: "URL", type: "text" as const, required: true },
      { name: "external", label: "Externo", type: "checkbox" as const },
    ],
  },
  {
    slug: "whatsapp",
    labels: { singular: "WhatsApp", plural: "WhatsApp" },
    fields: [
      {
        name: "label",
        label: "Etiqueta",
        type: "text" as const,
        required: true,
        admin: {
          description: "La URL se arma al publicar con el nombre del destino y el teléfono de la agencia.",
        },
      },
    ],
  },
];

export const Destinations: CollectionConfig = {
  slug: "destinations",
  labels: {
    singular: "Destino",
    plural: "Destinos",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "region", "pendingApproval", "priceFrom"],
    description:
      "Borrador: no se ve en el sitio. Publicado: se ve en la web. Un agente publica directo solo salidas, precios y vigencia; el resto queda en borrador para un encargado.",
  },
  defaultSort: "sortOrder",
  versions: {
    drafts: {
      autosave: false,
    },
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [enforceEditorialRules],
    afterChange: [revalidateCatalogAfterChange],
    afterDelete: [revalidateCatalogAfterDelete],
  },
  fields: [
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar" },
    },
    {
      name: "sortOrder",
      label: "Orden en el catálogo",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Empates de la home y el orden de /destinos. No reordenar sin motivo.",
      },
    },
    {
      name: "lastReviewedAt",
      label: "Última revisión",
      type: "date",
      admin: {
        position: "sidebar",
        readOnly: true,
        date: { pickerAppearance: "dayAndTime", displayFormat: "yyyy-MM-dd HH:mm" },
        description: "Se completa sola cada vez que alguien guarda. No se edita a mano.",
      },
    },
    {
      name: "reviewedBy",
      label: "Revisado por",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Quien guardó la ficha por última vez. Tampoco se edita a mano.",
      },
    },
    {
      name: "pendingApproval",
      label: "Pendiente de aprobación",
      type: "checkbox",
      defaultValue: false,
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description:
          "Se marca sola cuando un agente guarda un borrador. Un encargado o un admin la baja al publicar.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "General",
          fields: [
            { name: "name", label: "Nombre", type: "text", required: true },
            { name: "country", label: "País", type: "text", required: true },
            {
              name: "region",
              label: "Región",
              type: "select",
              required: true,
              options: [
                { label: "Nacional", value: "nacional" },
                { label: "Internacional", value: "internacional" },
              ],
            },
            {
              name: "heroImage",
              label: "Imagen principal",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            {
              name: "flyerImage",
              label: "Folleto",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "description",
              label: "Descripción",
              type: "textarea",
              required: true,
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            { name: "metaTitle", label: "Title", type: "text", required: true },
            {
              name: "metaDescription",
              label: "Meta description",
              type: "textarea",
              required: true,
            },
            {
              name: "h1",
              label: "H1",
              type: "text",
              admin: { description: "Si queda vacío, la ficha usa “Paquetes a {nombre}”." },
            },
          ],
        },
        {
          label: "Precio y salidas",
          fields: [
            { name: "priceFrom", label: "Precio desde", type: "number" },
            {
              name: "currency",
              label: "Moneda",
              type: "select",
              required: true,
              defaultValue: "ARS",
              options: currencyOptions,
            },
            { name: "priceNote", label: "Nota de precio", type: "text" },
            {
              name: "priceValidUntil",
              label: "Precio vigente hasta",
              type: "date",
              admin: {
                date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
                description:
                  "Obligatorio al publicar si hay un precio. El día indicado sigue vigente. Si se pasa, el sitio no muestra el monto y dice «Consultá precio actualizado».",
              },
            },
            {
              name: "departures",
              label: "Salidas",
              labels: { singular: "Salida", plural: "Salidas" },
              type: "array",
              fields: [
                {
                  name: "date",
                  label: "Fecha",
                  type: "text",
                  required: true,
                  validate: (value: unknown) => {
                    if (typeof value !== "string" || !ISO_DATE.test(value)) {
                      return "Usá el formato YYYY-MM-DD";
                    }
                    return true;
                  },
                  admin: {
                    description:
                      "Fecha real en AAAA-MM-DD, por ejemplo 2026-07-08. Una salida nueva o que modifiques no puede ser de un día que ya pasó.",
                  },
                },
                {
                  name: "displayDate",
                  label: "Fecha visible",
                  type: "text",
                  required: true,
                  admin: {
                    description: "Cómo la lee el pasajero, por ejemplo «8 de Julio».",
                  },
                },
                { name: "priceFrom", label: "Precio desde", type: "number" },
                {
                  name: "currency",
                  label: "Moneda",
                  type: "select",
                  options: currencyOptions,
                },
                {
                  name: "status",
                  label: "Estado",
                  type: "select",
                  required: true,
                  admin: {
                    description:
                      "Confirmada: hay lugar. Últimos lugares: queda poco. Agotada: no se ofrece. Consultar: hay que chequear el cupo.",
                  },
                  options: [
                    { label: "Confirmada", value: "confirmed" },
                    { label: "Últimos lugares", value: "few-seats" },
                    { label: "Agotada", value: "sold-out" },
                    { label: "Consultar", value: "inquire" },
                  ],
                },
                {
                  name: "transport",
                  label: "Transporte",
                  type: "select",
                  required: true,
                  options: [
                    { label: "Aéreo", value: "aereo" },
                    { label: "Bus", value: "bus" },
                    { label: "Bus coche cama", value: "bus-cama" },
                    { label: "Aéreo / Bus", value: "mix" },
                  ],
                },
                { name: "nights", label: "Noches", type: "number", required: true },
                { name: "note", label: "Nota", type: "textarea" },
                { name: "program", label: "Programa", type: "text" },
                { name: "stayLabel", label: "Etiqueta de estadía", type: "text" },
                {
                  name: "priceIsFinal",
                  label: "Precio cerrado",
                  type: "checkbox",
                  admin: { description: "El monto es final, no una tarifa “desde”." },
                },
                {
                  name: "priceValidUntil",
                  label: "Precio vigente hasta",
                  type: "date",
                  admin: {
                    date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
                    description:
                      "Vigencia propia de esta salida. Si la dejás vacía, usa la del destino. Si vence, esta salida no muestra el monto.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Contenido",
          fields: [
            {
              name: "highlights",
              label: "Destacados",
              labels: { singular: "Destacado", plural: "Destacados" },
              type: "array",
              fields: [{ name: "text", label: "Texto", type: "text", required: true }],
            },
            {
              name: "typicalInclusions",
              label: "Incluye",
              labels: { singular: "Ítem", plural: "Ítems" },
              type: "array",
              fields: [{ name: "text", label: "Texto", type: "text", required: true }],
            },
            {
              name: "optionalExcursions",
              label: "Excursiones opcionales",
              labels: { singular: "Excursión", plural: "Excursiones" },
              type: "array",
              fields: [{ name: "text", label: "Texto", type: "text", required: true }],
            },
            { name: "travelTip", label: "Tip de viaje", type: "textarea" },
          ],
        },
        {
          label: "FAQ",
          fields: [
            {
              name: "faq",
              label: "Preguntas",
              labels: { singular: "Pregunta", plural: "Preguntas" },
              type: "array",
              fields: [
                {
                  name: "faqId",
                  label: "Id",
                  type: "text",
                  required: true,
                  admin: { description: "Id estable, p. ej. iguazu-incluye." },
                },
                { name: "question", label: "Pregunta", type: "text", required: true },
                {
                  name: "answer",
                  label: "Respuesta",
                  type: "blocks",
                  blocks: answerBlocks,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
