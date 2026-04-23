/**
 * PT Intervention - Stretching & Functional Training Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTStretchingFunctionalProtocolById,
  getAllPTStretchingFunctionalProtocols,
  getPTStretchingFunctionalProtocolsByCategory,
  searchPTStretchingFunctionalProtocols,
  getPTStretchingFunctionalProtocolsByEvidenceLevel,
  getPTStretchingFunctionalTechniques,
  validatePTStretchingFunctionalParameter,
} from "../../data/pt-intervention-stretching-functional";

describe("PT Intervention - Stretching & Functional Training", () => {
  it("should have 10 protocols", () => {
    expect(getAllPTStretchingFunctionalProtocols().length).toBe(10);
  });

  it("should return protocol by ID", () => {
    const protocol = getPTStretchingFunctionalProtocolById("tech-pt-sf-001");
    expect(protocol?.name).toBe("Static Stretching Protocol");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTStretchingFunctionalProtocolById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const protocols =
      getPTStretchingFunctionalProtocolsByCategory("Stretching");
    expect(protocols.length).toBe(10);
  });

  it("should search protocols", () => {
    const results = searchPTStretchingFunctionalProtocols("Gait");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const protocols = getPTStretchingFunctionalProtocolsByEvidenceLevel(1);
    expect(protocols.length).toBe(10);
  });

  it("should return techniques", () => {
    const techniques = getPTStretchingFunctionalTechniques();
    expect(Array.isArray(techniques)).toBe(true);
    expect(techniques.length).toBeGreaterThan(0);
  });

  it("should validate parameters", () => {
    const result = validatePTStretchingFunctionalParameter(
      "tech-pt-sf-001",
      "Duration: 30-60 seconds",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid parameters", () => {
    const result = validatePTStretchingFunctionalParameter(
      "tech-pt-sf-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTStretchingFunctionalProtocols();
    all.forEach((p) => {
      expect(getPTStretchingFunctionalProtocolById(p.id)).toEqual(p);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTStretchingFunctionalProtocolById(null as any);
      getAllPTStretchingFunctionalProtocols();
      getPTStretchingFunctionalProtocolsByCategory("test");
      searchPTStretchingFunctionalProtocols("test");
      getPTStretchingFunctionalProtocolsByEvidenceLevel(1);
      getPTStretchingFunctionalTechniques();
      validatePTStretchingFunctionalParameter("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTStretchingFunctionalProtocols();
    all.forEach((p) => {
      expect(p.id).toBeDefined();
      expect(p.name).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.description).toBeDefined();
      expect(p.techniques).toBeDefined();
      expect(p.indications).toBeDefined();
      expect(p.contraindications).toBeDefined();
      expect(p.parameters).toBeDefined();
      expect(p.evidenceLevel).toBeDefined();
      expect(p.source).toBeDefined();
      expect(p.citation).toBeDefined();
      expect(p.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTStretchingFunctionalProtocols();
    all.forEach((p) => {
      expect([1, 2, 3]).toContain(p.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTStretchingFunctionalProtocols();
    all.forEach((p) => {
      expect(p.techniques.length).toBeGreaterThan(0);
      expect(p.indications.length).toBeGreaterThan(0);
      expect(p.contraindications.length).toBeGreaterThan(0);
      expect(p.parameters.length).toBeGreaterThan(0);
    });
  });
});
