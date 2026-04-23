/**
 * OT Advanced Specialty - Geriatric Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTGeriatricsModuleById,
  getAllOTGeriatricsModules,
  getOTGeriatricsModulesByCategory,
  searchOTGeriatricsModules,
  getOTGeriatricsModulesByEvidenceLevel,
  getOTGeriatricsInterventionStrategies,
  validateOTGeriatricsAdaptiveEquipment,
} from "../../data/ot-specialty-advanced-geriatrics";

describe("OT Advanced Specialty - Geriatric Rehabilitation", () => {
  it("should have 5 geriatrics modules", () => {
    expect(getAllOTGeriatricsModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getOTGeriatricsModuleById("ot-ger-001");
    expect(module?.name).toBe("Fall Prevention & Safety");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTGeriatricsModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getOTGeriatricsModulesByCategory("Geriatric");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchOTGeriatricsModules("Fall");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getOTGeriatricsModulesByEvidenceLevel(1);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should return intervention strategies", () => {
    const strategies = getOTGeriatricsInterventionStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should validate adaptive equipment", () => {
    const result = validateOTGeriatricsAdaptiveEquipment(
      "ot-ger-001",
      "Grab bars",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid equipment", () => {
    const result = validateOTGeriatricsAdaptiveEquipment(
      "ot-ger-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTGeriatricsModules();
    all.forEach((m) => {
      expect(getOTGeriatricsModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTGeriatricsModuleById(null as any);
      getAllOTGeriatricsModules();
      getOTGeriatricsModulesByCategory("test");
      searchOTGeriatricsModules("test");
      getOTGeriatricsModulesByEvidenceLevel(1);
      getOTGeriatricsInterventionStrategies();
      validateOTGeriatricsAdaptiveEquipment("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTGeriatricsModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.ageGroups).toBeDefined();
      expect(m.clinicalFocus).toBeDefined();
      expect(m.interventionStrategies).toBeDefined();
      expect(m.adaptiveEquipment).toBeDefined();
      expect(m.evidenceLevel).toBeDefined();
      expect(m.source).toBeDefined();
      expect(m.citation).toBeDefined();
      expect(m.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTGeriatricsModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTGeriatricsModules();
    all.forEach((m) => {
      expect(m.ageGroups.length).toBeGreaterThan(0);
      expect(m.clinicalFocus.length).toBeGreaterThan(0);
      expect(m.interventionStrategies.length).toBeGreaterThan(0);
      expect(m.adaptiveEquipment.length).toBeGreaterThan(0);
    });
  });
});
