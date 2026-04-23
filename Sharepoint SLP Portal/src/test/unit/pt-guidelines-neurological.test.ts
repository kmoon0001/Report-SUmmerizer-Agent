/**
 * PT Evidence-Based Guidelines - Neurological Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTNeurologicalGuidelineById,
  getAllPTNeurologicalGuidelines,
  searchPTNeurologicalGuidelines,
  getPTNeurologicalGuidelineConditions,
} from "../../data/pt-guidelines-neurological";

describe("PT Evidence-Based Guidelines - Neurological", () => {
  describe("Data Structure", () => {
    it("should have all 10 guidelines", () => {
      const guidelines = getAllPTNeurologicalGuidelines();
      expect(guidelines.length).toBe(10);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllPTNeurologicalGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(guideline.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have unique IDs (gl-pt-011 to 020)", () => {
      const ids = getAllPTNeurologicalGuidelines().map((g) => g.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("gl-pt-011");
      expect(ids).toContain("gl-pt-020");
    });

    it("should include core neuro conditions", () => {
      const conditions = getAllPTNeurologicalGuidelines().map(
        (g) => g.condition,
      );
      expect(conditions).toContain("Stroke");
      expect(conditions).toContain("Parkinson's Disease");
      expect(conditions).toContain("Multiple Sclerosis");
      expect(conditions).toContain("Vestibular Dysfunction");
      expect(conditions).toContain("SCI");
    });
  });

  describe("getPTNeurologicalGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getPTNeurologicalGuidelineById("gl-pt-014");
      expect(guideline?.name).toBe("Vestibular Rehabilitation");
    });
  });

  describe("searchPTNeurologicalGuidelines", () => {
    it("should find stroke rehab", () => {
      const results = searchPTNeurologicalGuidelines("stroke");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.id).toBe("gl-pt-011");
    });
  });

  describe("getPTNeurologicalGuidelineConditions", () => {
    it("should return multiple conditions", () => {
      const conditions = getPTNeurologicalGuidelineConditions();
      expect(conditions.length).toBeGreaterThan(5);
      expect(conditions).toContain("Stroke");
      expect(conditions).toContain("Concussion");
    });
  });
});
