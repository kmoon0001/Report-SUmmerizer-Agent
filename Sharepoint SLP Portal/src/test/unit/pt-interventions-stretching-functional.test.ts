/**
 * PT Interventions: Stretching & Functional Training Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllPTStretchingFunctionalInterventions,
  getPTStretchingFunctionalInterventionById,
} from "../../data/pt-interventions-stretching-functional";

describe("PT Interventions: Stretching & Functional Training", () => {
  describe("Data Structure", () => {
    it("should have all 5 interventions", () => {
      const interventions = getAllPTStretchingFunctionalInterventions();
      expect(interventions.length).toBe(5);
    });

    it("should have valid intervention structure", () => {
      const interventions = getAllPTStretchingFunctionalInterventions();
      interventions.forEach((intervention) => {
        expect(intervention.id).toBeDefined();
        expect(intervention.name).toBeDefined();
        expect(["stretching-flexibility", "functional-training"]).toContain(
          intervention.category,
        );
        expect(intervention.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(intervention.parameters.length).toBeGreaterThan(0);
      });
    });

    it("should include core tools (Static, PNF, Dynamic, Task-Specific, Neuromuscular)", () => {
      const names = getAllPTStretchingFunctionalInterventions().map(
        (a) => a.name,
      );
      expect(names.some((n) => n.includes("Static Stretching"))).toBe(true);
      expect(names.some((n) => n.includes("PNF"))).toBe(true);
      expect(names.some((n) => n.includes("Dynamic Stretching"))).toBe(true);
      expect(names.some((n) => n.includes("Task-Specific"))).toBe(true);
      expect(names.some((n) => n.includes("Neuromuscular Re-education"))).toBe(
        true,
      );
    });
  });

  describe("getPTStretchingFunctionalInterventionById", () => {
    it("should return intervention by ID", () => {
      const intervention =
        getPTStretchingFunctionalInterventionById("pt-isf-001");
      expect(intervention?.name).toContain("Static Stretching");
    });
  });
});
