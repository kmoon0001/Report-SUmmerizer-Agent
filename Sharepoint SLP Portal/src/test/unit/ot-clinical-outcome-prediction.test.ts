/**
 * OT Clinical Outcome Prediction Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOutcomePredictorById,
  getAllOutcomePredictors,
  getOutcomePredictorsByCategory,
  searchOutcomePredictors,
  getOutcomePredictorsByEvidenceLevel,
  getConditionCategories,
  predictFunctionalOutcome,
} from "../../data/ot-clinical-outcome-prediction";

describe("OT Clinical Outcome Prediction", () => {
  it("should have 5 outcome predictors", () => {
    expect(getAllOutcomePredictors().length).toBe(5);
  });

  it("should return predictor by ID", () => {
    const predictor = getOutcomePredictorById("ot-op-001");
    expect(predictor?.condition).toContain("Occupational Performance");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOutcomePredictorById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const predictors = getOutcomePredictorsByCategory("Neurological");
    expect(predictors.length).toBeGreaterThan(0);
  });

  it("should search predictors", () => {
    const results = searchOutcomePredictors("recovery");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const predictors = getOutcomePredictorsByEvidenceLevel(1);
    expect(predictors.length).toBeGreaterThan(0);
  });

  it("should return condition categories", () => {
    const categories = getConditionCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should predict functional outcome", () => {
    const prediction = predictFunctionalOutcome("ot-op-001", [
      "COPM >5 at admission",
      "Normal cognition",
    ]);
    expect(prediction.prediction).toBeDefined();
    expect(prediction.confidence).toBeDefined();
    expect(Array.isArray(prediction.recommendations)).toBe(true);
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOutcomePredictorById(null as any);
      getAllOutcomePredictors();
      getOutcomePredictorsByCategory("test");
      searchOutcomePredictors("test");
      getOutcomePredictorsByEvidenceLevel(1);
      getConditionCategories();
      predictFunctionalOutcome("test", ["test"]);
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOutcomePredictors();
    all.forEach((p) => {
      expect(p.id).toBeDefined();
      expect(p.condition).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.description).toBeDefined();
      expect(p.prognosticIndicators).toBeDefined();
      expect(p.recoveryTimeline).toBeDefined();
      expect(p.functionalOutcomePredictor).toBeDefined();
      expect(p.riskFactorsForPoorOutcome).toBeDefined();
      expect(p.interventionModifiersForOutcome).toBeDefined();
      expect(p.evidenceLevel).toBeDefined();
      expect(p.source).toBeDefined();
      expect(p.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOutcomePredictors();
    all.forEach((p) => {
      expect([1, 2, 3]).toContain(p.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOutcomePredictors();
    all.forEach((p) => {
      expect(p.prognosticIndicators.length).toBeGreaterThan(0);
      expect(p.recoveryTimeline.length).toBeGreaterThan(0);
      expect(p.functionalOutcomePredictor.length).toBeGreaterThan(0);
      expect(p.riskFactorsForPoorOutcome.length).toBeGreaterThan(0);
      expect(p.interventionModifiersForOutcome.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOutcomePredictors();
    all.forEach((p) => {
      expect(p.lastUpdated instanceof Date).toBe(true);
      expect(p.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });

  it("should have prognostic indicators with required properties", () => {
    const all = getAllOutcomePredictors();
    all.forEach((p) => {
      p.prognosticIndicators.forEach((pi) => {
        expect(pi.name).toBeDefined();
        expect(pi.description).toBeDefined();
        expect(pi.category).toBeDefined();
        expect(pi.favorableFactors).toBeDefined();
        expect(pi.unfavorableFactors).toBeDefined();
        expect(pi.evidenceLevel).toBeDefined();
        expect(pi.predictiveValue).toBeDefined();
      });
    });
  });

  it("should have recovery timelines with required properties", () => {
    const all = getAllOutcomePredictors();
    all.forEach((p) => {
      p.recoveryTimeline.forEach((rt) => {
        expect(rt.phase).toBeDefined();
        expect(rt.timeframe).toBeDefined();
        expect(rt.expectedOutcomes).toBeDefined();
        expect(rt.interventionFocus).toBeDefined();
      });
    });
  });
});
