/**
 * OT Advanced Assessment Protocols Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTAssessmentProtocolById,
  getAllOTAssessmentProtocols,
  getOTAssessmentProtocolsByCategory,
  searchOTAssessmentProtocols,
  getOTAssessmentProtocolsByEvidenceLevel,
  getAssessmentComponents,
  validateAssessmentProtocol,
} from "../../data/ot-advanced-assessment-protocols";

describe("OT Advanced Assessment Protocols", () => {
  it("should have 5 assessment protocols", () => {
    expect(getAllOTAssessmentProtocols().length).toBe(5);
  });

  it("should return protocol by ID", () => {
    const protocol = getOTAssessmentProtocolById("ot-ap-001");
    expect(protocol?.name).toContain("Cognitive");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTAssessmentProtocolById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const protocols = getOTAssessmentProtocolsByCategory("Cognitive");
    expect(protocols.length).toBeGreaterThan(0);
  });

  it("should search protocols", () => {
    const results = searchOTAssessmentProtocols("Assessment");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const protocols = getOTAssessmentProtocolsByEvidenceLevel(1);
    expect(protocols.length).toBeGreaterThan(0);
  });

  it("should return assessment components", () => {
    const components = getAssessmentComponents();
    expect(Array.isArray(components)).toBe(true);
    expect(components.length).toBeGreaterThan(0);
  });

  it("should validate assessment protocol", () => {
    const result = validateAssessmentProtocol(
      "ot-ap-001",
      "Attention assessment",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid component", () => {
    const result = validateAssessmentProtocol("ot-ap-001", "Invalid component");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTAssessmentProtocols();
    all.forEach((p) => {
      expect(getOTAssessmentProtocolById(p.id)).toEqual(p);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTAssessmentProtocolById(null as any);
      getAllOTAssessmentProtocols();
      getOTAssessmentProtocolsByCategory("test");
      searchOTAssessmentProtocols("test");
      getOTAssessmentProtocolsByEvidenceLevel(1);
      getAssessmentComponents();
      validateAssessmentProtocol("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTAssessmentProtocols();
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
    const all = getAllOTAssessmentProtocols();
    all.forEach((p) => {
      expect([1, 2, 3]).toContain(p.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTAssessmentProtocols();
    all.forEach((p) => {
      expect(p.assessmentComponents.length).toBeGreaterThan(0);
      expect(p.clinicalApplications.length).toBeGreaterThan(0);
      expect(p.scoringCriteria.length).toBeGreaterThan(0);
      expect(p.interpretationGuidelines.length).toBeGreaterThan(0);
      expect(p.evidenceBase.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTAssessmentProtocols();
    all.forEach((p) => {
      expect(p.lastUpdated instanceof Date).toBe(true);
      expect(p.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
