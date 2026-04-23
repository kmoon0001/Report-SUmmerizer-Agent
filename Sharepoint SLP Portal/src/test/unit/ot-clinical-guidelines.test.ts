import { describe, it, expect } from "vitest";
import {
  getOTClinicalGuidelineById,
  getOTClinicalGuidelinesByCategory,
  searchOTClinicalGuidelines,
  getAllOTClinicalGuidelines,
  getOTClinicalGuidelineCategories,
  getOTClinicalGuidelinesForIndication,
} from "../../data/ot-clinical-guidelines";

describe("OT Module 2: Clinical Guidelines", () => {
  describe("getOTClinicalGuidelineById", () => {
    it("should return guideline by valid ID", () => {
      const guideline = getOTClinicalGuidelineById("ot-cg-001");
      expect(guideline).toBeDefined();
      expect(guideline?.name).toBe("Stroke Rehabilitation Guidelines");
    });

    it("should return undefined for invalid ID", () => {
      const guideline = getOTClinicalGuidelineById("invalid-id");
      expect(guideline).toBeUndefined();
    });

    it("should return correct guideline properties", () => {
      const guideline = getOTClinicalGuidelineById("ot-cg-001");
      expect(guideline?.category).toBe("neurological");
      expect(guideline?.indications.length).toBeGreaterThan(0);
      expect(guideline?.interventionStrategies.length).toBeGreaterThan(0);
    });
  });

  describe("getOTClinicalGuidelinesByCategory", () => {
    it("should return neurological guidelines", () => {
      const guidelines = getOTClinicalGuidelinesByCategory("neurological");
      expect(guidelines.length).toBeGreaterThan(0);
      expect(guidelines.every((g) => g.category === "neurological")).toBe(true);
    });

    it("should return hand-therapy guidelines", () => {
      const guidelines = getOTClinicalGuidelinesByCategory("hand-therapy");
      expect(guidelines.length).toBeGreaterThan(0);
      expect(guidelines.every((g) => g.category === "hand-therapy")).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const guidelines = getOTClinicalGuidelinesByCategory("non-existent");
      expect(guidelines.length).toBe(0);
    });
  });

  describe("searchOTClinicalGuidelines", () => {
    it("should find guideline by name", () => {
      const results = searchOTClinicalGuidelines("Stroke");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((g) => g.name.includes("Stroke"))).toBe(true);
    });

    it("should find guideline by abbreviation", () => {
      const results = searchOTClinicalGuidelines("SRG");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchOTClinicalGuidelines("stroke");
      const results2 = searchOTClinicalGuidelines("STROKE");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchOTClinicalGuidelines("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllOTClinicalGuidelines", () => {
    it("should return all OT clinical guidelines", () => {
      const guidelines = getAllOTClinicalGuidelines();
      expect(guidelines.length).toBe(10);
    });

    it("should have valid guideline structure", () => {
      const guidelines = getAllOTClinicalGuidelines();
      guidelines.forEach((guideline) => {
        expect(guideline.id).toBeDefined();
        expect(guideline.name).toBeDefined();
        expect(guideline.abbreviation).toBeDefined();
        expect(guideline.category).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const guidelines = getAllOTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.indications.length).toBeGreaterThan(0);
        expect(g.contraindications.length).toBeGreaterThan(0);
        expect(g.precautions.length).toBeGreaterThan(0);
        expect(g.interventionStrategies.length).toBeGreaterThan(0);
        expect(g.expectedOutcomes.length).toBeGreaterThan(0);
        expect(g.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(g.evidenceLevel).toBeLessThanOrEqual(5);
        expect(g.source).toBeDefined();
        expect(g.citation).toBeDefined();
        expect(g.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getOTClinicalGuidelineCategories", () => {
    it("should return all categories", () => {
      const categories = getOTClinicalGuidelineCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getOTClinicalGuidelineCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getOTClinicalGuidelinesForIndication", () => {
    it("should return guidelines for stroke", () => {
      const guidelines = getOTClinicalGuidelinesForIndication("Stroke");
      expect(guidelines.length).toBeGreaterThan(0);
    });

    it("should return guidelines for hand injury", () => {
      const guidelines = getOTClinicalGuidelinesForIndication("Hand injury");
      expect(guidelines.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent indication", () => {
      const guidelines = getOTClinicalGuidelinesForIndication(
        "non-existent-indication",
      );
      expect(guidelines.length).toBe(0);
    });

    it("should be case-insensitive", () => {
      const results1 = getOTClinicalGuidelinesForIndication("stroke");
      const results2 = getOTClinicalGuidelinesForIndication("STROKE");
      expect(results1.length).toBe(results2.length);
    });
  });

  describe("Indications", () => {
    it("should have meaningful indications", () => {
      const guidelines = getAllOTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.indications.length).toBeGreaterThan(0);
        expect(g.indications.every((i) => i.length > 0)).toBe(true);
      });
    });
  });

  describe("Contraindications", () => {
    it("should have contraindications", () => {
      const guidelines = getAllOTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.contraindications.length).toBeGreaterThan(0);
        expect(g.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });
  });

  describe("Intervention Strategies", () => {
    it("should have intervention strategies", () => {
      const guidelines = getAllOTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.interventionStrategies.length).toBeGreaterThan(0);
        expect(g.interventionStrategies.every((i) => i.length > 0)).toBe(true);
      });
    });
  });

  describe("Expected Outcomes", () => {
    it("should have expected outcomes", () => {
      const guidelines = getAllOTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.expectedOutcomes.length).toBeGreaterThan(0);
        expect(g.expectedOutcomes.every((o) => o.length > 0)).toBe(true);
      });
    });
  });

  describe("Evidence Level", () => {
    it("should have valid evidence levels", () => {
      const guidelines = getAllOTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(g.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each guideline", () => {
      const guidelines = getAllOTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.source).toBeDefined();
        expect(g.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each guideline", () => {
      const guidelines = getAllOTClinicalGuidelines();
      guidelines.forEach((g) => {
        expect(g.citation).toBeDefined();
        expect(g.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Guideline Coverage", () => {
    it("should have 10 clinical guidelines total", () => {
      const guidelines = getAllOTClinicalGuidelines();
      expect(guidelines.length).toBe(10);
    });
  });
});
