/**
 * Unit tests for PatientEducationHub component
 * Tests handout rendering, exercise instructions, home safety checklists,
 * and print-friendly formatting with 14pt+ font sizes.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import PatientEducationHub from "../../components/PatientEducationHub";
import {
  PATIENT_HANDOUTS,
  EXERCISE_INSTRUCTIONS,
  HOME_SAFETY_CHECKLISTS,
  simplifyLanguage,
} from "../../data/patient-education-data";

describe("PatientEducationHub", () => {
  describe("Component Rendering", () => {
    it("should render the hub with all tabs", () => {
      render(<PatientEducationHub />);
      expect(screen.getByText("Education Library")).toBeInTheDocument();
      expect(screen.getByText("📄")).toBeInTheDocument();
      expect(screen.getByText("💪")).toBeInTheDocument();
      expect(screen.getByText("🏠")).toBeInTheDocument();
    });

    it("should render patient view with simplified description", () => {
      render(<PatientEducationHub patientView={true} />);
      expect(screen.getByText("Your Education Pack")).toBeInTheDocument();
      expect(
        screen.getByText(/Your therapist has provided/),
      ).toBeInTheDocument();
    });

    it("should render handouts tab by default", () => {
      render(<PatientEducationHub />);
      const handoutsTab = screen.getAllByRole("tab")[0]!;
      expect(handoutsTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Handouts Tab", () => {
    it("should display all handouts as cards", () => {
      render(<PatientEducationHub />);
      PATIENT_HANDOUTS.forEach((handout) => {
        expect(screen.getByText(handout.title)).toBeInTheDocument();
      });
    });

    it("should show handout metadata (reading time, font size)", () => {
      render(<PatientEducationHub />);
      const firstHandout = PATIENT_HANDOUTS[0]!;
      expect(
        screen.getByText(`${firstHandout.estimatedReadingTime} min read`),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`${firstHandout.fontSizePt}pt font`),
      ).toBeInTheDocument();
    });

    it("should open handout detail view on click", () => {
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);
      expect(screen.getByText("← Back to Handouts")).toBeInTheDocument();
      expect(
        screen.getByText(PATIENT_HANDOUTS[0]!.description),
      ).toBeInTheDocument();
    });

    it("should display handout sections with correct types", () => {
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);

      PATIENT_HANDOUTS[0]!.content.forEach((section) => {
        expect(screen.getByText(section.heading)).toBeInTheDocument();
      });
    });

    it("should render list items correctly", () => {
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);

      const listSection = PATIENT_HANDOUTS[0]!.content.find(
        (s) => s.type === "list",
      );
      if (listSection && listSection.items) {
        listSection.items.forEach((item) => {
          expect(screen.getByText(item)).toBeInTheDocument();
        });
      }
    });

    it("should render numbered steps correctly", () => {
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);

      const stepsSection = PATIENT_HANDOUTS[0]!.content.find(
        (s) => s.type === "steps",
      );
      if (stepsSection && stepsSection.items) {
        stepsSection.items.forEach((item, idx) => {
          expect(screen.getByText(item)).toBeInTheDocument();
        });
      }
    });

    it("should display warning sections with alert icon", () => {
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);

      const warningSection = PATIENT_HANDOUTS[0]!.content.find(
        (s) => s.type === "warning",
      );
      if (warningSection) {
        expect(screen.getByText(warningSection.content)).toBeInTheDocument();
      }
    });

    it("should have print button in detail view", () => {
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);
      expect(screen.getByText("Print Handout")).toBeInTheDocument();
      expect(screen.getByText("Save as PDF")).toBeInTheDocument();
    });

    it("should return to handouts list on back button click", () => {
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);
      const backButton = screen.getByText("← Back to Handouts");
      fireEvent.click(backButton);
      expect(screen.queryByText("← Back to Handouts")).not.toBeInTheDocument();
    });

    it("should have 14pt+ font size in detail view", () => {
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);
      const title = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      expect(title).toHaveStyle({ fontSize: "24pt" });
    });
  });

  describe("Exercises Tab", () => {
    beforeEach(() => {
      render(<PatientEducationHub />);
      const exercisesTab = screen.getAllByRole("tab")[1]!;
      fireEvent.click(exercisesTab);
    });

    it("should display all exercises as cards", () => {
      EXERCISE_INSTRUCTIONS.forEach((exercise) => {
        expect(screen.getByText(exercise.name)).toBeInTheDocument();
      });
    });

    it("should show exercise metadata (frequency, difficulty)", () => {
      const firstExercise = EXERCISE_INSTRUCTIONS[0]!;
      expect(screen.getByText(firstExercise.frequency)).toBeInTheDocument();
      expect(
        screen.getAllByText(firstExercise.difficulty, { exact: false })[0],
      ).toBeInTheDocument();
    });

    it("should open exercise detail view on click", () => {
      const exerciseButton = screen.getByText(EXERCISE_INSTRUCTIONS[0]!.name);
      fireEvent.click(exerciseButton);
      expect(screen.getByText("← Back to Exercises")).toBeInTheDocument();
      expect(
        screen.getByText(EXERCISE_INSTRUCTIONS[0]!.description),
      ).toBeInTheDocument();
    });

    it("should display exercise steps in numbered list", () => {
      const exerciseButton = screen.getByText(EXERCISE_INSTRUCTIONS[0]!.name);
      fireEvent.click(exerciseButton);

      EXERCISE_INSTRUCTIONS[0]!.steps.forEach((step, idx) => {
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });

    it("should display precautions with warning styling", () => {
      const exerciseButton = screen.getByText(EXERCISE_INSTRUCTIONS[0]!.name);
      fireEvent.click(exerciseButton);
      expect(screen.getByText("Important Safety Tips")).toBeInTheDocument();

      EXERCISE_INSTRUCTIONS[0]!.precautions.forEach((precaution) => {
        expect(screen.getByText(precaution)).toBeInTheDocument();
      });
    });

    it("should display modifications section", () => {
      const exerciseButton = screen.getByText(EXERCISE_INSTRUCTIONS[0]!.name);
      fireEvent.click(exerciseButton);
      expect(
        screen.getByText("Easier Ways to Do this Exercise"),
      ).toBeInTheDocument();

      EXERCISE_INSTRUCTIONS[0]!.modifications.forEach((mod) => {
        expect(screen.getByText(mod)).toBeInTheDocument();
      });
    });

    it("should display when to stop symptoms", () => {
      const exerciseButton = screen.getByText(EXERCISE_INSTRUCTIONS[0]!.name);
      fireEvent.click(exerciseButton);
      expect(screen.getByText("Stop if You Feel:")).toBeInTheDocument();

      EXERCISE_INSTRUCTIONS[0]!.whenToStop.forEach((symptom) => {
        expect(screen.getByText(symptom)).toBeInTheDocument();
      });
    });

    it("should show quick info grid (frequency, duration, difficulty)", () => {
      const exerciseButton = screen.getByText(EXERCISE_INSTRUCTIONS[0]!.name);
      fireEvent.click(exerciseButton);
      expect(screen.getByText("Frequency")).toBeInTheDocument();
      expect(screen.getByText("Duration")).toBeInTheDocument();
      expect(screen.getByText("Difficulty")).toBeInTheDocument();
    });

    it("should return to exercises list on back button click", () => {
      const exerciseButton = screen.getByText(EXERCISE_INSTRUCTIONS[0]!.name);
      fireEvent.click(exerciseButton);
      const backButton = screen.getByText("← Back to Exercises");
      fireEvent.click(backButton);
      expect(screen.queryByText("← Back to Exercises")).not.toBeInTheDocument();
    });
  });

  describe("Home Safety Tab", () => {
    beforeEach(() => {
      render(<PatientEducationHub />);
      const safetyTab = screen.getAllByRole("tab")[2]!;
      fireEvent.click(safetyTab);
    });

    it("should display all safety checklists", () => {
      HOME_SAFETY_CHECKLISTS.forEach((checklist) => {
        expect(screen.getByText(checklist.title)).toBeInTheDocument();
      });
    });

    it("should display all checklist items", () => {
      HOME_SAFETY_CHECKLISTS.forEach((checklist) => {
        checklist.items.forEach((item) => {
          expect(screen.getByText(item.task)).toBeInTheDocument();
        });
      });
    });

    it("should toggle checklist items on click", { timeout: 10000 }, () => {
      const firstItem = HOME_SAFETY_CHECKLISTS[0]!.items[0]!;
      const checkbox = screen.getByRole("checkbox", {
        name: new RegExp(firstItem.task),
      });
      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("should show priority indicators", () => {
      expect(screen.getByText(/High/i)).toBeInTheDocument();
      expect(screen.getByText(/Medium/i)).toBeInTheDocument();
      expect(screen.getByText(/Low/i)).toBeInTheDocument();
    });

    it("should update progress bar when items are checked", () => {
      const checkboxes = screen.getAllByRole("checkbox");
      const firstCheckbox = checkboxes[0]!;
      fireEvent.click(firstCheckbox);

      const progressText = screen.getByText(/1 \/ /);
      expect(progressText).toBeInTheDocument();
    });

    it("should calculate progress correctly", () => {
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]!);
      fireEvent.click(checkboxes[1]!);

      const progressText = screen.getByText(/2 \/ /);
      expect(progressText).toBeInTheDocument();
    });

    it("should apply strikethrough to completed items", () => {
      const firstItem = HOME_SAFETY_CHECKLISTS[0]!.items[0]!;
      const checkbox = screen.getByRole("checkbox", {
        name: new RegExp(firstItem.task),
      });
      fireEvent.click(checkbox);

      const label = checkbox.closest("label");
      const taskText = within(label!).getByText(firstItem.task);
      expect(taskText).toHaveClass("line-through");
    });
  });

  describe("Tab Navigation", () => {
    it("should switch between tabs", () => {
      render(<PatientEducationHub />);

      // Start on handouts
      expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
        "aria-selected",
        "true",
      );

      // Switch to exercises
      fireEvent.click(screen.getAllByRole("tab")[1]!);
      expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
        "aria-selected",
        "true",
      );

      // Switch to safety
      fireEvent.click(screen.getAllByRole("tab")[2]!);
      expect(screen.getAllByRole("tab")[2]).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
  });

  describe("Font Size Compliance", () => {
    it("should have 14pt+ font in handout content", () => {
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);

      const content = screen.getByText(PATIENT_HANDOUTS[0]!.content[0]!.heading);
      expect(content).toHaveStyle({ fontSize: "18pt" });
    });

    it("should have 14pt+ font in exercise instructions", () => {
      render(<PatientEducationHub />);
      const exercisesTab = screen.getAllByRole("tab")[1]!;
      fireEvent.click(exercisesTab);

      const exerciseButton = screen.getByText(EXERCISE_INSTRUCTIONS[0]!.name);
      fireEvent.click(exerciseButton);

      const title = screen.getByText(EXERCISE_INSTRUCTIONS[0]!.name);
      expect(title).toHaveStyle({ fontSize: "24pt" });
    });

    it("should verify all handouts have 14pt+ font size", () => {
      PATIENT_HANDOUTS.forEach((handout) => {
        expect(handout.fontSizePt).toBeGreaterThanOrEqual(14);
      });
    });
  });

  describe("Print Functionality", () => {
    it("should have print button in handout detail view", () => {
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);
      expect(screen.getByText("Print Handout")).toBeInTheDocument();
    });

    it("should have print button in exercise detail view", () => {
      render(<PatientEducationHub />);
      const exercisesTab = screen.getAllByRole("tab")[1]!;
      fireEvent.click(exercisesTab);
      const exerciseButton = screen.getByText(EXERCISE_INSTRUCTIONS[0]!.name);
      fireEvent.click(exerciseButton);
      expect(screen.getByText("Print Exercise")).toBeInTheDocument();
    });

    it("should call window.print on print button click", () => {
      const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
      render(<PatientEducationHub />);
      const handoutButton = screen.getByText(PATIENT_HANDOUTS[0]!.title);
      fireEvent.click(handoutButton);
      const printButton = screen.getByText("Print Handout");
      fireEvent.click(printButton);
      expect(printSpy).toHaveBeenCalled();
      printSpy.mockRestore();
    });
  });

  describe("Data Integrity", () => {
    it("should have all handouts with required fields", () => {
      PATIENT_HANDOUTS.forEach((handout) => {
        expect(handout.id).toBeDefined();
        expect(handout.title).toBeDefined();
        expect(handout.condition).toBeDefined();
        expect(handout.description).toBeDefined();
        expect(handout.content).toBeDefined();
        expect(handout.fontSizePt).toBeGreaterThanOrEqual(14);
        expect(handout.estimatedReadingTime).toBeGreaterThan(0);
      });
    });

    it("should have all exercises with required fields", () => {
      EXERCISE_INSTRUCTIONS.forEach((exercise) => {
        expect(exercise.id).toBeDefined();
        expect(exercise.name).toBeDefined();
        expect(exercise.condition).toBeDefined();
        expect(exercise.description).toBeDefined();
        expect(exercise.frequency).toBeDefined();
        expect(exercise.duration).toBeDefined();
        expect(exercise.steps.length).toBeGreaterThan(0);
        expect(exercise.precautions.length).toBeGreaterThan(0);
        expect(exercise.modifications.length).toBeGreaterThan(0);
        expect(exercise.whenToStop.length).toBeGreaterThan(0);
      });
    });

    it("should have all checklists with required fields", () => {
      HOME_SAFETY_CHECKLISTS.forEach((checklist) => {
        expect(checklist.id).toBeDefined();
        expect(checklist.title).toBeDefined();
        expect(checklist.category).toBeDefined();
        expect(checklist.items.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Language Simplification", () => {
    it("should simplify clinical terms", () => {
      expect(simplifyLanguage("quadriceps")).toBe("thigh muscle");
      expect(simplifyLanguage("hamstring")).toBe("back of thigh");
      expect(simplifyLanguage("dorsiflexion")).toBe("pointing toes up");
      expect(simplifyLanguage("plantarflexion")).toBe("pointing toes down");
    });

    it("should return original term if not in simplification map", () => {
      expect(simplifyLanguage("unknown_term")).toBe("unknown_term");
    });

    it("should be case-insensitive", () => {
      expect(simplifyLanguage("QUADRICEPS")).toBe("thigh muscle");
      expect(simplifyLanguage("QuAdRiCePs")).toBe("thigh muscle");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<PatientEducationHub />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("should have aria-selected on active tab", () => {
      render(<PatientEducationHub />);
      const activeTab = screen.getAllByRole("tab")[0];
      expect(activeTab).toHaveAttribute("aria-selected", "true");
    });

    it("should have proper label associations for checkboxes", () => {
      render(<PatientEducationHub />);
      const safetyTab = screen.getAllByRole("tab")[2]!;
      fireEvent.click(safetyTab);

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox.closest("label")).toBeInTheDocument();
      });
    });
  });
});
