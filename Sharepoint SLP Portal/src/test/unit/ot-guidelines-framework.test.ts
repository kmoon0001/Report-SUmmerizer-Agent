/**
 * OT Evidence-Based Guidelines - Framework & Standards Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTFrameworkGuidelines,
  getOTFrameworkGuidelineById,
  searchOTFrameworkGuidelines,
} from "../../data/ot-guidelines-framework";

describe("OT Evidence-Based Guidelines - Framework & Standards", () => {
  describe("Data Structure", () => {
    it("should have all 10 guidelines", () => {
      const guidelines = getAllOTFrameworkGuidelines();
      expect(guidelines.length).toBe(10);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllOTFrameworkGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.category).toBeDefined();
        expect(guideline.recommendations).toBeUndefined(); // This interface uses keyElements
        expect(guideline.keyElements).toBeDefined();
      });
    });

    it("should have unique IDs (gl-ot-061 to 070)", () => {
      const ids = getAllOTFrameworkGuidelines().map((g) => g.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("gl-ot-061");
      expect(ids).toContain("gl-ot-070");
    });

    it("should include core AOTA standards", () => {
      const names = getAllOTFrameworkGuidelines().map((g) => g.name);
      expect(names).toContain("AOTA Practice Framework (OTPF-4)");
      expect(names).toContain("AOTA Standards of Practice");
      expect(names).toContain("AOTA Code of Ethics");
      expect(names).toContain("AOTA Documentation Guidelines");
      expect(names).toContain("Cultural Humility and Equity in OT");
    });
  });

  describe("getOTFrameworkGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getOTFrameworkGuidelineById("gl-ot-063");
      expect(guideline?.name).toBe("AOTA Code of Ethics");
    });
  });

  describe("searchOTFrameworkGuidelines", () => {
    it("should find documentation", () => {
      const results = searchOTFrameworkGuidelines("documentation");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe("gl-ot-065");
    });

    it("should find ethical principles", () => {
      const results = searchOTFrameworkGuidelines("Ethics");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].category).toBe("Ethics");
    });
  });
});
