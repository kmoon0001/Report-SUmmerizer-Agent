/**
 * OT Intervention - Splinting & Orthotics Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTSplintingOrthoticsStrategyById,
  getAllOTSplintingOrthoticsStrategies,
  getOTSplintingOrthoticsStrategiesByCategory,
  searchOTSplintingOrthoticsStrategies,
  getOTSplintingOrthoticsStrategiesByEvidenceLevel,
  getOTSplintingOrthoticsTypes,
  validateOTSplintingOrthoticsFabrication,
} from "../../data/ot-intervention-splinting-orthotics";

describe("OT Intervention - Splinting & Orthotics", () => {
  it("should have 15 strategies", () => {
    expect(getAllOTSplintingOrthoticsStrategies().length).toBe(15);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTSplintingOrthoticsStrategyById("strat-ot-so-001");
    expect(strategy?.name).toBe("Hand Splinting");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTSplintingOrthoticsStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies = getOTSplintingOrthoticsStrategiesByCategory("Splinting");
    expect(strategies.length).toBe(15);
  });

  it("should search strategies", () => {
    const results = searchOTSplintingOrthoticsStrategies("Hand");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTSplintingOrthoticsStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return types", () => {
    const types = getOTSplintingOrthoticsTypes();
    expect(Array.isArray(types)).toBe(true);
    expect(types.length).toBeGreaterThan(0);
  });

  it("should validate fabrication considerations", () => {
    const result = validateOTSplintingOrthoticsFabrication(
      "strat-ot-so-001",
      "Material selection",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid considerations", () => {
    const result = validateOTSplintingOrthoticsFabrication(
      "strat-ot-so-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTSplintingOrthoticsStrategies();
    all.forEach((s) => {
      expect(getOTSplintingOrthoticsStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTSplintingOrthoticsStrategyById(null as any);
      getAllOTSplintingOrthoticsStrategies();
      getOTSplintingOrthoticsStrategiesByCategory("test");
      searchOTSplintingOrthoticsStrategies("test");
      getOTSplintingOrthoticsStrategiesByEvidenceLevel(1);
      getOTSplintingOrthoticsTypes();
      validateOTSplintingOrthoticsFabrication("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTSplintingOrthoticsStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.types).toBeDefined();
      expect(s.indications).toBeDefined();
      expect(s.contraindications).toBeDefined();
      expect(s.fabricationConsiderations).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.citation).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTSplintingOrthoticsStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTSplintingOrthoticsStrategies();
    all.forEach((s) => {
      expect(s.types.length).toBeGreaterThan(0);
      expect(s.indications.length).toBeGreaterThan(0);
      expect(s.contraindications.length).toBeGreaterThan(0);
      expect(s.fabricationConsiderations.length).toBeGreaterThan(0);
    });
  });
});
