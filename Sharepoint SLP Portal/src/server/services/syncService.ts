import { GoogleGenAI, Type } from "@google/genai";
import { dbService } from "../db/database";
import { parseAIResponse } from "../../utils/json-parser";
import { logger } from "../../utils/logger";

export async function syncExternalData() {
  logger.info("[Sync] Starting background data synchronization...");
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") {
    logger.warn("[Sync] Skipping sync: No valid Gemini API key found in .env file.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // 1. Sync News
    logger.info("[Sync] Fetching latest SLP news...");
    const newsResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Find the 5 most recent and important news articles or clinical updates for Speech-Language Pathologists from ASHA or other reputable sources. Return as JSON array.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              link: { type: Type.STRING },
              source: { type: Type.STRING },
            },
            required: ["id", "title", "content", "link", "source"],
          },
        },
      },
    });

    try {
      const news = parseAIResponse<any[]>(newsResponse.text, []);
      if (Array.isArray(news) && news.length > 0) {
        news.forEach((item: any) => dbService.upsertNewsItem(item));
        logger.info(`[Sync] Successfully synced ${news.length} news items.`);
      } else {
        logger.warn("[Sync] News response is not a valid array or is empty:", news);
      }
    } catch (e) {
      logger.error("[Sync] Failed to parse news JSON:", e);
    }

    // 2. Sync Networking Events
    logger.info("[Sync] Fetching upcoming SLP networking events...");
    const eventsResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Find 5 upcoming networking events, webinars, or conferences for Speech-Language Pathologists in 2026. Return as JSON array.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              date: { type: Type.STRING },
              location: { type: Type.STRING },
              link: { type: Type.STRING },
              source: { type: Type.STRING },
            },
            required: ["id", "title", "description", "date", "location", "link", "source"],
          },
        },
      },
    });

    try {
      const events = parseAIResponse<any[]>(eventsResponse.text, []);
      if (Array.isArray(events) && events.length > 0) {
        events.forEach((event: any) => dbService.upsertNetworkingEvent(event));
        logger.info(`[Sync] Successfully synced ${events.length} networking events.`);
      } else {
        logger.warn("[Sync] Events response is not a valid array or is empty:", events);
      }
    } catch (e) {
      logger.error("[Sync] Failed to parse events JSON:", e);
    }

    // 3. Populate Mock WhatsApp if empty
    const currentMessages = dbService.getWhatsAppMessages();
    if (currentMessages.length === 0) {
      logger.info("[Sync] Populating mock WhatsApp messages...");
      const mockMessages = [
        { id: '1', sender: 'Sarah J. (Clinical Lead)', text: 'Has anyone seen the new Medicare Part B update?', timestamp: new Date().toISOString() },
        { id: '2', sender: 'Michael R. (SLP-CCC)', text: 'Just finished a complex dysphagia eval, the new protocol worked great!', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        { id: '3', sender: 'Elena G. (AAC Specialist)', text: 'Quick question: best resources for pediatric AAC in schools?', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
      ];
      mockMessages.forEach(msg => dbService.upsertWhatsAppMessage(msg));
    }

  } catch (error: any) {
    if (error?.status === 400 || error?.message?.includes("API key not valid")) {
      logger.warn("[Sync] Skipping sync: The provided Gemini API key is invalid.");
    } else {
      logger.error("[Sync] Error during data synchronization:", error);
    }
  }
}
