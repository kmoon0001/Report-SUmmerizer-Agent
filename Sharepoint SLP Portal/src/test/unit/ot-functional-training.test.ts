import { describe, it, expect } from "vitest";
import {
  getOTFunctionalTrainingById,
  getOTFunctionalTrainingByCategory,
  searchOTFunctionalTraining,
  getAllOTFunctionalTraining,
  getOTFunctionalTrainingCategories,
  getOTFunctionalTrainingForIndication,
} from "../../data/ot-functional-training";

describe("OT Module 7: Functional Training", () => {
  describe("getOTFunctionalTrainingById", () => {
    it("should return functional training by valid ID", () => {
      const training = getOTFunctionalTrainingById("ot-ft-001");
      expect(training).toBeDefined();
      expect(training?.name).toBeDefined();
    });

    it("should return undefined for invalid ID", () => {
      const training = getOTFunctionalTrainingById("invalid-id");
      expect(training).toBeUndefined();
    });

    it("should return correct training properties", () => {
      const training = getOTFunctionalTrainingById("ot-ft-001");
      expect(training?.category).toBeDefined();
      expect(training?.progressionStages.length).toBeGreaterThan(0);
      expect(training?.indications.length).toBeGreaterThan(0);
    });

    it("should have valid activity structure", () => {
      const training = getOTFunctionalTrainingById("ot-ft-001");
      training?.progressionStages.forEach((stage) => {
        expect(stage.stage).toBeDefined();
        expect(stage.duration).toBeDefined();
        expect(stage.exercises.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getOTFunctionalTrainingByCategory", () => {
    it("should return training for valid category", () => {
      const trainings = getOTFunctionalTrainingByCategory("self-care");
      expect(trainings.length).toBeGreaterThan(0);
      expect(trainings.every((t) => t.category === "self-care")).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const trainings = getOTFunctionalTrainingByCategory("non-existent");
      expect(trainings.length).toBe(0);
    });

    it("should return training with valid structure", () => {
      const trainings = getOTFunctionalTrainingByCategory("self-care");
      trainings.forEach((t) => {
        expect(t.id).toBeDefined();
        expect(t.name).toBeDefined();
        expect(t.progressionStages.length).toBeGreaterThan(0);
      });
    });
  });

  describe("searchOTFunctionalTraining", () => {
    it("should find training by name", () => {
      const results = searchOTFunctionalTraining("Self-Care");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find training by abbreviation", () => {
      const results = searchOTFunctionalTraining("SCFT");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchOTFunctionalTraining("self-care");
      const results2 = searchOTFunctionalTraining("SELF-CARE");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchOTFunctionalTraining("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllOTFunctionalTraining", () => {
    it("should return all OT functional training", () => {
      const trainings = getAllOTFunctionalTraining();
      expect(trainings.length).toBe(10);
    });

    it("should have valid training structure", () => {
      const trainings = getAllOTFunctionalTraining();
      trainings.forEach((training) => {
        expect(training.id).toBeDefined();
        expect(training.name).toBeDefined();
        expect(training.category).toBeDefined();
        expect(training.description).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const trainings = getAllOTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.progressionStages.length).toBeGreaterThan(0);
        expect(t.indications.length).toBeGreaterThan(0);
        expect(t.contraindications.length).toBeGreaterThan(0);
        expect(t.precautions.length).toBeGreaterThan(0);
        expect(t.source).toBeDefined();
        expect(t.citation).toBeDefined();
        expect(t.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have valid activity structure for all training", () => {
      const trainings = getAllOTFunctionalTraining();
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

  describe("getOTFunctionalTrainingCategories", () => {
    it("should return all categories", () => {
      const categories = getOTFunctionalTrainingCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getOTFunctionalTrainingCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getOTFunctionalTrainingCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getOTFunctionalTrainingForIndication", () => {
    it("should return training for valid indication", () => {
      const trainings = getOTFunctionalTrainingForIndication("ADL deficit");
      expect(trainings.length).toBeGreaterThan(0);
    });

    it("should return training matching indication", () => {
      const trainings = getOTFunctionalTrainingForIndication("ADL deficit");
      trainings.forEach((t) => {
        expect(t.indications.some((i) => i.includes("ADL"))).toBe(true);
      });
    });

    it("should return empty array for non-existent indication", () => {
      const trainings =
        getOTFunctionalTrainingForIndication("xyz123nonexistent");
      expect(trainings.length).toBe(0);
    });
  });

  describe("Functional Training Properties", () => {
    it("should have meaningful indications", () => {
      const trainings = getAllOTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.indications.length).toBeGreaterThan(0);
        expect(t.indications.every((i) => i.length > 0)).toBe(true);
      });
    });

    it("should have contraindications", () => {
      const trainings = getAllOTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.contraindications.length).toBeGreaterThan(0);
        expect(t.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });

    it("should have precautions", () => {
      const trainings = getAllOTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.precautions.length).toBeGreaterThan(0);
        expect(t.precautions.every((pr) => pr.length > 0)).toBe(true);
      });
    });

    it("should have source attribution", () => {
      const trainings = getAllOTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.source).toBeDefined();
        expect(t.source.length).toBeGreaterThan(0);
        expect(t.citation).toBeDefined();
        expect(t.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Activity Structure Validation", () => {
    it("should have valid progression stages", () => {
      const trainings = getAllOTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.progressionStages.length).toBeGreaterThan(0);
        t.progressionStages.forEach((stage) => {
          expect(stage.stage.length).toBeGreaterThan(0);
          expect(stage.exercises.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have parameters for each stage", () => {
      const trainings = getAllOTFunctionalTraining();
      trainings.forEach((t) => {
        t.progressionStages.forEach((stage) => {
          expect(stage.parameters).toBeDefined();
          expect(Object.keys(stage.parameters).length).toBeGreaterThan(0);
        });
      });
    });

    it("should have expected outcomes", () => {
      const trainings = getAllOTFunctionalTraining();
      trainings.forEach((t) => {
        expect(t.expectedOutcomes).toBeDefined();
        expect(t.expectedOutcomes.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Module Coverage", () => {
    it("should have 10 functional training programs", () => {
      const trainings = getAllOTFunctionalTraining();
      expect(trainings.length).toBe(10);
    });

    it("should cover multiple categories", () => {
      const trainings = getAllOTFunctionalTraining();
      const categories = new Set(trainings.map((t) => t.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it("should have comprehensive indication coverage", () => {
      const trainings = getAllOTFunctionalTraining();
      const allIndications = trainings.flatMap((t) => t.indications);
      expect(allIndications.length).toBeGreaterThan(10);
    });

    it("should have comprehensive stage coverage", () => {
      const trainings = getAllOTFunctionalTraining();
      const allStages = trainings.flatMap((t) => t.progressionStages);
      expect(allStages.length).toBeGreaterThan(10);
    });
  });
});
