/**
 * PT-OT Integration - Validation & Quality Assurance Tests
 */

import { describe, it, expect } from "vitest";
import {
  getValidationCriteriaById,
  getAllValidationCriteria,
  getValidationCriteriaByCategory,
  searchValidationCriteria,
  getValidationCriteriaByEvidenceLevel,
  getQualityMetrics,
  validateOutcomeIndicator,
} from "../../data/pt-ot-integration-validation";

describe("PT-OT Integration - Validation & Quality Assurance", () => {
  it("should have 5 validation criteria", () => {
    expect(getAllValidationCriteria().length).toBe(5);
  });

  it("should return criteria by ID", () => {
    const criteria = getValidationCriteriaById("val-001");
    expect(criteria?.name).toBe("Clinical Outcome Validation");
  });

  it("should return undefined for invalid ID", () => {
    expect(getValidationCriteriaById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const criteria = getValidationCriteriaByCategory("Outcome");
    expect(criteria.length).toBeGreaterThan(0);
  });

  it("should search criteria", () => {
    const results = searchValidationCriteria("Outcome");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const criteria = getValidationCriteriaByEvidenceLevel(1);
    expect(criteria.length).toBeGreaterThan(0);
  });

  it("should return quality metrics", () => {
    const metrics = getQualityMetrics();
    expect(Array.isArray(metrics)).toBe(true);
    expect(metrics.length).toBeGreaterThan(0);
  });

  it("should validate outcome indicators", () => {
    const result = validateOutcomeIndicator("val-001", "ROM improvement");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid indicators", () => {
    const result = validateOutcomeIndicator("val-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllValidationCriteria();
    all.forEach((c) => {
      expect(getValidationCriteriaById(c.id)).toEqual(c);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getValidationCriteriaById(null as any);
      getAllValidationCriteria();
      getValidationCriteriaByCategory("test");
      searchValidationCriteria("test");
      getValidationCriteriaByEvidenceLevel(1);
      getQualityMetrics();
      validateOutcomeIndicator("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllValidationCriteria();
    all.forEach((c) => {
      expect(c.id).toBeDefined();
      expect(c.name).toBeDefined();
      expect(c.category).toBeDefined();
      expect(c.description).toBeDefined();
      expect(c.validationPoints).toBeDefined();
      expect(c.qualityMetrics).toBeDefined();
      expect(c.outcomeIndicators).toBeDefined();
      expect(c.complianceRequirements).toBeDefined();
      expect(c.evidenceLevel).toBeDefined();
      expect(c.source).toBeDefined();
      expect(c.citation).toBeDefined();
      expect(c.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllValidationCriteria();
    all.forEach((c) => {
      expect([1, 2, 3]).toContain(c.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllValidationCriteria();
    all.forEach((c) => {
      expect(c.validationPoints.length).toBeGreaterThan(0);
      expect(c.qualityMetrics.length).toBeGreaterThan(0);
      expect(c.outcomeIndicators.length).toBeGreaterThan(0);
      expect(c.complianceRequirements.length).toBeGreaterThan(0);
    });
  });
});
