/**
 * OT Specialized Intervention Frameworks Tests
 */

import { describe, it, expect } from "vitest";
import {
  getOTInterventionFrameworkById,
  getAllOTInterventionFrameworks,
  getOTInterventionFrameworksByCategory,
  searchOTInterventionFrameworks,
  getOTInterventionFrameworksByEvidenceLevel,
  getInterventionComponents,
  validateInterventionFramework,
} from "../../data/ot-specialized-intervention-frameworks";

describe("OT Specialized Intervention Frameworks", () => {
  it("should have 5 intervention frameworks", () => {
    expect(getAllOTInterventionFrameworks().length).toBe(5);
  });

  it("should return framework by ID", () => {
    const framework = getOTInterventionFrameworkById("ot-if-001");
    expect(framework?.name).toContain("Sensory");
  });

  it("should return undefined for invalid ID", () => {
    expect(getOTInterventionFrameworkById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const frameworks = getOTInterventionFrameworksByCategory("Sensory");
    expect(frameworks.length).toBeGreaterThan(0);
  });

  it("should search frameworks", () => {
    const results = searchOTInterventionFrameworks("Framework");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const frameworks = getOTInterventionFrameworksByEvidenceLevel(1);
    expect(frameworks.length).toBeGreaterThan(0);
  });

  it("should return intervention components", () => {
    const components = getInterventionComponents();
    expect(Array.isArray(components)).toBe(true);
    expect(components.length).toBeGreaterThan(0);
  });

  it("should validate intervention framework", () => {
    const result = validateInterventionFramework(
      "ot-if-001",
      "Autism spectrum disorder",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid condition", () => {
    const result = validateInterventionFramework(
      "ot-if-001",
      "Invalid condition",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllOTInterventionFrameworks();
    all.forEach((f) => {
      expect(getOTInterventionFrameworkById(f.id)).toEqual(f);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getOTInterventionFrameworkById(null as any);
      getAllOTInterventionFrameworks();
      getOTInterventionFrameworksByCategory("test");
      searchOTInterventionFrameworks("test");
      getOTInterventionFrameworksByEvidenceLevel(1);
      getInterventionComponents();
      validateInterventionFramework("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllOTInterventionFrameworks();
    all.forEach((f) => {
      expect(f.id).toBeDefined();
      expect(f.name).toBeDefined();
      expect(f.category).toBeDefined();
      expect(f.description).toBeDefined();
      expect(f.targetConditions).toBeDefined();
      expect(f.interventionComponents).toBeDefined();
      expect(f.progressionCriteria).toBeDefined();
      expect(f.dosageGuidelines).toBeDefined();
      expect(f.expectedOutcomes).toBeDefined();
      expect(f.contraindications).toBeDefined();
      expect(f.evidenceLevel).toBeDefined();
      expect(f.source).toBeDefined();
      expect(f.citation).toBeDefined();
      expect(f.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllOTInterventionFrameworks();
    all.forEach((f) => {
      expect([1, 2, 3]).toContain(f.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllOTInterventionFrameworks();
    all.forEach((f) => {
      expect(f.targetConditions.length).toBeGreaterThan(0);
      expect(f.interventionComponents.length).toBeGreaterThan(0);
      expect(f.progressionCriteria.length).toBeGreaterThan(0);
      expect(f.dosageGuidelines.length).toBeGreaterThan(0);
      expect(f.expectedOutcomes.length).toBeGreaterThan(0);
      expect(f.contraindications.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllOTInterventionFrameworks();
    all.forEach((f) => {
      expect(f.lastUpdated instanceof Date).toBe(true);
      expect(f.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });
});
