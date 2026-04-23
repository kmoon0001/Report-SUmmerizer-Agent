import { describe, it, expect } from "vitest";
import {
  getPTExerciseProgressionById,
  getPTExerciseProgressionsByCategory,
  searchPTExerciseProgressions,
  getAllPTExerciseProgressions,
  getPTExerciseProgressionCategories,
  getPTExerciseProgressionsForIndication,
} from "../../data/pt-exercise-progressions";

describe("PT Module 6: Exercise Progressions", () => {
  describe("getPTExerciseProgressionById", () => {
    it("should return progression by valid ID", () => {
      const progression = getPTExerciseProgressionById("pt-ep-001");
      expect(progression).toBeDefined();
      expect(progression?.name).toBe("Strengthening Progression");
    });

    it("should return undefined for invalid ID", () => {
      const progression = getPTExerciseProgressionById("invalid-id");
      expect(progression).toBeUndefined();
    });

    it("should return correct progression properties", () => {
      const progression = getPTExerciseProgressionById("pt-ep-001");
      expect(progression?.category).toBe("strengthening");
      expect(progression?.phases.length).toBeGreaterThan(0);
      expect(progression?.indications.length).toBeGreaterThan(0);
    });
  });

  describe("getPTExerciseProgressionsByCategory", () => {
    it("should return strengthening progressions", () => {
      const progressions = getPTExerciseProgressionsByCategory("strengthening");
      expect(progressions.length).toBeGreaterThan(0);
      expect(progressions.every((p) => p.category === "strengthening")).toBe(
        true,
      );
    });

    it("should return balance progressions", () => {
      const progressions = getPTExerciseProgressionsByCategory("balance");
      expect(progressions.length).toBeGreaterThan(0);
      expect(progressions.every((p) => p.category === "balance")).toBe(true);
    });

    it("should return flexibility progressions", () => {
      const progressions = getPTExerciseProgressionsByCategory("flexibility");
      expect(progressions.length).toBeGreaterThan(0);
      expect(progressions.every((p) => p.category === "flexibility")).toBe(
        true,
      );
    });

    it("should return empty array for non-existent category", () => {
      const progressions = getPTExerciseProgressionsByCategory("non-existent");
      expect(progressions.length).toBe(0);
    });
  });

  describe("searchPTExerciseProgressions", () => {
    it("should find progression by name", () => {
      const results = searchPTExerciseProgressions("Strengthening");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((p) => p.name.includes("Strengthening"))).toBe(true);
    });

    it("should find progression by abbreviation", () => {
      const results = searchPTExerciseProgressions("SP");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchPTExerciseProgressions("balance");
      const results2 = searchPTExerciseProgressions("BALANCE");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchPTExerciseProgressions("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllPTExerciseProgressions", () => {
    it("should return all PT exercise progressions", () => {
      const progressions = getAllPTExerciseProgressions();
      expect(progressions.length).toBe(10);
    });

    it("should have valid progression structure", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((progression) => {
        expect(progression.id).toBeDefined();
        expect(progression.name).toBeDefined();
        expect(progression.category).toBeDefined();
        expect(progression.phases.length).toBeGreaterThan(0);
      });
    });

    it("should have all required properties", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.indications.length).toBeGreaterThan(0);
        expect(p.contraindications.length).toBeGreaterThan(0);
        expect(p.precautions.length).toBeGreaterThan(0);
        expect(p.expectedOutcomes.length).toBeGreaterThan(0);
        expect(p.source).toBeDefined();
        expect(p.citation).toBeDefined();
        expect(p.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have phases with required structure", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        p.phases.forEach((phase) => {
          expect(phase.phase).toBeDefined();
          expect(phase.name).toBeDefined();
          expect(phase.duration).toBeDefined();
          expect(phase.exercises.length).toBeGreaterThan(0);
          expect(phase.progressionCriteria.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("getPTExerciseProgressionCategories", () => {
    it("should return all categories", () => {
      const categories = getPTExerciseProgressionCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getPTExerciseProgressionCategories();
      expect(categories).toContain("strengthening");
      expect(categories).toContain("balance");
      expect(categories).toContain("flexibility");
    });

    it("should not have duplicates", () => {
      const categories = getPTExerciseProgressionCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getPTExerciseProgressionsForIndication", () => {
    it("should return progressions for muscle weakness", () => {
      const progressions =
        getPTExerciseProgressionsForIndication("Muscle weakness");
      expect(progressions.length).toBeGreaterThan(0);
    });

    it("should return progressions for balance disorder", () => {
      const progressions =
        getPTExerciseProgressionsForIndication("Balance disorder");
      expect(progressions.length).toBeGreaterThan(0);
    });

    it("should return progressions for reduced flexibility", () => {
      const progressions = getPTExerciseProgressionsForIndication(
        "Reduced flexibility",
      );
      expect(progressions.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent indication", () => {
      const progressions = getPTExerciseProgressionsForIndication(
        "non-existent-indication",
      );
      expect(progressions.length).toBe(0);
    });

    it("should be case-insensitive", () => {
      const results1 =
        getPTExerciseProgressionsForIndication("muscle weakness");
      const results2 =
        getPTExerciseProgressionsForIndication("MUSCLE WEAKNESS");
      expect(results1.length).toBe(results2.length);
    });
  });

  describe("Indications", () => {
    it("should have meaningful indications", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.indications.length).toBeGreaterThan(0);
        expect(p.indications.every((i) => i.length > 0)).toBe(true);
      });
    });
  });

  describe("Contraindications", () => {
    it("should have contraindications", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.contraindications.length).toBeGreaterThan(0);
        expect(p.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });
  });

  describe("Precautions", () => {
    it("should have precautions", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.precautions.length).toBeGreaterThan(0);
        expect(p.precautions.every((pr) => pr.length > 0)).toBe(true);
      });
    });
  });

  describe("Phases", () => {
    it("should have multiple phases", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.phases.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should have exercises in each phase", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        p.phases.forEach((phase) => {
          expect(phase.exercises.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have progression criteria for each phase", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        p.phases.forEach((phase) => {
          expect(phase.progressionCriteria.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Expected Outcomes", () => {
    it("should have expected outcomes", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.expectedOutcomes.length).toBeGreaterThan(0);
        expect(p.expectedOutcomes.every((o) => o.length > 0)).toBe(true);
      });
    });
  });

  describe("Evidence Level", () => {
    it("should have source and citation", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.source).toBeDefined();
        expect(p.source.length).toBeGreaterThan(0);
        expect(p.citation).toBeDefined();
        expect(p.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each progression", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.source).toBeDefined();
        expect(p.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each progression", () => {
      const progressions = getAllPTExerciseProgressions();
      progressions.forEach((p) => {
        expect(p.citation).toBeDefined();
        expect(p.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Progression Coverage", () => {
    it("should cover major progression categories", () => {
      const progressions = getAllPTExerciseProgressions();
      const categories = progressions.map((p) => p.category);
      expect(categories).toContain("strengthening");
      expect(categories).toContain("balance");
      expect(categories).toContain("flexibility");
    });

    it("should have 10 progressions total", () => {
      const progressions = getAllPTExerciseProgressions();
      expect(progressions.length).toBe(10);
    });
  });
});
