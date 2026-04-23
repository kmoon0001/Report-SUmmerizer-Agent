/**
 * SLP Evidence-Based Guidelines - Adult Neurological & Medical Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllSLPAdultGuidelines,
  getSLPAdultGuidelineById,
  searchSLPAdultGuidelines,
} from "../../data/slp-guidelines-adult-neuro-med";

describe("SLP Evidence-Based Guidelines - Adult Neurological & Medical", () => {
  describe("Data Structure", () => {
    it("should have all 10 guidelines", () => {
      const guidelines = getAllSLPAdultGuidelines();
      expect(guidelines.length).toBe(10);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllSLPAdultGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.recommendations).toBeDefined();
        expect(Array.isArray(guideline.recommendations)).toBe(true);
      });
    });

    it("should have unique IDs (gl-slp-001 to 010)", () => {
      const ids = getAllSLPAdultGuidelines().map((g) => g.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("gl-slp-001");
      expect(ids).toContain("gl-slp-010");
    });

    it("should include core neuro and medical conditions", () => {
      const names = getAllSLPAdultGuidelines().map((g) => g.name);
      expect(names).toContain("Aphasia (Adults)");
      expect(names).toContain("Adult Dysphagia");
      expect(names).toContain("Traumatic Brain Injury (Adults)");
      expect(names).toContain("Dementia");
      expect(names).toContain("Tracheostomy & Ventilation");
    });
  });

  describe("getSLPAdultGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getSLPAdultGuidelineById("gl-slp-001");
      expect(guideline?.name).toBe("Aphasia (Adults)");
    });
  });

  describe("searchSLPAdultGuidelines", () => {
    it("should find swallow", () => {
      const results = searchSLPAdultGuidelines("swallow");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.id).toBe("gl-slp-002");
    });

    it("should find Parkinson", () => {
      const results = searchSLPAdultGuidelines("Parkinson");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.id).toBe("gl-slp-009");
    });
  });
});
