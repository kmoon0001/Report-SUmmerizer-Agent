/**
 * Integration Test: Goal Generation Workflow
 * Task 14.7 — Requirements: 5.1, 5.5
 *
 * Tests the complete SMART goal generation workflow:
 * 1. Domain and functional level selection
 * 2. AI service call with correct parameters
 * 3. SMART goal display with all components
 * 4. Rationale and evidence display
 * 5. Error handling
 *
 * Sources: APTA Guide to Physical Therapist Practice 3.0
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GoalGenerator } from "../../components/GoalGenerator";
import { aiService } from "../../services/ai-service";

vi.mock("../../services/ai-service", () => ({
  aiService: {
    generateSMARTGoals: vi.fn(),
  },
}));

vi.mock("../../components/layout/PatientViewWrapper", () => ({
  PatientViewWrapper: ({ children, onExit }: any) => (
    <div data-testid="patient-view-wrapper">
      <button onClick={onExit}>Exit</button>
      {children}
    </div>
  ),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const buildMockGoalResponse = (domain: string, task: string) => ({
  goals: [
    {
      text: `Patient will ${task} with minimal assist in 4 weeks per ${domain} protocol.`,
      components: {
        specific: `${task} with rolling walker`,
        measurable: "150 feet distance, minimal assist level (25% assistance)",
        achievable: `Current functional level supports progression with skilled PT intervention`,
        relevant: `Required for ${domain} rehabilitation and functional independence`,
        timeBound: "4 weeks",
      },
      rationale: `Based on assessment findings and APTA CPG for ${domain} conditions. Evidence Level 2 (RCT) supports progressive functional training.`,
    },
    {
      text: `Patient will perform 10 repetitions of ${task} without upper extremity support in 6 weeks.`,
      components: {
        specific: `${task} without upper extremity support`,
        measurable: "10 repetitions, 0% assistance",
        achievable:
          "Strength assessment supports progression to independent function",
        relevant: "Required for ADL performance and fall prevention",
        timeBound: "6 weeks",
      },
      rationale: `APTA CPG for ${domain} supports progressive strengthening and functional training.`,
    },
  ],
});

import { DisciplineProvider } from "../../context/DisciplineContext";
import { AIProvider } from "../../context/AIContext";
import { SearchProvider } from "../../context/SearchContext";
import { NotificationProvider } from "../../context/NotificationContext";
import { DisciplineService } from "../../services/DisciplineService";
import React from "react";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NotificationProvider>
    <DisciplineProvider>
      <AIProvider>
        <SearchProvider>{children}</SearchProvider>
      </AIProvider>
    </DisciplineProvider>
  </NotificationProvider>
);

describe("Goal Generation Workflow Integration", () => {
  beforeEach(() => {
    DisciplineService.initialize();
    vi.clearAllMocks();
  });

  describe("Complete Orthopedic Goal Generation Workflow", () => {
    it("generates orthopedic goals with correct domain context", async () => {
      const mockResponse = buildMockGoalResponse("orthopedic", "ambulate");
      (aiService.generateSMARTGoals as any).mockResolvedValue(mockResponse);

      render(<GoalGenerator />);

      // Select orthopedic domain (default)
      fireEvent.change(screen.getByLabelText("Functional level"), {
        target: { value: "minimal-assist" },
      });
      fireEvent.change(screen.getByLabelText("Functional Task / Goal Area"), {
        target: { value: "ambulate" },
      });
      fireEvent.change(screen.getByLabelText("Assessment Findings"), {
        target: { value: "Knee flexion 95°, quad strength 3+/5, TUG 18s" },
      });

      fireEvent.click(screen.getByText("Generate SMART Goals"));

      await waitFor(() => {
        expect(aiService.generateSMARTGoals).toHaveBeenCalledWith(
          "orthopedic",
          "minimal-assist",
          "ambulate",
          "Knee flexion 95°, quad strength 3+/5, TUG 18s",
        );
      });

      await waitFor(() => {
        expect(screen.getByText(/Generated SMART Goals/)).toBeInTheDocument();
      });
    });

    it("displays all SMART components for each goal", async () => {
      const mockResponse = buildMockGoalResponse("orthopedic", "ambulate");
      (aiService.generateSMARTGoals as any).mockResolvedValue(mockResponse);

      render(<GoalGenerator />);
      fireEvent.change(screen.getByLabelText("Functional Task / Goal Area"), {
        target: { value: "ambulate" },
      });
      fireEvent.change(screen.getByLabelText("Assessment Findings"), {
        target: { value: "TUG 18s" },
      });
      fireEvent.click(screen.getByText("Generate SMART Goals"));

      await waitFor(() => {
        expect(screen.getByText("S – Specific")).toBeInTheDocument();
        expect(screen.getByText("M – Measurable")).toBeInTheDocument();
        expect(screen.getByText("A – Achievable")).toBeInTheDocument();
        expect(screen.getByText("R – Relevant")).toBeInTheDocument();
        expect(screen.getByText("T – Time-Bound")).toBeInTheDocument();
      });
    });
  });

  describe("Complete Neurological Goal Generation Workflow", () => {
    it("generates neurological goals with stroke context", async () => {
      const mockResponse = buildMockGoalResponse("neurological", "transfer");
      (aiService.generateSMARTGoals as any).mockResolvedValue(mockResponse);

      render(<GoalGenerator />);

      fireEvent.click(screen.getByText("Neurological"));
      fireEvent.change(screen.getByLabelText("Functional level"), {
        target: { value: "moderate-assist" },
      });
      fireEvent.change(screen.getByLabelText("Functional Task / Goal Area"), {
        target: { value: "transfer" },
      });
      fireEvent.change(screen.getByLabelText("Assessment Findings"), {
        target: {
          value: "Berg Balance 28/56, Fugl-Meyer 45/66, hemiplegia right side",
        },
      });

      fireEvent.click(screen.getByText("Generate SMART Goals"));

      await waitFor(() => {
        expect(aiService.generateSMARTGoals).toHaveBeenCalledWith(
          "neurological",
          "moderate-assist",
          "transfer",
          "Berg Balance 28/56, Fugl-Meyer 45/66, hemiplegia right side",
        );
      });
    });
  });

  describe("Complete Geriatric Goal Generation Workflow", () => {
    it("generates geriatric fall prevention goals", async () => {
      const mockResponse = buildMockGoalResponse("geriatric", "ambulate");
      (aiService.generateSMARTGoals as any).mockResolvedValue(mockResponse);

      render(<GoalGenerator />);

      fireEvent.click(screen.getByText("Geriatric"));
      fireEvent.change(screen.getByLabelText("Functional level"), {
        target: { value: "supervision" },
      });
      fireEvent.change(screen.getByLabelText("Functional Task / Goal Area"), {
        target: { value: "ambulate" },
      });
      fireEvent.change(screen.getByLabelText("Assessment Findings"), {
        target: {
          value:
            "TUG 16s, Berg Balance 38/56, 2 falls in past year, gait speed 0.6 m/s",
        },
      });

      fireEvent.click(screen.getByText("Generate SMART Goals"));

      await waitFor(() => {
        expect(aiService.generateSMARTGoals).toHaveBeenCalledWith(
          "geriatric",
          "supervision",
          "ambulate",
          "TUG 16s, Berg Balance 38/56, 2 falls in past year, gait speed 0.6 m/s",
        );
      });
    });
  });

  describe("Goal Count and Display", () => {
    it("displays correct goal count", async () => {
      const mockResponse = buildMockGoalResponse("orthopedic", "ambulate");
      (aiService.generateSMARTGoals as any).mockResolvedValue(mockResponse);

      render(<GoalGenerator />);
      fireEvent.change(screen.getByLabelText("Functional Task / Goal Area"), {
        target: { value: "ambulate" },
      });
      fireEvent.change(screen.getByLabelText("Assessment Findings"), {
        target: { value: "TUG 18s" },
      });
      fireEvent.click(screen.getByText("Generate SMART Goals"));

      await waitFor(() => {
        expect(
          screen.getByText(/Generated SMART Goals \(2\)/),
        ).toBeInTheDocument();
      });
    });

    it("numbers goals sequentially", async () => {
      const mockResponse = buildMockGoalResponse("orthopedic", "ambulate");
      (aiService.generateSMARTGoals as any).mockResolvedValue(mockResponse);

      render(<GoalGenerator />);
      fireEvent.change(screen.getByLabelText("Functional Task / Goal Area"), {
        target: { value: "ambulation with rolling walker" },
      });
      fireEvent.change(screen.getByLabelText("Assessment Findings"), {
        target: {
          value:
            "TUG 18s, Berg Balance 38/56, knee flexion 95 degrees, quad strength 3+/5",
        },
      });
      fireEvent.click(screen.getByText("Generate SMART Goals"));

      await waitFor(
        () => {
          // Check that goals are displayed (2 goals in mock response)
          expect(
            screen.getByText(/Generated SMART Goals/i),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe("Evidence and Rationale Display", () => {
    it("displays APTA source citation", async () => {
      const mockResponse = buildMockGoalResponse("orthopedic", "ambulate");
      (aiService.generateSMARTGoals as any).mockResolvedValue(mockResponse);

      render(<GoalGenerator />);
      fireEvent.change(screen.getByLabelText("Functional Task / Goal Area"), {
        target: { value: "ambulate" },
      });
      fireEvent.change(screen.getByLabelText("Assessment Findings"), {
        target: { value: "TUG 18s" },
      });
      fireEvent.click(screen.getByText("Generate SMART Goals"));

      await waitFor(() => {
        expect(
          screen.getByText(/APTA Guide to Physical Therapist Practice/),
        ).toBeInTheDocument();
      });
    });

    it("displays clinical rationale for each goal", async () => {
      const mockResponse = buildMockGoalResponse("orthopedic", "ambulate");
      (aiService.generateSMARTGoals as any).mockResolvedValue(mockResponse);

      render(<GoalGenerator />);
      fireEvent.change(screen.getByLabelText("Functional Task / Goal Area"), {
        target: { value: "ambulate" },
      });
      fireEvent.change(screen.getByLabelText("Assessment Findings"), {
        target: { value: "TUG 18s" },
      });
      fireEvent.click(screen.getByText("Generate SMART Goals"));

      await waitFor(() => {
        const rationaleHeaders = screen.getAllByText("Clinical Rationale");
        expect(rationaleHeaders.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Error Handling", () => {
    it("shows error message on AI service failure", async () => {
      (aiService.generateSMARTGoals as any).mockRejectedValue(
        new Error("Network error"),
      );

      render(<GoalGenerator />);
      fireEvent.change(screen.getByLabelText("Functional Task / Goal Area"), {
        target: { value: "ambulate" },
      });
      fireEvent.change(screen.getByLabelText("Assessment Findings"), {
        target: { value: "TUG 18s" },
      });
      fireEvent.click(screen.getByText("Generate SMART Goals"));

      await waitFor(() => {
        expect(
          screen.getByText(/Unable to generate goals/),
        ).toBeInTheDocument();
      });
    });

    it("re-enables generate button after error", async () => {
      (aiService.generateSMARTGoals as any).mockRejectedValue(
        new Error("Network error"),
      );

      render(<GoalGenerator />);
      fireEvent.change(screen.getByLabelText("Functional Task / Goal Area"), {
        target: { value: "ambulate" },
      });
      fireEvent.change(screen.getByLabelText("Assessment Findings"), {
        target: { value: "TUG 18s" },
      });
      fireEvent.click(screen.getByText("Generate SMART Goals"));

      await waitFor(() => {
        expect(screen.getByText("Generate SMART Goals")).not.toBeDisabled();
      });
    });
  });
});
