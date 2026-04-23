/**
 * OT Interventions: Adaptive Equipment Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTAdaptiveEquipmentInterventions,
  getOTAdaptiveEquipmentInterventionById,
} from "../../data/ot-interventions-adaptive-equipment";

describe("OT Interventions: Adaptive Equipment", () => {
  describe("Data Structure", () => {
    it("should have all 5 interventions", () => {
      const interventions = getAllOTAdaptiveEquipmentInterventions();
      expect(interventions.length).toBe(5);
    });

    it("should have valid intervention structure", () => {
      const interventions = getAllOTAdaptiveEquipmentInterventions();
      interventions.forEach((intervention) => {
        expect(intervention.id).toBeDefined();
        expect(intervention.name).toBeDefined();
        expect(["adaptive-equipment", "assistive-technology"]).toContain(
          intervention.category,
        );
        expect(intervention.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(intervention.parameters.length).toBeGreaterThan(0);
      });
    });

    it("should include core tools (Dressing, Feeding, AAC, Wheelchairs, ECUs)", () => {
      const names = getAllOTAdaptiveEquipmentInterventions().map((a) => a.name);
      expect(names.some((n) => n.includes("Dressing"))).toBe(true);
      expect(names.some((n) => n.includes("Feeding"))).toBe(true);
      expect(names.some((n) => n.includes("AAC"))).toBe(true);
      expect(names.some((n) => n.includes("Wheelchair"))).toBe(true);
      expect(names.some((n) => n.includes("ECUs"))).toBe(true);
    });
  });

  describe("getOTAdaptiveEquipmentInterventionById", () => {
    it("should return intervention by ID", () => {
      const intervention = getOTAdaptiveEquipmentInterventionById("ot-iae-001");
      expect(intervention?.name).toContain("Dressing & Hygiene");
    });
  });
});
