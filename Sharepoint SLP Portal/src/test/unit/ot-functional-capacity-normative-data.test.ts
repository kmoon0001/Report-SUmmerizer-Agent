/**
 * OT Functional Capacity & Normative Data Tests
 */

import { describe, it, expect } from "vitest";
import {
  getNormativeDatasetById,
  getAllNormativeDatasets,
  getNormativeDatasetsByCategory,
  searchNormativeDatasets,
  getNormativeCategories,
  compareToNorm,
} from "../../data/ot-functional-capacity-normative-data";

describe("OT Functional Capacity & Normative Data", () => {
  it("should have 5 normative datasets", () => {
    expect(getAllNormativeDatasets().length).toBe(5);
  });

  it("should return dataset by ID", () => {
    const dataset = getNormativeDatasetById("ot-norm-001");
    expect(dataset?.name).toContain("ADL");
  });

  it("should return undefined for invalid ID", () => {
    expect(getNormativeDatasetById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const datasets = getNormativeDatasetsByCategory(
      "Activities of Daily Living",
    );
    expect(datasets.length).toBeGreaterThan(0);
  });

  it("should search datasets", () => {
    const results = searchNormativeDatasets("motor");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should return categories", () => {
    const categories = getNormativeCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should compare ADL performance to norm", () => {
    const result = compareToNorm({
      datasetId: "ot-norm-001",
      ageGroup: "20-30",
      sex: "M",
      value: 16,
    });
    expect(result).toBeDefined();
    expect(result?.percentile).toBeGreaterThan(0);
    expect(result?.interpretation).toBeDefined();
  });

  it("should compare fine motor to norm", () => {
    const result = compareToNorm({
      datasetId: "ot-norm-002",
      ageGroup: "60-70",
      sex: "M",
      value: 12,
    });
    expect(result).toBeDefined();
    expect(result?.comparisonToNorm).toBeDefined();
  });

  it("should compare cognitive performance to norm", () => {
    const result = compareToNorm({
      datasetId: "ot-norm-003",
      ageGroup: "70-80",
      sex: "M",
      value: 24,
    });
    expect(result).toBeDefined();
    expect(result?.value).toBe(24);
  });

  it("should compare occupational performance to norm", () => {
    const result = compareToNorm({
      datasetId: "ot-norm-004",
      ageGroup: "40-50",
      sex: "M",
      value: 7,
    });
    expect(result).toBeDefined();
    expect(result?.interpretation).toBeDefined();
  });

  it("should compare work capacity to norm", () => {
    const result = compareToNorm({
      datasetId: "ot-norm-005",
      ageGroup: "60-70",
      sex: "M",
      value: 80,
    });
    expect(result).toBeDefined();
    expect(result?.recommendations.length).toBeGreaterThan(0);
  });

  it("should have all required dataset properties", () => {
    const datasets = getAllNormativeDatasets();
    datasets.forEach((d) => {
      expect(d.id).toBeDefined();
      expect(d.name).toBeDefined();
      expect(d.category).toBeDefined();
      expect(d.description).toBeDefined();
      expect(d.testName).toBeDefined();
      expect(d.normativeValues).toBeDefined();
      expect(d.functionalThresholds).toBeDefined();
      expect(d.clinicalApplications).toBeDefined();
      expect(d.evidenceLevel).toBeDefined();
      expect(d.source).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const datasets = getAllNormativeDatasets();
    datasets.forEach((d) => {
      expect([1, 2, 3]).toContain(d.evidenceLevel);
    });
  });

  it("should have normative values", () => {
    const datasets = getAllNormativeDatasets();
    datasets.forEach((d) => {
      expect(d.normativeValues.length).toBeGreaterThan(0);
      d.normativeValues.forEach((v) => {
        expect(v.ageGroup).toBeDefined();
        expect(v.sex).toBeDefined();
        expect(v.value).toBeGreaterThan(0);
        expect(v.unit).toBeDefined();
        expect(v.percentile).toBeGreaterThanOrEqual(0);
        expect(v.percentile).toBeLessThanOrEqual(100);
        expect(v.functionalImplication).toBeDefined();
      });
    });
  });

  it("should have functional thresholds", () => {
    const datasets = getAllNormativeDatasets();
    datasets.forEach((d) => {
      expect(d.functionalThresholds.length).toBeGreaterThan(0);
      d.functionalThresholds.forEach((t) => {
        expect(t.threshold).toBeGreaterThanOrEqual(0);
        expect(t.interpretation).toBeDefined();
      });
    });
  });

  it("should have clinical applications", () => {
    const datasets = getAllNormativeDatasets();
    datasets.forEach((d) => {
      expect(d.clinicalApplications.length).toBeGreaterThan(0);
      d.clinicalApplications.forEach((app) => {
        expect(app.length).toBeGreaterThan(0);
      });
    });
  });

  it("should handle null input gracefully", () => {
    expect(() => {
      getNormativeDatasetById(null as any);
      getNormativeDatasetsByCategory(null as any);
      searchNormativeDatasets(null as any);
    }).not.toThrow();
  });

  it("should return valid comparison results", () => {
    const datasets = getAllNormativeDatasets();
    datasets.forEach((d) => {
      if (d.normativeValues.length > 0) {
        const norm = d.normativeValues[0];
        const result = compareToNorm({
          datasetId: d.id,
          ageGroup: norm.ageGroup,
          sex: norm.sex,
          value: norm.value,
        });
        expect(result).toBeDefined();
        expect(result?.datasetId).toBe(d.id);
        expect(result?.value).toBe(norm.value);
      }
    });
  });

  it("should have unique dataset IDs", () => {
    const datasets = getAllNormativeDatasets();
    const ids = datasets.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have DOI citations", () => {
    const datasets = getAllNormativeDatasets();
    datasets.forEach((d) => {
      if (d.doi) {
        expect(d.doi).toMatch(/^10\./);
      }
    });
  });

  it("should have valid dates", () => {
    const datasets = getAllNormativeDatasets();
    datasets.forEach((d) => {
      expect(d.lastUpdated instanceof Date).toBe(true);
      expect(d.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });

  it("should calculate percentiles correctly", () => {
    const result = compareToNorm({
      datasetId: "ot-norm-001",
      ageGroup: "20-30",
      sex: "M",
      value: 15,
    });
    expect(result?.percentile).toBeGreaterThan(0);
    expect(result?.percentile).toBeLessThanOrEqual(100);
  });

  it("should provide functional implications", () => {
    const result = compareToNorm({
      datasetId: "ot-norm-002",
      ageGroup: "60-70",
      sex: "M",
      value: 13,
    });
    expect(result?.functionalImplication).toBeDefined();
    expect(result?.functionalImplication.length).toBeGreaterThan(0);
  });

  it("should handle edge cases", () => {
    const result1 = compareToNorm({
      datasetId: "ot-norm-001",
      ageGroup: "20-30",
      sex: "M",
      value: 0,
    });
    expect(result1).toBeDefined();

    const result2 = compareToNorm({
      datasetId: "ot-norm-005",
      ageGroup: "80+",
      sex: "M",
      value: 150,
    });
    expect(result2).toBeDefined();
  });

  it("should return comparison to norm text", () => {
    const result = compareToNorm({
      datasetId: "ot-norm-001",
      ageGroup: "20-30",
      sex: "M",
      value: 20,
    });
    expect(result?.comparisonToNorm).toBeDefined();
    expect(result?.comparisonToNorm).toContain("%");
  });

  it("should handle missing age group", () => {
    const result = compareToNorm({
      datasetId: "ot-norm-001",
      ageGroup: "999-999",
      sex: "M",
      value: 15,
    });
    expect(result).toBeNull();
  });

  it("should provide recommendations", () => {
    const result = compareToNorm({
      datasetId: "ot-norm-005",
      ageGroup: "70-80",
      sex: "M",
      value: 60,
    });
    expect(result?.recommendations).toBeDefined();
    expect(result?.recommendations.length).toBeGreaterThan(0);
  });
});
