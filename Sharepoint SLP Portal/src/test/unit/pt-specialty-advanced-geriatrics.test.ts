/**
 * PT Advanced Specialty - Geriatric Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTGeriatricsModuleById,
  getAllPTGeriatricsModules,
  getPTGeriatricsModulesByCategory,
  searchPTGeriatricsModules,
  getPTGeriatricsModulesByEvidenceLevel,
  getPTGeriatricsFallPreventionStrategies,
  validatePTGeriatricsIntervention,
} from "../../data/pt-specialty-advanced-geriatrics";

describe("PT Advanced Specialty - Geriatric Rehabilitation", () => {
  it("should have 5 geriatrics modules", () => {
    expect(getAllPTGeriatricsModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getPTGeriatricsModuleById("pt-ger-001");
    expect(module?.name).toBe("Fall Prevention & Balance Training");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTGeriatricsModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getPTGeriatricsModulesByCategory("Geriatric");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchPTGeriatricsModules("Fall");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getPTGeriatricsModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should return fall prevention strategies", () => {
    const strategies = getPTGeriatricsFallPreventionStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should validate interventions", () => {
    const result = validatePTGeriatricsIntervention(
      "pt-ger-001",
      "Balance training",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid interventions", () => {
    const result = validatePTGeriatricsIntervention("pt-ger-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTGeriatricsModules();
    all.forEach((m) => {
      expect(getPTGeriatricsModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTGeriatricsModuleById(null as any);
      getAllPTGeriatricsModules();
      getPTGeriatricsModulesByCategory("test");
      searchPTGeriatricsModules("test");
      getPTGeriatricsModulesByEvidenceLevel(1);
      getPTGeriatricsFallPreventionStrategies();
      validatePTGeriatricsIntervention("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTGeriatricsModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.ageGroups).toBeDefined();
      expect(m.clinicalFocus).toBeDefined();
      expect(m.interventionApproaches).toBeDefined();
      expect(m.fallPrevention).toBeDefined();
      expect(m.evidenceLevel).toBeDefined();
      expect(m.source).toBeDefined();
      expect(m.citation).toBeDefined();
      expect(m.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTGeriatricsModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTGeriatricsModules();
    all.forEach((m) => {
      expect(m.ageGroups.length).toBeGreaterThan(0);
      expect(m.clinicalFocus.length).toBeGreaterThan(0);
      expect(m.interventionApproaches.length).toBeGreaterThan(0);
      expect(m.fallPrevention.length).toBeGreaterThan(0);
    });
  });
});
