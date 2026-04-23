import { describe, it, expect, vi, afterEach } from 'vitest';
import { geminiConsultant } from '../../services/gemini-consultant';
import { aiService } from '../../services/ai-service';
import { logger } from '../../utils/logger';

// Mock dependencies
vi.mock('../../services/ai-service', () => ({
  aiService: {
    generateClinicalResponse: vi.fn(),
  },
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('GeminiConsultantService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('consults the AI service with enhanced context', async () => {
    const query = 'What are the signs of aspiration?';
    const context = 'Dysphagia Pathway';
    const mockResponse = {
      text: 'Coughing, wet voice...',
      reasoning: 'Based on physiology...',
      citations: [],
    };

    (aiService.generateClinicalResponse as any).mockResolvedValue(mockResponse);

    const result = await geminiConsultant.consult(query, context, [], "Dysphagia");

    expect(aiService.generateClinicalResponse).toHaveBeenCalledWith(
      query,
      expect.stringContaining('[ACTIVE CLINICAL PATHWAY CONTEXT]: Dysphagia Pathway'),
      [],
      "Dysphagia"
    );
    expect(result).toEqual(mockResponse);
  });

  it('consults the AI service without context', async () => {
    const query = 'General question';
    const mockResponse = {
      text: 'Answer...',
      citations: [],
    };

    (aiService.generateClinicalResponse as any).mockResolvedValue(mockResponse);

    const result = await geminiConsultant.consult(query, '', [], "General");

    expect(aiService.generateClinicalResponse).toHaveBeenCalledWith(
      query,
      '',
      [],
      "General"
    );
    expect(result).toEqual(mockResponse);
  });

  it('handles errors and logs them', async () => {
    const query = 'Error query';
    const error = new Error('AI Service Failed');

    (aiService.generateClinicalResponse as any).mockRejectedValue(error);

    await expect(geminiConsultant.consult(query, '', [], "General")).rejects.toThrow(
      'Failed to get clinical guidance from the AI assistant. Please try again.'
    );

    expect(logger.error).toHaveBeenCalledWith(
      'GeminiConsultantService.consult error:',
      error
    );
  });
});
