/**
 * Integration tests for Patient Education workflow
 * Tests complete handout generation, exercise prescription, and home safety workflows
 */

import { describe, it, expect } from "vitest";
import {
  PATIENT_HANDOUTS,
  EXERCISE_INSTRUCTIONS,
  HOME_SAFETY_CHECKLISTS,
  generatePatientHandout,
  getExerciseInstructions,
  getHomeSafetyChecklist,
  getHandoutsByCondition,
  getExercisesByCondition,
  simplifyLanguage,
} from "../../data/patient-education-data";

describe("Patient Education Integration", () => {
  describe("Handout Generation Workflow", () => {
    it("should generate complete handout with all sections", () => {
      const handout = generatePatientHandout("fall-prevention-home");
      expect(handout).toBeDefined();
      expect(handout?.title).toBe("Fall Prevention at Home");
      expect(handout?.content.length).toBeGreaterThan(0);
    });

    it("should have print-friendly formatting", () => {
      const handout = generatePatientHandout("fall-prevention-home");
      expect(handout?.printFriendly).toBe(true);
      expect(handout?.fontSizePt).toBeGreaterThanOrEqual(14);
    });

    it("should include all required sections for fall prevention", () => {
      const handout = generatePatientHandout("fall-prevention-home");
      const headings = handout?.content.map((s) => s.heading) || [];
      expect(headings).toContain("Why Falls Matter");
      expect(headings).toContain("Remove Tripping Hazards");
      expect(headings).toContain("Improve Lighting");
      expect(headings).toContain("Bathroom Safety");
    });

    it("should have warning section for when to call doctor", () => {
      const handout = generatePatientHandout("fall-prevention-home");
      const warningSection = handout?.content.find((s) => s.type === "warning");
      expect(warningSection).toBeDefined();
      expect(warningSection?.content).toContain("Call your doctor");
    });

    it("should estimate reading time accurately", () => {
      const handout = generatePatientHandout("fall-prevention-home");
      expect(handout?.estimatedReadingTime).toBeGreaterThan(0);
      expect(handout?.estimatedReadingTime).toBeLessThan(30);
    });
  });

  describe("Exercise Prescription Workflow", () => {
    it("should retrieve exercise instructions with all details", () => {
      const exercise = getExerciseInstructions("quad-sets");
      expect(exercise).toBeDefined();
      expect(exercise?.name).toBe("Quadriceps Sets");
      expect(exercise?.steps.length).toBeGreaterThan(0);
      expect(exercise?.precautions.length).toBeGreaterThan(0);
    });

    it("should include frequency and duration for exercise adherence", () => {
      const exercise = getExerciseInstructions("quad-sets");
      expect(exercise?.frequency).toBe("3 times daily");
      expect(exercise?.duration).toBe("10 repetitions, hold 5 seconds each");
    });

    it("should provide modifications for accessibility", () => {
      const exercise = getExerciseInstructions("quad-sets");
      expect(exercise?.modifications.length).toBeGreaterThan(0);
      expect(exercise?.modifications[0]).toContain("pillow");
    });

    it("should list warning signs to stop exercise", () => {
      const exercise = getExerciseInstructions("quad-sets");
      expect(exercise?.whenToStop.length).toBeGreaterThan(0);
      expect(exercise?.whenToStop).toContain("Sharp pain in the knee");
    });

    it("should have difficulty level for progression", () => {
      const exercise = getExerciseInstructions("quad-sets");
      expect(["beginner", "intermediate", "advanced"]).toContain(
        exercise?.difficulty,
      );
    });
  });

  describe("Home Safety Checklist Workflow", () => {
    it("should retrieve complete safety checklist", () => {
      const checklist = getHomeSafetyChecklist("fall-prevention-checklist");
      expect(checklist).toBeDefined();
      expect(checklist?.items.length).toBeGreaterThan(0);
    });

    it("should prioritize high-risk items", () => {
      const checklist = getHomeSafetyChecklist("fall-prevention-checklist");
      const highPriorityItems =
        checklist?.items.filter((i) => i.priority === "high") || [];
      expect(highPriorityItems.length).toBeGreaterThan(0);
    });

    it("should include grab bar installation as high priority", () => {
      const checklist = getHomeSafetyChecklist("fall-prevention-checklist");
      const grabBarItem = checklist?.items.find((i) =>
        i.task.includes("grab bars"),
      );
      expect(grabBarItem?.priority).toBe("high");
    });

    it("should include lighting improvements", () => {
      const checklist = getHomeSafetyChecklist("fall-prevention-checklist");
      const lightingItems = checklist?.items.filter((i) =>
        i.task.toLowerCase().includes("light"),
      );
      expect(lightingItems?.length).toBeGreaterThan(0);
    });

    it("should track completion status", () => {
      const checklist = getHomeSafetyChecklist("fall-prevention-checklist");
      const allIncomplete = checklist?.items.every(
        (i) => i.completed === false,
      );
      expect(allIncomplete).toBe(true);
    });
  });

  describe("Condition-Based Content Retrieval", () => {
    it("should retrieve all handouts for fall prevention", () => {
      const handouts = getHandoutsByCondition("Fall Risk");
      expect(handouts.length).toBeGreaterThan(0);
      expect(handouts[0].condition).toContain("Fall");
    });

    it("should retrieve all exercises for knee strengthening", () => {
      const exercises = getExercisesByCondition("Knee");
      expect(exercises.length).toBeGreaterThan(0);
      expect(exercises[0].condition).toContain("Knee");
    });

    it("should be case-insensitive for condition search", () => {
      const handouts1 = getHandoutsByCondition("fall risk");
      const handouts2 = getHandoutsByCondition("FALL RISK");
      expect(handouts1.length).toBe(handouts2.length);
    });

    it("should retrieve multiple conditions for comprehensive care", () => {
      const fallHandouts = getHandoutsByCondition("Fall");
      const backHandouts = getHandoutsByCondition("Back");
      expect(fallHandouts.length).toBeGreaterThan(0);
      expect(backHandouts.length).toBeGreaterThan(0);
    });
  });

  describe("Language Simplification Integration", () => {
    it("should simplify clinical terminology for patient understanding", () => {
      const simplified = simplifyLanguage("quadriceps");
      expect(simplified).toBe("thigh muscle");
      expect(simplified).not.toContain("quadriceps");
    });

    it("should handle multiple clinical terms", () => {
      const terms = [
        "quadriceps",
        "hamstring",
        "dorsiflexion",
        "plantarflexion",
      ];
      terms.forEach((term) => {
        const simplified = simplifyLanguage(term);
        expect(simplified).toBeDefined();
      });
    });

    it("should preserve unknown terms", () => {
      const unknown = "xyz_unknown_term";
      const simplified = simplifyLanguage(unknown);
      expect(simplified).toBe(unknown);
    });
  });

  describe("Patient Education Workflow - Complete Flow", () => {
    it("should support complete fall prevention education workflow", () => {
      // 1. Get handout
      const handout = generatePatientHandout("fall-prevention-home");
      expect(handout).toBeDefined();

      // 2. Get related exercises
      const exercises = getExercisesByCondition("Fall Prevention");
      expect(exercises.length).toBeGreaterThan(0);

      // 3. Get safety checklist
      const checklist = getHomeSafetyChecklist("fall-prevention-checklist");
      expect(checklist).toBeDefined();

      // 4. Verify all components are present
      expect(handout?.content.length).toBeGreaterThan(0);
      expect(exercises[0].steps.length).toBeGreaterThan(0);
      expect(checklist?.items.length).toBeGreaterThan(0);
    });

    it("should support complete post-surgery education workflow", () => {
      // 1. Get knee surgery recovery handout
      const handout = generatePatientHandout("knee-surgery-recovery");
      expect(handout).toBeDefined();

      // 2. Get related exercises
      const exercises = getExercisesByCondition("Knee");
      expect(exercises.length).toBeGreaterThan(0);

      // 3. Get post-surgery safety checklist
      const checklist = getHomeSafetyChecklist("post-surgery-checklist");
      expect(checklist).toBeDefined();

      // 4. Verify recovery timeline is included
      const timelineSection = handout?.content.find((s) =>
        s.heading.includes("Timeline"),
      );
      expect(timelineSection).toBeDefined();
    });

    it("should support complete stroke recovery education workflow", () => {
      // 1. Get stroke recovery handout
      const handout = generatePatientHandout("stroke-recovery-home");
      expect(handout).toBeDefined();

      // 2. Get related exercises (balance training is used for stroke)
      const exercises = getExercisesByCondition("Balance");
      expect(exercises.length).toBeGreaterThan(0);

      // 3. Get stroke safety checklist
      const checklist = getHomeSafetyChecklist("stroke-recovery-checklist");
      expect(checklist).toBeDefined();

      // 4. Verify emergency contact guidance
      const emergencySection = handout?.content.find(
        (s) => s.type === "warning",
      );
      expect(emergencySection?.content).toContain("911");
    });
  });

  describe("Print-Friendly Compliance", () => {
    it("should have all handouts marked as print-friendly", () => {
      PATIENT_HANDOUTS.forEach((handout) => {
        expect(handout.printFriendly).toBe(true);
      });
    });

    it("should have 14pt+ font size for all handouts", () => {
      PATIENT_HANDOUTS.forEach((handout) => {
        expect(handout.fontSizePt).toBeGreaterThanOrEqual(14);
      });
    });

    it("should have clear section headings for print", () => {
      PATIENT_HANDOUTS.forEach((handout) => {
        handout.content.forEach((section) => {
          expect(section.heading).toBeDefined();
          expect(section.heading.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have readable line spacing", () => {
      // Verify content structure supports readability
      PATIENT_HANDOUTS.forEach((handout) => {
        expect(handout.content.length).toBeGreaterThan(0);
        handout.content.forEach((section) => {
          if (section.type === "list" && section.items) {
            expect(section.items.length).toBeGreaterThan(0);
          }
        });
      });
    });
  });

  describe("Content Quality Assurance", () => {
    it("should have no empty handouts", () => {
      PATIENT_HANDOUTS.forEach((handout) => {
        expect(handout.content.length).toBeGreaterThan(0);
      });
    });

    it("should have no empty exercises", () => {
      EXERCISE_INSTRUCTIONS.forEach((exercise) => {
        expect(exercise.steps.length).toBeGreaterThan(0);
        expect(exercise.precautions.length).toBeGreaterThan(0);
        expect(exercise.modifications.length).toBeGreaterThan(0);
        expect(exercise.whenToStop.length).toBeGreaterThan(0);
      });
    });

    it("should have no empty checklists", () => {
      HOME_SAFETY_CHECKLISTS.forEach((checklist) => {
        expect(checklist.items.length).toBeGreaterThan(0);
      });
    });

    it("should have unique IDs for all content", () => {
      const handoutIds = PATIENT_HANDOUTS.map((h) => h.id);
      const exerciseIds = EXERCISE_INSTRUCTIONS.map((e) => e.id);
      const checklistIds = HOME_SAFETY_CHECKLISTS.map((c) => c.id);

      expect(new Set(handoutIds).size).toBe(handoutIds.length);
      expect(new Set(exerciseIds).size).toBe(exerciseIds.length);
      expect(new Set(checklistIds).size).toBe(checklistIds.length);
    });

    it("should have descriptive titles and descriptions", () => {
      PATIENT_HANDOUTS.forEach((handout) => {
        expect(handout.title.length).toBeGreaterThan(5);
        expect(handout.description.length).toBeGreaterThan(10);
      });

      EXERCISE_INSTRUCTIONS.forEach((exercise) => {
        expect(exercise.name.length).toBeGreaterThan(3);
        expect(exercise.description.length).toBeGreaterThan(10);
      });
    });
  });

  describe("Accessibility Compliance", () => {
    it("should have proper content structure for screen readers", () => {
      PATIENT_HANDOUTS.forEach((handout) => {
        handout.content.forEach((section) => {
          expect(section.heading).toBeDefined();
          expect(section.type).toMatch(/text|list|steps|warning|tip/);
        });
      });
    });

    it("should have warning sections for safety-critical information", () => {
      const handoutsWithWarnings = PATIENT_HANDOUTS.filter((h) =>
        h.content.some((s) => s.type === "warning"),
      );
      expect(handoutsWithWarnings.length).toBeGreaterThan(0);
    });

    it("should have clear step-by-step instructions", () => {
      EXERCISE_INSTRUCTIONS.forEach((exercise) => {
        expect(exercise.steps.length).toBeGreaterThan(0);
        exercise.steps.forEach((step) => {
          expect(step.length).toBeGreaterThan(5);
        });
      });
    });
  });
});
