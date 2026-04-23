/**
 * SLP Outcome Measures - Voice & Swallowing Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllSLPVoiceSwallowingOutcomeMeasures,
  getSLPVoiceSwallowingOutcomeMeasureById,
  searchSLPVoiceSwallowingOutcomeMeasures,
} from "../../data/slp-outcome-measures-voice-swallowing";

describe("SLP Outcome Measures - Voice & Swallowing", () => {
  describe("Data Structure", () => {
    it("should have all 10 measures", () => {
      const measures = getAllSLPVoiceSwallowingOutcomeMeasures();
      expect(measures.length).toBe(10);
    });

    it("should have valid measure structure", () => {
      const measures = getAllSLPVoiceSwallowingOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.description).toBeDefined();
        expect(measure.mcid).toBeDefined();
        expect(measure.itemCount).toBeDefined();
      });
    });

    it("should have unique IDs (om-slp-011 to 020)", () => {
      const ids = getAllSLPVoiceSwallowingOutcomeMeasures().map((m) => m.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("om-slp-011");
      expect(ids).toContain("om-slp-020");
    });

    it("should include core voice and swallow tools", () => {
      const abbreviations = getAllSLPVoiceSwallowingOutcomeMeasures().map(
        (m) => m.abbreviation,
      );
      expect(abbreviations).toContain("CAPE-V");
      expect(abbreviations).toContain("VHI-10");
      expect(abbreviations).toContain("MASA");
      expect(abbreviations).toContain("EAT-10");
      expect(abbreviations).toContain("FOIS");
      expect(abbreviations).toContain("DIGEST");
    });
  });

  describe("getSLPVoiceSwallowingOutcomeMeasureById", () => {
    it("should return measure by valid ID", () => {
      const measure = getSLPVoiceSwallowingOutcomeMeasureById("om-slp-015");
      expect(measure?.abbreviation).toBe("MASA");
    });
  });

  describe("searchSLPVoiceSwallowingOutcomeMeasures", () => {
    it("should find Voice Index", () => {
      const results = searchSLPVoiceSwallowingOutcomeMeasures("Voice Handicap");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.id).toBe("om-slp-012");
    });

    it("should find swallow screens", () => {
      const results = searchSLPVoiceSwallowingOutcomeMeasures("Swallow");
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
