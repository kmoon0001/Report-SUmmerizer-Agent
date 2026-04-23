/**
 * OT Wound Care & Occupational Participation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTWoundCareStrategyById,
  getAllOTWoundCareStrategies,
  getOTWoundCareStrategiesByCategory,
  searchOTWoundCareStrategies,
  getOTWoundCareStrategiesByEvidenceLevel,
  getWoundTypes,
  validateWoundCareStrategy,
} from "../../data/ot-wound-care-occupational-participation";

describe("OT Wound Care & Occupational Participation Data", () => {
  it("should have 5 wound care strategies", () => {
    expect(getAllOTWoundCareStrategies().length).toBe(5);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTWoundCareStrategyById("ot-wc-001");
    expect(strategy?.name).toContain("Pressure");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTWoundCareStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTWoundCareStrategiesByCategory("Occupational");
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should search strategies", () => {
    const results = searchOTWoundCareStrategies("Wound");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTWoundCareStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return wound types", () => {
    const types = getWoundTypes();
    expect(Array.isArray(types)).toBe(true);
    expect(types.length).toBeGreaterThan(0);
  });

  it("should validate wound care strategy", () => {
    const result = validateWoundCareStrategy("ot-wc-001", "Pressure injuries");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid wound type", () => {
    const result = validateWoundCareStrategy("ot-wc-001", "Invalid type");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTWoundCareStrategies();
    all.forEach((s) => {
      expect(getOTWoundCareStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTWoundCareStrategyById(null as any);
      getAllOTWoundCareStrategies();
      getOTWoundCareStrategiesByCategory("test");
      searchOTWoundCareStrategies("test");
      getOTWoundCareStrategiesByEvidenceLevel(1);
      getWoundTypes();
      validateWoundCareStrategy("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTWoundCareStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.woundTypes).toBeDefined();
      expect(s.occupationalGoals).toBeDefined();
      expect(s.adaptationStrategies).toBeDefined();
      expect(s.precautions).toBeDefined();
      expect(s.environmentalModifications).toBeDefined();
      expect(s.activityRestrictions).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTWoundCareStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTWoundCareStrategies();
    all.forEach((s) => {
      expect(s.woundTypes.length).toBeGreaterThan(0);
      expect(s.occupationalGoals.length).toBeGreaterThan(0);
      expect(s.adaptationStrategies.length).toBeGreaterThan(0);
      expect(s.precautions.length).toBeGreaterThan(0);
      expect(s.environmentalModifications.length).toBeGreaterThan(0);
      expect(s.activityRestrictions.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTWoundCareStrategies();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
