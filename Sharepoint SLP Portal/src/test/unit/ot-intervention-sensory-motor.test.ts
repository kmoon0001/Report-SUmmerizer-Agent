/**
 * OT Intervention - Sensory & Motor Strategies Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTSensoryMotorStrategyById,
  getAllOTSensoryMotorStrategies,
  getOTSensoryMotorStrategiesByCategory,
  searchOTSensoryMotorStrategies,
  getOTSensoryMotorStrategiesByEvidenceLevel,
  getOTSensoryMotorTechniques,
  validateOTSensoryMotorApplication,
} from "../../data/ot-intervention-sensory-motor";

describe("OT Intervention - Sensory & Motor Strategies", () => {
  it("should have 15 strategies", () => {
    expect(getAllOTSensoryMotorStrategies().length).toBe(15);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTSensoryMotorStrategyById("strat-ot-sm-001");
    expect(strategy?.name).toBe("Proprioceptive Input Strategies");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTSensoryMotorStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTSensoryMotorStrategiesByCategory("Sensory");
    expect(strategies.length).toBe(15);
  });

  it("should search strategies", () => {
    const results = searchOTSensoryMotorStrategies("Motor");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTSensoryMotorStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return techniques", () => {
    const techniques = getOTSensoryMotorTechniques();
    expect(Array.isArray(techniques)).toBe(true);
    expect(techniques.length).toBeGreaterThan(0);
  });

  it("should validate application methods", () => {
    const result = validateOTSensoryMotorApplication(
      "strat-ot-sm-001",
      "Structured activities",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid methods", () => {
    const result = validateOTSensoryMotorApplication(
      "strat-ot-sm-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTSensoryMotorStrategies();
    all.forEach((s) => {
      expect(getOTSensoryMotorStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTSensoryMotorStrategyById(null as any);
      getAllOTSensoryMotorStrategies();
      getOTSensoryMotorStrategiesByCategory("test");
      searchOTSensoryMotorStrategies("test");
      getOTSensoryMotorStrategiesByEvidenceLevel(1);
      getOTSensoryMotorTechniques();
      validateOTSensoryMotorApplication("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTSensoryMotorStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.techniques).toBeDefined();
      expect(s.indications).toBeDefined();
      expect(s.contraindications).toBeDefined();
      expect(s.applicationMethods).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.citation).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTSensoryMotorStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTSensoryMotorStrategies();
    all.forEach((s) => {
      expect(s.techniques.length).toBeGreaterThan(0);
      expect(s.indications.length).toBeGreaterThan(0);
      expect(s.contraindications.length).toBeGreaterThan(0);
      expect(s.applicationMethods.length).toBeGreaterThan(0);
    });
  });
});
