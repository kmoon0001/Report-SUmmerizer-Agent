import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../../App";

// Mock all providers and heavy components
vi.mock("../../context/AIContext", () => ({
  AIProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ai-provider">{children}</div>
  ),
  useAI: () => ({
    features: { advancedAI: true, googleCloud: true, localLLM: false },
    toggleFeature: vi.fn(),
  }),
}));

vi.mock("../../context/ClinicalSafetyContext", () => ({
  ClinicalSafetyProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="safety-provider">{children}</div>
  ),
  useClinicalSafety: () => ({
    issues: [],
    addIssue: vi.fn(),
    dismissIssue: vi.fn(),
    clearAllIssues: vi.fn(),
  }),
}));

vi.mock("../../context/DisciplineContext", () => ({
  DisciplineProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="discipline-provider">{children}</div>
  ),
  useDiscipline: () => ({
    currentDiscipline: "SLP",
    setDiscipline: vi.fn(),
  }),
}));

vi.mock("../../context/NotificationContext", () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="notification-provider">{children}</div>
  ),
}));

vi.mock("../../context/SearchContext", () => ({
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="search-provider">{children}</div>
  ),
}));

vi.mock("../../context/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

describe("App Smoke Test", () => {
  it("renders without crashing", () => {
    // This is a classic smoke test - does the app render its root component without throwing?
    render(<App />);

    // Check if critical elements or providers are rendered
    // Since we mock the providers, App will render the mock div
    expect(screen.getByTestId("ai-provider")).toBeInTheDocument();
    expect(screen.getByTestId("safety-provider")).toBeInTheDocument();
  });
});
