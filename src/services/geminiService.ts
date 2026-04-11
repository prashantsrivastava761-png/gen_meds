import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini AI client
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Converts a File object to a base64 string.
 */
async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(",")[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Searches for a medicine by name and finds affordable generic alternatives.
 * @param medicineName - The name of the medicine to search for.
 * @returns A JSON object containing the original medicine details and its alternatives.
 */
export async function findByName(medicineName: string) {
  const ai = getAIClient();
  const prompt = `
    You are a highly knowledgeable Pharmacist AI specialized in the Indian pharmaceutical market.
    Your goal is to help users find affordable generic alternatives for medicines.

    Medicine Name: ${medicineName}

    Tasks:
    1. Identify the exact active salt/composition of the medicine.
    2. Find the current approximate price (INR) and manufacturer of the original medicine in India.
    3. Provide a list of 5 affordable Indian generic alternatives with the EXACT same salt composition and strength.
    4. For each alternative, include:
       - Name
       - Manufacturer
       - Composition (must match original)
       - Price in INR
       - Estimated savings percentage compared to the original
       - Dosage form (e.g., Tablet, Capsule, Syrup)
       - Reason why it is a good alternative
       - General availability in India

    Strict Requirements:
    - Return ONLY a valid JSON object.
    - Do NOT include any markdown code fences (like \`\`\`json).
    - Do NOT include any explanations or introductory text.
    - If the medicine is not found or is a controlled substance with no direct generics, provide a helpful message in the disclaimer and return an empty alternatives array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                composition: { type: Type.STRING },
                price: { type: Type.STRING },
                manufacturer: { type: Type.STRING }
              },
              required: ["name", "composition", "price", "manufacturer"]
            },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  manufacturer: { type: Type.STRING },
                  composition: { type: Type.STRING },
                  price: { type: Type.STRING },
                  savings: { type: Type.STRING },
                  form: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  availability: { type: Type.STRING }
                },
                required: ["name", "manufacturer", "composition", "price", "savings", "form", "reason", "availability"]
              }
            },
            disclaimer: { type: Type.STRING }
          },
          required: ["original", "alternatives", "disclaimer"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini AI");
    }

    let result;
    try {
      const cleanJson = text.replace(/```json|```/g, "").trim();
      result = JSON.parse(cleanJson);
    } catch (e) {
      // Fallback: Try to extract JSON using regex if direct parse fails
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch (innerError) {
          throw new Error("Failed to parse medicine data. Please try again.");
        }
      } else {
        throw new Error("Failed to parse medicine data. Please try again.");
      }
    }

    // Ensure alternatives is at least an empty array
    if (!result.alternatives) {
      result.alternatives = [];
    }

    return result;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message.includes("GEMINI_API_KEY")) throw error;
    throw new Error("Failed to identify medicine. Please check the name and try again.");
  }
}

/**
 * Identifies a medicine from an image and finds affordable generic alternatives.
 * @param imageFile - The File object of the medicine image.
 * @returns A JSON object containing the detected medicine details and its alternatives.
 */
export async function findByImage(imageFile: File) {
  const ai = getAIClient();
  const imagePart = await fileToGenerativePart(imageFile);
  
  const prompt = `
    You are a highly knowledgeable Pharmacist AI specialized in the Indian pharmaceutical market.
    Look at this medicine image (it could be a strip, box, bottle, or packaging).

    Tasks:
    1. Read the medicine name, brand, and active salt composition from the image.
    2. Determine the current approximate price (INR) and manufacturer of this medicine in India.
    3. Provide a confidence level (high/medium/low) for your detection.
    4. Provide a list of 5 affordable Indian generic alternatives with the EXACT same salt composition and strength.
    5. For each alternative, include:
       - Name
       - Manufacturer
       - Composition (must match original)
       - Price in INR
       - Estimated savings percentage compared to the detected medicine
       - Dosage form (e.g., Tablet, Capsule, Syrup)
       - Reason why it is a good alternative
       - General availability in India

    Strict Requirements:
    - Return ONLY a valid JSON object.
    - Do NOT include any markdown code fences (like \`\`\`json).
    - Do NOT include any explanations or introductory text.
    - If the medicine is not readable or identifiable from the image, set the "error" field with a clear explanation and leave "detected" and "alternatives" as null or empty.

    JSON Format:
    {
      "detected": {
        "name": "string",
        "composition": "string",
        "price": "string",
        "manufacturer": "string",
        "confidence": "high/medium/low"
      },
      "alternatives": [
        {
          "name": "string",
          "manufacturer": "string",
          "composition": "string",
          "price": "string",
          "savings": "string",
          "form": "string",
          "reason": "string",
          "availability": "string"
        }
      ],
      "disclaimer": "Always consult your doctor before switching medicines.",
      "error": "string or null"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          imagePart
        ]
      },
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detected: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                name: { type: Type.STRING },
                composition: { type: Type.STRING },
                price: { type: Type.STRING },
                manufacturer: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ["high", "medium", "low"] }
              }
            },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  manufacturer: { type: Type.STRING },
                  composition: { type: Type.STRING },
                  price: { type: Type.STRING },
                  savings: { type: Type.STRING },
                  form: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  availability: { type: Type.STRING }
                }
              }
            },
            disclaimer: { type: Type.STRING },
            error: { type: Type.STRING, nullable: true }
          },
          required: ["disclaimer", "error"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini AI");
    }

    let result;
    try {
      const cleanJson = text.replace(/```json|```/g, "").trim();
      result = JSON.parse(cleanJson);
    } catch (e) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch (innerError) {
          throw new Error("Failed to process image data. Please try again.");
        }
      } else {
        throw new Error("Failed to process image data. Please try again.");
      }
    }

    if (result.error) {
      return result; // Return result with error field set
    }

    // Ensure alternatives is at least an empty array
    if (!result.alternatives) {
      result.alternatives = [];
    }

    return result;
  } catch (error: any) {
    console.error("Gemini Image API Error:", error);
    if (error.message.includes("GEMINI_API_KEY")) throw error;
    throw new Error("Failed to process image. Please ensure the medicine name is clearly visible.");
  }
}


