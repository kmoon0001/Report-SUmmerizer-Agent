/**
 * PT Assessment: Neurological Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllPTNeurologicalAssessments,
  getPTNeurologicalAssessmentById,
} from "../../data/pt-assessment-neurological";

describe("PT Assessment: Neurological", () => {
  describe("Data Structure", () => {
    it("should have all 4 assessments", () => {
      const assessments = getAllPTNeurologicalAssessments();
      expect(assessments.length).toBe(4);
    });

    it("should have valid assessment structure", () => {
      const assessments = getAllPTNeurologicalAssessments();
      assessments.forEach((assessment) => {
        expect(assessment.id).toBeDefined();
        expect(assessment.name).toBeDefined();
        expect(assessment.abbreviation).toBeDefined();
        expect(assessment.category).toBe("neurological");
        expect(assessment.adminTime).toBeDefined();
      });
    });

    it("should have unique IDs (pt-an-*)", () => {
      const ids = getAllPTNeurologicalAssessments().map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain("pt-an-001");
      expect(ids).toContain("pt-an-004");
    });

    it("should include core neuro tools", () => {
      const abbreviations = getAllPTNeurologicalAssessments().map(
        (a) => a.abbreviation,
      );
      expect(abbreviations).toContain("AIS");
      expect(abbreviations).toContain("MAS");
      expect(abbreviations).toContain("NIHSS");
      expect(abbreviations).toContain("FMA-LE");
    });
  });

  describe("getPTNeurologicalAssessmentById", () => {
    it("should return assessment by valid ID", () => {
      const assessment = getPTNeurologicalAssessmentById("pt-an-001");
      expect(assessment?.abbreviation).toBe("AIS");
    });
  });
});
