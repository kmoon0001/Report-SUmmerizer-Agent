/**
 * PT Assessment: Balance & Proprioception Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllPTBalanceAssessments,
  getPTBalanceAssessmentById,
} from "../../data/pt-assessment-balance-proprioception";

describe("PT Assessment: Balance & Proprioception", () => {
  describe("Data Structure", () => {
    it("should have all 4 assessments", () => {
      const assessments = getAllPTBalanceAssessments();
      expect(assessments.length).toBe(4);
    });

    it("should have valid assessment structure", () => {
      const assessments = getAllPTBalanceAssessments();
      assessments.forEach((assessment) => {
        expect(assessment.id).toBeDefined();
        expect(assessment.name).toBeDefined();
        expect(assessment.abbreviation).toBeDefined();
        expect(assessment.category).toBe("balance");
        expect(assessment.adminTime).toBeDefined();
      });
    });

    it("should have unique IDs (pt-abp-*)", () => {
      const ids = getAllPTBalanceAssessments().map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain("pt-abp-001");
      expect(ids).toContain("pt-abp-004");
    });

    it("should include core balance tools", () => {
      const abbreviations = getAllPTBalanceAssessments().map(
        (a) => a.abbreviation,
      );
      expect(abbreviations).toContain("BBS");
      expect(abbreviations).toContain("TUG");
      expect(abbreviations).toContain("m-CTSIB");
      expect(abbreviations).toContain("FSST");
    });
  });

  describe("getPTBalanceAssessmentById", () => {
    it("should return assessment by valid ID", () => {
      const assessment = getPTBalanceAssessmentById("pt-abp-001");
      expect(assessment?.abbreviation).toBe("BBS");
    });
  });
});
