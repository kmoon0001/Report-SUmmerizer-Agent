/**
 * OT Sports & Leisure Participation Data Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTSportsLeisureStrategyById,
  getAllOTSportsLeisureStrategies,
  getOTSportsLeisureStrategiesByCategory,
  searchOTSportsLeisureStrategies,
  getOTSportsLeisureStrategiesByEvidenceLevel,
  getAdaptiveEquipmentList,
  validateSportsLeisureStrategy,
} from "../../data/ot-sports-leisure-participation-data";

describe("OT Sports & Leisure Participation Data", () => {
  it("should have 5 sports and leisure strategies", () => {
    expect(getAllOTSportsLeisureStrategies().length).toBe(5);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTSportsLeisureStrategyById("ot-sl-001");
    expect(strategy?.name).toContain("Adaptive Sports");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTSportsLeisureStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTSportsLeisureStrategiesByCategory("Sports");
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should search strategies", () => {
    const results = searchOTSportsLeisureStrategies("Leisure");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTSportsLeisureStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return adaptive equipment list", () => {
    const equipment = getAdaptiveEquipmentList();
    expect(Array.isArray(equipment)).toBe(true);
    expect(equipment.length).toBeGreaterThan(0);
  });

  it("should validate sports leisure strategy", () => {
    const result = validateSportsLeisureStrategy(
      "ot-sl-001",
      "Physical disability",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid population", () => {
    const result = validateSportsLeisureStrategy(
      "ot-sl-001",
      "Invalid population",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTSportsLeisureStrategies();
    all.forEach((s) => {
      expect(getOTSportsLeisureStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTSportsLeisureStrategyById(null as any);
      getAllOTSportsLeisureStrategies();
      getOTSportsLeisureStrategiesByCategory("test");
      searchOTSportsLeisureStrategies("test");
      getOTSportsLeisureStrategiesByEvidenceLevel(1);
      getAdaptiveEquipmentList();
      validateSportsLeisureStrategy("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTSportsLeisureStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.targetPopulations).toBeDefined();
      expect(s.occupationalGoals).toBeDefined();
      expect(s.adaptationStrategies).toBeDefined();
      expect(s.adaptiveEquipment).toBeDefined();
      expect(s.accessibilityConsiderations).toBeDefined();
      expect(s.progressionOptions).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTSportsLeisureStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTSportsLeisureStrategies();
    all.forEach((s) => {
      expect(s.targetPopulations.length).toBeGreaterThan(0);
      expect(s.occupationalGoals.length).toBeGreaterThan(0);
      expect(s.adaptationStrategies.length).toBeGreaterThan(0);
      expect(s.adaptiveEquipment.length).toBeGreaterThan(0);
      expect(s.accessibilityConsiderations.length).toBeGreaterThan(0);
      expect(s.progressionOptions.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTSportsLeisureStrategies();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
