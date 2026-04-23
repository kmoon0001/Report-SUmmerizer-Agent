/**
 * OT Advanced Specialty - Oncology Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTOncologyModuleById,
  getAllOTOncologyModules,
  getOTOncologyModulesByCategory,
  searchOTOncologyModules,
  getOTOncologyModulesByEvidenceLevel,
  getOTOncologyInterventionStrategies,
  validateOTOncologyAdaptiveEquipment,
} from "../../data/ot-specialty-advanced-oncology";

describe("OT Advanced Specialty - Oncology Rehabilitation", () => {
  it("should have 5 oncology modules", () => {
    expect(getAllOTOncologyModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getOTOncologyModuleById("ot-onc-001");
    expect(module?.name).toBe("Breast Cancer Rehabilitation");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTOncologyModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getOTOncologyModulesByCategory("Oncology");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchOTOncologyModules("Cancer");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getOTOncologyModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should return intervention strategies", () => {
    const strategies = getOTOncologyInterventionStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should validate adaptive equipment", () => {
    const result = validateOTOncologyAdaptiveEquipment(
      "ot-onc-001",
      "Compression garments",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid equipment", () => {
    const result = validateOTOncologyAdaptiveEquipment("ot-onc-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTOncologyModules();
    all.forEach((m) => {
      expect(getOTOncologyModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTOncologyModuleById(null as any);
      getAllOTOncologyModules();
      getOTOncologyModulesByCategory("test");
      searchOTOncologyModules("test");
      getOTOncologyModulesByEvidenceLevel(1);
      getOTOncologyInterventionStrategies();
      validateOTOncologyAdaptiveEquipment("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTOncologyModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.cancerTypes).toBeDefined();
      expect(m.assessmentFocus).toBeDefined();
      expect(m.interventionStrategies).toBeDefined();
      expect(m.adaptiveEquipment).toBeDefined();
      expect(m.evidenceLevel).toBeDefined();
      expect(m.source).toBeDefined();
      expect(m.citation).toBeDefined();
      expect(m.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTOncologyModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTOncologyModules();
    all.forEach((m) => {
      expect(m.cancerTypes.length).toBeGreaterThan(0);
      expect(m.assessmentFocus.length).toBeGreaterThan(0);
      expect(m.interventionStrategies.length).toBeGreaterThan(0);
      expect(m.adaptiveEquipment.length).toBeGreaterThan(0);
    });
  });
});
