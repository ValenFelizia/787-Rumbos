import type { CollectionConfig } from "payload";
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
    defaultColumns: ["name", "slug", "region", "country", "priceFrom"],
  },
  defaultSort: "sortOrder",
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
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
        date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
        description: "Vacío hasta el flujo de revisión. No cambia el sitio.",
      },
    },
    {
      name: "reviewedBy",
      label: "Revisado por",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
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
                description: "Si vence, la ficha ocultará el monto (fase siguiente). Vacío = sin efecto.",
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
                    description: "Texto YYYY-MM-DD, sin zona horaria, para que el día no se corra.",
                  },
                },
                { name: "displayDate", label: "Fecha visible", type: "text", required: true },
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
                    description: "Vigencia propia de esta salida. Vacía = usa la del destino (fase siguiente).",
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
