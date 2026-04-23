import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../../App";

// Mock AI Service with full structure
vi.mock("../../services/ai-service", () => ({
  aiService: {
    updateConfig: vi.fn(),
    generateClinicalResponse: vi.fn().mockResolvedValue({
      text: "Mocked AI Response",
      reasoning: "Mocked Reasoning",
      citations: [],
      suggestedActions: [],
    }),
    generateClinicalDocumentation: vi.fn().mockResolvedValue({
      noteNarrative: { Subjective: "Mocked Subjective" },
    }),
    generateSMARTGoals: vi.fn(),
    generateCaseStudy: vi.fn(),
  },
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

import { DisciplineService } from "../../services/DisciplineService";

describe("E2E: Clinical Workflow", () => {
  beforeEach(() => {
    DisciplineService.initialize();
    localStorage.clear();
  });

  it("should navigate to Documentation Studio and validate real-time compliance", async () => {
    render(<App />);

    // 1. Navigate to Documentation Studio
    const docStudioBtn = await screen.findByRole("button", {
      name: /Documentation Studio/i,
    });
    fireEvent.click(docStudioBtn);

    // 2. Wait for DocuArchitect to appear
    await screen.findByText(/DocuArchitect/i);

    // 3. Expand Magic Draft
    const expandBtn = await screen.findByText(/Expand|Show Magic Draft/i);
    fireEvent.click(expandBtn);

    // 4. Find Magic Draft text area
    const textArea = await screen.findByPlaceholderText(/Type shorthand/i);

    // 5. Enter a poor note to trigger vague language flag
    fireEvent.change(textArea, {
      target: { value: "Patient did well today. Continue same." },
    });

    // 6. Check for compliance flags count in sidebar
    await waitFor(
      () => {
        expect(screen.getByText(/Flags/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // 7. Verify vague language warning
    expect(screen.getAllByText(/Vague language/i).length).toBeGreaterThan(0);

    // 8. Enter a robust, compliant SLP note snippet
    // This note contains skilled keywords ('dysphagia', 'skilled'), objective indicators ('bolus', 'trials'), and progress ('improved')
    fireEvent.change(textArea, {
      target: {
        value:
          "Patient presenting with dysphagia requiring skilled swallowing treatment for safe bolus management. Patient showed improved safety during trials.",
      },
    });

    // 9. Flags should clear and show "Passing" status
    await waitFor(
      () => {
        expect(screen.getByText(/Passing/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("should navigate to SLP Dysphagia Hub from Sidebar", async () => {
    render(<App />);

    const dysphagiaBtn = await screen.findByRole("button", {
      name: /Dysphagia/i,
    });
    fireEvent.click(dysphagiaBtn);

    const hubTitle = await screen.findByText(/Dysphagia Hub/i);
    expect(hubTitle).toBeVisible();
  });
});
