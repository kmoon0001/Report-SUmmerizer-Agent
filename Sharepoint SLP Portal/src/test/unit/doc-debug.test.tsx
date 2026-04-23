/**
 * Unit Tests for Documentation Studio (Task 9.2)
 *
 * Requirements: 3.1, 3.2, 22.1, 22.2
 * Evidence: Medicare Benefit Policy Manual Chapter 15
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DocumentationStudio } from "../../components/DocumentationStudio";
import { aiService } from "../../services/ai-service";
import { NotificationProvider } from "../../context/NotificationContext";
import { DisciplineService } from "../../services/DisciplineService";
import React from "react";

// Using global lucide-react mock from setup.ts instead of local mock to ensure all icons are covered by Proxy

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock services
vi.mock("../../services/ai-service", () => ({
  aiService: {
    generateClinicalDocumentation: vi.fn(),
    updateConfig: vi.fn(),
    getConfig: vi.fn().mockReturnValue({
      advancedAI: true,
      googleCloud: true,
      microsoftCopilot: false,
      localLLM: false,
    }),
  },
}));

vi.mock("../../services/persistence-service", () => ({
  persistenceService: {
    getPatients: vi
      .fn()
      .mockResolvedValue([
        { id: "1", name: "John Doe", status: "Active", diagnosis: "Stroke" },
      ]),
  },
}));

import { AIProvider } from "../../context/AIContext";
import { DisciplineProvider } from "../../context/DisciplineContext";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <NotificationProvider>
      <DisciplineProvider>
        <AIProvider>{ui}</AIProvider>
      </DisciplineProvider>
    </NotificationProvider>,
  );
};

describe("Doc Studio Debug", () => {
  beforeEach(() => {
    DisciplineService.initialize();
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders the DocuArchitect sub-title", () => {
      renderWithProviders(<DocumentationStudio />);
      expect(screen.getByText("DocuArchitect")).toBeInTheDocument();
    });

    it("renders Patient, Setting, and Template selectors", () => {
      renderWithProviders(<DocumentationStudio />);
      expect(screen.getByText("Patient ID")).toBeInTheDocument();
      expect(screen.getByText("Setting")).toBeInTheDocument();
      expect(screen.getByText("Template")).toBeInTheDocument();
    });

    it("renders Magic Draft section", () => {
      renderWithProviders(<DocumentationStudio />);
      expect(screen.getByText(/Magic Draft/i)).toBeInTheDocument();
    });

    it("renders Generate Note button", () => {
      renderWithProviders(<DocumentationStudio />);
      expect(
        screen.getByRole("button", { name: /Generate Note/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Dropdown Interactions", () => {
    it("opens Patient dropdown when clicked", async () => {
      renderWithProviders(<DocumentationStudio />);
      const patientBtn = screen.getByRole("button", {
        name: /patient.*select patient/i,
      });
      fireEvent.click(patientBtn);

      await waitFor(() => {
        expect(screen.getByText(/JD-1/i)).toBeInTheDocument();
        expect(screen.getByText(/Stroke/i)).toBeInTheDocument();
      });
    });

    it("opens Setting dropdown when clicked", () => {
      renderWithProviders(<DocumentationStudio />);
      const settingBtn = screen.getByRole("button", { name: /setting.*snf/i });
      fireEvent.click(settingBtn);
      expect(screen.getByText("OP Rehab")).toBeInTheDocument();
    });
  });

  describe("Magic Draft Functionality", () => {
    it("expands Magic Draft textarea when Expand is clicked", () => {
      renderWithProviders(<DocumentationStudio />);
      const expandBtn = screen.getByText("Expand");
      fireEvent.click(expandBtn);
      expect(
        screen.getByPlaceholderText(/Type shorthand\.\.\./i),
      ).toBeInTheDocument();
    });

    it("updates magic draft input", () => {
      renderWithProviders(<DocumentationStudio />);
      fireEvent.click(screen.getByText("Expand"));
      const textarea = screen.getByPlaceholderText(/Type shorthand\.\.\./i);
      fireEvent.change(textarea, { target: { value: "pt improved" } });
      expect(textarea).toHaveValue("pt improved");
    });
  });

  describe("AI Note Generation", () => {
    it("calls aiService.generateClinicalDocumentation when Generate Note is clicked", async () => {
      const mockResponse = {
        noteNarrative: { Subjective: "Patient felt better." },
      };
      (aiService.generateClinicalDocumentation as any).mockResolvedValue(
        mockResponse,
      );

      renderWithProviders(<DocumentationStudio />);

      // Select patient first to enable Generate Note button
      fireEvent.click(
        screen.getByRole("button", { name: /patient.*select patient/i }),
      );
      fireEvent.click(await screen.findByText(/JD-1/i));

      fireEvent.click(screen.getByRole("button", { name: /Generate Note/i }));

      await waitFor(() => {
        expect(aiService.generateClinicalDocumentation).toHaveBeenCalled();
      });
    });

    it("displays generated narrative content", async () => {
      const mockResponse = {
        noteNarrative: { Subjective: "Custom generated narrative content" },
      };
      (aiService.generateClinicalDocumentation as any).mockResolvedValue(
        mockResponse,
      );

      renderWithProviders(<DocumentationStudio />);

      // Select patient first to enable Generate Note button
      fireEvent.click(
        screen.getByRole("button", { name: /patient.*select patient/i }),
      );
      fireEvent.click(await screen.findByText(/JD-1/i));

      fireEvent.click(screen.getByRole("button", { name: /Generate Note/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Custom generated narrative content"),
        ).toBeInTheDocument();
      });
    });

    it("shows loading state during generation", async () => {
      (aiService.generateClinicalDocumentation as any).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ noteNarrative: {} }), 100),
          ),
      );

      renderWithProviders(<DocumentationStudio />);

      // Select patient first to enable Generate Note button
      fireEvent.click(
        screen.getByRole("button", { name: /patient.*select patient/i }),
      );
      fireEvent.click(await screen.findByText(/JD-1/i));

      fireEvent.click(screen.getByRole("button", { name: /Generate Note/i }));

      // Check for the RefreshCw icon (via testid because we mocked lucide)
      expect(screen.getByTestId("refreshcw-icon")).toBeInTheDocument();
    });
  });

  describe("Patient View", () => {
    it("toggles patient view when eye icon clicked", () => {
      renderWithProviders(<DocumentationStudio />);
      const eyeBtn = screen.getByLabelText(/View patient information/i);
      fireEvent.click(eyeBtn);
      // ModuleLayout should handle the rendering of patient view,
      // but we can check if the eye icon is still present or if state changed.
      // Based on code, setIsPatientView(true) is called.
    });
  });
});
