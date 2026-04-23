/**
 * OT Intervention - Compensatory & Environmental Strategies Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTCompensatoryEnvironmentalStrategyById,
  getAllOTCompensatoryEnvironmentalStrategies,
  getOTCompensatoryEnvironmentalStrategiesByCategory,
  searchOTCompensatoryEnvironmentalStrategies,
  getOTCompensatoryEnvironmentalStrategiesByEvidenceLevel,
  getOTCompensatoryEnvironmentalTechniques,
  validateOTCompensatoryEnvironmentalImplementation,
} from "../../data/ot-intervention-compensatory-environmental";

describe("OT Intervention - Compensatory & Environmental Strategies", () => {
  it("should have 15 strategies", () => {
    expect(getAllOTCompensatoryEnvironmentalStrategies().length).toBe(15);
  });

  it("should return strategy by ID", () => {
    const strategy =
      getOTCompensatoryEnvironmentalStrategyById("strat-ot-ce-001");
    expect(strategy?.name).toBe("One-Handed Techniques");
  });

  it("should return undefined for invalid ID", () => {
    expect(
      getOTCompensatoryEnvironmentalStrategyById("invalid"),
    ).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies =
      getOTCompensatoryEnvironmentalStrategiesByCategory("Compensatory");
    expect(strategies.length).toBe(15);
  });

  it("should search strategies", () => {
    const results = searchOTCompensatoryEnvironmentalStrategies("Energy");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies =
      getOTCompensatoryEnvironmentalStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return techniques", () => {
    const techniques = getOTCompensatoryEnvironmentalTechniques();
    expect(Array.isArray(techniques)).toBe(true);
    expect(techniques.length).toBeGreaterThan(0);
  });

  it("should validate implementation steps", () => {
    const result = validateOTCompensatoryEnvironmentalImplementation(
      "strat-ot-ce-001",
      "Assess function",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid steps", () => {
    const result = validateOTCompensatoryEnvironmentalImplementation(
      "strat-ot-ce-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTCompensatoryEnvironmentalStrategies();
    all.forEach((s) => {
      expect(getOTCompensatoryEnvironmentalStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTCompensatoryEnvironmentalStrategyById(null as any);
      getAllOTCompensatoryEnvironmentalStrategies();
      getOTCompensatoryEnvironmentalStrategiesByCategory("test");
      searchOTCompensatoryEnvironmentalStrategies("test");
      getOTCompensatoryEnvironmentalStrategiesByEvidenceLevel(1);
      getOTCompensatoryEnvironmentalTechniques();
      validateOTCompensatoryEnvironmentalImplementation("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTCompensatoryEnvironmentalStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.techniques).toBeDefined();
      expect(s.indications).toBeDefined();
      expect(s.contraindications).toBeDefined();
      expect(s.implementationSteps).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.citation).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTCompensatoryEnvironmentalStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTCompensatoryEnvironmentalStrategies();
    all.forEach((s) => {
      expect(s.techniques.length).toBeGreaterThan(0);
      expect(s.indications.length).toBeGreaterThan(0);
      expect(s.contraindications.length).toBeGreaterThan(0);
      expect(s.implementationSteps.length).toBeGreaterThan(0);
    });
  });
});
