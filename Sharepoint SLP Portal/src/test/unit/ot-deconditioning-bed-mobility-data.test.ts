/**
 * OT Deconditioning & Bed Mobility Data Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTDeconditioningStrategyById,
  getAllOTDeconditioningStrategies,
  getOTDeconditioningStrategiesByCategory,
  searchOTDeconditioningStrategies,
  getOTDeconditioningStrategiesByEvidenceLevel,
  getProgressionStages,
  validateDeconditioningStrategy,
} from "../../data/ot-deconditioning-bed-mobility-data";

describe("OT Deconditioning & Bed Mobility Data", () => {
  it("should have 5 deconditioning strategies", () => {
    expect(getAllOTDeconditioningStrategies().length).toBe(5);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTDeconditioningStrategyById("ot-decon-001");
    expect(strategy?.name).toContain("Bed Mobility");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTDeconditioningStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTDeconditioningStrategiesByCategory("Bed");
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should search strategies", () => {
    const results = searchOTDeconditioningStrategies("Deconditioning");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTDeconditioningStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return progression stages", () => {
    const stages = getProgressionStages();
    expect(Array.isArray(stages)).toBe(true);
    expect(stages.length).toBeGreaterThan(0);
  });

  it("should validate deconditioning strategy", () => {
    const result = validateDeconditioningStrategy(
      "ot-decon-001",
      "Deconditioning",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid condition", () => {
    const result = validateDeconditioningStrategy(
      "ot-decon-001",
      "Invalid condition",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTDeconditioningStrategies();
    all.forEach((s) => {
      expect(getOTDeconditioningStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTDeconditioningStrategyById(null as any);
      getAllOTDeconditioningStrategies();
      getOTDeconditioningStrategiesByCategory("test");
      searchOTDeconditioningStrategies("test");
      getOTDeconditioningStrategiesByEvidenceLevel(1);
      getProgressionStages();
      validateDeconditioningStrategy("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTDeconditioningStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.targetConditions).toBeDefined();
      expect(s.occupationalGoals).toBeDefined();
      expect(s.mobilityTechniques).toBeDefined();
      expect(s.adaptiveEquipment).toBeDefined();
      expect(s.progressionStages).toBeDefined();
      expect(s.safetyConsiderations).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTDeconditioningStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTDeconditioningStrategies();
    all.forEach((s) => {
      expect(s.targetConditions.length).toBeGreaterThan(0);
      expect(s.occupationalGoals.length).toBeGreaterThan(0);
      expect(s.mobilityTechniques.length).toBeGreaterThan(0);
      expect(s.adaptiveEquipment.length).toBeGreaterThan(0);
      expect(s.progressionStages.length).toBeGreaterThan(0);
      expect(s.safetyConsiderations.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTDeconditioningStrategies();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
