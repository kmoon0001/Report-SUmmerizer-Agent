/**
 * OT Respiratory & Occupational Participation Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTRespiratoryStrategyById,
  getAllOTRespiratoryStrategies,
  getOTRespiratoryStrategiesByCategory,
  searchOTRespiratoryStrategies,
  getOTRespiratoryStrategiesByEvidenceLevel,
  getRespiratoryConditions,
  validateRespiratoryStrategy,
} from "../../data/ot-respiratory-occupational-participation";

describe("OT Respiratory & Occupational Participation Data", () => {
  it("should have 5 respiratory strategies", () => {
    expect(getAllOTRespiratoryStrategies().length).toBe(5);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTRespiratoryStrategyById("ot-resp-001");
    expect(strategy?.name).toContain("Energy Conservation");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTRespiratoryStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTRespiratoryStrategiesByCategory("Occupational");
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should search strategies", () => {
    const results = searchOTRespiratoryStrategies("Respiratory");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTRespiratoryStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return respiratory conditions", () => {
    const conditions = getRespiratoryConditions();
    expect(Array.isArray(conditions)).toBe(true);
    expect(conditions.length).toBeGreaterThan(0);
  });

  it("should validate respiratory strategy", () => {
    const result = validateRespiratoryStrategy("ot-resp-001", "COPD");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid condition", () => {
    const result = validateRespiratoryStrategy(
      "ot-resp-001",
      "Invalid condition",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTRespiratoryStrategies();
    all.forEach((s) => {
      expect(getOTRespiratoryStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTRespiratoryStrategyById(null as any);
      getAllOTRespiratoryStrategies();
      getOTRespiratoryStrategiesByCategory("test");
      searchOTRespiratoryStrategies("test");
      getOTRespiratoryStrategiesByEvidenceLevel(1);
      getRespiratoryConditions();
      validateRespiratoryStrategy("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTRespiratoryStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.respiratoryConditions).toBeDefined();
      expect(s.occupationalGoals).toBeDefined();
      expect(s.adaptationStrategies).toBeDefined();
      expect(s.energyConservationTechniques).toBeDefined();
      expect(s.environmentalModifications).toBeDefined();
      expect(s.activityGradation).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTRespiratoryStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTRespiratoryStrategies();
    all.forEach((s) => {
      expect(s.respiratoryConditions.length).toBeGreaterThan(0);
      expect(s.occupationalGoals.length).toBeGreaterThan(0);
      expect(s.adaptationStrategies.length).toBeGreaterThan(0);
      expect(s.energyConservationTechniques.length).toBeGreaterThan(0);
      expect(s.environmentalModifications.length).toBeGreaterThan(0);
      expect(s.activityGradation.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTRespiratoryStrategies();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
