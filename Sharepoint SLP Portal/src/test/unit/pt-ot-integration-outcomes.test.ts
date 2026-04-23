/**
 * PT-OT Integration - Comprehensive Outcomes Framework Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOutcomeFrameworkById,
  getAllOutcomeFrameworks,
  getOutcomeFrameworksByCategory,
  searchOutcomeFrameworks,
  getOutcomeFrameworksByEvidenceLevel,
  getMeasurementTools,
  validateSuccessCriteria,
} from "../../data/pt-ot-integration-outcomes";

describe("PT-OT Integration - Comprehensive Outcomes Framework", () => {
  it("should have 5 outcome frameworks", () => {
    expect(getAllOutcomeFrameworks().length).toBe(5);
  });

  it("should return framework by ID", () => {
    const framework = getOutcomeFrameworkById("out-001");
    expect(framework?.name).toBe("Functional Independence Outcomes");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOutcomeFrameworkById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const frameworks = getOutcomeFrameworksByCategory("Functional");
    expect(frameworks.length).toBeGreaterThan(0);
  });

  it("should search frameworks", () => {
    const results = searchOutcomeFrameworks("Functional");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const frameworks = getOutcomeFrameworksByEvidenceLevel(1);
    expect(frameworks.length).toBeGreaterThan(0);
  });

  it("should return measurement tools", () => {
    const tools = getMeasurementTools();
    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(0);
  });

  it("should validate success criteria", () => {
    const result = validateSuccessCriteria("out-001", "Improved FIM scores");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid criteria", () => {
    const result = validateSuccessCriteria("out-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOutcomeFrameworks();
    all.forEach((f) => {
      expect(getOutcomeFrameworkById(f.id)).toEqual(f);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOutcomeFrameworkById(null as any);
      getAllOutcomeFrameworks();
      getOutcomeFrameworksByCategory("test");
      searchOutcomeFrameworks("test");
      getOutcomeFrameworksByEvidenceLevel(1);
      getMeasurementTools();
      validateSuccessCriteria("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOutcomeFrameworks();
    all.forEach((f) => {
      expect(f.id).toBeDefined();
      expect(f.name).toBeDefined();
      expect(f.category).toBeDefined();
      expect(f.description).toBeDefined();
      expect(f.measurementTools).toBeDefined();
      expect(f.timepoints).toBeDefined();
      expect(f.successCriteria).toBeDefined();
      expect(f.reportingMetrics).toBeDefined();
      expect(f.evidenceLevel).toBeDefined();
      expect(f.source).toBeDefined();
      expect(f.citation).toBeDefined();
      expect(f.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOutcomeFrameworks();
    all.forEach((f) => {
      expect([1, 2, 3]).toContain(f.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOutcomeFrameworks();
    all.forEach((f) => {
      expect(f.measurementTools.length).toBeGreaterThan(0);
      expect(f.timepoints.length).toBeGreaterThan(0);
      expect(f.successCriteria.length).toBeGreaterThan(0);
      expect(f.reportingMetrics.length).toBeGreaterThan(0);
    });
  });
});
