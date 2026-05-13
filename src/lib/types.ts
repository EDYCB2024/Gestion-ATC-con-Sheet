export type CasePriority = "High" | "Medium" | "Low";

export interface ATCCase {
  caso: string;
  fecha: string;
  serial: string;
  operadora: string;
  proveedorWifi: string;
  reportadoEn: string;
  rif: string;
  nombreComercio: string;
  horaDeReporte: string;
  horaDeAtencion: string;
  tiempo: string;
  personaContacto: string;
  telefonoContacto: string;
  ciudad: string;
  estado: string;
  reportadoPor: string;
  categoriaDeFalla: string;
  fallaReportadaCliente: string;
  analistaOperacionesTecnicas: string;
  estatusCaso: string;
  observaciones: string;
  observacion2: string;
  observacion3: string;
  vencimientoCaso: string;
  asignarGrupo: string;
  correo: string;
}

export interface TimelineEvent {
  id: string;
  caso: string;
  author: string;
  type: "Customer Message" | "Agent Response" | "Internal Note";
  content: string;
  timestamp: string;
}
