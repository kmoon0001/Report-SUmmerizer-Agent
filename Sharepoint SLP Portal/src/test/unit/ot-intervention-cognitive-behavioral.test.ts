/**
 * OT Intervention - Cognitive & Behavioral Strategies Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTCognitiveBehavioralStrategyById,
  getAllOTCognitiveBehavioralStrategies,
  getOTCognitiveBehavioralStrategiesByCategory,
  searchOTCognitiveBehavioralStrategies,
  getOTCognitiveBehavioralStrategiesByEvidenceLevel,
  getOTCognitiveBehavioralComponents,
  validateOTCognitiveBehavioralApproach,
} from "../../data/ot-intervention-cognitive-behavioral";

describe("OT Intervention - Cognitive & Behavioral Strategies", () => {
  it("should have 15 strategies", () => {
    expect(getAllOTCognitiveBehavioralStrategies().length).toBe(15);
  });

  it("should return strategy by ID", () => {
    const strategy = getOTCognitiveBehavioralStrategyById("strat-ot-cb-001");
    expect(strategy?.name).toBe("Cognitive Retraining");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTCognitiveBehavioralStrategyById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const strategies =
      getOTCognitiveBehavioralStrategiesByCategory("Cognitive");
    expect(strategies.length).toBe(15);
  });

  it("should search strategies", () => {
    const results = searchOTCognitiveBehavioralStrategies("Therapy");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const strategies = getOTCognitiveBehavioralStrategiesByEvidenceLevel(1);
    expect(strategies.length).toBeGreaterThan(0);
  });

  it("should return components", () => {
    const components = getOTCognitiveBehavioralComponents();
    expect(Array.isArray(components)).toBe(true);
    expect(components.length).toBeGreaterThan(0);
  });

  it("should validate implementation approaches", () => {
    const result = validateOTCognitiveBehavioralApproach(
      "strat-ot-cb-001",
      "Computerized training",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid approaches", () => {
    const result = validateOTCognitiveBehavioralApproach(
      "strat-ot-cb-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTCognitiveBehavioralStrategies();
    all.forEach((s) => {
      expect(getOTCognitiveBehavioralStrategyById(s.id)).toEqual(s);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTCognitiveBehavioralStrategyById(null as any);
      getAllOTCognitiveBehavioralStrategies();
      getOTCognitiveBehavioralStrategiesByCategory("test");
      searchOTCognitiveBehavioralStrategies("test");
      getOTCognitiveBehavioralStrategiesByEvidenceLevel(1);
      getOTCognitiveBehavioralComponents();
      validateOTCognitiveBehavioralApproach("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTCognitiveBehavioralStrategies();
    all.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.components).toBeDefined();
      expect(s.indications).toBeDefined();
      expect(s.contraindications).toBeDefined();
      expect(s.implementationApproaches).toBeDefined();
      expect(s.evidenceLevel).toBeDefined();
      expect(s.source).toBeDefined();
      expect(s.citation).toBeDefined();
      expect(s.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTCognitiveBehavioralStrategies();
    all.forEach((s) => {
      expect([1, 2, 3]).toContain(s.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTCognitiveBehavioralStrategies();
    all.forEach((s) => {
      expect(s.components.length).toBeGreaterThan(0);
      expect(s.indications.length).toBeGreaterThan(0);
      expect(s.contraindications.length).toBeGreaterThan(0);
      expect(s.implementationApproaches.length).toBeGreaterThan(0);
    });
  });
});
