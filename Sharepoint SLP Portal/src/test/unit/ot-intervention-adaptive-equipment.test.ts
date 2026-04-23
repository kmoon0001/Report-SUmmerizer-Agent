/**
 * OT Intervention - Adaptive Equipment & Assistive Technology Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTAdaptiveEquipmentStrategyById,
  getAllOTAdaptiveEquipmentStrategies,
  getOTAdaptiveEquipmentStrategiesByCategory,
  searchOTAdaptiveEquipmentStrategies,
  getOTAdaptiveEquipmentStrategiesByEvidenceLevel,
  getOTAdaptiveEquipmentApplications,
  validateOTAdaptiveEquipmentTraining,
} from "../../data/ot-intervention-adaptive-equipment";

describe("OT Intervention - Adaptive Equipment & Assistive Technology", () => {
  it("should have 15 strategies", () => {
    expect(getAllOTAdaptiveEquipmentStrategies().length).toBe(15);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTAdaptiveEquipmentStrategyById("strat-ot-ae-001");
    expect(strategy?.name).toBe("Mobility Aids");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTAdaptiveEquipmentStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTAdaptiveEquipmentStrategiesByCategory("Adaptive");
    expect(strategies.length).toBe(15);
  });

  it("should search strategies", () => {
    const results = searchOTAdaptiveEquipmentStrategies("Communication");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTAdaptiveEquipmentStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return applications", () => {
    const applications = getOTAdaptiveEquipmentApplications();
    expect(Array.isArray(applications)).toBe(true);
    expect(applications.length).toBeGreaterThan(0);
  });

  it("should validate training requirements", () => {
    const result = validateOTAdaptiveEquipmentTraining(
      "strat-ot-ae-001",
      "Proper use",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid training", () => {
    const result = validateOTAdaptiveEquipmentTraining(
      "strat-ot-ae-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTAdaptiveEquipmentStrategies();
    all.forEach((s) => {
      expect(getOTAdaptiveEquipmentStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTAdaptiveEquipmentStrategyById(null as any);
      getAllOTAdaptiveEquipmentStrategies();
      getOTAdaptiveEquipmentStrategiesByCategory("test");
      searchOTAdaptiveEquipmentStrategies("test");
      getOTAdaptiveEquipmentStrategiesByEvidenceLevel(1);
      getOTAdaptiveEquipmentApplications();
      validateOTAdaptiveEquipmentTraining("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTAdaptiveEquipmentStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.applications).toBeDefined();
      expect(s.indications).toBeDefined();
      expect(s.contraindications).toBeDefined();
      expect(s.trainingRequired).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.citation).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTAdaptiveEquipmentStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTAdaptiveEquipmentStrategies();
    all.forEach((s) => {
      expect(s.applications.length).toBeGreaterThan(0);
      expect(s.indications.length).toBeGreaterThan(0);
      expect(s.contraindications.length).toBeGreaterThan(0);
      expect(s.trainingRequired.length).toBeGreaterThan(0);
    });
  });
});
