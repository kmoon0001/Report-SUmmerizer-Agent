/**
 * UAT Tests — Clinical Workflow Scenarios
 * Reference: TESTING-STRATEGY.md section 7
 * Requirements: 22.7
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GoalGenerator } from "../../components/GoalGenerator";
import { ClinicalQualityMeasuresHub } from "../../components/ClinicalQualityMeasuresHub";
import { AIProvider } from "../../context/AIContext";
import { DisciplineProvider } from "../../context/DisciplineContext";
import { SearchProvider } from "../../context/SearchContext";
import { NotificationProvider } from "../../context/NotificationContext";
import { DisciplineService } from "../../services/DisciplineService";
import React from "react";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Copy: () => <div data-testid="copy-icon" />,
  Check: () => <div data-testid="check-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Lightbulb: () => <div data-testid="lightbulb-icon" />,
  Cpu: () => <div data-testid="cpu-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  ShieldCheck: () => <div data-testid="shield-icon" />,
  X: () => <div data-testid="x-icon" />,
  BarChart2: () => <div data-testid="bar-chart-icon" />,
  ChevronDown: () => <div data-testid="chevron-down" />,
  ChevronUp: () => <div data-testid="chevron-up" />,
  CheckCircle2: () => <div data-testid="check-circle" />,
  BookOpen: () => <div data-testid="book-open" />,
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...p }: any) => <div {...p}>{children}</div>,
    button: ({ children, ...p }: any) => <button {...p}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("../../services/ai-service", () => ({
  aiService: {
    updateConfig: vi.fn(),
    generateContent: vi.fn().mockResolvedValue(
      JSON.stringify({
        goals: [
          {
            text: "Patient will ambulate 150 feet independently with rolling walker within 4 weeks",
            justification:
              "Based on assessment findings and APTA CPG for orthopedic conditions.",
          },
        ],
      }),
    ),
    generateSMARTGoals: vi.fn().mockResolvedValue({
      goals: [
        {
          text: "Patient will ambulate 150 feet independently with rolling walker within 4 weeks",
          components: {
            specific: "Ambulate 150 feet independently with rolling walker",
            measurable: "150 feet distance",
            achievable: "Current level supports progression",
            relevant: "Required for mobility",
            timeBound: "4 weeks",
          },
          rationale: "Based on assessment findings.",
        },
      ],
    }),
  },
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NotificationProvider>
    <DisciplineProvider>
      <AIProvider>
        <SearchProvider>{children}</SearchProvider>
      </AIProvider>
    </DisciplineProvider>
  </NotificationProvider>
);

describe("UAT: Clinical Workflow — Goal Generation", () => {
  beforeEach(() => {
    DisciplineService.initialize();
  });

  it("clinician generates SMART goal for orthopedic patient", async () => {
    render(
      <Wrapper>
        <GoalGenerator />
      </Wrapper>,
    );

    // Select PT discipline/domain (Default is Swallowing for SLP, but let's assume PT for this test logic)
    // The component defaults based on currentDiscipline from provider

    const findingsInput = screen.getByPlaceholderText(
      /e.g. Pt shows increased anterior loss/i,
    );
    fireEvent.change(findingsInput, {
      target: { value: "ambulation with rolling walker, TUG 18s" },
    });

    const generateBtn = screen.getByRole("button", {
      name: /Engineer SMART Goals/i,
    });
    fireEvent.click(generateBtn);

    await waitFor(
      () => {
        expect(
          screen.getByText(/Patient will ambulate 150 feet/i),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});

describe("UAT: Clinical Workflow — Quality Measures Hub", () => {
  it("clinician opens falls prevention domain and views programs", () => {
    render(
      <Wrapper>
        <ClinicalQualityMeasuresHub />
      </Wrapper>,
    );

    expect(
      screen.getByText(/Clinical Quality Measures Hub/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Falls Prevention/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Falls Prevention/i));
    expect(screen.getByText(/PT Role/i)).toBeInTheDocument();
  });

  it("clinician switches to outcomes tab in domain panel", () => {
    render(
      <Wrapper>
        <ClinicalQualityMeasuresHub />
      </Wrapper>,
    );
    fireEvent.click(screen.getByText(/Falls Prevention/i));

    const outcomesTab = screen.getByRole("button", { name: /outcomes/i });
    fireEvent.click(outcomesTab);
    expect(screen.getByText(/Berg Balance Scale/i)).toBeInTheDocument();
  });

  it("clinician switches to documentation tab in domain panel", () => {
    render(
      <Wrapper>
        <ClinicalQualityMeasuresHub />
      </Wrapper>,
    );
    fireEvent.click(screen.getByText(/Falls Prevention/i));

    const docTab = screen.getByRole("button", { name: /documentation/i });
    fireEvent.click(docTab);
    expect(screen.getByText(/Fall risk level/i)).toBeInTheDocument();
  });

  it("clinician enters MIPS numerator and sees performance rate", () => {
    render(
      <Wrapper>
        <ClinicalQualityMeasuresHub />
      </Wrapper>,
    );

    const numInput = screen.getByLabelText(/Numerator for MIPS 155/i);
    const denInput = screen.getByLabelText(/Denominator for MIPS 155/i);

    fireEvent.change(numInput, { target: { value: "80" } });
    fireEvent.change(denInput, { target: { value: "100" } });

    expect((numInput as HTMLInputElement).value).toBe("80");
    expect((denInput as HTMLInputElement).value).toBe("100");
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("clinician views MIPS documentation checklist", () => {
    render(
      <Wrapper>
        <ClinicalQualityMeasuresHub />
      </Wrapper>,
    );

    const viewButton = screen.getByLabelText(
      /Documentation checklist for MIPS 155/i,
    );
    fireEvent.click(viewButton);

    expect(screen.getByText(/Documentation Checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient age ≥65 documented/i)).toBeInTheDocument();
  });

  it("Quick Ref mode collapses domain descriptions", () => {
    render(
      <Wrapper>
        <ClinicalQualityMeasuresHub />
      </Wrapper>,
    );
    fireEvent.click(screen.getByText(/Quick Ref/i));
    expect(screen.getByText(/Full View/i)).toBeInTheDocument();
  });
});

describe("UAT: Clinical Workflow — Area Specifics", () => {
  it("clinician opens pelvic floor domain and views PFMT programs", () => {
    render(
      <Wrapper>
        <ClinicalQualityMeasuresHub />
      </Wrapper>,
    );

    fireEvent.click(screen.getByText(/Pelvic Floor & Bladder/i));
    expect(screen.getByText(/PT Role/i)).toBeInTheDocument();

    const programsTabs = screen.getAllByRole("button", { name: /programs/i });
    fireEvent.click(programsTabs[0]);
    expect(screen.getByText(/PFMT/i)).toBeInTheDocument();
  });

  it("clinician opens pressure injury domain and views Braden Scale", () => {
    render(
      <Wrapper>
        <ClinicalQualityMeasuresHub />
      </Wrapper>,
    );

    fireEvent.click(screen.getByText(/Pressure Injury Prevention/i));

    const outcomesTabs = screen.getAllByRole("button", { name: /outcomes/i });
    fireEvent.click(outcomesTabs[0]);
    expect(screen.getByText(/Braden Scale/i)).toBeInTheDocument();
  });
});
