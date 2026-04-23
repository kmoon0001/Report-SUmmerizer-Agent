/**
 * OT Advanced Specialty - Pediatric Rehabilitation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTPediatricsModuleById,
  getAllOTPediatricsModules,
  getOTPediatricsModulesByCategory,
  searchOTPediatricsModules,
  getOTPediatricsModulesByEvidenceLevel,
  getOTPediatricsInterventionStrategies,
  validateOTPediatricsSchoolAccommodation,
} from "../../data/ot-specialty-advanced-pediatrics";

describe("OT Advanced Specialty - Pediatric Rehabilitation", () => {
  it("should have 5 pediatrics modules", () => {
    expect(getAllOTPediatricsModules().length).toBe(5);
  });

  it("should return module by ID", () => {
    const module = getOTPediatricsModuleById("ot-ped-001");
    expect(module?.name).toBe("Autism Spectrum Disorder Management");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTPediatricsModuleById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const modules = getOTPediatricsModulesByCategory("Pediatric");
    expect(modules.length).toBe(5);
  });

  it("should search modules", () => {
    const results = searchOTPediatricsModules("Autism");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const modules = getOTPediatricsModulesByEvidenceLevel(1);
    expect(modules.length).toBe(5);
  });

  it("should return intervention strategies", () => {
    const strategies = getOTPediatricsInterventionStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should validate school accommodations", () => {
    const result = validateOTPediatricsSchoolAccommodation(
      "ot-ped-001",
      "Sensory breaks",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid accommodations", () => {
    const result = validateOTPediatricsSchoolAccommodation(
      "ot-ped-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTPediatricsModules();
    all.forEach((m) => {
      expect(getOTPediatricsModuleById(m.id)).toEqual(m);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTPediatricsModuleById(null as any);
      getAllOTPediatricsModules();
      getOTPediatricsModulesByCategory("test");
      searchOTPediatricsModules("test");
      getOTPediatricsModulesByEvidenceLevel(1);
      getOTPediatricsInterventionStrategies();
      validateOTPediatricsSchoolAccommodation("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTPediatricsModules();
    all.forEach((m) => {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.ageGroups).toBeDefined();
      expect(m.developmentalFocus).toBeDefined();
      expect(m.interventionStrategies).toBeDefined();
      expect(m.schoolAccommodations).toBeDefined();
      expect(m.evidenceLevel).toBeDefined();
      expect(m.source).toBeDefined();
      expect(m.citation).toBeDefined();
      expect(m.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTPediatricsModules();
    all.forEach((m) => {
      expect([1, 2, 3]).toContain(m.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTPediatricsModules();
    all.forEach((m) => {
      expect(m.ageGroups.length).toBeGreaterThan(0);
      expect(m.developmentalFocus.length).toBeGreaterThan(0);
      expect(m.interventionStrategies.length).toBeGreaterThan(0);
      expect(m.schoolAccommodations.length).toBeGreaterThan(0);
    });
  });
});
