"use server";

import { ASSISTANT_KNOWLEDGE } from "@/lib/assistant-knowledge";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function processAssistantMessage(message: string) {
  const query = message.toLowerCase();
  const BASE_MODELS = ["N910", "N950", "ME60", "SP600", "ME51", "ERROR TAMPER"];

  console.log("[SERVER ACTION] Message received:", message);

  if (query.includes("hola") || query.includes("buenos días") || query.includes("inicio") || query.includes("volver")) {
    return {
      content: "¡Hola! Soy **VA&T Assistant**. Por favor, selecciona el modelo del equipo para guiarte en el soporte.",
      suggestions: BASE_MODELS
    };
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.error("[SERVER ACTION] Missing API Key");
    return {
      content: "Error: La clave de API de Google no está configurada correctamente en .env.local.",
      suggestions: ["VOLVER AL INICIO"]
    };
  }

  try {
    console.log("[SERVER ACTION] Connecting to Gemini 3 Flash Preview...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: `Eres VA&T Assistant, experto en soporte técnico de POS. Responde según este manual: ${ASSISTANT_KNOWLEDGE}. Responde siempre en JSON: { "content": "...", "suggestions": ["...", "..."] }`
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();
    console.log("[SERVER ACTION] Raw response from Gemini:", responseText);

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : responseText;
      const parsed = JSON.parse(cleanJson);
      
      return {
        content: parsed.content || responseText,
        suggestions: parsed.suggestions || BASE_MODELS
      };
    } catch (e) {
      console.warn("[SERVER ACTION] JSON Parse failed, returning raw text");
      return {
        content: responseText,
        suggestions: ["VOLVER AL INICIO"]
      };
    }
  } catch (error: any) {
    console.error("[SERVER ACTION] Gemini API Error:", error.message || error);
    return {
      content: "Error al conectar con el servicio de IA: " + (error.message || "Error desconocido"),
      suggestions: ["VOLVER AL INICIO"]
    };
  }
}

