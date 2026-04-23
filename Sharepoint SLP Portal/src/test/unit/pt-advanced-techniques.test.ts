import { describe, it, expect } from "vitest";
import {
  getPTAdvancedTechniqueById,
  getPTAdvancedTechniquesByCategory,
  searchPTAdvancedTechniques,
  getAllPTAdvancedTechniques,
  getPTAdvancedTechniqueCategories,
  getPTAdvancedTechniquesForIndication,
} from "../../data/pt-advanced-techniques";

describe("PT Module 11: Advanced Techniques", () => {
  describe("getPTAdvancedTechniqueById", () => {
    it("should return advanced technique by valid ID", () => {
      const technique = getPTAdvancedTechniqueById("pt-at-001");
      expect(technique).toBeDefined();
      expect(technique?.name).toBe("Proprioceptive Neuromuscular Facilitation");
    });

    it("should return undefined for invalid ID", () => {
      const technique = getPTAdvancedTechniqueById("invalid-id");
      expect(technique).toBeUndefined();
    });

    it("should return correct technique properties", () => {
      const technique = getPTAdvancedTechniqueById("pt-at-001");
      expect(technique?.category).toBeDefined();
      expect(technique?.procedures.length).toBeGreaterThan(0);
      expect(technique?.indications.length).toBeGreaterThan(0);
    });
  });

  describe("getPTAdvancedTechniquesByCategory", () => {
    it("should return techniques for valid category", () => {
      const techniques = getPTAdvancedTechniquesByCategory(
        "neuromuscular-facilitation",
      );
      expect(techniques.length).toBeGreaterThan(0);
      expect(
        techniques.every((t) => t.category === "neuromuscular-facilitation"),
      ).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const techniques = getPTAdvancedTechniquesByCategory("non-existent");
      expect(techniques.length).toBe(0);
    });

    it("should return techniques with valid structure", () => {
      const techniques = getPTAdvancedTechniquesByCategory(
        "neuromuscular-facilitation",
      );
      techniques.forEach((t) => {
        expect(t.id).toBeDefined();
        expect(t.name).toBeDefined();
        expect(t.procedures.length).toBeGreaterThan(0);
      });
    });
  });

  describe("searchPTAdvancedTechniques", () => {
    it("should find technique by name", () => {
      const results = searchPTAdvancedTechniques("Proprioceptive");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find technique by abbreviation", () => {
      const results = searchPTAdvancedTechniques("PNF");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchPTAdvancedTechniques("pnf");
      const results2 = searchPTAdvancedTechniques("PNF");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchPTAdvancedTechniques("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllPTAdvancedTechniques", () => {
    it("should return all PT advanced techniques", () => {
      const techniques = getAllPTAdvancedTechniques();
      expect(techniques.length).toBe(10);
    });

    it("should have valid technique structure", () => {
      const techniques = getAllPTAdvancedTechniques();
      techniques.forEach((technique) => {
        expect(technique.id).toBeDefined();
        expect(technique.name).toBeDefined();
        expect(technique.category).toBeDefined();
        expect(technique.description).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const techniques = getAllPTAdvancedTechniques();
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

  describe("getPTAdvancedTechniqueCategories", () => {
    it("should return all categories", () => {
      const categories = getPTAdvancedTechniqueCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getPTAdvancedTechniqueCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getPTAdvancedTechniquesForIndication", () => {
    it("should return techniques for valid indication", () => {
      const techniques = getPTAdvancedTechniquesForIndication("Weakness");
      expect(techniques.length).toBeGreaterThan(0);
    });

    it("should return techniques matching indication", () => {
      const techniques = getPTAdvancedTechniquesForIndication("Weakness");
      techniques.forEach((t) => {
        expect(
          t.indications.some((i) => i.toLowerCase().includes("weakness")),
        ).toBe(true);
      });
    });

    it("should return empty array for non-existent indication", () => {
      const techniques =
        getPTAdvancedTechniquesForIndication("xyz123nonexistent");
      expect(techniques.length).toBe(0);
    });
  });

  describe("Advanced Technique Properties", () => {
    it("should have meaningful procedures", () => {
      const techniques = getAllPTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.procedures.length).toBeGreaterThan(0);
        expect(t.procedures.every((p) => p.length > 0)).toBe(true);
      });
    });

    it("should have meaningful indications", () => {
      const techniques = getAllPTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.indications.length).toBeGreaterThan(0);
        expect(t.indications.every((i) => i.length > 0)).toBe(true);
      });
    });

    it("should have contraindications", () => {
      const techniques = getAllPTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.contraindications.length).toBeGreaterThan(0);
        expect(t.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });

    it("should have precautions", () => {
      const techniques = getAllPTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.precautions.length).toBeGreaterThan(0);
        expect(t.precautions.every((p) => p.length > 0)).toBe(true);
      });
    });

    it("should have source attribution", () => {
      const techniques = getAllPTAdvancedTechniques();
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
      const techniques = getAllPTAdvancedTechniques();
      expect(techniques.length).toBe(10);
    });

    it("should cover multiple categories", () => {
      const techniques = getAllPTAdvancedTechniques();
      const categories = new Set(techniques.map((t) => t.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it("should have comprehensive indication coverage", () => {
      const techniques = getAllPTAdvancedTechniques();
      const allIndications = techniques.flatMap((t) => t.indications);
      expect(allIndications.length).toBeGreaterThan(10);
    });

    it("should have valid evidence levels", () => {
      const techniques = getAllPTAdvancedTechniques();
      techniques.forEach((t) => {
        expect(t.evidenceLevel).toBeGreaterThan(0);
        expect(t.evidenceLevel).toBeLessThanOrEqual(3);
      });
    });
  });
});
