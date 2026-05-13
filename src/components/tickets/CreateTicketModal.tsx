"use client";

import React, { useState } from "react";
import { X, Save, Building2, CreditCard, Radio, User, Phone, MapPin, AlertCircle, Landmark, Loader2, Ticket } from "lucide-react";
import { submitTicketAction } from "@/app/actions/ticket-actions";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { cn } from "@/lib/utils";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTicketId?: string;
}

export function CreateTicketModal({ isOpen, onClose, defaultTicketId }: CreateTicketModalProps) {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    caso: defaultTicketId || "",
    nombreComercio: "",
    rif: "",
    serial: "",
    operadora: "",
    personaContacto: "",
    telefonoContacto: "",
    ciudad: "",
    fallaReportadaCliente: "",
    asignarGrupo: "",
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
    
    setIsSubmitting(true);
    try {
      const result = await submitTicketAction(formData);
      if (result.success) {
        addNotification(
          "Ticket Creado",
          `Ticket #${formData.caso} asignado a ${formData.asignarGrupo || 'Sin Grupo'}`,
          "success"
        );
        onClose();
        // Reset form
        setFormData({
            caso: "",
            nombreComercio: "",
            rif: "",
            serial: "",
            operadora: "",
            personaContacto: "",
            telefonoContacto: "",
            ciudad: "",
            fallaReportadaCliente: "",
            asignarGrupo: "",
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="bg-white/90 backdrop-blur-2xl w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-outline-variant/30 animate-in fade-in zoom-in duration-500 relative z-10">
        {/* Header */}
        <div className="px-10 py-8 border-b border-outline-variant/30 flex items-center justify-between bg-primary/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Ticket className="text-primary w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-headline font-black text-on-surface tracking-tighter uppercase leading-none">Nuevo Ticket</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 mt-1.5">Registro de Caso ATC</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all active:scale-90"
          >
            <X className="w-5 h-5 opacity-40" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-0">
          <div className="max-h-[60vh] overflow-y-auto px-10 py-6 custom-scrollbar">
            <div className="space-y-6">
              {[
                { id: 'caso', label: 'Nro Caso', icon: AlertCircle, placeholder: 'Asignado automáticamente', readOnly: true },
                { id: 'nombreComercio', label: 'Nombre Comercio', icon: Building2, placeholder: 'Nombre del establecimiento' },
                { id: 'rif', label: 'RIF', icon: CreditCard, placeholder: 'J-00000000-0' },
                { id: 'serial', label: 'Serial POS', icon: Radio, placeholder: 'Serial del equipo' },
                { id: 'operadora', label: 'Operadora', icon: Radio, placeholder: 'Movistar / Digitel / Cantv' },
                { id: 'personaContacto', label: 'Persona Contacto', icon: User, placeholder: 'Nombre del contacto' },
                { id: 'telefonoContacto', label: 'Teléfono', icon: Phone, placeholder: '04XX-0000000' },
                { id: 'ciudad', label: 'Ciudad', icon: MapPin, placeholder: 'Ej: Caracas' },
                { 
                  id: 'asignarGrupo', 
                  label: 'Asignar Grupo', 
                  icon: User,
                  isSelect: true, 
                  options: [
                    'Operaciones y ST',
                    'Megapos',
                    'Token Pagos',
                    'Pos Comercial',
                    'Instapago',
                    'Tu punto Plus',
                    'Servinet',
                    'Punto Pos',
                    'Puntpago'
                  ]
                },
                { id: 'fallaReportadaCliente', label: 'Falla Reportada', icon: AlertCircle, placeholder: 'Descripción de la falla...', isTextArea: true },
              ].map((field) => (
                <div key={field.id} className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 px-1 group-focus-within:text-primary transition-colors">
                    <field.icon className="w-3.5 h-3.5" />
                    {field.label}
                  </label>
                  
                  {field.isTextArea ? (
                    <textarea
                      name={field.id}
                      value={(formData as any)[field.id]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl px-5 py-4 text-[13px] font-bold text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all shadow-inner"
                    />
                  ) : field.isSelect ? (
                    <select
                      name={field.id}
                      value={(formData as any)[field.id]}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl px-5 py-4 text-[13px] font-bold text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all shadow-inner cursor-pointer appearance-none"
                    >
                      <option value="">Seleccionar...</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field.id}
                      value={(formData as any)[field.id]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      readOnly={field.readOnly}
                      className={cn(
                        "w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl px-5 py-4 text-[13px] font-bold text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all shadow-inner",
                        field.readOnly && "opacity-50 cursor-not-allowed bg-surface-container-highest/20"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 bg-primary/[0.02] border-t border-outline-variant/30 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border border-outline-variant/50 text-on-surface-variant/60 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-surface-container-low transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex-[2] flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] hover:opacity-90",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSubmitting ? 'Guardando...' : 'Crear Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
