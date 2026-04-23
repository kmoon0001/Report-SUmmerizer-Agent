/**
 * OT Positioning & Pressure Relief Data Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTPositioningStrategyById,
  getAllOTPositioningStrategies,
  getOTPositioningStrategiesByCategory,
  searchOTPositioningStrategies,
  getOTPositioningStrategiesByEvidenceLevel,
  getPositioningEquipmentList,
  validatePositioningStrategy,
} from "../../data/ot-positioning-pressure-relief-data";

describe("OT Positioning & Pressure Relief Data", () => {
  it("should have 5 positioning strategies", () => {
    expect(getAllOTPositioningStrategies().length).toBe(5);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTPositioningStrategyById("ot-pos-001");
    expect(strategy?.name).toContain("Supine");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTPositioningStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTPositioningStrategiesByCategory("Bed");
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should search strategies", () => {
    const results = searchOTPositioningStrategies("Positioning");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTPositioningStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return positioning equipment list", () => {
    const equipment = getPositioningEquipmentList();
    expect(Array.isArray(equipment)).toBe(true);
    expect(equipment.length).toBeGreaterThan(0);
  });

  it("should validate positioning strategy", () => {
    const result = validatePositioningStrategy("ot-pos-001", "Head support");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid technique", () => {
    const result = validatePositioningStrategy(
      "ot-pos-001",
      "Invalid technique",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTPositioningStrategies();
    all.forEach((s) => {
      expect(getOTPositioningStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTPositioningStrategyById(null as any);
      getAllOTPositioningStrategies();
      getOTPositioningStrategiesByCategory("test");
      searchOTPositioningStrategies("test");
      getOTPositioningStrategiesByEvidenceLevel(1);
      getPositioningEquipmentList();
      validatePositioningStrategy("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTPositioningStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.occupationalGoals).toBeDefined();
      expect(s.positioningTechniques).toBeDefined();
      expect(s.supportingEquipment).toBeDefined();
      expect(s.pressureRelievingStrategies).toBeDefined();
      expect(s.skinMonitoringGuidelines).toBeDefined();
      expect(s.contraindications).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTPositioningStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTPositioningStrategies();
    all.forEach((s) => {
      expect(s.occupationalGoals.length).toBeGreaterThan(0);
      expect(s.positioningTechniques.length).toBeGreaterThan(0);
      expect(s.supportingEquipment.length).toBeGreaterThan(0);
      expect(s.pressureRelievingStrategies.length).toBeGreaterThan(0);
      expect(s.skinMonitoringGuidelines.length).toBeGreaterThan(0);
      expect(s.contraindications.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTPositioningStrategies();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
