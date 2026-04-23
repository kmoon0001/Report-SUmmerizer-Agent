import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { aiService } from "../../services/ai-service";
import { localAIService } from "../../services/local-ai-service";

// Mock dependencies
vi.mock("../../services/local-ai-service", () => ({
  localAIService: {
    isModelLoaded: vi.fn(),
    generateContent: vi.fn(),
    generateContentStream: vi.fn(),
  },
}));

const {
  mockGenerateContent,
  mockGenerateContentStream,
  mockGenerateVideos,
  mockGetVideosOperation,
} = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
  mockGenerateContentStream: vi.fn(),
  mockGenerateVideos: vi.fn(),
  mockGetVideosOperation: vi.fn(),
}));

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent,
        generateContentStream: mockGenerateContentStream,
        generateVideos: mockGenerateVideos,
      };
      operations = {
        getVideosOperation: mockGetVideosOperation,
      };
    },
    Type: {
      STRING: "STRING",
      OBJECT: "OBJECT",
      ARRAY: "ARRAY",
      NUMBER: "NUMBER",
      BOOLEAN: "BOOLEAN",
    },
    ThinkingLevel: { HIGH: "HIGH", LOW: "LOW" },
    Modality: { AUDIO: "AUDIO" },
  };
});

// Set dummy API key
process.env["API_KEY"] = "test-key";

