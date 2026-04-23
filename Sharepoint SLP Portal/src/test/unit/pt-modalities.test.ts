import { describe, it, expect } from "vitest";
import {
  getPTModalityById,
  getPTModalitiesByCategory,
  getPTModalitiesByEvidenceLevel,
  searchPTModalities,
  getAllPTModalities,
  getPTModalityCategories,
  getPTModalitiesForIndication,
  type PTModality,
} from "../../data/pt-modalities";

describe("PT Module 5: Modalities", () => {
  describe("getPTModalityById", () => {
    it("should return modality by valid ID", () => {
      const modality = getPTModalityById("pt-mod-001");
      expect(modality).toBeDefined();
      expect(modality?.name).toBe("Therapeutic Ultrasound");
    });

    it("should return undefined for invalid ID", () => {
      const modality = getPTModalityById("invalid-id");
      expect(modality).toBeUndefined();
    });

    it("should return correct modality properties", () => {
      const modality = getPTModalityById("pt-mod-001");
      expect(modality?.category).toBe("mechanical");
      expect(modality?.indications.length).toBeGreaterThan(0);
      expect(modality?.contraindications.length).toBeGreaterThan(0);
    });
  });

  describe("getPTModalitiesByCategory", () => {
    it("should return thermal modalities", () => {
      const modalities = getPTModalitiesByCategory("thermal");
      expect(modalities.length).toBeGreaterThan(0);
      expect(modalities.every((m) => m.category === "thermal")).toBe(true);
    });

    it("should return electrical modalities", () => {
      const modalities = getPTModalitiesByCategory("electrical");
      expect(modalities.length).toBeGreaterThan(0);
      expect(modalities.every((m) => m.category === "electrical")).toBe(true);
    });

    it("should return mechanical modalities", () => {
      const modalities = getPTModalitiesByCategory("mechanical");
      expect(modalities.length).toBeGreaterThan(0);
      expect(modalities.every((m) => m.category === "mechanical")).toBe(true);
    });

    it("should return light modalities", () => {
      const modalities = getPTModalitiesByCategory("light");
      expect(modalities.length).toBeGreaterThan(0);
      expect(modalities.every((m) => m.category === "light")).toBe(true);
    });

    it("should return compression modalities", () => {
      const modalities = getPTModalitiesByCategory("compression");
      expect(modalities.length).toBeGreaterThan(0);
      expect(modalities.every((m) => m.category === "compression")).toBe(true);
    });

    it("should return water modalities", () => {
      const modalities = getPTModalitiesByCategory("water");
      expect(modalities.length).toBeGreaterThan(0);
      expect(modalities.every((m) => m.category === "water")).toBe(true);
    });
  });

  describe("getPTModalitiesByEvidenceLevel", () => {
    it("should return modalities with evidence level 2", () => {
      const modalities = getPTModalitiesByEvidenceLevel(2);
      expect(modalities.length).toBeGreaterThan(0);
      expect(modalities.every((m) => m.evidenceLevel === 2)).toBe(true);
    });
  });

  describe("searchPTModalities", () => {
    it("should find modality by name", () => {
      const results = searchPTModalities("Ultrasound");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m) => m.name.includes("Ultrasound"))).toBe(true);
    });

    it("should find modality by abbreviation", () => {
      const results = searchPTModalities("TENS");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m) => m.abbreviation === "TENS")).toBe(true);
    });

    it("should be case-insensitive", () => {
      const results1 = searchPTModalities("heat");
      const results2 = searchPTModalities("HEAT");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchPTModalities("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllPTModalities", () => {
    it("should return all PT modalities", () => {
      const modalities = getAllPTModalities();
      expect(modalities.length).toBe(10);
    });

    it("should have valid modality structure", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((modality) => {
        expect(modality.id).toBeDefined();
        expect(modality.name).toBeDefined();
        expect(modality.abbreviation).toBeDefined();
        expect(modality.category).toBeDefined();
        expect(modality.indications.length).toBeGreaterThan(0);
        expect(modality.contraindications.length).toBeGreaterThan(0);
        expect(modality.precautions.length).toBeGreaterThan(0);
      });
    });

    it("should have all required properties", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((m) => {
        expect(m.parameters).toBeDefined();
        expect(m.dosage).toBeDefined();
        expect(m.expectedOutcomes.length).toBeGreaterThan(0);
        expect(m.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(m.evidenceLevel).toBeLessThanOrEqual(5);
        expect(m.source).toBeDefined();
        expect(m.citation).toBeDefined();
        expect(m.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getPTModalityCategories", () => {
    it("should return all categories", () => {
      const categories = getPTModalityCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getPTModalityCategories();
      expect(categories).toContain("thermal");
      expect(categories).toContain("electrical");
      expect(categories).toContain("mechanical");
      expect(categories).toContain("light");
      expect(categories).toContain("compression");
      expect(categories).toContain("water");
    });
  });

  describe("getPTModalitiesForIndication", () => {
    it("should return modalities for pain relief", () => {
      const modalities = getPTModalitiesForIndication("Pain");
      expect(modalities.length).toBeGreaterThan(0);
    });

    it("should return modalities for inflammation", () => {
      const modalities = getPTModalitiesForIndication("Inflammation");
      expect(modalities.length).toBeGreaterThan(0);
    });

    it("should return modalities for swelling", () => {
      const modalities = getPTModalitiesForIndication("Swelling");
      expect(modalities.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent indication", () => {
      const modalities = getPTModalitiesForIndication(
        "non-existent-indication",
      );
      expect(modalities.length).toBe(0);
    });
  });

  describe("Indications", () => {
    it("should have meaningful indications", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((m) => {
        expect(m.indications.length).toBeGreaterThan(0);
        expect(m.indications.every((i) => i.length > 0)).toBe(true);
      });
    });
  });

  describe("Contraindications", () => {
    it("should have contraindications", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((m) => {
        expect(m.contraindications.length).toBeGreaterThan(0);
        expect(m.contraindications.every((c) => c.length > 0)).toBe(true);
      });
    });
  });

  describe("Precautions", () => {
    it("should have precautions", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((m) => {
        expect(m.precautions.length).toBeGreaterThan(0);
        expect(m.precautions.every((p) => p.length > 0)).toBe(true);
      });
    });
  });

  describe("Parameters", () => {
    it("should have parameters defined", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((m) => {
        expect(m.parameters).toBeDefined();
        expect(Object.keys(m.parameters).length).toBeGreaterThan(0);
      });
    });
  });

  describe("Dosage", () => {
    it("should have dosage information", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((m) => {
        expect(m.dosage).toBeDefined();
        expect(m.dosage.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Expected Outcomes", () => {
    it("should have expected outcomes", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((m) => {
        expect(m.expectedOutcomes.length).toBeGreaterThan(0);
        expect(m.expectedOutcomes.every((o) => o.length > 0)).toBe(true);
      });
    });
  });

  describe("Evidence Level", () => {
    it("should have valid evidence levels", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((m) => {
        expect(m.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(m.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each modality", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((m) => {
        expect(m.source).toBeDefined();
        expect(m.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each modality", () => {
      const modalities = getAllPTModalities();
      modalities.forEach((m) => {
        expect(m.citation).toBeDefined();
        expect(m.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Modality Coverage", () => {
    it("should cover major modality categories", () => {
      const modalities = getAllPTModalities();
      const categories = modalities.map((m) => m.category);
      expect(categories).toContain("thermal");
      expect(categories).toContain("electrical");
      expect(categories).toContain("mechanical");
      expect(categories).toContain("light");
    });
  });
});
