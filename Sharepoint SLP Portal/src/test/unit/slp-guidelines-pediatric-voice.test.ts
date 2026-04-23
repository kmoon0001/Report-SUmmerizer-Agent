/**
 * SLP Evidence-Based Guidelines - Pediatric & Voice Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllSLPPediatricVoiceGuidelines,
  getSLPPediatricVoiceGuidelineById,
  searchSLPPediatricVoiceGuidelines,
} from "../../data/slp-guidelines-pediatric-voice";

describe("SLP Evidence-Based Guidelines - Pediatric & Voice", () => {
  describe("Data Structure", () => {
    it("should have all 10 guidelines", () => {
      const guidelines = getAllSLPPediatricVoiceGuidelines();
      expect(guidelines.length).toBe(10);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllSLPPediatricVoiceGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.recommendations).toBeDefined();
        expect(Array.isArray(guideline.recommendations)).toBe(true);
      });
    });

    it("should have unique IDs (gl-slp-011 to 020)", () => {
      const ids = getAllSLPPediatricVoiceGuidelines().map((g) => g.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("gl-slp-011");
      expect(ids).toContain("gl-slp-020");
    });

    it("should include core pediatric and voice conditions", () => {
      const names = getAllSLPPediatricVoiceGuidelines().map((g) => g.name);
      expect(names).toContain("Speech Sound Disorders (Pediatric)");
      expect(names).toContain("Childhood Apraxia of Speech (CAS)");
      expect(names).toContain("Early Intervention (Birth to Three)");
      expect(names).toContain("Voice Disorders (Pediatric/Adult)");
      expect(names).toContain("Pediatric Fluency Disorders");
    });
  });

  describe("getSLPPediatricVoiceGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getSLPPediatricVoiceGuidelineById("gl-slp-011");
      expect(guideline?.name).toBe("Speech Sound Disorders (Pediatric)");
    });
  });

  describe("searchSLPPediatricVoiceGuidelines", () => {
    it("should find Social Communication", () => {
      const results = searchSLPPediatricVoiceGuidelines("Social Communication");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.id).toBe("gl-slp-012");
    });

    it("should find Voice", () => {
      const results = searchSLPPediatricVoiceGuidelines("Voice");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]!.id).toBe("gl-slp-016");
    });
  });
});
