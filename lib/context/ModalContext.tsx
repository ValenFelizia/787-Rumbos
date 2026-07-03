"use client";
import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isOpen: boolean;
  destination: string;
  openModal: (dest?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
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
    <ModalContext.Provider value={{ isOpen, destination, openModal, closeModal }}>
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
