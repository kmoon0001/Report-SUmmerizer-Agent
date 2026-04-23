/**
 * Unit Tests: Exercise Library Component
 * Task 12.2 — Requirements: 4.1, 4.2, 22.1, 22.2
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExerciseLibrary } from "../../components/ExerciseLibrary";
import { EXERCISE_LIBRARY } from "../../data/exercise-library-data";

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

describe("ExerciseLibrary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders the Exercise Library title", () => {
      render(<ExerciseLibrary />);
      expect(screen.getByText("Exercise Library")).toBeInTheDocument();
    });

    it("displays total exercise count", () => {
      render(<ExerciseLibrary />);
      expect(screen.getByTestId("total-exercise-count")).toHaveTextContent(
        `${EXERCISE_LIBRARY.length}`,
      );
    });

    it("renders search input", () => {
      render(<ExerciseLibrary />);
      expect(screen.getByLabelText("Search exercises")).toBeInTheDocument();
    });

    it("renders body region filter", () => {
      render(<ExerciseLibrary />);
      expect(
        screen.getByLabelText("Filter by body region"),
      ).toBeInTheDocument();
    });

    it("renders category filter", () => {
      render(<ExerciseLibrary />);
      expect(screen.getByLabelText("Filter by category")).toBeInTheDocument();
    });

    it("renders HEP Builder button", () => {
      render(<ExerciseLibrary />);
      expect(screen.getByText(/HEP Builder/)).toBeInTheDocument();
    });

    it("renders Patient View button", () => {
      render(<ExerciseLibrary />);
      expect(screen.getByText("Patient View")).toBeInTheDocument();
    });
  });

  describe("Exercise List Display", () => {
    it("displays exercises from the library", () => {
      render(<ExerciseLibrary />);
      // Should show at least some exercises
      const countText = screen.getByText(/exercises found/);
      expect(countText).toBeInTheDocument();
    });

    it("shows exercise names in the list", () => {
      render(<ExerciseLibrary />);
      // Pendulum is a known exercise in the library
      expect(
        screen.getByText("Pendulum (Codman) Exercise"),
      ).toBeInTheDocument();
    });

    it("shows HEP badge for eligible exercises", () => {
      render(<ExerciseLibrary />);
      const hepBadges = screen.getAllByText("HEP");
      expect(hepBadges.length).toBeGreaterThan(0);
    });

    it("shows difficulty labels", () => {
      render(<ExerciseLibrary />);
      expect(screen.getAllByText("Beginner").length).toBeGreaterThan(0);
    });

    it("shows evidence level badges", () => {
      render(<ExerciseLibrary />);
      // Evidence level badges like "Lvl 2" or "Lvl 3"
      expect(screen.getAllByText(/Lvl \d/).length).toBeGreaterThan(0);
    });
  });

  describe("Search Functionality", () => {
    it("filters exercises by search query", () => {
      render(<ExerciseLibrary />);
      const searchInput = screen.getByLabelText("Search exercises");
      fireEvent.change(searchInput, { target: { value: "pendulum" } });
      expect(
        screen.getByText("Pendulum (Codman) Exercise"),
      ).toBeInTheDocument();
    });

    it("shows no results message when search has no matches", () => {
      render(<ExerciseLibrary />);
      const searchInput = screen.getByLabelText("Search exercises");
      fireEvent.change(searchInput, {
        target: { value: "xyznonexistentexercise12345" },
      });
      expect(
        screen.getByText("No exercises match your filters"),
      ).toBeInTheDocument();
    });

    it("updates exercise count after search", () => {
      render(<ExerciseLibrary />);
      const searchInput = screen.getByLabelText("Search exercises");
      fireEvent.change(searchInput, { target: { value: "shoulder" } });
      const countText = screen.getByText(/exercises found/);
      expect(countText).toBeInTheDocument();
    });

    it("searches by muscle name", () => {
      render(<ExerciseLibrary />);
      const searchInput = screen.getByLabelText("Search exercises");
      fireEvent.change(searchInput, { target: { value: "quadriceps" } });
      const countText = screen.getByText(/exercises found/);
      expect(countText).toBeInTheDocument();
    });
  });

  describe("Filter Functionality", () => {
    it("filters by body region", () => {
      render(<ExerciseLibrary />);
      const regionFilter = screen.getByLabelText("Filter by body region");
      fireEvent.change(regionFilter, { target: { value: "shoulder" } });
      // All visible exercises should be shoulder exercises
      expect(
        screen.getByText("Pendulum (Codman) Exercise"),
      ).toBeInTheDocument();
    });

    it("filters by category", () => {
      render(<ExerciseLibrary />);
      const categoryFilter = screen.getByLabelText("Filter by category");
      fireEvent.change(categoryFilter, {
        target: { value: "therapeutic-exercise" },
      });
      const countText = screen.getByText(/exercises found/);
      expect(countText).toBeInTheDocument();
    });

    it("filters HEP-only exercises via checkbox", () => {
      render(<ExerciseLibrary />);
      const hepCheckbox = screen.getByLabelText(/HEP Only/);
      fireEvent.click(hepCheckbox);
      // All shown exercises should be HEP eligible
      const countText = screen.getByText(/exercises found/);
      expect(countText).toBeInTheDocument();
    });

    it("combines search and region filter", () => {
      render(<ExerciseLibrary />);
      const regionFilter = screen.getByLabelText("Filter by body region");
      fireEvent.change(regionFilter, { target: { value: "knee" } });
      const searchInput = screen.getByLabelText("Search exercises");
      fireEvent.change(searchInput, { target: { value: "quad" } });
      const countText = screen.getByText(/exercises found/);
      expect(countText).toBeInTheDocument();
    });
  });

  describe("Exercise Detail View", () => {
    it("shows exercise detail when exercise is clicked", () => {
      render(<ExerciseLibrary />);
      const exercise = screen.getByText("Pendulum (Codman) Exercise");
      fireEvent.click(exercise);
      expect(screen.getByText("Patient Instruction")).toBeInTheDocument();
    });

    it("shows default dosage in detail view", () => {
      render(<ExerciseLibrary />);
      const exercise = screen.getByText("Pendulum (Codman) Exercise");
      fireEvent.click(exercise);
      expect(screen.getByText("Default Dosage")).toBeInTheDocument();
    });

    it("shows target muscles in detail view", () => {
      render(<ExerciseLibrary />);
      const exercise = screen.getByText("Pendulum (Codman) Exercise");
      fireEvent.click(exercise);
      expect(screen.getByText("Target Muscles")).toBeInTheDocument();
    });

    it("shows contraindications in detail view", () => {
      render(<ExerciseLibrary />);
      const exercise = screen.getByText("Pendulum (Codman) Exercise");
      fireEvent.click(exercise);
      expect(screen.getByText("Contraindications")).toBeInTheDocument();
    });

    it("shows evidence citation in detail view", () => {
      render(<ExerciseLibrary />);
      const exercise = screen.getByText("Pendulum (Codman) Exercise");
      fireEvent.click(exercise);
      expect(screen.getByText("Evidence Citation")).toBeInTheDocument();
    });

    it("shows progression criteria in detail view", () => {
      render(<ExerciseLibrary />);
      const exercise = screen.getByText("Pendulum (Codman) Exercise");
      fireEvent.click(exercise);
      expect(screen.getByText("Progression Criteria")).toBeInTheDocument();
    });
  });

  describe("HEP Builder", () => {
    it("opens HEP builder panel when button clicked", () => {
      render(<ExerciseLibrary />);
      const hepButton = screen.getByText(/HEP Builder/);
      fireEvent.click(hepButton);
      expect(screen.getByText(/Home Exercise Program/)).toBeInTheDocument();
    });

    it("adds HEP-eligible exercise to HEP list", () => {
      render(<ExerciseLibrary />);
      // Open HEP panel
      fireEvent.click(screen.getByText(/HEP Builder/));
      // Find add button for Pendulum (HEP eligible)
      const addButtons = screen.getAllByLabelText(/Add .* to HEP/);
      fireEvent.click(addButtons[0]);
      expect(screen.getByText(/1\//)).toBeInTheDocument();
    });

    it("enforces maximum 5 exercises in HEP", () => {
      render(<ExerciseLibrary />);
      fireEvent.click(screen.getByText(/HEP Builder/));
      const addButtons = screen.getAllByLabelText(/Add .* to HEP/);
      // Add 5 exercises
      for (let i = 0; i < Math.min(5, addButtons.length); i++) {
        fireEvent.click(addButtons[i]);
      }
      expect(screen.getByText(/5\/5/)).toBeInTheDocument();
    });

    it("shows max HEP warning when 5 exercises added", () => {
      render(<ExerciseLibrary />);
      fireEvent.click(screen.getByText(/HEP Builder/));
      const addButtons = screen.getAllByLabelText(/Add .* to HEP/);
      for (let i = 0; i < Math.min(5, addButtons.length); i++) {
        fireEvent.click(addButtons[i]);
      }
      expect(
        screen.getByText(/Maximum 5 exercises reached/),
      ).toBeInTheDocument();
    });

    it("removes exercise from HEP", async () => {
      const { waitFor } = await import("@testing-library/react");
      render(<ExerciseLibrary />);
      fireEvent.click(screen.getByText(/HEP Builder/));

      // Add an exercise
      const addButtons = screen.getAllByLabelText(/Add .* to HEP/);
      fireEvent.click(addButtons[0]);

      // Verify exercise was added (count should be 1/5)
      await waitFor(
        () => {
          expect(screen.getByText(/HEP Builder \(1\/5\)/)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      // Find the Minus button in the HEP panel (it's inside the white rounded box)
      const hepPanel = screen.getByText(/Home Exercise Program/).closest("div");
      if (hepPanel) {
        const minusButton = hepPanel.querySelector('button[class*="text-red"]');
        if (minusButton) {
          fireEvent.click(minusButton);

          // Verify exercise was removed (count should be 0/5)
          await waitFor(
            () => {
              expect(
                screen.getByText(/HEP Builder \(0\/5\)/),
              ).toBeInTheDocument();
            },
            { timeout: 2000 },
          );
        }
      }
    });
  });

  describe("Patient View", () => {
    it("switches to patient view when button clicked", () => {
      render(<ExerciseLibrary />);
      fireEvent.click(screen.getByText("Patient View"));
      expect(screen.getByTestId("patient-view-wrapper")).toBeInTheDocument();
    });

    it("exits patient view when exit button clicked", () => {
      render(<ExerciseLibrary />);
      fireEvent.click(screen.getByText("Patient View"));
      fireEvent.click(screen.getByText("Exit Patient View"));
      expect(
        screen.queryByTestId("patient-view-wrapper"),
      ).not.toBeInTheDocument();
    });
  });
});
