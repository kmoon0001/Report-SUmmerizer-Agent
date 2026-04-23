import { aiService, AIResponse } from './ai-service';
import { logger } from '../utils/logger';

export class GeminiConsultantService {
  /**
   * Consults the AI Clinical Guidance Agent.
   * @param query The clinician's question.
   * @param context Optional context about the current clinical pathway or patient scenario.
   * @returns A structured AI response with text, reasoning, and citations.
   */
  public async consult(query: string, context: string, history: Array<{ role: 'user' | 'assistant'; content: string }>, activeView: string): Promise<AIResponse> {
    try {
      // Prepend specific context about the active pathway to help the AI be more relevant
      const enhancedContext = context 
        ? `[ACTIVE CLINICAL PATHWAY CONTEXT]: ${context}\n\nUser is currently viewing this pathway and asking a question related to it.` 
        : '';

      // Delegate to the robust central AI service which holds the system instructions
      return await aiService.generateClinicalResponse(query, enhancedContext, history, activeView);
    } catch (error) {
      logger.error('GeminiConsultantService.consult error:', error);
      throw new Error('Failed to get clinical guidance from the AI assistant. Please try again.', { cause: error });
    }
  }
}

export const geminiConsultant = new GeminiConsultantService();
