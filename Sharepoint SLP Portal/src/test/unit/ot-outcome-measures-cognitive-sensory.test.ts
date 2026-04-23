/**
 * OT Outcome Measures - Cognitive & Sensory Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTCognitiveSensoryOutcomeMeasureById,
  getAllOTCognitiveSensoryOutcomeMeasures,
  searchOTCognitiveSensoryOutcomeMeasures,
  calculateOTCognitiveSensoryMCIDImprovement,
} from "../../data/ot-outcome-measures-cognitive-sensory";

describe("OT Outcome Measures - Cognitive & Sensory", () => {
  describe("Data Structure", () => {
    it("should have all 10 required measures", () => {
      const measures = getAllOTCognitiveSensoryOutcomeMeasures();
      expect(measures.length).toBe(10);
    });

    it("should have valid measure structure", () => {
      const measures = getAllOTCognitiveSensoryOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.scoreRange.min).toBeLessThan(measure.scoreRange.max);
        expect(measure.mcid).toBeGreaterThan(0);
        expect([1, 2, 3]).toContain(measure.evidenceLevel);
      });
    });

    it("should include core cognitive and sensory measures", () => {
      const measures = getAllOTCognitiveSensoryOutcomeMeasures();
      const abbreviations = measures.map((m) => m.abbreviation);
      expect(abbreviations).toContain("MoCA");
      expect(abbreviations).toContain("Mini-Cog");
      expect(abbreviations).toContain("TMT");
      expect(abbreviations).toContain("SP-2");
      expect(abbreviations).toContain("SIPT");
      expect(abbreviations).toContain("ACLS-5");
      expect(abbreviations).toContain("CMT");
      expect(abbreviations).toContain("BIT");
    });
  });

  describe("getOTCognitiveSensoryOutcomeMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getOTCognitiveSensoryOutcomeMeasureById("om-ot-011");
      expect(measure).toBeDefined();
      expect(measure?.abbreviation).toBe("MoCA");
    });

    it("should return undefined for invalid ID", () => {
      const measure = getOTCognitiveSensoryOutcomeMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });
  });

  describe("calculateOTCognitiveSensoryMCIDImprovement", () => {
    it("should calculate MCID for MoCA (higher is better)", () => {
      const result = calculateOTCognitiveSensoryMCIDImprovement(
        20,
        23,
        "om-ot-011",
      );
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(3);
      expect(result?.achieved).toBe(true);
    });

    it("should calculate MCID for TMT (lower is better)", () => {
      const result = calculateOTCognitiveSensoryMCIDImprovement(
        100,
        85,
        "om-ot-013",
      );
      expect(result).toBeDefined();
      expect(result?.improvement).toBe(15);
      expect(result?.mcid).toBe(10);
      expect(result?.achieved).toBe(true);
    });

    it("should handle TMT failure", () => {
      const result = calculateOTCognitiveSensoryMCIDImprovement(
        100,
        95,
        "om-ot-013",
      );
      expect(result?.achieved).toBe(false);
    });
  });

  describe("Search", () => {
    it("should find measure by description", () => {
      const measures =
        searchOTCognitiveSensoryOutcomeMeasures("learning potential");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures[0].abbreviation).toBe("ACLS-5");
    });
  });

  describe("Data Quality", () => {
    it("should have citations with years", () => {
      const measures = getAllOTCognitiveSensoryOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.citation).toMatch(/\d{4}/);
      });
    });

    it("should have at least 2 conditions per measure", () => {
      const measures = getAllOTCognitiveSensoryOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.conditions.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
