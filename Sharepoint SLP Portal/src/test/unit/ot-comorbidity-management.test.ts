/**
 * OT Comorbidity Management Tests
 * Comprehensive testing of comorbidity management modules
 */

import { describe, it, expect } from "vitest";
import {
  getComorbidityModuleById,
  getAllComorbidityModules,
  getModulesByCategory,
  searchModules,
  getModulesByEvidenceLevel,
  getScenarios,
  getInteractionPatterns,
  getAssessmentModifications,
  getInterventionModifications,
  getPrioritizationStrategies,
  getContraindications,
  getPrecautions,
  getExpectedOutcomes,
  getCategories,
} from "../../data/ot-comorbidity-management";

describe("OT Comorbidity Management", () => {
  it("should have at least 2 comorbidity modules", () => {
    expect(getAllComorbidityModules().length).toBeGreaterThanOrEqual(2);
  });

  it("should return module by ID", () => {
    const module = getComorbidityModuleById("ot-cm-001");
    expect(module).toBeDefined();
    expect(module?.title).toContain("Cognitive");
  });

  it("should return undefined for invalid module ID", () => {
    expect(getComorbidityModuleById("invalid-id")).toBeUndefined();
  });

  it("should filter modules by category", () => {
    const modules = getModulesByCategory("Neuropsychological");
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should search modules by title", () => {
    const results = searchModules("Cognitive");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should search modules by condition", () => {
    const results = searchModules("Depression");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should get scenarios for module", () => {
    const scenarios = getScenarios("ot-cm-001");
    expect(scenarios.length).toBe(5);
  });

  it("should get interaction patterns for module", () => {
    const patterns = getInteractionPatterns("ot-cm-001");
    expect(patterns.length).toBe(5);
  });

  it("should get assessment modifications for module", () => {
    const mods = getAssessmentModifications("ot-cm-001");
    expect(mods.length).toBe(5);
  });

  it("should get intervention modifications for module", () => {
    const mods = getInterventionModifications("ot-cm-001");
    expect(mods.length).toBe(5);
  });

  it("should get prioritization strategies for module", () => {
    const strategies = getPrioritizationStrategies("ot-cm-001");
    expect(strategies.length).toBe(5);
  });

  it("should get contraindications for module", () => {
    const contras = getContraindications("ot-cm-001");
    expect(contras.length).toBeGreaterThan(0);
  });

  it("should get precautions for module", () => {
    const precs = getPrecautions("ot-cm-001");
    expect(precs.length).toBeGreaterThan(0);
  });

  it("should get expected outcomes for module", () => {
    const outcomes = getExpectedOutcomes("ot-cm-001");
    expect(outcomes.length).toBeGreaterThan(0);
  });

  it("should get all categories", () => {
    const categories = getCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should have all required module properties", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.title).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.conditions).toBeDefined();
      expect(m.scenarios).toBeDefined();
      expect(m.interactionPatterns).toBeDefined();
      expect(m.assessmentModifications).toBeDefined();
      expect(m.interventionModifications).toBeDefined();
      expect(m.prioritizationStrategies).toBeDefined();
      expect(m.contraindications).toBeDefined();
      expect(m.precautions).toBeDefined();
      expect(m.expectedOutcomes).toBeDefined();
      expect(m.evidenceLevel).toBeDefined();
      expect(m.source).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have 5 scenarios per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.scenarios.length).toBe(5);
    });
  });

  it("should have 5 interaction patterns per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.interactionPatterns.length).toBe(5);
    });
  });

  it("should have 5 assessment modifications per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.assessmentModifications.length).toBe(5);
    });
  });

  it("should have 5 intervention modifications per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.interventionModifications.length).toBe(5);
    });
  });

  it("should have 5 prioritization strategies per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.prioritizationStrategies.length).toBe(5);
    });
  });

  it("should have contraindications per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.contraindications.length).toBeGreaterThan(0);
    });
  });

  it("should have precautions per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.precautions.length).toBeGreaterThan(0);
    });
  });

  it("should have expected outcomes per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.expectedOutcomes.length).toBeGreaterThan(0);
    });
  });

  it("should handle null input gracefully", () => {
    expect(() => {
      getComorbidityModuleById(null as any);
      getModulesByCategory(null as any);
      searchModules(null as any);
      getScenarios(null as any);
    }).not.toThrow();
  });

  it("should have unique module IDs", () => {
    const modules = getAllComorbidityModules();
    const ids = modules.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have valid dates", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.lastUpdated instanceof Date).toBe(true);
      expect(m.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });

  it("should provide comprehensive comorbidity information", () => {
    const module = getComorbidityModuleById("ot-cm-001");
    expect(module?.scenarios.length).toBe(5);
    expect(module?.interactionPatterns.length).toBe(5);
    expect(module?.assessmentModifications.length).toBe(5);
    expect(module?.interventionModifications.length).toBe(5);
    expect(module?.prioritizationStrategies.length).toBe(5);
  });

  it("should handle edge cases", () => {
    const result1 = getScenarios("invalid-id");
    expect(result1).toBeDefined();

    const result2 = getInteractionPatterns("invalid-id");
    expect(result2).toBeDefined();

    const result3 = getContraindications("invalid-id");
    expect(result3).toBeDefined();
  });

  it("should search across all modules", () => {
    const results = searchModules("Cognitive");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by multiple criteria", () => {
    const modules = getAllComorbidityModules();
    const filtered = modules.filter((m) => m.evidenceLevel === 1);
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should have conditions array", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.conditions.length).toBe(2);
    });
  });

  it("should provide clinical guidance", () => {
    const module = getComorbidityModuleById("ot-cm-001");
    expect(module?.source).toBeDefined();
    expect(module?.source.length).toBeGreaterThan(0);
  });
});
