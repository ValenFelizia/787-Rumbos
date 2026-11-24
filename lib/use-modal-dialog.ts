"use client";

import { useEffect, useRef } from "react";

export const DIALOG_CLOSEDBY_ANY = {
  closedby: "any",
} as Record<string, unknown>;

/**
 * React renders `autoFocus` as a `.focus()` call on mount, which fails while the
 * dialog is closed. `showModal()` only honors the `autofocus` attribute.
 */
export function setAutofocus(el: HTMLElement | null) {
  if (el) el.autofocus = true;
}

/**
 * Syncs a native `<dialog>` with React `open` state via `showModal()` / `close()`,
 * forwards native `close` events to the latest `onClose`, and adds light-dismiss
 * fallback when `closedBy` is unsupported.
 */
export function useModalDialog(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Keyed on `open` so a dialog that mounts after the first render still gets its listeners.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // `close` fires asynchronously, so ignore it if the dialog was reopened meanwhile.
    const handleClose = () => {
      if (!dialog.open) onCloseRef.current();
    };
    dialog.addEventListener("close", handleClose);

    if ("closedBy" in HTMLDialogElement.prototype) {
      return () => {
        dialog.removeEventListener("close", handleClose);
      };
    }

    // Backdrop clicks target the dialog itself; test the pointer position against its box.
    const isOutside = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
    };

    let pressedOutside = false;
    const handlePointerDown = (e: PointerEvent) => {
      pressedOutside = e.button === 0 && e.target === dialog && isOutside(e);
    };
    const handlePointerCancel = () => {
      pressedOutside = false;
    };
    // Close on `click`, not `pointerup`: closing earlier un-inerts the page before
    // iOS Safari's synthetic click, which would land on whatever sits underneath.
    const handleClick = (e: MouseEvent) => {
      if (pressedOutside && e.target === dialog && isOutside(e)) dialog.close();
      pressedOutside = false;
    };

    dialog.addEventListener("pointerdown", handlePointerDown);
    dialog.addEventListener("pointercancel", handlePointerCancel);
    dialog.addEventListener("click", handleClick);

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("pointerdown", handlePointerDown);
      dialog.removeEventListener("pointercancel", handlePointerCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [open]);

  return dialogRef;
}
