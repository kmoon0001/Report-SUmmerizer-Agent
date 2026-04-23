/**
 * PT Intervention - Modalities Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTModalityInterventionById,
  getAllPTModalityInterventions,
  getPTModalityInterventionsByCategory,
  searchPTModalityInterventions,
  getPTModalityInterventionsByEvidenceLevel,
  getPTModalityIndications,
  validatePTModalityContraindication,
} from "../../data/pt-intervention-modalities";

describe("PT Intervention - Modalities", () => {
  it("should have 5 modalities", () => {
    expect(getAllPTModalityInterventions().length).toBe(5);
  });

  it("should return modality by ID", () => {
    const modality = getPTModalityInterventionById("tech-pt-mod-001");
    expect(modality?.name).toBe(
      "Transcutaneous Electrical Nerve Stimulation (TENS)",
    );
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTModalityInterventionById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modalities = getPTModalityInterventionsByCategory("Modalities");
    expect(modalities.length).toBe(5);
  });

  it("should search modalities", () => {
    const results = searchPTModalityInterventions("Heat");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modalities = getPTModalityInterventionsByEvidenceLevel(1);
    expect(modalities.length).toBeGreaterThan(0);
  });

  it("should return indications", () => {
    const indications = getPTModalityIndications();
    expect(Array.isArray(indications)).toBe(true);
    expect(indications.length).toBeGreaterThan(0);
  });

  it("should validate contraindications", () => {
    const result = validatePTModalityContraindication(
      "tech-pt-mod-001",
      "Pacemakers",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid contraindications", () => {
    const result = validatePTModalityContraindication(
      "tech-pt-mod-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTModalityInterventions();
    all.forEach((m) => {
      expect(getPTModalityInterventionById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTModalityInterventionById(null as any);
      getAllPTModalityInterventions();
      getPTModalityInterventionsByCategory("test");
      searchPTModalityInterventions("test");
      getPTModalityInterventionsByEvidenceLevel(1);
      getPTModalityIndications();
      validatePTModalityContraindication("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTModalityInterventions();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.indications).toBeDefined();
      expect(m.contraindications).toBeDefined();
      expect(m.parameters).toBeDefined();
      expect(m.evidenceLevel).toBeDefined();
      expect(m.source).toBeDefined();
      expect(m.citation).toBeDefined();
      expect(m.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTModalityInterventions();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTModalityInterventions();
    all.forEach((m) => {
      expect(m.indications.length).toBeGreaterThan(0);
      expect(m.contraindications.length).toBeGreaterThan(0);
      expect(m.parameters.length).toBeGreaterThan(0);
    });
  });
});
