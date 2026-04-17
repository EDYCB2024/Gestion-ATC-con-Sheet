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
}

export interface TimelineEvent {
  id: string;
  caso: string;
  author: string;
  type: "Customer Message" | "Agent Response" | "Internal Note";
  content: string;
  timestamp: string;
}

// Mock Data for initial development if ENV is missing
const MOCK_CASES: ATCCase[] = [
  {
    caso: "88421",
    fecha: "2024-04-16",
    serial: "SN-9920",
    operadora: "Digitel",
    proveedorWifi: "NetUno",
    reportadoEn: "WhatsApp",
    rif: "J-12345678-0",
    nombreComercio: "Farmatodo - Los Palos Grandes",
    horaDeReporte: "09:42 AM",
    horaDeAtencion: "10:05 AM",
    tiempo: "23m",
    personaContacto: "Juan Perez",
    telefonoContacto: "+58 412-1234567",
    ciudad: "Caracas",
    estado: "Miranda",
    reportadoPor: "Cliente",
    categoriaDeFalla: "Critical",
    fallaReportadaCliente: "Falla de enrutamiento automatizado en Sector 7",
    analistaOperacionesTecnicas: "Alex Thompson",
    estatusCaso: "In Progress",
    observaciones: "Investigando sincronización.",
    observacion2: "",
    observacion3: "",
    vencimientoCaso: "2024-04-16 12:42 PM",
  }
];

export async function getCases(): Promise<ATCCase[]> {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    console.warn("APPS_SCRIPT_URL not found. Using mock data.");
    return MOCK_CASES;
  }

  try {
    
    const response = await fetch(`${appsScriptUrl}?type=cases`, {
      next: { 
        revalidate: false, 
        tags: ['cases-data'] 
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const rawData = await response.json();
    
    if (rawData.error) {
      console.error(`[GoogleSheets] API Error: ${rawData.error}`);
      throw new Error(rawData.error);
    }

    const rows = rawData as any[];
    const cases = rows.map(row => {
      const cleanRow: any = {};
      Object.keys(row).forEach(key => {
        const lowerKey = key.toLowerCase();
        const value = row[key];
        
        // Mapeo inteligente de columnas
        if (lowerKey.includes("caso")) cleanRow.caso = value;
        else if (lowerKey.includes("fecha")) cleanRow.fecha = value;
        else if (lowerKey.includes("serial")) cleanRow.serial = value;
        else if (lowerKey.includes("operadora")) cleanRow.operadora = value;
        else if (lowerKey.includes("rif")) cleanRow.rif = value;
        else if (lowerKey.includes("comercio")) cleanRow.nombreComercio = value;
        else if (lowerKey.includes("estatus")) cleanRow.estatusCaso = value;
        
        // Mapeo de vencimiento (prioritario si contiene 'venc')
        if (lowerKey.includes("vencimiento") || lowerKey.includes("vencimie") || lowerKey === "venc") {
          cleanRow.vencimientoCaso = value;
        } else if (lowerKey.includes("venc") && !cleanRow.vencimientoCaso) {
          cleanRow.vencimientoCaso = value;
        }
        
        if (!cleanRow[key]) cleanRow[key] = value; 
      });
      return cleanRow;
    });

    return cases as ATCCase[];
  } catch (error) {
    console.error("Error fetching cases from Apps Script:", error);
    return MOCK_CASES;
  }
}

export async function getCaseById(id: string): Promise<ATCCase | null> {
  const cases = await getCases();
  return cases.find((c) => c.caso === id || c.caso === `#${id}`) || null;
}

export async function getTimeline(caseId: string): Promise<TimelineEvent[]> {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return [
      {
        id: "1",
        caso: "88421",
        author: "Juan Perez",
        type: "Customer Message",
        content: "Significant lag in routing updates for Sector 7. Manual vectoring required.",
        timestamp: "2024-04-16T09:42:00Z",
      }
    ].filter(e => e.caso === caseId);
  }

  try {
    const response = await fetch(`${appsScriptUrl}?type=timeline&id=${encodeURIComponent(caseId)}`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    
    return data as TimelineEvent[];
  } catch (error) {
    console.error("Error fetching timeline from Apps Script:", error);
    return [];
  }
}
