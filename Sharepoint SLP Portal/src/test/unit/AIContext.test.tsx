import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AIProvider, useAI } from "../../context/AIContext";

vi.mock("../../services/ai-service", () => ({
  aiService: { updateConfig: vi.fn() },
}));

const TestConsumer: React.FC = () => {
  const ai = useAI();
  return (
    <div>
      <span data-testid="active">{String(ai.isAIActive)}</span>
      <span data-testid="context">{ai.context}</span>
      <span data-testid="history">{ai.history.length}</span>
      <span data-testid="suggestions">{ai.suggestions.length}</span>
      <span data-testid="advancedAI">{String(ai.features.advancedAI)}</span>
      <button onClick={ai.toggleAI}>toggle</button>
      <button onClick={() => ai.setContext("orthopedic")}>setCtx</button>
      <button onClick={() => ai.addToHistory("user", "hello")}>
        addHistory
      </button>
      <button onClick={() => ai.setSuggestions(["a", "b"])}>
        setSuggestions
      </button>
      <button onClick={() => ai.toggleFeature("advancedAI")}>
        toggleFeature
      </button>
    </div>
  );
};

describe("AIContext", () => {
  it("provides default values", () => {
    render(
      <AIProvider>
        <TestConsumer />
      </AIProvider>,
    );
    expect(screen.getByTestId("active").textContent).toBe("false");
    expect(screen.getByTestId("context").textContent).toBe("dashboard");
    expect(screen.getByTestId("history").textContent).toBe("0");
    expect(screen.getByTestId("advancedAI").textContent).toBe("true");
  });

  it("toggleAI flips isAIActive", () => {
    render(
      <AIProvider>
        <TestConsumer />
      </AIProvider>,
    );
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("active").textContent).toBe("true");
  });

  it("setContext updates context", () => {
    render(
      <AIProvider>
        <TestConsumer />
      </AIProvider>,
    );
    fireEvent.click(screen.getByText("setCtx"));
    expect(screen.getByTestId("context").textContent).toBe("orthopedic");
  });

  it("addToHistory adds a message", () => {
    render(
      <AIProvider>
        <TestConsumer />
      </AIProvider>,
    );
    fireEvent.click(screen.getByText("addHistory"));
    expect(screen.getByTestId("history").textContent).toBe("1");
  });

  it("setSuggestions updates suggestions", () => {
    render(
      <AIProvider>
        <TestConsumer />
      </AIProvider>,
    );
    fireEvent.click(screen.getByText("setSuggestions"));
    expect(screen.getByTestId("suggestions").textContent).toBe("2");
  });

  it("toggleFeature flips a feature flag", () => {
    render(
      <AIProvider>
        <TestConsumer />
      </AIProvider>,
    );
    fireEvent.click(screen.getByText("toggleFeature"));
    expect(screen.getByTestId("advancedAI").textContent).toBe("false");
  });

  it("useAI throws outside provider", () => {
    const BadConsumer = () => {
      useAI();
      return null;
    };
    expect(() => render(<BadConsumer />)).toThrow(
      "useAI must be used within an AIProvider",
    );
  });
});
