/**
 * OT Evidence-Based Guidelines - Geriatric & Cognitive Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTGeriatricCognitiveGuidelines,
  getOTGeriatricCognitiveGuidelineById,
  searchOTGeriatricCognitiveGuidelines,
} from "../../data/ot-guidelines-geriatric-cognitive";

describe("OT Evidence-Based Guidelines - Geriatric & Cognitive", () => {
  describe("Data Structure", () => {
    it("should have all 10 guidelines", () => {
      const guidelines = getAllOTGeriatricCognitiveGuidelines();
      expect(guidelines.length).toBe(10);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllOTGeriatricCognitiveGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.recommendations).toBeDefined();
        expect(Array.isArray(guideline.recommendations)).toBe(true);
        expect(guideline.assessments).toBeDefined();
        expect(Array.isArray(guideline.assessments)).toBe(true);
      });
    });

    it("should have unique IDs (gl-ot-051 to 060)", () => {
      const ids = getAllOTGeriatricCognitiveGuidelines().map((g) => g.id);
      expect(new Set(ids).size).toBe(10);
      expect(ids).toContain("gl-ot-051");
      expect(ids).toContain("gl-ot-060");
    });

    it("should include core geriatric and cognitive conditions", () => {
      const names = getAllOTGeriatricCognitiveGuidelines().map((g) => g.name);
      expect(names).toContain("Dementia Care (Geriatric)");
      expect(names).toContain("Mild Cognitive Impairment (MCI)");
      expect(names).toContain("Fall Prevention in Older Adults");
      expect(names).toContain("Age-Related Low Vision Support");
      expect(names).toContain("Driving and Community Mobility (Older Adult)");
    });
  });

  describe("getOTGeriatricCognitiveGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getOTGeriatricCognitiveGuidelineById("gl-ot-054");
      expect(guideline?.name).toBe("Fall Prevention in Older Adults");
    });
  });

  describe("searchOTGeriatricCognitiveGuidelines", () => {
    it("should find dementia", () => {
      const results = searchOTGeriatricCognitiveGuidelines("dementia");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe("gl-ot-051");
    });

    it("should find MCI", () => {
      const results = searchOTGeriatricCognitiveGuidelines("MCI");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe("gl-ot-053");
    });
  });
});
