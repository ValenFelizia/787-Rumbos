import type { GlobalConfig } from "payload";
import { isAdminOrEncargado, isAuthenticated } from "../access";
import { enforcePromoRules } from "../hooks/promo";
import { revalidatePromoAfterChange } from "../hooks/revalidateCatalog";
import { isRealISODate } from "../hooks/editorial";

const iconOptions = [
  { label: "Avión", value: "plane" },
  { label: "Calendario", value: "calendar" },
  { label: "Entrada", value: "ticket" },
  { label: "Ubicación", value: "map-pin" },
];

export const FeaturedPromo: GlobalConfig = {
  slug: "featuredPromo",
  label: "Promo destacada",
  admin: {
    description:
      "La barra de la home. La publican un encargado o un admin. Si el precio vence, la barra sigue hasta la fecha de fin y el monto pasa a «Consultá precio actualizado».",
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
    update: isAdminOrEncargado,
    readVersions: isAuthenticated,
  },
  hooks: {
    beforeChange: [enforcePromoRules],
    afterChange: [revalidatePromoAfterChange],
  },
  fields: [
    {
      name: "enabled",
      label: "Visible en la home",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Si la desmarcás, la barra no se muestra aunque la promo esté publicada.",
      },
    },
    {
      name: "destination",
      label: "Destino",
      type: "relationship",
      relationTo: "destinations",
      required: true,
      admin: {
        description: "El enlace de la promo va a la ficha de este destino.",
      },
    },
    {
      name: "endsAt",
      label: "Se oculta después del",
      type: "text",
      required: true,
      validate: (value: unknown) => {
        if (value == null || value === "") return true;
        if (typeof value !== "string" || !isRealISODate(value)) {
          return "Usá el formato YYYY-MM-DD";
        }
        return true;
      },
      admin: {
        description:
          "AAAA-MM-DD. El día indicado la barra sigue visible. Al día siguiente desaparece.",
      },
    },
    {
      name: "topBarText",
      label: "Texto de la barra",
      type: "text",
      required: true,
    },
    {
      name: "badgeText",
      label: "Etiqueta",
      type: "text",
      required: true,
    },
    {
      name: "charterText",
      label: "Etiqueta secundaria",
      type: "text",
      required: true,
    },
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descripción",
      type: "textarea",
      required: true,
    },
    {
      name: "price",
      label: "Precio",
      type: "text",
      admin: {
        description:
          "Texto tal como se publica, por ejemplo USD 2.770. Si lo cargás, al publicar hace falta «Precio vigente hasta».",
      },
    },
    {
      name: "priceNote",
      label: "Nota de precio",
      type: "text",
    },
    {
      name: "taxNote",
      label: "Nota de impuestos",
      type: "text",
    },
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
      name: "image",
      label: "Imagen",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "whatsappMsg",
      label: "Mensaje de WhatsApp",
      type: "textarea",
      required: true,
      admin: {
        description: "Texto que se abre en el chat. El teléfono de la agencia se agrega solo.",
      },
    },
    {
      name: "inclusions",
      label: "Incluye",
      labels: { singular: "Ítem", plural: "Ítems" },
      type: "array",
      fields: [
        { name: "label", label: "Texto", type: "text", required: true },
        {
          name: "icon",
          label: "Ícono",
          type: "select",
          required: true,
          options: iconOptions,
        },
      ],
    },
  ],
};
