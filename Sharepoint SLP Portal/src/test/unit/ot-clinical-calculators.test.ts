/**
 * OT Clinical Calculators Tests
 */

import { describe, it, expect } from "vitest";
import {
  getCalculatorById,
  getAllCalculators,
  getCalculatorsByCategory,
  searchCalculators,
  calculateResult,
  getCalculatorCategories,
} from "../../data/ot-clinical-calculators";

describe("OT Clinical Calculators", () => {
  it("should have 5 calculators", () => {
    expect(getAllCalculators().length).toBe(5);
  });

  it("should return calculator by ID", () => {
    const calc = getCalculatorById("ot-calc-001");
    expect(calc?.name).toContain("ADL");
  });

  it("should return undefined for invalid ID", () => {
    expect(getCalculatorById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const calcs = getCalculatorsByCategory("Functional Independence");
    expect(calcs.length).toBeGreaterThan(0);
  });

  it("should search calculators", () => {
    const results = searchCalculators("independence");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should return categories", () => {
    const categories = getCalculatorCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should calculate ADL independence score", () => {
    const result = calculateResult("ot-calc-001", {
      "Self-care score (0-10)": 8,
      "Mobility score (0-10)": 7,
      "Communication score (0-10)": 9,
      "Cognition score (0-10)": 8,
    });
    expect(result).toBeDefined();
    expect(result?.result).toBeGreaterThan(0);
    expect(result?.resultUnit).toBe("points");
  });

  it("should calculate occupational participation index", () => {
    const result = calculateResult("ot-calc-002", {
      "Work/productivity (0-10)": 7,
      "Self-care (0-10)": 6,
      "Leisure (0-10)": 8,
      "Social participation (0-10)": 9,
    });
    expect(result).toBeDefined();
    expect(result?.result).toBeGreaterThan(0);
    expect(result?.resultUnit).toBe("points");
  });

  it("should calculate work capacity percentage", () => {
    const result = calculateResult("ot-calc-003", {
      "Functional capacity (0-100)": 75,
      "Job demand level (1-5)": 3,
      "Endurance (0-10)": 7,
      "Safety awareness (0-10)": 8,
    });
    expect(result).toBeDefined();
    expect(result?.result).toBeGreaterThanOrEqual(0);
    expect(result?.result).toBeLessThanOrEqual(100);
    expect(result?.resultUnit).toBe("%");
  });

  it("should calculate cognitive functional level", () => {
    const result = calculateResult("ot-calc-004", {
      "Attention (0-10)": 7,
      "Memory (0-10)": 6,
      "Executive function (0-10)": 7,
      "Processing speed (0-10)": 6,
    });
    expect(result).toBeDefined();
    expect(result?.result).toBeGreaterThan(0);
    expect(result?.resultUnit).toBe("points");
  });

  it("should calculate community integration score", () => {
    const result = calculateResult("ot-calc-005", {
      "Community access (0-10)": 8,
      "Social participation (0-10)": 7,
      "Role participation (0-10)": 6,
      "Independence level (0-10)": 7,
    });
    expect(result).toBeDefined();
    expect(result?.result).toBeGreaterThan(0);
    expect(result?.resultUnit).toBe("points");
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
    const result = calculateResult("ot-calc-001", {
      "Self-care score (0-10)": 8,
      "Mobility score (0-10)": 7,
      "Communication score (0-10)": 9,
      "Cognition score (0-10)": 8,
    });
    expect(result?.recommendations).toBeDefined();
    expect(result?.recommendations.length).toBeGreaterThan(0);
  });

  it("should interpret results correctly", () => {
    const result = calculateResult("ot-calc-003", {
      "Functional capacity (0-100)": 75,
      "Job demand level (1-5)": 3,
      "Endurance (0-10)": 7,
      "Safety awareness (0-10)": 8,
    });
    expect(result?.interpretation).toBeDefined();
    expect(result?.interpretation.length).toBeGreaterThan(0);
  });

  it("should handle edge cases", () => {
    const result1 = calculateResult("ot-calc-001", {
      "Self-care score (0-10)": 0,
      "Mobility score (0-10)": 10,
      "Communication score (0-10)": 5,
      "Cognition score (0-10)": 10,
    });
    expect(result1).toBeDefined();

    const result2 = calculateResult("ot-calc-003", {
      "Functional capacity (0-100)": 100,
      "Job demand level (1-5)": 1,
      "Endurance (0-10)": 10,
      "Safety awareness (0-10)": 10,
    });
    expect(result2).toBeDefined();
  });
});
