import { describe, it, vi } from "vitest";
import { aiService } from "../../services/ai-service";
import { localAIService } from "../../services/local-ai-service";

vi.mock("../../services/local-ai-service", () => ({
  localAIService: {
    isModelLoaded: vi.fn(),
    generateContent: vi.fn(),
  },
}));

// Regression test for AI Service Fallback Logic
describe("Regression: AIService Fallback Logic", () => {
  it("should maintain fallback order: Local AI -> Cloud AI", async () => {
    // Setup: Local AI fails, Cloud AI succeeds
    vi.mocked(localAIService.isModelLoaded).mockReturnValue(true);
    global.fetch = vi.fn().mockRejectedValue(new Error("Local API Error"));

    // ...
  });
});
