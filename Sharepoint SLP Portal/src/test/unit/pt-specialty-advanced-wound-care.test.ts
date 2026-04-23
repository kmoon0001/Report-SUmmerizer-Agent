/**
 * PT Advanced Specialty - Wound Care Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTWoundCareModuleById,
  getAllPTWoundCareModules,
  getPTWoundCareModulesByCategory,
  searchPTWoundCareModules,
  getPTWoundCareModulesByEvidenceLevel,
  getPTWoundCareInterventionStrategies,
  validatePTWoundCarePrecaution,
} from "../../data/pt-specialty-advanced-wound-care";

describe("PT Advanced Specialty - Wound Care Rehabilitation", () => {
  it("should have 5 wound care modules", () => {
    expect(getAllPTWoundCareModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getPTWoundCareModuleById("pt-wc-001");
    expect(module?.name).toBe("Pressure Ulcer Management");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTWoundCareModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getPTWoundCareModulesByCategory("Wound");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchPTWoundCareModules("Ulcer");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getPTWoundCareModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should return intervention strategies", () => {
    const strategies = getPTWoundCareInterventionStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should validate precautions", () => {
    const result = validatePTWoundCarePrecaution("pt-wc-001", "Infection risk");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid precautions", () => {
    const result = validatePTWoundCarePrecaution("pt-wc-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTWoundCareModules();
    all.forEach((m) => {
      expect(getPTWoundCareModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTWoundCareModuleById(null as any);
      getAllPTWoundCareModules();
      getPTWoundCareModulesByCategory("test");
      searchPTWoundCareModules("test");
      getPTWoundCareModulesByEvidenceLevel(1);
      getPTWoundCareInterventionStrategies();
      validatePTWoundCarePrecaution("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTWoundCareModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.woundTypes).toBeDefined();
      expect(m.assessmentFocus).toBeDefined();
      expect(m.interventionStrategies).toBeDefined();
      expect(m.precautions).toBeDefined();
      expect(m.evidenceLevel).toBeDefined();
      expect(m.source).toBeDefined();
      expect(m.citation).toBeDefined();
      expect(m.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTWoundCareModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTWoundCareModules();
    all.forEach((m) => {
      expect(m.woundTypes.length).toBeGreaterThan(0);
      expect(m.assessmentFocus.length).toBeGreaterThan(0);
      expect(m.interventionStrategies.length).toBeGreaterThan(0);
      expect(m.precautions.length).toBeGreaterThan(0);
    });
  });
});
