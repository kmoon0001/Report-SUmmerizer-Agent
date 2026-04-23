import { describe, it, expect, vi, beforeEach } from "vitest";
import { aiService } from "../../services/ai-service";
import { localAIService } from "../../services/local-ai-service";
import { GoogleGenAI } from "@google/genai";

// Mock the GoogleGenAI module
vi.mock("@google/genai", () => {
  const mockGenerateContent = vi.fn();
  const mockGenerateContentStream = vi.fn();

  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent,
        generateContentStream: mockGenerateContentStream,
      };
    },
    Type: {
      OBJECT: "OBJECT",
      STRING: "STRING",
      ARRAY: "ARRAY",
      BOOLEAN: "BOOLEAN",
      NUMBER: "NUMBER",
    },
  };
});

// Mock the local AI service
vi.mock("../../services/local-ai-service", () => ({
  localAIService: {
    isModelLoaded: vi.fn(),
    generateContent: vi.fn(),
    generateContentStream: vi.fn(),
  },
}));

// Mock logger
vi.mock("../../utils/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

describe("AIService Fallback Logic", () => {
  let mockGenerateContent: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset features to default
    aiService.updateConfig({
      advancedAI: true,
      googleCloud: true,
      microsoftCopilot: false,
      localLLM: true,
    });

    // Get the mock function from the instantiated class
    const ai = new GoogleGenAI({ apiKey: "test" });
    mockGenerateContent = ai.models.generateContent;
  });

  it("should use Cloud AI when available and successful", async () => {
    const mockCloudResponse = {
      text: JSON.stringify({
        text: "Cloud response",
        reasoning: "Cloud reasoning",
      }),
    };

    // Setup mock for GoogleGenAI instance
    mockGenerateContent.mockResolvedValue(mockCloudResponse);

    const response = await aiService.generateClinicalResponse(
      "Test prompt",
      "Test context",
      [],
      "Dysphagia",
    );

    expect(mockGenerateContent).toHaveBeenCalled();
    expect(response.text).toBe("Cloud response");
    expect(localAIService.generateContent).not.toHaveBeenCalled();
  });

  it("should use Cloud AI when Local AI fails", async () => {
    // Setup Local AI to fail
    vi.mocked(localAIService.isModelLoaded).mockReturnValue(true);
    global.fetch = vi.fn().mockRejectedValue(new Error("Local API Error"));

    // Setup Cloud AI to succeed
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({
        text: "Cloud response",
        reasoning: "Cloud reasoning",
      }),
    });

    const response = await aiService.generateClinicalResponse(
      "Test prompt",
      "Test context",
      [],
      "Dysphagia",
    );

    expect(global.fetch).toHaveBeenCalled();
    expect(mockGenerateContent).toHaveBeenCalled();
    expect(response.text).toBe("Cloud response");
  });

  it("should return graceful error when both Local and Cloud AI fail", async () => {
    // Setup Local AI to fail
    vi.mocked(localAIService.isModelLoaded).mockReturnValue(true);
    global.fetch = vi.fn().mockRejectedValue(new Error("Local API Error"));

    // Setup Cloud AI to fail
    mockGenerateContent.mockRejectedValue(new Error("Cloud API Error"));

    const response = await aiService.generateClinicalResponse(
      "Test prompt",
      "Test context",
      [],
      "Dysphagia",
    );

    expect(global.fetch).toHaveBeenCalled();
    expect(mockGenerateContent).toHaveBeenCalled();
    expect(response.text).toContain("connectivity issues");
  });
});
