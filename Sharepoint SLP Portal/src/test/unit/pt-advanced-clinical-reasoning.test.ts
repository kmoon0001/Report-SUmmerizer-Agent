/**
 * PT Advanced Clinical Reasoning & Case Management Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTClinicalCaseById,
  getAllPTClinicalCases,
  getPTClinicalCasesByCategory,
  searchPTClinicalCases,
  getPTClinicalCasesByEvidenceLevel,
  getRedFlags,
  validateClinicalReasoning,
} from "../../data/pt-advanced-clinical-reasoning";

describe("PT Advanced Clinical Reasoning & Case Management", () => {
  it("should have 5 clinical cases", () => {
    expect(getAllPTClinicalCases().length).toBe(5);
  });

  it("should return case by ID", () => {
    const caseData = getPTClinicalCaseById("pt-cr-001");
    expect(caseData?.name).toContain("Stroke");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTClinicalCaseById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const cases = getPTClinicalCasesByCategory("Neurological");
    expect(cases.length).toBeGreaterThan(0);
  });

  it("should search cases", () => {
    const results = searchPTClinicalCases("Stroke");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const cases = getPTClinicalCasesByEvidenceLevel(1);
    expect(cases.length).toBeGreaterThan(0);
  });

  it("should return red flags", () => {
    const flags = getRedFlags();
    expect(Array.isArray(flags)).toBe(true);
    expect(flags.length).toBeGreaterThan(0);
  });

  it("should validate clinical reasoning", () => {
    const result = validateClinicalReasoning(
      "pt-cr-001",
      "Post-stroke motor recovery",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid reasoning", () => {
    const result = validateClinicalReasoning("pt-cr-001", "Invalid reasoning");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTClinicalCases();
    all.forEach((c) => {
      expect(getPTClinicalCaseById(c.id)).toEqual(c);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTClinicalCaseById(null as any);
      getAllPTClinicalCases();
      getPTClinicalCasesByCategory("test");
      searchPTClinicalCases("test");
      getPTClinicalCasesByEvidenceLevel(1);
      getRedFlags();
      validateClinicalReasoning("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTClinicalCases();
    all.forEach((c) => {
      expect(c.id).toBeDefined();
      expect(c.name).toBeDefined();
      expect(c.category).toBeDefined();
      expect(c.description).toBeDefined();
      expect(c.patientProfile).toBeDefined();
      expect(c.clinicalPresentation).toBeDefined();
      expect(c.assessmentStrategy).toBeDefined();
      expect(c.differentialDiagnosis).toBeDefined();
      expect(c.interventionPlan).toBeDefined();
      expect(c.expectedOutcomes).toBeDefined();
      expect(c.redFlags).toBeDefined();
      expect(c.evidenceLevel).toBeDefined();
      expect(c.source).toBeDefined();
      expect(c.citation).toBeDefined();
      expect(c.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTClinicalCases();
    all.forEach((c) => {
      expect([1, 2, 3]).toContain(c.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTClinicalCases();
    all.forEach((c) => {
      expect(c.patientProfile.length).toBeGreaterThan(0);
      expect(c.clinicalPresentation.length).toBeGreaterThan(0);
      expect(c.assessmentStrategy.length).toBeGreaterThan(0);
      expect(c.differentialDiagnosis.length).toBeGreaterThan(0);
      expect(c.interventionPlan.length).toBeGreaterThan(0);
      expect(c.expectedOutcomes.length).toBeGreaterThan(0);
      expect(c.redFlags.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllPTClinicalCases();
    all.forEach((c) => {
      expect(c.lastUpdated instanceof Date).toBe(true);
      expect(c.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
