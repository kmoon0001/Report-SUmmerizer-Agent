import { describe, it, expect } from "vitest";
import {
  geriatricAssessmentTools,
  geriatricTreatmentProtocols,
  fallPreventionInterventions,
  balanceTrainingExercises,
  patientEducationMaterials,
} from "../../data/pt-geriatric-data";

describe("pt-geriatric-data-extended", () => {
  describe("geriatricAssessmentTools", () => {
    it("should be an array", () => {
      expect(Array.isArray(geriatricAssessmentTools)).toBe(true);
    });

    it("should contain assessment objects", () => {
      if (geriatricAssessmentTools.length > 0) {
        geriatricAssessmentTools.forEach((tool) => {
          expect(tool).toBeDefined();
          expect(typeof tool).toBe("object");
        });
      }
    });

    it("should have required properties", () => {
      if (geriatricAssessmentTools.length > 0) {
        geriatricAssessmentTools.forEach((tool) => {
          expect(tool.name).toBeDefined();
          expect(typeof tool.name).toBe("string");
          expect(tool.acronym).toBeDefined();
          expect(tool.domain).toBeDefined();
        });
      }
    });

    it("should have assessment descriptions", () => {
      if (geriatricAssessmentTools.length > 0) {
        geriatricAssessmentTools.forEach((tool) => {
          expect(tool.description).toBeDefined();
          expect(typeof tool.description).toBe("string");
        });
      }
    });

    it("should have scoring range information", () => {
      if (geriatricAssessmentTools.length > 0) {
        geriatricAssessmentTools.forEach((tool) => {
          expect(tool.scoringRange).toBeDefined();
          expect(tool.scoringRange.min).toBeDefined();
          expect(tool.scoringRange.max).toBeDefined();
        });
      }
    });

    it("should have clinical interpretation function", () => {
      if (geriatricAssessmentTools.length > 0) {
        geriatricAssessmentTools.forEach((tool) => {
          expect(typeof tool.interpretation).toBe("function");
          // Sample interpretation
          const sampleScore =
            (tool.scoringRange.min + tool.scoringRange.max) / 2;
          expect(typeof tool.interpretation(sampleScore)).toBe("string");
        });
      }
    });
  });

  describe("geriatricTreatmentProtocols", () => {
    it("should be an array", () => {
      expect(Array.isArray(geriatricTreatmentProtocols)).toBe(true);
    });

    it("should contain protocol objects", () => {
      if (geriatricTreatmentProtocols.length > 0) {
        geriatricTreatmentProtocols.forEach((protocol) => {
          expect(protocol.condition).toBeDefined();
          expect(Array.isArray(protocol.interventions)).toBe(true);
        });
      }
    });

    it("should have evidence level and citation", () => {
      if (geriatricTreatmentProtocols.length > 0) {
        geriatricTreatmentProtocols.forEach((protocol) => {
          expect(protocol.evidenceLevel).toBeDefined();
          expect(protocol.citation).toBeDefined();
        });
      }
    });
  });

  describe("fallPreventionInterventions", () => {
    it("should be an array", () => {
      expect(Array.isArray(fallPreventionInterventions)).toBe(true);
    });

    it("should contain intervention objects with reduction stats", () => {
      if (fallPreventionInterventions.length > 0) {
        fallPreventionInterventions.forEach((intervention) => {
          expect(intervention.name).toBeDefined();
          expect(intervention.fallReduction).toBeDefined();
          expect(typeof intervention.fallReduction).toBe("string");
        });
      }
    });
  });

  describe("balanceTrainingExercises", () => {
    it("should be an array", () => {
      expect(Array.isArray(balanceTrainingExercises)).toBe(true);
    });

    it("should have difficulty levels", () => {
      if (balanceTrainingExercises.length > 0) {
        balanceTrainingExercises.forEach((exercise) => {
          expect(["beginner", "intermediate", "advanced"]).toContain(
            exercise.level,
          );
        });
      }
    });
  });

  describe("patientEducationMaterials", () => {
    it("should be an array", () => {
      expect(Array.isArray(patientEducationMaterials)).toBe(true);
    });

    it("should contain educational key points", () => {
      if (patientEducationMaterials.length > 0) {
        patientEducationMaterials.forEach((material) => {
          expect(material.topic).toBeDefined();
          expect(Array.isArray(material.keyPoints)).toBe(true);
          expect(material.keyPoints.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe("data consistency", () => {
    it("should have geriatric assessment tool data", () => {
      expect(geriatricAssessmentTools.length).toBeGreaterThan(0);
    });

    it("should have geriatric treatment protocol data", () => {
      expect(geriatricTreatmentProtocols.length).toBeGreaterThan(0);
    });

    it("should have fall prevention intervention data", () => {
      expect(fallPreventionInterventions.length).toBeGreaterThan(0);
    });

    it("should have balance training exercises", () => {
      expect(balanceTrainingExercises.length).toBeGreaterThan(0);
    });

    it("should have patient education materials", () => {
      expect(patientEducationMaterials.length).toBeGreaterThan(0);
    });
  });
});
