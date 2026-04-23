/**
 * PT Comorbidity Management Tests
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
} from "../../data/pt-comorbidity-management";

describe("PT Comorbidity Management", () => {
  it("should have at least 2 comorbidity modules", () => {
    expect(getAllComorbidityModules().length).toBeGreaterThanOrEqual(2);
  });

  it("should return module by ID", () => {
    const module = getComorbidityModuleById("pt-cm-001");
    expect(module).toBeDefined();
    expect(module?.title).toContain("Diabetes");
  });

  it("should return undefined for invalid module ID", () => {
    expect(getComorbidityModuleById("invalid-id")).toBeUndefined();
  });

  it("should filter modules by category", () => {
    const modules = getModulesByCategory("Metabolic-Cardiovascular");
    expect(modules.length).toBeGreaterThan(0);
    expect(modules[0]!.category).toBe("Metabolic-Cardiovascular");
  });

  it("should search modules by title", () => {
    const results = searchModules("Diabetes");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.title).toContain("Diabetes");
  });

  it("should search modules by condition", () => {
    const results = searchModules("Cardiac");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
    expect(modules[0]!.evidenceLevel).toBe(1);
  });

  it("should get scenarios for module", () => {
    const scenarios = getScenarios("pt-cm-001");
    expect(scenarios.length).toBe(5);
    expect(scenarios[0]!.id).toBeDefined();
    expect(scenarios[0]!.scenario).toBeDefined();
  });

  it("should get interaction patterns for module", () => {
    const patterns = getInteractionPatterns("pt-cm-001");
    expect(patterns.length).toBe(5);
    expect(patterns[0]!.condition1).toBeDefined();
    expect(patterns[0]!.condition2).toBeDefined();
  });

  it("should get assessment modifications for module", () => {
    const mods = getAssessmentModifications("pt-cm-001");
    expect(mods.length).toBe(5);
    expect(mods[0]!.standardAssessment).toBeDefined();
    expect(mods[0]!.modification).toBeDefined();
  });

  it("should get intervention modifications for module", () => {
    const mods = getInterventionModifications("pt-cm-001");
    expect(mods.length).toBe(5);
    expect(mods[0]!.standardIntervention).toBeDefined();
    expect(mods[0]!.modification).toBeDefined();
  });

  it("should get prioritization strategies for module", () => {
    const strategies = getPrioritizationStrategies("pt-cm-001");
    expect(strategies.length).toBe(5);
    expect(strategies[0]!.priority).toBeDefined();
    expect(strategies[0]!.condition).toBeDefined();
  });

  it("should get contraindications for module", () => {
    const contras = getContraindications("pt-cm-001");
    expect(contras.length).toBeGreaterThan(0);
    expect(contras[0]!.intervention).toBeDefined();
    expect(contras[0]!.severity).toMatch(/absolute|relative/);
  });

  it("should get precautions for module", () => {
    const precs = getPrecautions("pt-cm-001");
    expect(precs.length).toBeGreaterThan(0);
    expect(typeof precs[0]!).toBe("string");
  });

  it("should get expected outcomes for module", () => {
    const outcomes = getExpectedOutcomes("pt-cm-001");
    expect(outcomes.length).toBeGreaterThan(0);
    expect(typeof outcomes[0]!).toBe("string");
  });

  it("should return categories", () => {
    const categories = getCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should have all required module properties", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.title).toBeDefined();
      expect(m.conditions).toBeDefined();
      expect(m.conditions.length).toBe(2);
      expect(m.category).toBeDefined();
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
      expect(m.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have exactly 5 scenarios per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.scenarios.length).toBe(5);
    });
  });

  it("should have exactly 5 interaction patterns per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.interactionPatterns.length).toBe(5);
    });
  });

  it("should have exactly 5 assessment modifications per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.assessmentModifications.length).toBe(5);
    });
  });

  it("should have exactly 5 intervention modifications per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.interventionModifications.length).toBe(5);
    });
  });

  it("should have exactly 5 prioritization strategies per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.prioritizationStrategies.length).toBe(5);
    });
  });

  it("should have at least 5 contraindications per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.contraindications.length).toBeGreaterThanOrEqual(5);
    });
  });

  it("should have at least 10 precautions per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.precautions.length).toBeGreaterThanOrEqual(10);
    });
  });

  it("should have at least 10 expected outcomes per module", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.expectedOutcomes.length).toBeGreaterThanOrEqual(10);
    });
  });

  it("should have valid scenario properties", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.scenarios.forEach((s) => {
        expect(s.id).toBeDefined();
        expect(s.scenario).toBeDefined();
        expect(s.prevalence).toBeDefined();
        expect(s.clinicalPresentation).toBeDefined();
        expect(s.riskFactors).toBeDefined();
        expect(s.riskFactors.length).toBeGreaterThan(0);
      });
    });
  });

  it("should have valid interaction pattern properties", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.interactionPatterns.forEach((p) => {
        expect(p.condition1).toBeDefined();
        expect(p.condition2).toBeDefined();
        expect(p.interactionType).toBeDefined();
        expect(p.clinicalImpact).toBeDefined();
        expect(p.modificationRequired).toBe(true);
      });
    });
  });

  it("should have valid assessment modification properties", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.assessmentModifications.forEach((a) => {
        expect(a.standardAssessment).toBeDefined();
        expect(a.modification).toBeDefined();
        expect(a.rationale).toBeDefined();
        expect(a.priorityOrder).toBeGreaterThan(0);
      });
    });
  });

  it("should have valid intervention modification properties", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.interventionModifications.forEach((i) => {
        expect(i.standardIntervention).toBeDefined();
        expect(i.modification).toBeDefined();
        expect(i.rationale).toBeDefined();
        expect(i.dosageAdjustment).toBeDefined();
      });
    });
  });

  it("should have valid prioritization strategy properties", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.prioritizationStrategies.forEach((p) => {
        expect(p.priority).toBeGreaterThan(0);
        expect(p.condition).toBeDefined();
        expect(p.rationale).toBeDefined();
        expect(p.timeframe).toBeDefined();
        expect(p.expectedOutcome).toBeDefined();
      });
    });
  });

  it("should have valid contraindication properties", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.contraindications.forEach((c) => {
        expect(c.intervention).toBeDefined();
        expect(c.reason).toBeDefined();
        expect(["absolute", "relative"]).toContain(c.severity);
        expect(c.alternativeApproach).toBeDefined();
      });
    });
  });

  it("should have valid dates", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.lastUpdated instanceof Date).toBe(true);
      expect(m.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });

  it("should handle empty search results gracefully", () => {
    const results = searchModules("nonexistent-condition-xyz");
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });

  it("should handle invalid module ID gracefully", () => {
    expect(getScenarios("invalid")).toEqual([]);
    expect(getInteractionPatterns("invalid")).toEqual([]);
    expect(getAssessmentModifications("invalid")).toEqual([]);
    expect(getInterventionModifications("invalid")).toEqual([]);
    expect(getPrioritizationStrategies("invalid")).toEqual([]);
    expect(getContraindications("invalid")).toEqual([]);
    expect(getPrecautions("invalid")).toEqual([]);
    expect(getExpectedOutcomes("invalid")).toEqual([]);
  });

  it("should have unique module IDs", () => {
    const modules = getAllComorbidityModules();
    const ids = modules.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have unique scenario IDs within modules", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      const ids = m.scenarios.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  it("should have comprehensive clinical content", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.scenarios.forEach((s) => {
        expect(s.scenario.length).toBeGreaterThan(20);
        expect(s.clinicalPresentation.length).toBeGreaterThan(20);
      });
      m.interactionPatterns.forEach((p) => {
        expect(p.clinicalImpact.length).toBeGreaterThan(20);
      });
    });
  });

  it("should have evidence-based sources", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.source).toBeDefined();
      expect(m.source.length).toBeGreaterThan(10);
      expect(m.source).toMatch(/APTA|ADA|AOTA|Guidelines|Standards/);
    });
  });

  it("should have specific dosage recommendations", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.interventionModifications.forEach((i) => {
        expect(i.dosageAdjustment).toMatch(/\d+/);
      });
    });
  });

  it("should have prioritized strategies", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      const priorities = m.prioritizationStrategies.map((p) => p.priority);
      expect(priorities).toContain(1);
      expect(priorities).toContain(2);
    });
  });

  it("should have alternative approaches for contraindications", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.contraindications.forEach((c) => {
        expect(c.alternativeApproach.length).toBeGreaterThan(10);
      });
    });
  });

  it("should have measurable expected outcomes", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.expectedOutcomes.forEach((o) => {
        expect(o.length).toBeGreaterThan(15);
      });
    });
  });

  it("should have comprehensive precautions", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.precautions.forEach((p) => {
        expect(p.length).toBeGreaterThan(10);
      });
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

  it("should have consistent condition naming", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      expect(m.conditions[0]!).toBeDefined();
      expect(m.conditions[1]!).toBeDefined();
      expect(m.conditions[0]!).not.toBe(m.conditions[1]!);
    });
  });

  it("should have clinical relevance in scenarios", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.scenarios.forEach((s) => {
        expect(s.prevalence).toMatch(/\d+/);
        expect(s.riskFactors.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it("should have evidence-based modifications", () => {
    const modules = getAllComorbidityModules();
    modules.forEach((m) => {
      m.assessmentModifications.forEach((a) => {
        expect(a.rationale.length).toBeGreaterThan(20);
      });
      m.interventionModifications.forEach((i) => {
        expect(i.rationale.length).toBeGreaterThan(20);
      });
    });
  });
});
