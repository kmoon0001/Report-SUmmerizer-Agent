/**
 * SLP Outcome Measures - Pediatric & Developmental Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllSLPPediatricOutcomeMeasures,
  getSLPPediatricOutcomeMeasureById,
  searchSLPPediatricOutcomeMeasures,
} from "../../data/slp-outcome-measures-pediatric";

describe("SLP Outcome Measures - Pediatric & Developmental", () => {
  describe("Data Structure", () => {
    it("should have all 10 measures", () => {
      const measures = getAllSLPPediatricOutcomeMeasures();
      expect(measures.length).toBe(10);
    });

    it("should have valid measure structure", () => {
      const measures = getAllSLPPediatricOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.description).toBeDefined();
        expect(measure.mcid).toBeDefined();
      });
    });

    it("should have unique IDs (om-slp-021 to 030)", () => {
      const ids = getAllSLPPediatricOutcomeMeasures().map((m) => m.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("om-slp-021");
      expect(ids).toContain("om-slp-030");
    });

    it("should include core pediatric assessments", () => {
      const abbreviations = getAllSLPPediatricOutcomeMeasures().map(
        (m) => m.abbreviation,
      );
      expect(abbreviations).toContain("GFTA-3");
      expect(abbreviations).toContain("PLS-5");
      expect(abbreviations).toContain("CELF-5");
      expect(abbreviations).toContain("SSI-4");
      expect(abbreviations).toContain("PPVT-5");
      expect(abbreviations).toContain("TOPL-2");
    });
  });

  describe("getSLPPediatricOutcomeMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getSLPPediatricOutcomeMeasureById("om-slp-021");
      expect(measure?.abbreviation).toBe("GFTA-3");
    });
  });

  describe("searchSLPPediatricOutcomeMeasures", () => {
    it("should find Language assessments", () => {
      const results = searchSLPPediatricOutcomeMeasures("Language");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find articulation tool", () => {
      const results = searchSLPPediatricOutcomeMeasures("Articulation");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.id).toBe("om-slp-021");
    });
  });
});
