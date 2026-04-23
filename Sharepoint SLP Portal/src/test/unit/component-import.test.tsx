import { describe, it, expect, vi } from "vitest";

vi.mock("../../services/local-ai-service", () => ({
  localAIService: {
    isModelLoaded: vi.fn(),
    generateContent: vi.fn(),
    generateContentStream: vi.fn(),
  },
}));

// Mock useSystemStatus which imports local-ai-service
vi.mock("../../hooks/useSystemStatus", () => ({
  useSystemStatus: () => ({ localModelLoaded: true }),
}));

import { DocumentationStudio } from "../../components/DocumentationStudio";

describe("Component Import Test", () => {
  it("imports without hanging", () => {
    expect(DocumentationStudio).toBeDefined();
  });
});
