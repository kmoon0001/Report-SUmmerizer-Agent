/**
 * PT Intervention - Manual Therapy Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTManualTherapyTechniqueById,
  getAllPTManualTherapyTechniques,
  getPTManualTherapyTechniquesByCategory,
  searchPTManualTherapyTechniques,
  getPTManualTherapyTechniquesByEvidenceLevel,
  getPTManualTherapyIndications,
  validatePTManualTherapyContraindication,
} from "../../data/pt-intervention-manual-therapy";

describe("PT Intervention - Manual Therapy", () => {
  it("should have 20 techniques", () => {
    expect(getAllPTManualTherapyTechniques().length).toBe(20);
  });

  it("should return technique by ID", () => {
    const technique = getPTManualTherapyTechniqueById("tech-pt-mt-001");
    expect(technique?.name).toBe("Soft Tissue Mobilization");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTManualTherapyTechniqueById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const techniques = getPTManualTherapyTechniquesByCategory("Manual");
    expect(techniques.length).toBe(20);
  });

  it("should search techniques", () => {
    const results = searchPTManualTherapyTechniques("Mobilization");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const techniques = getPTManualTherapyTechniquesByEvidenceLevel(1);
    expect(techniques.length).toBeGreaterThan(0);
  });

  it("should return indications", () => {
    const indications = getPTManualTherapyIndications();
    expect(Array.isArray(indications)).toBe(true);
    expect(indications.length).toBeGreaterThan(0);
  });

  it("should validate contraindications", () => {
    const result = validatePTManualTherapyContraindication(
      "tech-pt-mt-001",
      "Acute inflammation",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid contraindications", () => {
    const result = validatePTManualTherapyContraindication(
      "tech-pt-mt-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTManualTherapyTechniques();
    all.forEach((t) => {
      expect(getPTManualTherapyTechniqueById(t.id)).toEqual(t);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTManualTherapyTechniqueById(null as any);
      getAllPTManualTherapyTechniques();
      getPTManualTherapyTechniquesByCategory("test");
      searchPTManualTherapyTechniques("test");
      getPTManualTherapyTechniquesByEvidenceLevel(1);
      getPTManualTherapyIndications();
      validatePTManualTherapyContraindication("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTManualTherapyTechniques();
    all.forEach((t) => {
      expect(t.id).toBeDefined();
      expect(t.name).toBeDefined();
      expect(t.category).toBeDefined();
      expect(t.description).toBeDefined();
      expect(t.indications).toBeDefined();
      expect(t.contraindications).toBeDefined();
      expect(t.procedures).toBeDefined();
      expect(t.evidenceLevel).toBeDefined();
      expect(t.source).toBeDefined();
      expect(t.citation).toBeDefined();
      expect(t.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTManualTherapyTechniques();
    all.forEach((t) => {
      expect([1, 2, 3]).toContain(t.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTManualTherapyTechniques();
    all.forEach((t) => {
      expect(t.indications.length).toBeGreaterThan(0);
      expect(t.contraindications.length).toBeGreaterThan(0);
      expect(t.procedures.length).toBeGreaterThan(0);
    });
  });
});
