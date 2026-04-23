import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AIAssistant } from "./AIAssistant";
import * as AIContextModule from "../context/AIContext";
import { aiService } from "../services/ai-service";

// Mock aiService
vi.mock("../services/ai-service", () => ({
  aiService: {
    generateContentStream: vi.fn(),
  },
}));

describe("AIAssistant Component", () => {
  const mockToggleAI = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AIContextModule, "useAI").mockReturnValue({
      isAIActive: true,
      toggleAI: mockToggleAI,
      context: "Test Context",
      setContext: vi.fn(),
      history: [],
      addToHistory: vi.fn(),
      suggestions: [],
      setSuggestions: vi.fn(),
      clearHistory: vi.fn(),
      features: {
        advancedAI: true,
        googleCloud: true,
        microsoftCopilot: false,
        localLLM: false,
        anthropic: false,
        browserAI: false,
        openai: false,
      },
      toggleFeature: vi.fn(),
    });
  });

  it("does not render when isAIActive is false", () => {
    vi.spyOn(AIContextModule, "useAI").mockReturnValueOnce({
      isAIActive: false,
      toggleAI: mockToggleAI,
      context: "Test Context",
      setContext: vi.fn(),
      history: [],
      addToHistory: vi.fn(),
      suggestions: [],
      setSuggestions: vi.fn(),
      clearHistory: vi.fn(),
      features: {
        advancedAI: true,
        googleCloud: true,
        microsoftCopilot: false,
        localLLM: false,
        anthropic: false,
        browserAI: false,
        openai: false,
      },
      toggleFeature: vi.fn(),
    });
    render(<AIAssistant />);
    expect(screen.queryByText("Clinical Copilot")).toBeNull();
  });

  it("renders correctly when isAIActive is true", () => {
    render(<AIAssistant />);
    expect(screen.getByText("Clinical Copilot")).toBeInTheDocument();
    expect(
      screen.getByText(/Hello! I'm your Clinical Support Assistant/i),
    ).toBeInTheDocument();
  });

  it("calls toggleAI when close button is clicked", () => {
    render(<AIAssistant />);
    // The close button has an X icon, we can find it by its role or class.
    // It's a button inside the header.
    const closeButton = screen.getAllByRole("button")[0];
    if (!closeButton) throw new Error("Close button not found");
    fireEvent.click(closeButton);
    expect(mockToggleAI).toHaveBeenCalled();
  });

  it("sends a message and receives a response", async () => {
    // Mock the async generator for generateContentStream
    async function* mockStream() {
      yield "Hello ";
      yield "World!";
    }
    vi.mocked(aiService.generateContentStream).mockReturnValue(
      mockStream() as any,
    );

    render(<AIAssistant />);

    // Find input by placeholder
    const input = screen.getByPlaceholderText(
      /Ask for resources/i,
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    // Type message
    fireEvent.change(input, { target: { value: "Test message" } });
    expect(input.value).toBe("Test message");

    // Find and click send button (look for button near the input)
    const buttons = screen.getAllByRole("button");
    const sendButton = buttons[buttons.length - 1]; // Last button is usually send

    fireEvent.click(sendButton!);

    // Verify message was sent
    await waitFor(
      () => {
        expect(aiService.generateContentStream).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );
  });
});
