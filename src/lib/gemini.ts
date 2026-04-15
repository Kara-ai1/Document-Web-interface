import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DocumentAnalysis {
  summary: string;
  documentType: string;
  keyEntities: string[];
  suggestedWebhookPayload: any;
  confidence: number;
}

export async function analyzeDocument(
  fileBase64: string,
  mimeType: string,
  fileName: string
): Promise<DocumentAnalysis> {
  const prompt = `Analyze this document named "${fileName}". 
  Provide a concise summary, identify the type of document, extract key entities (people, organizations, dates, amounts), and suggest a structured JSON payload that would be useful to send to a webhook for processing this document.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType,
              data: fileBase64,
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          documentType: { type: Type.STRING },
          keyEntities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          suggestedWebhookPayload: {
            type: Type.OBJECT,
            properties: {}, // Flexible object
          },
          confidence: { type: Type.NUMBER },
        },
        required: ["summary", "documentType", "keyEntities", "suggestedWebhookPayload", "confidence"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text);
}
