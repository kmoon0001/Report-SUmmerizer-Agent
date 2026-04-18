import { parseAIResponse, parseFetchResponse } from "../utils/json-parser";
import { GoogleGenAI, Type, GenerateContentResponse, ThinkingLevel, Modality } from "@google/genai";
import { logger } from "../utils/logger";
import { localAIService } from "./local-ai-service";
import { sanitizePrompt } from "../utils/sanitizer";
import { auditService } from "./audit-service";
import { z } from "zod";

const AIResponseSchema = z.object({
  text: z.string(),
  reasoning: z.string().optional(),
  citations: z.array(z.object({
    source: z.string(),
    url: z.string().optional(),
    relevance: z.string()
  })).optional(),
  suggestedActions: z.array(z.string()).optional()
});

// ... (rest of the file)

export interface AICitation {
  source: string;
  url?: string;
  relevance: string;
}

export interface AIResponse {
  text: string;
  reasoning?: string;
  citations?: AICitation[];
  suggestedActions?: string[];
}

export interface ClinicalNoteResponse {
  nextButtonGroups: Array<{
    id: string;
    title: string;
    multiSelect: boolean;
    options: Array<{ 
      id: string; 
      label: string; 
      tooltip?: string;
      inserts?: { path: string; value: string } 
    }>;
  }>;
  smartSets?: Array<{
    id: string;
    label: string;
    description: string;
    selections: Record<string, string[]>;
  }>;
  visualAids?: Array<{
    title: string;
    description: string;
    type: 'image' | 'video' | 'animation' | 'sketch';
    contentUrl?: string;
  }>;
  noteFacts: {
    assessmentType: string;
    dx: string[];
    reasonForReferral: string[];
    observations: string[];
    measures: Array<{ name: string; score: string; interpretation: string }>;
    interventions: string[];
    education: string[];
    skilledRationale: string;
    goals: { stg: string[]; ltg: string[] };
    planOfCare: { freq: string; durWeeks: string; minutesTimed: string; minutesTotal: string };
  };
  noteNarrative: {
    summary: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  validation: {
    missing: string[];
    warnings: string[];
  };
  learningTips: Array<{ title: string; tip: string; whyItMatters: string }>;
  retumble: { allowed: boolean; instruction: string };
  clinicalCheck?: {
    flags: Array<{
      id: string;
      severity: 'critical' | 'warning' | 'info';
      message: string;
      evidence: string[];
      suggestedAction: string;
      askClinician?: string;
    }>;
    passed: boolean;
  };
}

// --- Case Study Types ---
export interface CaseStudyScenario {
  id: string;
  title: string;
  scenario: string;
  clinicalQuestion: string;
  correctAnswer: string;
  explanation: string;
}

export interface CaseStudyFeedback {
  isCorrect: boolean;
  feedback: string;
  learningPoints: string[];
}

// --- Goal Generation Types ---
export interface SMARTGoalResponse {
  goals: Array<{
    text: string;
    components: {
      specific: string;
      measurable: string;
      achievable: string;
      relevant: string;
      timeBound: string;
    };
    rationale: string;
  }>;
}

// --- Quality Check Types ---
export interface QualityCheckAnalysis {
  qualityScore: number; // 0-100 (100 = high quality)
  qualityLevel: 'Needs Improvement' | 'Good' | 'Excellent';
  flaggedPhrases: Array<{
    phrase: string;
    reason: string;
    suggestion: string;
  }>;
  overallAssessment: string;
}

export class AIService {
  private features = {
    advancedAI: true,
    googleCloud: true,
    microsoftCopilot: false,
    localLLM: false
  };

  // Circuit Breaker State
  private circuitBreaker = {
    failures: 0,
    lastFailureTime: 0,
    isOpen: false,
    threshold: 5, // Open circuit after 5 consecutive failures
    resetTimeout: 60000 // Try again after 60 seconds
  };

  public updateConfig(features: Partial<typeof this.features>) {
    this.features = { ...this.features, ...features };
  }

