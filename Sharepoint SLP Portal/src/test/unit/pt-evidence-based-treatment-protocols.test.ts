/**
 * PT Evidence-Based Treatment Protocols Tests
 */

import { describe, it, expect } from "vitest";
import {
  getProtocolById,
  getAllProtocols,
  getProtocolsByCategory,
  searchProtocols,
  getProtocolsByEvidenceLevel,
  getProtocolPhases,
  getProtocolCategories,
} from "../../data/pt-evidence-based-treatment-protocols";

describe("PT Evidence-Based Treatment Protocols", () => {
  it("should have 5 treatment protocols", () => {
    expect(getAllProtocols().length).toBe(5);
  });

  it("should return protocol by ID", () => {
    const protocol = getProtocolById("pt-tp-001");
    expect(protocol?.condition).toContain("Stroke");
  });

  it("should return undefined for invalid ID", () => {
    expect(getProtocolById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const protocols = getProtocolsByCategory("Neurological");
    expect(protocols.length).toBeGreaterThan(0);
  });

  it("should search protocols", () => {
    const results = searchProtocols("rehabilitation");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const protocols = getProtocolsByEvidenceLevel(1);
    expect(protocols.length).toBeGreaterThan(0);
  });

  it("should get protocol phases", () => {
    const phases = getProtocolPhases("pt-tp-001");
    expect(phases.length).toBeGreaterThan(0);
  });

  it("should return protocol categories", () => {
    const categories = getProtocolCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getProtocolById(null as any);
      getAllProtocols();
      getProtocolsByCategory("test");
      searchProtocols("test");
      getProtocolsByEvidenceLevel(1);
      getProtocolPhases("test");
      getProtocolCategories();
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllProtocols();
    all.forEach((p) => {
      expect(p.id).toBeDefined();
      expect(p.condition).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.description).toBeDefined();
      expect(p.phases).toBeDefined();
      expect(p.contraindications).toBeDefined();
      expect(p.precautions).toBeDefined();
      expect(p.expectedOutcomes).toBeDefined();
      expect(p.evidenceLevel).toBeDefined();
      expect(p.source).toBeDefined();
      expect(p.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllProtocols();
    all.forEach((p) => {
      expect([1, 2, 3]).toContain(p.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllProtocols();
    all.forEach((p) => {
      expect(p.phases.length).toBeGreaterThan(0);
      expect(p.contraindications.length).toBeGreaterThan(0);
      expect(p.precautions.length).toBeGreaterThan(0);
      expect(p.expectedOutcomes.length).toBeGreaterThan(0);
    });
  });

  it("should have valid dates", () => {
    const all = getAllProtocols();
    all.forEach((p) => {
      expect(p.lastUpdated instanceof Date).toBe(true);
      expect(p.lastUpdated.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });

  it("should have phases with required properties", () => {
    const all = getAllProtocols();
    all.forEach((p) => {
      p.phases.forEach((phase) => {
        expect(phase.phase).toBeDefined();
        expect(phase.duration).toBeDefined();
        expect(phase.goals).toBeDefined();
        expect(phase.interventions).toBeDefined();
        expect(phase.dosage).toBeDefined();
        expect(phase.progressionCriteria).toBeDefined();
      });
    });
  });

  it("should have effect sizes for evidence", () => {
    const all = getAllProtocols();
    all.forEach((p) => {
      if (p.effectSize) {
        expect(p.effectSize).toContain("d =");
      }
    });
  });

  it("should have DOI citations", () => {
    const all = getAllProtocols();
    all.forEach((p) => {
      if (p.doi) {
        expect(p.doi).toMatch(/^10\./);
      }
    });
  });

  it("should have specific dosage recommendations", () => {
    const all = getAllProtocols();
    all.forEach((p) => {
      p.phases.forEach((phase) => {
        expect(phase.dosage).toMatch(/\d+/);
      });
    });
  });

  it("should have progression criteria", () => {
    const all = getAllProtocols();
    all.forEach((p) => {
      p.phases.forEach((phase) => {
        expect(phase.progressionCriteria.length).toBeGreaterThan(0);
      });
    });
  });
});
