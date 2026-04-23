/**
 * PT Interventions: Manual Therapy Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllPTManualTherapyInterventions,
  getPTManualTherapyInterventionById,
} from "../../data/pt-interventions-manual-therapy";

describe("PT Interventions: Manual Therapy", () => {
  describe("Data Structure", () => {
    it("should have all 5 manual therapy interventions", () => {
      const interventions = getAllPTManualTherapyInterventions();
      expect(interventions.length).toBe(5);
    });

    it("should have valid intervention structure", () => {
      const interventions = getAllPTManualTherapyInterventions();
      interventions.forEach((intervention) => {
        expect(intervention.id).toBeDefined();
        expect(intervention.name).toBeDefined();
        expect(["manual-therapy", "soft-tissue"]).toContain(
          intervention.category,
        );
        expect(intervention.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(intervention.parameters.length).toBeGreaterThan(0);
      });
    });

    it("should include core tools (Maitland, HVLA, MWM)", () => {
      const names = getAllPTManualTherapyInterventions().map((a) => a.name);
      expect(names.some((n) => n.includes("Maitland"))).toBe(true);
      expect(names.some((n) => n.includes("HVLA"))).toBe(true);
      expect(names.some((n) => n.includes("MWM"))).toBe(true);
    });
  });

  describe("getPTManualTherapyInterventionById", () => {
    it("should return intervention by ID", () => {
      const intervention = getPTManualTherapyInterventionById("pt-imt-001");
      expect(intervention?.name).toContain("Joint Mobilization");
    });
  });
});