describe("AIService Clinical Methods", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env["API_KEY"] = "test-key";
    aiService.updateConfig({
      advancedAI: true,
      googleCloud: true,
      microsoftCopilot: false,
      localLLM: false,
    });
    // Reset circuit breakers to prevent test interference
    (aiService as any).circuitBreakers?.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("generateClinicalResponse", () => {
    it("should generate a clinical response from cloud", async () => {
      const mockResponse = {
        text: JSON.stringify({
          text: "Test response",
          reasoning: "Test reasoning",
          citations: [{ source: "Test Source", relevance: "Test relevance" }],
          suggestedActions: ["Action 1"],
        }),
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await aiService.generateClinicalResponse(
        "prompt",
        "context",
        [],
      );

      expect(result.text).toBe("Test response");
      expect(result.reasoning).toBe("Test reasoning");
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it("should return fallback on cloud failure", async () => {
      mockGenerateContent.mockRejectedValue(new Error("Cloud failed"));

      const result = await aiService.generateClinicalResponse(
        "prompt",
        "context",
        [],
      );

      expect(result.text).toContain("connectivity issues");
    });
  });

  describe("generateCaseStudy", () => {
    it("should generate a case study from cloud", async () => {
      const mockCase = {
        id: "case-1",
        title: "Test Case",
        scenario: "Test scenario",
        clinicalQuestion: "Test question",
        correctAnswer: "Test answer",
        explanation: "Test explanation",
      };
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(mockCase) });

      const result = await aiService.generateCaseStudy("dysphagia");

      expect(result.title).toBe("Test Case");
      expect(result.id).toBe("case-1");
    });
  });

  describe("evaluateCaseStudyResponse", () => {
    it("should evaluate a case study response from cloud", async () => {
      const mockFeedback = {
        isCorrect: true,
        feedback: "Good job",
        learningPoints: ["Point 1"],
      };
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(mockFeedback),
      });

      const result = await aiService.evaluateCaseStudyResponse(
        "scenario",
        "user response",
      );

      expect(result.isCorrect).toBe(true);
      expect(result.feedback).toBe("Good job");
    });
  });

  describe("generateSMARTGoals", () => {
    it("should generate SMART goals from cloud", async () => {
      const mockGoals = {
        goals: [
          {
            text: "Patient will ambulate 150 feet independently with appropriate assistive device within 4 weeks",
            components: {
              specific: "Ambulate 150 feet independently",
              measurable: "150 feet distance measurement",
              achievable: "Based on current 50 foot tolerance",
              relevant: "Required for community mobility",
              timeBound: "4 weeks from evaluation",
            },
            rationale: "Improves functional mobility for community access",
          },
        ],
      };
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(mockGoals),
      });

      const result = await aiService.generateSMARTGoals(
        "orthopedic",
        "minimal-assist",
        "ambulation",
        "TUG 18s",
      );

      const goalsCount = result.goals?.length || 0;
      expect(goalsCount).toBeGreaterThanOrEqual(1);
      const firstGoalLength = result.goals?.[0]?.text?.length || 0;
      expect(firstGoalLength).toBeGreaterThanOrEqual(20);
    });
  });

  describe("analyzeQualityCheck", () => {
    it("should analyze clinical note quality from cloud", async () => {
      const mockAnalysis = {
        qualityScore: 85,
        qualityLevel: "Good",
        flaggedPhrases: [
          { phrase: "vague", reason: "too vague", suggestion: "be specific" },
        ],
        overallAssessment: "Good note",
      };
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(mockAnalysis),
      });

      const result = await aiService.analyzeQualityCheck("test note");

      expect(result.qualityScore).toBe(85);
      expect(result.qualityLevel).toBe("Good");
    });
  });

  describe("generateTherapyGame", () => {
    it("should generate a therapy game from cloud", async () => {
      const mockGame = {
        id: "game-1",
        title: "Matching Game",
        type: "matching",
        instructions: "Match items",
        items: [{ id: "1", content: "Item 1", type: "text", matchId: "a" }],
      };
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(mockGame) });

      const result = await aiService.generateTherapyGame("topic", "matching");

      expect(result.title).toBe("Matching Game");
      expect(result.type).toBe("matching");
    });
  });

  describe("generateAACBoard", () => {
    it("should generate an AAC board from cloud", async () => {
      const mockBoard = [
        { text: "Help", type: "social" },
        { text: "Water", type: "noun" },
      ];
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(mockBoard),
      });

      const result = await aiService.generateAACBoard("daily living", 2);

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe("Help");
    });
  });

  describe("chatWithPersona", () => {
    it("should chat with a persona from cloud", async () => {
      aiService.updateConfig({ googleCloud: true });
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify({ text: "Persona response", feedback: "Good" }),
      });

      const result = await aiService.chatWithPersona("Patient", [], "hello");
      expect(result.text).toBe("Persona response");
      expect(result.feedback).toBe("Good");
    });

    it("should handle chatWithPersona with history", async () => {
      aiService.updateConfig({ googleCloud: true });
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify({ text: "Response", feedback: "Good" }),
      });

      const history: { role: "user" | "model"; text: string }[] = [
        { role: "user", text: "hello" },
        { role: "model", text: "hi" },
      ];
      const result = await aiService.chatWithPersona(
        "Patient",
        history,
        "hello again",
      );

      expect(result.text).toBe("Response");
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: expect.stringContaining("user: hello"),
        }),
      );
    });
  });

  describe("analyzeClinicalExam", () => {
    it("should analyze a clinical exam from cloud", async () => {
      mockGenerateContent.mockResolvedValue({ text: "Analysis results" });

      const result = await aiService.analyzeClinicalExam("MSE", {
        findings: "normal",
      });

      expect(result).toBe("Analysis results");
    });

    it("should analyze an OME exam with specific prompt guidance", async () => {
      mockGenerateContent.mockResolvedValue({ text: "OME Analysis" });
      const result = await aiService.analyzeClinicalExam("Oral Mech Exam", {
        tongue: "normal",
      });
      expect(result).toBe("OME Analysis");
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: expect.stringContaining("Structural integrity"),
        }),
      );
    });

    it("should analyze a dysphagia exam with specific prompt guidance", async () => {
      mockGenerateContent.mockResolvedValue({ text: "Dysphagia Analysis" });
      const result = await aiService.analyzeClinicalExam(
        "Dysphagia Evaluation",
        { swallow: "delayed" },
      );
      expect(result).toBe("Dysphagia Analysis");
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: expect.stringContaining(
            "Oral, pharyngeal, and esophageal phases",
          ),
        }),
      );
    });

    it("should analyze an aphasia exam with specific prompt guidance", async () => {
      mockGenerateContent.mockResolvedValue({ text: "Aphasia Analysis" });
      const result = await aiService.analyzeClinicalExam("Aphasia Assessment", {
        naming: "impaired",
      });
      expect(result).toBe("Aphasia Analysis");
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: expect.stringContaining("Auditory comprehension"),
        }),
      );
    });
  });

  describe("chatWithDocument", () => {
    it("should chat with document from cloud", async () => {
      mockGenerateContent.mockResolvedValue({ text: "Answer from doc" });
      const result = await aiService.chatWithDocument("Doc text", "Question?");
      expect(result).toBe("Answer from doc");
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: expect.stringContaining("Doc text"),
        }),
      );
    });

    it("should use local AI for chatWithDocument", async () => {
      aiService.updateConfig({ localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      (localAIService.generateContent as any).mockResolvedValue("Local answer");

      mockGenerateContent.mockRejectedValue(new Error("Cloud failed"));

      const result = await aiService.chatWithDocument("Doc text", "Question?");
      expect(result).toBe("Local answer");
      expect(localAIService.generateContent).toHaveBeenCalledWith(
        expect.stringContaining("Doc text"),
        expect.anything()
      );
    });
  });

  describe("generateTherapyActivity", () => {
    it("should generate therapy activity from cloud", async () => {
      const mockActivity = {
        id: "act1",
        title: "Naming",
        type: "naming",
        instructions: "Name items",
        items: [],
      };
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(mockActivity),
      });

      const result = await aiService.generateTherapyActivity("naming animals");
      expect(result.id).toBe("act1");
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: expect.stringContaining("naming animals"),
        }),
      );
    });

    it("should use local AI for generateTherapyActivity", async () => {
      aiService.updateConfig({ localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      const mockActivity = {
        id: "local-act",
        title: "Local Naming",
        type: "naming",
        instructions: "Local instructions",
        items: [],
      };
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockActivity),
      );

      mockGenerateContent.mockRejectedValue(new Error("Cloud failed"));

      const result = await aiService.generateTherapyActivity("naming fruits");
      expect(result.id).toBe("local-act");
      expect(localAIService.generateContent).toHaveBeenCalledWith(
        expect.stringContaining("naming fruits"),
      );
    });
  });

  describe("generateClinicalDocumentation", () => {
    it("should generate clinical documentation from cloud", async () => {
      const mockDoc = {
        nextButtonGroups: [],
        noteFacts: { assessmentType: "Eval" },
        noteNarrative: { summary: "Summary" },
        validation: { missing: [] },
      };
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(mockDoc) });

      const result = await aiService.generateClinicalDocumentation({
        input: "data",
      });

      expect(result.noteFacts.assessmentType).toBe("Eval");
      expect(result.noteNarrative.summary).toBe("Summary");
    });
  });

  describe("generateHandoutContent", () => {
    it("should generate handout content from cloud", async () => {
      const mockHandout = {
        title: "Dysphagia Handout",
        content: "Markdown content",
      };
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(mockHandout),
      });

      const result = await aiService.generateHandoutContent(
        "Handout",
        "Dysphagia",
        "English",
        "details",
        "instructions",
      );

      expect(result.title).toBe("Dysphagia Handout");
      expect(result.content).toBe("Markdown content");
    });
  });

  describe("Advanced AI Features", () => {
    it("should generate pro image from cloud", async () => {
      mockGenerateContent.mockResolvedValue({
        candidates: [
          {
            content: {
              parts: [
                { inlineData: { mimeType: "image/png", data: "base64data" } },
              ],
            },
          },
        ],
      });

      const result = await aiService.generateProImage("prompt");
      expect(result).toBe("data:image/png;base64,base64data");
    });

    it("should generate veo video from cloud", async () => {
      mockGenerateVideos.mockResolvedValue({
        done: true,
        response: { generatedVideos: [{ video: { uri: "video-url" } }] },
      });

      const result = await aiService.generateVeoVideo("prompt");
      expect(result).toBe("video-url");
    });

    it("should analyze clinical image from cloud", async () => {
      mockGenerateContent.mockResolvedValue({ text: "Image analysis" });

      const result = await aiService.analyzeClinicalImage(
        "base64",
        "image/png",
        "prompt",
      );
      expect(result).toBe("Image analysis");
    });

    it("should perform deep clinical analysis from cloud", async () => {
      mockGenerateContent.mockResolvedValue({ text: "Deep analysis" });

      const result = await aiService.deepClinicalAnalysis("prompt");
      expect(result).toBe("Deep analysis");
    });

    it("should generate TTS from cloud", async () => {
      mockGenerateContent.mockResolvedValue({
        candidates: [
          {
            content: {
              parts: [
                { inlineData: { mimeType: "audio/mpeg", data: "audiodata" } },
              ],
            },
          },
        ],
      });

      const result = await aiService.generateTTS("text");
      expect(result).toBe("data:audio/mpeg;base64,audiodata");
    });

    it("should search clinical info from cloud", async () => {
      mockGenerateContent.mockResolvedValue({
        text: "Search result",
        candidates: [
          {
            groundingMetadata: {
              groundingChunks: [{ web: { uri: "https://source.com" } }],
            },
          },
        ],
      });

      const result = await aiService.searchClinicalInfo("query");
      expect(result.text).toBe("Search result");
      expect(result.urls).toContain("https://source.com");
    });

    it("should handle searchClinicalInfo with grounding chunks missing web uri", async () => {
      mockGenerateContent.mockResolvedValue({
        text: "Search result",
        candidates: [
          {
            groundingMetadata: {
              groundingChunks: [{ other: "data" }],
            },
          },
        ],
      });
      const result = await aiService.searchClinicalInfo("query");
      expect(result.urls).toHaveLength(0);
    });

    it("should search creative info from cloud", async () => {
      mockGenerateContent.mockResolvedValue({
        text: "Creative result",
        candidates: [
          {
            groundingMetadata: {
              groundingChunks: [{ web: { uri: "https://creative.com" } }],
            },
          },
        ],
      });

      const result = await aiService.searchCreativeInfo("query");
      expect(result.text).toBe("Creative result");
      expect(result.urls).toContain("https://creative.com");
    });

    it("should handle searchCreativeInfo with grounding chunks missing", async () => {
      mockGenerateContent.mockResolvedValue({
        text: "Creative result",
        candidates: [{}],
      });
      const result = await aiService.searchCreativeInfo("query");
      expect(result.urls).toHaveLength(0);
    });

    it("should analyze document from cloud", async () => {
      mockGenerateContent.mockResolvedValue({ text: "Document analysis" });

      const result = await aiService.analyzeDocument(
        "base64",
        "application/pdf",
        "prompt",
      );
      expect(result).toBe("Document analysis");
    });

    it("should handle analyzeDocument from cloud with no text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.analyzeDocument("data", "mime", "prompt");
      expect(result).toBe("No analysis generated.");
    });

    it("should handle deepClinicalAnalysis with advancedAI disabled", async () => {
      aiService.updateConfig({
        localLLM: false,
        googleCloud: true,
        advancedAI: false,
      });
      mockGenerateContent.mockResolvedValue({ text: "Basic analysis" });
      const result = await aiService.deepClinicalAnalysis("prompt");
      expect(result).toBe("Basic analysis");
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gemini-3-flash-preview",
        }),
      );
    });

    it("should handle deepClinicalAnalysis with advancedAI enabled", async () => {
      aiService.updateConfig({
        localLLM: false,
        googleCloud: true,
        advancedAI: true,
      });
      mockGenerateContent.mockResolvedValue({ text: "Deep analysis" });
      const result = await aiService.deepClinicalAnalysis("prompt");
      expect(result).toBe("Deep analysis");
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gemini-3.1-pro-preview",
        }),
      );
    });

    it("should handle analyzeClinicalImage with no text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.analyzeClinicalImage(
        "data",
        "mime",
        "prompt",
      );
      expect(result).toBe("Analysis failed.");
    });

    it("should handle get ai when key is falsy but localLLM is true", async () => {
      const oldApiKey = process.env["API_KEY"];
      const oldGeminiKey = process.env["GEMINI_API_KEY"];
      process.env["API_KEY"] = "";
      process.env["GEMINI_API_KEY"] = "";
      aiService.updateConfig({ localLLM: true, googleCloud: false });
      // Accessing ai getter should not throw
      const ai = (aiService as any).ai;
      expect(ai).toBeDefined();
      process.env["API_KEY"] = oldApiKey;
      process.env["GEMINI_API_KEY"] = oldGeminiKey;
    });

    it("should handle local AI failure with 403 status", async () => {
      aiService.updateConfig({ localLLM: true, googleCloud: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      const error = new Error("Auth failed");
      (error as any).status = 403;
      (localAIService.generateContent as any).mockRejectedValue(error);

      await expect(aiService.generateContent("prompt")).rejects.toThrow(
        "Auth failed",
      );
    });

    it("should handle get ai with various dummy keys", async () => {
      const oldKeys = {
        VITE: process.env["VITE_GEMINI_API_KEY"],
        GEMINI: process.env["GEMINI_API_KEY"],
        API_KEY: process.env["API_KEY"],
        NODE_ENV: process.env["NODE_ENV"],
      };
      // Clear all
      delete process.env["VITE_GEMINI_API_KEY"];
      delete process.env["GEMINI_API_KEY"];
      delete process.env["API_KEY"];
      (process.env as any)["NODE_ENV"] = "production"; // Bypass test mode permissive check

      const dummyKeys = ["undefined", "TODO_KEYHERE", "MY_GEMINI_API_KEY"];
      for (const key of dummyKeys) {
        process.env["API_KEY"] = key;
        aiService.updateConfig({ localLLM: false });
        expect(() => (aiService as any).ai).toThrow(
          "API key is not set. Please select an API key.",
        );
      }
      // Restore
      process.env["VITE_GEMINI_API_KEY"] = oldKeys.VITE;
      process.env["GEMINI_API_KEY"] = oldKeys.GEMINI;
      process.env["API_KEY"] = oldKeys.API_KEY;
      (process.env as any)["NODE_ENV"] = oldKeys.NODE_ENV;
    });

    it("should handle executeWithFallback with 429 in message but no status", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      const error = new Error("Rate limit 429 hit");
      mockGenerateContent
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ text: "Success" });

      const result = await aiService.generateContent("prompt");
      expect(result).toBe("Success");
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    it("should handle generateClinicalDocumentation local fallback with no markdown", async () => {
      aiService.updateConfig({ localLLM: true, googleCloud: false });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      (localAIService.generateContent as any).mockResolvedValue(
        '{"noteFacts": {"assessmentType": "Local"}}',
      );

      const result = await aiService.generateClinicalDocumentation({});
      expect(result.noteFacts.assessmentType).toBe("Local");
    });

    it("should handle generateClinicalResponse with empty response text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.generateClinicalResponse("prompt");
      expect(result).toBeDefined(); // Should parse "{}"
    });

    it("should handle generateCaseStudy with empty response text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.generateCaseStudy("topic");
      expect(result).toEqual({
        id: "error-case",
        title: "Generation Failed",
        scenario:
          "Unable to generate case study due to connectivity or model issues.",
        clinicalQuestion:
          "Please check your internet connection or local model status.",
        correctAnswer: "N/A",
        explanation: "Service unavailable.",
      });
    });

    it("should handle evaluateCaseStudyResponse with empty response text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.evaluateCaseStudyResponse(
        "scenario",
        "response",
      );
      expect(result).toEqual({
        isCorrect: false,
        feedback:
          "Unable to evaluate response due to connectivity or model issues.",
        learningPoints: [
          "Please check your internet connection or local model status.",
        ],
      });
    });

    it("should handle generateSMARTGoals with empty response text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.generateSMARTGoals(
        "domain",
        "level",
        "task",
        "findings",
      );
      expect(result.goals[0].text).toContain("Offline Goal");
    });

    it("should handle analyzeQualityCheck with empty response text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.analyzeQualityCheck("note");
      expect(result).toEqual({
        qualityScore: 0,
        qualityLevel: "Needs Improvement",
        flaggedPhrases: [],
        overallAssessment:
          "Analysis failed due to connectivity or model issues. Please try again later.",
      });
    });

    it("should handle generateTherapyGame with empty response text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.generateTherapyGame("topic", "matching");
      expect(result.id).toBe("offline-game");
      expect(result.title).toContain("Offline");
    });

    it("should handle generateAACBoard with empty response text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.generateAACBoard("topic", 2);
      expect(result).toBeInstanceOf(Array);
      expect(result[0].text).toBe("Yes");
    });

    it("should handle chatWithPersona with empty response text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.chatWithPersona("persona", [], "msg");
      expect(result.text).toContain("[Offline Mode]");
    });

    it("should handle analyzeClinicalExam with empty response text", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "" });
      const result = await aiService.analyzeClinicalExam("type", "findings");
      expect(result).toContain("**Offline Exam Analysis**");
    });

    it("should handle disabled advanced features", async () => {
      aiService.updateConfig({ advancedAI: false });

      const result = await aiService.generateProImage("prompt");
      expect(result).toContain("pollinations.ai"); // Fallback to pollinations

      await expect(aiService.generateVeoVideo("prompt")).resolves.toBeNull();
    });

    it("should handle local fallback for pro image", async () => {
      aiService.updateConfig({ localLLM: true, advancedAI: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      mockGenerateContent.mockRejectedValue(new Error("Cloud failed"));

      const result = await aiService.generateProImage("vibrant sunset");
      expect(result).toContain("pollinations.ai");
      expect(result).toContain("vibrant%20sunset");
    });

    it("should handle local fallback for veo video (unsupported)", async () => {
      aiService.updateConfig({ localLLM: true, advancedAI: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      mockGenerateContent.mockRejectedValue(new Error("Cloud failed"));

      const result = await aiService.generateVeoVideo("cool video");
      expect(result).toBeNull();
    });

    it("should handle generateProImage with advancedAI disabled", async () => {
      aiService.updateConfig({ advancedAI: false, googleCloud: true });
      const result = await aiService.generateProImage("prompt");
      expect(result).toBe("https://image.pollinations.ai/prompt/prompt");
    });

    it("should handle generateProImage returning no image parts", async () => {
      aiService.updateConfig({ advancedAI: true, googleCloud: true });
      mockGenerateContent.mockResolvedValue({
        candidates: [{ content: { parts: [{ text: "no image" }] } }],
      });
      const result = await aiService.generateProImage("prompt");
      expect(result).toBeNull();
    });

    it("should handle generateVeoVideo with imageBytes", async () => {
      aiService.updateConfig({ advancedAI: true, googleCloud: true });
      mockGenerateVideos.mockResolvedValue({
        done: true,
        response: { generatedVideos: [{ video: { uri: "video-uri" } }] },
      });
      const result = await aiService.generateVeoVideo(
        "prompt",
        "bytes",
        "image/png",
      );
      expect(result).toBe("video-uri");
      expect(mockGenerateVideos).toHaveBeenCalledWith(
        expect.objectContaining({
          image: { imageBytes: "bytes", mimeType: "image/png" },
        }),
      );
    });

    it("should handle generateVeoVideo polling", async () => {
      aiService.updateConfig({ advancedAI: true, googleCloud: true });
      mockGenerateVideos.mockResolvedValue({ done: false });
      mockGetVideosOperation.mockResolvedValue({
        done: true,
        response: { generatedVideos: [{ video: { uri: "video-uri" } }] },
      });

      vi.useFakeTimers();
      const promise = aiService.generateVeoVideo("prompt");
      await vi.advanceTimersByTimeAsync(15000);
      const result = await promise;
      expect(result).toBe("video-uri");
    });

    it("should handle generateVeoVideo with advancedAI disabled", async () => {
      aiService.updateConfig({ advancedAI: false, googleCloud: true });
      const result = await aiService.generateVeoVideo("prompt");
      expect(result).toBeNull();
    });

    it("should handle generateTTS with disabled cloud/advanced AI", async () => {
      aiService.updateConfig({ advancedAI: false, googleCloud: true });
      const result = await aiService.generateTTS("hello");
      expect(result).toBeNull();
    });

    it("should handle generateTTS with different voices", async () => {
      aiService.updateConfig({ advancedAI: true, googleCloud: true });
      mockGenerateContent.mockResolvedValue({
        candidates: [
          {
            content: {
              parts: [
                { inlineData: { data: "base64audio", mimeType: "audio/mpeg" } },
              ],
            },
          },
        ],
      });
      const result = await aiService.generateTTS("Hello", "Puck");
      expect(result).toBe("data:audio/mpeg;base64,base64audio");
    });

    it("should handle generateTTS returning no audio", async () => {
      aiService.updateConfig({ advancedAI: true, googleCloud: true });
      mockGenerateContent.mockResolvedValue({
        candidates: [{ content: { parts: [{ text: "no audio" }] } }],
      });
      const result = await aiService.generateTTS("hello");
      expect(result).toBeNull();
    });

    it("should handle generateHandoutContent local fallback with no JSON match", async () => {
      aiService.updateConfig({ googleCloud: false, localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      // This string will definitely fail the regex match
      (localAIService.generateContent as any).mockResolvedValue("No JSON here");
      const result = await aiService.generateHandoutContent(
        "Handout",
        "Speech",
        "English",
        "details",
        "instructions",
      );
      expect(result.content).toBe("No JSON here");
      expect(result.title).toContain("Local Draft");
    });

    it("should handle generateHandoutContent local fallback JSON failure", async () => {
      aiService.updateConfig({ googleCloud: false, localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      // This string matches the regex but is invalid JSON
      (localAIService.generateContent as any).mockResolvedValue(
        "{ invalid json }",
      );
      const result = await aiService.generateHandoutContent(
        "Handout",
        "Speech",
        "English",
        "details",
        "instructions",
      );
      expect(result.content).toBe("{ invalid json }");
      expect(result.title).toContain("Local Draft");
    });

    it("should handle generateHandoutContent with disabled advanced AI", async () => {
      aiService.updateConfig({ advancedAI: false, googleCloud: true });
      const result = await aiService.generateHandoutContent(
        "Handout",
        "Speech",
        "English",
        "details",
        "instructions",
      );
      expect(result.content).toContain(
        "An error occurred while generating the handout",
      );
    });

    it("should handle analyzeDocument local fallback", async () => {
      aiService.updateConfig({ googleCloud: false, localLLM: true });
      const result = await aiService.analyzeDocument(
        "base64",
        "application/pdf",
        "prompt",
      );
      expect(result).toBe("No analysis generated.");
    });

    it("should handle analyzeClinicalImage local fallback", async () => {
      aiService.updateConfig({ localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      const result = await aiService.analyzeClinicalImage(
        "bytes",
        "image/png",
        "prompt",
      );
      expect(result).toBe(
        "Image analysis failed due to connectivity issues. Please try again later.",
      );
    });

    it("should handle analyzeClinicalImage with advancedAI disabled", async () => {
      process.env["API_KEY"] = "test-key";
      aiService.updateConfig({ advancedAI: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({ text: "Flash analysis" });
      const result = await aiService.analyzeClinicalImage(
        "bytes",
        "image/png",
        "prompt",
      );
      expect(result).toBe("Flash analysis");
    });

    it("should handle deepClinicalAnalysis local fallback", async () => {
      aiService.updateConfig({ localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      (localAIService.generateContent as any).mockResolvedValue(
        "Local deep analysis",
      );
      const result = await aiService.deepClinicalAnalysis("prompt");
      expect(result).toBe("Local deep analysis");
    });

    it("should handle generateTTS local fallback", async () => {
      aiService.updateConfig({ localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      const result = await aiService.generateTTS("text");
      expect(result).toBeNull();
    });

    it("should handle searchClinicalInfo local fallback", async () => {
      aiService.updateConfig({ localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      (localAIService.generateContent as any).mockResolvedValue(
        "Local search result",
      );
      const result = await aiService.searchClinicalInfo("query");
      expect(result.text).toBe("Local search result");
      expect(result.urls).toEqual([]);
    });

    it("should handle searchCreativeInfo local fallback", async () => {
      aiService.updateConfig({ localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      (localAIService.generateContent as any).mockResolvedValue(
        "Local creative result",
      );
      const result = await aiService.searchCreativeInfo("query");
      expect(result.text).toBe("Local creative result");
      expect(result.urls).toEqual([]);
    });

    it("should log info when local AI requested but model not loaded", async () => {
      aiService.updateConfig({ localLLM: true, googleCloud: true });
      (localAIService.isModelLoaded as any).mockReturnValue(false);
      mockGenerateContent.mockResolvedValue({ text: "Cloud response" });

      const result = await aiService.generateContent("prompt");
      expect(result).toBe("Cloud response");
    });
  });

  describe("Local RAG Fallback", () => {
    it("should use local RAG backend for generateClinicalResponse", async () => {
      aiService.updateConfig({ localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);

      const mockResponse = { response: "Local RAG answer" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.generateClinicalResponse("prompt");
      expect(result.text).toBe("Local RAG answer");
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("chat-with-doc"),
        expect.any(Object),
      );
    });

    it("should handle local RAG failure", async () => {
      aiService.updateConfig({ localLLM: true, googleCloud: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ detail: "RAG Error" }),
      });
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify({ text: "Cloud fallback" }),
      });

      const result = await aiService.generateClinicalResponse("prompt");
      expect(result.text).toBe("Cloud fallback");
    });
  });

  describe("Local AI Fallback", () => {
    beforeEach(() => {
      aiService.updateConfig({
        advancedAI: true,
        googleCloud: true,
        microsoftCopilot: false,
        localLLM: true,
      });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
    });

    it("should use local AI for generateContent", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        "local response",
      );
      const result = await aiService.generateContent("prompt");
      expect(result).toBe("local response");
    });

    it("should use local AI for generateCaseStudy", async () => {
      const mockCase = { title: "Local Case" };
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockCase),
      );
      const result = await aiService.generateCaseStudy("topic");
      expect(result.title).toBe("Local Case");
    });

    it("should use local AI for evaluateCaseStudyResponse", async () => {
      const mockFeedback = { isCorrect: true };
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockFeedback),
      );
      const result = await aiService.evaluateCaseStudyResponse(
        "scenario",
        "response",
      );
      expect(result.isCorrect).toBe(true);
    });

    it("should use local AI for generateSMARTGoals", async () => {
      const mockGoals = {
        goals: [
          {
            text: "Patient will demonstrate improved functional mobility with appropriate assistance level within 4 weeks",
            components: {
              specific: "Demonstrate improved functional mobility",
              measurable: "Appropriate assistance level achievement",
              achievable: "Based on current functional status",
              relevant: "Required for independence in daily activities",
              timeBound: "4 weeks from initial evaluation",
            },
            rationale:
              "Improves overall functional independence and quality of life",
          },
        ],
      };
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockGoals),
      );
      const result = await aiService.generateSMARTGoals(
        "orthopedic",
        "minimal-assist",
        "mobility",
        "assessment findings",
      );
      expect(result.goals.length).toBeGreaterThan(0);
      expect(result.goals[0]!.text.length).toBeGreaterThanOrEqual(20);
    });

    it("should use local AI for analyzeQualityCheck", async () => {
      const mockAnalysis = { qualityScore: 90 };
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockAnalysis),
      );
      const result = await aiService.analyzeQualityCheck("note");
      expect(result.qualityScore).toBe(90);
    });

    it("should use local AI for generateTherapyGame", async () => {
      const mockGame = { title: "Local Game" };
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockGame),
      );
      const result = await aiService.generateTherapyGame("topic", "naming");
      expect(result.title).toBe("Local Game");
    });

    it("should use local AI for generateAACBoard", async () => {
      const mockBoard = [{ text: "Local AAC" }];
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockBoard),
      );
      const result = await aiService.generateAACBoard("topic", 1);
      expect(result[0].text).toBe("Local AAC");
    });

    it("should use local AI for chatWithPersona", async () => {
      const mockChat = { text: "Local Persona" };
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockChat),
      );
      const result = await aiService.chatWithPersona("Persona", [], "Hi");
      expect(result.text).toBe("Local Persona");
    });

    it("should use local AI for analyzeClinicalExam", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        "Local Exam Analysis",
      );
      const result = await aiService.analyzeClinicalExam("Exam", {});
      expect(result).toBe("Local Exam Analysis");
    });

    it("should use local AI for generateClinicalDocumentation", async () => {
      const mockDoc = { noteFacts: { assessmentType: "Local Doc" } };
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockDoc),
      );
      const result = await aiService.generateClinicalDocumentation({});
      expect(result.noteFacts.assessmentType).toBe("Local Doc");
    });

    it("should use local AI for generateHandoutContent", async () => {
      const mockHandout = { title: "Local Handout" };
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify(mockHandout),
      );
      const result = await aiService.generateHandoutContent(
        "Type",
        "Sub",
        "Lang",
        "Det",
        "Inst",
      );
      expect(result.title).toBe("Local Handout");
    });
  });

  describe("executeWithFallback Retry Logic", () => {
    it("should retry on cloud failure (429) before falling back", async () => {
      mockGenerateContent
        .mockRejectedValueOnce({ status: 429, message: "Rate limit" })
        .mockResolvedValueOnce({
          text: JSON.stringify({ text: "Success after retry" }),
        });

      const result = await aiService.generateClinicalResponse("prompt");
      expect(result.text).toBe("Success after retry");
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    it("should fall back to local after cloud fails", async () => {
      aiService.updateConfig({ localLLM: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      (localAIService.generateContent as any).mockResolvedValue(
        "Local Fallback",
      );

      mockGenerateContent.mockRejectedValue(new Error("Persistent Error"));

      const result = await aiService.analyzeClinicalExam("OME", {});
      expect(result).toBe("Local Fallback");
      expect(localAIService.generateContent).toHaveBeenCalled();
    });
  });

  it("should handle local AI failure with 403/503 status", async () => {
    aiService.updateConfig({ localLLM: true, googleCloud: true });
    (localAIService.isModelLoaded as any).mockReturnValue(true);
    const error = new Error("Model not initialized");
    (error as any).status = 503;
    (localAIService.generateContent as any).mockRejectedValue(error);

    const result = await aiService.generateContent("prompt");
    expect(result).toContain("Offline mode");
  });

  it("should fall back to fallbackValue if both local and cloud are disabled", async () => {
    aiService.updateConfig({ localLLM: false, googleCloud: false });
    const result = await aiService.generateContent("prompt");
    expect(result).toContain("Offline mode");
  });

  it("should exhaust retries on cloud 429 and return fallback", async () => {
    aiService.updateConfig({ localLLM: false, googleCloud: true });
    const error = new Error("429 Too Many Requests");
    (error as any).status = 429;
    mockGenerateContent.mockRejectedValue(error);

    // Using small delay in aiService for retries during test
    const result = await aiService.generateContent("prompt");

    expect(result).toContain("Offline mode");
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  describe("AI Getter Error Handling", () => {
    it("should use API_KEY if both are present", async () => {
      const originalKey = process.env["API_KEY"];
      const originalGeminiKey = process.env["GEMINI_API_KEY"];
      process.env["API_KEY"] = "key1";
      process.env["GEMINI_API_KEY"] = "key2";
      const ai = (aiService as any).ai;
      expect(ai).toBeDefined();
      if (originalKey === undefined) delete process.env["API_KEY"];
      else process.env["API_KEY"] = originalKey;
      if (originalGeminiKey === undefined) delete process.env["GEMINI_API_KEY"];
      else process.env["GEMINI_API_KEY"] = originalGeminiKey;
    });

    it("should use API_KEY if GEMINI_API_KEY is missing", async () => {
      const originalKey = process.env["API_KEY"];
      const originalGeminiKey = process.env["GEMINI_API_KEY"];
      process.env["API_KEY"] = "key1";
      delete process.env["GEMINI_API_KEY"];
      const ai = (aiService as any).ai;
      expect(ai).toBeDefined();
      if (originalKey === undefined) delete process.env["API_KEY"];
      else process.env["API_KEY"] = originalKey;
      if (originalGeminiKey === undefined) delete process.env["GEMINI_API_KEY"];
      else process.env["GEMINI_API_KEY"] = originalGeminiKey;
    });

    it("should use GEMINI_API_KEY if API_KEY is missing", async () => {
      const originalKey = process.env["API_KEY"];
      const originalGeminiKey = process.env["GEMINI_API_KEY"];
      delete process.env["API_KEY"];
      process.env["GEMINI_API_KEY"] = "key2";
      const ai = (aiService as any).ai;
      expect(ai).toBeDefined();
      if (originalKey === undefined) delete process.env["API_KEY"];
      else process.env["API_KEY"] = originalKey;
      if (originalGeminiKey === undefined) delete process.env["GEMINI_API_KEY"];
      else process.env["GEMINI_API_KEY"] = originalGeminiKey;
    });

    it("should return fallback if API key is missing and no local fallback available", async () => {
      const originalKey = process.env["API_KEY"];
      const originalGeminiKey = process.env["GEMINI_API_KEY"];
      process.env["API_KEY"] = "dummy_key";
      delete process.env["GEMINI_API_KEY"];
      aiService.updateConfig({ localLLM: false, googleCloud: true });

      const result = await aiService.generateContent("prompt");
      expect(result).toContain("Offline mode");

      if (originalKey === undefined) delete process.env["API_KEY"];
      else process.env["API_KEY"] = originalKey;
      if (originalGeminiKey === undefined) delete process.env["GEMINI_API_KEY"];
      else process.env["GEMINI_API_KEY"] = originalGeminiKey;
    });
  });

  describe("Streaming", () => {
    beforeEach(() => {
      process.env["API_KEY"] = "test-key";
    });

    it("should stream content from cloud", async () => {
      const mockStream = {
        async *[Symbol.asyncIterator]() {
          yield { text: "Part 1" };
          yield { text: "Part 2" };
        },
      };
      mockGenerateContentStream.mockResolvedValue(mockStream);

      const generator = aiService.generateContentStream("prompt");
      const results = [];
      for await (const chunk of generator) {
        results.push(chunk);
      }

      expect(results).toEqual(["Part 1", "Part 2"]);
    });

    it("should stream content from local if enabled", async () => {
      aiService.updateConfig({
        advancedAI: true,
        googleCloud: true,
        microsoftCopilot: false,
        localLLM: true,
      });
      (localAIService.isModelLoaded as any).mockReturnValue(true);

      async function* mockLocalStream() {
        yield "Local 1";
        yield "Local 2";
      }
      (localAIService.generateContentStream as any).mockReturnValue(
        mockLocalStream(),
      );

      const generator = aiService.generateContentStream("prompt");
      const results = [];
      for await (const chunk of generator) {
        results.push(chunk);
      }

      expect(results).toEqual(["Local 1", "Local 2"]);
    });

    it("should fallback to cloud if local stream fails", async () => {
      aiService.updateConfig({ localLLM: true, googleCloud: true });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      (localAIService.generateContentStream as any).mockImplementation(
        async function* () {
          if (process.env["TESTING_GENERATOR"]) yield ""; // Keep generator happy
          throw new Error("Local stream failed");
        },
      );
      mockGenerateContentStream.mockResolvedValue([{ text: "Cloud chunk" }]);

      const chunks = [];
      for await (const chunk of aiService.generateContentStream("prompt")) {
        chunks.push(chunk);
      }
      expect(chunks).toContain("Cloud chunk");
    });

    it("should fallback to cloud if local model not loaded for stream", async () => {
      aiService.updateConfig({ localLLM: true, googleCloud: true });
      (localAIService.isModelLoaded as any).mockReturnValue(false);
      mockGenerateContentStream.mockResolvedValue([{ text: "Cloud chunk" }]);

      const chunks = [];
      for await (const chunk of aiService.generateContentStream("prompt")) {
        chunks.push(chunk);
      }
      expect(chunks).toContain("Cloud chunk");
    });

    it("should yield error message if cloud stream fails", async () => {
      aiService.updateConfig({ googleCloud: true, localLLM: false });
      mockGenerateContentStream.mockRejectedValue(
        new Error("Cloud stream failed"),
      );

      const chunks = [];
      for await (const chunk of aiService.generateContentStream("prompt")) {
        chunks.push(chunk);
      }
      expect(chunks[0]).toContain("connectivity issues");
    });

    it("should yield fallback if both local and cloud are disabled for stream", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: false });
      const generator = aiService.generateContentStream("prompt");
      const result = await generator.next();
      expect(result.value).toContain("connectivity issues");
    });

    it("should handle generateContentStream with cloud disabled and local model not loaded", async () => {
      aiService.updateConfig({ localLLM: true, googleCloud: false });
      (localAIService.isModelLoaded as any).mockReturnValue(false);
      const generator = aiService.generateContentStream("prompt");
      const result = await generator.next();
      expect(result.value).toContain("connectivity issues");
    });
  });

  describe("Local AI Fallbacks for All Methods", () => {
    beforeEach(() => {
      aiService.updateConfig({
        advancedAI: true,
        googleCloud: false,
        localLLM: true,
      });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
    });

    it("should fallback to local for generateCaseStudy", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify({ id: "local-case", title: "Local Case" }),
      );
      const result = await aiService.generateCaseStudy("topic");
      expect(result.id).toBe("local-case");
      expect(result.title).toBe("Local Case");
    });

    it("should fallback to local for evaluateCaseStudyResponse", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify({
          isCorrect: true,
          feedback: "Good",
          learningPoints: ["Point 1"],
        }),
      );
      const result = await aiService.evaluateCaseStudyResponse(
        "case",
        "response",
      );
      expect(result.isCorrect).toBe(true);
      expect(result.feedback).toBe("Good");
    });

    it("should fallback to local for generateSMARTGoals", async () => {
      const mockGoal = {
        text: "Patient will ambulate 150 feet independently with appropriate assistive device within 4 weeks",
        components: {
          specific: "Ambulate 150 feet independently",
          measurable: "150 feet distance measurement",
          achievable: "Based on current 50 foot tolerance with walker",
          relevant: "Required for community mobility and independence",
          timeBound: "4 weeks from initial evaluation",
        },
        rationale:
          "Improves functional mobility for community access and reduces fall risk",
      };
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify({ goals: [mockGoal] }),
      );
      const result = await aiService.generateSMARTGoals(
        "orthopedic",
        "minimal-assist",
        "ambulation",
        "TUG 18s, Berg Balance 38/56",
      );
      expect(result.goals.length).toBeGreaterThan(0);
      expect(result.goals[0]!.text.length).toBeGreaterThanOrEqual(20);
    });

    it("should fallback to local for analyzeQualityCheck", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify({
          qualityScore: 85,
          qualityLevel: "Good",
          flaggedPhrases: [],
          overallAssessment: "Good",
        }),
      );
      const result = await aiService.analyzeQualityCheck("note");
      expect(result.qualityScore).toBe(85);
      expect(result.qualityLevel).toBe("Good");
    });

    it("should fallback to local for generateTherapyGame", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify({
          id: "1",
          title: "Local Game",
          type: "naming",
          instructions: "Instr",
          items: [],
        }),
      );
      const result = await aiService.generateTherapyGame("topic", "naming");
      expect(result.title).toBe("Local Game");
      expect(result.type).toBe("naming");
    });

    it("should fallback to local for generateAACBoard", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify([{ text: "Yes", type: "social" }]),
      );
      const result = await aiService.generateAACBoard("topic", 1);
      expect(result[0].text).toBe("Yes");
      expect(result[0].type).toBe("social");
    });

    it("should fallback to local for chatWithPersona", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        JSON.stringify({ text: "Local persona response", feedback: "Good" }),
      );
      const result = await aiService.chatWithPersona("persona", [], "message");
      expect(result.text).toBe("Local persona response");
      expect(result.feedback).toBe("Good");
    });

    it("should fallback to local for analyzeClinicalExam", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        "Local exam analysis",
      );
      const result = await aiService.analyzeClinicalExam("type", "data");
      expect(result).toBe("Local exam analysis");
    });

    it("should handle generateClinicalDocumentation local JSON failure", async () => {
      aiService.updateConfig({ localLLM: true, googleCloud: false });
      (localAIService.isModelLoaded as any).mockReturnValue(true);
      (localAIService.generateContent as any).mockResolvedValue("Invalid JSON");
      const result = await aiService.generateClinicalDocumentation({});
      expect(result.validation.missing).toContain(
        "Could not parse structured data",
      );
      expect(result.noteNarrative.summary).toBe("Invalid JSON");
    });

    it("should handle generateTTS with default voice", async () => {
      aiService.updateConfig({
        localLLM: false,
        googleCloud: true,
        advancedAI: true,
      });
      mockGenerateContent.mockResolvedValue({
        candidates: [
          {
            content: {
              parts: [
                {
                  inlineData: { data: "base64audio", mimeType: "audio/mp3" },
                },
              ],
            },
          },
        ],
      });
      const result = await aiService.generateTTS("prompt");
      expect(result).toBe("data:audio/mp3;base64,base64audio");
    });

    it("should handle searchClinicalInfo with no text in response", async () => {
      aiService.updateConfig({ localLLM: false, googleCloud: true });
      mockGenerateContent.mockResolvedValue({
        text: "",
        candidates: [
          {
            groundingMetadata: {
              groundingChunks: [],
            },
          },
        ],
      });
      const result = await aiService.searchClinicalInfo("query");
      expect(result.text).toBe("No results found.");
    });

    it("should fallback to local for deepClinicalAnalysis", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        "Local deep analysis",
      );
      const result = await aiService.deepClinicalAnalysis("query");
      expect(result).toBe("Local deep analysis");
    });

    it("should fallback to local for searchClinicalInfo", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        "Local clinical search",
      );
      const result = await aiService.searchClinicalInfo("query");
      expect(result.text).toBe("Local clinical search");
    });

    it("should fallback to local for searchCreativeInfo", async () => {
      (localAIService.generateContent as any).mockResolvedValue(
        "Local creative search",
      );
      const result = await aiService.searchCreativeInfo("query");
      expect(result.text).toBe("Local creative search");
    });

    it("should handle generateClinicalResponse local RAG success", async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ response: "Local RAG response" }),
      });
      const result = await aiService.generateClinicalResponse(
        "prompt",
        "context",
        [],
      );
      expect(result.text).toBe("Local RAG response");
    });

    it("should handle generateClinicalResponse local RAG failure without detail", async () => {
      aiService.updateConfig({ localLLM: true, googleCloud: true });
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({}),
      });
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify({
          text: "Cloud response",
          reasoning: "Cloud reasoning",
        }),
      });
      const result = await aiService.generateClinicalResponse(
        "prompt",
        "context",
        [],
      );
      console.log("DEBUG RESULT:", result);
      expect(result.text).toBe("Cloud response");
      expect(result.reasoning).toBe("Cloud reasoning");
    });
  });
});
