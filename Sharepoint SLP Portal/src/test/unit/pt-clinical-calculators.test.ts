/**
 * PT Clinical Calculators Tests
 */

import { describe, it, expect } from "vitest";
import {
  getCalculatorById,
  getAllCalculators,
  getCalculatorsByCategory,
  searchCalculators,
  calculateResult,
  getCalculatorCategories,
} from "../../data/pt-clinical-calculators";

describe("PT Clinical Calculators", () => {
  it("should have 5 calculators", () => {
    expect(getAllCalculators().length).toBe(5);
  });

  it("should return calculator by ID", () => {
    const calc = getCalculatorById("pt-calc-001");
    expect(calc?.name).toContain("Lifting");
  });

  it("should return undefined for invalid ID", () => {
    expect(getCalculatorById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const calcs = getCalculatorsByCategory("Work Capacity");
    expect(calcs.length).toBeGreaterThan(0);
  });

  it("should search calculators", () => {
    const results = searchCalculators("capacity");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should return categories", () => {
    const categories = getCalculatorCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should calculate lifting capacity", () => {
    const result = calculateResult("pt-calc-001", {
      "Weight (lbs)": 50,
      "Distance from body (inches)": 12,
      "Frequency (lifts/hour)": 5,
      "Height of lift (inches)": 30,
    });
    expect(result).toBeDefined();
    expect(result?.result).toBeGreaterThan(0);
    expect(result?.resultUnit).toBe("lbs");
  });

  it("should calculate endurance", () => {
    const result = calculateResult("pt-calc-002", {
      "Current activity duration (minutes)": 30,
      "Heart rate response (bpm)": 100,
      "Perceived exertion (1-10)": 5,
      "Recovery time (minutes)": 10,
    });
    expect(result).toBeDefined();
    expect(result?.result).toBeGreaterThan(0);
    expect(result?.resultUnit).toBe("minutes");
  });

  it("should calculate fall risk", () => {
    const result = calculateResult("pt-calc-003", {
      "Age (years)": 70,
      "Balance score (0-28)": 20,
      "Gait speed (m/s)": 0.8,
      "Number of medications": 5,
    });
    expect(result).toBeDefined();
    expect(result?.result).toBeGreaterThan(0);
    expect(result?.resultUnit).toBe("points");
  });

  it("should calculate return-to-work probability", () => {
    const result = calculateResult("pt-calc-004", {
      "Functional capacity (% of baseline)": 70,
      "Job demand level (1-5)": 3,
      "Time since injury (weeks)": 8,
      "Psychological readiness (1-10)": 7,
    });
    expect(result).toBeDefined();
    expect(result?.result).toBeGreaterThanOrEqual(0);
    expect(result?.result).toBeLessThanOrEqual(100);
    expect(result?.resultUnit).toBe("%");
  });

  it("should calculate gait speed", () => {
    const result = calculateResult("pt-calc-005", {
      "Current gait speed (m/s)": 0.6,
      "Weeks of therapy": 8,
      "Therapy intensity (hours/week)": 3,
      "Age (years)": 65,
    });
    expect(result).toBeDefined();
    expect(result?.result).toBeGreaterThan(0);
    expect(result?.resultUnit).toBe("m/s");
  });

  it("should have all required calculator properties", () => {
    const calcs = getAllCalculators();
    calcs.forEach((c) => {
      expect(c.id).toBeDefined();
      expect(c.name).toBeDefined();
      expect(c.category).toBeDefined();
      expect(c.description).toBeDefined();
      expect(c.inputs).toBeDefined();
      expect(c.formula).toBeDefined();
      expect(c.resultUnit).toBeDefined();
      expect(c.interpretationRanges).toBeDefined();
      expect(c.recommendations).toBeDefined();
      expect(c.evidenceLevel).toBeDefined();
      expect(c.source).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const calcs = getAllCalculators();
    calcs.forEach((c) => {
      expect([1, 2, 3]).toContain(c.evidenceLevel);
    });
  });

  it("should have valid input ranges", () => {
    const calcs = getAllCalculators();
    calcs.forEach((c) => {
      c.inputs.forEach((input) => {
        expect(input.min).toBeLessThanOrEqual(input.max);
        expect(input.default).toBeGreaterThanOrEqual(input.min);
        expect(input.default).toBeLessThanOrEqual(input.max);
      });
    });
  });

  it("should have interpretation ranges", () => {
    const calcs = getAllCalculators();
    calcs.forEach((c) => {
      expect(c.interpretationRanges.length).toBeGreaterThan(0);
      c.interpretationRanges.forEach((range) => {
        expect(range.min).toBeLessThanOrEqual(range.max);
        expect(range.interpretation).toBeDefined();
      });
    });
  });

  it("should have recommendations", () => {
    const calcs = getAllCalculators();
    calcs.forEach((c) => {
      expect(c.recommendations.length).toBeGreaterThan(0);
      c.recommendations.forEach((rec) => {
        expect(rec.length).toBeGreaterThan(0);
      });
    });
  });

  it("should have formulas", () => {
    const calcs = getAllCalculators();
    calcs.forEach((c) => {
      expect(c.formula.length).toBeGreaterThan(0);
    });
  });

  it("should handle null input gracefully", () => {
    expect(() => {
      getCalculatorById(null as any);
      getCalculatorsByCategory(null as any);
      searchCalculators(null as any);
    }).not.toThrow();
  });

  it("should return valid calculation results", () => {
    const calcs = getAllCalculators();
    calcs.forEach((c) => {
      const inputValues: Record<string, number> = {};
      c.inputs.forEach((input) => {
        inputValues[input.name] = input.default;
      });
      const result = calculateResult(c.id, inputValues);
      expect(result).toBeDefined();
      expect(result?.calculatorId).toBe(c.id);
      expect(result?.result).toBeDefined();
      expect(result?.interpretation).toBeDefined();
      expect(result?.recommendations.length).toBeGreaterThan(0);
    });
  });

  it("should have unique calculator IDs", () => {
    const calcs = getAllCalculators();
    const ids = calcs.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have DOI citations", () => {
    const calcs = getAllCalculators();
    calcs.forEach((c) => {
      if (c.doi) {
        expect(c.doi).toMatch(/^10\./);
      }
    });
  });

  it("should have valid dates", () => {
    const calcs = getAllCalculators();
    calcs.forEach((c) => {
      expect(c.lastUpdated instanceof Date).toBe(true);
      expect(c.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });

  it("should provide clinical recommendations", () => {
    const result = calculateResult("pt-calc-001", {
      "Weight (lbs)": 50,
      "Distance from body (inches)": 12,
      "Frequency (lifts/hour)": 5,
      "Height of lift (inches)": 30,
    });
    expect(result?.recommendations).toBeDefined();
    expect(result?.recommendations.length).toBeGreaterThan(0);
  });

  it("should interpret results correctly", () => {
    const result = calculateResult("pt-calc-003", {
      "Age (years)": 70,
      "Balance score (0-28)": 20,
      "Gait speed (m/s)": 0.8,
      "Number of medications": 5,
    });
    expect(result?.interpretation).toBeDefined();
    expect(result?.interpretation.length).toBeGreaterThan(0);
  });

  it("should handle edge cases", () => {
    const result1 = calculateResult("pt-calc-001", {
      "Weight (lbs)": 0,
      "Distance from body (inches)": 36,
      "Frequency (lifts/hour)": 60,
      "Height of lift (inches)": 60,
    });
    expect(result1).toBeDefined();

    const result2 = calculateResult("pt-calc-004", {
      "Functional capacity (% of baseline)": 100,
      "Job demand level (1-5)": 1,
      "Time since injury (weeks)": 0,
      "Psychological readiness (1-10)": 10,
    });
    expect(result2).toBeDefined();
  });
});
