/**
 * PT Evidence-Based Guidelines - Musculoskeletal Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTGuidelineById,
  getAllPTGuidelines,
  searchPTGuidelines,
  getPTGuidelineConditions,
} from "../../data/pt-guidelines-musculoskeletal";

describe("PT Evidence-Based Guidelines - Musculoskeletal", () => {
  describe("Data Structure", () => {
    it("should have all 10 guidelines", () => {
      const guidelines = getAllPTGuidelines();
      expect(guidelines.length).toBe(10);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllPTGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(guideline.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have unique IDs (gl-pt-001 to 010)", () => {
      const ids = getAllPTGuidelines().map((g) => g.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("gl-pt-001");
      expect(ids).toContain("gl-pt-010");
    });

    it("should include new musculoskeletal guidelines", () => {
      const names = getAllPTGuidelines().map((g) => g.name);
      expect(names).toContain("Plantar Fasciitis / Heel Pain");
      expect(names).toContain("Ankle Sprain (Lateral)");
      expect(names).toContain("Patellofemoral Pain Syndrome");
    });
  });

  describe("getPTGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getPTGuidelineById("gl-pt-007");
      expect(guideline?.name).toBe("Plantar Fasciitis / Heel Pain");
    });
  });

  describe("searchPTGuidelines", () => {
    it("should find heel pain", () => {
      const results = searchPTGuidelines("heel");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.id).toBe("gl-pt-007");
    });
  });

  describe("getPTGuidelineConditions", () => {
    it("should return unique conditions", () => {
      const conditions = getPTGuidelineConditions();
      expect(conditions).toContain("Heel Pain");
      expect(conditions).toContain("Ankle Sprain");
      expect(conditions).toContain("Knee Pain");
    });
  });
});
