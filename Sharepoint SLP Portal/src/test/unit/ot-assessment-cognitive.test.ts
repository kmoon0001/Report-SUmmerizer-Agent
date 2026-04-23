/**
 * OT Assessment: Cognitive Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTCognitiveAssessments,
  getOTCognitiveAssessmentById,
} from "../../data/ot-assessment-cognitive";

describe("OT Assessment: Cognitive", () => {
  describe("Data Structure", () => {
    it("should have all 4 assessments", () => {
      const assessments = getAllOTCognitiveAssessments();
      expect(assessments.length).toBe(4);
    });

    it("should have valid assessment structure", () => {
      const assessments = getAllOTCognitiveAssessments();
      assessments.forEach((assessment) => {
        expect(assessment.id).toBeDefined();
        expect(assessment.name).toBeDefined();
        expect(assessment.abbreviation).toBeDefined();
        expect(assessment.category).toBe("cognitive-assessment");
        expect(assessment.evidenceLevel).toBeGreaterThanOrEqual(1);
      });
    });

    it("should include core tools (MoCA, EFPT)", () => {
      const abbreviations = getAllOTCognitiveAssessments().map(
        (a) => a.abbreviation,
      );
      expect(abbreviations).toContain("MoCA");
      expect(abbreviations).toContain("EFPT");
    });
  });

  describe("getOTCognitiveAssessmentById", () => {
    it("should return assessment by ID", () => {
      const assessment = getOTCognitiveAssessmentById("ot-ac-001");
      expect(assessment?.abbreviation).toBe("MoCA");
    });
  });
});
