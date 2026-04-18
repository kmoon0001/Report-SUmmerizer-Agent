import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExplainableText } from "./ExplainableText";

// Mock framer-motion since it uses requestAnimationFrame and complex browser APIs
vi.mock("motion/react", () => ({
  motion: {
    span: ({ children, className, style, title }: any) => (
      <span className={className} style={style} title={title}>
        {children}
      </span>
    ),
  },
}));

describe("ExplainableText Component (Deep Attribution)", () => {
  const sampleText = "The patient shows significant cognitive decline.";
  const sampleAttributions = {
    cognitive: 0.85,
    decline: 0.72,
    patient: 0.1,
  };

  it("renders the provided text correctly", () => {
    render(
      <ExplainableText text={sampleText} attributions={sampleAttributions} />,
    );
    expect(screen.getByText(/cognitive/i)).toBeDefined();
    expect(screen.getByText(/decline/i)).toBeDefined();
  });

  it("applies highlights and tooltips based on attribution importance", () => {
    render(
      <ExplainableText text={sampleText} attributions={sampleAttributions} />,
    );

    // Check if high-importance words have correct title (tooltip message)
    // The punctuation '.' is now stripped for lookup, so 'decline.' matches 'decline'
    const cognitiveToken = screen.getByTitle("Importance: 0.85");
    const declineToken = screen.getByTitle("Importance: 0.72");

    expect(cognitiveToken).toBeDefined();
    expect(declineToken).toBeDefined();
  });

  it("renders neutral text without highlighting", () => {
    render(<ExplainableText text="Normal baseline" attributions={{}} />);

    // Tokens with 0 weight shouldn't have the Importance title
    const normalToken = screen.queryByTitle(/Importance:/);
    expect(normalToken).toBeNull();
  });
});
