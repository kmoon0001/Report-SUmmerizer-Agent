/**
 * PT Assessment: Functional Capacity Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllPTFunctionalCapacityAssessments,
  getPTFunctionalCapacityAssessmentById,
} from "../../data/pt-assessment-functional-capacity";

describe("PT Assessment: Functional Capacity", () => {
  describe("Data Structure", () => {
    it("should have all 3 assessments", () => {
      const assessments = getAllPTFunctionalCapacityAssessments();
      expect(assessments.length).toBe(3);
    });

    it("should have valid assessment structure", () => {
      const assessments = getAllPTFunctionalCapacityAssessments();
      assessments.forEach((assessment) => {
        expect(assessment.id).toBeDefined();
        expect(assessment.name).toBeDefined();
        expect(assessment.abbreviation).toBeDefined();
        expect(assessment.category).toBe("functional-capacity");
        expect(assessment.adminTime).toBeGreaterThanOrEqual(20);
      });
    });

    it("should have unique IDs (pt-afc-*)", () => {
      const ids = getAllPTFunctionalCapacityAssessments().map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain("pt-afc-001");
      expect(ids).toContain("pt-afc-003");
    });

    it("should include core FCE and NIOSH tools", () => {
      const abbreviations = getAllPTFunctionalCapacityAssessments().map(
        (a) => a.abbreviation,
      );
      expect(abbreviations).toContain("FCE");
      expect(abbreviations).toContain("NIOSH-LE");
    });
  });

  describe("getPTFunctionalCapacityAssessmentById", () => {
    it("should return assessment by valid ID", () => {
      const assessment = getPTFunctionalCapacityAssessmentById("pt-afc-001");
      expect(assessment?.abbreviation).toBe("FCE");
    });

    it("should return undefined for invalid ID", () => {
      const assessment = getPTFunctionalCapacityAssessmentById("invalid-id");
      expect(assessment).toBeUndefined();
    });
  });
});
