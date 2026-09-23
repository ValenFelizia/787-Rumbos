import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  labels: {
    singular: "Usuario",
    plural: "Usuarios",
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "role",
      label: "Rol",
      type: "select",
      required: true,
      defaultValue: "agente",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Encargado", value: "encargado" },
        { label: "Agente", value: "agente" },
      ],
    },
  ],
};