  private get ai(): GoogleGenAI {
    // Use import.meta.env for Vite client-side code, fallback to process.env for tests/server
    const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : process.env;
    const key = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;
    if (!key || key === "undefined") {
      throw new Error("API key is not set. Please enter your Gemini API key in the .env file.");
    }
    return new GoogleGenAI({ apiKey: key });
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private checkCircuitBreaker(): boolean {
    if (!this.circuitBreaker.isOpen) return true;
    
    const now = Date.now();
    if (now - this.circuitBreaker.lastFailureTime > this.circuitBreaker.resetTimeout) {
      // Half-open: allow one request to try and reset
      logger.info("Circuit breaker half-open, attempting request...");
      return true;
    }
    
    logger.warn("Circuit breaker is OPEN. Fast-failing request.");
    return false;
  }

  private recordSuccess() {
    this.circuitBreaker.failures = 0;
    this.circuitBreaker.isOpen = false;
  }

  private recordFailure() {
    this.circuitBreaker.failures += 1;
    this.circuitBreaker.lastFailureTime = Date.now();
    if (this.circuitBreaker.failures >= this.circuitBreaker.threshold) {
      this.circuitBreaker.isOpen = true;
      logger.error(`Circuit breaker tripped after ${this.circuitBreaker.failures} failures.`);
    }
  }

  private async executeWithFallback<T>(
    operationName: string,
    cloudFn: () => Promise<T>,
    localFn: () => Promise<T>,
    fallbackValue: T,
    retries = 3
  ): Promise<T> {
    // 1. Try Local First (if enabled and loaded)
    if (this.features.localLLM && localAIService.isModelLoaded()) {
      try {
        logger.info(`Attempting local AI for ${operationName}...`);
        return await localFn();
      } catch (error: any) {
        logger.warn(`Local AI ${operationName} failed, falling back to Cloud API:`, error);
        // If it's a 403 (Auth) or 503 (LLM not init), don't retry cloud
        if (error.status === 403 || error.status === 503) throw error;
      }
    } else if (this.features.localLLM) {
       logger.info(`Local AI requested but model not loaded. Falling back to Cloud API for ${operationName}.`);
    }

    // 2. Fallback to Cloud API (if enabled and circuit is closed)
    if (this.features.googleCloud && this.checkCircuitBreaker()) {
      for (let i = 0; i < retries; i++) {
        try {
          logger.info(`Attempting Cloud API for ${operationName} (Attempt ${i + 1})...`);
          const result = await cloudFn();
          this.recordSuccess();
          return result;
        } catch (error: any) {
          if (error?.status === 429 || error?.message?.includes("429")) {
            const waitTime = Math.pow(2, i) * 1000 + Math.random() * 1000;
            logger.warn(`Rate limit hit in ${operationName}, retrying in ${waitTime}ms...`);
            await this.delay(waitTime);
            continue;
          }
          
          logger.error(`Cloud AI failed in ${operationName}:`, error);
          this.recordFailure();
          return fallbackValue;
        }
      }
      // If we exhausted retries without success or 429, record failure
      this.recordFailure();
    }
    
    return fallbackValue;
  }

  // Helper to get API key for local backend
  private getLocalApiKey(): string {
    const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : process.env;
    return env.VITE_LOCAL_API_KEY || env.LOCAL_API_KEY || "super-secret-key";
  }

  private getLocalApiUrl(): string {
    const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : process.env;
    return env.VITE_LOCAL_AI_URL || env.LOCAL_AI_URL || "http://localhost:8000";
  }

  public async generateClinicalResponse(
    prompt: string, 
    context: string = "", 
    history: Array<{ role: 'user' | 'assistant'; content: string }> = [], 
    activeView: string = "clinical"
  ): Promise<AIResponse> {
    const sanitizedPrompt = sanitizePrompt(prompt);
    
    const historyContext = history.map(h => `${h.role}: ${h.content}`).join('\n');
    const fullContext = `Active View: ${activeView}\n\nHistory:\n${historyContext}\n\nContext: ${context}`;
    
    const fallbackValue: AIResponse = {
      text: "I'm currently experiencing connectivity issues. Please try again in a moment, or enable the Local AI fallback in Settings.",
      reasoning: "Service temporarily unavailable.",
      citations: [],
      suggestedActions: ["Check internet connection", "Enable Local AI Fallback in Settings"]
    };

    const localFn = async () => {
      const baseUrl = this.getLocalApiUrl();
      const response = await fetch(`${baseUrl}/chat-with-doc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.getLocalApiKey()
        },
        body: JSON.stringify({ doc_id: 'active-doc-id', query: sanitizedPrompt }) // Need to pass doc_id
      });
      
      const data = await parseFetchResponse(response);
      return {
        text: data.response,
        reasoning: "Generated locally via enhanced RAG backend.",
        citations: [],
        suggestedActions: []
      };
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an expert SLP Clinical Consultant. 
        
        CRITICAL: You MUST ground all your answers in the provided context, the RAG library (if provided in the context), and authoritative sources (e.g., ASHA, CMS, peer-reviewed journals). 
        If the information is not available in these sources, state that clearly. Do not rely on general web information for clinical decisions.
        
        Active View: ${activeView}
        
        History:
        ${historyContext}
        
        Context: ${context}
        
        Prompt: ${sanitizedPrompt}
        
        Guidelines:
        - Prioritize evidence-based practice (ASHA, CMS, peer-reviewed literature).
        - Provide structured clinical reasoning.
        - If uncertain, state that clearly and suggest further assessment.
        - Ensure all advice is compliant with Medicare/CMS documentation standards, specifically citing the Medicare Benefit Policy Manual Chapter 15, Jimmo vs. Sebelius settlement, CMS/Noridian guidelines, and CFRs related to SNF/LTC.
        
        Output JSON format:
        {
          "text": "The main response",
          "reasoning": "The clinical reasoning behind the response",
          "citations": [{"source": "Source name", "url": "Optional URL", "relevance": "Why it's relevant"}],
          "suggestedActions": ["Action 1", "Action 2"]
        }`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              citations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING },
                    url: { type: Type.STRING },
                    relevance: { type: Type.STRING }
                  },
                  required: ["source", "relevance"]
                }
              },
              suggestedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["text"]
          }
        }
      });
      const parsed = parseAIResponse(response.text, {});
      const validated = AIResponseSchema.parse(parsed);
      auditService.logInteraction({ prompt: sanitizedPrompt, confidence: 4.5 }); // Placeholder confidence
      return validated;
    };

    return this.executeWithFallback("generateClinicalResponse", cloudFn, localFn, fallbackValue);
  }

  public async generateCaseStudy(topic: string): Promise<CaseStudyScenario> {
    const fallbackValue: CaseStudyScenario = {
      id: "error-case",
      title: "Generation Failed",
      scenario: "Unable to generate case study due to connectivity or model issues.",
      clinicalQuestion: "Please check your internet connection or local model status.",
      correctAnswer: "N/A",
      explanation: "Service unavailable."
    };

    const localFn = async () => {
      const prompt = `You are a clinical educator. Generate a case study about ${topic}.
      
      Strictly output ONLY valid JSON matching this structure:
      {
        "id": "unique-id",
        "title": "Case Title",
        "scenario": "Detailed clinical scenario...",
        "clinicalQuestion": "Question for the clinician...",
        "correctAnswer": "The ideal answer...",
        "explanation": "Why this is correct..."
      }`;
      
      const response = await localAIService.generateContent(prompt);
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return parseAIResponse(jsonStr);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a clinical case study scenario for an SLP about ${topic}.
        Output JSON format:
        {
          "id": "unique-id",
          "title": "Case Title",
          "scenario": "Detailed clinical scenario",
          "clinicalQuestion": "A specific question for the clinician",
          "correctAnswer": "The ideal answer",
          "explanation": "Why this is the correct answer"
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              scenario: { type: Type.STRING },
              clinicalQuestion: { type: Type.STRING },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["id", "title", "scenario", "clinicalQuestion", "correctAnswer", "explanation"]
          }
        }
      });

      if (!response.text) throw new Error("Empty response from AI");
      return parseAIResponse(response.text);
    };

    return this.executeWithFallback("generateCaseStudy", cloudFn, localFn, fallbackValue);
  }

  public async evaluateCaseStudyResponse(scenario: string, userResponse: string): Promise<CaseStudyFeedback> {
    const fallbackValue: CaseStudyFeedback = {
      isCorrect: false,
      feedback: "Unable to evaluate response due to connectivity or model issues.",
      learningPoints: ["Please check your internet connection or local model status."]
    };

    const localFn = async () => {
      const prompt = `Evaluate this clinical response.
      Scenario: ${scenario}
      User Response: ${userResponse}
      
      Strictly output ONLY valid JSON matching this structure:
      {
        "isCorrect": true/false,
        "feedback": "Detailed feedback...",
        "learningPoints": ["Point 1", "Point 2"]
      }`;
      
      const response = await localAIService.generateContent(prompt);
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return parseAIResponse(jsonStr);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Evaluate the user's response to the following clinical scenario.
        
        Scenario: ${scenario}
        User Response: ${userResponse}
        
        Output JSON format:
        {
          "isCorrect": boolean,
          "feedback": "Detailed feedback on the user's response",
          "learningPoints": ["Key takeaway 1", "Key takeaway 2"]
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCorrect: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
              learningPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["isCorrect", "feedback", "learningPoints"]
          }
        }
      });

      if (!response.text) throw new Error("Empty response from AI");
      return parseAIResponse(response.text);
    };

    return this.executeWithFallback("evaluateCaseStudyResponse", cloudFn, localFn, fallbackValue);
  }

  public async generateSMARTGoals(domain: string, level: string, task: string, assessmentFindings: string): Promise<SMARTGoalResponse> {
    const fallbackValue: SMARTGoalResponse = {
      goals: [
        {
          text: `Offline Goal: Improve ${domain} for ${task}`,
          components: {
            specific: "Specific component",
            measurable: "Measurable component",
            achievable: "Achievable component",
            relevant: "Relevant component",
            timeBound: "Time-bound component"
          },
          rationale: "Service unavailable. Please load a local model in Settings or connect to internet."
        }
      ]
    };

    const localFn = async () => {
      const prompt = `You are a clinical SLP assistant. Generate 3 SMART goals for:
      Domain: ${domain}
      Level: ${level}
      Task: ${task}
      Assessment Findings: ${assessmentFindings}
      
      Strictly output ONLY valid JSON matching this structure:
      {
        "goals": [
          {
            "text": "Full goal text",
            "components": {
              "specific": "...",
              "measurable": "...",
              "achievable": "...",
              "relevant": "...",
              "timeBound": "..."
            },
            "rationale": "..."
          }
        ]
      }`;
      
      const response = await localAIService.generateContent(prompt);
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return parseAIResponse(jsonStr);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate SMART goals for an SLP patient.
        Domain: ${domain}
        Level: ${level}
        Task: ${task}
        Assessment Findings: ${assessmentFindings}
        
        Output JSON format:
        {
          "goals": [
            {
              "text": "The full SMART goal",
              "components": {
                "specific": "What exactly will be done",
                "measurable": "How it will be measured",
                "achievable": "Why it's achievable",
                "relevant": "Why it's relevant to the patient",
                "timeBound": "When it will be achieved"
              },
              "rationale": "Clinical rationale for this goal based on assessment findings"
            }
          ]
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              goals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    components: {
                      type: Type.OBJECT,
                      properties: {
                        specific: { type: Type.STRING },
                        measurable: { type: Type.STRING },
                        achievable: { type: Type.STRING },
                        relevant: { type: Type.STRING },
                        timeBound: { type: Type.STRING }
                      },
                      required: ["specific", "measurable", "achievable", "relevant", "timeBound"]
                    },
                    rationale: { type: Type.STRING }
                  },
                  required: ["text", "components", "rationale"]
                }
              }
            },
            required: ["goals"]
          }
        }
      });

      if (!response.text) throw new Error("Empty response from AI");
      return parseAIResponse(response.text);
    };

    return this.executeWithFallback("generateSMARTGoals", cloudFn, localFn, fallbackValue);
  }

  public async generateContent(prompt: string, config?: Record<string, any>): Promise<string> {
    const fallbackValue = "Offline mode: No local model loaded or service unavailable.";

    const localFn = async () => {
      return await localAIService.generateContent(prompt);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: config
      });
      return response.text || "";
    };

    return this.executeWithFallback("generateContent", cloudFn, localFn, fallbackValue);
  }

  public async *generateContentStream(prompt: string): AsyncGenerator<string, void, unknown> {
    // 1. Try Local First
    if (this.features.localLLM && localAIService.isModelLoaded()) {
      try {
        logger.info("Attempting local AI stream for generateContentStream...");
        yield* localAIService.generateContentStream(prompt);
        return;
      } catch (error) {
        logger.warn("Local AI stream failed, falling back to Cloud API:", error);
      }
    } else if (this.features.localLLM) {
      logger.info("Local AI requested but model not loaded. Falling back to Cloud API for stream.");
    }

    // 2. Fallback to Cloud API
    if (this.features.googleCloud) {
      try {
        logger.info("Attempting Cloud API stream for generateContentStream...");
        const responseStream = await this.ai.models.generateContentStream({
          model: "gemini-3.1-flash-lite-preview",
          contents: prompt
        });

        for await (const chunk of responseStream) {
          const c = chunk as GenerateContentResponse;
          if (c.text) {
            yield c.text;
          }
        }
        return;
      } catch (error) {
        logger.error("Cloud AI failed in generateContentStream:", error);
      }
    }

    yield "I'm currently experiencing connectivity issues. Please check your internet connection or enable the Local AI fallback in Settings.";
  }

  public async analyzeQualityCheck(note: string): Promise<QualityCheckAnalysis> {
    const fallbackValue: QualityCheckAnalysis = {
      qualityScore: 0,
      qualityLevel: "Needs Improvement",
      flaggedPhrases: [],
      overallAssessment: "Analysis failed due to connectivity or model issues. Please try again later."
    };

    const localFn = async () => {
      const prompt = `Analyze this clinical note quality.
      Note: ${note}
      
      Strictly output ONLY valid JSON matching this structure:
      {
        "qualityScore": 0-100,
        "qualityLevel": "Needs Improvement" | "Good" | "Excellent",
        "flaggedPhrases": [{"phrase": "...", "reason": "...", "suggestion": "..."}],
        "overallAssessment": "..."
      }`;
      
      const response = await localAIService.generateContent(prompt);
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return parseAIResponse(jsonStr);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this SLP clinical note for documentation quality, skilled terminology, and Medicare/CMS compliance.
        Note: ${note}
        
        Identify:
        - Vague language
        - Lack of skilled need justification (e.g., why a professional is required)
        - Missing objective data
        - Potential missing or inappropriate CPT codes (based on the interventions described)
        - Compliance with Medicare Benefit Policy Manual Chapter 15
        
        Output JSON format:
        {
          "qualityScore": number (0-100),
          "qualityLevel": "Needs Improvement" | "Good" | "Excellent",
          "flaggedPhrases": [
            { "phrase": "The problematic text", "reason": "Why it could be improved (e.g., 'Not skilled', 'Vague', 'CMS compliance issue')", "suggestion": "Better alternative" }
          ],
          "overallAssessment": "Summary of findings, specifically addressing Medicare/CMS compliance, skilled need justification, and CPT code appropriateness."
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              qualityScore: { type: Type.NUMBER },
              qualityLevel: { type: Type.STRING, enum: ["Needs Improvement", "Good", "Excellent"] },
              flaggedPhrases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phrase: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    suggestion: { type: Type.STRING }
                  }
                }
              },
              overallAssessment: { type: Type.STRING }
            },
            required: ["qualityScore", "qualityLevel", "flaggedPhrases", "overallAssessment"]
          }
        }
      });

      if (!response.text) throw new Error("Empty response from AI");
      return parseAIResponse(response.text);
    };

    return this.executeWithFallback("analyzeQualityCheck", cloudFn, localFn, fallbackValue);
  }

  public async generateTherapyGame(topic: string, type: 'matching' | 'sequencing' | 'naming', difficulty: string): Promise<Record<string, any>> {
    const fallbackValue = {
      id: "offline-game",
      title: `Offline ${type} Game: ${topic}`,
      type: type,
      instructions: "This is a basic offline activity. Connect to the internet or load a local model for AI-generated content.",
      items: [
        { id: "1", content: "Item 1", type: "text", matchId: "a" },
        { id: "2", content: "Match 1", type: "text", matchId: "a" },
        { id: "3", content: "Item 2", type: "text", matchId: "b" },
        { id: "4", content: "Match 2", type: "text", matchId: "b" }
      ]
    };

    const localFn = async () => {
      // Local LLM might struggle with complex JSON schemas, but we try a simpler prompt
      const prompt = `Generate a simple ${type} therapy game about ${topic} for an SLP patient.
      Difficulty: ${difficulty}
      
      Strictly output ONLY valid JSON matching this structure:
      {
        "id": "unique_id",
        "title": "Creative Title",
        "type": "${type}",
        "instructions": "Clear instructions",
        "items": [
          { "id": "1", "content": "Text content", "type": "text", "matchId": "a" },
          { "id": "2", "content": "Match content", "type": "text", "matchId": "a" }
        ]
      }`;
      
      const response = await localAIService.generateContent(prompt);
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return parseAIResponse(jsonStr);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a therapy game/activity for an SLP patient.
        Topic: ${topic}
        Game Type: ${type}
        Difficulty: ${difficulty}
        
        Safety Guardrails:
        - Ensure all content is age-appropriate and clinically relevant.
        - Avoid any content that could be triggering or offensive.
        - If the topic is medically sensitive, ensure the activity follows standard SLP safety protocols (e.g., for dysphagia, ensure no actual food is used unless supervised).
        
        Output JSON format:
        {
          "id": "unique_id",
          "title": "Creative Title",
          "type": "${type}",
          "instructions": "Clear instructions for the patient",
          "items": [
            { "id": "1", "content": "Text content or Image description (e.g. 'red apple')", "type": "text" | "image", "matchId": "optional_match_id_for_pairs" }
          ]
        }
        For 'matching', provide pairs with matching 'matchId's.
        For 'sequencing', provide items in the correct order.
        For 'naming', provide items to be named.
        If 'type' is 'image', 'content' should be a short descriptive search term for an image.
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              instructions: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    content: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["text", "image"] },
                    matchId: { type: Type.STRING }
                  },
                  required: ["id", "content", "type"]
                }
              }
            },
            required: ["id", "title", "type", "instructions", "items"]
          }
        }
      });

      if (!response.text) throw new Error("Empty response from AI");
      return parseAIResponse(response.text);
    };

    return this.executeWithFallback("generateTherapyGame", cloudFn, localFn, fallbackValue);
  }

  public async chatWithDocument(documentText: string, query: string): Promise<string> {
    const fallbackValue = "Offline mode: No local model loaded or service unavailable.";

    const localFn = async () => {
      const truncatedDoc = documentText.slice(0, 3000); 
      const prompt = `You are an expert clinical assistant. Use the provided document text to answer the user's question.
      
      Document Text:
      ${truncatedDoc}
      
      User Question: ${query}
      
      Answer based ONLY on the document text provided. If the answer is not in the text, say you don't know.`;
      
      return await localAIService.generateContent(prompt);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert clinical assistant. Use the provided document text to answer the user's question.
        
        Document Text:
        ${documentText}
        
        User Question: ${query}
        
        Answer based ONLY on the document text provided. If the answer is not in the text, say you don't know.`,
      });
      return response.text || "No response generated.";
    };

    return this.executeWithFallback("chatWithDocument", cloudFn, localFn, fallbackValue);
  }

  public async summarizeDocument(documentText: string): Promise<string> {
    const fallbackValue = "Summarization failed. Please check your connection.";

    const localFn = async () => {
      const truncatedDoc = documentText.slice(0, 3000);
      const prompt = `Summarize the following clinical document. Extract key information, protocols, and clinical implications.
      
      Document Text:
      ${truncatedDoc}`;
      return await localAIService.generateContent(prompt);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize the following clinical document. Extract key information, protocols, and clinical implications.
        
        Document Text:
        ${documentText}`,
      });
      return response.text || "No summary generated.";
    };

    return this.executeWithFallback("summarizeDocument", cloudFn, localFn, fallbackValue);
  }

  public async generateTherapyActivity(prompt: string): Promise<Record<string, any>> {
    const fallbackValue = {
      id: "offline-activity",
      title: "Offline Activity",
      type: "naming",
      instructions: "Offline mode active. Connect to the internet or load a local model for AI-generated content.",
      items: [
        { id: "1", content: "Offline Item", type: "text" }
      ]
    };

    const localFn = async () => {
      const localPrompt = `Generate a simple therapy activity based on this request: "${prompt}".
      
      Strictly output ONLY valid JSON matching this structure:
      {
        "id": "unique_id",
        "title": "Creative Title",
        "type": "naming",
        "instructions": "Clear instructions",
        "items": [
          { "id": "1", "content": "Text content", "type": "text" }
        ]
      }`;
      
      const response = await localAIService.generateContent(localPrompt);
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return parseAIResponse(jsonStr);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a therapy game/activity for an SLP patient based on this request: "${prompt}".
        
        Output JSON format:
        {
          "id": "unique_id",
          "title": "Creative Title",
          "type": "matching" | "sequencing" | "naming",
          "instructions": "Clear instructions for the patient",
          "items": [
            { "id": "1", "content": "Text content or Image URL", "type": "text" | "image", "matchId": "optional_match_id_for_pairs" }
          ]
        }
        
        Rules:
        1. If the user asks for images, use "https://image.pollinations.ai/prompt/{keyword}" as the content, replacing {keyword} with a relevant descriptive term (e.g. "red apple", "kitchen sink").
        2. For 'matching', provide pairs with matching 'matchId's.
        3. For 'sequencing', provide items in the correct order.
        4. For 'naming', provide items to be named.
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["matching", "sequencing", "naming"] },
              instructions: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    content: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["text", "image"] },
                    matchId: { type: Type.STRING }
                  },
                  required: ["id", "content", "type"]
                }
              }
            },
            required: ["id", "title", "type", "instructions", "items"]
          }
        }
      });

      return parseAIResponse(response.text, {});
    };

    return this.executeWithFallback("generateTherapyActivity", cloudFn, localFn, fallbackValue);
  }

  public async generateAACBoard(topic: string, count: number): Promise<{text: string, type: string}[]> {
    const fallbackValue = [
      { text: "Yes", type: "social" }, { text: "No", type: "social" }, 
      { text: "Help", type: "social" }, { text: "Stop", type: "social" }
    ];

    const localFn = async () => {
      const prompt = `Generate a list of ${count} common AAC words/phrases for the topic: "${topic}". 
      Return ONLY a JSON array of objects with keys: "text" (string), "type" (noun, verb, adjective, social, other).
      Focus on high-frequency core vocabulary suitable for an adult communication board.
      
      Strictly output ONLY valid JSON matching this structure:
      [
        { "text": "word", "type": "noun" }
      ]`;
      
      const response = await localAIService.generateContent(prompt);
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return parseAIResponse(jsonStr);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a list of ${count} common AAC words/phrases for the topic: "${topic}". 
        Return ONLY a JSON array of objects with keys: "text" (string), "type" (noun, verb, adjective, social, other).
        Focus on high-frequency core vocabulary suitable for an adult communication board.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["noun", "verb", "adjective", "social", "other"] }
              },
              required: ["text", "type"]
            }
          }
        }
      });

      if (!response.text) throw new Error("Empty response from AI");
      return parseAIResponse(response.text);
    };

    return this.executeWithFallback("generateAACBoard", cloudFn, localFn, fallbackValue);
  }

  public async chatWithPersona(
    persona: string, 
    history: { role: 'user' | 'model', text: string }[], 
    userMessage: string,
    clinicalGoal?: string
  ): Promise<{ text: string; feedback?: string }> {
    const fallbackValue = {
      text: `[Offline Mode] I am simulating ${persona}. I cannot generate dynamic responses without internet or a local model.`,
      feedback: "Please enable Google Cloud features or load a local model for full chat functionality."
    };

    const systemPrompt = `You are an AI Conversation Partner for a speech therapy patient.
    
    Current Persona: ${persona}
    Patient's Clinical Goal: ${clinicalGoal || "General communication practice"}
    
    NIST/FDA Safety Rules:
    1. Stay in character as ${persona}.
    2. Keep responses concise (1-2 sentences) to allow the patient to speak.
    3. If the patient struggles, provide a gentle cue in a separate "feedback" field, but keep the "text" response natural.
    4. Do NOT break character in the "text" field.
    5. SAFETY: If the patient mentions self-harm, medical emergency, or extreme distress, immediately provide a supportive but firm recommendation to seek professional help or call emergency services, and flag this in the feedback.
    
    Output JSON format:
    {
      "text": "Your in-character response",
      "feedback": "Optional clinical feedback (e.g., 'Great job using a full sentence!' or 'Try saying: I need help')"
    }`;

    const historyArr = Array.isArray(history) ? history : [];
    const contextPrompt = `
    Conversation History:
    ${historyArr.map(h => `${h.role}: ${h.text}`).join('\n')}
    
    User: ${userMessage}
    `;

    const localFn = async () => {
      const prompt = `${systemPrompt}\n\n${contextPrompt}`;
      const response = await localAIService.generateContent(prompt);
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return parseAIResponse(jsonStr);
    };

    const cloudFn = async () => {
      const result = await this.ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: contextPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              feedback: { type: Type.STRING }
            },
            required: ["text"]
          }
        }
      });

      if (!result.text) throw new Error("Empty response from AI");
      return parseAIResponse(result.text);
    };

    return this.executeWithFallback("chatWithPersona", cloudFn, localFn, fallbackValue);
  }

  public async analyzeClinicalExam(examType: string, findings: Record<string, any>): Promise<string> {
    const fallbackValue = `**Offline Exam Analysis**\n\nBased on your findings for the ${examType}, please consult standard clinical protocols. Internet connection or local model required for AI interpretation.`;

    const localFn = async () => {
      const prompt = `Analyze these clinical exam findings for a ${examType}: ${JSON.stringify(findings)}
      
      Provide a professional clinical summary including:
      1. Summary of Impairments (if any).
      2. Functional Implications for swallowing/communication.
      3. Recommendations for further assessment or treatment.
      
      Format as a concise clinical note snippet.`;
      
      return await localAIService.generateContent(prompt);
    };

    const cloudFn = async () => {
      let prompt = `Analyze these clinical exam findings for a ${examType}: ${JSON.stringify(findings)}
        
        Provide a professional clinical summary including:
        1. Summary of Impairments (if any).
        2. Functional Implications for swallowing/communication.
        3. Recommendations for further assessment or treatment.
        
        Format as a concise clinical note snippet.`;

      // Add specific guidance based on exam type
      if (examType.toLowerCase().includes('oral mech') || examType.toLowerCase().includes('ome')) {
        prompt += `\n\nFocus on:
1. Structural integrity of oral articulators
2. Range of motion and strength
3. Symmetry and coordination
4. Implications for speech and swallowing`;
      } else if (examType.toLowerCase().includes('dysphagia') || examType.toLowerCase().includes('swallow')) {
        prompt += `\n\nFocus on:
1. Oral, pharyngeal, and esophageal phases
2. Signs of aspiration or penetration
3. Diet level recommendations
4. Compensatory strategies`;
      } else if (examType.toLowerCase().includes('aphasia') || examType.toLowerCase().includes('language')) {
        prompt += `\n\nFocus on:
1. Auditory comprehension
2. Verbal expression and naming
3. Reading and writing
4. Social communication impact`;
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert SLP. Interpret the findings conservatively. If findings are normal, state that clearly."
        }
      });

      if (!response.text) throw new Error("Empty response from AI");
      return response.text;
    };

    return this.executeWithFallback("analyzeClinicalExam", cloudFn, localFn, fallbackValue);
  }

  public async generateDifferentialDiagnosis(symptoms: string[], context: string = ""): Promise<string> {
    const fallbackValue = "Offline mode: Cannot generate differential diagnosis without internet or local model.";

    const localFn = async () => {
      const prompt = `Provide a differential diagnosis for the following speech/language/swallowing symptoms:
      Symptoms: ${symptoms.join(", ")}
      Context: ${context}
      
      List potential diagnoses and the key distinguishing features for each.`;
      return await localAIService.generateContent(prompt);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an expert Speech-Language Pathologist. Provide a differential diagnosis analysis based on the following:
        
        Symptoms/Findings: ${symptoms.join(", ")}
        Clinical Context: ${context}
        
        Format your response as a structured clinical report:
        1. Primary Diagnostic Considerations (List the top 2-3 most likely diagnoses).
        2. Differential Features (For each consideration, list the key features that distinguish it from the others - e.g., how to tell Apraxia from Dysarthria based on these specific symptoms).
        3. Recommended Assessments (Specific standardized tests or instrumental exams needed to confirm the diagnosis).
        
        Ensure all information aligns with ASHA guidelines and current evidence-based practice.`,
      });
      return response.text || "No diagnosis generated.";
    };

    return this.executeWithFallback("generateDifferentialDiagnosis", cloudFn, localFn, fallbackValue);
  }

  public async generateTreatmentPlan(diagnosis: string, assessmentData: string): Promise<string> {
    const fallbackValue = "Offline mode: Cannot generate treatment plan without internet or local model.";

    const localFn = async () => {
      const prompt = `Create an SLP treatment plan for:
      Diagnosis: ${diagnosis}
      Assessment Data: ${assessmentData}
      
      Include Long Term Goals, Short Term Goals, and Evidence-Based Interventions.`;
      return await localAIService.generateContent(prompt);
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an expert Speech-Language Pathologist. Develop a comprehensive, evidence-based treatment plan based on the following:
        
        Diagnosis: ${diagnosis}
        Assessment Data: ${assessmentData}
        
        Format the treatment plan using the WHO ICF (International Classification of Functioning, Disability and Health) framework where applicable. Include:
        
        1. Clinical Rationale (Why skilled SLP intervention is medically necessary).
        2. Long-Term Goals (LTGs) (Functional and measurable).
        3. Short-Term Goals (STGs) (SMART format, building towards LTGs).
        4. Evidence-Based Interventions (Specific treatment approaches/techniques to be used, e.g., McNeil Dysphagia Therapy Program, Semantic Feature Analysis).
        5. Recommended Frequency and Duration.
        
        Ensure the plan is compliant with Medicare/CMS documentation standards for skilled care.`,
      });
      return response.text || "No treatment plan generated.";
    };

    return this.executeWithFallback("generateTreatmentPlan", cloudFn, localFn, fallbackValue);
  }

  public async generateClinicalDocumentation(input: Record<string, any>): Promise<ClinicalNoteResponse> {
    const fallbackValue: ClinicalNoteResponse = {
      nextButtonGroups: [],
      noteFacts: {
        assessmentType: "Offline Mode",
        dx: ["Offline"],
        reasonForReferral: ["Offline"],
        observations: ["Offline"],
        measures: [],
        interventions: [],
        education: [],
        skilledRationale: "Offline mode active.",
        goals: { stg: [], ltg: [] },
        planOfCare: { freq: "1x/week", durWeeks: "4", minutesTimed: "30", minutesTotal: "30" }
      },
      noteNarrative: {
        summary: "Offline mode. Please connect to internet or load a local model.",
        objective: "Offline mode.",
        assessment: "Offline mode.",
        plan: "Offline mode."
      },
      validation: { missing: [], warnings: [] },
      learningTips: [],
      retumble: { allowed: false, instruction: "" }
    };

    const localFn = async () => {
      const prompt = `You are a clinical documentation assistant. Generate a SOAP note based on this input:
      ${JSON.stringify(input)}
      
      Strictly output ONLY valid JSON matching this structure:
      {
        "nextButtonGroups": [],
        "noteFacts": {
          "assessmentType": "...",
          "dx": ["..."],
          "reasonForReferral": ["..."],
          "observations": ["..."],
          "measures": [],
          "interventions": ["..."],
          "education": ["..."],
          "skilledRationale": "...",
          "goals": { "stg": ["..."], "ltg": ["..."] },
          "planOfCare": { "freq": "...", "durWeeks": "...", "minutesTimed": "...", "minutesTotal": "..." }
        },
        "noteNarrative": {
          "summary": "...",
          "objective": "...",
          "assessment": "...",
          "plan": "..."
        },
        "validation": { "missing": [], "warnings": [] },
        "learningTips": [],
        "retumble": { "allowed": false, "instruction": "" }
      }`;
      
      const response = await localAIService.generateContent(prompt);
      const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        return parseAIResponse(jsonStr);
      } catch (e) {
        logger.warn("Failed to parse JSON from local LLM for documentation, returning partial data.", e);
        return {
          ...fallbackValue,
          noteNarrative: { ...fallbackValue.noteNarrative, summary: response },
          validation: { missing: ["Could not parse structured data"], warnings: ["Local AI returned non-JSON response"] }
        };
      }
    };

    const cloudFn = async () => {
      // 1. Generate Note Content
      const noteResponse = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Generate clinical documentation based on this input: ${JSON.stringify(input)}`,
        config: {
          systemInstruction: `SLP Clinical Portal System Instructions (Gemini 3.1 Pro)
You are the Pacific Coast SLP Therapy Portal AI Assistant—a senior-level Speech-Language Pathology consultant embedded in a React + TypeScript web application serving SNF and outpatient rehabilitation clinicians.

Core Identity & Mission
Your role is three-fold:

Clinical Guidance Agent: Provide evidence-based SLP consultation for dysphagia, aphasia, cognitive-communication, dysarthria, voice, and tracheostomy/ventilation management.

Documentation Architect: Generate Medicare/CMS-compliant clinical notes using progressive disclosure UI patterns (structured JSON → narrative SOAP format).

Educational Resource: Deliver just-in-time learning tips, case studies, and documentation quality analysis to reduce documentation burden while improving quality.

Authoritative Source Hierarchy (Non-Negotiable)
When conflicts arise, always prioritize in this order:

Internal facility policies & phrase banks (highest priority)

CMS Chapter 15 Benefits Policy Manual, Jimmo vs. Sebelius (defining Medicare Part B services, skilled maintenance vs non-skilled maintenance restorative), CMS/Noridian guidelines, and CFRs related to long-term care and SNFs.

ASHA Preferred Practice Patterns, Scope of Practice, Practice Portal resources

Peer-reviewed evidence: Dysphagia journal, JSLHR, Cochrane Reviews

Reputable clinical sources: Med-SLP Collective, The Informed SLP, Meridian Education

Prohibited sources: Reddit, unverified blogs, general web searches without citation.

Safety & Hallucination Guardrails (Critical)
PHI Protection
Never generate actual PHI: No real names, DOBs, MRNs, addresses

Use placeholders: [Pt], [DOB], [MRN], [SNF], [Room], [MD]

De-identify all examples

Zero-Fabrication Policy
You may ONLY use facts from:
User's structured JSON input (selections, freeText)

Provided CONTEXT documents (CMS guidelines, facility policies)

NEVER:

Invent diagnoses, test scores, or normative data

Create VFSS/FEES results not explicitly provided

Quote CMS section numbers or thresholds not in CONTEXT

State POC is certified/recertified without supporting input

When uncertain:

Add item to validation.missing explaining what's needed

Use neutral phrasing: "Additional assessment indicated"

Populate validation.warnings to flag ambiguity

If input is malformed:

Return syntactically valid JSON

Leave noteFacts minimal/empty

Document specific problems in validation.missing

Clinical Tone & Style
Writing Standards
Clinical & concise: Short sentences, no fluff, avoid run-ons

Objective before interpretive: Present measures/observations first, then clinical reasoning

Skilled need emphasis: Always explain why SLP expertise is required (complexity, risk, professional judgment)

Approved abbreviations: SLP, SNF, dx, s/sx, PO, VFSS, FEES, STG, LTG, POC—do not invent new ones

Forbidden Phrases
"Tolerated treatment well" (without context)

"Continue POC" (without explaining why)

"Patient improving" (without objective measures)

Vague language that reduces documentation quality

Workflow Logic (Agentic Behavior)
Input Processing
Every request includes:

action: NEXT_AND_GENERATE | RETUMBLE | NEXT_ONLY

setting: SNF | OP Rehab

discipline: SLP

template: Initial Evaluation | Daily Note | Progress Note | Discharge

selections: structured user choices

freeText: supplemental clinician text

Response Patterns by Action
NEXT_ONLY:

Return only nextButtonGroups, validation, learningTips

Reflect current state without major changes

NEXT_AND_GENERATE:

Compute nextButtonGroups (progressive disclosure)

Build/update noteFacts from user input

Generate full noteNarrative (SOAP format)

RETUMBLE (Strict Mode):

DO NOT alter noteFacts AT ALL

ONLY rewrite noteNarrative with equivalent phrasing

Preserve all goals, measures, dx, interventions, POC details exactly

Magic Draft Expansion & Multi-Goal Handling
When user provides short phrases or requests multiple goals (e.g., "puree and thin with 2x coughing given mod cues, also work on naming"):

1. Interpret clinical meaning for ALL requested areas.
2. Expand into professional CMS-compliant narrative.
3. Populate noteFacts with inferred data for EACH goal area.
4. If multiple goals are implied, generate distinct STGs/LTGs for each.
5. Ensure interventions match all targeted goals.

Transform shorthand into medical documentation—never copy verbatim.

Clinical Pathways (SNF Priority)
Dysphagia Pathway (Primary)
Focus Areas:

Oropharyngeal characterization

Signs/symptoms: coughing, choking, wet voice, residue, pocketing

Aspiration risk, nutrition/hydration safety

Instrumental assessment needs (VFSS/FEES vs clinical bedside)

Assessments to suggest: Yale Swallow Protocol, MASA, EAT-10, GUSS, FOIS, TOMASS

Documentation keys:

Complexity of swallow assessment

Compensatory strategies training

Ongoing clinical judgment needs

Never: Invent PAS scores or diet levels without policy/input

Head & Neck Cancer (HNC) Pathway
Focus Areas:
Dysphagia, trismus, lymphedema, mucositis, xerostomia.
Assessments: MDADI, MASA-C, Trismus Measurement (MIO).
Interventions: Pharyngocise, TheraBite/jaw stretching, lymphedema management.
Documentation: Radiation fibrosis impact, prophylactic exercises, QoL.

Palliative & Hospice Pathway
Focus Areas:
Comfort feeding, secretion management, QoL, advanced directives.
Interventions: Careful hand feeding, taste for pleasure, secretion management.
Documentation: Shift from rehab to compensation/comfort, family education.

Pediatrics Pathway
Focus Areas:
Feeding/swallowing, speech/language milestones, early intervention.
Assessments: Feeding milestones, speech intelligibility, Brown's stages.
Interventions: SOS approach, Hanen, PROMPT.

Interactive Tools Awareness
Trismus Tracker:
Use for HNC patients to monitor interincisal opening (MIO).
Suggest if patient has HNC, radiation history, or limited jaw opening.

Pediatric Milestone Checklist:
Use for patients 0-3 years to track speech/language development.
Suggest for early intervention or pediatric evaluations.

Dysarthria Pathway
Focus Areas:
Speech subsystems: Respiration (support for speech), Phonation (quality, onset), Resonance (hyper/hyponasality), Articulation (precision, errors), Prosody (rate, stress).
Intelligibility: Word, sentence, and conversational levels.
Type: Flaccid, spastic, ataxic, hypokinetic, hyperkinetic, mixed.
Documentation: Impact on functional communication, compensatory strategy use (e.g., over-articulation, pacing).

Voice & Vocal Fold Paralysis Pathway
Focus Areas:
Vocal quality (GRBAS scale), pitch range, loudness control.
Laryngeal function: Glottal closure, MPT (Maximum Phonation Time), s/z ratio.
Respiratory support: Abdominal vs. clavicular breathing, breath coordination.
Documentation: Impact on participation (VHI-10), aspiration risk (if recurrent laryngeal nerve involvement), surgical history (e.g., thyroidectomy).

Other Pathways (Brief)
Aphasia: WAB-R, BDAE-3, BNT, MAST, CLQT+ | Focus on language modalities, functional communication

Cognition: MoCA, SLUMS, RIPA-2, FAVRES, ABCD | Attention, memory, safety awareness

Motor Speech: FDA-2, ABA-2, AIDS | Intelligibility, prosody, respiratory-phonatory support

Voice: CAPE-V, VHI-10 | Vocal quality, phonatory stamina, participation impact

Medicare & Jimmo Compliance (Sources of Truth: Medicare Benefit Policy Manual Chapter 15, Jimmo vs. Sebelius, CMS/Noridian, CFRs for LTC/SNF)
Skilled Services Coverage
Skilled SLP services may be covered when they:

Improve function, OR

Maintain current function, OR

Prevent/slow decline when skilled services required for safety

Never imply coverage depends only on "improvement potential"

Documentation Essentials
Every note must support:

Link to physician/NPP POC

Dx tied to functional impact

Objective measures supporting medical necessity

Explicit skilled interventions & clinical decision-making

POC parameters: frequency, duration, timed/total minutes

Progressive Disclosure UI (nextButtonGroups)
Output Structure
json
{
  "id": "observations_dysphagia",
  "title": "Clinical Signs & Symptoms",
  "multiSelect": true,
  "options": [
    {
      "id": "coughing_thin",
      "label": "Coughing with thin liquids",
      "tooltip": "May indicate penetration or aspiration",
      "inserts": {
        "path": "observations",
        "value": "Coughing with thin liquids"
      }
    }
  ]
}
Rules
Progressive disclosure: Only surface logically next groups to complete strong note

Address gaps: Prioritize groups that resolve validation.missing items

No duplication: Avoid options already selected (unless toggling needed)

Guardrails: No PHI, no invented measures, no hard-coded coverage guarantees

Enhanced Features
Tooltips: Brief definitions for complex terms

Smart Sets: "Quick Start" bundles (e.g., "Standard Bedside Swallow")

Visual Aids: Suggest diagrams/videos in visualAids array

JSON Output Contract (Mandatory Structure)
json
{
  "nextButtonGroups": [...],
  "smartSets": [...],
  "visualAids": [...],
  "noteFacts": {
    "assessmentType": "Dysphagia",
    "dx": ["R13.10 - Dysphagia, unspecified"],
    "reasonForReferral": ["Choking on thin liquids"],
    "observations": ["Coughing with thin liquids", "Wet vocal quality"],
    "measures": [
      {
        "name": "FOIS",
        "score": "4",
        "interpretation": "Total oral diet, single consistency"
      }
    ],
    "interventions": ["Compensatory strategies: chin tuck", "Caregiver training"],
    "education": ["Signs of aspiration", "Diet consistency rationale"],
    "skilledRationale": "Complex swallow assessment requiring SLP expertise due to aspiration risk and need for ongoing clinical judgment per Medicare guidelines.",
    "goals": {
      "stg": ["Pt will tolerate nectar-thick liquids without coughing in 2 weeks"],
      "ltg": ["Pt will safely consume thin liquids with verbal cues in 4 weeks"]
    },
    "planOfCare": {
      "freq": "3x/week",
      "durWeeks": "4",
      "minutesTimed": "30",
      "minutesTotal": "45"
    }
  },
  "noteNarrative": {
    "summary": "[Pt] is a [age] y/o s/p CVA with dysphagia referred for swallow eval due to coughing with thin liquids.",
    "objective": "FOIS: 4/7. Obs: coughing 2x on 3oz water, wet vocal quality. Clinical swallow completed.",
    "assessment": "Moderate oropharyngeal dysphagia with aspiration risk on thin liquids. Skilled SLP required for compensatory strategy training and caregiver education per CMS guidelines.",
    "plan": "Recommend VFSS to confirm aspiration. Trial nectar-thick liquids. Continue 3x/week for 4 weeks. MD notification sent."
  },
  "validation": {
    "missing": ["Document at least one objective measure for dysphagia severity"],
    "warnings": ["Diet inconsistency: FreeText suggests NPO but selections show PO"]
  },
  "learningTips": [
    {
      "title": "Tie Interventions to Skilled Need",
      "tip": "Always explain WHY an SLP must deliver this intervention vs. nursing staff",
      "whyItMatters": "Medicare requires documentation of skilled service necessity to justify coverage"
    }
  ],
  "retumble": {
    "allowed": true,
    "instruction": "Rewrite narrative only; keep facts identical."
  },
  "clinicalCheck": {
    "flags": [
      {
        "id": "goal_alignment",
        "severity": "warning",
        "message": "Goal mentions thin liquids but current dx is single consistency",
        "evidence": ["noteFacts.goals.ltg[0]"],
        "suggestedAction": "Revise goal to align with current FOIS level",
        "askClinician": "Is the patient expected to progress to thin liquids?"
      }
    ],
    "passed": false
  }
}
Prompt Engineering Principles (Internal Use)
These guide your reasoning (not visible to users):

Chain-of-Thought: Step → Assess → Evidence → Recommend → Comply

Few-Shot Learning: Reference 1-2 ASHA examples before generating

Specificity: Rephrase vague queries ("dysphagia" → "adult SNF dysphagia eval workflow per ASHA")

Iterative Clarification: Ask ONE focused question if unclear (e.g., "Patient age/onset?")

Ethical Prefix: For uncertain outputs: "Preliminary guidance—consult MD/ASHA"

Final Reminders
Prioritize authoritative sources: Internal policies > CMS > ASHA > peer-reviewed evidence

Never fabricate: If data missing, use validation.missing or ask clarifying question

SNF focus: Address aspiration risk, fall risk, IDT communication, caregiver training

Maintenance therapy: Frame skilled need around preventing decline and complex comorbidity management

Retumble strictness: Only reword narrative; never touch facts`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nextButtonGroups: { type: Type.ARRAY, items: { type: Type.OBJECT } },
              noteFacts: { type: Type.OBJECT },
              noteNarrative: { type: Type.OBJECT },
              validation: { type: Type.OBJECT },
              learningTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              retumble: { type: Type.OBJECT }
            },
            required: ["noteFacts", "noteNarrative", "validation"]
          }
        }
      });

      if (!noteResponse.text) throw new Error("Empty response from AI");
      return parseAIResponse(noteResponse.text);
    };

    return this.executeWithFallback("generateClinicalDocumentation", cloudFn, localFn, fallbackValue);
  }

  // --- ADVANCED AI FEATURES ---

  public async generateProImage(prompt: string, size: "512px" | "1K" | "2K" | "4K" = "1K"): Promise<string | null> {
    const fallbackValue = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    const localFn = async () => {
      // Local LLMs typically don't generate images directly in the same way,
      // but we can use Pollinations as a "local-ish" free fallback if cloud is disabled
      // or if we want to avoid Gemini API calls.
      logger.info("Using Pollinations for image generation (Local/Fallback mode).");
      return fallbackValue;
    };

    const cloudFn = async () => {
      if (!this.features.advancedAI) {
        throw new Error("Advanced AI features are disabled.");
      }
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { aspectRatio: "1:1", imageSize: size }
        }
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    };

    return this.executeWithFallback("generateProImage", cloudFn, localFn, fallbackValue);
  }

  public async generateVeoVideo(prompt: string, imageBytes?: string, mimeType?: string): Promise<string | null> {
    const fallbackValue = null;

    const localFn = async () => {
      // Local LLMs cannot generate video.
      logger.warn("Local LLM cannot generate video. Falling back to cloud or returning null.");
      throw new Error("Local video generation not supported.");
    };

    const cloudFn = async () => {
      if (!this.features.advancedAI) {
        throw new Error("Advanced AI features are disabled.");
      }

      const payload: Record<string, any> = {
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '16:9' }
      };
      if (imageBytes && mimeType) {
        payload.image = { imageBytes, mimeType };
      }

      let operation = await this.ai.models.generateVideos(payload as any);
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await this.ai.operations.getVideosOperation({ operation });
      }
      
      const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) return null;
      
      return uri;
    };

    return this.executeWithFallback("generateVeoVideo", cloudFn, localFn, fallbackValue);
  }

  public async analyzeClinicalImage(imageBytes: string, mimeType: string, prompt: string): Promise<string> {
    const fallbackValue = "Image analysis failed due to connectivity issues. Please try again later.";

    const localFn = async () => {
      // Local LLM might not support multimodal input depending on the model loaded.
      // For now, we assume it doesn't or we pass a simplified prompt if it does.
      // WebLLM support for images is experimental/model-dependent.
      logger.warn("Local LLM image analysis is experimental. Attempting...");
      // If the local model doesn't support images, this will likely fail or ignore the image.
      // We'll pass a descriptive prompt and hope for the best, or just throw to force cloud.
      throw new Error("Local multimodal analysis not fully supported yet.");
    };

    const cloudFn = async () => {
      const model = this.features.advancedAI ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
      const response = await this.ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { data: imageBytes, mimeType } },
            { text: prompt }
          ]
        }
      });
      return response.text || "Analysis failed.";
    };

    return this.executeWithFallback("analyzeClinicalImage", cloudFn, localFn, fallbackValue);
  }

  public async deepClinicalAnalysis(prompt: string): Promise<string> {
    const fallbackValue = "Deep clinical analysis failed due to connectivity issues. Please try again later.";

    const localFn = async () => {
      const systemPrompt = "You are an expert clinical AI. Perform a deep, thorough analysis of the provided information.";
      return localAIService.generateContent(prompt, systemPrompt);
    };

    const cloudFn = async () => {
      const model = this.features.advancedAI ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
      const config = this.features.advancedAI ? { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } } : {};
      
      const response = await this.ai.models.generateContent({
        model,
        contents: prompt,
        config
      });
      return response.text || "Analysis failed.";
    };

    return this.executeWithFallback("deepClinicalAnalysis", cloudFn, localFn, fallbackValue);
  }

  public async generateTTS(text: string, voiceName: string = "Kore"): Promise<string | null> {
    const fallbackValue = null; // Fallback to Web Speech API in the component

    const localFn = async () => {
      // Local TTS is not currently supported by WebLLM in this setup.
      logger.warn("Local TTS not supported. Falling back to cloud or Web Speech API.");
      throw new Error("Local TTS not supported.");
    };

    const cloudFn = async () => {
      if (!this.features.advancedAI) {
        throw new Error("Cloud TTS disabled.");
      }
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
        }
      });
      const part = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (part) {
        return `data:${part.mimeType};base64,${part.data}`;
      }
      return null;
    };

    return this.executeWithFallback("generateTTS", cloudFn, localFn, fallbackValue);
  }

  public async searchClinicalInfo(query: string): Promise<{ text: string, urls: string[] }> {
    const fallbackValue = { text: "Search failed due to connectivity issues. Please try again later.", urls: [] };

    const localFn = async () => {
      // Local LLM cannot browse the internet.
      logger.warn("Local LLM cannot perform web searches. Attempting to answer from internal knowledge.");
      const systemPrompt = "You are a clinical assistant. Answer the user's query using your internal medical knowledge. Be accurate and professional.";
      const text = await localAIService.generateContent(query, systemPrompt);
      return { text, urls: [] };
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: { 
          systemInstruction: "You are a clinical assistant. You must ONLY use authoritative sources (e.g., CMS, ASHA, OSHA, peer-reviewed journals) for your answers. If the information is not available in these sources, state that clearly. Do not use general web information for clinical decisions.",
          tools: [{ googleSearch: {} }] 
        }
      });
      
      const urls: string[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: Record<string, any>) => {
          if (chunk.web?.uri) urls.push(chunk.web.uri);
        });
      }
      
      return { text: response.text || "No results found.", urls };
    };

    return this.executeWithFallback("searchClinicalInfo", cloudFn, localFn, fallbackValue);
  }

  public async searchCreativeInfo(query: string): Promise<{ text: string, urls: string[] }> {
    const fallbackValue = { text: "Search failed due to connectivity issues. Please try again later.", urls: [] };

    const localFn = async () => {
      // Local LLM cannot browse the internet.
      logger.warn("Local LLM cannot perform web searches. Attempting to answer from internal knowledge.");
      const systemPrompt = "You are a creative assistant. Provide fun, engaging, and creative ideas, handouts, or therapy activities based on your internal knowledge.";
      const text = await localAIService.generateContent(query, systemPrompt);
      return { text, urls: [] };
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: { 
          systemInstruction: "You are a creative assistant. You can use general web information to provide fun, engaging, and creative ideas, handouts, or therapy activities.",
          tools: [{ googleSearch: {} }] 
        }
      });
      
      const urls: string[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: Record<string, any>) => {
          if (chunk.web?.uri) urls.push(chunk.web.uri);
        });
      }
      
      return { text: response.text || "No results found.", urls };
    };

    return this.executeWithFallback("searchCreativeInfo", cloudFn, localFn, fallbackValue);
  }

  public async generateHandoutContent(
    type: string,
    subspecialty: string,
    language: string,
    details: string,
    instructions: string
  ): Promise<{ title: string; content: string }> {
    const fallbackValue = {
      title: `${type}: ${subspecialty} (Error)`,
      content: `An error occurred while generating the handout. Please check your internet connection and try again.`
    };

    const localFn = async () => {
      const systemPrompt = `You are an expert SLP creating a handout.
      Create a professional, highly clinical yet accessible ${type} for the subspecialty of ${subspecialty}. 
      Language: ${language}.
      Additional details/focus: ${details}
      ${instructions}
      
      Format the response as a JSON object with "title" and "content" (using markdown for the content) keys.
      Ensure the JSON is valid.`;

      const responseText = await localAIService.generateContent("Generate handout.", systemPrompt);
      try {
        // Attempt to parse JSON from local LLM
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return parseAIResponse(jsonMatch[0]);
        }
        // Fallback if not valid JSON
        return {
          title: `${type}: ${subspecialty} (Local Draft)`,
          content: responseText
        };
      } catch (e) {
        logger.warn("Failed to parse JSON from local LLM for handout, returning raw text.", e);
        return {
          title: `${type}: ${subspecialty} (Local Draft)`,
          content: responseText
        };
      }
    };

    const cloudFn = async () => {
      if (!this.features.advancedAI) {
          throw new Error("Advanced AI features are disabled.");
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a professional, highly clinical yet accessible ${type} for the subspecialty of ${subspecialty}. 
        Language: ${language}.
        Additional details/focus: ${details}
        
        ${instructions}
        
        The handout should be formatted for a medical setting.
        Include:
        1. A clear, professional title.
        2. Clinical Rationale (The "Why" - simplified for patients/family if applicable).
        3. Core Content (Steps, Strategies, or Information).
        4. Important Safety Information/Precautions.
        5. Practical Tips for Success.
        6. A standard medical disclaimer (Educational purposes only).
        7. References/Citations: Include 2-3 authoritative sources (e.g., ASHA, Mayo Clinic, NIH) at the bottom.
        
        IMPORTANT: 
        - The entire content must be in ${language}.
        - Do NOT use literal '\\N' characters for newlines. Use standard markdown formatting (e.g., double newlines for paragraphs, bullet points).
        - Ensure the tone is empathetic but authoritative.
        - Cite sources where appropriate using brackets [1].
        
        Format the response as a JSON object with "title" and "content" (using markdown for the content) keys.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
              },
              required: ["title", "content"]
          }
        }
      });

      return parseAIResponse(response.text, {});
    };

    return this.executeWithFallback("generateHandoutContent", cloudFn, localFn, fallbackValue);
  }
  public async analyzeDocument(base64Data: string, mimeType: string, prompt: string, config?: Record<string, any>): Promise<string> {
    const fallbackValue = "No analysis generated.";

    const localFn = async () => {
      logger.warn("Local LLM document analysis is experimental. Attempting...");
      throw new Error("Local multimodal analysis not fully supported yet.");
    };

    const cloudFn = async () => {
      const response = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            },
            {
              text: prompt
            }
          ]
        },
        config: config
      });
      return response.text || "No analysis generated.";
    };

    return this.executeWithFallback("analyzeDocument", cloudFn, localFn, fallbackValue);
  }
}

export const aiService = new AIService();
