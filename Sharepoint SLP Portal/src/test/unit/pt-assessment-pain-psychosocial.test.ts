/**
 * PT Assessment: Pain & Psychosocial Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllPTPainPsychosocialAssessments,
  getPTPainPsychosocialAssessmentById,
} from "../../data/pt-assessment-pain-psychosocial";

describe("PT Assessment: Pain & Psychosocial", () => {
  describe("Data Structure", () => {
    it("should have all 4 assessments", () => {
      const assessments = getAllPTPainPsychosocialAssessments();
      expect(assessments.length).toBe(4);
    });

    it("should have valid assessment structure", () => {
      const assessments = getAllPTPainPsychosocialAssessments();
      assessments.forEach((assessment) => {
        expect(assessment.id).toBeDefined();
        expect(assessment.name).toBeDefined();
        expect(assessment.abbreviation).toBeDefined();
        expect(["pain", "psychosocial"]).toContain(assessment.category);
        expect(assessment.adminTime).toBeDefined();
      });
    });

    it("should have unique IDs (pt-app-*)", () => {
      const ids = getAllPTPainPsychosocialAssessments().map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain("pt-app-001");
      expect(ids).toContain("pt-app-004");
    });

    it("should include core pain and psychosocial tools", () => {
      const abbreviations = getAllPTPainPsychosocialAssessments().map(
        (a) => a.abbreviation,
      );
      expect(abbreviations).toContain("NPRS");
      expect(abbreviations).toContain("FABQ");
      expect(abbreviations).toContain("TSK-11");
      expect(abbreviations).toContain("PCS");
    });
  });

  describe("getPTPainPsychosocialAssessmentById", () => {
    it("should return assessment by valid ID", () => {
      const assessment = getPTPainPsychosocialAssessmentById("pt-app-001");
      expect(assessment?.abbreviation).toBe("NPRS");
    });
  });
});
