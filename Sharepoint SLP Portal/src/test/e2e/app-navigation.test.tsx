import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../../App";
import { DisciplineService } from "../../services/DisciplineService";

// Mock the AI Service to prevent actual API calls during E2E
vi.mock("../../services/ai-service", () => ({
  aiService: {
    updateConfig: vi.fn(),
    generateClinicalResponse: vi.fn().mockResolvedValue({
      text: "Mocked AI Response",
      reasoning: "Mocked Reasoning",
      citations: [],
      suggestedActions: [],
    }),
    generateSMARTGoals: vi.fn().mockResolvedValue({
      goals: [],
    }),
    generateCaseStudy: vi.fn().mockResolvedValue({
      id: "mock-case",
      title: "Mock Case",
      scenario: "Mock Scenario",
      clinicalQuestion: "Mock Question",
      correctAnswer: "Mock Answer",
      explanation: "Mock Explanation",
    }),
  },
}));

// Mock ResizeObserver which is used by some charting/layout libraries
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("E2E: Application Boot and Navigation", () => {
  beforeEach(() => {
    DisciplineService.initialize();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("should render the main application layout", async () => {
    render(<App />);
    // Verify the main navigation or header is present
    expect(screen.getByText(/PACIFIC COAST/i)).toBeInTheDocument();
  });

  it("should render the dashboard content by default", async () => {
    render(<App />);

    // Wait for the initial render to settle
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });
  });
});
