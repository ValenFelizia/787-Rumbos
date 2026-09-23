import type { CollectionConfig } from "payload";
import { canAccessAdmin, isAdmin, readUsers, updateRole, updateUsers } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  labels: {
    singular: "Usuario",
    plural: "Usuarios",
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
    description: "Solo un admin crea usuarios y cambia roles. Cada uno puede editar su nombre y su contraseña.",
  },
  access: {
    admin: canAccessAdmin,
    read: readUsers,
    create: isAdmin,
    update: updateUsers,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      label: "Nombre",
      type: "text",
    },
    {
      name: "role",
      label: "Rol",
      type: "select",
      required: true,
      defaultValue: "agente",
      access: {
        update: updateRole,
      },
      admin: {
        description: "Solo un admin puede cambiar el rol. Un agente no se lo cambia a sí mismo.",
      },
      options: [
        { label: "Admin", value: "admin" },
        { label: "Encargado", value: "encargado" },
        { label: "Agente", value: "agente" },
      ],
    },
  ],
};
