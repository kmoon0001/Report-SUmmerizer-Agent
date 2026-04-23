/**
 * PT Advanced Assessment Protocols Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTAssessmentProtocolById,
  getAllPTAssessmentProtocols,
  getPTAssessmentProtocolsByCategory,
  searchPTAssessmentProtocols,
  getPTAssessmentProtocolsByEvidenceLevel,
  getAssessmentComponents,
  validateAssessmentProtocol,
} from "../../data/pt-advanced-assessment-protocols";

describe("PT Advanced Assessment Protocols", () => {
  it("should have 5 assessment protocols", () => {
    expect(getAllPTAssessmentProtocols().length).toBe(5);
  });

  it("should return protocol by ID", () => {
    const protocol = getPTAssessmentProtocolById("pt-ap-001");
    expect(protocol?.name).toContain("Neuromotor");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTAssessmentProtocolById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const protocols = getPTAssessmentProtocolsByCategory("Neurological");
    expect(protocols.length).toBeGreaterThan(0);
  });

  it("should search protocols", () => {
    const results = searchPTAssessmentProtocols("Assessment");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const protocols = getPTAssessmentProtocolsByEvidenceLevel(1);
    expect(protocols.length).toBeGreaterThan(0);
  });

  it("should return assessment components", () => {
    const components = getAssessmentComponents();
    expect(Array.isArray(components)).toBe(true);
    expect(components.length).toBeGreaterThan(0);
  });

  it("should validate assessment protocol", () => {
    const result = validateAssessmentProtocol(
      "pt-ap-001",
      "Motor control assessment",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid component", () => {
    const result = validateAssessmentProtocol("pt-ap-001", "Invalid component");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTAssessmentProtocols();
    all.forEach((p) => {
      expect(getPTAssessmentProtocolById(p.id)).toEqual(p);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTAssessmentProtocolById(null as any);
      getAllPTAssessmentProtocols();
      getPTAssessmentProtocolsByCategory("test");
      searchPTAssessmentProtocols("test");
      getPTAssessmentProtocolsByEvidenceLevel(1);
      getAssessmentComponents();
      validateAssessmentProtocol("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTAssessmentProtocols();
    all.forEach((p) => {
      expect(p.id).toBeDefined();
      expect(p.name).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.description).toBeDefined();
      expect(p.assessmentComponents).toBeDefined();
      expect(p.clinicalApplications).toBeDefined();
      expect(p.scoringCriteria).toBeDefined();
      expect(p.interpretationGuidelines).toBeDefined();
      expect(p.evidenceBase).toBeDefined();
      expect(p.evidenceLevel).toBeDefined();
      expect(p.source).toBeDefined();
      expect(p.citation).toBeDefined();
      expect(p.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTAssessmentProtocols();
    all.forEach((p) => {
      expect([1, 2, 3]).toContain(p.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTAssessmentProtocols();
    all.forEach((p) => {
      expect(p.assessmentComponents.length).toBeGreaterThan(0);
      expect(p.clinicalApplications.length).toBeGreaterThan(0);
      expect(p.scoringCriteria.length).toBeGreaterThan(0);
      expect(p.interpretationGuidelines.length).toBeGreaterThan(0);
      expect(p.evidenceBase.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllPTAssessmentProtocols();
    all.forEach((p) => {
      expect(p.lastUpdated instanceof Date).toBe(true);
      expect(p.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
