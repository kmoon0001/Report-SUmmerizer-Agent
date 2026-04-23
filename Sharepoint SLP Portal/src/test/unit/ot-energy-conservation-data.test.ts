/**
 * OT Energy Conservation Data Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTEnergyConservationStrategyById,
  getAllOTEnergyConservationStrategies,
  getOTEnergyConservationStrategiesByCategory,
  searchOTEnergyConservationStrategies,
  getOTEnergyConservationStrategiesByEvidenceLevel,
  getEnergyConservationPrinciples,
  validateEnergyConservationStrategy,
} from "../../data/ot-energy-conservation-data";

describe("OT Energy Conservation Data", () => {
  it("should have 5 energy conservation strategies", () => {
    expect(getAllOTEnergyConservationStrategies().length).toBe(5);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTEnergyConservationStrategyById("ot-ec-001");
    expect(strategy?.name).toContain("Pacing");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTEnergyConservationStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTEnergyConservationStrategiesByCategory("Fatigue");
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should search strategies", () => {
    const results = searchOTEnergyConservationStrategies("Energy");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTEnergyConservationStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return energy conservation principles", () => {
    const principles = getEnergyConservationPrinciples();
    expect(Array.isArray(principles)).toBe(true);
    expect(principles.length).toBeGreaterThan(0);
  });

  it("should validate energy conservation strategy", () => {
    const result = validateEnergyConservationStrategy(
      "ot-ec-001",
      "Cancer-related fatigue",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid condition", () => {
    const result = validateEnergyConservationStrategy(
      "ot-ec-001",
      "Invalid condition",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTEnergyConservationStrategies();
    all.forEach((s) => {
      expect(getOTEnergyConservationStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTEnergyConservationStrategyById(null as any);
      getAllOTEnergyConservationStrategies();
      getOTEnergyConservationStrategiesByCategory("test");
      searchOTEnergyConservationStrategies("test");
      getOTEnergyConservationStrategiesByEvidenceLevel(1);
      getEnergyConservationPrinciples();
      validateEnergyConservationStrategy("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTEnergyConservationStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.targetConditions).toBeDefined();
      expect(s.conservationPrinciples).toBeDefined();
      expect(s.practicalStrategies).toBeDefined();
      expect(s.adaptiveEquipment).toBeDefined();
      expect(s.environmentalModifications).toBeDefined();
      expect(s.occupationalApplications).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTEnergyConservationStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTEnergyConservationStrategies();
    all.forEach((s) => {
      expect(s.targetConditions.length).toBeGreaterThan(0);
      expect(s.conservationPrinciples.length).toBeGreaterThan(0);
      expect(s.practicalStrategies.length).toBeGreaterThan(0);
      expect(s.adaptiveEquipment.length).toBeGreaterThan(0);
      expect(s.environmentalModifications.length).toBeGreaterThan(0);
      expect(s.occupationalApplications.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTEnergyConservationStrategies();
    all.forEach((s) => {
      expect(s.lastUpdated instanceof Date).toBe(true);
      expect(s.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
