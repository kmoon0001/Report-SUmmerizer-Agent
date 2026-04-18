import { parseAIResponse } from "../utils/json-parser";
import { CreateWebWorkerMLCEngine, InitProgressReport, WebWorkerMLCEngine } from "@mlc-ai/web-llm";
import { z } from "zod";
import { logger } from "../utils/logger";

// --- Zod Schemas ---
const CaseStudySchema = z.object({
  id: z.string(),
  title: z.string(),
  scenario: z.string(),
  clinicalQuestion: z.string(),
  correctAnswer: z.string(),
  explanation: z.string(),
});

const CaseStudyFeedbackSchema = z.object({
  isCorrect: z.boolean(),
  feedback: z.string(),
  learningPoints: z.array(z.string()),
});

const SMARTGoalsSchema = z.object({
  goals: z.array(z.object({
    text: z.string(),
    components: z.object({
      specific: z.string(),
      measurable: z.string(),
      achievable: z.string(),
      relevant: z.string(),
      timeBound: z.string(),
    }),
    rationale: z.string(),
  })),
});

const QualityCheckSchema = z.object({
  qualityScore: z.number(),
  qualityLevel: z.enum(["Needs Improvement", "Good", "Excellent"]),
  flaggedPhrases: z.array(z.object({
    phrase: z.string(),
    reason: z.string(),
    suggestion: z.string(),
  })),
  overallAssessment: z.string(),
});

const TherapyGameSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["matching", "sequencing", "naming"]),
  instructions: z.string(),
  items: z.array(z.object({
    id: z.string(),
    content: z.string(),
    type: z.enum(["text", "image"]),
    matchId: z.string().optional(),
  })),
});

export type LocalModelType = 
  | "Phi-3-mini-4k-instruct-q4f16_1-MLC" // Heavy: Clinical Reasoning, Documentation
  | "Llama-3.2-1B-Instruct-q4f16_1-MLC"; // Light: Chat, Summarization, UI tasks

interface NavigatorGPU {
  gpu?: {
    requestAdapter: () => Promise<any>;
  };
}

export class LocalAIService {
  private engine: WebWorkerMLCEngine | null = null;
  private currentModel: LocalModelType | null = null;
  private worker: Worker | null = null;

