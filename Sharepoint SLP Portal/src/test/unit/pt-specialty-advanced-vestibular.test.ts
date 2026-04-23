/**
 * PT Advanced Specialty - Vestibular Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTVestibularModuleById,
  getAllPTVestibularModules,
  getPTVestibularModulesByCategory,
  searchPTVestibularModules,
  getPTVestibularModulesByEvidenceLevel,
  getPTVestibularInterventionStrategies,
  validatePTVestibularPrecaution,
} from "../../data/pt-specialty-advanced-vestibular";

describe("PT Advanced Specialty - Vestibular Rehabilitation", () => {
  it("should have 5 vestibular modules", () => {
    expect(getAllPTVestibularModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getPTVestibularModuleById("pt-vb-001");
    expect(module?.name).toBe("Benign Paroxysmal Positional Vertigo (BPPV)");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTVestibularModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getPTVestibularModulesByCategory("Vestibular");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchPTVestibularModules("BPPV");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getPTVestibularModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should return intervention strategies", () => {
    const strategies = getPTVestibularInterventionStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should validate precautions", () => {
    const result = validatePTVestibularPrecaution("pt-vb-001", "Fall risk");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid precautions", () => {
    const result = validatePTVestibularPrecaution("pt-vb-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTVestibularModules();
    all.forEach((m) => {
      expect(getPTVestibularModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTVestibularModuleById(null as any);
      getAllPTVestibularModules();
      getPTVestibularModulesByCategory("test");
      searchPTVestibularModules("test");
      getPTVestibularModulesByEvidenceLevel(1);
      getPTVestibularInterventionStrategies();
      validatePTVestibularPrecaution("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTVestibularModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.conditionTypes).toBeDefined();
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
    const all = getAllPTVestibularModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTVestibularModules();
    all.forEach((m) => {
      expect(m.conditionTypes.length).toBeGreaterThan(0);
      expect(m.assessmentFocus.length).toBeGreaterThan(0);
      expect(m.interventionStrategies.length).toBeGreaterThan(0);
      expect(m.precautions.length).toBeGreaterThan(0);
    });
  });
});
