import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Dashboard } from "../../components/Dashboard";
import { AIProvider } from "../../context/AIContext";
import { DisciplineProvider } from "../../context/DisciplineContext";
import { DashboardProvider } from "../../context/DashboardContext";
import { DisciplineService } from "../../services/DisciplineService";
import React from "react";

// Using global lucide-react mock from setup.ts instead of local mock to ensure all icons are covered by Proxy

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...p }: any) => <div {...p}>{children}</div>,
    h1: ({ children, ...p }: any) => <h1 {...p}>{children}</h1>,
    p: ({ children, ...p }: any) => <p {...p}>{children}</p>,
    button: ({ children, ...p }: any) => <button {...p}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AIProvider>
      <DisciplineProvider>
        <DashboardProvider>{component}</DashboardProvider>
      </DisciplineProvider>
    </AIProvider>,
  );
};

describe("Dashboard", () => {
  beforeEach(() => {
    DisciplineService.initialize();
    vi.clearAllMocks();
  });

  it("renders without crashing and shows greeting", async () => {
    renderWithProviders(<Dashboard />);
    expect(await screen.findByText(/Kevin Moon/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Moonie's SNF Rehab Therapy Portal v4.2/i),
    ).toBeInTheDocument();
  });

  it("renders 3 glossy quick action buttons", () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText("Clinical AI Copilot")).toBeInTheDocument();
    expect(screen.getByText("New Evaluation")).toBeInTheDocument();
    expect(screen.getByText("Evidence Materials")).toBeInTheDocument();
  });

  it("renders dashboard section nodes", () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Specialty Hubs/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostic Frameworks/i)).toBeInTheDocument();
    expect(screen.getByText(/Intelligence Studios/i)).toBeInTheDocument();
    expect(screen.getByText(/Governance & Integrity/i)).toBeInTheDocument();
    expect(screen.getByText(/Predictive Intelligence/i)).toBeInTheDocument();
  });

  it("navigates to Intelligence Studios section on click", async () => {
    renderWithProviders(<Dashboard />);
    const studioBtn = screen
      .getByText(/Intelligence Studios/i)
      .closest("button")!;
    fireEvent.click(studioBtn);

    expect(
      await screen.findByText(/Return to Central Node/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/High-fidelity AI workspaces/i),
    ).toBeInTheDocument();
  });

  it("renders Predictive Intelligence section with SHAP description", async () => {
    renderWithProviders(<Dashboard />);
    const analyticsBtn = screen
      .getByText(/Predictive Intelligence/i)
      .closest("button")!;
    fireEvent.click(analyticsBtn);

    expect(
      await screen.findByText(/SHAP-driven clinical forecasting/i),
    ).toBeInTheDocument();
  });

  it("renders HIPAA Compliant internal gateway branding in footer", () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Encrypted Logic/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Moonie's SNF Clinical Gateway/i),
    ).toBeInTheDocument();
  });

  it("shows quick evaluation protocol button", () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Quick Protocols/i)).toBeInTheDocument();
  });

  it("has a local AI health monitor with throughput info", () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Local AI Health/i)).toBeInTheDocument();
    expect(screen.getByText(/Model Token Throughput/i)).toBeInTheDocument();
  });
});
