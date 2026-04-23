import { describe, it, expect } from "vitest";
import {
  getPTManualTherapyTechniqueById,
  getPTManualTherapyTechniquesByCategory,
  getPTManualTherapyTechniquesByEvidenceLevel,
  searchPTManualTherapyTechniques,
  getAllPTManualTherapyTechniques,
  getPTManualTherapyCategories,
  getPTManualTherapyTechniquesForIndication,
  type PTManualTherapyTechnique,
} from "../../data/pt-manual-therapy";

describe("PT Module 4: Manual Therapy", () => {
  describe("getPTManualTherapyTechniqueById", () => {
    it("should return technique by valid ID", () => {
      const technique = getPTManualTherapyTechniqueById("pt-mt-001");
      expect(technique).toBeDefined();
      expect(technique?.name).toContain("Joint Mobilization");
    });

    it("should return undefined for invalid ID", () => {
      const technique = getPTManualTherapyTechniqueById("invalid-id");
      expect(technique).toBeUndefined();
    });

    it("should return correct technique properties", () => {
      const technique = getPTManualTherapyTechniqueById("pt-mt-001");
      expect(technique?.category).toBe("joint-mobilization");
      expect(technique?.indications.length).toBeGreaterThan(0);
      expect(technique?.contraindications.length).toBeGreaterThan(0);
    });
  });

  describe("getPTManualTherapyTechniquesByCategory", () => {
    it("should return joint-mobilization techniques", () => {
      const techniques =
        getPTManualTherapyTechniquesByCategory("joint-mobilization");
      expect(techniques.length).toBeGreaterThan(0);
      expect(techniques.every((t) => t.category === "joint-mobilization")).toBe(
        true,
      );
    });

    it("should return manipulation techniques", () => {
      const techniques = getPTManualTherapyTechniquesByCategory("manipulation");
      expect(techniques.length).toBeGreaterThan(0);
      expect(techniques.every((t) => t.category === "manipulation")).toBe(true);
    });

    it("should return soft-tissue techniques", () => {
      const techniques = getPTManualTherapyTechniquesByCategory("soft-tissue");
      expect(techniques.length).toBeGreaterThan(0);
      expect(techniques.every((t) => t.category === "soft-tissue")).toBe(true);
    });

    it("should return dry-needling techniques", () => {
      const techniques = getPTManualTherapyTechniquesByCategory("dry-needling");
      expect(techniques.length).toBeGreaterThan(0);
      expect(techniques.every((t) => t.category === "dry-needling")).toBe(true);
    });
  });

  describe("getPTManualTherapyTechniquesByEvidenceLevel", () => {
    it("should return techniques with evidence level 2", () => {
      const techniques = getPTManualTherapyTechniquesByEvidenceLevel(2);
      expect(techniques.length).toBeGreaterThan(0);
      expect(techniques.every((t) => t.evidenceLevel === 2)).toBe(true);
    });

    it("should return techniques with evidence level 3", () => {
      const techniques = getPTManualTherapyTechniquesByEvidenceLevel(3);
      expect(techniques.length).toBeGreaterThan(0);
      expect(techniques.every((t) => t.evidenceLevel === 3)).toBe(true);
    });
  });

  describe("searchPTManualTherapyTechniques", () => {
    it("should find technique by name", () => {
      const results = searchPTManualTherapyTechniques("Joint Mobilization");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((t) => t.name.includes("Joint Mobilization"))).toBe(
        true,
      );
    });

    it("should find technique by abbreviation", () => {
      const results = searchPTManualTherapyTechniques("HVLAT");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((t) => t.abbreviation === "HVLAT")).toBe(true);
    });

    it("should be case-insensitive", () => {
      const results1 = searchPTManualTherapyTechniques("soft tissue");
      const results2 = searchPTManualTherapyTechniques("SOFT TISSUE");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchPTManualTherapyTechniques("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllPTManualTherapyTechniques", () => {
    it("should return all PT manual therapy techniques", () => {
      const techniques = getAllPTManualTherapyTechniques();
      expect(techniques.length).toBe(10);
    });

    it("should have valid technique structure", () => {
      const techniques = getAllPTManualTherapyTechniques();
      techniques.forEach((technique) => {
        expect(technique.id).toBeDefined();
        expect(technique.name).toBeDefined();
        expect(technique.abbreviation).toBeDefined();
        expect(technique.category).toBeDefined();
        expect(technique.indications.length).toBeGreaterThan(0);
        expect(technique.contraindications.length).toBeGreaterThan(0);
        expect(technique.precautions.length).toBeGreaterThan(0);
      });
    });

    it("should have all required properties", () => {
      const techniques = getAllPTManualTherapyTechniques();
      techniques.forEach((t) => {
        expect(t.technique).toBeDefined();
        expect(t.dosage).toBeDefined();
        expect(t.expectedOutcomes.length).toBeGreaterThan(0);
        expect(t.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(t.evidenceLevel).toBeLessThanOrEqual(5);
        expect(t.source).toBeDefined();
        expect(t.citation).toBeDefined();
        expect(t.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getPTManualTherapyCategories", () => {
    it("should return all categories", () => {
      const categories = getPTManualTherapyCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getPTManualTherapyCategories();
      expect(categories).toContain("joint-mobilization");
      expect(categories).toContain("manipulation");
      expect(categories).toContain("soft-tissue");
      expect(categories).toContain("dry-needling");
    });
  });

  describe("getPTManualTherapyTechniquesForIndication", () => {
    it("should return techniques for pain relief", () => {
      const techniques =
        getPTManualTherapyTechniquesForIndication("Pain relief");
      expect(techniques.length).toBeGreaterThan(0);
      expect(
        techniques.every((t) => t.indications.includes("Pain relief")),
      ).toBe(true);
    });

    it("should return techniques for reduced mobility", () => {
      const techniques =
        getPTManualTherapyTechniquesForIndication("Reduced mobility");
      expect(techniques.length).toBeGreaterThan(0);
      expect(
        techniques.every((t) => t.indications.includes("Reduced mobility")),
      ).toBe(true);
    });

    it("should return empty array for non-existent indication", () => {
      const techniques = getPTManualTherapyTechniquesForIndication(
        "non-existent-indication",
      );
      expect(techniques.length).toBe(0);
    });
  });

  describe("Indications", () => {
    it("should have meaningful indications", () => {
      const techniques = getAllPTManualTherapyTechniques();
      techniques.forEach((t) => {
        expect(t.indications.length).toBeGreaterThan(0);
        expect(t.indications.every((i) => i.length > 0)).toBe(true);
      });
    });
  });

  describe("Contraindications", () => {
    it("should have contraindications", () => {
      const techniques = getAllPTManualTherapyTechniques();
      techniques.forEach((t) => {
        expect(t.contraindications.length).toBeGreaterThan(0);
        expect(t.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });
  });

  describe("Precautions", () => {
    it("should have precautions", () => {
      const techniques = getAllPTManualTherapyTechniques();
      techniques.forEach((t) => {
        expect(t.precautions.length).toBeGreaterThan(0);
        expect(t.precautions.every((p) => p.length > 0)).toBe(true);
      });
    });
  });

  describe("Expected Outcomes", () => {
    it("should have expected outcomes", () => {
      const techniques = getAllPTManualTherapyTechniques();
      techniques.forEach((t) => {
        expect(t.expectedOutcomes.length).toBeGreaterThan(0);
        expect(t.expectedOutcomes.every((o) => o.length > 0)).toBe(true);
      });
    });
  });

  describe("Evidence Level", () => {
    it("should have valid evidence levels", () => {
      const techniques = getAllPTManualTherapyTechniques();
      techniques.forEach((t) => {
        expect(t.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(t.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each technique", () => {
      const techniques = getAllPTManualTherapyTechniques();
      techniques.forEach((t) => {
        expect(t.source).toBeDefined();
        expect(t.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each technique", () => {
      const techniques = getAllPTManualTherapyTechniques();
      techniques.forEach((t) => {
        expect(t.citation).toBeDefined();
        expect(t.citation.length).toBeGreaterThan(0);
      });
    });
  });
});
