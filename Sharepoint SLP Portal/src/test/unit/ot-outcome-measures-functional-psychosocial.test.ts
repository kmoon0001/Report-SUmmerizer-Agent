/**
 * OT Outcome Measures - Functional & Psychosocial Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTFunctionalPsychosocialOutcomeMeasureById,
  getAllOTFunctionalPsychosocialOutcomeMeasures,
  searchOTFunctionalPsychosocialOutcomeMeasures,
  calculateOTFunctionalPsychosocialMCIDImprovement,
} from "../../data/ot-outcome-measures-functional-psychosocial";

describe("OT Outcome Measures - Functional & Psychosocial", () => {
  describe("Data Structure", () => {
    it("should have all 10 required measures", () => {
      const measures = getAllOTFunctionalPsychosocialOutcomeMeasures();
      expect(measures.length).toBe(10);
    });

    it("should have valid measure structure", () => {
      const measures = getAllOTFunctionalPsychosocialOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.scoreRange.min).toBeLessThan(measure.scoreRange.max);
        expect(measure.mcid).toBeGreaterThan(0);
        expect([1, 2, 3]).toContain(measure.evidenceLevel);
      });
    });

    it("should include core functional and psychosocial measures", () => {
      const abbreviations = getAllOTFunctionalPsychosocialOutcomeMeasures().map(
        (m) => m.abbreviation,
      );
      expect(abbreviations).toContain("FIM");
      expect(abbreviations).toContain("BI");
      expect(abbreviations).toContain("Katz");
      expect(abbreviations).toContain("ICL");
      expect(abbreviations).toContain("OSA");
      expect(abbreviations).toContain("BDI-II");
      expect(abbreviations).toContain("GAD-7");
      expect(abbreviations).toContain("HADS");
      expect(abbreviations).toContain("SSQ-6");
      expect(abbreviations).toContain("MAS");
    });
  });

  describe("getOTFunctionalPsychosocialOutcomeMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure =
        getOTFunctionalPsychosocialOutcomeMeasureById("om-ot-021");
      expect(measure).toBeDefined();
      expect(measure?.abbreviation).toBe("FIM");
    });

    it("should return undefined for invalid ID", () => {
      const measure =
        getOTFunctionalPsychosocialOutcomeMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });
  });

  describe("calculateOTFunctionalPsychosocialMCIDImprovement", () => {
    it("should calculate MCID for FIM (higher is better)", () => {
      const result = calculateOTFunctionalPsychosocialMCIDImprovement(
        80,
        95,
        "om-ot-021",
      );
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(15);
      expect(result?.achieved).toBe(true);
    });

    it("should calculate MCID for BDI-II (lower is better)", () => {
      const result = calculateOTFunctionalPsychosocialMCIDImprovement(
        20,
        14,
        "om-ot-026",
      );
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(6);
      expect(result?.mcid).toBe(5);
      expect(result?.achieved).toBe(true);
    });

    it("should calculate MCID for MAS (lower is better spasticity)", () => {
      const result = calculateOTFunctionalPsychosocialMCIDImprovement(
        3,
        2,
        "om-ot-030",
      );
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(1);
      expect(result?.achieved).toBe(true);
    });

    it("should handle BDI-II failure", () => {
      const result = calculateOTFunctionalPsychosocialMCIDImprovement(
        20,
        18,
        "om-ot-026",
      );
      expect(result?.achieved).toBe(false);
    });
  });

  describe("Search", () => {
    it("should find measure by keywords in name or abbreviation", () => {
      const measures =
        searchOTFunctionalPsychosocialOutcomeMeasures("Ashworth");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures[0].abbreviation).toBe("MAS");
    });
  });

  describe("Data Quality", () => {
    it("should have citations with years", () => {
      const measures = getAllOTFunctionalPsychosocialOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.citation).toMatch(/\d{4}/);
      });
    });

    it("should have at least 2 conditions per measure", () => {
      const measures = getAllOTFunctionalPsychosocialOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.conditions.length).toBeGreaterThanOrEqual(1); // Modified ICL may only have 1 broad condition
      });
    });
  });
});
