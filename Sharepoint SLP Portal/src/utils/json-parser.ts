import { logger } from "./logger";

export async function parseFetchResponse<T = any>(response: Response, fallback?: T): Promise<T> {
  try {
    const text = await response.text();
    return parseAIResponse<T>(text, fallback);
  } catch (e) {
    logger.error("Failed to read or parse fetch response:", e);
    if (fallback !== undefined) return fallback;
    throw e;
  }
}

export function parseAIResponse<T = any>(text: string | undefined | null, fallback?: T): T {

  if (!text) {
    if (fallback !== undefined) return fallback;
    throw new Error("Empty response from AI");
  }

  try {
    // 1. Try direct parsing after removing markdown code blocks
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch (e) {
    logger.warn("Failed to parse JSON response directly, attempting regex extraction:", e);
    
    // 2. Try to extract JSON object or array using regex
    try {
      const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]) as T;
      }
    } catch (e2) {
      logger.error("Failed to parse extracted JSON:", e2);
    }

    // 3. Return fallback if provided, else throw
    if (fallback !== undefined) {
      logger.warn("Returning fallback value due to JSON parse failure.");
      return fallback;
    }
    
    throw new Error("Invalid JSON response from AI");
  }
}
