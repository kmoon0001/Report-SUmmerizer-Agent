/**
 * OT Interventions: Sensory & Motor Strategies Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTSensoryMotorInterventions,
  getOTSensoryMotorInterventionById,
} from "../../data/ot-interventions-sensory-motor";

describe("OT Interventions: Sensory & Motor Strategies", () => {
  describe("Data Structure", () => {
    it("should have all 5 interventions", () => {
      const interventions = getAllOTSensoryMotorInterventions();
      expect(interventions.length).toBe(5);
    });

    it("should have valid intervention structure", () => {
      const interventions = getAllOTSensoryMotorInterventions();
      interventions.forEach((intervention) => {
        expect(intervention.id).toBeDefined();
        expect(intervention.name).toBeDefined();
        expect(["sensory", "motor"]).toContain(intervention.category);
        expect(intervention.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(intervention.parameters.length).toBeGreaterThan(0);
      });
    });

    it("should include core tools (ASI, Sensory Diet, CIMT, NDT, BATRAC)", () => {
      const names = getAllOTSensoryMotorInterventions().map((a) => a.name);
      expect(names.some((n) => n.includes("Ayres Sensory Integration"))).toBe(
        true,
      );
      expect(names.some((n) => n.includes("Sensory Diet"))).toBe(true);
      expect(names.some((n) => n.includes("Constraint-Induced"))).toBe(true);
      expect(names.some((n) => n.includes("Neuro-Developmental"))).toBe(true);
      expect(names.some((n) => n.includes("Bilateral Arm Training"))).toBe(
        true,
      );
    });
  });

  describe("getOTSensoryMotorInterventionById", () => {
    it("should return intervention by ID", () => {
      const intervention = getOTSensoryMotorInterventionById("ot-ism-001");
      expect(intervention?.name).toContain("Ayres Sensory Integration");
    });
  });
});
