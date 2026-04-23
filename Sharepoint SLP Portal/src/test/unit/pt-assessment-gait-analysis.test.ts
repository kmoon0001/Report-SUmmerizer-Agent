/**
 * PT Assessment: Gait Analysis Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllPTGaitAnalysisAssessments,
  getPTGaitAnalysisAssessmentById,
} from "../../data/pt-assessment-gait-analysis";

describe("PT Assessment: Gait Analysis", () => {
  describe("Data Structure", () => {
    it("should have all 4 assessments", () => {
      const assessments = getAllPTGaitAnalysisAssessments();
      expect(assessments.length).toBe(4);
    });

    it("should have valid assessment structure", () => {
      const assessments = getAllPTGaitAnalysisAssessments();
      assessments.forEach((assessment) => {
        expect(assessment.id).toBeDefined();
        expect(assessment.name).toBeDefined();
        expect(assessment.abbreviation).toBeDefined();
        expect(assessment.category).toBe("gait-analysis");
        expect(assessment.adminTime).toBeDefined();
      });
    });

    it("should have unique IDs (pt-aga-*)", () => {
      const ids = getAllPTGaitAnalysisAssessments().map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain("pt-aga-001");
      expect(ids).toContain("pt-aga-004");
    });

    it("should include core gait tools", () => {
      const abbreviations = getAllPTGaitAnalysisAssessments().map(
        (a) => a.abbreviation,
      );
      expect(abbreviations).toContain("OGA-RLA");
      expect(abbreviations).toContain("10MWT");
      expect(abbreviations).toContain("6MWT");
      expect(abbreviations).toContain("FGA");
    });
  });

  describe("getPTGaitAnalysisAssessmentById", () => {
    it("should return assessment by valid ID", () => {
      const assessment = getPTGaitAnalysisAssessmentById("pt-aga-002");
      expect(assessment?.abbreviation).toBe("10MWT");
    });
  });
});
