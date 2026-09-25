"use client";
import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isOpen: boolean;
  destination: string;
  /** Nombres de destinos CMS para chips del cotizador (SSR → client). */
  suggestionDestinations: string[];
  openModal: (dest?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({
  children,
  suggestionDestinations = [],
}: {
  children: React.ReactNode;
  suggestionDestinations?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [destination, setDestination] = useState("");

  const openModal = (dest = "") => {
    setDestination(dest);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDestination("");
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, destination, suggestionDestinations, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
