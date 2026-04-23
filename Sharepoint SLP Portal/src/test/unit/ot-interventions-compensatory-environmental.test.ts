/**
 * OT Interventions: Compensatory & Environmental Strategies Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTCompensatoryInterventions,
  getOTCompensatoryInterventionById,
} from "../../data/ot-interventions-compensatory-environmental";

describe("OT Interventions: Compensatory & Environmental Strategies", () => {
  describe("Data Structure", () => {
    it("should have all 5 interventions", () => {
      const interventions = getAllOTCompensatoryInterventions();
      expect(interventions.length).toBe(5);
    });

    it("should have valid intervention structure", () => {
      const interventions = getAllOTCompensatoryInterventions();
      interventions.forEach((intervention) => {
        expect(intervention.id).toBeDefined();
        expect(intervention.name).toBeDefined();
        expect(["compensatory", "environmental"]).toContain(
          intervention.category,
        );
        expect(intervention.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(intervention.parameters.length).toBeGreaterThan(0);
      });
    });

    it("should include core tools (4 P's, Joint Protection, Fall Prevention, Low Vision, Cognitive)", () => {
      const names = getAllOTCompensatoryInterventions().map((a) => a.name);
      expect(names.some((n) => n.includes("Energy Conservation"))).toBe(true);
      expect(names.some((n) => n.includes("Joint Protection"))).toBe(true);
      expect(names.some((n) => n.includes("Home Environmental"))).toBe(true);
      expect(names.some((n) => n.includes("Visual Compensatory"))).toBe(true);
      expect(names.some((n) => n.includes("Cognitive Compensatory"))).toBe(
        true,
      );
    });
  });

  describe("getOTCompensatoryInterventionById", () => {
    it("should return intervention by ID", () => {
      const intervention = getOTCompensatoryInterventionById("ot-ice-001");
      expect(intervention?.name).toContain("Energy Conservation");
    });
  });
});
