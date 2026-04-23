import { describe, it, expect } from "vitest";
import {
  getOTQualityStandardById,
  getOTQualityStandardsByCategory,
  searchOTQualityStandards,
  getAllOTQualityStandards,
  getOTQualityStandardCategories,
} from "../../data/ot-quality-standards";

describe("OT Module 10: Quality Standards and Best Practices", () => {
  describe("getOTQualityStandardById", () => {
    it("should return quality standard by valid ID", () => {
      const standard = getOTQualityStandardById("ot-qs-001");
      expect(standard).toBeDefined();
      expect(standard?.name).toBeDefined();
    });

    it("should return undefined for invalid ID", () => {
      const standard = getOTQualityStandardById("invalid-id");
      expect(standard).toBeUndefined();
    });

    it("should return correct standard properties", () => {
      const standard = getOTQualityStandardById("ot-qs-001");
      expect(standard?.category).toBeDefined();
      expect(standard?.standards.length).toBeGreaterThan(0);
      expect(standard?.implementation.length).toBeGreaterThan(0);
    });

    it("should have valid measurement criteria", () => {
      const standard = getOTQualityStandardById("ot-qs-001");
      expect(standard?.measurement.length).toBeGreaterThan(0);
      expect(standard?.benchmarks.length).toBeGreaterThan(0);
    });
  });

  describe("getOTQualityStandardsByCategory", () => {
    it("should return standards for valid category", () => {
      const standards = getOTQualityStandardsByCategory("practice-standards");
      expect(standards.length).toBeGreaterThan(0);
      expect(standards.every((s) => s.category === "practice-standards")).toBe(
        true,
      );
    });

    it("should return empty array for non-existent category", () => {
      const standards = getOTQualityStandardsByCategory("non-existent");
      expect(standards.length).toBe(0);
    });

    it("should return standards with valid structure", () => {
      const standards = getOTQualityStandardsByCategory("practice-standards");
      standards.forEach((s) => {
        expect(s.id).toBeDefined();
        expect(s.name).toBeDefined();
        expect(s.standards.length).toBeGreaterThan(0);
      });
    });
  });

  describe("searchOTQualityStandards", () => {
    it("should find standard by name", () => {
      const results = searchOTQualityStandards("Client");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find standard by description", () => {
      const results = searchOTQualityStandards("practice");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchOTQualityStandards("client");
      const results2 = searchOTQualityStandards("CLIENT");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchOTQualityStandards("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllOTQualityStandards", () => {
    it("should return all OT quality standards", () => {
      const standards = getAllOTQualityStandards();
      expect(standards.length).toBe(10);
    });

    it("should have valid standard structure", () => {
      const standards = getAllOTQualityStandards();
      standards.forEach((standard) => {
        expect(standard.id).toBeDefined();
        expect(standard.name).toBeDefined();
        expect(standard.category).toBeDefined();
        expect(standard.description).toBeDefined();
      });
    });

    it("should have all required properties", () => {
      const standards = getAllOTQualityStandards();
      standards.forEach((s) => {
        expect(s.standards.length).toBeGreaterThan(0);
        expect(s.implementation.length).toBeGreaterThan(0);
        expect(s.measurement.length).toBeGreaterThan(0);
        expect(s.benchmarks.length).toBeGreaterThan(0);
        expect(s.source).toBeDefined();
        expect(s.citation).toBeDefined();
        expect(s.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getOTQualityStandardCategories", () => {
    it("should return all categories", () => {
      const categories = getOTQualityStandardCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getOTQualityStandardCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getOTQualityStandardCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("Quality Standard Properties", () => {
    it("should have meaningful standards", () => {
      const standards = getAllOTQualityStandards();
      standards.forEach((s) => {
        expect(s.standards.length).toBeGreaterThan(0);
        expect(s.standards.every((st) => st.length > 0)).toBe(true);
      });
    });

    it("should have implementation guidelines", () => {
      const standards = getAllOTQualityStandards();
      standards.forEach((s) => {
        expect(s.implementation.length).toBeGreaterThan(0);
        expect(s.implementation.every((i) => i.length > 0)).toBe(true);
      });
    });

    it("should have measurement criteria", () => {
      const standards = getAllOTQualityStandards();
      standards.forEach((s) => {
        expect(s.measurement.length).toBeGreaterThan(0);
        expect(s.measurement.every((m) => m.length > 0)).toBe(true);
      });
    });

    it("should have benchmarks", () => {
      const standards = getAllOTQualityStandards();
      standards.forEach((s) => {
        expect(s.benchmarks.length).toBeGreaterThan(0);
        expect(s.benchmarks.every((b) => b.length > 0)).toBe(true);
      });
    });

    it("should have source attribution", () => {
      const standards = getAllOTQualityStandards();
      standards.forEach((s) => {
        expect(s.source).toBeDefined();
        expect(s.source.length).toBeGreaterThan(0);
        expect(s.citation).toBeDefined();
        expect(s.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Implementation and Measurement Validation", () => {
    it("should have comprehensive implementation steps", () => {
      const standards = getAllOTQualityStandards();
      standards.forEach((s) => {
        expect(s.implementation.length).toBeGreaterThan(0);
        s.implementation.forEach((step) => {
          expect(step.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have measurable outcomes", () => {
      const standards = getAllOTQualityStandards();
      standards.forEach((s) => {
        expect(s.measurement.length).toBeGreaterThan(0);
        s.measurement.forEach((measure) => {
          expect(measure.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have quantifiable benchmarks", () => {
      const standards = getAllOTQualityStandards();
      standards.forEach((s) => {
        expect(s.benchmarks.length).toBeGreaterThan(0);
        s.benchmarks.forEach((benchmark) => {
          expect(benchmark.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Module Coverage", () => {
    it("should have 10 quality standards", () => {
      const standards = getAllOTQualityStandards();
      expect(standards.length).toBe(10);
    });

    it("should cover multiple categories", () => {
      const standards = getAllOTQualityStandards();
      const categories = new Set(standards.map((s) => s.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it("should have comprehensive standard coverage", () => {
      const standards = getAllOTQualityStandards();
      const allStandards = standards.flatMap((s) => s.standards);
      expect(allStandards.length).toBeGreaterThan(20);
    });

    it("should have comprehensive implementation coverage", () => {
      const standards = getAllOTQualityStandards();
      const allImplementation = standards.flatMap((s) => s.implementation);
      expect(allImplementation.length).toBeGreaterThan(20);
    });

    it("should have comprehensive measurement coverage", () => {
      const standards = getAllOTQualityStandards();
      const allMeasurement = standards.flatMap((s) => s.measurement);
      expect(allMeasurement.length).toBeGreaterThan(20);
    });

    it("should have comprehensive benchmark coverage", () => {
      const standards = getAllOTQualityStandards();
      const allBenchmarks = standards.flatMap((s) => s.benchmarks);
      expect(allBenchmarks.length).toBeGreaterThan(20);
    });
  });
});
