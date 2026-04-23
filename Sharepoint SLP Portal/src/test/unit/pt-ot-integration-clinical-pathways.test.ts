/**
 * PT-OT Integration - Clinical Pathways Tests
 */

import { describe, it, expect } from "vitest";
import {
  getIntegratedPathwayById,
  getAllIntegratedPathways,
  getIntegratedPathwaysByCategory,
  searchIntegratedPathways,
  getIntegratedPathwaysByEvidenceLevel,
  getCollaborationPoints,
  validateIntegratedIntervention,
} from "../../data/pt-ot-integration-clinical-pathways";

describe("PT-OT Integration - Clinical Pathways", () => {
  it("should have 5 integrated pathways", () => {
    expect(getAllIntegratedPathways().length).toBe(5);
  });

  it("should return pathway by ID", () => {
    const pathway = getIntegratedPathwayById("path-001");
    expect(pathway?.name).toBe("Stroke Rehabilitation");
  });

  it("should return undefined for invalid ID", () => {
    expect(getIntegratedPathwayById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const pathways = getIntegratedPathwaysByCategory("Integration");
    expect(pathways.length).toBeGreaterThan(0);
  });

  it("should search pathways", () => {
    const results = searchIntegratedPathways("Stroke");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const pathways = getIntegratedPathwaysByEvidenceLevel(1);
    expect(pathways.length).toBeGreaterThan(0);
  });

  it("should return collaboration points", () => {
    const points = getCollaborationPoints();
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(0);
  });

  it("should validate integrated interventions", () => {
    const result = validateIntegratedIntervention(
      "path-001",
      "Functional training",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid interventions", () => {
    const result = validateIntegratedIntervention("path-001", "Invalid");
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllIntegratedPathways();
    all.forEach((p) => {
      expect(getIntegratedPathwayById(p.id)).toEqual(p);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getIntegratedPathwayById(null as any);
      getAllIntegratedPathways();
      getIntegratedPathwaysByCategory("test");
      searchIntegratedPathways("test");
      getIntegratedPathwaysByEvidenceLevel(1);
      getCollaborationPoints();
      validateIntegratedIntervention("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllIntegratedPathways();
    all.forEach((p) => {
      expect(p.id).toBeDefined();
      expect(p.name).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.description).toBeDefined();
      expect(p.ptRole).toBeDefined();
      expect(p.otRole).toBeDefined();
      expect(p.collaborationPoints).toBeDefined();
      expect(p.sharedAssessments).toBeDefined();
      expect(p.integratedInterventions).toBeDefined();
      expect(p.evidenceLevel).toBeDefined();
      expect(p.source).toBeDefined();
      expect(p.citation).toBeDefined();
      expect(p.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllIntegratedPathways();
    all.forEach((p) => {
      expect([1, 2, 3]).toContain(p.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllIntegratedPathways();
    all.forEach((p) => {
      expect(p.ptRole.length).toBeGreaterThan(0);
      expect(p.otRole.length).toBeGreaterThan(0);
      expect(p.collaborationPoints.length).toBeGreaterThan(0);
      expect(p.sharedAssessments.length).toBeGreaterThan(0);
      expect(p.integratedInterventions.length).toBeGreaterThan(0);
    });
  });
});
