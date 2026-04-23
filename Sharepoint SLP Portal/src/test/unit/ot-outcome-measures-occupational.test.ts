/**
 * OT Outcome Measures - Occupational Performance Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTOccupationalOutcomeMeasureById,
  getAllOTOccupationalOutcomeMeasures,
  getOTOccupationalOutcomeMeasuresByCondition,
  searchOTOccupationalOutcomeMeasures,
  getOTOccupationalOutcomeMeasuresByEvidenceLevel,
  calculateOTOccupationalMCIDImprovement,
  getOTOccupationalOutcomeMeasureCategories,
  validateOTOccupationalOutcomeMeasureScore,
} from "../../data/ot-outcome-measures-occupational";

describe("OT Outcome Measures - Occupational Performance", () => {
  describe("Data Structure", () => {
    it("should have all 10 required measures", () => {
      const measures = getAllOTOccupationalOutcomeMeasures();
      expect(measures.length).toBe(10);
    });

    it("should have valid measure structure", () => {
      const measures = getAllOTOccupationalOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.scoreRange.min).toBeLessThan(measure.scoreRange.max);
        expect(measure.mcid).toBeGreaterThan(0);
        expect([1, 2, 3]).toContain(measure.evidenceLevel);
      });
    });

    it("should include core occupational measures", () => {
      const measures = getAllOTOccupationalOutcomeMeasures();
      const abbreviations = measures.map((m) => m.abbreviation);
      expect(abbreviations).toContain("COPM");
      expect(abbreviations).toContain("AMPS");
      expect(abbreviations).toContain("KELS");
      expect(abbreviations).toContain("RC");
      expect(abbreviations).toContain("MOHOST");
      expect(abbreviations).toContain("OPHI-II");
    });
  });

  describe("getOTOccupationalOutcomeMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getOTOccupationalOutcomeMeasureById("om-ot-001");
      expect(measure).toBeDefined();
      expect(measure?.abbreviation).toBe("COPM");
    });

    it("should return undefined for invalid ID", () => {
      const measure = getOTOccupationalOutcomeMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });
  });

  describe("searchOTOccupationalOutcomeMeasures", () => {
    it("should find measure by description keyword", () => {
      const measures = searchOTOccupationalOutcomeMeasures("motor and process");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures[0].abbreviation).toBe("AMPS");
    });

    it("should find measure by abbreviation", () => {
      const measures = searchOTOccupationalOutcomeMeasures("KELS");
      expect(measures.length).toBeGreaterThan(0);
    });
  });

  describe("calculateOTOccupationalMCIDImprovement", () => {
    it("should calculate MCID for COPM (higher is better)", () => {
      const result = calculateOTOccupationalMCIDImprovement(4, 6, "om-ot-001");
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(2);
      expect(result?.achieved).toBe(true);
    });

    it("should calculate MCID failure correctly", () => {
      const result = calculateOTOccupationalMCIDImprovement(4, 5, "om-ot-001");
      expect(result?.achieved).toBe(false);
    });
  });

  describe("validateOTOccupationalOutcomeMeasureScore", () => {
    it("should validate score within range", () => {
      const result = validateOTOccupationalOutcomeMeasureScore("om-ot-001", 5);
      expect(result.valid).toBe(true);
    });

    it("should reject score out of range", () => {
      const result = validateOTOccupationalOutcomeMeasureScore("om-ot-001", 11);
      expect(result.valid).toBe(false);
    });
  });

  describe("Data Quality", () => {
    it("should have AOTA or MOHO as major sources", () => {
      const measures = getAllOTOccupationalOutcomeMeasures();
      measures.forEach((measure) => {
        expect(["AOTA", "MOHO"]).toContain(measure.source);
      });
    });

    it("should have citations with years", () => {
      const measures = getAllOTOccupationalOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.citation).toMatch(/\d{4}/);
      });
    });
  });
});
