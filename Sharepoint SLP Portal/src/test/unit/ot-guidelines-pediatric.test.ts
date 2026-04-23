/**
 * OT Evidence-Based Guidelines - Pediatric Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTPediatricGuidelines,
  getOTPediatricGuidelineById,
  searchOTPediatricGuidelines,
} from "../../data/ot-guidelines-pediatric";

describe("OT Evidence-Based Guidelines - Pediatric", () => {
  describe("Data Structure", () => {
    it("should have all 10 guidelines", () => {
      const guidelines = getAllOTPediatricGuidelines();
      expect(guidelines.length).toBe(10);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllOTPediatricGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.condition).toBeDefined();
        expect(guideline.recommendations).toBeDefined();
        expect(Array.isArray(guideline.recommendations)).toBe(true);
        expect(guideline.assessments).toBeDefined();
        expect(Array.isArray(guideline.assessments)).toBe(true);
      });
    });

    it("should have unique IDs (gl-ot-031 to 040)", () => {
      const ids = getAllOTPediatricGuidelines().map((g) => g.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("gl-ot-031");
      expect(ids).toContain("gl-ot-040");
    });

    it("should include new pediatric conditions", () => {
      const names = getAllOTPediatricGuidelines().map((g) => g.name);
      expect(names).toContain("ADHD Management in Children");
      expect(names).toContain("Developmental Coordination Disorder (DCD)");
      expect(names).toContain("Sensory Processing Disorder (SPD)");
      expect(names).toContain("Handwriting and Literacy Support");
    });
  });

  describe("getOTPediatricGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getOTPediatricGuidelineById("gl-ot-035");
      expect(guideline?.name).toBe("Sensory Processing Disorder (SPD)");
    });
  });

  describe("searchOTPediatricGuidelines", () => {
    it("should find ADHD", () => {
      const results = searchOTPediatricGuidelines("ADHD");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe("gl-ot-032");
    });

    it("should find school-based services", () => {
      const results = searchOTPediatricGuidelines("school");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe("gl-ot-040");
    });
  });
});
