/**
 * OT Evidence-Based Resources & Clinical Depth Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTEvidenceResourceById,
  getAllOTEvidenceResources,
  getOTEvidenceResourcesByCategory,
  searchOTEvidenceResources,
  getOTEvidenceResourcesByEvidenceLevel,
  getKeyFindings,
  validateClinicalApplication,
} from "../../data/ot-evidence-based-resources";

describe("OT Evidence-Based Resources & Clinical Depth", () => {
  it("should have 5 evidence-based resources", () => {
    expect(getAllOTEvidenceResources().length).toBe(5);
  });

  it("should return resource by ID", () => {
    const resource = getOTEvidenceResourceById("ot-ebr-001");
    expect(resource?.name).toContain("Cancer");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTEvidenceResourceById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const resources = getOTEvidenceResourcesByCategory("Oncology");
    expect(resources.length).toBeGreaterThan(0);
  });

  it("should search resources", () => {
    const results = searchOTEvidenceResources("Autism");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const resources = getOTEvidenceResourcesByEvidenceLevel(1);
    expect(resources.length).toBeGreaterThan(0);
  });

  it("should return key findings", () => {
    const findings = getKeyFindings();
    expect(Array.isArray(findings)).toBe(true);
    expect(findings.length).toBeGreaterThan(0);
  });

  it("should validate clinical applications", () => {
    const result = validateClinicalApplication(
      "ot-ebr-001",
      "Fatigue management",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid applications", () => {
    const result = validateClinicalApplication("ot-ebr-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTEvidenceResources();
    all.forEach((r) => {
      expect(getOTEvidenceResourceById(r.id)).toEqual(r);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTEvidenceResourceById(null as any);
      getAllOTEvidenceResources();
      getOTEvidenceResourcesByCategory("test");
      searchOTEvidenceResources("test");
      getOTEvidenceResourcesByEvidenceLevel(1);
      getKeyFindings();
      validateClinicalApplication("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTEvidenceResources();
    all.forEach((r) => {
      expect(r.id).toBeDefined();
      expect(r.name).toBeDefined();
      expect(r.category).toBeDefined();
      expect(r.description).toBeDefined();
      expect(r.clinicalApplication).toBeDefined();
      expect(r.evidenceBase).toBeDefined();
      expect(r.keyFindings).toBeDefined();
      expect(r.recommendedAssessments).toBeDefined();
      expect(r.citationAuthors).toBeDefined();
      expect(r.publicationYear).toBeDefined();
      expect(r.evidenceLevel).toBeDefined();
      expect(r.source).toBeDefined();
      expect(r.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTEvidenceResources();
    all.forEach((r) => {
      expect([1, 2, 3]).toContain(r.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTEvidenceResources();
    all.forEach((r) => {
      expect(r.clinicalApplication.length).toBeGreaterThan(0);
      expect(r.evidenceBase.length).toBeGreaterThan(0);
      expect(r.keyFindings.length).toBeGreaterThan(0);
      expect(r.recommendedAssessments.length).toBeGreaterThan(0);
      expect(r.citationAuthors.length).toBeGreaterThan(0);
    });
  });

  it("should have valid publication years", () => {
    const all = getAllOTEvidenceResources();
    all.forEach((r) => {
      expect(r.publicationYear).toBeGreaterThanOrEqual(2020);
      expect(r.publicationYear).toBeLessThanOrEqual(2025);
    });
  });
});
