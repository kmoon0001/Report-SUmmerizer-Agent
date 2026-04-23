import { describe, it, expect, vi, beforeEach } from "vitest";
import { BaseAIService } from "../../services/ai/BaseAIService";
import { localAIService } from "../../services/local-ai-service";
import { logger } from "../../utils/logger";

// Mock dependencies
vi.mock("../../services/local-ai-service", () => ({
  localAIService: {
    isModelLoaded: vi.fn(),
    generateContent: vi.fn(),
  },
}));

vi.mock("../../utils/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock GoogleGenAI
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn(),
    };
  },
}));

// Mock window.ai
const mockBrowserAI = {
  createTextSession: vi.fn().mockResolvedValue({
    prompt: vi.fn().mockResolvedValue("Browser AI response"),
  }),
};

class TestAIService extends BaseAIService {
  public async testExecute<T>(
    op: string,
    cloud: () => Promise<T>,
    local: () => Promise<T>,
    fb: T,
  ) {
    return this.executeWithFallback(op, cloud, local, fb);
  }
}

describe("BaseAIService 4-Tier Fallback", () => {
  let service: TestAIService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TestAIService();
    // Default features
    service.updateConfig({
      googleCloud: true,
      localLLM: true,
      browserAI: true,
    });

    // Setup window.ai mock
    (window as any).ai = undefined;
  });

  it("Tier 1: should return Local AI response if successful", async () => {
    const cloudFn = vi.fn().mockResolvedValue("Cloud response");
    const localFn = vi.fn().mockResolvedValue("Local response");
    (localAIService.isModelLoaded as any).mockReturnValue(true);

    const result = await service.testExecute(
      "test",
      cloudFn,
      localFn,
      "Fallback",
    );

    expect(result).toBe("Local response");
    expect(localFn).toHaveBeenCalled();
    expect(cloudFn).not.toHaveBeenCalled();
  });

  it("Tier 2: should fall back to Cloud AI if Local AI fails", async () => {
    const cloudFn = vi.fn().mockResolvedValue("Cloud response");
    const localFn = vi.fn().mockRejectedValue(new Error("Local fail"));
    (localAIService.isModelLoaded as any).mockReturnValue(true);

    const result = await service.testExecute(
      "test",
      cloudFn,
      localFn,
      "Fallback",
    );

    expect(result).toBe("Cloud response");
    expect(localFn).toHaveBeenCalled();
    expect(cloudFn).toHaveBeenCalled();
  });

  it("Tier 4: should fall back to Browser AI if Cloud AI also fails", async () => {
    const cloudFn = vi.fn().mockRejectedValue(new Error("Cloud fail"));
    const localFn = vi.fn().mockRejectedValue(new Error("Local fail"));
    (localAIService.isModelLoaded as any).mockReturnValue(true);

    // Mock window.ai
    (window as any).ai = mockBrowserAI;

    const result = await service.testExecute(
      "test",
      cloudFn,
      localFn,
      "Fallback",
    );

    expect((result as any).text).toBe("Browser AI response");
    expect(mockBrowserAI.createTextSession).toHaveBeenCalled();
  });

  it("Final Fallback: should return fallback value if all tiers fail", async () => {
    const cloudFn = vi.fn().mockRejectedValue(new Error("Cloud fail"));
    const localFn = vi.fn().mockRejectedValue(new Error("Local fail"));
    (localAIService.isModelLoaded as any).mockReturnValue(true);
    (window as any).ai = undefined;

    const result = await service.testExecute(
      "test",
      cloudFn,
      localFn,
      "Final Fallback",
    );

    expect(result).toBe("Final Fallback");
  });
});
