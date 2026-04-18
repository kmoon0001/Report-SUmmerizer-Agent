import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CounterfactualSimulator } from "./CounterfactualSimulator";

// Mock recharts and framer-motion that use a real browser's layout engine
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div style={{ width: 800, height: 600 }}>{children}</div>
  ),
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Cell: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

vi.mock("motion/react", () => ({
  motion: {
    circle: ({ children, className }: any) => (
      <circle className={className}>{children}</circle>
    ),
    div: ({ children, className, style }: any) => (
      <div className={className} style={style}>
        {children}
      </div>
    ),
  },
}));

describe("CounterfactualSimulator Component (Explainable Risk Simulation)", () => {
  it("renders correctly with initial features", () => {
    render(<CounterfactualSimulator />);
    expect(screen.getByText(/Explainable Risk Simulator/)).toBeDefined();
    expect(screen.getByText(/MoCA Cognitive Score/)).toBeDefined();
    expect(screen.getByText(/TUG/)).toBeDefined();
  });

  it("updates the prediction probability when sliders are adjusted", () => {
    render(<CounterfactualSimulator />);

    // Initial probability is around 4-10% based on defaults and baseLogit -2.5
    const initialProb = screen.getByText(/Confidence/i).previousSibling;
    const initialValue = parseInt(initialProb?.textContent || "0");

    // Find the MoCA slider and increase it
    const mocaSlider = screen.getByTitle("Adjust MoCA Cognitive Score");
    fireEvent.change(mocaSlider, { target: { value: "30" } }); // Peak recovery potential

    // Probability should increase
    const updatedProb = screen.getByText(/Confidence/i).previousSibling;
    const updatedValue = parseInt(updatedProb?.textContent || "0");
    expect(updatedValue).toBeGreaterThan(initialValue);
  });

  it("switches targets between recovery and fall-risk correctly", () => {
    render(<CounterfactualSimulator />);

    // Start with recovery
    expect(screen.getByText(/Model: Optimal Recovery/i)).toBeDefined();

    // Switch to fall-risk
    const fallRiskBtn = screen.getByRole("button", { name: /fall risk/i });
    fireEvent.click(fallRiskBtn);

    expect(screen.getByText(/Model: Adverse Fall Risk/i)).toBeDefined();
  });

  it("resets to initial state on reset button click", () => {
    render(<CounterfactualSimulator />);

    const mocaSlider = screen.getByTitle("Adjust MoCA Cognitive Score");
    fireEvent.change(mocaSlider, { target: { value: "30" } });

    // Reset
    const resetBtn = screen.getByTitle("Reset clinical parameters");
    fireEvent.click(resetBtn);

    // Check if slider reset back to default (18)
    expect(mocaSlider).toHaveProperty("value", "18");
  });
});
