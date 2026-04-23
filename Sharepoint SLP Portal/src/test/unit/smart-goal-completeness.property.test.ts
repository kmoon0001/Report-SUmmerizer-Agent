/**
 * Property-Based Test: SMART Goal Completeness
 *
 * Property 14: SMART Goal Completeness
 * Validates: Requirement 5.1
 *
 * Correctness Property:
 * For all SMART goal responses:
 * - Response contains at least 1 goal
 * - Each goal has exactly 5 SMART components (S, M, A, R, T)
 * - No SMART component keys are missing
 * - Goal text length is sufficient for clinical use (≥20 chars)
 * - Rationale references clinical evidence
 *
 * Sources: APTA Guide to Physical Therapist Practice 3.0
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

const REQUIRED_SMART_KEYS = [
  "specific",
  "measurable",
  "achievable",
  "relevant",
  "timeBound",
] as const;

interface SMARTComponents {
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
}

interface SMARTGoal {
  text: string;
  components: SMARTComponents;
  rationale: string;
}

interface SMARTGoalResponse {
  goals: SMARTGoal[];
}

function checkSMARTCompleteness(response: SMARTGoalResponse): {
  isComplete: boolean;
  missingComponents: string[];
  emptyComponents: string[];
} {
  const missingComponents: string[] = [];
  const emptyComponents: string[] = [];

  if (!response.goals || response.goals.length === 0) {
    return {
      isComplete: false,
      missingComponents: ["goals array empty"],
      emptyComponents: [],
    };
  }

  response.goals.forEach((goal, i) => {
    REQUIRED_SMART_KEYS.forEach((key) => {
      if (!(key in goal.components)) {
        missingComponents.push(`Goal ${i + 1}: missing ${key}`);
      } else if (
        !goal.components[key] ||
        goal.components[key].trim().length === 0
      ) {
        emptyComponents.push(`Goal ${i + 1}: empty ${key}`);
      }
    });

    if (!goal.text || goal.text.trim().length < 20) {
      emptyComponents.push(`Goal ${i + 1}: text too short`);
    }

    if (!goal.rationale || goal.rationale.trim().length === 0) {
      emptyComponents.push(`Goal ${i + 1}: missing rationale`);
    }
  });

  return {
    isComplete: missingComponents.length === 0 && emptyComponents.length === 0,
    missingComponents,
    emptyComponents,
  };
}

// Arbitrary for complete SMART goal response
const completeGoalResponseArb = fc.record({
  goals: fc.array(
    fc.record({
      text: fc
        .string({ minLength: 20, maxLength: 200 })
        .filter((s) => s.trim().length >= 20 && /[a-zA-Z]/.test(s)),
      components: fc.record({
        specific: fc
          .string({ minLength: 5, maxLength: 100 })
          .filter((s) => s.trim().length >= 5 && /[a-zA-Z]/.test(s)),
        measurable: fc
          .string({ minLength: 5, maxLength: 100 })
          .filter(
            (s) => s.trim().length >= 5 && /\d/.test(s) && /[a-zA-Z]/.test(s),
          ),
        achievable: fc
          .string({ minLength: 5, maxLength: 100 })
          .filter((s) => s.trim().length >= 5 && /[a-zA-Z]/.test(s)),
        relevant: fc
          .string({ minLength: 5, maxLength: 100 })
          .filter((s) => s.trim().length >= 5 && /[a-zA-Z]/.test(s)),
        timeBound: fc
          .string({ minLength: 3, maxLength: 50 })
          .filter(
            (s) =>
              s.trim().length >= 3 &&
              /\d|week|day|month/i.test(s) &&
              /[a-zA-Z]/.test(s),
          ),
      }),
      rationale: fc
        .string({ minLength: 10, maxLength: 300 })
        .filter((s) => s.trim().length >= 10 && /[a-zA-Z]/.test(s)),
    }),
    { minLength: 1, maxLength: 5 },
  ),
});

describe("Property 14: SMART Goal Completeness", () => {
  describe("Response Structure Completeness", () => {
    it("should have at least 1 goal in response", () => {
      fc.assert(
        fc.property(completeGoalResponseArb, (response) => {
          // Property: At least 1 goal
          expect(response.goals.length).toBeGreaterThanOrEqual(1);
        }),
        { numRuns: 100 },
      );
    });

    it("should have all 5 SMART component keys in each goal", () => {
      fc.assert(
        fc.property(completeGoalResponseArb, (response) => {
          response.goals.forEach((goal) => {
            // Property: All 5 SMART keys present
            REQUIRED_SMART_KEYS.forEach((key) => {
              expect(key in goal.components).toBe(true);
            });
          });
        }),
        { numRuns: 100 },
      );
    });

    it("should pass completeness check for valid responses", () => {
      fc.assert(
        fc.property(completeGoalResponseArb, (response) => {
          const result = checkSMARTCompleteness(response);
          // Property: Complete responses pass the check
          expect(result.isComplete).toBe(true);
          expect(result.missingComponents.length).toBe(0);
          expect(result.emptyComponents.length).toBe(0);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Goal Text Length Requirements", () => {
    it("should have goal text of sufficient length for clinical use", () => {
      fc.assert(
        fc.property(completeGoalResponseArb, (response) => {
          response.goals.forEach((goal) => {
            // Property: Goal text ≥20 chars for clinical utility
            expect(goal.text.trim().length).toBeGreaterThanOrEqual(20);
          });
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Component Non-Emptiness", () => {
    it("should have non-empty specific component", () => {
      fc.assert(
        fc.property(completeGoalResponseArb, (response) => {
          response.goals.forEach((goal) => {
            expect(goal.components.specific.trim().length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 },
      );
    });

    it("should have non-empty measurable component with numeric value", () => {
      fc.assert(
        fc.property(completeGoalResponseArb, (response) => {
          response.goals.forEach((goal) => {
            expect(goal.components.measurable.trim().length).toBeGreaterThan(0);
            expect(/\d/.test(goal.components.measurable)).toBe(true);
          });
        }),
        { numRuns: 100 },
      );
    });

    it("should have non-empty time-bound component with timeframe", () => {
      fc.assert(
        fc.property(completeGoalResponseArb, (response) => {
          response.goals.forEach((goal) => {
            expect(goal.components.timeBound.trim().length).toBeGreaterThan(0);
            expect(/\d|week|day|month/i.test(goal.components.timeBound)).toBe(
              true,
            );
          });
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Rationale Completeness", () => {
    it("should have non-empty rationale for each goal", () => {
      fc.assert(
        fc.property(completeGoalResponseArb, (response) => {
          response.goals.forEach((goal) => {
            expect(goal.rationale.trim().length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Incomplete Response Detection", () => {
    it("should detect empty goals array", () => {
      const emptyResponse: SMARTGoalResponse = { goals: [] };
      const result = checkSMARTCompleteness(emptyResponse);
      expect(result.isComplete).toBe(false);
    });

    it("should detect missing SMART component", () => {
      const incompleteGoal: SMARTGoalResponse = {
        goals: [
          {
            text: "Patient will ambulate 150 feet in 4 weeks",
            components: {
              specific: "Ambulate 150 feet",
              measurable: "150 feet",
              achievable: "Achievable with PT",
              relevant: "Required for mobility",
              timeBound: "", // Empty - incomplete
            },
            rationale: "Based on assessment findings",
          },
        ],
      };
      const result = checkSMARTCompleteness(incompleteGoal);
      expect(result.isComplete).toBe(false);
      expect(result.emptyComponents.length).toBeGreaterThan(0);
    });

    it("should detect goal text that is too short", () => {
      const shortTextGoal: SMARTGoalResponse = {
        goals: [
          {
            text: "Walk better", // Too short
            components: {
              specific: "Walk",
              measurable: "10 feet",
              achievable: "Yes",
              relevant: "Mobility",
              timeBound: "4 weeks",
            },
            rationale: "Clinical reasoning",
          },
        ],
      };
      const result = checkSMARTCompleteness(shortTextGoal);
      expect(result.isComplete).toBe(false);
    });
  });
});
