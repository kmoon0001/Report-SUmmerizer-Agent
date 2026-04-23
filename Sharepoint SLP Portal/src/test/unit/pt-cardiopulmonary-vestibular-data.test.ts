import { describe, it, expect } from "vitest";
import {
  cardiopulmonaryAssessmentTools,
  vestibularAssessmentTools,
  cardiacRehabPhases,
  pulmonaryRehabProtocols,
  bppvManeuvers,
  vestibularExercisePrograms,
} from "../../data/pt-cardiopulmonary-vestibular-data";

describe("pt-cardiopulmonary-vestibular-data", () => {
  describe("cardiopulmonaryAssessmentTools", () => {
    it("should be an array", () => {
      expect(Array.isArray(cardiopulmonaryAssessmentTools)).toBe(true);
    });

    it("should contain assessment objects", () => {
      if (cardiopulmonaryAssessmentTools.length > 0) {
        cardiopulmonaryAssessmentTools.forEach((assessment) => {
          expect(assessment).toBeDefined();
          expect(typeof assessment).toBe("object");
        });
      }
    });

    it("should have required properties", () => {
      if (cardiopulmonaryAssessmentTools.length > 0) {
        cardiopulmonaryAssessmentTools.forEach((assessment) => {
          expect(assessment.name || assessment.acronym).toBeDefined();
          expect(typeof (assessment.name || assessment.acronym)).toBe("string");
        });
      }
    });
  });

  describe("vestibularAssessmentTools", () => {
    it("should be an array", () => {
      expect(Array.isArray(vestibularAssessmentTools)).toBe(true);
    });

    it("should contain assessment objects", () => {
      if (vestibularAssessmentTools.length > 0) {
        vestibularAssessmentTools.forEach((assessment) => {
          expect(assessment).toBeDefined();
          expect(typeof assessment).toBe("object");
        });
      }
    });
  });

  describe("cardiacRehabPhases", () => {
    it("should be an array", () => {
      expect(Array.isArray(cardiacRehabPhases)).toBe(true);
    });

    it("should feature phase information", () => {
      expect(cardiacRehabPhases.length).toBeGreaterThan(0);
      cardiacRehabPhases.forEach((phase) => {
        expect(phase.phase).toBeDefined();
        expect(phase.name).toBeDefined();
      });
    });
  });

  describe("pulmonaryRehabProtocols", () => {
    it("should be an array", () => {
      expect(Array.isArray(pulmonaryRehabProtocols)).toBe(true);
    });
  });

  describe("bppvManeuvers", () => {
    it("should be an array", () => {
      expect(Array.isArray(bppvManeuvers)).toBe(true);
    });
  });

  describe("vestibularExercisePrograms", () => {
    it("should be an array", () => {
      expect(Array.isArray(vestibularExercisePrograms)).toBe(true);
    });
  });
});
