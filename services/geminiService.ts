import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

// Initialize Gemini Client
// In a real app, strict environment variable checks would happen here.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  /**
   * Analyzes unstructured clinical notes to extract structured medical data.
   * Uses Gemini 2.5 Flash for speed.
   */
  analyzeClinicalNote: async (noteContent: string): Promise<AnalysisResult> => {
    if (!apiKey) return { text: "API Key missing. Please set process.env.API_KEY." };

    try {
      const model = "gemini-2.5-flash";
      const systemInstruction = `
        You are an expert Medical Coding Assistant for a Hospital ERP. 
        Analyze the physician's unstructured notes.
        Extract a brief clinical summary, list potential ICD-10 codes, and list medications.
        Ensure high accuracy for billing purposes.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: noteContent,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              icdCodes: { type: Type.ARRAY, items: { type: Type.STRING } },
              medications: { type: Type.ARRAY, items: { type: Type.STRING } },
              billingAlerts: { type: Type.STRING, description: "Any missing info needed for claims" }
            }
          }
        }
      });

      const json = JSON.parse(response.text || '{}');
      return {
        text: "Analysis Complete",
        data: json
      };

    } catch (error) {
      console.error("Gemini Error:", error);
      return { text: "Failed to analyze note. Please try again." };
    }
  },

  /**
   * Analyzes financial transaction for anomalies.
   */
  analyzeTransactionAnomaly: async (transactionDetails: any): Promise<AnalysisResult> => {
    if (!apiKey) return { text: "API Key missing." };

    try {
      const model = "gemini-2.5-flash";
      const prompt = `
        Analyze this hospital financial transaction for potential fraud or errors (anomaly detection).
        Transaction: ${JSON.stringify(transactionDetails)}
        
        Explain why this might be flagged as high risk (Risk Score > 80). 
        Consider amount magnitude, category mismatch, or description irregularities.
        Provide a concise audit recommendation.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return {
        text: response.text || "No analysis generated.",
      };

    } catch (error) {
       console.error("Gemini Error:", error);
      return { text: "Audit analysis failed." };
    }
  }
};
