/**
 * Unit Tests: PT Clinical Calculators Component
 * Task 13.2 — Requirements: 15.2, 22.1
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PTClinicalCalculators } from "../../components/PTClinicalCalculators";

vi.mock("../../components/layout/PatientViewWrapper", () => ({
  PatientViewWrapper: ({ children, title, onExit }: any) => (
    <div data-testid="patient-view-wrapper">
      <span>{title}</span>
      <button onClick={onExit}>Exit Patient View</button>
      {children}
    </div>
  ),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("PTClinicalCalculators", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders the calculator sidebar", () => {
      render(<PTClinicalCalculators />);
      expect(screen.getByText("PT Calculators")).toBeInTheDocument();
    });

    it("renders all 14 calculators in sidebar", () => {
      render(<PTClinicalCalculators />);
      expect(screen.getByTestId("calculator-title-bmi")).toBeInTheDocument();
      expect(screen.getByText("Target Heart Rate")).toBeInTheDocument();
      expect(screen.getByText("MET Calculator")).toBeInTheDocument();
      expect(screen.getByText(/VO₂max/)).toBeInTheDocument();
      expect(screen.getByText("6-Minute Walk Test")).toBeInTheDocument();
      expect(screen.getByText("30-Sec Chair Stand")).toBeInTheDocument();
      expect(screen.getByText("Functional Reach Test")).toBeInTheDocument();
      expect(screen.getByText("Single Leg Stance")).toBeInTheDocument();
      expect(screen.getByText("Grip Strength")).toBeInTheDocument();
      expect(screen.getByText("Borg RPE (6-20)")).toBeInTheDocument();
      expect(screen.getByText("Modified Borg Dyspnea")).toBeInTheDocument();
      expect(screen.getByText("Gait Speed (10MWT)")).toBeInTheDocument();
      expect(screen.getByText("Pain NRS (0-10)")).toBeInTheDocument();
      expect(screen.getByText("Timed Up and Go")).toBeInTheDocument();
    });

    it("shows BMI calculator by default", () => {
      render(<PTClinicalCalculators />);
      expect(
        screen.getByText("Body Mass Index – WHO Classification"),
      ).toBeInTheDocument();
    });

    it("renders Calculate button", () => {
      render(<PTClinicalCalculators />);
      expect(screen.getByText("Calculate")).toBeInTheDocument();
    });

    it("renders Reset button", () => {
      render(<PTClinicalCalculators />);
      expect(screen.getByTitle("Reset")).toBeInTheDocument();
    });
  });

  describe("BMI Calculator", () => {
    it("shows weight and height inputs for BMI", () => {
      render(<PTClinicalCalculators />);
      expect(screen.getByLabelText("Weight (kg)")).toBeInTheDocument();
      expect(screen.getByLabelText("Height (cm)")).toBeInTheDocument();
    });

    it("calculates BMI and shows result", () => {
      render(<PTClinicalCalculators />);
      fireEvent.change(screen.getByLabelText("Weight (kg)"), {
        target: { value: "70" },
      });
      fireEvent.change(screen.getByLabelText("Height (cm)"), {
        target: { value: "170" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      // BMI = 70 / (1.7^2) = 24.2
      expect(screen.getByText("24.2")).toBeInTheDocument();
      expect(screen.getByText("Normal weight")).toBeInTheDocument();
    });

    it("shows WHO citation for BMI", () => {
      render(<PTClinicalCalculators />);
      fireEvent.change(screen.getByLabelText("Weight (kg)"), {
        target: { value: "70" },
      });
      fireEvent.change(screen.getByLabelText("Height (cm)"), {
        target: { value: "170" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      expect(screen.getByTestId("calculator-citation-bmi")).toHaveTextContent(
        /WHO/,
      );
    });

    it("shows error for invalid BMI inputs", () => {
      render(<PTClinicalCalculators />);
      fireEvent.change(screen.getByLabelText("Weight (kg)"), {
        target: { value: "-5" },
      });
      fireEvent.change(screen.getByLabelText("Height (cm)"), {
        target: { value: "170" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      expect(screen.getByText(/Invalid input/i)).toBeInTheDocument();
    });

    it("shows obese classification for high BMI", () => {
      render(<PTClinicalCalculators />);
      fireEvent.change(screen.getByLabelText("Weight (kg)"), {
        target: { value: "120" },
      });
      fireEvent.change(screen.getByLabelText("Height (cm)"), {
        target: { value: "170" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      expect(
        screen.getByTestId("calculator-interpretation-bmi"),
      ).toHaveTextContent(/Obese/);
    });
  });

  describe("Target Heart Rate Calculator", () => {
    it("switches to THR calculator", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Target Heart Rate"));
      expect(
        screen.getByText("Karvonen Formula – Heart Rate Zones"),
      ).toBeInTheDocument();
    });

    it("shows age and resting HR inputs", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Target Heart Rate"));
      expect(screen.getByLabelText("Age (years)")).toBeInTheDocument();
      expect(screen.getByLabelText("Resting HR (bpm)")).toBeInTheDocument();
    });

    it("calculates heart rate zones", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Target Heart Rate"));
      fireEvent.change(screen.getByLabelText("Age (years)"), {
        target: { value: "65" },
      });
      fireEvent.change(screen.getByLabelText("Resting HR (bpm)"), {
        target: { value: "70" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      expect(screen.getByText("light")).toBeInTheDocument();
      expect(screen.getByText("moderate")).toBeInTheDocument();
      expect(screen.getByText("vigorous")).toBeInTheDocument();
    });

    it("shows Karvonen citation", () => {
      render(<PTClinicalCalculators />);
      expect(screen.getByText(/Karvonen 1957/)).toBeInTheDocument();
    });
  });

  describe("Gait Speed Calculator", () => {
    it("switches to gait speed calculator", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Gait Speed (10MWT)"));
      expect(
        screen.getByText("Functional Ambulation – Fritz & Lusardi Categories"),
      ).toBeInTheDocument();
    });

    it("shows gait speed input", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Gait Speed (10MWT)"));
      expect(screen.getByLabelText("Gait Speed (m/s)")).toBeInTheDocument();
    });

    it("interprets community ambulator speed", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Gait Speed (10MWT)"));
      fireEvent.change(screen.getByLabelText("Gait Speed (m/s)"), {
        target: { value: "1.3" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      expect(screen.getByText(/Community ambulator/)).toBeInTheDocument();
    });

    it("shows MCID for gait speed", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Gait Speed (10MWT)"));
      fireEvent.change(screen.getByLabelText("Gait Speed (m/s)"), {
        target: { value: "0.8" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      expect(
        screen.getByTestId("calculator-mcid-gait-speed"),
      ).toBeInTheDocument();
    });

    it("shows Fritz citation", () => {
      render(<PTClinicalCalculators />);
      expect(screen.getByText(/Fritz 2009/)).toBeInTheDocument();
    });
  });

  describe("Pain NRS Calculator", () => {
    it("switches to pain NRS calculator", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Pain NRS (0-10)"));
      expect(
        screen.getByText("Numeric Rating Scale – Farrar MCID"),
      ).toBeInTheDocument();
    });

    it("shows pain score input", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Pain NRS (0-10)"));
      expect(screen.getByLabelText("Pain Score (0-10)")).toBeInTheDocument();
    });

    it("interprets moderate pain", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Pain NRS (0-10)"));
      fireEvent.change(screen.getByLabelText("Pain Score (0-10)"), {
        target: { value: "5" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      expect(screen.getByText("Moderate pain")).toBeInTheDocument();
    });

    it("shows MCID of 2 points", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Pain NRS (0-10)"));
      fireEvent.change(screen.getByLabelText("Pain Score (0-10)"), {
        target: { value: "5" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      expect(
        screen.getByTestId("calculator-mcid-pain-nrs"),
      ).toBeInTheDocument();
    });
  });

  describe("TUG Calculator", () => {
    it("switches to TUG calculator", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Timed Up and Go"));
      expect(
        screen.getByText("Mobility & Fall Risk – Shumway-Cook Cutoffs"),
      ).toBeInTheDocument();
    });

    it("shows time input for TUG", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Timed Up and Go"));
      expect(screen.getByLabelText("Time (seconds)")).toBeInTheDocument();
    });

    it("shows Podsiadlo citation", () => {
      render(<PTClinicalCalculators />);
      expect(screen.getByText(/Podsiadlo 1991/)).toBeInTheDocument();
    });
  });

  describe("Calculator Navigation", () => {
    it("switches between calculators", () => {
      render(<PTClinicalCalculators />);
      fireEvent.click(screen.getByText("Grip Strength"));
      expect(
        screen.getByText("Hand Strength – Mathiowetz Normative Values"),
      ).toBeInTheDocument();
      fireEvent.click(screen.getByText("BMI"));
      expect(
        screen.getByText("Body Mass Index – WHO Classification"),
      ).toBeInTheDocument();
    });

    it("resets result when switching calculators", () => {
      render(<PTClinicalCalculators />);
      fireEvent.change(screen.getByLabelText("Weight (kg)"), {
        target: { value: "70" },
      });
      fireEvent.change(screen.getByLabelText("Height (cm)"), {
        target: { value: "170" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      expect(screen.getByText("24.2")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Gait Speed (10MWT)"));
      expect(screen.queryByText("24.2")).not.toBeInTheDocument();
    });

    it("highlights active calculator in sidebar", () => {
      render(<PTClinicalCalculators />);
      const bmiButton = screen.getAllByText("BMI")[0];
      expect(bmiButton.closest("button")).toHaveClass("bg-blue-50");
    });
  });

  describe("Reset Functionality", () => {
    it("clears inputs and result on reset", () => {
      render(<PTClinicalCalculators />);
      fireEvent.change(screen.getByLabelText("Weight (kg)"), {
        target: { value: "70" },
      });
      fireEvent.change(screen.getByLabelText("Height (cm)"), {
        target: { value: "170" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      fireEvent.click(screen.getByTitle("Reset"));
      expect(screen.queryByText("24.2")).not.toBeInTheDocument();
    });
  });

  describe("Clinical Note Display", () => {
    it("shows clinical note after calculation", () => {
      render(<PTClinicalCalculators />);
      fireEvent.change(screen.getByLabelText("Weight (kg)"), {
        target: { value: "70" },
      });
      fireEvent.change(screen.getByLabelText("Height (cm)"), {
        target: { value: "170" },
      });
      fireEvent.click(screen.getByText("Calculate"));
      expect(screen.getByText("Clinical Note")).toBeInTheDocument();
    });
  });
});
