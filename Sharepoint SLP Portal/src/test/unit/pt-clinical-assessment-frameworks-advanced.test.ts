/**
 * PT Clinical Assessment Frameworks - Advanced Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTAssessmentFrameworkById,
  getAllPTAssessmentFrameworks,
  getPTAssessmentFrameworksByCategory,
  searchPTAssessmentFrameworks,
  getPTAssessmentFrameworksByEvidenceLevel,
  getAssessmentCategories,
  validateAssessmentFramework,
} from "../../data/pt-clinical-assessment-frameworks-advanced";

describe("PT Clinical Assessment Frameworks - Advanced", () => {
  it("should have 5 assessment frameworks", () => {
    expect(getAllPTAssessmentFrameworks().length).toBe(5);
  });

  it("should return framework by ID", () => {
    const framework = getPTAssessmentFrameworkById("pt-af-001");
    expect(framework?.name).toContain("Musculoskeletal");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTAssessmentFrameworkById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const frameworks = getPTAssessmentFrameworksByCategory("Musculoskeletal");
    expect(frameworks.length).toBeGreaterThan(0);
  });

  it("should search frameworks", () => {
    const results = searchPTAssessmentFrameworks("Assessment");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const frameworks = getPTAssessmentFrameworksByEvidenceLevel(1);
    expect(frameworks.length).toBeGreaterThan(0);
  });

  it("should return assessment categories", () => {
    const categories = getAssessmentCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should validate assessment framework", () => {
    const result = validateAssessmentFramework("pt-af-001", "Musculoskeletal");
    expect(result.valid).toBe(true);
  });

  it("should reject invalid category", () => {
    const result = validateAssessmentFramework("pt-af-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTAssessmentFrameworks();
    all.forEach((f) => {
      expect(getPTAssessmentFrameworkById(f.id)).toEqual(f);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTAssessmentFrameworkById(null as any);
      getAllPTAssessmentFrameworks();
      getPTAssessmentFrameworksByCategory("test");
      searchPTAssessmentFrameworks("test");
      getPTAssessmentFrameworksByEvidenceLevel(1);
      getAssessmentCategories();
      validateAssessmentFramework("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTAssessmentFrameworks();
    all.forEach((f) => {
      expect(f.id).toBeDefined();
      expect(f.name).toBeDefined();
      expect(f.category).toBeDefined();
      expect(f.description).toBeDefined();
      expect(f.clinicalIndications).toBeDefined();
      expect(f.assessmentTools).toBeDefined();
      expect(f.measurementProtocol).toBeDefined();
      expect(f.normalValues).toBeDefined();
      expect(f.clinicalInterpretation).toBeDefined();
      expect(f.redFlags).toBeDefined();
      expect(f.contraindications).toBeDefined();
      expect(f.evidenceLevel).toBeDefined();
      expect(f.source).toBeDefined();
      expect(f.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTAssessmentFrameworks();
    all.forEach((f) => {
      expect([1, 2, 3]).toContain(f.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTAssessmentFrameworks();
    all.forEach((f) => {
      expect(f.clinicalIndications.length).toBeGreaterThan(0);
      expect(f.assessmentTools.length).toBeGreaterThan(0);
      expect(f.measurementProtocol.length).toBeGreaterThan(0);
      expect(f.normalValues.length).toBeGreaterThan(0);
      expect(f.clinicalInterpretation.length).toBeGreaterThan(0);
      expect(f.redFlags.length).toBeGreaterThan(0);
      expect(f.contraindications.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllPTAssessmentFrameworks();
    all.forEach((f) => {
      expect(f.lastUpdated instanceof Date).toBe(true);
      expect(f.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });

  it("should have assessment tools with required properties", () => {
    const all = getAllPTAssessmentFrameworks();
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

  it("should have normal values with required properties", () => {
    const all = getAllPTAssessmentFrameworks();
    all.forEach((f) => {
      f.normalValues.forEach((nv) => {
        expect(nv.parameter).toBeDefined();
        expect(nv.normalRange).toBeDefined();
        expect(nv.population).toBeDefined();
        expect(nv.notes).toBeDefined();
      });
    });
  });
});
