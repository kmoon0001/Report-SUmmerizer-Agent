/**
 * OT Interventions: Splinting & Orthotics Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTSplintingOrthoticsInterventions,
  getOTSplintingOrthoticsInterventionById,
} from "../../data/ot-interventions-splinting-orthotics";

describe("OT Interventions: Splinting & Orthotics", () => {
  describe("Data Structure", () => {
    it("should have all 5 interventions", () => {
      const interventions = getAllOTSplintingOrthoticsInterventions();
      expect(interventions.length).toBe(5);
    });

    it("should have valid intervention structure", () => {
      const interventions = getAllOTSplintingOrthoticsInterventions();
      interventions.forEach((intervention) => {
        expect(intervention.id).toBeDefined();
        expect(intervention.name).toBeDefined();
        expect(["static-splints", "dynamic-splints", "orthotics"]).toContain(
          intervention.category,
        );
        expect(intervention.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(intervention.parameters.length).toBeGreaterThan(0);
      });
    });

    it("should include core tools (Resting Hand, Wrist Cock-Up, Thumb Spica, Outrigger, Serial)", () => {
      const names = getAllOTSplintingOrthoticsInterventions().map(
        (a) => a.name,
      );
      expect(names.some((n) => n.includes("Resting Hand"))).toBe(true);
      expect(names.some((n) => n.includes("Cock-Up"))).toBe(true);
      expect(names.some((n) => n.includes("Spica"))).toBe(true);
      expect(names.some((n) => n.includes("Dynamic"))).toBe(true);
      expect(names.some((n) => n.includes("Serial Casting"))).toBe(true);
    });
  });

  describe("getOTSplintingOrthoticsInterventionById", () => {
    it("should return intervention by ID", () => {
      const intervention =
        getOTSplintingOrthoticsInterventionById("ot-iso-001");
      expect(intervention?.name).toContain("Resting Hand Splint");
    });
  });
});
