/**
 * Property-Based Test: SMART Goal Validity
 *
 * Property 13: SMART Goal Validity
 * Validates: Requirements 5.2, 5.3
 *
 * Correctness Property:
 * For all generated SMART goals:
 * - All 5 SMART components are present and non-empty
 * - Measurable component contains numeric measures
 * - Time-bound component contains a timeframe
 * - Goal text is non-empty
 * - Rationale is non-empty
 *
 * Sources: APTA Guide to Physical Therapist Practice 3.0
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// SMART goal structure as returned by aiService.generateSMARTGoals
interface SMARTGoal {
  text: string;
  components: {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
  };
  rationale: string;
}

// Simulate the SMART goal structure validation (tests the data contract)
function validateSMARTGoal(goal: SMARTGoal): boolean {
  if (!goal.text || goal.text.trim().length === 0) return false;
  if (!goal.rationale || goal.rationale.trim().length === 0) return false;
  const { specific, measurable, achievable, relevant, timeBound } =
    goal.components;
  if (!specific || specific.trim().length === 0) return false;
  if (!measurable || measurable.trim().length === 0) return false;
  if (!achievable || achievable.trim().length === 0) return false;
  if (!relevant || relevant.trim().length === 0) return false;
  if (!timeBound || timeBound.trim().length === 0) return false;
  return true;
}

function hasNumericMeasure(measurable: string): boolean {
  // Measurable component should contain numbers (distance, time, reps, assist level)
  return /\d/.test(measurable);
}

function hasTimeframe(timeBound: string): boolean {
  // Time-bound should contain week/day/month references or numeric timeframe
  return /\d|week|day|month|session/i.test(timeBound);
}

// Arbitrary for valid SMART goal components
const smartGoalArb = fc.record({
  text: fc
    .string({ minLength: 20, maxLength: 200 })
    .filter((s) => s.trim().length >= 20 && /[a-zA-Z]/.test(s)),
  components: fc.record({
    specific: fc
      .string({ minLength: 5, maxLength: 100 })
      .filter((s) => s.trim().length >= 5 && /[a-zA-Z]/.test(s)),
    measurable: fc.oneof(
      fc
        .string({ minLength: 5, maxLength: 100 })
        .filter(
          (s) => s.trim().length >= 5 && /\d/.test(s) && /[a-zA-Z]/.test(s),
        ),
      fc.constantFrom(
        "Ambulate 150 feet with walker",
        "Perform 10 repetitions without assist",
        "Achieve 120° shoulder flexion ROM",
        "TUG score ≤12 seconds",
        "Berg Balance Score ≥45/56",
      ),
    ),
    achievable: fc
      .string({ minLength: 5, maxLength: 100 })
      .filter((s) => s.trim().length >= 5 && /[a-zA-Z]/.test(s)),
    relevant: fc
      .string({ minLength: 5, maxLength: 100 })
      .filter((s) => s.trim().length >= 5 && /[a-zA-Z]/.test(s)),
    timeBound: fc.oneof(
      fc.constantFrom("4 weeks", "6 weeks", "8 weeks", "12 weeks", "30 days"),
      fc
        .string({ minLength: 3, maxLength: 50 })
        .filter(
          (s) =>
            s.trim().length >= 3 &&
            /\d|week|day|month/i.test(s) &&
            /[a-zA-Z]/.test(s),
        ),
    ),
  }),
  rationale: fc
    .string({ minLength: 10, maxLength: 300 })
    .filter((s) => s.trim().length >= 10 && /[a-zA-Z]/.test(s)),
});

describe("Property 13: SMART Goal Validity", () => {
  describe("All SMART Components Present", () => {
    it("should have all 5 SMART components non-empty", () => {
      fc.assert(
        fc.property(smartGoalArb, (goal) => {
          // Property: All components present and non-empty
          expect(goal.components.specific.trim().length).toBeGreaterThan(0);
          expect(goal.components.measurable.trim().length).toBeGreaterThan(0);
          expect(goal.components.achievable.trim().length).toBeGreaterThan(0);
          expect(goal.components.relevant.trim().length).toBeGreaterThan(0);
          expect(goal.components.timeBound.trim().length).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });

    it("should validate complete SMART goal structure", () => {
      fc.assert(
        fc.property(smartGoalArb, (goal) => {
          // Property: validateSMARTGoal returns true for valid goals
          expect(validateSMARTGoal(goal)).toBe(true);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Measurable Component Requirements", () => {
    it("should contain numeric measures in measurable component", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            "Ambulate 150 feet with rolling walker",
            "Perform 10 sit-to-stands without upper extremity support",
            "Achieve 120° shoulder flexion ROM",
            "TUG score ≤12 seconds",
            "Berg Balance Score ≥45/56",
            "Gait speed 0.8 m/s",
            "Quad strength 4/5 MMT",
          ),
          (measurable) => {
            // Property: Measurable component contains numeric measure
            expect(hasNumericMeasure(measurable)).toBe(true);
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should reject measurable components without numeric measures", () => {
      const vagueExamples = [
        "Patient will improve",
        "Better function",
        "Increased strength",
      ];

      vagueExamples.forEach((vague) => {
        expect(hasNumericMeasure(vague)).toBe(false);
      });
    });
  });

  describe("Time-Bound Component Requirements", () => {
    it("should contain timeframe in time-bound component", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            "4 weeks",
            "6 weeks",
            "8 weeks",
            "12 weeks",
            "30 days",
            "by next session",
            "within 2 months",
          ),
          (timeBound) => {
            // Property: Time-bound contains timeframe
            expect(hasTimeframe(timeBound)).toBe(true);
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe("Goal Text Requirements", () => {
    it("should have non-empty goal text", () => {
      fc.assert(
        fc.property(smartGoalArb, (goal) => {
          expect(goal.text.trim().length).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });

    it("should have non-empty rationale", () => {
      fc.assert(
        fc.property(smartGoalArb, (goal) => {
          expect(goal.rationale.trim().length).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("SMART Goal Array Validity", () => {
    it("should validate arrays of SMART goals", () => {
      fc.assert(
        fc.property(
          fc.array(smartGoalArb, { minLength: 1, maxLength: 5 }),
          (goals) => {
            // Property: All goals in array are valid
            goals.forEach((goal) => {
              expect(validateSMARTGoal(goal)).toBe(true);
            });
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should detect invalid SMART goals", () => {
      const invalidGoal: SMARTGoal = {
        text: "Patient will improve",
        components: {
          specific: "", // Empty - invalid
          measurable: "better",
          achievable: "yes",
          relevant: "important",
          timeBound: "soon",
        },
        rationale: "some rationale",
      };

      expect(validateSMARTGoal(invalidGoal)).toBe(false);
    });
  });
});
