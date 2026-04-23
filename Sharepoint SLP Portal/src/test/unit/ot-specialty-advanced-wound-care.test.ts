/**
 * OT Advanced Specialty - Wound Care Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTWoundCareModuleById,
  getAllOTWoundCareModules,
  getOTWoundCareModulesByCategory,
  searchOTWoundCareModules,
  getOTWoundCareModulesByEvidenceLevel,
  getOTWoundCareInterventionStrategies,
  validateOTWoundCareAdaptiveEquipment,
} from "../../data/ot-specialty-advanced-wound-care";

describe("OT Advanced Specialty - Wound Care Rehabilitation", () => {
  it("should have 5 wound care modules", () => {
    expect(getAllOTWoundCareModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getOTWoundCareModuleById("ot-wc-001");
    expect(module?.name).toBe("Pressure Ulcer Prevention & Management");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTWoundCareModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getOTWoundCareModulesByCategory("Wound");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchOTWoundCareModules("Ulcer");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getOTWoundCareModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should return intervention strategies", () => {
    const strategies = getOTWoundCareInterventionStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should validate adaptive equipment", () => {
    const result = validateOTWoundCareAdaptiveEquipment(
      "ot-wc-001",
      "Pressure relief cushions",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid equipment", () => {
    const result = validateOTWoundCareAdaptiveEquipment("ot-wc-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTWoundCareModules();
    all.forEach((m) => {
      expect(getOTWoundCareModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTWoundCareModuleById(null as any);
      getAllOTWoundCareModules();
      getOTWoundCareModulesByCategory("test");
      searchOTWoundCareModules("test");
      getOTWoundCareModulesByEvidenceLevel(1);
      getOTWoundCareInterventionStrategies();
      validateOTWoundCareAdaptiveEquipment("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTWoundCareModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.woundTypes).toBeDefined();
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
    const all = getAllOTWoundCareModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTWoundCareModules();
    all.forEach((m) => {
      expect(m.woundTypes.length).toBeGreaterThan(0);
      expect(m.assessmentFocus.length).toBeGreaterThan(0);
      expect(m.interventionStrategies.length).toBeGreaterThan(0);
      expect(m.adaptiveEquipment.length).toBeGreaterThan(0);
    });
  });
});
