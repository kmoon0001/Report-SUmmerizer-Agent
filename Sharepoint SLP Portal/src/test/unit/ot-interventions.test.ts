import { describe, it, expect } from "vitest";
import {
  getOTInterventionById,
  getOTInterventionsByCategory,
  searchOTInterventions,
  getAllOTInterventions,
  getOTInterventionCategories,
  getOTInterventionsForIndication,
} from "../../data/ot-interventions";

describe("OT Module 4: Interventions", () => {
  describe("getOTInterventionById", () => {
    it("should return intervention by valid ID", () => {
      const intervention = getOTInterventionById("ot-int-001");
      expect(intervention).toBeDefined();
      expect(intervention?.name).toBe("Constraint-Induced Movement Therapy");
    });

    it("should return undefined for invalid ID", () => {
      const intervention = getOTInterventionById("invalid-id");
      expect(intervention).toBeUndefined();
    });

    it("should return correct intervention properties", () => {
      const intervention = getOTInterventionById("ot-int-001");
      expect(intervention?.category).toBe("motor-recovery");
      expect(intervention?.indications.length).toBeGreaterThan(0);
      expect(intervention?.techniques.length).toBeGreaterThan(0);
    });
  });

  describe("getOTInterventionsByCategory", () => {
    it("should return motor-recovery interventions", () => {
      const interventions = getOTInterventionsByCategory("motor-recovery");
      expect(interventions.length).toBeGreaterThan(0);
      expect(interventions.every((i) => i.category === "motor-recovery")).toBe(
        true,
      );
    });

    it("should return sensory-motor interventions", () => {
      const interventions = getOTInterventionsByCategory("sensory-motor");
      expect(interventions.length).toBeGreaterThan(0);
      expect(interventions.every((i) => i.category === "sensory-motor")).toBe(
        true,
      );
    });

    it("should return empty array for non-existent category", () => {
      const interventions = getOTInterventionsByCategory("non-existent");
      expect(interventions.length).toBe(0);
    });
  });

  describe("searchOTInterventions", () => {
    it("should find intervention by name", () => {
      const results = searchOTInterventions("Constraint");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((i) => i.name.includes("Constraint"))).toBe(true);
    });

    it("should find intervention by abbreviation", () => {
      const results = searchOTInterventions("CIMT");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const results1 = searchOTInterventions("therapy");
      const results2 = searchOTInterventions("THERAPY");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchOTInterventions("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllOTInterventions", () => {
    it("should return all OT interventions", () => {
      const interventions = getAllOTInterventions();
      expect(interventions.length).toBe(10);
    });

    it("should have valid intervention structure", () => {
      const interventions = getAllOTInterventions();
      interventions.forEach((intervention) => {
        expect(intervention.id).toBeDefined();
        expect(intervention.name).toBeDefined();
        expect(intervention.abbreviation).toBeDefined();
        expect(intervention.category).toBeDefined();
        expect(intervention.techniques.length).toBeGreaterThan(0);
      });
    });

    it("should have all required properties", () => {
      const interventions = getAllOTInterventions();
      interventions.forEach((i) => {
        expect(i.indications.length).toBeGreaterThan(0);
        expect(i.contraindications.length).toBeGreaterThan(0);
        expect(i.precautions.length).toBeGreaterThan(0);
        expect(i.expectedOutcomes.length).toBeGreaterThan(0);
        expect(i.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(i.evidenceLevel).toBeLessThanOrEqual(5);
        expect(i.source).toBeDefined();
        expect(i.citation).toBeDefined();
        expect(i.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getOTInterventionCategories", () => {
    it("should return all categories", () => {
      const categories = getOTInterventionCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should not have duplicates", () => {
      const categories = getOTInterventionCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getOTInterventionsForIndication", () => {
    it("should return interventions for stroke", () => {
      const interventions = getOTInterventionsForIndication("Stroke");
      expect(interventions.length).toBeGreaterThan(0);
    });

    it("should return interventions for sensory processing disorder", () => {
      const interventions =
        getOTInterventionsForIndication("Sensory processing");
      expect(interventions.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent indication", () => {
      const interventions = getOTInterventionsForIndication(
        "non-existent-indication",
      );
      expect(interventions.length).toBe(0);
    });

    it("should be case-insensitive", () => {
      const results1 = getOTInterventionsForIndication("stroke");
      const results2 = getOTInterventionsForIndication("STROKE");
      expect(results1.length).toBe(results2.length);
    });
  });

  describe("Indications", () => {
    it("should have meaningful indications", () => {
      const interventions = getAllOTInterventions();
      interventions.forEach((i) => {
        expect(i.indications.length).toBeGreaterThan(0);
        expect(i.indications.every((ind) => ind.length > 0)).toBe(true);
      });
    });
  });

  describe("Techniques", () => {
    it("should have techniques", () => {
      const interventions = getAllOTInterventions();
      interventions.forEach((i) => {
        expect(i.techniques.length).toBeGreaterThan(0);
        expect(i.techniques.every((t) => t.length > 0)).toBe(true);
      });
    });
  });

  describe("Expected Outcomes", () => {
    it("should have expected outcomes", () => {
      const interventions = getAllOTInterventions();
      interventions.forEach((i) => {
        expect(i.expectedOutcomes.length).toBeGreaterThan(0);
        expect(i.expectedOutcomes.every((o) => o.length > 0)).toBe(true);
      });
    });
  });

  describe("Evidence Level", () => {
    it("should have valid evidence levels", () => {
      const interventions = getAllOTInterventions();
      interventions.forEach((i) => {
        expect(i.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(i.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each intervention", () => {
      const interventions = getAllOTInterventions();
      interventions.forEach((i) => {
        expect(i.source).toBeDefined();
        expect(i.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each intervention", () => {
      const interventions = getAllOTInterventions();
      interventions.forEach((i) => {
        expect(i.citation).toBeDefined();
        expect(i.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Intervention Coverage", () => {
    it("should have 10 interventions total", () => {
      const interventions = getAllOTInterventions();
      expect(interventions.length).toBe(10);
    });
  });
});
