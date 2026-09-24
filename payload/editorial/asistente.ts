export const ASISTENTE_DRAFT_ONLY_MESSAGE =
  "Los asistentes de IA solo guardan borradores. Un encargado revisa y publica.";

export type AsistenteSaveInput = {
  role: string | null;
  /** `_status` que manda el cliente, antes de que Payload lo reescriba. */
  status: unknown;
  /**
   * Flag `draft` del local API. Payload decide si escribe la fila publicada
   * con este flag, antes de los hooks de beforeChange.
   */
  draft: unknown;
};

export type AsistenteSaveDecision =
  | { allowed: true; pendingApproval: true }
  | { allowed: false; message: string };

/**
 * `null` si el rol no es asistente: el flujo de agente/encargado no cambia.
 * Un asistente solo pasa con `draft === true` y sin `_status: "published"`.
 */
export function decideAsistenteSave(input: AsistenteSaveInput): AsistenteSaveDecision | null {
  if (input.role !== "asistente") return null;
  if (input.status === "published" || input.draft !== true) {
    return { allowed: false, message: ASISTENTE_DRAFT_ONLY_MESSAGE };
  }
  return { allowed: true, pendingApproval: true };
}
