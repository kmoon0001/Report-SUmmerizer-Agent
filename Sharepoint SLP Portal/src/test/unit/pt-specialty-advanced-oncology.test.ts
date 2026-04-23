/**
 * PT Advanced Specialty - Oncology Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTOncologyModuleById,
  getAllPTOncologyModules,
  getPTOncologyModulesByCategory,
  searchPTOncologyModules,
  getPTOncologyModulesByEvidenceLevel,
  getPTOncologyInterventionStrategies,
  validatePTOncologyPrecaution,
} from "../../data/pt-specialty-advanced-oncology";

describe("PT Advanced Specialty - Oncology Rehabilitation", () => {
  it("should have 5 oncology modules", () => {
    expect(getAllPTOncologyModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getPTOncologyModuleById("pt-onc-001");
    expect(module?.name).toBe("Breast Cancer Rehabilitation");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTOncologyModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getPTOncologyModulesByCategory("Oncology");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchPTOncologyModules("Cancer");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getPTOncologyModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should return intervention strategies", () => {
    const strategies = getPTOncologyInterventionStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should validate precautions", () => {
    const result = validatePTOncologyPrecaution(
      "pt-onc-001",
      "Lymphedema risk",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid precautions", () => {
    const result = validatePTOncologyPrecaution("pt-onc-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTOncologyModules();
    all.forEach((m) => {
      expect(getPTOncologyModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTOncologyModuleById(null as any);
      getAllPTOncologyModules();
      getPTOncologyModulesByCategory("test");
      searchPTOncologyModules("test");
      getPTOncologyModulesByEvidenceLevel(1);
      getPTOncologyInterventionStrategies();
      validatePTOncologyPrecaution("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTOncologyModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.cancerTypes).toBeDefined();
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
    const all = getAllPTOncologyModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTOncologyModules();
    all.forEach((m) => {
      expect(m.cancerTypes.length).toBeGreaterThan(0);
      expect(m.assessmentFocus.length).toBeGreaterThan(0);
      expect(m.interventionStrategies.length).toBeGreaterThan(0);
      expect(m.precautions.length).toBeGreaterThan(0);
    });
  });
});
