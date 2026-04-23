import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { logger } from "../../utils/logger";

// Mock logger to prevent console noise during tests
vi.mock("../../utils/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

const ThrowError = () => {
  throw new Error("Test Error");
};

describe("ErrorBoundary", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Safe Content")).toBeInTheDocument();
  });

  it("renders fallback UI when an error occurs", () => {
    // Prevent React from logging the error to console during test
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    // Verify fallback UI is rendered
    const fallbackUI = screen.queryByText("Portal Interrupted");
    expect(fallbackUI).toBeTruthy();

    consoleErrorSpy.mockRestore();
  });

  it("renders custom fallback when provided", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom Fallback</div>}>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom Fallback")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
