import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

const API_KEY_STORAGE_KEY = "storm_ai_api_key";

export const getStoredApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setStoredApiKey = (key: string) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const removeStoredApiKey = () => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

// Helper to check for API Key availability
export const hasApiKey = (): boolean => {
  return !!getStoredApiKey();
};

const getClient = () => {
  const apiKey = getStoredApiKey();
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  
  return new GoogleGenAI({ apiKey });
};

/**
 * Texture Swap / Image Editing
 * Uses: gemini-2.5-flash-image (Nano Banana)
 */
export const swapTexture = async (
  targetImageBase64: string,
  referenceTextureBase64: string,
  prompt: string
): Promise<string> => {
  const ai = getClient();
  
  // Construct a prompt that guides the model to use the reference texture on the target image.
  const finalPrompt = `
    You are an expert image editor.
    Image 1 is the TARGET environment/object.
    Image 2 is the REFERENCE texture/material.
    
    User Request: ${prompt}
    
    Instruction: Edit Image 1 by applying the material/texture characteristics from Image 2 to the specified object in Image 1. 
    Maintain the lighting and perspective of Image 1 as much as possible, but replace the surface material.
    Return ONLY the edited image.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: targetImageBase64
          }
        },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: referenceTextureBase64
          }
        },
        { text: finalPrompt }
      ]
    }
  });

  // Extract image from response
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("O modelo não gerou uma imagem de retorno.");
};

/**
 * Image Generation
 * Uses: gemini-3-pro-image-preview (Nano Banana Pro)
 * Supports: Aspect Ratio, Image Size (1K, 2K, 4K)
 */
export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  size: ImageSize
): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: size
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Nenhuma imagem gerada. O modelo pode ter recusado o prompt.");
};

/**
 * Image Analysis
 * Uses: gemini-3-pro-preview
 * Supports: Thinking mode
 */
export const analyzeImage = async (
  imageBase64: string,
  prompt: string,
  useThinking: boolean
): Promise<string> => {
  const ai = getClient();
  
  const config: any = {};
  
  if (useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 }; // Max budget for pro
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64
          }
        },
        { text: prompt }
      ]
    },
    config: config
  });

  return response.text || "Nenhuma análise retornada.";
};