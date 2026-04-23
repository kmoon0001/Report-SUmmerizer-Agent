/**
 * OT Assessment: Psychosocial & Developmental Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTPsychosocialDevelopmentalAssessments,
  getOTPsychosocialDevelopmentalAssessmentById,
} from "../../data/ot-assessment-psychosocial-developmental";

describe("OT Assessment: Psychosocial & Developmental", () => {
  describe("Data Structure", () => {
    it("should have all 4 assessments", () => {
      const assessments = getAllOTPsychosocialDevelopmentalAssessments();
      expect(assessments.length).toBe(4);
    });

    it("should have valid assessment structure", () => {
      const assessments = getAllOTPsychosocialDevelopmentalAssessments();
      assessments.forEach((assessment) => {
        expect(assessment.id).toBeDefined();
        expect(assessment.name).toBeDefined();
        expect(assessment.abbreviation).toBeDefined();
        expect([
          "psychosocial-assessment",
          "developmental-assessment",
        ]).toContain(assessment.category);
        expect(assessment.evidenceLevel).toBeGreaterThanOrEqual(1);
      });
    });

    it("should include core tools (COPM, Beery VMI, BOT-2, OSA)", () => {
      const abbreviations = getAllOTPsychosocialDevelopmentalAssessments().map(
        (a) => a.abbreviation,
      );
      expect(abbreviations).toContain("COPM");
      expect(abbreviations).toContain("Beery VMI");
      expect(abbreviations).toContain("BOT-2");
      expect(abbreviations).toContain("OSA");
    });
  });

  describe("getOTPsychosocialDevelopmentalAssessmentById", () => {
    it("should return assessment by ID", () => {
      const assessment =
        getOTPsychosocialDevelopmentalAssessmentById("ot-apd-001");
      expect(assessment?.abbreviation).toBe("COPM");
    });
  });
});
