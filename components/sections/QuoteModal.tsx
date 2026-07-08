"use client";
import React, { useEffect, useState } from "react";
import { X, Send, ChevronRight, ChevronLeft, Calendar, Users, Plane, Info } from "lucide-react";
import { useModal } from "@/lib/context/ModalContext";
import { WHATSAPP_LINK, WHATSAPP_QUOTE_BYPASS } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

// ponytail: keep code simple and self-contained, using React state and native CSS.

const SUGGESTIONS = ["Río de Janeiro", "Bariloche", "Cartagena", "Ushuaia"];
const AIRLINES = ["Copa Airlines", "JetSmart", "GOL", "Avianca", "Air Europa", "LATAM Airlines", "Arajet"];

const getNext12Months = () => {
  const months = ["Próximos 3 meses", "Temporada Alta", "Temporada Baja"];
  const date = new Date();
  const locale = "es-AR";
  for (let i = 0; i < 12; i++) {
    const monthName = date.toLocaleDateString(locale, { month: "long" });
    const year = date.getFullYear();
    const label = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
    months.push(label);
    date.setMonth(date.getMonth() + 1);
  }
  return months;
};

export function QuoteModal() {
  const { isOpen, destination, closeModal } = useModal();
  const [step, setStep] = useState(1);

  // Form state
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [adultos, setAdultos] = useState(2);
  const [menores, setMenores] = useState(0);
  const [aerolinea, setAerolinea] = useState("Sin preferencia");

  const months = getNext12Months();

  // Reset form or pre-fill destination when modal state changes
  useEffect(() => {
    if (isOpen) {
      if (destination) {
        setDestino(destination);
        setStep(2); // Jump directly to Step 2
      } else {
        setDestino("");
        setStep(1);
      }
      // Set default date to first option if empty
      setFecha(months[0]);
      setAdultos(2);
      setMenores(0);
      setAerolinea("Sin preferencia");
    }
  }, [isOpen, destination]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }
    const passengerText = `${adultos} ${adultos === 1 ? "adulto" : "adultos"}${menores > 0 ? ` y ${menores} ${menores === 1 ? "menor" : "menores"}` : ""
      }`;
    const text = `Hola 787 Rumbos! Quiero cotizar un viaje personalizado.\n\n📍 *Destino:* ${destino}\n📅 *Fecha estimada:* ${fecha}\n👥 *Pasajeros:* ${passengerText}\n✈️ *Aerolínea:* ${aerolinea}\n\n(Web - Asistente de Cotización)`;
    const phone = "5493516157398"; // Número de atención de la agencia
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b4058]/70 p-4 backdrop-blur-sm transition-opacity duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={closeModal} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl transition-all duration-300">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b4058] to-[#006183] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-[family-name:var(--font-elaine)] text-lg font-bold">
              Armá tu viaje a medida
            </h3>
            <button
              onClick={closeModal}
              className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-[#f7a92a]" : "bg-white/20"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">

          {/* STEP 1: DESTINATION */}
          {step === 1 && (
            <div className="space-y-4">
              <label htmlFor="destino-input" className="block text-sm font-semibold text-[#0b4058]">
                ¿A dónde querés viajar?
              </label>
              <input
                id="destino-input"
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Ej: Brasil, Cancún, Bariloche..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#f7a92a] focus:outline-none focus:ring-1 focus:ring-[#f7a92a]"
                autoFocus
              />

              {/* Optional Suggestions */}
              <div className="pt-2">
                <span className="text-xs text-gray-400">Sugerencias populares:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setDestino(sug)}
                      className={`rounded-full px-3 py-1.5 text-xs transition duration-250 ${destino.toLowerCase() === sug.toLowerCase()
                        ? "bg-[#0b4058] text-white font-medium"
                        : "bg-gray-100 text-[#0b4058] hover:bg-gray-200"
                        }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & PASSENGERS */}
          {step === 2 && (
            <div className="space-y-5">

              {/* Date selection */}
              <div className="space-y-2">
                <label htmlFor="fecha-select" className="flex items-center gap-1.5 text-sm font-semibold text-[#0b4058]">
                  <Calendar className="h-4 w-4 text-[#f7a92a]" />
                  ¿Cuándo tenés pensado viajar?
                </label>
                <select
                  id="fecha-select"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-[#f7a92a] focus:outline-none focus:ring-1 focus:ring-[#f7a92a]"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Passengers selector */}
              <div className="space-y-3 pt-2">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#0b4058]">
                  <Users className="h-4 w-4 text-[#f7a92a]" />
                  ¿Cuántas personas viajan?
                </span>

                <div className="rounded-xl border border-gray-100 p-4 space-y-4">
                  {/* Adults count */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-sm font-medium text-gray-800">Adultos</span>
                      <span className="text-xs text-gray-400">Desde 12 años</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={adultos <= 1}
                        onClick={() => setAdultos((a) => a - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-semibold text-gray-800">{adultos}</span>
                      <button
                        type="button"
                        onClick={() => setAdultos((a) => a + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children count */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-sm font-medium text-gray-800">Menores</span>
                      <span className="text-xs text-gray-400">Hasta 11 años</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={menores <= 0}
                        onClick={() => setMenores((m) => m - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-semibold text-gray-800">{menores}</span>
                      <button
                        type="button"
                        onClick={() => setMenores((m) => m + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AIRLINE PREFERENCE */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#0b4058]">
                <Plane className="h-4 w-4 text-[#f7a92a]" />
                ¿Preferencia de aerolínea? (Opcional)
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAerolinea("Sin preferencia")}
                  className={`rounded-full px-3.5 py-2 text-xs transition duration-250 ${aerolinea === "Sin preferencia"
                    ? "bg-[#0b4058] text-white font-medium"
                    : "bg-gray-100 text-[#0b4058] hover:bg-gray-200"
                    }`}
                >
                  Sin preferencia/No viajo en avión
                </button>
                {AIRLINES.map((air) => (
                  <button
                    key={air}
                    type="button"
                    onClick={() => setAerolinea(air)}
                    className={`rounded-full px-3.5 py-2 text-xs transition duration-250 ${aerolinea === air
                      ? "bg-[#0b4058] text-white font-medium"
                      : "bg-gray-100 text-[#0b4058] hover:bg-gray-200"
                      }`}
                  >
                    {air}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3.5 text-xs text-gray-500">
                <Info className="h-4 w-4 shrink-0 text-[#006183]" />
                <span>Emitimos con todas las aerolíneas y buscamos siempre la mejor conexión y precio.</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-3 border-t border-gray-100 pt-5">
            {step > 1 && (
              <button
                key="back-btn"
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center gap-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Atrás
              </button>
            )}

            {step < 3 ? (
              <button
                key="next-btn"
                type="button"
                disabled={step === 1 && !destino.trim()}
                onClick={handleNext}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#0b4058] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#006183] disabled:opacity-40"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                key="submit-btn"
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f7a92a] to-[#e6b451] px-5 py-3 text-sm font-bold text-[#0b4058] shadow-md shadow-[#f7a92a]/20 transition duration-300 hover:brightness-105"
              >
                <WhatsAppIcon size={16} className="h-4 w-4" />
                Cotizar por WhatsApp
              </button>
            )}
          </div>

          {/* Bypass Direct WhatsApp Link */}
          <div className="mt-4 text-center">
            <a
              href={WHATSAPP_QUOTE_BYPASS}
              target="_blank"
              rel="noreferrer"
              onClick={closeModal}
              className="text-xs text-gray-400 underline transition hover:text-[#0b4058]"
            >
              ¿Preferís hablar directo con un asesor? Ir a WhatsApp
            </a>
          </div>

        </form>
      </div>
    </div>
  );
}
