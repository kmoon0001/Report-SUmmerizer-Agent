/**
 * SLP Outcome Measures - Adult Neurological Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllSLPAdultNeuroOutcomeMeasures,
  getSLPAdultNeuroOutcomeMeasureById,
  searchSLPAdultNeuroOutcomeMeasures,
} from "../../data/slp-outcome-measures-adult-neuro";

describe("SLP Outcome Measures - Adult Neurological", () => {
  describe("Data Structure", () => {
    it("should have all 10 measures", () => {
      const measures = getAllSLPAdultNeuroOutcomeMeasures();
      expect(measures.length).toBe(10);
    });

    it("should have valid measure structure", () => {
      const measures = getAllSLPAdultNeuroOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.description).toBeDefined();
        expect(measure.mcid).toBeDefined();
        expect(measure.itemCount).toBeGreaterThan(0);
      });
    });

    it("should have unique IDs (om-slp-001 to 010)", () => {
      const ids = getAllSLPAdultNeuroOutcomeMeasures().map((m) => m.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("om-slp-001");
      expect(ids).toContain("om-slp-010");
    });

    it("should include core aphasia and cognitive tools", () => {
      const abbreviations = getAllSLPAdultNeuroOutcomeMeasures().map(
        (m) => m.abbreviation,
      );
      expect(abbreviations).toContain("WAB-R");
      expect(abbreviations).toContain("CLQT+");
      expect(abbreviations).toContain("MoCA");
      expect(abbreviations).toContain("CADL-3");
    });
  });

  describe("getSLPAdultNeuroOutcomeMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getSLPAdultNeuroOutcomeMeasureById("om-slp-001");
      expect(measure?.abbreviation).toBe("WAB-R");
    });

    it("should return undefined for invalid ID", () => {
      const measure = getSLPAdultNeuroOutcomeMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });
  });

  describe("searchSLPAdultNeuroOutcomeMeasures", () => {
    it("should find WAB-R", () => {
      const results = searchSLPAdultNeuroOutcomeMeasures("WAB-R");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.id).toBe("om-slp-001");
    });

    it("should find cognitive assessments", () => {
      const results = searchSLPAdultNeuroOutcomeMeasures("Cognitive");
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
