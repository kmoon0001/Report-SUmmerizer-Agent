/**
 * Unit Tests: PT Compliance Center Component
 * Task 15.2 — Requirements: 8.1, 8.4, 8.5, 22.1, 22.2
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PTComplianceCenter } from "../../components/PTComplianceCenter";

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const COMPLIANT_NOTE = `
  Patient presents with right knee OA, pain 5/10, difficulty with stairs and community ambulation.
  Prior level of function: independent community ambulator.
  Patient goals: return to independent ambulation and stair negotiation.
  
  Objective: ROM: knee flexion 95°, extension -5°. Strength: quad 3+/5, hamstring 4/5 MMT.
  Gait speed: 0.7 m/s (10MWT). TUG: 14.2 seconds. Berg Balance: 42/56.
  
  Assessment: Patient presents with knee OA resulting in functional limitations.
  Skilled physical therapy required for therapeutic exercise requiring clinical judgment and
  neuromuscular re-education for balance training. Progress toward goals: improved from
  moderate assist to minimal assist for stair negotiation.
  
  Plan: Therapeutic exercise (97110) 3x/week × 6 weeks. Manual therapy (97140) for joint mobilization.
  Short-term goals (4 weeks): ambulate 150 feet with walker, minimal assist.
  Long-term goals (8 weeks): independent community ambulation.
  Patient education: HEP provided with written instructions.
`;

const NON_COMPLIANT_NOTE = `
  Patient continues with therapy. Tolerated well. Good session.
  Patient did well with exercises. Progressing.
`;

describe("PTComplianceCenter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders the PT Compliance Center title", () => {
      render(<PTComplianceCenter />);
      expect(screen.getByText("PT Compliance Center")).toBeInTheDocument();
    });

    it("renders CMS Chapter 15 reference", () => {
      render(<PTComplianceCenter />);
      expect(screen.getByText(/CMS Chapter 15/)).toBeInTheDocument();
    });

    it("renders all four tabs", () => {
      render(<PTComplianceCenter />);
      expect(screen.getByText("Medicare Checker")).toBeInTheDocument();
      expect(screen.getByText("CPT Validator")).toBeInTheDocument();
      expect(screen.getByText("Language Library")).toBeInTheDocument();
      expect(screen.getByText("Quality Analyzer")).toBeInTheDocument();
    });

    it("shows Medicare Checker tab by default", () => {
      render(<PTComplianceCenter />);
      expect(
        screen.getByLabelText("Documentation text for compliance check"),
      ).toBeInTheDocument();
    });

    it("renders Reset button", () => {
      render(<PTComplianceCenter />);
      expect(screen.getByTitle("Reset")).toBeInTheDocument();
    });
  });

  describe("Medicare Compliance Checker", () => {
    it("shows documentation textarea", () => {
      render(<PTComplianceCenter />);
      expect(
        screen.getByLabelText("Documentation text for compliance check"),
      ).toBeInTheDocument();
    });

    it("shows Run Medicare Compliance Check button", () => {
      render(<PTComplianceCenter />);
      expect(
        screen.getByLabelText("Run Medicare compliance check"),
      ).toBeInTheDocument();
    });

    it("disables check button when note is empty", () => {
      render(<PTComplianceCenter />);
      expect(
        screen.getByLabelText("Run Medicare compliance check"),
      ).toBeDisabled();
    });

    it("enables check button when note is entered", () => {
      render(<PTComplianceCenter />);
      fireEvent.change(
        screen.getByLabelText("Documentation text for compliance check"),
        {
          target: { value: "Some note text" },
        },
      );
      expect(
        screen.getByLabelText("Run Medicare compliance check"),
      ).not.toBeDisabled();
    });

    it("shows no critical issues for compliant note", () => {
      render(<PTComplianceCenter />);
      fireEvent.change(
        screen.getByLabelText("Documentation text for compliance check"),
        {
          target: { value: COMPLIANT_NOTE },
        },
      );
      fireEvent.click(screen.getByLabelText("Run Medicare compliance check"));
      expect(screen.getByText(/No Critical Issues Found/)).toBeInTheDocument();
    });

    it("shows critical issues for non-compliant note", () => {
      render(<PTComplianceCenter />);
      fireEvent.change(
        screen.getByLabelText("Documentation text for compliance check"),
        {
          target: { value: NON_COMPLIANT_NOTE },
        },
      );
      fireEvent.click(screen.getByLabelText("Run Medicare compliance check"));
      expect(screen.getByText(/Critical Issue/)).toBeInTheDocument();
    });

    it("shows vague language warnings for non-compliant note", () => {
      render(<PTComplianceCenter />);
      fireEvent.change(
        screen.getByLabelText("Documentation text for compliance check"),
        {
          target: { value: NON_COMPLIANT_NOTE },
        },
      );
      fireEvent.click(screen.getByLabelText("Run Medicare compliance check"));
      // Multiple vague language flags may be present (one per pattern detected)
      const vagueLanguageFlags = screen.getAllByText(
        /Vague language detected/i,
      );
      expect(vagueLanguageFlags.length).toBeGreaterThan(0);
    });

    it("shows regulation references in flags", () => {
      render(<PTComplianceCenter />);
      fireEvent.change(
        screen.getByLabelText("Documentation text for compliance check"),
        {
          target: { value: NON_COMPLIANT_NOTE },
        },
      );
      fireEvent.click(screen.getByLabelText("Run Medicare compliance check"));
      expect(screen.getByText(/Regulation:/)).toBeInTheDocument();
      expect(
        screen.getByText(/Medicare Benefit Policy Manual/),
      ).toBeInTheDocument();
    });

    it("shows quality score after compliance check", () => {
      render(<PTComplianceCenter />);
      fireEvent.change(
        screen.getByLabelText("Documentation text for compliance check"),
        {
          target: { value: COMPLIANT_NOTE },
        },
      );
      fireEvent.click(screen.getByLabelText("Run Medicare compliance check"));
      expect(
        screen.getByText("Documentation Quality Score"),
      ).toBeInTheDocument();
    });

    it("shows missing elements in quality score", () => {
      render(<PTComplianceCenter />);
      fireEvent.change(
        screen.getByLabelText("Documentation text for compliance check"),
        {
          target: { value: "Patient has knee pain." },
        },
      );
      fireEvent.click(screen.getByLabelText("Run Medicare compliance check"));
      expect(screen.getByText("Missing Elements:")).toBeInTheDocument();
    });
  });

  describe("CPT Validator Tab", () => {
    it("switches to CPT Validator tab", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("CPT Validator"));
      expect(
        screen.getByLabelText("Intervention description for CPT code lookup"),
      ).toBeInTheDocument();
    });

    it("shows common PT CPT codes", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("CPT Validator"));
      expect(screen.getByText("97110")).toBeInTheDocument();
      expect(screen.getByText("97140")).toBeInTheDocument();
      expect(screen.getByText("97116")).toBeInTheDocument();
      expect(screen.getByText("97112")).toBeInTheDocument();
    });

    it("maps therapeutic exercise to 97110", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("CPT Validator"));
      fireEvent.change(
        screen.getByLabelText("Intervention description for CPT code lookup"),
        {
          target: { value: "therapeutic exercise" },
        },
      );
      fireEvent.click(screen.getByText("Get CPT Code"));
      expect(screen.getByText("CPT 97110")).toBeInTheDocument();
    });

    it("maps manual therapy to 97140", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("CPT Validator"));
      fireEvent.change(
        screen.getByLabelText("Intervention description for CPT code lookup"),
        {
          target: { value: "manual therapy" },
        },
      );
      fireEvent.click(screen.getByText("Get CPT Code"));
      expect(screen.getByText("CPT 97140")).toBeInTheDocument();
    });

    it("maps gait training to 97116", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("CPT Validator"));
      fireEvent.change(
        screen.getByLabelText("Intervention description for CPT code lookup"),
        {
          target: { value: "gait training" },
        },
      );
      fireEvent.click(screen.getByText("Get CPT Code"));
      expect(screen.getByText("CPT 97116")).toBeInTheDocument();
    });

    it("shows no match for unknown intervention", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("CPT Validator"));
      fireEvent.change(
        screen.getByLabelText("Intervention description for CPT code lookup"),
        {
          target: { value: "unknown intervention xyz" },
        },
      );
      fireEvent.click(screen.getByText("Get CPT Code"));
      expect(screen.getByText(/No CPT code match found/)).toBeInTheDocument();
    });
  });

  describe("Language Library Tab", () => {
    it("switches to Language Library tab", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("Language Library"));
      expect(
        screen.getByText("Skilled Need Justification Phrases"),
      ).toBeInTheDocument();
    });

    it("shows skilled need phrases", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("Language Library"));
      expect(
        screen.getByText(/therapeutic exercise requiring skilled monitoring/i),
      ).toBeInTheDocument();
    });

    it("shows vague language replacements", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("Language Library"));
      expect(
        screen.getByText("Vague Language Replacements"),
      ).toBeInTheDocument();
    });

    it("shows regulation references for phrases", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("Language Library"));
      expect(screen.getAllByText(/CMS Chapter 15/).length).toBeGreaterThan(0);
    });
  });

  describe("Quality Analyzer Tab", () => {
    it("switches to Quality Analyzer tab", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("Quality Analyzer"));
      expect(
        screen.getByLabelText("Documentation text for quality analysis"),
      ).toBeInTheDocument();
    });

    it("shows quality score for compliant note", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("Quality Analyzer"));
      fireEvent.change(
        screen.getByLabelText("Documentation text for quality analysis"),
        {
          target: { value: COMPLIANT_NOTE },
        },
      );
      fireEvent.click(screen.getByText("Analyze Documentation Quality"));
      expect(screen.getByText(/Quality Score/)).toBeInTheDocument();
    });

    it("shows strengths for well-documented note", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("Quality Analyzer"));
      fireEvent.change(
        screen.getByLabelText("Documentation text for quality analysis"),
        {
          target: { value: COMPLIANT_NOTE },
        },
      );
      fireEvent.click(screen.getByText("Analyze Documentation Quality"));
      expect(screen.getByText("Strengths")).toBeInTheDocument();
    });

    it("shows areas for improvement for poor note", () => {
      render(<PTComplianceCenter />);
      fireEvent.click(screen.getByText("Quality Analyzer"));
      fireEvent.change(
        screen.getByLabelText("Documentation text for quality analysis"),
        {
          target: { value: "Patient tolerated well." },
        },
      );
      fireEvent.click(screen.getByText("Analyze Documentation Quality"));
      expect(screen.getByText("Areas for Improvement")).toBeInTheDocument();
    });
  });

  describe("Tab Navigation", () => {
    it("switches between all tabs", () => {
      render(<PTComplianceCenter />);
      const tabs: Array<[string, string]> = [
        ["CPT Validator", "Intervention description for CPT code lookup"],
        ["Language Library", "Skilled Need Justification Phrases"],
        ["Quality Analyzer", "Documentation text for quality analysis"],
        ["Medicare Checker", "Documentation text for compliance check"],
      ];

      tabs.forEach(([tabLabel, expectedContent]) => {
        fireEvent.click(screen.getByText(tabLabel));
        expect(
          screen.getByLabelText(expectedContent) ||
            screen.getByText(expectedContent),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Reset Functionality", () => {
    it("clears note text on reset", () => {
      render(<PTComplianceCenter />);
      fireEvent.change(
        screen.getByLabelText("Documentation text for compliance check"),
        {
          target: { value: "Some note text" },
        },
      );
      fireEvent.click(screen.getByTitle("Reset"));
      expect(
        screen.getByLabelText("Documentation text for compliance check"),
      ).toHaveValue("");
    });
  });
});
