/**
 * OT Interventions: Cognitive & Behavioral Strategies Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllOTCognitiveBehavioralInterventions,
  getOTCognitiveBehavioralInterventionById,
} from "../../data/ot-interventions-cognitive-behavioral";

describe("OT Interventions: Cognitive & Behavioral Strategies", () => {
  describe("Data Structure", () => {
    it("should have all 5 interventions", () => {
      const interventions = getAllOTCognitiveBehavioralInterventions();
      expect(interventions.length).toBe(5);
    });

    it("should have valid intervention structure", () => {
      const interventions = getAllOTCognitiveBehavioralInterventions();
      interventions.forEach((intervention) => {
        expect(intervention.id).toBeDefined();
        expect(intervention.name).toBeDefined();
        expect(["cognitive", "behavioral"]).toContain(intervention.category);
        expect(intervention.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(intervention.parameters.length).toBeGreaterThan(0);
      });
    });

    it("should include core tools (CBT, CO-OP, MI, DBT, Remedial)", () => {
      const names = getAllOTCognitiveBehavioralInterventions().map(
        (a) => a.name,
      );
      expect(
        names.some((n) => n.includes("Cognitive-Behavioral Therapy")),
      ).toBe(true);
      expect(names.some((n) => n.includes("Metacognitive"))).toBe(true);
      expect(names.some((n) => n.includes("Motivation Interviewing"))).toBe(
        true,
      );
      expect(
        names.some((n) => n.includes("Dialectical Behavior Therapy")),
      ).toBe(true);
      expect(names.some((n) => n.includes("Remedial"))).toBe(true);
    });
  });

  describe("getOTCognitiveBehavioralInterventionById", () => {
    it("should return intervention by ID", () => {
      const intervention =
        getOTCognitiveBehavioralInterventionById("ot-icb-001");
      expect(intervention?.name).toContain("CBT");
    });
  });
});
