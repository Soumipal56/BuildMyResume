import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function generateAiContent(prompt: string, retries = 3) {
  let modelToUse = "gemini-3.5-flash";
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
      });
      return response.text;
    } catch (error: any) {
      if (error?.status !== 503) {
        throw error;
      }
      
      console.log(`Model ${modelToUse} overloaded, retrying in ${i + 1} seconds...`);
      
      if (i === retries - 2) {
        // Fallback to 3.1-flash-lite on the last attempt
        modelToUse = "gemini-3.1-flash-lite";
      } else if (i === retries - 1) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

