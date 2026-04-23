/**
 * PT Interventions: Modalities and Physical Agents Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllPTModalityInterventions,
  getPTModalityInterventionById,
} from "../../data/pt-interventions-modalities";

describe("PT Interventions: Modalities", () => {
  describe("Data Structure", () => {
    it("should have all 5 modality interventions", () => {
      const interventions = getAllPTModalityInterventions();
      expect(interventions.length).toBe(5);
    });

    it("should have valid intervention structure", () => {
      const interventions = getAllPTModalityInterventions();
      interventions.forEach((intervention) => {
        expect(intervention.id).toBeDefined();
        expect(intervention.name).toBeDefined();
        expect([
          "electrotherapy",
          "deep-heating",
          "superficial-cooling",
        ]).toContain(intervention.category);
        expect(intervention.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(intervention.parameters.length).toBeGreaterThan(0);
      });
    });

    it("should include core tools (TENS, NMES, US, Cryo)", () => {
      const names = getAllPTModalityInterventions().map((a) => a.name);
      expect(names.some((n) => n.includes("TENS"))).toBe(true);
      expect(names.some((n) => n.includes("NMES"))).toBe(true);
      expect(names.some((n) => n.includes("Ultrasound"))).toBe(true);
      expect(names.some((n) => n.includes("Cryotherapy"))).toBe(true);
    });
  });

  describe("getPTModalityInterventionById", () => {
    it("should return intervention by ID", () => {
      const intervention = getPTModalityInterventionById("pt-im-001");
      expect(intervention?.name).toContain("TENS");
    });
  });
});
