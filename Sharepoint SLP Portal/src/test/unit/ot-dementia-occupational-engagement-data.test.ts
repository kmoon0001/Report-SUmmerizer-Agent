/**
 * OT Dementia Occupational Engagement Data Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTDementiaEngagementStrategyById,
  getAllOTDementiaEngagementStrategies,
  getOTDementiaEngagementStrategiesByCategory,
  searchOTDementiaEngagementStrategies,
  getOTDementiaEngagementStrategiesByEvidenceLevel,
  getDementiaStages,
  validateDementiaEngagementStrategy,
} from "../../data/ot-dementia-occupational-engagement-data";

describe("OT Dementia Occupational Engagement Data", () => {
  it("should have 5 dementia engagement strategies", () => {
    expect(getAllOTDementiaEngagementStrategies().length).toBe(5);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTDementiaEngagementStrategyById("ot-dem-001");
    expect(strategy?.name).toContain("Meaningful");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTDementiaEngagementStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies =
      getOTDementiaEngagementStrategiesByCategory("Occupational");
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should search strategies", () => {
    const results = searchOTDementiaEngagementStrategies("Dementia");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTDementiaEngagementStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return dementia stages", () => {
    const stages = getDementiaStages();
    expect(Array.isArray(stages)).toBe(true);
    expect(stages.length).toBeGreaterThan(0);
  });

  it("should validate dementia engagement strategy", () => {
    const result = validateDementiaEngagementStrategy(
      "ot-dem-001",
      "Early stage",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid stage", () => {
    const result = validateDementiaEngagementStrategy(
      "ot-dem-001",
      "Invalid stage",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTDementiaEngagementStrategies();
    all.forEach((s) => {
      expect(getOTDementiaEngagementStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTDementiaEngagementStrategyById(null as any);
      getAllOTDementiaEngagementStrategies();
      getOTDementiaEngagementStrategiesByCategory("test");
      searchOTDementiaEngagementStrategies("test");
      getOTDementiaEngagementStrategiesByEvidenceLevel(1);
      getDementiaStages();
      validateDementiaEngagementStrategy("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTDementiaEngagementStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.dementiaStages).toBeDefined();
      expect(s.occupationalGoals).toBeDefined();
      expect(s.engagementStrategies).toBeDefined();
      expect(s.adaptiveApproaches).toBeDefined();
      expect(s.environmentalModifications).toBeDefined();
      expect(s.caregiverStrategies).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTDementiaEngagementStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTDementiaEngagementStrategies();
    all.forEach((s) => {
      expect(s.dementiaStages.length).toBeGreaterThan(0);
      expect(s.occupationalGoals.length).toBeGreaterThan(0);
      expect(s.engagementStrategies.length).toBeGreaterThan(0);
      expect(s.adaptiveApproaches.length).toBeGreaterThan(0);
      expect(s.environmentalModifications.length).toBeGreaterThan(0);
      expect(s.caregiverStrategies.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTDementiaEngagementStrategies();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
