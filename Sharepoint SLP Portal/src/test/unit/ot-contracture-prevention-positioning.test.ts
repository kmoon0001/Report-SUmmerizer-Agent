/**
 * OT Contracture Prevention & Positioning Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTContractureStrategyById,
  getAllOTContractureStrategies,
  getOTContractureStrategiesByCategory,
  searchOTContractureStrategies,
  getOTContractureStrategiesByEvidenceLevel,
  getRiskFactors,
  validateContractureStrategy,
} from "../../data/ot-contracture-prevention-positioning";

describe("OT Contracture Prevention & Positioning Data", () => {
  it("should have 5 contracture prevention strategies", () => {
    expect(getAllOTContractureStrategies().length).toBe(5);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTContractureStrategyById("ot-cp-001");
    expect(strategy?.name).toContain("Upper Extremity");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTContractureStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTContractureStrategiesByCategory("Occupational");
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should search strategies", () => {
    const results = searchOTContractureStrategies("Contracture");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTContractureStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return risk factors", () => {
    const factors = getRiskFactors();
    expect(Array.isArray(factors)).toBe(true);
    expect(factors.length).toBeGreaterThan(0);
  });

  it("should validate contracture strategy", () => {
    const result = validateContractureStrategy("ot-cp-001", "Immobility");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid risk factor", () => {
    const result = validateContractureStrategy("ot-cp-001", "Invalid factor");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTContractureStrategies();
    all.forEach((s) => {
      expect(getOTContractureStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTContractureStrategyById(null as any);
      getAllOTContractureStrategies();
      getOTContractureStrategiesByCategory("test");
      searchOTContractureStrategies("test");
      getOTContractureStrategiesByEvidenceLevel(1);
      getRiskFactors();
      validateContractureStrategy("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTContractureStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.riskFactors).toBeDefined();
      expect(s.occupationalGoals).toBeDefined();
      expect(s.positioningTechniques).toBeDefined();
      expect(s.splintingOrthotic).toBeDefined();
      expect(s.environmentalModifications).toBeDefined();
      expect(s.activityProgression).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTContractureStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTContractureStrategies();
    all.forEach((s) => {
      expect(s.riskFactors.length).toBeGreaterThan(0);
      expect(s.occupationalGoals.length).toBeGreaterThan(0);
      expect(s.positioningTechniques.length).toBeGreaterThan(0);
      expect(s.splintingOrthotic.length).toBeGreaterThan(0);
      expect(s.environmentalModifications.length).toBeGreaterThan(0);
      expect(s.activityProgression.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTContractureStrategies();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
