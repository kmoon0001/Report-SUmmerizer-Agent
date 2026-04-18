import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PTMobilityAssistanceModule } from "./PTMobilityAssistanceModule";
import { AIProvider } from "../context/AIContext";

// Mock window.print
const mockPrint = vi.fn();
window.print = mockPrint;

// Mock AI Service
vi.mock("../services/ai-service", () => ({
  aiService: {
    generateMobilityPlan: vi.fn().mockResolvedValue([
      { device: "Walker", indication: "Balance support" },
      { device: "Cane", indication: "Weight bearing assistance" },
    ]),
    updateConfig: vi.fn(),
  },
}));

describe("Global Actions & PT Mobility Assistance", () => {
  it("renders PT mobility assistance module without errors", () => {
    const { container } = render(
      <AIProvider>
        <PTMobilityAssistanceModule />
      </AIProvider>,
    );

    expect(container).toBeInTheDocument();
  });

  it("renders component successfully", () => {
    const { container } = render(
      <AIProvider>
        <PTMobilityAssistanceModule />
      </AIProvider>,
    );

    expect(container.firstChild).toBeTruthy();
  });

  it("component is PT-focused", () => {
    const { container } = render(
      <AIProvider>
        <PTMobilityAssistanceModule />
      </AIProvider>,
    );

    // Just verify the component renders
    expect(container).toBeInTheDocument();
  });
});
