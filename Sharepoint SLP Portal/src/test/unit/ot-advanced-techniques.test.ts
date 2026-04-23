import { describe, it, expect } from "vitest";
import {
  getOTAdvancedTechniqueById,
  getOTAdvancedTechniquesByCategory,
  searchOTAdvancedTechniques,
  getAllOTAdvancedTechniques,
  getOTAdvancedTechniqueCategories,
  getOTAdvancedTechniquesForIndication,
} from "../../data/ot-advanced-techniques";

describe("OT Module 11: Advanced Techniques", () => {
  describe("getOTAdvancedTechniqueById", () => {
    it("should return advanced technique by valid ID", () => {
      const technique = getOTAdvancedTechniqueById("ot-at-001");
      expect(technique).toBeDefined();
      expect(technique?.name).toBe("Constraint-Induced Movement Therapy");
    });

    it("should return undefined for invalid ID", () => {
      const technique = getOTAdvancedTechniqueById("invalid-id");
      expect(technique).toBeUndefined();
    });

    it("should return correct technique properties", () => {
      const technique = getOTAdvancedTechniqueById("ot-at-001");
      expect(technique?.category).toBeDefined();
      expect(technique?.procedures.length).toBeGreaterThan(0);
      expect(technique?.indications.length).toBeGreaterThan(0);
    });
  });

  describe("getOTAdvancedTechniquesByCategory", () => {
    it("should return techniques for valid category", () => {
      const techniques = getOTAdvancedTechniquesByCategory(
        "constraint-induced-therapy",
      );
      expect(techniques.length).toBeGreaterThan(0);
      expect(
        techniques.every((t) => t.category === "constraint-induced-therapy"),
      ).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const techniques = getOTAdvancedTechniquesByCategory("non-existent");
      expect(techniques.length).toBe(0);
    });

    it("should return techniques with valid structure", () => {
      const techniques = getOTAdvancedTechniquesByCategory(
        "constraint-induced-therapy",
      );
      techniques.forEach((t) => {
        expect(t.id).toBeDefined();
        expect(t.name).toBeDefined();
        expect(t.procedures.length).toBeGreaterThan(0);
      });
    });
  });

  describe("searchOTAdvancedTechniques", () => {
    it("should find technique by name", () => {
      const results = searchOTAdvancedTechniques("Constraint");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find technique by abbreviation", () => {
      const results = searchOTAdvancedTechniques("CIMT");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchOTAdvancedTechniques("cimt");
      const results2 = searchOTAdvancedTechniques("CIMT");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchOTAdvancedTechniques("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllOTAdvancedTechniques", () => {
    it("should return all OT advanced techniques", () => {
      const techniques = getAllOTAdvancedTechniques();
      expect(techniques.length).toBe(10);
    });

    it("should have valid technique structure", () => {
      const techniques = getAllOTAdvancedTechniques();
      techniques.forEach((technique) => {
        expect(technique.id).toBeDefined();
        expect(technique.name).toBeDefined();
        expect(technique.category).toBeDefined();
        expect(technique.description).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const techniques = getAllOTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.procedures.length).toBeGreaterThan(0);
        expect(t.indications.length).toBeGreaterThan(0);
        expect(t.contraindications.length).toBeGreaterThan(0);
        expect(t.precautions.length).toBeGreaterThan(0);
        expect(t.source).toBeDefined();
        expect(t.citation).toBeDefined();
        expect(t.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getOTAdvancedTechniqueCategories", () => {
    it("should return all categories", () => {
      const categories = getOTAdvancedTechniqueCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getOTAdvancedTechniqueCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getOTAdvancedTechniquesForIndication", () => {
    it("should return techniques for valid indication", () => {
      const techniques = getOTAdvancedTechniquesForIndication("Stroke");
      expect(techniques.length).toBeGreaterThan(0);
    });

    it("should return techniques matching indication", () => {
      const techniques = getOTAdvancedTechniquesForIndication("Stroke");
      techniques.forEach((t) => {
        expect(t.indications.some((i) => i.includes("Stroke"))).toBe(true);
      });
    });

    it("should return empty array for non-existent indication", () => {
      const techniques =
        getOTAdvancedTechniquesForIndication("xyz123nonexistent");
      expect(techniques.length).toBe(0);
    });
  });

  describe("Advanced Technique Properties", () => {
    it("should have meaningful procedures", () => {
      const techniques = getAllOTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.procedures.length).toBeGreaterThan(0);
        expect(t.procedures.every((p) => p.length > 0)).toBe(true);
      });
    });

    it("should have meaningful indications", () => {
      const techniques = getAllOTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.indications.length).toBeGreaterThan(0);
        expect(t.indications.every((i) => i.length > 0)).toBe(true);
      });
    });

    it("should have contraindications", () => {
      const techniques = getAllOTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.contraindications.length).toBeGreaterThan(0);
        expect(t.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });

    it("should have precautions", () => {
      const techniques = getAllOTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.precautions.length).toBeGreaterThan(0);
        expect(t.precautions.every((p) => p.length > 0)).toBe(true);
      });
    });

    it("should have source attribution", () => {
      const techniques = getAllOTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.source).toBeDefined();
        expect(t.source.length).toBeGreaterThan(0);
        expect(t.citation).toBeDefined();
        expect(t.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Module Coverage", () => {
    it("should have 10 advanced techniques", () => {
      const techniques = getAllOTAdvancedTechniques();
      expect(techniques.length).toBe(10);
    });

    it("should cover multiple categories", () => {
      const techniques = getAllOTAdvancedTechniques();
      const categories = new Set(techniques.map((t) => t.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it("should have comprehensive indication coverage", () => {
      const techniques = getAllOTAdvancedTechniques();
      const allIndications = techniques.flatMap((t) => t.indications);
      expect(allIndications.length).toBeGreaterThan(10);
    });

    it("should have valid evidence levels", () => {
      const techniques = getAllOTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.evidenceLevel).toBeGreaterThan(0);
        expect(t.evidenceLevel).toBeLessThanOrEqual(3);
      });
    });
  });
});
