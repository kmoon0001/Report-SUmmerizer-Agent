/**
 * OT Clinical Decision Trees Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTDecisionTreeById,
  getAllOTDecisionTrees,
  getOTDecisionTreesByCategory,
  searchOTDecisionTrees,
  getOTDecisionTreesByEvidenceLevel,
  getDecisionPoints,
  validateDecisionPath,
} from "../../data/ot-clinical-decision-trees";

describe("OT Clinical Decision Trees", () => {
  it("should have 5 decision trees", () => {
    expect(getAllOTDecisionTrees().length).toBe(5);
  });

  it("should return tree by ID", () => {
    const tree = getOTDecisionTreeById("ot-dt-001");
    expect(tree?.name).toContain("ADL");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTDecisionTreeById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const trees = getOTDecisionTreesByCategory("Functional");
    expect(trees.length).toBeGreaterThan(0);
  });

  it("should search trees", () => {
    const results = searchOTDecisionTrees("Decision");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const trees = getOTDecisionTreesByEvidenceLevel(1);
    expect(trees.length).toBeGreaterThan(0);
  });

  it("should return decision points", () => {
    const points = getDecisionPoints();
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(0);
  });

  it("should validate decision path", () => {
    const result = validateDecisionPath("ot-dt-001", "Mild ADL dependence");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid scenario", () => {
    const result = validateDecisionPath("ot-dt-001", "Invalid scenario");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTDecisionTrees();
    all.forEach((t) => {
      expect(getOTDecisionTreeById(t.id)).toEqual(t);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTDecisionTreeById(null as any);
      getAllOTDecisionTrees();
      getOTDecisionTreesByCategory("test");
      searchOTDecisionTrees("test");
      getOTDecisionTreesByEvidenceLevel(1);
      getDecisionPoints();
      validateDecisionPath("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTDecisionTrees();
    all.forEach((t) => {
      expect(t.id).toBeDefined();
      expect(t.name).toBeDefined();
      expect(t.category).toBeDefined();
      expect(t.description).toBeDefined();
      expect(t.clinicalScenario).toBeDefined();
      expect(t.decisionPoints).toBeDefined();
      expect(t.diagnosticConsiderations).toBeDefined();
      expect(t.interventionOptions).toBeDefined();
      expect(t.outcomeIndicators).toBeDefined();
      expect(t.redFlags).toBeDefined();
      expect(t.evidenceLevel).toBeDefined();
      expect(t.source).toBeDefined();
      expect(t.citation).toBeDefined();
      expect(t.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTDecisionTrees();
    all.forEach((t) => {
      expect([1, 2, 3]).toContain(t.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTDecisionTrees();
    all.forEach((t) => {
      expect(t.clinicalScenario.length).toBeGreaterThan(0);
      expect(t.decisionPoints.length).toBeGreaterThan(0);
      expect(t.diagnosticConsiderations.length).toBeGreaterThan(0);
      expect(t.interventionOptions.length).toBeGreaterThan(0);
      expect(t.outcomeIndicators.length).toBeGreaterThan(0);
      expect(t.redFlags.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTDecisionTrees();
    all.forEach((t) => {
      expect(t.lastUpdated instanceof Date).toBe(true);
      expect(t.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
