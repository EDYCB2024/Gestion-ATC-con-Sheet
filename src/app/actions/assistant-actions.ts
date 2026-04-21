"use server";

import { ASSISTANT_KNOWLEDGE } from "@/lib/assistant-knowledge";

export async function processAssistantMessage(message: string) {
  // Simulación de procesamiento de lenguaje natural
  // En una versión producción, aquí se llamaría a OpenAI o Gemini.
  // Por ahora, realizamos una búsqueda inteligente por palabras clave en el manual.

  const query = message.toLowerCase();
  
  // Definimos la estructura de retorno
  interface AssistantResponse {
    content: string;
    suggestions: string[];
  }

  // Modelos base
  const BASE_MODELS = ["N910", "N950", "ME60", "SP600", "ME51", "ERROR TAMPER"];

  // Lógica de guía interactiva con botones de continuación
  if (query === "n910" || query === "n950") {
    return {
      content: `Has seleccionado el modelo **${query.toUpperCase()}**. ¿Qué procedimiento deseas realizar?`,
      suggestions: ["TMS", "LIMPIAR ADVICE", "VOLVER AL INICIO"]
    };
  }

  if (query === "me60") {
    return {
      content: "Has seleccionado el **ME60**. Este equipo es multifuncional. ¿En qué te apoyo?",
      suggestions: ["WIFI", "RED (3G/GPRS)", "VER LLAVES", "INICIALIZAR", "VOLVER AL INICIO"]
    };
  }

  if (query === "sp600" || query === "me51") {
    return {
      content: `Para el **${query.toUpperCase()}**, el procedimiento estándar es la verificación de llaves.`,
      suggestions: ["VER LLAVES", "VOLVER AL INICIO"]
    };
  }

  if (query.includes("wifi") || query.includes("wi-fi")) {
    if (query.includes("me60")) {
      return {
        content: `**CONFIGURACIÓN WIFI ME60**:\n1. Menú Técnico (*) -> 2: Comunicaciones -> 5: WIFI.\n2. SSL = 0.NO.\n3. Buscar Red y poner clave.\n4. DHCP = 1.SI.\n5. IPs: 201.222.13.4 / 201.222.14.22 (Puerto 4541).`,
        suggestions: ["OTRO MODELO", "VOLVER AL INICIO"]
      };
    }
    return {
      content: "¿En qué modelo deseas configurar el WIFI?",
      suggestions: ["ME60", "VOLVER AL INICIO"]
    };
  }

  if (query.includes("red") || query.includes("3g") || query.includes("gprs")) {
    if (query.includes("me60")) {
      return {
        content: "Para el **ME60**, indica la operadora en uso para darte los pasos exactos.",
        suggestions: ["DIGITEL", "MOVISTAR", "VOLVER AL INICIO"]
      };
    }
  }

  if (query.includes("movistar") && query.includes("me60")) {
    return {
      content: "**ME60 MOVISTAR**:\n1. Menú (X) -> 7: Comunicaciones -> 4: Tipo de red.\n2. SIM 2 (3G) o Modo sim 2 (GPRS).",
      suggestions: ["VER APN", "VOLVER AL INICIO"]
    };
  }

  if (query.includes("digitel") && query.includes("me60")) {
    return {
      content: "**ME60 DIGITEL**:\n1. Menú (X) -> 7: Comunicaciones -> 4: Tipo de red.\n2. SIM 1 (3G) o Modo sim 1 (GPRS).",
      suggestions: ["VER APN", "VOLVER AL INICIO"]
    };
  }

  if (query.includes("tms")) {
    return {
      content: "**TMS N910/N950**:\n1. Funciones -> Configuración sistema.\n2. Clave: 123456 (CC) o 211117 (Platco).\n3. Ejecutar 'Descargar parámetros TMS'.",
      suggestions: ["VOLVER AL INICIO"]
    };
  }

  if (query.includes("tamper")) {
    return {
      content: "**ALERTA TAMPER**: Indica daño físico o violación de seguridad. **EL EQUIPO DEBE IR A TALLER**.",
      suggestions: ["CAUSAS TAMPER", "VOLVER AL INICIO"]
    };
  }
  
  if (query.includes("causas")) {
    return {
      content: "**CAUSAS TAMPER**:\n1. Pilas internas agotadas.\n2. Golpe o caída.\n3. Humedad/Líquidos.\n4. Equipo destapado.",
      suggestions: ["VOLVER AL INICIO"]
    };
  }

  if (query.includes("hola") || query.includes("buenos días") || query.includes("inicio") || query.includes("volver")) {
    return {
      content: "¡Hola! Soy **VA&T Assistant**. Por favor, selecciona el modelo del equipo para guiarte en el soporte.",
      suggestions: BASE_MODELS
    };
  }

  // Respuesta por defecto
  return {
    content: "Para guiarte mejor, por favor selecciona un modelo o escribe tu duda específica.",
    suggestions: BASE_MODELS
  };
}
