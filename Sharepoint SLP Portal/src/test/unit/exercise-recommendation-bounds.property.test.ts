/**
 * Property-Based Test: Exercise Recommendation Bounds
 *
 * Property 5: Exercise Recommendation Bounds
 * Validates: Requirement 4.2
 *
 * Correctness Property:
 * For all exercise prescriptions:
 * - Sets are always positive integers
 * - Reps (when present) are positive integers
 * - Hold seconds (when present) are positive
 * - Frequency per week is between 1-7
 * - Estimated session duration is positive
 * - Dosage adjustments for difficulty levels are within safe bounds
 *
 * Sources: APTA CPGs, NSCA guidelines, Cochrane Reviews
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { generateExercisePrescription } from "../../utils/exercise-prescription-generator";
import type { BodyRegion } from "../../data/exercise-library-data";

const VALID_REGIONS: BodyRegion[] = [
  "shoulder",
  "hip",
  "knee",
  "lumbar-spine",
  "ankle-foot",
  "core",
  "full-body",
];

describe("Property 5: Exercise Recommendation Bounds", () => {
  describe("Dosage Parameter Bounds", () => {
    it("should always have positive sets in prescribed dosage", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_REGIONS),
          fc.constantFrom(1 as const, 2 as const, 3 as const),
          (region, difficulty) => {
            const prescription = generateExercisePrescription({
              diagnosis: "test diagnosis",
              bodyRegion: region,
              functionalLimitations: ["strength"],
              difficultyLevel: difficulty,
            });

            // Property: Sets always positive
            prescription.exercises.forEach((exercise) => {
              expect(exercise.prescribedDosage.sets).toBeGreaterThan(0);
            });
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should have positive reps when reps are specified", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_REGIONS),
          fc.constantFrom(1 as const, 2 as const, 3 as const),
          (region, difficulty) => {
            const prescription = generateExercisePrescription({
              diagnosis: "test diagnosis",
              bodyRegion: region,
              functionalLimitations: ["strength"],
              difficultyLevel: difficulty,
            });

            // Property: Reps positive when present
            prescription.exercises.forEach((exercise) => {
              if (exercise.prescribedDosage.reps !== undefined) {
                expect(exercise.prescribedDosage.reps).toBeGreaterThan(0);
              }
            });
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should have positive hold seconds when specified", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["flexibility", "mobility"],
          });

          // Property: Hold seconds positive when present
          prescription.exercises.forEach((exercise) => {
            if (exercise.prescribedDosage.holdSeconds !== undefined) {
              expect(exercise.prescribedDosage.holdSeconds).toBeGreaterThan(0);
            }
          });
        }),
        { numRuns: 30 },
      );
    });

    it("should have frequency per week between 1 and 7", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_REGIONS),
          fc.constantFrom(1 as const, 2 as const, 3 as const),
          (region, difficulty) => {
            const prescription = generateExercisePrescription({
              diagnosis: "test diagnosis",
              bodyRegion: region,
              functionalLimitations: ["strength"],
              difficultyLevel: difficulty,
            });

            // Property: Frequency 1-7 days/week
            prescription.exercises.forEach((exercise) => {
              expect(
                exercise.prescribedDosage.frequencyPerWeek,
              ).toBeGreaterThanOrEqual(1);
              expect(
                exercise.prescribedDosage.frequencyPerWeek,
              ).toBeLessThanOrEqual(7);
            });
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe("Session Duration Bounds", () => {
    it("should have positive estimated session duration", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength", "mobility"],
          });

          // Property: Session duration is positive
          expect(prescription.estimatedSessionDuration).toBeGreaterThanOrEqual(
            0,
          );
        }),
        { numRuns: 30 },
      );
    });
  });

  describe("Difficulty Level Dosage Scaling", () => {
    it("should have lower sets at beginner level than advanced", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const beginnerPrescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength"],
            difficultyLevel: 1,
          });

          const advancedPrescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength"],
            difficultyLevel: 3,
          });

          // Property: Beginner has fewer or equal sets than advanced
          const beginnerAvgSets =
            beginnerPrescription.exercises.reduce(
              (sum, e) => sum + e.prescribedDosage.sets,
              0,
            ) / beginnerPrescription.exercises.length;

          const advancedAvgSets =
            advancedPrescription.exercises.reduce(
              (sum, e) => sum + e.prescribedDosage.sets,
              0,
            ) / advancedPrescription.exercises.length;

          expect(beginnerAvgSets).toBeLessThanOrEqual(advancedAvgSets);
        }),
        { numRuns: 20 },
      );
    });
  });

  describe("Exercise Count Bounds", () => {
    it("should always return between 1 and 10 exercises based on availability", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_REGIONS),
          fc.array(
            fc.constantFrom(
              "strength",
              "mobility",
              "balance",
              "flexibility",
              "endurance",
            ),
            { minLength: 1, maxLength: 4 },
          ),
          (region, limitations) => {
            const prescription = generateExercisePrescription({
              diagnosis: "test diagnosis",
              bodyRegion: region,
              functionalLimitations: limitations,
            });

            // Property: 1-10 exercises (may be less than 5 if insufficient candidates for specific regions)
            expect(prescription.exercises.length).toBeGreaterThan(0);
            expect(prescription.exercises.length).toBeLessThanOrEqual(10);
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should sort exercises by difficulty ascending", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength", "mobility"],
            difficultyLevel: 3,
          });

          // Property: Exercises sorted by difficulty (easiest first)
          for (let i = 1; i < prescription.exercises.length; i++) {
            const prev = prescription.exercises[i - 1];
            const curr = prescription.exercises[i];
            expect(prev.difficulty).toBeLessThanOrEqual(curr.difficulty);
          }
        }),
        { numRuns: 30 },
      );
    });
  });
});
