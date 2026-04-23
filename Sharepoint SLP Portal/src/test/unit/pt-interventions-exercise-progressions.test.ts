/**
 * PT Interventions: Exercise Progressions Tests
 */

import { describe, it, expect } from "vitest";
import {
  getAllPTExerciseInterventions,
  getPTExerciseInterventionById,
} from "../../data/pt-interventions-exercise-progressions";

describe("PT Interventions: Exercise Progressions", () => {
  describe("Data Structure", () => {
    it("should have all 5 exercise interventions", () => {
      const interventions = getAllPTExerciseInterventions();
      expect(interventions.length).toBe(5);
    });

    it("should have valid intervention structure", () => {
      const interventions = getAllPTExerciseInterventions();
      interventions.forEach((intervention) => {
        expect(intervention.id).toBeDefined();
        expect(intervention.name).toBeDefined();
        expect([
          "strengthening",
          "balance-proprioception",
          "endurance",
          "power-agility",
        ]).toContain(intervention.category);
        expect(intervention.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(intervention.parameters.length).toBeGreaterThan(0);
      });
    });

    it("should include core tools (Resistance, Eccentric, Balance, Aerobic, Plyometric)", () => {
      const names = getAllPTExerciseInterventions().map((a) => a.name);
      expect(names.some((n) => n.includes("Resistance Training"))).toBe(true);
      expect(names.some((n) => n.includes("Eccentric"))).toBe(true);
      expect(names.some((n) => n.includes("Balance"))).toBe(true);
      expect(names.some((n) => n.includes("Aerobic Endurance"))).toBe(true);
      expect(names.some((n) => n.includes("Plyometric"))).toBe(true);
    });
  });

  describe("getPTExerciseInterventionById", () => {
    it("should return intervention by ID", () => {
      const intervention = getPTExerciseInterventionById("pt-iex-001");
      expect(intervention?.name).toContain("Resistance Training");
    });
  });
});
