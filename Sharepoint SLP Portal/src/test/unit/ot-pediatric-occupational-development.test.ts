/**
 * OT Pediatric Occupational Development Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTPediatricStrategyById,
  getAllOTPediatricStrategies,
  getOTPediatricStrategiesByCategory,
  searchOTPediatricStrategies,
  getOTPediatricStrategiesByEvidenceLevel,
  getAgeGroups,
  validatePediatricStrategy,
} from "../../data/ot-pediatric-occupational-development";

describe("OT Pediatric Occupational Development Data", () => {
  it("should have 5 pediatric strategies", () => {
    expect(getAllOTPediatricStrategies().length).toBe(5);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTPediatricStrategyById("ot-ped-001");
    expect(strategy?.name).toContain("Fine Motor");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTPediatricStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTPediatricStrategiesByCategory("Occupational");
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should search strategies", () => {
    const results = searchOTPediatricStrategies("Development");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTPediatricStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return age groups", () => {
    const groups = getAgeGroups();
    expect(Array.isArray(groups)).toBe(true);
    expect(groups.length).toBeGreaterThan(0);
  });

  it("should validate pediatric strategy", () => {
    const result = validatePediatricStrategy("ot-ped-001", "Preschool");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid age group", () => {
    const result = validatePediatricStrategy("ot-ped-001", "Invalid group");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTPediatricStrategies();
    all.forEach((s) => {
      expect(getOTPediatricStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTPediatricStrategyById(null as any);
      getAllOTPediatricStrategies();
      getOTPediatricStrategiesByCategory("test");
      searchOTPediatricStrategies("test");
      getOTPediatricStrategiesByEvidenceLevel(1);
      getAgeGroups();
      validatePediatricStrategy("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTPediatricStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.ageGroups).toBeDefined();
      expect(s.developmentalGoals).toBeDefined();
      expect(s.playActivities).toBeDefined();
      expect(s.adaptationStrategies).toBeDefined();
      expect(s.environmentalSetup).toBeDefined();
      expect(s.parentCoachingStrategies).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTPediatricStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTPediatricStrategies();
    all.forEach((s) => {
      expect(s.ageGroups.length).toBeGreaterThan(0);
      expect(s.developmentalGoals.length).toBeGreaterThan(0);
      expect(s.playActivities.length).toBeGreaterThan(0);
      expect(s.adaptationStrategies.length).toBeGreaterThan(0);
      expect(s.environmentalSetup.length).toBeGreaterThan(0);
      expect(s.parentCoachingStrategies.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTPediatricStrategies();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
