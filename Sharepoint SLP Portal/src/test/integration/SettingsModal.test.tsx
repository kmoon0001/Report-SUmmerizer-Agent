import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SettingsModal } from "../../components/SettingsModal";

// Mock the AI Context
const mockToggleFeature = vi.fn();
vi.mock("../../context/AIContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../context/AIContext")>();
  return {
    ...actual,
    useAI: () => ({
      features: { advancedAI: true, googleCloud: true, localLLM: false },
      toggleFeature: mockToggleFeature,
    }),
  };
});

describe("SettingsModal Integration Tests", () => {
  it("renders the modal when isOpen is true", () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        isAdminMode={false}
        onToggleAdmin={vi.fn()}
        isDarkMode={false}
        onToggleDarkMode={vi.fn()}
      />,
    );

    expect(screen.getByText("App Settings")).toBeInTheDocument();
    expect(screen.getByText("Advanced AI Features")).toBeInTheDocument();
  });

  it("does not render the modal when isOpen is false", () => {
    render(
      <SettingsModal
        isOpen={false}
        onClose={vi.fn()}
        isAdminMode={false}
        onToggleAdmin={vi.fn()}
        isDarkMode={false}
        onToggleDarkMode={vi.fn()}
      />,
    );

    expect(screen.queryByText("App Settings")).not.toBeInTheDocument();
  });

  it("calls toggleFeature when a feature toggle is clicked", () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        isAdminMode={false}
        onToggleAdmin={vi.fn()}
        isDarkMode={false}
        onToggleDarkMode={vi.fn()}
      />,
    );

    // Find the toggle button for Advanced AI Features
    const advancedAIToggle = screen
      .getByText("Advanced AI Features")
      .closest("button");
    expect(advancedAIToggle).toBeInTheDocument();

    if (advancedAIToggle) {
      fireEvent.click(advancedAIToggle);
      expect(mockToggleFeature).toHaveBeenCalledWith("advancedAI");
    }
  });
});
