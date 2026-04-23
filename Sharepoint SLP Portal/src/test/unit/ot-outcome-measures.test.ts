import { describe, it, expect } from "vitest";
import {
  getOTOutcomeMeasureById,
  getOTOutcomeMeasuresByCategory,
  searchOTOutcomeMeasures,
  getAllOTOutcomeMeasures,
  getOTOutcomeMeasureCategories,
  getOTOutcomeMeasuresForIndication,
} from "../../data/ot-outcome-measures";

describe("OT Module 1: Outcome Measures", () => {
  describe("getOTOutcomeMeasureById", () => {
    it("should return outcome measure by valid ID", () => {
      const measure = getOTOutcomeMeasureById("ot-om-001");
      expect(measure).toBeDefined();
      expect(measure?.name).toBe("Canadian Occupational Performance Measure");
    });

    it("should return undefined for invalid ID", () => {
      const measure = getOTOutcomeMeasureById("invalid-id");
      expect(measure).toBeUndefined();
    });

    it("should return correct measure properties", () => {
      const measure = getOTOutcomeMeasureById("ot-om-001");
      expect(measure?.category).toBe("functional-performance");
      expect(measure?.domains.length).toBeGreaterThan(0);
      expect(measure?.indications.length).toBeGreaterThan(0);
    });
  });

  describe("getOTOutcomeMeasuresByCategory", () => {
    it("should return functional-performance measures", () => {
      const measures = getOTOutcomeMeasuresByCategory("functional-performance");
      expect(measures.length).toBeGreaterThan(0);
      expect(
        measures.every((m) => m.category === "functional-performance"),
      ).toBe(true);
    });

    it("should return hand-function measures", () => {
      const measures = getOTOutcomeMeasuresByCategory("hand-function");
      expect(measures.length).toBeGreaterThan(0);
      expect(measures.every((m) => m.category === "hand-function")).toBe(true);
    });

    it("should return empty array for non-existent category", () => {
      const measures = getOTOutcomeMeasuresByCategory("non-existent");
      expect(measures.length).toBe(0);
    });
  });

  describe("searchOTOutcomeMeasures", () => {
    it("should find measure by name", () => {
      const results = searchOTOutcomeMeasures("Canadian");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m) => m.name.includes("Canadian"))).toBe(true);
    });

    it("should find measure by abbreviation", () => {
      const results = searchOTOutcomeMeasures("COPM");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchOTOutcomeMeasures("functional");
      const results2 = searchOTOutcomeMeasures("FUNCTIONAL");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchOTOutcomeMeasures("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllOTOutcomeMeasures", () => {
    it("should return all OT outcome measures", () => {
      const measures = getAllOTOutcomeMeasures();
      expect(measures.length).toBe(15);
    });

    it("should have valid measure structure", () => {
      const measures = getAllOTOutcomeMeasures();
      measures.forEach((measure) => {
        expect(measure.id).toBeDefined();
        expect(measure.name).toBeDefined();
        expect(measure.abbreviation).toBeDefined();
        expect(measure.category).toBeDefined();
        expect(measure.domains.length).toBeGreaterThan(0);
      });
    });

    it("should have all required properties", () => {
      const measures = getAllOTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.indications.length).toBeGreaterThan(0);
        expect(m.psychometricProperties).toBeDefined();
        expect(m.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(m.evidenceLevel).toBeLessThanOrEqual(5);
        expect(m.source).toBeDefined();
        expect(m.citation).toBeDefined();
        expect(m.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getOTOutcomeMeasureCategories", () => {
    it("should return all categories", () => {
      const categories = getOTOutcomeMeasureCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getOTOutcomeMeasureCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getOTOutcomeMeasuresForIndication", () => {
    it("should return measures for functional limitation", () => {
      const measures = getOTOutcomeMeasuresForIndication(
        "Functional limitation",
      );
      expect(measures.length).toBeGreaterThan(0);
    });

    it("should return measures for hand function assessment", () => {
      const measures = getOTOutcomeMeasuresForIndication("Hand function");
      expect(measures.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent indication", () => {
      const measures = getOTOutcomeMeasuresForIndication(
        "non-existent-indication",
      );
      expect(measures.length).toBe(0);
    });

    it("should be case-insensitive", () => {
      const results1 = getOTOutcomeMeasuresForIndication(
        "functional limitation",
      );
      const results2 = getOTOutcomeMeasuresForIndication(
        "FUNCTIONAL LIMITATION",
      );
      expect(results1.length).toBe(results2.length);
    });
  });

  describe("Domains", () => {
    it("should have meaningful domains", () => {
      const measures = getAllOTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.domains.length).toBeGreaterThan(0);
        expect(m.domains.every((d) => d.length > 0)).toBe(true);
      });
    });
  });

  describe("Psychometric Properties", () => {
    it("should have reliability information", () => {
      const measures = getAllOTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.psychometricProperties.reliability).toBeDefined();
        expect(m.psychometricProperties.reliability.length).toBeGreaterThan(0);
      });
    });

    it("should have validity information", () => {
      const measures = getAllOTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.psychometricProperties.validity).toBeDefined();
        expect(m.psychometricProperties.validity.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Evidence Level", () => {
    it("should have valid evidence levels", () => {
      const measures = getAllOTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(m.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each measure", () => {
      const measures = getAllOTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.source).toBeDefined();
        expect(m.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each measure", () => {
      const measures = getAllOTOutcomeMeasures();
      measures.forEach((m) => {
        expect(m.citation).toBeDefined();
        expect(m.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Measure Coverage", () => {
    it("should have 15 outcome measures total", () => {
      const measures = getAllOTOutcomeMeasures();
      expect(measures.length).toBe(15);
    });
  });
});
