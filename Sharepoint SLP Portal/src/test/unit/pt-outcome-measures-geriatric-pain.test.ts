/**
 * PT Outcome Measures - Geriatric & Pain Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTGeriatricPainOutcomeMeasureById,
  getAllPTGeriatricPainOutcomeMeasures,
  getPTGeriatricPainOutcomeMeasuresByCondition,
  searchPTGeriatricPainOutcomeMeasures,
  getPTGeriatricPainOutcomeMeasuresByEvidenceLevel,
  calculateGeriatricPainMCIDImprovement,
  getPTGeriatricPainOutcomeMeasureCategories,
  validatePTGeriatricPainOutcomeMeasureScore,
} from "../../data/pt-outcome-measures-geriatric-pain";

describe("PT Outcome Measures - Geriatric & Pain", () => {
  describe("Data Structure", () => {
    it("should have all required measures", () => {
      const measures = getAllPTGeriatricPainOutcomeMeasures();
      expect(measures.length).toBe(15);
    });

    it("should have valid measure structure", () => {
      const measures = getAllPTGeriatricPainOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.scoreRange.min).toBeLessThan(measure.scoreRange.max);
        expect(measure.mcid).toBeGreaterThan(0);
        expect([1, 2, 3]).toContain(measure.evidenceLevel);
      });
    });

    it("should include core geriatric and pain measures", () => {
      const measures = getAllPTGeriatricPainOutcomeMeasures();
      const abbreviations = measures.map((m) => m.abbreviation);
      expect(abbreviations).toContain("BI");
      expect(abbreviations).toContain("Katz");
      expect(abbreviations).toContain("Tinetti");
      expect(abbreviations).toContain("VAS");
      expect(abbreviations).toContain("NPRS");
      expect(abbreviations).toContain("PCS");
      expect(abbreviations).toContain("SF-36");
      expect(abbreviations).toContain("GDS-15");
      expect(abbreviations).toContain("TUG");
      expect(abbreviations).toContain("6MWT");
      expect(abbreviations).toContain("BBS");
    });
  });

  describe("getPTGeriatricPainOutcomeMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getPTGeriatricPainOutcomeMeasureById("om-pt-016");
      expect(measure).toBeDefined();
      expect(measure?.abbreviation).toBe("BI");
    });

    it("should return undefined for invalid ID", () => {
      const measure = getPTGeriatricPainOutcomeMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });

    it("should return correct measure properties", () => {
      const measure = getPTGeriatricPainOutcomeMeasureById("om-pt-019");
      expect(measure?.name).toBe("Visual Analog Scale");
      expect(measure?.abbreviation).toBe("VAS");
      expect(measure?.itemCount).toBe(1);
    });
  });

  describe("getAllPTGeriatricPainOutcomeMeasures", () => {
    it("should return all 15 measures", () => {
      const measures = getAllPTGeriatricPainOutcomeMeasures();
      expect(measures.length).toBe(15);
    });

    it("should return array copy", () => {
      const measures1 = getAllPTGeriatricPainOutcomeMeasures();
      const measures2 = getAllPTGeriatricPainOutcomeMeasures();
      expect(measures1).not.toBe(measures2);
      expect(measures1).toEqual(measures2);
    });
  });

  describe("getPTGeriatricPainOutcomeMeasuresByCondition", () => {
    it("should return measures for pain", () => {
      const measures = getPTGeriatricPainOutcomeMeasuresByCondition("pain");
      expect(measures.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const measures1 = getPTGeriatricPainOutcomeMeasuresByCondition("pain");
      const measures2 = getPTGeriatricPainOutcomeMeasuresByCondition("PAIN");
      expect(measures1.length).toBe(measures2.length);
    });

    it("should return empty array for non-existent condition", () => {
      const measures =
        getPTGeriatricPainOutcomeMeasuresByCondition("extravasation");
      expect(measures.length).toBe(0);
    });
  });

  describe("searchPTGeriatricPainOutcomeMeasures", () => {
    it("should find measure by name", () => {
      const measures = searchPTGeriatricPainOutcomeMeasures("Barthel");
      expect(measures.length).toBeGreaterThan(0);
    });

    it("should find measure by abbreviation", () => {
      const measures = searchPTGeriatricPainOutcomeMeasures("VAS");
      expect(measures.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const measures1 = searchPTGeriatricPainOutcomeMeasures("vas");
      const measures2 = searchPTGeriatricPainOutcomeMeasures("VAS");
      expect(measures1.length).toBe(measures2.length);
    });
  });

  describe("getPTGeriatricPainOutcomeMeasuresByEvidenceLevel", () => {
    it("should return measures for level 1", () => {
      const measures = getPTGeriatricPainOutcomeMeasuresByEvidenceLevel(1);
      expect(measures.length).toBeGreaterThan(10);
    });
  });

  describe("calculateGeriatricPainMCIDImprovement", () => {
    it("should calculate MCID for Barthel (higher is better)", () => {
      const result = calculateGeriatricPainMCIDImprovement(50, 60, "om-pt-016");
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(10);
      expect(result?.achieved).toBe(true);
    });

    it("should calculate MCID for VAS (lower is better)", () => {
      const result = calculateGeriatricPainMCIDImprovement(7, 5, "om-pt-019");
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(2);
      expect(result?.achieved).toBe(true);
    });

    it("should calculate MCID for TUG (lower is better)", () => {
      const result = calculateGeriatricPainMCIDImprovement(15, 11, "om-pt-025");
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(4);
      expect(result?.achieved).toBe(true);
    });

    it("should return null for invalid measure ID", () => {
      const result = calculateGeriatricPainMCIDImprovement(
        50,
        60,
        "invalid-id",
      );
      expect(result).toBeNull();
    });
  });

  describe("getPTGeriatricPainOutcomeMeasureCategories", () => {
    it("should return multiple categories", () => {
      const categories = getPTGeriatricPainOutcomeMeasureCategories();
      expect(categories.length).toBeGreaterThan(5);
    });

    it("should have no duplicates", () => {
      const categories = getPTGeriatricPainOutcomeMeasureCategories();
      const uniqueCategories = new Set(categories);
      expect(uniqueCategories.size).toBe(categories.length);
    });

    it("should be sorted", () => {
      const categories = getPTGeriatricPainOutcomeMeasureCategories();
      const sorted = [...categories].sort();
      expect(categories).toEqual(sorted);
    });
  });

  describe("validatePTGeriatricPainOutcomeMeasureScore", () => {
    it("should validate score within range", () => {
      const result = validatePTGeriatricPainOutcomeMeasureScore(
        "om-pt-016",
        50,
      );
      expect(result.valid).toBe(true);
    });

    it("should reject score below minimum", () => {
      const result = validatePTGeriatricPainOutcomeMeasureScore(
        "om-pt-016",
        -1,
      );
      expect(result.valid).toBe(false);
    });

    it("should reject score above maximum", () => {
      const result = validatePTGeriatricPainOutcomeMeasureScore(
        "om-pt-016",
        150,
      );
      expect(result.valid).toBe(false);
    });

    it("should accept boundary values", () => {
      const result1 = validatePTGeriatricPainOutcomeMeasureScore(
        "om-pt-016",
        0,
      );
      const result2 = validatePTGeriatricPainOutcomeMeasureScore(
        "om-pt-016",
        100,
      );
      expect(result1.valid).toBe(true);
      expect(result2.valid).toBe(true);
    });
  });

  describe("Data Quality", () => {
    it("should have meaningful descriptions", () => {
      const measures = getAllPTGeriatricPainOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.description.length).toBeGreaterThan(10);
      });
    });

    it("should have valid MCID values", () => {
      const measures = getAllPTGeriatricPainOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.mcid).toBeGreaterThan(0);
      });
    });

    it("should have source attribution with year", () => {
      const measures = getAllPTGeriatricPainOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.citation.length).toBeGreaterThan(10);
        expect(measure.citation).toMatch(/\d{4}/);
      });
    });

    it("should have multiple conditions per measure", () => {
      const measures = getAllPTGeriatricPainOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.conditions.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle null gracefully", () => {
      const measure = getPTGeriatricPainOutcomeMeasureById(null as any);
      expect(measure).toBeUndefined();
    });

    it("should handle undefined gracefully", () => {
      const measure = getPTGeriatricPainOutcomeMeasureById(undefined as any);
      expect(measure).toBeUndefined();
    });

    it("should handle non-numeric scores gracefully", () => {
      const result = validatePTGeriatricPainOutcomeMeasureScore(
        "om-pt-016",
        "invalid" as any,
      );
      expect(result.valid).toBe(false);
    });
  });
});
