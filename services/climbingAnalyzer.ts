
import { GoogleGenAI, Type } from "@google/genai";
import { RouteAnalysis } from "../types";

export const analyzeWall = async (base64Image: string): Promise<RouteAnalysis> => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const prompt = `Analyze this climbing wall image. 
  1. Identify a logical, interesting climbing route.
  2. Map the holds with coordinates (x, y as percentages 0-100).
  3. Determine the difficulty grade (using French 5a-9c or V-scale V0-V17).
  4. Provide a "Beta" (step-by-step movements).
  
  Important: Return ONLY a JSON object corresponding to the provided schema.
  Make sure 'holds' coordinates are accurate to where holds are actually visible in the image.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          grade: { type: Type.STRING },
          description: { type: Type.STRING },
          style: { type: Type.STRING },
          holds: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                type: { 
                  type: Type.STRING,
                  description: 'One of: start, hand, foot, top, intermediate'
                },
                description: { type: Type.STRING }
              },
              required: ['x', 'y', 'type']
            }
          },
          beta: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.NUMBER },
                action: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          }
        },
        required: ['name', 'grade', 'holds', 'beta']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No analysis received from AI.");
  
  try {
    return JSON.parse(text) as RouteAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response", text);
    throw new Error("Invalid response format from AI.");
  }
};
