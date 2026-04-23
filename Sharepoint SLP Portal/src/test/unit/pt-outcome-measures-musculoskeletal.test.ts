/**
 * PT Outcome Measures - Musculoskeletal Tests
 *
 * Comprehensive test suite for musculoskeletal outcome measures
 * Tests data integrity, export functions, and error handling
 */

import { describe, it, expect } from "vitest";
import {
  getPTOutcomeMeasureById,
  getAllPTOutcomeMeasuresMusculoskeletal,
  getPTOutcomeMeasuresByCondition,
  searchPTOutcomeMeasures,
  getPTOutcomeMeasuresByEvidenceLevel,
  calculateMCIDImprovement,
  getPTOutcomeMeasureCategories,
  validatePTOutcomeMeasureScore,
} from "../../data/pt-outcome-measures-musculoskeletal";

describe("PT Outcome Measures - Musculoskeletal", () => {
  describe("Data Structure", () => {
    it("should have all required measures", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      expect(measures.length).toBe(15);
    });

    it("should have valid measure structure", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.description).toBeDefined();
        expect(measure.itemCount).toBeGreaterThan(0);
        expect(measure.scoreRange).toBeDefined();
        expect(measure.scoreRange.min).toBeLessThan(measure.scoreRange.max);
        expect(measure.mcid).toBeGreaterThan(0);
        expect(measure.conditions.length).toBeGreaterThan(0);
        expect(measure.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(measure.evidenceLevel).toBeLessThanOrEqual(3);
        expect(measure.source).toBeDefined();
        expect(measure.citation).toBeDefined();
        expect(measure.lastUpdated).toBeInstanceOf(Date);
      });
    });

    it("should have unique IDs", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      const ids = measures.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have unique abbreviations", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      const abbreviations = measures.map((m) => m.abbreviation);
      const uniqueAbbreviations = new Set(abbreviations);
      expect(uniqueAbbreviations.size).toBe(abbreviations.length);
    });

    it("should have all measures with valid evidence level", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      measures.forEach((measure) => {
        expect([1, 2, 3]).toContain(measure.evidenceLevel);
      });
    });

    it("should have APTA as source for most measures", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      const aptaMeasures = measures.filter((m) => m.source === "APTA");
      expect(aptaMeasures.length).toBeGreaterThan(10);
    });
  });

  describe("getPTOutcomeMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getPTOutcomeMeasureById("om-pt-001");
      expect(measure).toBeDefined();
      expect(measure?.abbreviation).toBe("LEFS");
    });

    it("should return undefined for invalid ID", () => {
      const measure = getPTOutcomeMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });

    it("should return undefined for empty ID", () => {
      const measure = getPTOutcomeMeasureById("");
      expect(measure).toBeUndefined();
    });

    it("should return undefined for non-string ID", () => {
      const measure = getPTOutcomeMeasureById(123 as any);
      expect(measure).toBeUndefined();
    });

    it("should return correct measure properties", () => {
      const measure = getPTOutcomeMeasureById("om-pt-002");
      expect(measure?.name).toBe("Disabilities of Arm, Shoulder and Hand");
      expect(measure?.abbreviation).toBe("DASH");
      expect(measure?.itemCount).toBe(30);
      expect(measure?.scoreRange.max).toBe(100);
    });
  });

  describe("getAllPTOutcomeMeasuresMusculoskeletal", () => {
    it("should return all measures", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      expect(measures.length).toBe(15);
    });

    it("should return array copy", () => {
      const measures1 = getAllPTOutcomeMeasuresMusculoskeletal();
      const measures2 = getAllPTOutcomeMeasuresMusculoskeletal();
      expect(measures1).not.toBe(measures2);
      expect(measures1).toEqual(measures2);
    });

    it("should include core musculoskeletal measures", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      const abbreviations = measures.map((m) => m.abbreviation);
      expect(abbreviations).toContain("LEFS");
      expect(abbreviations).toContain("DASH");
      expect(abbreviations).toContain("NDI");
      expect(abbreviations).toContain("FABQ-PA");
      expect(abbreviations).toContain("FAAM-ADL");
      expect(abbreviations).toContain("WOMAC");
      expect(abbreviations).toContain("SPADI");
      expect(abbreviations).toContain("ASES");
      expect(abbreviations).toContain("TMD");
      expect(abbreviations).toContain("TSK-11");
    });
  });

  describe("getPTOutcomeMeasuresByCondition", () => {
    it("should return measures for valid condition", () => {
      const measures = getPTOutcomeMeasuresByCondition("Knee");
      expect(measures.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const measures1 = getPTOutcomeMeasuresByCondition("knee");
      const measures2 = getPTOutcomeMeasuresByCondition("KNEE");
      expect(measures1.length).toBe(measures2.length);
    });

    it("should return empty array for non-existent condition", () => {
      const measures = getPTOutcomeMeasuresByCondition("xyz123nonexistent");
      expect(measures.length).toBe(0);
    });

    it("should return empty array for empty condition", () => {
      const measures = getPTOutcomeMeasuresByCondition("");
      expect(measures.length).toBe(0);
    });

    it("should return empty array for non-string condition", () => {
      const measures = getPTOutcomeMeasuresByCondition(123 as any);
      expect(measures.length).toBe(0);
    });

    it("should return KOOS and HOOS for hip/knee conditions", () => {
      const measures = getPTOutcomeMeasuresByCondition("Hip");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.some((m) => m.abbreviation === "HOOS")).toBe(true);
    });
  });

  describe("searchPTOutcomeMeasures", () => {
    it("should find measure by name", () => {
      const measures = searchPTOutcomeMeasures("Lower Extremity");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.some((m) => m.abbreviation === "LEFS")).toBe(true);
    });

    it("should find measure by abbreviation", () => {
      const measures = searchPTOutcomeMeasures("DASH");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.some((m) => m.abbreviation === "DASH")).toBe(true);
    });

    it("should be case-insensitive", () => {
      const measures1 = searchPTOutcomeMeasures("dash");
      const measures2 = searchPTOutcomeMeasures("DASH");
      expect(measures1.length).toBe(measures2.length);
    });

    it("should return empty array for non-matching query", () => {
      const measures = searchPTOutcomeMeasures("xyz123nonexistent");
      expect(measures.length).toBe(0);
    });

    it("should return empty array for empty query", () => {
      const measures = searchPTOutcomeMeasures("");
      expect(measures.length).toBe(0);
    });

    it("should find measure by description", () => {
      const measures = searchPTOutcomeMeasures("self-report");
      expect(measures.length).toBeGreaterThan(0);
    });
  });

  describe("getPTOutcomeMeasuresByEvidenceLevel", () => {
    it("should return measures for valid evidence level", () => {
      const measures = getPTOutcomeMeasuresByEvidenceLevel(1);
      expect(measures.length).toBeGreaterThan(10);
    });

    it("should return measures for level 2", () => {
      const measures = getPTOutcomeMeasuresByEvidenceLevel(2);
      expect(measures.length).toBeGreaterThan(0);
      expect(measures[0].abbreviation).toBe("TMD");
    });

    it("should return empty array for level 3", () => {
      const measures = getPTOutcomeMeasuresByEvidenceLevel(3);
      expect(measures.length).toBe(0);
    });

    it("should return empty array for invalid level", () => {
      const measures = getPTOutcomeMeasuresByEvidenceLevel(4 as any);
      expect(measures.length).toBe(0);
    });
  });

  describe("calculateMCIDImprovement", () => {
    it("should calculate MCID for LEFS", () => {
      const result = calculateMCIDImprovement(30, 40, "om-pt-001");
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(10);
      expect(result?.mcid).toBe(9);
      expect(result?.achieved).toBe(true);
    });

    it("should calculate MCID for DASH (lower is better)", () => {
      const result = calculateMCIDImprovement(50, 35, "om-pt-002");
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(15);
      expect(result?.mcid).toBe(12.5);
      expect(result?.achieved).toBe(true);
    });

    it("should return null for invalid measure ID", () => {
      const result = calculateMCIDImprovement(30, 40, "invalid-id");
      expect(result).toBeNull();
    });

    it("should return null for non-numeric scores", () => {
      const result = calculateMCIDImprovement("30" as any, 40, "om-pt-001");
      expect(result).toBeNull();
    });

    it("should detect when MCID not achieved", () => {
      const result = calculateMCIDImprovement(30, 35, "om-pt-001");
      expect(result?.achieved).toBe(false);
    });
  });

  describe("getPTOutcomeMeasureCategories", () => {
    it("should return all categories", () => {
      const categories = getPTOutcomeMeasureCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include common conditions", () => {
      const categories = getPTOutcomeMeasureCategories();
      expect(categories.some((c) => c.includes("pain"))).toBe(true);
    });

    it("should have no duplicates", () => {
      const categories = getPTOutcomeMeasureCategories();
      const uniqueCategories = new Set(categories);
      expect(uniqueCategories.size).toBe(categories.length);
    });

    it("should be sorted", () => {
      const categories = getPTOutcomeMeasureCategories();
      const sorted = [...categories].sort();
      expect(categories).toEqual(sorted);
    });
  });

  describe("validatePTOutcomeMeasureScore", () => {
    it("should validate score within range", () => {
      const result = validatePTOutcomeMeasureScore("om-pt-001", 40);
      expect(result.valid).toBe(true);
    });

    it("should reject score below minimum", () => {
      const result = validatePTOutcomeMeasureScore("om-pt-001", -1);
      expect(result.valid).toBe(false);
    });

    it("should reject score above maximum", () => {
      const result = validatePTOutcomeMeasureScore("om-pt-001", 100);
      expect(result.valid).toBe(false);
    });

    it("should reject non-numeric score", () => {
      const result = validatePTOutcomeMeasureScore(
        "om-pt-001",
        "invalid" as any,
      );
      expect(result.valid).toBe(false);
    });

    it("should reject invalid measure ID", () => {
      const result = validatePTOutcomeMeasureScore("invalid-id", 40);
      expect(result.valid).toBe(false);
    });

    it("should accept boundary values", () => {
      const result1 = validatePTOutcomeMeasureScore("om-pt-001", 0);
      const result2 = validatePTOutcomeMeasureScore("om-pt-001", 80);
      expect(result1.valid).toBe(true);
      expect(result2.valid).toBe(true);
    });
  });

  describe("Data Quality", () => {
    it("should have meaningful descriptions", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      measures.forEach((measure) => {
        expect(measure.description.length).toBeGreaterThan(10);
      });
    });

    it("should have valid MCID values", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      measures.forEach((measure) => {
        expect(measure.mcid).toBeGreaterThan(0);
        expect(measure.mcid).toBeLessThan(measure.scoreRange.max);
      });
    });

    it("should have source attribution", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      measures.forEach((measure) => {
        expect(measure.citation.length).toBeGreaterThan(10);
        // Check for author names and year
        expect(measure.citation).toMatch(/\d{4}/); // Year in citation
      });
    });

    it("should have reasonable admin times", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      measures.forEach((measure) => {
        expect(measure.adminTime).toMatch(/\d+ minutes?/);
      });
    });

    it("should have valid conditions per measure", () => {
      const measures = getAllPTOutcomeMeasuresMusculoskeletal();
      measures.forEach((measure) => {
        expect(measure.conditions.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle null gracefully", () => {
      const measure = getPTOutcomeMeasureById(null as any);
      expect(measure).toBeUndefined();
    });

    it("should handle undefined gracefully", () => {
      const measure = getPTOutcomeMeasureById(undefined as any);
      expect(measure).toBeUndefined();
    });

    it("should handle object gracefully", () => {
      const measure = getPTOutcomeMeasureById({} as any);
      expect(measure).toBeUndefined();
    });

    it("should handle array gracefully", () => {
      const measures = getPTOutcomeMeasuresByCondition([] as any);
      expect(measures.length).toBe(0);
    });
  });
});
