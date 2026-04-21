"use server";

import { revalidateTag } from "next/cache";
import { createCase, ATCCase } from "@/lib/google-sheets";

export async function submitTicketAction(formData: any) {
  try {
    // Generate timestamp
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });

    // Map form data to ATCCase structure
    const caseData: Partial<ATCCase> = {
      caso: formData.caso,
      nombreComercio: formData.nombreComercio,
      rif: formData.rif,
      serial: formData.serialPunto,
      proveedorWifi: formData.banco || "", // Mapped to provider field as discussed
      operadora: formData.operadora || "",
      personaContacto: formData.personaContacto || "",
      telefonoContacto: formData.telefonoContacto,
      ciudad: formData.zonaCiudad || "",
      fallaReportadaCliente: formData.fallaReportada,
      fecha: dateStr,
      horaDeReporte: timeStr,
      estatusCaso: "Abierto",
      reportadoEn: "WhatsApp",
      reportadoPor: "Portal ATC",
    };

    // Check if the ticket already exists to prevent duplicates
    const { getCaseById } = await import("@/lib/google-sheets");
    const existingCase = await getCaseById(formData.caso);
    
    if (existingCase) {
      return { 
        success: false, 
        error: `El número de ticket #${formData.caso} ya existe. Por favor use un número diferente.` 
      };
    }

    const result = await createCase(caseData);
    
    if (result.success) {
      revalidateTag('cases-data');
      return { success: true };
    } else {
      return { success: false, error: result.error || "Error desconocido al guardar en Google Sheets" };
    }
  } catch (error: any) {
    console.error("[Action] Error submitting ticket:", error);
    return { success: false, error: error.message || "Error interno del servidor" };
  }
}
