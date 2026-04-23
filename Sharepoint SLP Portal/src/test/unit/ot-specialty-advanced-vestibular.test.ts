/**
 * OT Advanced Specialty - Vestibular Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTVestibularModuleById,
  getAllOTVestibularModules,
  getOTVestibularModulesByCategory,
  searchOTVestibularModules,
  getOTVestibularModulesByEvidenceLevel,
  getOTVestibularInterventionStrategies,
  validateOTVestibularAdaptiveEquipment,
} from "../../data/ot-specialty-advanced-vestibular";

describe("OT Advanced Specialty - Vestibular Rehabilitation", () => {
  it("should have 5 vestibular modules", () => {
    expect(getAllOTVestibularModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getOTVestibularModuleById("ot-vb-001");
    expect(module?.name).toBe(
      "Benign Paroxysmal Positional Vertigo (BPPV) Management",
    );
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTVestibularModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getOTVestibularModulesByCategory("Vestibular");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchOTVestibularModules("BPPV");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getOTVestibularModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should return intervention strategies", () => {
    const strategies = getOTVestibularInterventionStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should validate adaptive equipment", () => {
    const result = validateOTVestibularAdaptiveEquipment(
      "ot-vb-001",
      "Balance aids",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid equipment", () => {
    const result = validateOTVestibularAdaptiveEquipment(
      "ot-vb-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTVestibularModules();
    all.forEach((m) => {
      expect(getOTVestibularModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTVestibularModuleById(null as any);
      getAllOTVestibularModules();
      getOTVestibularModulesByCategory("test");
      searchOTVestibularModules("test");
      getOTVestibularModulesByEvidenceLevel(1);
      getOTVestibularInterventionStrategies();
      validateOTVestibularAdaptiveEquipment("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTVestibularModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.conditionTypes).toBeDefined();
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
    const all = getAllOTVestibularModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTVestibularModules();
    all.forEach((m) => {
      expect(m.conditionTypes.length).toBeGreaterThan(0);
      expect(m.assessmentFocus.length).toBeGreaterThan(0);
      expect(m.interventionStrategies.length).toBeGreaterThan(0);
      expect(m.adaptiveEquipment.length).toBeGreaterThan(0);
    });
  });
});
