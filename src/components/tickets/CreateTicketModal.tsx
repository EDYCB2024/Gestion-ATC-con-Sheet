"use client";

import React, { useState } from "react";
import { X, Save, Building2, CreditCard, Radio, User, Phone, MapPin, AlertCircle, Landmark, Loader2 } from "lucide-react";
import { submitTicketAction } from "@/app/actions/ticket-actions";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTicketId?: string;
}

export function CreateTicketModal({ isOpen, onClose, defaultTicketId }: CreateTicketModalProps) {
  const [formData, setFormData] = useState({
    caso: defaultTicketId || "",
    nombreComercio: "",
    rif: "",
    serialPunto: "",
    banco: "",
    operadora: "",
    personaContacto: "",
    telefonoContacto: "",
    zonaCiudad: "",
    fallaReportada: "",
  });

  // Update caso when defaultTicketId changes and modal opens
  React.useEffect(() => {
    if (isOpen && defaultTicketId) {
      setFormData(prev => ({ ...prev, caso: defaultTicketId }));
    }
  }, [isOpen, defaultTicketId]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.caso) newErrors.caso = "Requerido";
    if (!formData.nombreComercio) newErrors.nombreComercio = "Requerido";
    if (!formData.rif) newErrors.rif = "Requerido";
    if (!formData.serialPunto) newErrors.serialPunto = "Requerido";
    if (!formData.telefonoContacto) newErrors.telefonoContacto = "Requerido";
    if (!formData.fallaReportada) newErrors.fallaReportada = "Requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitTicketAction(formData);
      if (result.success) {
        alert("Ticket guardado exitosamente en Google Sheets");
        onClose();
        // Reset form
        setFormData({
            caso: "",
            nombreComercio: "",
            rif: "",
            serialPunto: "",
            banco: "",
            operadora: "",
            personaContacto: "",
            telefonoContacto: "",
            zonaCiudad: "",
            fallaReportada: "",
        });
      } else {
        alert(`Error al guardar: ${result.error}`);
      }
    } catch (error: any) {
      alert("Error inesperado al procesar el ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-surface-variant/30 animate-in fade-in zoom-in duration-300 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-variant/20 flex items-center justify-between bg-primary/5">
          <div>
            <h2 className="text-lg font-headline font-black text-on-surface tracking-tight">Crear Nuevo Ticket</h2>
            <p className="text-[11px] text-on-surface-variant opacity-70">Siga el formato de reporte para el servicio técnico.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-variant/40 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Form in Table Style */}
        <form onSubmit={handleSubmit} className="p-0">
          <div className="w-full">
            {/* Table Header */}
            <div className="flex bg-primary/5 border-b border-surface-variant/20 px-6 py-2">
              <div className="flex-1 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">Campo</div>
              <div className="flex-1 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60 pl-4">Valor</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-surface-variant/10">
              {[
                { id: 'caso', label: '#Ticket', required: true, placeholder: 'Ej: 12345' },
                { id: 'nombreComercio', label: 'NOMBRE COMERCIO', required: true, placeholder: 'Ej: Comercio S.A' },
                { id: 'rif', label: 'RIF', required: true, placeholder: 'J-00000000-0' },
                { id: 'serialPunto', label: 'SERIAL DEL PUNTO', required: true, placeholder: '12345678' },
                { id: 'banco', label: 'BANCO', required: false, placeholder: 'Ej: Banesco' },
                { id: 'operadora', label: 'OPERADORA', required: false, placeholder: 'Movistar / Digitel' },
                { id: 'personaContacto', label: 'PERSONA CONTACTO', required: false, placeholder: 'Nombre del encargado' },
                { id: 'telefonoContacto', label: 'TELÉFONO CONTACTO', required: true, placeholder: '0412-0000000' },
                { id: 'zonaCiudad', label: 'ZONA/CIUDAD', required: false, placeholder: 'Ej: Caracas' },
                { id: 'fallaReportada', label: 'FALLA REPORTADA', required: true, placeholder: 'Describa el problema', isTextArea: true },
              ].map((field, index) => (
                <div 
                  key={field.id} 
                  className={`flex items-center px-6 py-2 transition-colors hover:bg-primary/5 ${index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'}`}
                >
                  <div className="flex-1 text-[12px] font-headline font-bold text-on-surface flex items-center gap-2 uppercase tracking-tight">
                    {field.label}
                    {field.required && <span className="text-error font-black">*</span>}
                  </div>
                  <div className="flex-1 pl-4">
                    {field.isTextArea ? (
                      <textarea
                        name={field.id}
                        value={(formData as any)[field.id]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        rows={1}
                        className={`w-full bg-transparent border-none focus:ring-0 text-[12px] font-body text-on-surface-variant placeholder:opacity-30 resize-none py-1 focus:outline-none ${errors[field.id] ? 'text-error' : ''}`}
                      />
                    ) : (
                      <input
                        type="text"
                        name={field.id}
                        value={(formData as any)[field.id]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={`w-full bg-transparent border-none focus:ring-0 text-[12px] font-body text-on-surface-variant placeholder:opacity-30 focus:outline-none py-1 ${errors[field.id] ? 'text-error placeholder:text-error/30 font-bold' : ''}`}
                      />
                    )}
                    {errors[field.id] && <p className="text-[8px] text-error font-black uppercase tracking-tighter">Requerido</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-surface-container-low/20 border-t border-surface-variant/10 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-surface-variant/50 text-on-surface-variant font-headline font-black text-[10px] uppercase tracking-[0.2em] hover:bg-surface-container-low transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-[2] flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-headline font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-transform active:scale-[0.98] hover:opacity-95 hover:shadow-primary/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSubmitting ? 'Guardando...' : 'Guardar Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
