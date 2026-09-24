import type { Access, FieldAccess, PayloadRequest } from "payload";

export type Role = "admin" | "encargado" | "agente" | "asistente";

export function roleOf(user: PayloadRequest["user"] | null | undefined): Role | null {
  if (!user || typeof user !== "object" || !("role" in user)) return null;
  const role = user.role;
  if (role === "admin" || role === "encargado" || role === "agente" || role === "asistente") return role;
  return null;
}

export const isAuthenticated: Access = ({ req }) => roleOf(req.user) != null;

/** Cualquier usuario con rol entra al panel. */
export function canAccessAdmin({ req }: { req: PayloadRequest }): boolean {
  return roleOf(req.user) != null;
}

export const isAdmin: Access = ({ req }) => roleOf(req.user) === "admin";

export const isAdminOrEncargado: Access = ({ req }) => {
  const role = roleOf(req.user);
  return role === "admin" || role === "encargado";
};

/** Un admin ve el listado; el resto solo su propio usuario. */
export const readUsers: Access = ({ req }) => {
  if (roleOf(req.user) === "admin") return true;
  if (!req.user) return false;
  return { id: { equals: req.user.id } };
};

export const updateUsers: Access = ({ req }) => {
  if (roleOf(req.user) === "admin") return true;
  if (!req.user) return false;
  return { id: { equals: req.user.id } };
};

/** El rol no se cambia solo: lo edita un admin. */
export const updateRole: FieldAccess = ({ req }) => roleOf(req.user) === "admin";
