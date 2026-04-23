import { describe, it, expect, vi, beforeEach } from "vitest";
import { aiService } from "../../services/ai-service";
import { localAIService } from "../../services/local-ai-service";

// Mock dependencies
vi.mock("../../services/local-ai-service", () => ({
  localAIService: {
    isModelLoaded: vi.fn(),
    generateContent: vi.fn(),
  },
}));

// Mock GoogleGenAI
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({ text: "Cloud response" }),
    };
  },
}));

describe("AIService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set dummy API key
    process.env["GEMINI_API_KEY"] = "test-key-123";
  });

  it("should use local AI when enabled and loaded", async () => {
    aiService.updateConfig({ localLLM: true });
    (localAIService.isModelLoaded as any).mockReturnValue(true);
    (localAIService.generateContent as any).mockResolvedValue("local response");

    const result = await aiService.generateContent("prompt");

    expect(result).toBe("local response");
    expect(localAIService.generateContent).toHaveBeenCalled();
  });

  it("should fall back to cloud when local AI fails", async () => {
    aiService.updateConfig({ localLLM: true, googleCloud: true });
    (localAIService.isModelLoaded as any).mockReturnValue(true);
    (localAIService.generateContent as any).mockRejectedValue(
      new Error("local error"),
    );

    const result = await aiService.generateContent("prompt");

    expect(result).toBe("Cloud response");
  });
});
