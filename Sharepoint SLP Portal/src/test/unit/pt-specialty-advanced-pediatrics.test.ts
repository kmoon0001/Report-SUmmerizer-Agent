/**
 * PT Advanced Specialty - Pediatric Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTPediatricsModuleById,
  getAllPTPediatricsModules,
  getPTPediatricsModulesByCategory,
  searchPTPediatricsModules,
  getPTPediatricsModulesByEvidenceLevel,
  getPTPediatricsInterventionApproaches,
  validatePTPediatricsParentTraining,
} from "../../data/pt-specialty-advanced-pediatrics";

describe("PT Advanced Specialty - Pediatric Rehabilitation", () => {
  it("should have 5 pediatrics modules", () => {
    expect(getAllPTPediatricsModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getPTPediatricsModuleById("pt-ped-001");
    expect(module?.name).toBe("Cerebral Palsy Management");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTPediatricsModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getPTPediatricsModulesByCategory("Pediatric");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchPTPediatricsModules("Cerebral");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getPTPediatricsModulesByEvidenceLevel(1);
    expect(modules.length).toBe(5);
  });

  it("should return intervention approaches", () => {
    const approaches = getPTPediatricsInterventionApproaches();
    expect(Array.isArray(approaches)).toBe(true);
    expect(approaches.length).toBeGreaterThan(0);
  });

  it("should validate parent training", () => {
    const result = validatePTPediatricsParentTraining(
      "pt-ped-001",
      "Home exercise program",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid training", () => {
    const result = validatePTPediatricsParentTraining("pt-ped-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTPediatricsModules();
    all.forEach((m) => {
      expect(getPTPediatricsModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTPediatricsModuleById(null as any);
      getAllPTPediatricsModules();
      getPTPediatricsModulesByCategory("test");
      searchPTPediatricsModules("test");
      getPTPediatricsModulesByEvidenceLevel(1);
      getPTPediatricsInterventionApproaches();
      validatePTPediatricsParentTraining("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTPediatricsModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.ageGroups).toBeDefined();
      expect(m.developmentalFocus).toBeDefined();
      expect(m.interventionApproaches).toBeDefined();
      expect(m.parentTraining).toBeDefined();
      expect(m.evidenceLevel).toBeDefined();
      expect(m.source).toBeDefined();
      expect(m.citation).toBeDefined();
      expect(m.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTPediatricsModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTPediatricsModules();
    all.forEach((m) => {
      expect(m.ageGroups.length).toBeGreaterThan(0);
      expect(m.developmentalFocus.length).toBeGreaterThan(0);
      expect(m.interventionApproaches.length).toBeGreaterThan(0);
      expect(m.parentTraining.length).toBeGreaterThan(0);
    });
  });
});