  constructor() {
    // Ensure cleanup on page refresh/close
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.unloadModel();
      });
    }
  }

  /**
   * Checks if the user's browser supports WebGPU, which is required for local LLMs.
   */
  public async checkWebGPUSupport(): Promise<boolean> {
    const nav = navigator as NavigatorGPU;
    if (!nav.gpu) {
      return false;
    }
    try {
      const adapter = await nav.gpu.requestAdapter();
      return !!adapter;
    } catch (e) {
      return false;
    }
  }

  /**
   * Loads a specific model into the Web Worker. 
   * If another model is already loaded, it unloads it first to save VRAM.
   */
  public async loadModel(
    model: LocalModelType, 
    onProgress: (report: InitProgressReport) => void
  ): Promise<void> {
    if (this.currentModel === model && this.engine) {
      return; // Already loaded
    }

    // Unload existing model to prevent VRAM overflow (User requirement: "don't give up the system")
    await this.unloadModel();

    const isSupported = await this.checkWebGPUSupport();
    if (!isSupported) {
      throw new Error("WebGPU is not supported on this device/browser. Local AI models cannot be loaded.");
    }

    try {
      // Initialize the Web Worker
      this.worker = new Worker(new URL('../workers/web-llm.worker.ts', import.meta.url), { type: 'module' });
      
      // Create the engine and download/load the model weights via IndexedDB caching
      this.engine = await CreateWebWorkerMLCEngine(this.worker, model, {
        initProgressCallback: onProgress,
      });
      
      this.currentModel = model;
    } catch (error) {
      logger.error("Failed to load local model:", error);
      this.unloadModel();
      throw error;
    }
  }

  /**
   * Unloads the current model and terminates the worker, freeing up CPU/GPU resources.
   * Crucial for preventing system crashes on lower-end hardware.
   */
  public async unloadModel(): Promise<void> {
    if (this.engine) {
      try {
        await this.engine.unload();
      } catch (e) {
        logger.warn("Error unloading engine:", e);
      }
      this.engine = null;
    }
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.currentModel = null;
  }

  /**
   * Clears the browser cache used by the local model engine.
   * This frees up significant disk space (GBs) taken by model weights.
   */
  public async clearCache(): Promise<void> {
    if (this.engine) {
      await this.unloadModel();
    }
    
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        for (const key of keys) {
          if (key.includes('webllm')) {
            await caches.delete(key);
            logger.info(`Deleted cache: ${key}`);
          }
        }
      } catch (e) {
        logger.error("Failed to clear cache:", e);
      }
    }
  }

  public isModelLoaded(model?: LocalModelType): boolean {
    if (model) return this.currentModel === model;
    return this.engine !== null;
  }

  public getLoadedModel(): LocalModelType | null {
    return this.currentModel;
  }

  /**
   * Generates a complete text response using the currently loaded local model.
   */
  public async generateContent(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.engine) {
      throw new Error("No local model is currently loaded. Please load a model first.");
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system" as const, content: systemPrompt });
    }
    messages.push({ role: "user" as const, content: prompt });

    const reply = await this.engine.chat.completions.create({
      messages,
      temperature: 0.2, // Lower temperature for more clinical/deterministic output
    });

    return reply.choices[0].message.content || "";
  }

  public async generateCaseStudy(topic: string): Promise<any> {
    if (!this.engine) {
      throw new Error("No local model is currently loaded. Please load a model first.");
    }

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
      
    const reply = await this.engine.chat.completions.create({
      messages: [{ role: "user" as const, content: prompt }],
      temperature: 0.2,
    });
    
    const jsonStr = reply.choices[0].message.content?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
    return CaseStudySchema.parse(parseAIResponse(jsonStr));
  }

  public async analyzeQualityCheck(note: string): Promise<any> {
    if (!this.engine) {
      throw new Error("No local model is currently loaded. Please load a model first.");
    }

    const prompt = `Analyze this clinical note quality.
      Note: ${note}
      
      Strictly output ONLY valid JSON matching this structure:
      {
        "qualityScore": 0-100,
        "qualityLevel": "Needs Improvement" | "Good" | "Excellent",
        "flaggedPhrases": [{"phrase": "...", "reason": "...", "suggestion": "..."}],
        "overallAssessment": "..."
      }`;
      
    const reply = await this.engine.chat.completions.create({
      messages: [{ role: "user" as const, content: prompt }],
      temperature: 0.2,
    });
    
    const jsonStr = reply.choices[0].message.content?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
    return QualityCheckSchema.parse(parseAIResponse(jsonStr));
  }

  public async generateTherapyGame(topic: string, type: 'matching' | 'sequencing' | 'naming', difficulty: string): Promise<any> {
    if (!this.engine) {
      throw new Error("No local model is currently loaded. Please load a model first.");
    }

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
      
    const reply = await this.engine.chat.completions.create({
      messages: [{ role: "user" as const, content: prompt }],
      temperature: 0.2,
    });
    
    const jsonStr = reply.choices[0].message.content?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
    return TherapyGameSchema.parse(parseAIResponse(jsonStr));
  }

  public async evaluateCaseStudyResponse(scenario: string, userResponse: string): Promise<any> {
    if (!this.engine) {
      throw new Error("No local model is currently loaded. Please load a model first.");
    }

    const prompt = `Evaluate this clinical response.
      Scenario: ${scenario}
      User Response: ${userResponse}
      
      Strictly output ONLY valid JSON matching this structure:
      {
        "isCorrect": true/false,
        "feedback": "Detailed feedback...",
        "learningPoints": ["Point 1", "Point 2"]
      }`;
      
    const reply = await this.engine.chat.completions.create({
      messages: [{ role: "user" as const, content: prompt }],
      temperature: 0.2,
    });
    
    const jsonStr = reply.choices[0].message.content?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
    return CaseStudyFeedbackSchema.parse(parseAIResponse(jsonStr));
  }

  public async generateSMARTGoals(domain: string, level: string, task: string): Promise<any> {
    if (!this.engine) {
      throw new Error("No local model is currently loaded. Please load a model first.");
    }

    const prompt = `You are a clinical SLP assistant. Generate 3 SMART goals for:
      Domain: ${domain}
      Level: ${level}
      Task: ${task}
      
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
      
    const reply = await this.engine.chat.completions.create({
      messages: [{ role: "user" as const, content: prompt }],
      temperature: 0.2,
    });
    
    const jsonStr = reply.choices[0].message.content?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
    return SMARTGoalsSchema.parse(parseAIResponse(jsonStr));
  }

  public async generateDocumentation(sessionData: any): Promise<string> {
    if (!this.engine) {
      return `[MOCK GENERATED NOTE - Local AI not loaded]\nPatient completed ${sessionData.gameType} task with ${sessionData.accuracy}% accuracy over ${sessionData.duration} seconds. Cues provided: ${sessionData.cues}. Patient demonstrated good engagement and tolerated the activity well.`;
    }

    const prompt = `
      You are an expert Speech-Language Pathologist. 
      Generate a Medicare-compliant SOAP note for the following session data:
      Task: ${sessionData.gameType}
      Accuracy: ${sessionData.accuracy}%
      Duration: ${sessionData.duration} seconds
      Cues: ${sessionData.cues}
      Notes: ${sessionData.notes || 'None'}
      
      Ensure the note highlights the skilled need and clinical rationale.
    `;

    const reply = await this.engine.chat.completions.create({
      messages: [{ role: "user" as const, content: prompt }],
      temperature: 0.7,
    });

    return reply.choices[0].message.content || "Failed to generate documentation.";
  }

  // --- Speech Analysis (transformers.js) ---
  private asrPipeline: any = null;

  public async loadSpeechModel(onProgress?: (progress: string) => void): Promise<void> {
    if (this.asrPipeline) return;
    try {
      if (onProgress) onProgress("Loading speech model...");
      // Dynamic import to avoid SSR issues if any, and only load when needed
      const { pipeline, env } = await import('@xenova/transformers');
      env.allowLocalModels = false;
      env.useBrowserCache = true;
      this.asrPipeline = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
      if (onProgress) onProgress("Speech model loaded.");
    } catch (error) {
      logger.error("Failed to initialize ASR:", error);
      throw error;
    }
  }

  public async analyzeSpeech(audioBlob: Blob): Promise<{ text: string, clarityScore: number }> {
    if (!this.asrPipeline) {
      return { text: "Speech analysis model not loaded.", clarityScore: 0 };
    }

    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const audioData = audioBuffer.getChannelData(0); // Mono

      const result = await this.asrPipeline(audioData);
      
      // Simple clarity heuristic based on length/content for now
      const clarityScore = Math.min(100, Math.max(0, 50 + (result.text.length * 2)));

      return {
        text: result.text,
        clarityScore
      };
    } catch (error) {
      logger.error("Speech analysis failed:", error);
      return { text: "Error analyzing speech.", clarityScore: 0 };
    }
  }

  /**
   * Streams the text response word-by-word for a responsive UI.
   */
  public async *generateContentStream(prompt: string, systemPrompt?: string): AsyncGenerator<string, void, unknown> {
    if (!this.engine) {
      throw new Error("No local model is currently loaded. Please load a model first.");
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system" as const, content: systemPrompt });
    }
    messages.push({ role: "user" as const, content: prompt });

    const stream = await this.engine.chat.completions.create({
      messages,
      temperature: 0.2,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}

export const localAIService = new LocalAIService();
