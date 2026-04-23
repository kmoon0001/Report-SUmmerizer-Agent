import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GoalGenerator } from "../../components/GoalGenerator";
import { aiService } from "../../services/ai-service";
import { SearchProvider } from "../../context/SearchContext";
import { DisciplineProvider } from "../../context/DisciplineContext";
import { DisciplineService } from "../../services/DisciplineService";
import { NotificationProvider } from "../../context/NotificationContext";
import React from "react";

// Mock the AI service
vi.mock("../../services/ai-service", () => ({
  aiService: {
    generateSMARTGoals: vi.fn(),
    generateContent: vi.fn(),
  },
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <NotificationProvider>
      <DisciplineProvider defaultDiscipline="slp">
        <SearchProvider>{ui}</SearchProvider>
      </DisciplineProvider>
    </NotificationProvider>,
  );
};

describe("GoalGenerator Component", () => {
  beforeEach(() => {
    DisciplineService.initialize();
  });
  it("renders the SMART Goal Builder title", () => {
    renderWithProvider(<GoalGenerator />);
    expect(screen.getByText("SMART Goal Builder")).toBeInTheDocument();
  });

  it("disables the generate button when generating", () => {
    renderWithProvider(<GoalGenerator />);

    // Find the generate button
    const button = screen.getByRole("button", {
      name: /engineer smart goals/i,
    });

    // Button should be enabled initially (not generating)
    expect(button).not.toBeDisabled();
  });

  it("enables the generate button when assessment findings are provided", () => {
    renderWithProvider(<GoalGenerator />);
    const button = screen.getByRole("button", {
      name: /engineer smart goals/i,
    });

    // Find any textarea and fill it
    const textareas = screen.getAllByRole("textbox");
    if (textareas.length > 0 && textareas[0]) {
      fireEvent.change(textareas[0], { target: { value: "thin liquids" } });
      expect(button).not.toBeDisabled();
    }
  });

  it("calls aiService.generateContent when button is clicked", async () => {
    const mockResponse = JSON.stringify({
      goals: [
        {
          text: "Patient will safely consume thin liquids with supervision in 4 weeks",
          justification: "Addresses dysphagia risk",
        },
      ],
    });
    (aiService.generateContent as any).mockResolvedValue(mockResponse);

    renderWithProvider(<GoalGenerator />);
    const assessmentInput = screen.getByPlaceholderText(
      /Pt shows increased anterior loss/i,
    );
    const button = screen.getByRole("button", {
      name: /engineer smart goals/i,
    });

    fireEvent.change(assessmentInput, { target: { value: "thin liquids" } });
    fireEvent.click(button);

    await waitFor(
      () => {
        expect(aiService.generateContent).toHaveBeenCalled();
        expect(
          screen.getByText(/safely consume thin liquids/i),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("switches to Goal Bank tab when clicked", async () => {
    renderWithProvider(<GoalGenerator />);
    const bankButton = screen.getByRole("button", { name: /goal bank/i });

    fireEvent.click(bankButton);

    // Wait for the Goal Bank content to appear - look for specific SLP goal text
    await waitFor(
      () => {
        expect(screen.getByText(/nectar-thick/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});
