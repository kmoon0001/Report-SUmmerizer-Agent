/**
 * OT Assessment: Sensory Processing Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTSensoryAssessments,
  getOTSensoryAssessmentById,
} from "../../data/ot-assessment-sensory-processing";

describe("OT Assessment: Sensory Processing", () => {
  describe("Data Structure", () => {
    it("should have all 4 assessments", () => {
      const assessments = getAllOTSensoryAssessments();
      expect(assessments.length).toBe(4);
    });

    it("should have valid assessment structure", () => {
      const assessments = getAllOTSensoryAssessments();
      assessments.forEach((assessment) => {
        expect(assessment.id).toBeDefined();
        expect(assessment.name).toBeDefined();
        expect(assessment.abbreviation).toBeDefined();
        expect(assessment.category).toBe("sensory-assessment");
        expect(assessment.evidenceLevel).toBeGreaterThanOrEqual(1);
      });
    });

    it("should include core tools (AASP, EASI, CRS-R)", () => {
      const abbreviations = getAllOTSensoryAssessments().map(
        (a) => a.abbreviation,
      );
      expect(abbreviations).toContain("AASP");
      expect(abbreviations).toContain("EASI");
      expect(abbreviations).toContain("CRS-R");
    });
  });

  describe("getOTSensoryAssessmentById", () => {
    it("should return assessment by ID", () => {
      const assessment = getOTSensoryAssessmentById("ot-asp-001");
      expect(assessment?.abbreviation).toBe("AASP");
    });
  });
});
