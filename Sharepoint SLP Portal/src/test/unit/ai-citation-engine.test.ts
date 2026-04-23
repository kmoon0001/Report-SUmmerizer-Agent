import { describe, it, expect, vi, beforeEach } from "vitest";
import { AIService } from "../../services/ai";
import { localAIService } from "../../services/local-ai-service";
import { APP_CONFIG } from "../../config/env";

// Mock localAIService
vi.mock("../../services/local-ai-service", () => ({
  localAIService: {
    generateContent: vi.fn(),
    isModelLoaded: vi.fn().mockReturnValue(true),
    isPlaceholder: vi.fn().mockReturnValue(false),
  },
}));

// Mock fetch for RAG
global.fetch = vi.fn();

describe("AI Citation Engine Verification", () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService();
    aiService.updateConfig({ localLLM: true, cloudLLM: true });
    vi.clearAllMocks();
  });

  describe("Local RAG Citations", () => {
    it("should correctly map citations from local RAG backend", async () => {
      const mockRagResponse = {
        text: "According to Medicare guidelines, therapy must be skilled.",
        citations: [
          {
            id: "cite-1",
            source: "Medicare Benefit Policy Manual",
            text: "Chapter 15, Section 220",
            relevance: 0.95,
          },
        ],
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockRagResponse,
      });

      const response = await aiService.generateClinicalResponse(
        "What are the skill requirements?",
      );

      expect(response.citations).toBeDefined();
      expect(response.citations!.length).toBe(1);
      expect(response.citations![0]!.source).toBe(
        "Medicare Benefit Policy Manual",
      );
      expect(response.citations![0]!.relevance).toBe(0.95);
      expect(response.reasoning).toContain("local clinical RAG");
    });

    it("should handle RAG response with missing citation fields gracefully", async () => {
      const mockRagResponse = {
        text: "Response",
        citations: [
          { text: "Incomplete citation" }, // Missing ID, source, relevance
        ],
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockRagResponse,
      });

      const response = await aiService.generateClinicalResponse("test");

      expect(response.citations![0]!.id).toBe("rag-0");
      expect(response.citations![0]!.source).toBe("Local Knowledge");
      expect(response.citations![0]!.relevance).toBe(1.0);
    });
  });

  describe("Cloud/Local LLM JSON Citations", () => {
    it("should parse citations from a JSON-formatted LLM response", async () => {
      // Bypass RAG fetch to test LLM parsing
      (fetch as any).mockResolvedValue({ ok: false });

      const mockLLMResponse = JSON.stringify({
        text: "The patient showing signs of expressive aphasia should receive naming therapy.",
        reasoning: "Based on clinical patterns.",
        citations: [
          {
            id: "cite-llm-1",
            source: "ASHA Portal",
            text: "Aphasia Treatment Guidelines",
            confidence: 0.9,
            relevance: "High",
          },
        ],
        suggestedActions: ["Naming tasks", "Semantic feature analysis"],
      });

      (localAIService.generateContent as any).mockResolvedValue(
        mockLLMResponse,
      );

      const response = await aiService.generateClinicalResponse(
        "How to treat aphasia?",
      );

      expect(response.citations!.length).toBe(1);
      expect(response.citations![0]!.source).toBe("ASHA Portal");
      expect(response.citations![0]!.confidence).toBe(0.9);
      expect(response.citations![0]!.relevance).toBe("High");
      expect(response.suggestedActions).toContain("Naming tasks");
    });

    it("should fall back to raw text if JSON parsing fails but still preserve formatting", async () => {
      (fetch as any).mockResolvedValue({ ok: false });
      (localAIService.generateContent as any).mockResolvedValue(
        "Raw text without JSON",
      );

      const response = await aiService.generateClinicalResponse("test");
      expect(response.text).toBe("Raw text without JSON");
      expect(response.citations).toEqual([]);
    });
  });

  describe("Search Service Integration", () => {
    it("should generate clinical response with search-derived citations", async () => {
      // This tests the higher-level orchestration
      const mockSearchRes = {
        text: "Found clinical evidence for dysphagia.",
        citations: [
          {
            id: "s1",
            source: "PubMed",
            text: "Study on thickening agents",
            relevance: "0.8",
          },
        ],
      };

      (fetch as any).mockResolvedValue({ ok: false });
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockSearchRes),
      );

      const response =
        await aiService.generateClinicalResponse("Dysphagia evidence");
      expect(response.citations![0]!.source).toBe("PubMed");
    });
  });
});
