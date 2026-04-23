/**
 * OT Assessment: Work Capacity Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTWorkCapacityAssessments,
  getOTWorkCapacityAssessmentById,
} from "../../data/ot-assessment-work-capacity";

describe("OT Assessment: Work Capacity", () => {
  describe("Data Structure", () => {
    it("should have all 4 assessments", () => {
      const assessments = getAllOTWorkCapacityAssessments();
      expect(assessments.length).toBe(4);
    });

    it("should have valid assessment structure", () => {
      const assessments = getAllOTWorkCapacityAssessments();
      assessments.forEach((assessment) => {
        expect(assessment.id).toBeDefined();
        expect(assessment.name).toBeDefined();
        expect(assessment.abbreviation).toBeDefined();
        expect(assessment.category).toBe("work-assessment");
        expect(assessment.evidenceLevel).toBeGreaterThanOrEqual(1);
      });
    });

    it("should include core tools (WCE, WRI, WEIS)", () => {
      const abbreviations = getAllOTWorkCapacityAssessments().map(
        (a) => a.abbreviation,
      );
      expect(abbreviations).toContain("WCE");
      expect(abbreviations).toContain("WRI");
      expect(abbreviations).toContain("WEIS");
    });
  });

  describe("getOTWorkCapacityAssessmentById", () => {
    it("should return assessment by ID", () => {
      const assessment = getOTWorkCapacityAssessmentById("ot-awc-001");
      expect(assessment?.abbreviation).toBe("WCE");
    });
  });
});
