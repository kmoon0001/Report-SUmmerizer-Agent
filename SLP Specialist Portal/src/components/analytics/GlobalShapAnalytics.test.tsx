import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GlobalShapAnalytics } from "./GlobalShapAnalytics";

// Mock recharts
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children, data }: any) => (
    <div>
      {data?.map((d: any) => (
        <div key={d.feature}>{d.feature}</div>
      ))}
      {children}
    </div>
  ),
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Cell: () => <div />,
  Tooltip: () => <div />,
  ScatterChart: ({ children }: any) => <div>{children}</div>,
  Scatter: () => <div />,
  ZAxis: () => <div />,
}));

describe("GlobalShapAnalytics Component (Population Explainability)", () => {
  it("renders correctly showing feature importance", () => {
    render(<GlobalShapAnalytics />);
    expect(screen.getByText(/Global Clinical Predictors/)).toBeDefined();
    expect(screen.getByText(/Feature Importance Summary/)).toBeDefined();
  });

  it("filters data by category when clicked", () => {
    render(<GlobalShapAnalytics />);

    // Default show all features
    expect(screen.getByText(/6MWT Distance/)).toBeDefined();

    // Filter by cognitive
    const cognitiveBtn = screen.getByRole("button", { name: /cognitive/i });
    fireEvent.click(cognitiveBtn);

    // Should filter out physical features like 6MWT
    expect(screen.getAllByText(/MoCA Orientation/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/6MWT Distance/i)).toBeNull();
  });

  it("renders risk cohort clusters", () => {
    render(<GlobalShapAnalytics />);
    expect(screen.getByText(/Patient Risk Cohorts/)).toBeDefined();
    expect(screen.getByText(/Optimization Tip/)).toBeDefined();
  });
});
