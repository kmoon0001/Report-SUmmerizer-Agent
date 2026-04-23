import { describe, it, expect } from "vitest";
import {
  getOTExerciseProgressionById,
  getOTExerciseProgressionsByCategory,
  searchOTExerciseProgressions,
  getAllOTExerciseProgressions,
  getOTExerciseProgressionCategories,
  getOTExerciseProgressionsForIndication,
} from "../../data/ot-exercise-progressions";

describe("OT Module 6: Exercise Progressions", () => {
  describe("getOTExerciseProgressionById", () => {
    it("should return exercise progression by valid ID", () => {
      const progression = getOTExerciseProgressionById("ot-ep-001");
      expect(progression).toBeDefined();
      expect(progression?.name).toBeDefined();
    });

    it("should return undefined for invalid ID", () => {
      const progression = getOTExerciseProgressionById("invalid-id");
      expect(progression).toBeUndefined();
    });

    it("should return correct progression properties", () => {
      const progression = getOTExerciseProgressionById("ot-ep-001");
      expect(progression?.category).toBeDefined();
      expect(progression?.phases.length).toBeGreaterThan(0);
      expect(progression?.indications.length).toBeGreaterThan(0);
    });

    it("should have valid phase structure", () => {
      const progression = getOTExerciseProgressionById("ot-ep-001");
      progression?.phases.forEach((phase) => {
        expect(phase.name).toBeDefined();
        expect(phase.duration).toBeDefined();
        expect(phase.exercises.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getOTExerciseProgressionsByCategory", () => {
    it("should return progressions for valid category", () => {
      const progressions = getOTExerciseProgressionsByCategory("strengthening");
      expect(progressions.length).toBeGreaterThan(0);
      expect(progressions.every((p) => p.category === "strengthening")).toBe(
        true,
      );
    });

    it("should return empty array for non-existent category", () => {
      const progressions = getOTExerciseProgressionsByCategory("non-existent");
      expect(progressions.length).toBe(0);
    });

    it("should return progressions with valid structure", () => {
      const progressions = getOTExerciseProgressionsByCategory("strengthening");
      progressions.forEach((p) => {
        expect(p.id).toBeDefined();
        expect(p.name).toBeDefined();
        expect(p.phases.length).toBeGreaterThan(0);
      });
    });
  });

  describe("searchOTExerciseProgressions", () => {
    it("should find progression by name", () => {
      const results = searchOTExerciseProgressions("Strengthening");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find progression by abbreviation", () => {
      const results = searchOTExerciseProgressions("UESP");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchOTExerciseProgressions("strengthening");
      const results2 = searchOTExerciseProgressions("STRENGTHENING");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchOTExerciseProgressions("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllOTExerciseProgressions", () => {
    it("should return all OT exercise progressions", () => {
      const progressions = getAllOTExerciseProgressions();
      expect(progressions.length).toBe(10);
    });

    it("should have valid progression structure", () => {
      const progressions = getAllOTExerciseProgressions();
      progressions.forEach((progression) => {
        expect(progression.id).toBeDefined();
        expect(progression.name).toBeDefined();
        expect(progression.category).toBeDefined();
        expect(progression.description).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const progressions = getAllOTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.phases.length).toBeGreaterThan(0);
        expect(p.indications.length).toBeGreaterThan(0);
        expect(p.contraindications.length).toBeGreaterThan(0);
        expect(p.precautions.length).toBeGreaterThan(0);
        expect(p.source).toBeDefined();
        expect(p.citation).toBeDefined();
        expect(p.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have valid phase structure for all progressions", () => {
      const progressions = getAllOTExerciseProgressions();
      progressions.forEach((p) => {
        p.phases.forEach((phase) => {
          expect(phase.name).toBeDefined();
          expect(phase.duration).toBeDefined();
          expect(phase.exercises.length).toBeGreaterThan(0);
          expect(phase.progressionCriteria).toBeDefined();
        });
      });
    });
  });

  describe("getOTExerciseProgressionCategories", () => {
    it("should return all categories", () => {
      const categories = getOTExerciseProgressionCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getOTExerciseProgressionCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getOTExerciseProgressionCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getOTExerciseProgressionsForIndication", () => {
    it("should return progressions for valid indication", () => {
      const progressions = getOTExerciseProgressionsForIndication(
        "Upper extremity weakness",
      );
      expect(progressions.length).toBeGreaterThan(0);
    });

    it("should return progressions matching indication", () => {
      const progressions = getOTExerciseProgressionsForIndication(
        "Upper extremity weakness",
      );
      progressions.forEach((p) => {
        expect(p.indications.some((i) => i.includes("extremity"))).toBe(true);
      });
    });

    it("should return empty array for non-existent indication", () => {
      const progressions =
        getOTExerciseProgressionsForIndication("xyz123nonexistent");
      expect(progressions.length).toBe(0);
    });
  });

  describe("Exercise Progression Properties", () => {
    it("should have meaningful indications", () => {
      const progressions = getAllOTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.indications.length).toBeGreaterThan(0);
        expect(p.indications.every((i) => i.length > 0)).toBe(true);
      });
    });

    it("should have contraindications", () => {
      const progressions = getAllOTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.contraindications.length).toBeGreaterThan(0);
        expect(p.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });

    it("should have precautions", () => {
      const progressions = getAllOTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.precautions.length).toBeGreaterThan(0);
        expect(p.precautions.every((pr) => pr.length > 0)).toBe(true);
      });
    });

    it("should have source attribution", () => {
      const progressions = getAllOTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.source).toBeDefined();
        expect(p.source.length).toBeGreaterThan(0);
        expect(p.citation).toBeDefined();
        expect(p.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Phase Structure Validation", () => {
    it("should have valid exercises in each phase", () => {
      const progressions = getAllOTExerciseProgressions();
      progressions.forEach((p) => {
        p.phases.forEach((phase) => {
          expect(phase.exercises.length).toBeGreaterThan(0);
          expect(phase.exercises.every((e) => e.length > 0)).toBe(true);
        });
      });
    });

    it("should have progression criteria for advancement", () => {
      const progressions = getAllOTExerciseProgressions();
      progressions.forEach((p) => {
        p.phases.forEach((phase) => {
          expect(phase.progressionCriteria).toBeDefined();
          expect(phase.progressionCriteria.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Module Coverage", () => {
    it("should have 10 exercise progressions", () => {
      const progressions = getAllOTExerciseProgressions();
      expect(progressions.length).toBe(10);
    });

    it("should cover multiple categories", () => {
      const progressions = getAllOTExerciseProgressions();
      const categories = new Set(progressions.map((p) => p.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it("should have comprehensive indication coverage", () => {
      const progressions = getAllOTExerciseProgressions();
      const allIndications = progressions.flatMap((p) => p.indications);
      expect(allIndications.length).toBeGreaterThan(10);
    });
  });
});
