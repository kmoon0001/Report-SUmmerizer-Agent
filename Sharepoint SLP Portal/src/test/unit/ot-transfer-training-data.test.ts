/**
 * OT Transfer Training Data Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTTransferTechniqueById,
  getAllOTTransferTechniques,
  getOTTransferTechniquesByCategory,
  searchOTTransferTechniques,
  getOTTransferTechniquesByEvidenceLevel,
  getTransferEquipmentList,
  validateTransferTechnique,
} from "../../data/ot-transfer-training-data";

describe("OT Transfer Training Data", () => {
  it("should have 5 transfer techniques", () => {
    expect(getAllOTTransferTechniques().length).toBe(5);
  });

  it("should return technique by ID", () => {
    const technique = getOTTransferTechniqueById("ot-transfer-001");
    expect(technique?.name).toContain("Sit-to-Stand");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTTransferTechniqueById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const techniques = getOTTransferTechniquesByCategory("Bed");
    expect(techniques.length).toBeGreaterThan(0);
  });

  it("should search techniques", () => {
    const results = searchOTTransferTechniques("Transfer");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const techniques = getOTTransferTechniquesByEvidenceLevel(1);
    expect(techniques.length).toBeGreaterThan(0);
  });

  it("should return transfer equipment list", () => {
    const equipment = getTransferEquipmentList();
    expect(Array.isArray(equipment)).toBe(true);
    expect(equipment.length).toBeGreaterThan(0);
  });

  it("should validate transfer technique", () => {
    const result = validateTransferTechnique(
      "ot-transfer-001",
      "Scoot to edge",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid step", () => {
    const result = validateTransferTechnique("ot-transfer-001", "Invalid step");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTTransferTechniques();
    all.forEach((t) => {
      expect(getOTTransferTechniqueById(t.id)).toEqual(t);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTTransferTechniqueById(null as any);
      getAllOTTransferTechniques();
      getOTTransferTechniquesByCategory("test");
      searchOTTransferTechniques("test");
      getOTTransferTechniquesByEvidenceLevel(1);
      getTransferEquipmentList();
      validateTransferTechnique("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTTransferTechniques();
    all.forEach((t) => {
      expect(t.id).toBeDefined();
      expect(t.name).toBeDefined();
      expect(t.category).toBeDefined();
      expect(t.description).toBeDefined();
      expect(t.occupationalApplications).toBeDefined();
      expect(t.transferSteps).toBeDefined();
      expect(t.adaptiveEquipment).toBeDefined();
      expect(t.safetyPrecautions).toBeDefined();
      expect(t.contraindications).toBeDefined();
      expect(t.cognitiveRequirements).toBeDefined();
      expect(t.evidenceLevel).toBeDefined();
      expect(t.source).toBeDefined();
      expect(t.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTTransferTechniques();
    all.forEach((t) => {
      expect([1, 2, 3]).toContain(t.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTTransferTechniques();
    all.forEach((t) => {
      expect(t.occupationalApplications.length).toBeGreaterThan(0);
      expect(t.transferSteps.length).toBeGreaterThan(0);
      expect(t.adaptiveEquipment.length).toBeGreaterThan(0);
      expect(t.safetyPrecautions.length).toBeGreaterThan(0);
      expect(t.contraindications.length).toBeGreaterThan(0);
      expect(t.cognitiveRequirements.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTTransferTechniques();
    all.forEach((t) => {
      expect(t.lastUpdated instanceof Date).toBe(true);
      expect(t.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
