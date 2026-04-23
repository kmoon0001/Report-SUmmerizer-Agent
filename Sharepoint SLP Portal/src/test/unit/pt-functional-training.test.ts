import { describe, it, expect } from "vitest";
import {
  getPTFunctionalTrainingById,
  getPTFunctionalTrainingByCategory,
  searchPTFunctionalTraining,
  getAllPTFunctionalTraining,
  getPTFunctionalTrainingCategories,
  getPTFunctionalTrainingForIndication,
} from "../../data/pt-functional-training";

describe("PT Module 7: Functional Training", () => {
  describe("getPTFunctionalTrainingById", () => {
    it("should return training by valid ID", () => {
      const training = getPTFunctionalTrainingById("pt-ft-001");
      expect(training).toBeDefined();
      expect(training?.name).toBe("Sit-to-Stand Training");
    });

    it("should return undefined for invalid ID", () => {
      const training = getPTFunctionalTrainingById("invalid-id");
      expect(training).toBeUndefined();
    });

    it("should return correct training properties", () => {
      const training = getPTFunctionalTrainingById("pt-ft-001");
      expect(training?.category).toBe("mobility");
      expect(training?.progressionStages.length).toBeGreaterThan(0);
      expect(training?.indications.length).toBeGreaterThan(0);
    });
  });

  describe("getPTFunctionalTrainingByCategory", () => {
    it("should return mobility training", () => {
      const trainings = getPTFunctionalTrainingByCategory("mobility");
      expect(trainings.length).toBeGreaterThan(0);
      expect(trainings.every((t) => t.category === "mobility")).toBe(true);
    });

    it("should return balance training", () => {
      const trainings = getPTFunctionalTrainingByCategory("balance");
      expect(trainings.length).toBeGreaterThan(0);
      expect(trainings.every((t) => t.category === "balance")).toBe(true);
    });

    it("should return upper-extremity training", () => {
      const trainings = getPTFunctionalTrainingByCategory("upper-extremity");
      expect(trainings.length).toBeGreaterThan(0);
      expect(trainings.every((t) => t.category === "upper-extremity")).toBe(
        true,
      );
    });

    it("should return empty array for non-existent category", () => {
      const trainings = getPTFunctionalTrainingByCategory("non-existent");
      expect(trainings.length).toBe(0);
    });
  });

  describe("searchPTFunctionalTraining", () => {
    it("should find training by name", () => {
      const results = searchPTFunctionalTraining("Sit-to-Stand");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((t) => t.name.includes("Sit-to-Stand"))).toBe(true);
    });

    it("should find training by abbreviation", () => {
      const results = searchPTFunctionalTraining("STS");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchPTFunctionalTraining("gait");
      const results2 = searchPTFunctionalTraining("GAIT");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchPTFunctionalTraining("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllPTFunctionalTraining", () => {
    it("should return all PT functional training protocols", () => {
      const trainings = getAllPTFunctionalTraining();
      expect(trainings.length).toBe(10);
    });

    it("should have valid training structure", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((training) => {
        expect(training.id).toBeDefined();
        expect(training.name).toBeDefined();
        expect(training.abbreviation).toBeDefined();
        expect(training.category).toBeDefined();
        expect(training.progressionStages.length).toBeGreaterThan(0);
      });
    });

    it("should have all required properties", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.indications.length).toBeGreaterThan(0);
        expect(t.contraindications.length).toBeGreaterThan(0);
        expect(t.precautions.length).toBeGreaterThan(0);
        expect(t.expectedOutcomes.length).toBeGreaterThan(0);
        expect(t.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(t.evidenceLevel).toBeLessThanOrEqual(5);
        expect(t.source).toBeDefined();
        expect(t.citation).toBeDefined();
        expect(t.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have progression stages with required structure", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        t.progressionStages.forEach((stage) => {
          expect(stage.stage).toBeDefined();
          expect(stage.duration).toBeDefined();
          expect(stage.exercises.length).toBeGreaterThan(0);
          expect(stage.parameters).toBeDefined();
        });
      });
    });
  });

  describe("getPTFunctionalTrainingCategories", () => {
    it("should return all categories", () => {
      const categories = getPTFunctionalTrainingCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getPTFunctionalTrainingCategories();
      expect(categories).toContain("mobility");
      expect(categories).toContain("balance");
    });

    it("should not have duplicates", () => {
      const categories = getPTFunctionalTrainingCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getPTFunctionalTrainingForIndication", () => {
    it("should return training for lower extremity weakness", () => {
      const trainings = getPTFunctionalTrainingForIndication("weakness");
      expect(trainings.length).toBeGreaterThan(0);
    });

    it("should return training for balance impairment", () => {
      const trainings = getPTFunctionalTrainingForIndication("balance");
      expect(trainings.length).toBeGreaterThan(0);
    });

    it("should return training for mobility limitation", () => {
      const trainings = getPTFunctionalTrainingForIndication("mobility");
      expect(trainings.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent indication", () => {
      const trainings = getPTFunctionalTrainingForIndication(
        "non-existent-indication",
      );
      expect(trainings.length).toBe(0);
    });

    it("should be case-insensitive", () => {
      const results1 = getPTFunctionalTrainingForIndication("weakness");
      const results2 = getPTFunctionalTrainingForIndication("WEAKNESS");
      expect(results1.length).toBe(results2.length);
    });
  });

  describe("Indications", () => {
    it("should have meaningful indications", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.indications.length).toBeGreaterThan(0);
        expect(t.indications.every((i) => i.length > 0)).toBe(true);
      });
    });
  });

  describe("Contraindications", () => {
    it("should have contraindications", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.contraindications.length).toBeGreaterThan(0);
        expect(t.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });
  });

  describe("Precautions", () => {
    it("should have precautions", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.precautions.length).toBeGreaterThan(0);
        expect(t.precautions.every((p) => p.length > 0)).toBe(true);
      });
    });
  });

  describe("Progression Stages", () => {
    it("should have multiple progression stages", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.progressionStages.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should have exercises in each stage", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        t.progressionStages.forEach((stage) => {
          expect(stage.exercises.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have parameters for each stage", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        t.progressionStages.forEach((stage) => {
          expect(Object.keys(stage.parameters).length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Expected Outcomes", () => {
    it("should have expected outcomes", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.expectedOutcomes.length).toBeGreaterThan(0);
        expect(t.expectedOutcomes.every((o) => o.length > 0)).toBe(true);
      });
    });
  });

  describe("Evidence Level", () => {
    it("should have valid evidence levels", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(t.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each training", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.source).toBeDefined();
        expect(t.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each training", () => {
      const trainings = getAllPTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.citation).toBeDefined();
        expect(t.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Training Coverage", () => {
    it("should cover major training categories", () => {
      const trainings = getAllPTFunctionalTraining();
      const categories = trainings.map((t) => t.category);
      expect(categories).toContain("mobility");
      expect(categories).toContain("balance");
    });

    it("should have 10 training protocols total", () => {
      const trainings = getAllPTFunctionalTraining();
      expect(trainings.length).toBe(10);
    });
  });
});
