/**
 * PT Clinical Decision Trees Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTDecisionTreeById,
  getAllPTDecisionTrees,
  getPTDecisionTreesByCategory,
  searchPTDecisionTrees,
  getPTDecisionTreesByEvidenceLevel,
  getDecisionPoints,
  validateDecisionPath,
} from "../../data/pt-clinical-decision-trees";

describe("PT Clinical Decision Trees", () => {
  it("should have 5 decision trees", () => {
    expect(getAllPTDecisionTrees().length).toBe(5);
  });

  it("should return tree by ID", () => {
    const tree = getPTDecisionTreeById("pt-dt-001");
    expect(tree?.name).toContain("Neurological");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTDecisionTreeById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const trees = getPTDecisionTreesByCategory("Neurological");
    expect(trees.length).toBeGreaterThan(0);
  });

  it("should search trees", () => {
    const results = searchPTDecisionTrees("Decision");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const trees = getPTDecisionTreesByEvidenceLevel(1);
    expect(trees.length).toBeGreaterThan(0);
  });

  it("should return decision points", () => {
    const points = getDecisionPoints();
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(0);
  });

  it("should validate decision path", () => {
    const result = validateDecisionPath("pt-dt-001", "Acute onset weakness");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid scenario", () => {
    const result = validateDecisionPath("pt-dt-001", "Invalid scenario");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTDecisionTrees();
    all.forEach((t) => {
      expect(getPTDecisionTreeById(t.id)).toEqual(t);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTDecisionTreeById(null as any);
      getAllPTDecisionTrees();
      getPTDecisionTreesByCategory("test");
      searchPTDecisionTrees("test");
      getPTDecisionTreesByEvidenceLevel(1);
      getDecisionPoints();
      validateDecisionPath("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTDecisionTrees();
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
    const all = getAllPTDecisionTrees();
    all.forEach((t) => {
      expect([1, 2, 3]).toContain(t.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTDecisionTrees();
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
    const all = getAllPTDecisionTrees();
    all.forEach((t) => {
      expect(t.lastUpdated instanceof Date).toBe(true);
      expect(t.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
