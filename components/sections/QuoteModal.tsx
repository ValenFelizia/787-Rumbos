"use client";
import React, { useEffect, useMemo, useState } from "react";
import { X, ChevronRight, ChevronLeft, Calendar, Users, Plane, Info, Clock } from "lucide-react";
import { useModal } from "@/lib/context/ModalContext";
import { DIALOG_CLOSEDBY_ANY, setAutofocus, useModalDialog } from "@/lib/use-modal-dialog";
import { whatsappLink, AGENCY_PHONE } from "@/lib/constants";
import { waHref } from "@/lib/wa-recipe";
import { buildQuoteWhatsAppMessage } from "@/lib/quote-message";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CTA_MODAL_SUBMIT_LABEL, CTA_SECONDARY_LABEL } from "@/components/conversion";

// ponytail: keep code simple and self-contained, using React state and native CSS.

const DURATION_OPTIONS = [
  "A definir",
  "3-4 días",
  "5-7 días",
  "8-10 días",
  "11-14 días",
  "Más de 14 días",
];

const AIRLINES = ["Copa Airlines", "JetSmart", "GOL", "Avianca", "Air Europa", "LATAM Airlines", "Arajet"];

const AIRLINE_OPTIONS = [
  { value: "Sin preferencia", label: "Sin preferencia/No viajo en avión" },
  ...AIRLINES.map((airline) => ({ value: airline, label: airline })),
];

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
  const { isOpen, destination, suggestionDestinations, closeModal } = useModal();
  const [step, setStep] = useState(1);
  const dialogRef = useModalDialog(isOpen, closeModal);
  // Close the dialog itself so the browser returns focus before React unmounts the form.
  const closeDialog = () => dialogRef.current?.close();

  // Form state
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [duracion, setDuracion] = useState(DURATION_OPTIONS[0]);
  const [adultos, setAdultos] = useState(2);
  const [menores, setMenores] = useState(0);
  const [aerolinea, setAerolinea] = useState("Sin preferencia");

  const months = useMemo(getNext12Months, []);

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
      setDuracion(DURATION_OPTIONS[0]);
      setAdultos(2);
      setMenores(0);
      setAerolinea("Sin preferencia");
    }
  }, [isOpen, destination, months]);

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
    const text = buildQuoteWhatsAppMessage({
      destino,
      fecha,
      duracion,
      adultos,
      menores,
      aerolinea,
    });
    window.open(whatsappLink(AGENCY_PHONE.whatsapp, text), "_blank");
    closeDialog();
  };

  return (
    <dialog
      ref={dialogRef}
      {...DIALOG_CLOSEDBY_ANY}
      aria-labelledby="quote-modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-white/10 bg-white p-0 text-[#0b4058] shadow-2xl backdrop:bg-[#0b4058]/70 backdrop:backdrop-blur-sm"
    >
      {isOpen && (
        <>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b4058] to-[#006183] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h1
              id="quote-modal-title"
              className="font-[family-name:var(--font-elaine)] text-lg font-bold"
            >
              Armá tu viaje a medida
            </h1>
            <button
              ref={setAutofocus}
              type="button"
              onClick={closeDialog}
              className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar modal"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div
            role="progressbar"
            aria-label="Progreso de la cotización"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={step}
            aria-valuetext={`Paso ${step} de 3`}
            className="mt-4 flex gap-2"
          >
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-[#f7a92a]" : "bg-white/20"
                  }`}
              />
            ))}
          </div>
          <p aria-live="polite" className="sr-only">Paso {step} de 3</p>
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
                name="destino"
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Ej: Brasil, Cancún, Bariloche…"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#f7a92a] focus:outline-none focus:ring-1 focus:ring-[#f7a92a]"
              />

              {/* Optional Suggestions — nombres desde Payload (SSR → ModalContext) */}
              {suggestionDestinations.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs text-gray-400">Destinos populares:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestionDestinations.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        aria-pressed={destino.toLowerCase() === sug.toLowerCase()}
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
              )}
            </div>
          )}

          {/* STEP 2: DATE & PASSENGERS */}
          {step === 2 && (
            <div className="space-y-5">

              {/* Date selection */}
              <div className="space-y-2">
                <label htmlFor="fecha-select" className="flex items-center gap-1.5 text-sm font-semibold text-[#0b4058]">
                  <Calendar aria-hidden="true" className="h-4 w-4 text-[#f7a92a]" />
                  ¿Cuándo tenés pensado viajar?
                </label>
                <select
                  id="fecha-select"
                  name="fecha"
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

              {/* Estimated duration */}
              <div className="space-y-2">
                <label htmlFor="duracion-select" className="flex items-center gap-1.5 text-sm font-semibold text-[#0b4058]">
                  <Clock aria-hidden="true" className="h-4 w-4 text-[#f7a92a]" />
                  ¿Cuántos días aproximados?
                </label>
                <select
                  id="duracion-select"
                  name="duracion"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-[#f7a92a] focus:outline-none focus:ring-1 focus:ring-[#f7a92a]"
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Passengers selector */}
              <div className="space-y-3 pt-2">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#0b4058]">
                  <Users aria-hidden="true" className="h-4 w-4 text-[#f7a92a]" />
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
                        aria-label="Quitar un adulto"
                        aria-controls="adultos-count"
                        disabled={adultos <= 1}
                        onClick={() => setAdultos((a) => a - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
                      >
                        <span aria-hidden="true">−</span>
                      </button>
                      <span id="adultos-count" aria-live="polite" aria-atomic="true" className="w-4 text-center text-sm font-semibold text-gray-800">{adultos}</span>
                      <button
                        type="button"
                        aria-label="Agregar un adulto"
                        aria-controls="adultos-count"
                        onClick={() => setAdultos((a) => a + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                      >
                        <span aria-hidden="true">+</span>
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
                        aria-label="Quitar un menor"
                        aria-controls="menores-count"
                        disabled={menores <= 0}
                        onClick={() => setMenores((m) => m - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
                      >
                        <span aria-hidden="true">−</span>
                      </button>
                      <span id="menores-count" aria-live="polite" aria-atomic="true" className="w-4 text-center text-sm font-semibold text-gray-800">{menores}</span>
                      <button
                        type="button"
                        aria-label="Agregar un menor"
                        aria-controls="menores-count"
                        onClick={() => setMenores((m) => m + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                      >
                        <span aria-hidden="true">+</span>
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
              <fieldset role="radiogroup">
                <legend className="mb-4 text-sm font-semibold text-[#0b4058]">
                  <span className="flex items-center gap-1.5">
                    <Plane aria-hidden="true" className="h-4 w-4 text-[#f7a92a]" />
                    ¿Preferencia de aerolínea? (Opcional)
                  </span>
                </legend>

                <div className="flex flex-wrap gap-2">
                  {AIRLINE_OPTIONS.map((option, index) => {
                    const inputId = `aerolinea-${index}`;
                    return (
                      <label
                        key={option.value}
                        htmlFor={inputId}
                        className="cursor-pointer rounded-full bg-gray-100 px-3.5 py-2 text-xs text-[#0b4058] transition duration-250 hover:bg-gray-200 has-[:checked]:bg-[#0b4058] has-[:checked]:font-medium has-[:checked]:text-white has-[:checked]:hover:bg-[#0b4058] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#f7a92a] has-[:focus-visible]:outline-offset-[3px]"
                      >
                        <input
                          id={inputId}
                          type="radio"
                          name="aerolinea"
                          value={option.value}
                          checked={aerolinea === option.value}
                          onChange={() => setAerolinea(option.value)}
                          className="sr-only"
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3.5 text-xs text-gray-500">
                <Info aria-hidden="true" className="h-4 w-4 shrink-0 text-[#006183]" />
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
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
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
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </button>
            ) : (
              <button
                key="submit-btn"
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f7a92a] to-[#e6b451] px-5 py-3 text-sm font-bold text-[#0b4058] shadow-md shadow-[#f7a92a]/20 transition duration-300 hover:brightness-105"
              >
                <WhatsAppIcon size={16} className="h-4 w-4" />
                {CTA_MODAL_SUBMIT_LABEL}
              </button>
            )}
          </div>

          {/* Bypass Direct WhatsApp Link */}
          <div className="mt-4 text-center">
            <a
              href={waHref({ id: "quote-bypass" })}
              target="_blank"
              rel="noreferrer"
              onClick={closeDialog}
              className="text-xs text-gray-400 underline transition hover:text-[#0b4058]"
            >
              ¿Preferís hablar directo con un asesor? {CTA_SECONDARY_LABEL}
            </a>
          </div>

        </form>
        </>
      )}
    </dialog>
  );
}
