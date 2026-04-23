/**
 * PT Guidelines - CMS & Red Flags Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTRedFlagGuidelineById,
  getAllPTRedFlagGuidelines,
  searchPTRedFlagGuidelines,
  getPTRedFlagCategories,
} from "../../data/pt-guidelines-cms-red-flags";

describe("PT Guidelines - CMS & Red Flags", () => {
  describe("Data Structure", () => {
    it("should have all 10 guidelines", () => {
      const guidelines = getAllPTRedFlagGuidelines();
      expect(guidelines.length).toBe(10);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllPTRedFlagGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(guideline.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have unique IDs (gl-pt-021 to 030)", () => {
      const ids = getAllPTRedFlagGuidelines().map((g) => g.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("gl-pt-021");
      expect(ids).toContain("gl-pt-030");
    });

    it("should include new CMS/Red Flag guidelines", () => {
      const names = getAllPTRedFlagGuidelines().map((g) => g.name);
      expect(names).toContain("Geriatric Fall Risk Criteria (CMS)");
      expect(names).toContain("Home Health Eligibility (CMS)");
      expect(names).toContain("Telehealth Clinical Standards");
      expect(names).toContain("Skin and Wound Red Flags");
    });
  });

  describe("getPTRedFlagGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getPTRedFlagGuidelineById("gl-pt-026");
      expect(guideline?.name).toBe("Geriatric Fall Risk Criteria (CMS)");
    });
  });

  describe("searchPTRedFlagGuidelines", () => {
    it("should find home health", () => {
      const results = searchPTRedFlagGuidelines("homebound");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.id).toBe("gl-pt-029");
    });
  });

  describe("getPTRedFlagCategories", () => {
    it("should return unique categories", () => {
      const categories = getPTRedFlagCategories();
      expect(categories).toContain("CMS Coverage");
      expect(categories).toContain("Red Flags");
      expect(categories).toContain("APTA Standards");
    });
  });
});
