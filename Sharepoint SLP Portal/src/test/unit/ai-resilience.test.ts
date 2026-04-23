import { describe, it, expect, vi, beforeEach } from "vitest";
import { AIService } from "../../services/ai/index";
import { localAIService } from "../../services/local-ai-service";
import { APP_CONFIG } from "../../config/env";

// Mock localAIService
vi.mock("../../services/local-ai-service", () => ({
  localAIService: {
    isModelLoaded: vi.fn(() => true),
    isPlaceholder: vi.fn(() => false),
    generateContent: vi.fn(),
  },
}));

describe("AI Resilience Benchmarks", () => {
  let aiService: AIService;

  beforeEach(() => {
    vi.clearAllMocks();
    aiService = new AIService();
    // Enable features
    aiService.updateConfig({
      localLLM: true,
      googleCloud: true,
      browserAI: false,
    });

    // Default mock for fetch (RAG)
    global.fetch = vi.fn();
  });

  describe("Tier 1: Local RAG Resilience", () => {
    it("should fallback to WebGPU if RAG backend is slow (Timeout)", async () => {
      // Mock fetch to hang (never resolve)
      (global.fetch as any).mockImplementation(() => new Promise(() => {}));

      // Mock local WebGPU to respond
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify({
          text: "Response from WebGPU",
          reasoning: "RAG was slow",
        }),
      );

      // Expectation: RAG should timeout after 5s and fallback to WebGPU
      const startTime = Date.now();
      const response =
        await aiService.generateClinicalResponse("testing timeout");
      const duration = Date.now() - startTime;

      expect(response.text).toBe("Response from WebGPU");
      // The implementation must have a timeout!
      expect(duration).toBeLessThan(10000);
    }, 15000);

    it("should fallback to WebGPU if RAG backend fails (Error)", async () => {
      (global.fetch as any).mockRejectedValue(new Error("Connection refused"));
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify({
          text: "Response from WebGPU",
        }),
      );

      const response =
        await aiService.generateClinicalResponse("testing error");
      expect(response.text).toBe("Response from WebGPU");
    });
  });

  describe("Tier 2: Local WebGPU Resilience", () => {
    it("should fallback to Cloud if WebGPU throws an error", async () => {
      (global.fetch as any).mockRejectedValue(new Error("No RAG"));
      (localAIService.generateContent as any).mockRejectedValue(
        new Error("CUDA Out of Memory"),
      );

      const mockGenerateContent = vi.fn().mockResolvedValue({
        text: () => JSON.stringify({ text: "Response from Cloud" }),
      });

      // Use spy to bypass readonly getter
      vi.spyOn(aiService as any, "ai", "get").mockReturnValue({
        models: { generateContent: mockGenerateContent },
      });

      const response = await aiService.generateClinicalResponse(
        "testing webgpu error",
      );
      expect(response.text).toBe("Response from Cloud");
      expect(mockGenerateContent).toHaveBeenCalled();
    });
  });

  describe("Cloud Tier Retry Logic", () => {
    it("should retry Cloud AI if it fails intermittently", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });

      const mockGenerateContent = vi
        .fn()
        .mockRejectedValueOnce(new Error("429 Too Many Requests"))
        .mockResolvedValue({
          text: () => JSON.stringify({ text: "Success after retry" }),
        });

      vi.spyOn(aiService as any, "ai", "get").mockReturnValue({
        models: { generateContent: mockGenerateContent },
      });

      const response =
        await aiService.generateClinicalResponse("testing retry");
      expect(response.text).toBe("Success after retry");
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });
  });
});
