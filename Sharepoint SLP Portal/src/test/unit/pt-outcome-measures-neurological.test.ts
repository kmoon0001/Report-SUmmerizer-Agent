/**
 * PT Outcome Measures - Neurological Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTNeurologicalOutcomeMeasureById,
  getAllPTNeurologicalOutcomeMeasures,
  getPTNeurologicalOutcomeMeasuresByCondition,
  searchPTNeurologicalOutcomeMeasures,
  getPTNeurologicalOutcomeMeasuresByEvidenceLevel,
  calculateNeurologicalMCIDImprovement,
  getPTNeurologicalOutcomeMeasureCategories,
  validatePTNeurologicalOutcomeMeasureScore,
} from "../../data/pt-outcome-measures-neurological";

describe("PT Outcome Measures - Neurological", () => {
  describe("Data Structure", () => {
    it("should have all required measures", () => {
      const measures = getAllPTNeurologicalOutcomeMeasures();
      expect(measures.length).toBe(15);
    });

    it("should have valid measure structure", () => {
      const measures = getAllPTNeurologicalOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.scoreRange.min).toBeLessThan(measure.scoreRange.max);
        expect(measure.mcid).toBeGreaterThan(0);
        expect([1, 2, 3]).toContain(measure.evidenceLevel);
      });
    });

    it("should have unique IDs", () => {
      const measures = getAllPTNeurologicalOutcomeMeasures();
      const ids = measures.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should include core neurological measures", () => {
      const measures = getAllPTNeurologicalOutcomeMeasures();
      const abbreviations = measures.map((m) => m.abbreviation);
      expect(abbreviations).toContain("FIM");
      expect(abbreviations).toContain("NIHSS");
      expect(abbreviations).toContain("BBS");
      expect(abbreviations).toContain("TUG");
      expect(abbreviations).toContain("MoCA");
      expect(abbreviations).toContain("mRS");
      expect(abbreviations).toContain("PASS");
      expect(abbreviations).toContain("FMA-LE");
    });
  });

  describe("getPTNeurologicalOutcomeMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getPTNeurologicalOutcomeMeasureById("om-pt-031");
      expect(measure).toBeDefined();
      expect(measure?.abbreviation).toBe("FIM");
    });

    it("should return undefined for invalid ID", () => {
      const measure = getPTNeurologicalOutcomeMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });

    it("should return correct measure properties", () => {
      const measure = getPTNeurologicalOutcomeMeasureById("om-pt-032");
      expect(measure?.name).toBe("National Institutes of Health Stroke Scale");
      expect(measure?.abbreviation).toBe("NIHSS");
      expect(measure?.itemCount).toBe(11);
    });
  });

  describe("getAllPTNeurologicalOutcomeMeasures", () => {
    it("should return all 15 measures", () => {
      const measures = getAllPTNeurologicalOutcomeMeasures();
      expect(measures.length).toBe(15);
    });

    it("should return array copy", () => {
      const measures1 = getAllPTNeurologicalOutcomeMeasures();
      const measures2 = getAllPTNeurologicalOutcomeMeasures();
      expect(measures1).not.toBe(measures2);
      expect(measures1).toEqual(measures2);
    });
  });

  describe("getPTNeurologicalOutcomeMeasuresByCondition", () => {
    it("should return measures for Stroke", () => {
      const measures = getPTNeurologicalOutcomeMeasuresByCondition("Stroke");
      expect(measures.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const measures1 = getPTNeurologicalOutcomeMeasuresByCondition("stroke");
      const measures2 = getPTNeurologicalOutcomeMeasuresByCondition("STROKE");
      expect(measures1.length).toBe(measures2.length);
    });

    it("should return empty array for non-existent condition", () => {
      const measures =
        getPTNeurologicalOutcomeMeasuresByCondition("hypochondria");
      expect(measures.length).toBe(0);
    });
  });

  describe("searchPTNeurologicalOutcomeMeasures", () => {
    it("should find measure by name", () => {
      const measures = searchPTNeurologicalOutcomeMeasures(
        "Functional Independence",
      );
      expect(measures.length).toBeGreaterThan(0);
    });

    it("should find measure by abbreviation", () => {
      const measures = searchPTNeurologicalOutcomeMeasures("NIHSS");
      expect(measures.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const measures1 = searchPTNeurologicalOutcomeMeasures("fim");
      const measures2 = searchPTNeurologicalOutcomeMeasures("FIM");
      expect(measures1.length).toBe(measures2.length);
    });
  });

  describe("getPTNeurologicalOutcomeMeasuresByEvidenceLevel", () => {
    it("should return measures for level 1", () => {
      const measures = getPTNeurologicalOutcomeMeasuresByEvidenceLevel(1);
      expect(measures.length).toBeGreaterThan(10);
    });

    it("should return measures for level 2", () => {
      const measures = getPTNeurologicalOutcomeMeasuresByEvidenceLevel(2);
      expect(measures.length).toBeGreaterThan(0);
    });
  });

  describe("calculateNeurologicalMCIDImprovement", () => {
    it("should calculate MCID for FIM (higher is better)", () => {
      const result = calculateNeurologicalMCIDImprovement(80, 95, "om-pt-031");
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(15);
      expect(result?.achieved).toBe(true);
    });

    it("should calculate MCID for NIHSS (lower is better)", () => {
      const result = calculateNeurologicalMCIDImprovement(20, 15, "om-pt-032");
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(5);
      expect(result?.achieved).toBe(true);
    });

    it("should calculate MCID for mRS (lower is better)", () => {
      const result = calculateNeurologicalMCIDImprovement(4, 3, "om-pt-036");
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(1);
      expect(result?.achieved).toBe(true);
    });

    it("should return null for invalid measure ID", () => {
      const result = calculateNeurologicalMCIDImprovement(80, 95, "invalid-id");
      expect(result).toBeNull();
    });
  });

  describe("getPTNeurologicalOutcomeMeasureCategories", () => {
    it("should return multiple categories", () => {
      const categories = getPTNeurologicalOutcomeMeasureCategories();
      expect(categories.length).toBeGreaterThan(5);
    });

    it("should have no duplicates", () => {
      const categories = getPTNeurologicalOutcomeMeasureCategories();
      const uniqueCategories = new Set(categories);
      expect(uniqueCategories.size).toBe(categories.length);
    });

    it("should be sorted alphabetially", () => {
      const categories = getPTNeurologicalOutcomeMeasureCategories();
      const sorted = [...categories].sort();
      expect(categories).toEqual(sorted);
    });
  });

  describe("validatePTNeurologicalOutcomeMeasureScore", () => {
    it("should validate score within range", () => {
      const result = validatePTNeurologicalOutcomeMeasureScore("om-pt-031", 80);
      expect(result.valid).toBe(true);
    });

    it("should reject score below minimum", () => {
      const result = validatePTNeurologicalOutcomeMeasureScore("om-pt-031", 10);
      expect(result.valid).toBe(false);
    });

    it("should reject score above maximum", () => {
      const result = validatePTNeurologicalOutcomeMeasureScore(
        "om-pt-031",
        150,
      );
      expect(result.valid).toBe(false);
    });

    it("should accept boundary values", () => {
      const result1 = validatePTNeurologicalOutcomeMeasureScore(
        "om-pt-031",
        18,
      );
      const result2 = validatePTNeurologicalOutcomeMeasureScore(
        "om-pt-031",
        126,
      );
      expect(result1.valid).toBe(true);
      expect(result2.valid).toBe(true);
    });
  });

  describe("Data Quality", () => {
    it("should have meaningful descriptions", () => {
      const measures = getAllPTNeurologicalOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.description.length).toBeGreaterThan(10);
      });
    });

    it("should have valid MCID values", () => {
      const measures = getAllPTNeurologicalOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.mcid).toBeGreaterThan(0);
      });
    });

    it("should have properly formatted source attribution", () => {
      const measures = getAllPTNeurologicalOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.citation.length).toBeGreaterThan(10);
        expect(measure.citation).toMatch(/\d{4}/);
      });
    });

    it("should have at least 2 conditions per measure", () => {
      const measures = getAllPTNeurologicalOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.conditions.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle null ID gracefully", () => {
      const measure = getPTNeurologicalOutcomeMeasureById(null as any);
      expect(measure).toBeUndefined();
    });

    it("should handle undefined ID gracefully", () => {
      const measure = getPTNeurologicalOutcomeMeasureById(undefined as any);
      expect(measure).toBeUndefined();
    });

    it("should handle non-string ID gracefully", () => {
      const measure = getPTNeurologicalOutcomeMeasureById(123 as any);
      expect(measure).toBeUndefined();
    });

    it("should handle non-numeric scores gracefully", () => {
      const result = validatePTNeurologicalOutcomeMeasureScore(
        "om-pt-031",
        "invalid" as any,
      );
      expect(result.valid).toBe(false);
    });
  });
});
