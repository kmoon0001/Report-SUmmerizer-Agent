/**
 * OT Clinical Assessment Frameworks - Advanced Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTAssessmentFrameworkById,
  getAllOTAssessmentFrameworks,
  getOTAssessmentFrameworksByCategory,
  searchOTAssessmentFrameworks,
  getOTAssessmentFrameworksByEvidenceLevel,
  getAssessmentCategories,
  validateAssessmentFramework,
} from "../../data/ot-clinical-assessment-frameworks-advanced";

describe("OT Clinical Assessment Frameworks - Advanced", () => {
  it("should have 5 assessment frameworks", () => {
    expect(getAllOTAssessmentFrameworks().length).toBe(5);
  });

  it("should return framework by ID", () => {
    const framework = getOTAssessmentFrameworkById("ot-af-001");
    expect(framework?.name).toContain("Occupational Performance");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTAssessmentFrameworkById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const frameworks = getOTAssessmentFrameworksByCategory(
      "Occupational Performance",
    );
    expect(frameworks.length).toBeGreaterThan(0);
  });

  it("should search frameworks", () => {
    const results = searchOTAssessmentFrameworks("Assessment");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const frameworks = getOTAssessmentFrameworksByEvidenceLevel(1);
    expect(frameworks.length).toBeGreaterThan(0);
  });

  it("should return assessment categories", () => {
    const categories = getAssessmentCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should validate assessment framework", () => {
    const result = validateAssessmentFramework(
      "ot-af-001",
      "Occupational Performance",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid category", () => {
    const result = validateAssessmentFramework("ot-af-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTAssessmentFrameworks();
    all.forEach((f) => {
      expect(getOTAssessmentFrameworkById(f.id)).toEqual(f);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTAssessmentFrameworkById(null as any);
      getAllOTAssessmentFrameworks();
      getOTAssessmentFrameworksByCategory("test");
      searchOTAssessmentFrameworks("test");
      getOTAssessmentFrameworksByEvidenceLevel(1);
      getAssessmentCategories();
      validateAssessmentFramework("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTAssessmentFrameworks();
    all.forEach((f) => {
      expect(f.id).toBeDefined();
      expect(f.name).toBeDefined();
      expect(f.category).toBeDefined();
      expect(f.description).toBeDefined();
      expect(f.clinicalIndications).toBeDefined();
      expect(f.assessmentTools).toBeDefined();
      expect(f.measurementProtocol).toBeDefined();
      expect(f.performanceStandards).toBeDefined();
      expect(f.clinicalInterpretation).toBeDefined();
      expect(f.redFlags).toBeDefined();
      expect(f.contraindications).toBeDefined();
      expect(f.evidenceLevel).toBeDefined();
      expect(f.source).toBeDefined();
      expect(f.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTAssessmentFrameworks();
    all.forEach((f) => {
      expect([1, 2, 3]).toContain(f.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTAssessmentFrameworks();
    all.forEach((f) => {
      expect(f.clinicalIndications.length).toBeGreaterThan(0);
      expect(f.assessmentTools.length).toBeGreaterThan(0);
      expect(f.measurementProtocol.length).toBeGreaterThan(0);
      expect(f.performanceStandards.length).toBeGreaterThan(0);
      expect(f.clinicalInterpretation.length).toBeGreaterThan(0);
      expect(f.redFlags.length).toBeGreaterThan(0);
      expect(f.contraindications.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTAssessmentFrameworks();
    all.forEach((f) => {
      expect(f.lastUpdated instanceof Date).toBe(true);
      expect(f.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });

  it("should have assessment tools with required properties", () => {
    const all = getAllOTAssessmentFrameworks();
    all.forEach((f) => {
      f.assessmentTools.forEach((tool) => {
        expect(tool.name).toBeDefined();
        expect(tool.abbreviation).toBeDefined();
        expect(tool.purpose).toBeDefined();
        expect(tool.scoringMethod).toBeDefined();
        expect(tool.clinicalUtility).toBeDefined();
        expect(tool.reliability).toBeDefined();
        expect(tool.validity).toBeDefined();
      });
    });
  });

  it("should have performance standards with required properties", () => {
    const all = getAllOTAssessmentFrameworks();
    all.forEach((f) => {
      f.performanceStandards.forEach((ps) => {
        expect(ps.domain).toBeDefined();
        expect(ps.expectedPerformance).toBeDefined();
        expect(ps.population).toBeDefined();
        expect(ps.notes).toBeDefined();
      });
    });
  });
});
