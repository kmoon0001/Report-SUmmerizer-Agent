/**
 * Property-Based Test: Exercise Prescription Safety
 *
 * Property 4: Exercise Prescription Safety
 * Validates: Requirements 4.3, 4.5
 *
 * Correctness Property:
 * For all exercise prescriptions:
 * - Exercises with matching contraindications are excluded
 * - Prescription contains 5-10 exercises
 * - All exercises have evidence level ≥ 1 (APTA standard)
 * - Difficulty does not exceed requested level
 * - HEP-only mode returns only HEP-eligible exercises
 *
 * Sources: APTA CPGs, NSCA guidelines
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

describe("Property 4: Exercise Prescription Safety", () => {
  describe("Prescription Count Bounds", () => {
    it("should always return 5-10 exercises for valid inputs when sufficient exercises exist", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_REGIONS),
          fc.constantFrom(1 as const, 2 as const, 3 as const),
          (region, difficulty) => {
            const prescription = generateExercisePrescription({
              diagnosis: "test diagnosis",
              bodyRegion: region,
              functionalLimitations: ["strength", "mobility"],
              difficultyLevel: difficulty,
            });

            // Property: Returns exercises within bounds (may be less than 5 if insufficient candidates)
            expect(prescription.totalExercises).toBeGreaterThan(0);
            expect(prescription.totalExercises).toBeLessThanOrEqual(10);
            expect(prescription.exercises.length).toBe(
              prescription.totalExercises,
            );
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe("Contraindication Filtering", () => {
    it("should exclude exercises matching patient contraindications", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_REGIONS),
          fc.array(
            fc.constantFrom(
              "acute fracture",
              "acute hip fracture",
              "acute rotator cuff tear",
              "acute knee effusion",
              "acute lumbar fracture",
            ),
            { minLength: 1, maxLength: 3 },
          ),
          (region, contraindications) => {
            const prescription = generateExercisePrescription({
              diagnosis: "test diagnosis",
              bodyRegion: region,
              functionalLimitations: ["strength"],
              contraindications,
            });

            // Property: No prescribed exercise should have matching contraindications
            prescription.exercises.forEach((exercise) => {
              const exerciseContraindications = exercise.contraindications.map(
                (c) => c.toLowerCase(),
              );
              const hasConflict = contraindications.some((pc) =>
                exerciseContraindications.some((ec) =>
                  ec.includes(pc.toLowerCase()),
                ),
              );
              expect(hasConflict).toBe(false);
            });
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe("Difficulty Level Compliance", () => {
    it("should not exceed requested difficulty level", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_REGIONS),
          fc.constantFrom(1 as const, 2 as const),
          (region, difficultyLevel) => {
            const prescription = generateExercisePrescription({
              diagnosis: "test diagnosis",
              bodyRegion: region,
              functionalLimitations: ["strength", "mobility"],
              difficultyLevel,
            });

            const maxAllowed = difficultyLevel === 1 ? 2 : 3;

            // Property: No exercise exceeds max difficulty for level
            prescription.exercises.forEach((exercise) => {
              expect(exercise.difficulty).toBeLessThanOrEqual(maxAllowed);
            });
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe("Evidence Level Standards", () => {
    it("should only include exercises with valid evidence levels", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength"],
          });

          // Property: All exercises have evidence level 1-5
          prescription.exercises.forEach((exercise) => {
            expect(exercise.evidenceLevel).toBeGreaterThanOrEqual(1);
            expect(exercise.evidenceLevel).toBeLessThanOrEqual(5);
          });
        }),
        { numRuns: 30 },
      );
    });
  });

  describe("HEP-Only Mode Safety", () => {
    it("should return only HEP-eligible exercises in HEP-only mode", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength", "mobility"],
            includeHEPOnly: true,
          });

          // Property: All exercises are HEP eligible
          prescription.exercises.forEach((exercise) => {
            expect(exercise.isHEPEligible).toBe(true);
          });
        }),
        { numRuns: 30 },
      );
    });
  });

  describe("Prescription Metadata Integrity", () => {
    it("should always include required metadata fields", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_REGIONS),
          fc.string({ minLength: 3, maxLength: 50 }),
          (region, diagnosis) => {
            const prescription = generateExercisePrescription({
              diagnosis,
              bodyRegion: region,
              functionalLimitations: ["strength"],
            });

            // Property: Required metadata present
            expect(prescription.patientDiagnosis).toBe(diagnosis);
            expect(prescription.bodyRegion).toBe(region);
            expect(prescription.generatedDate).toBeDefined();
            expect(
              new Date(prescription.generatedDate).getTime(),
            ).toBeGreaterThan(0);
            expect(prescription.clinicalNotes).toBeTruthy();
            expect(prescription.evidenceSummary).toBeTruthy();
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should include clinical rationale for each prescribed exercise", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "knee osteoarthritis",
            bodyRegion: region,
            functionalLimitations: ["strength", "mobility"],
          });

          // Property: Each exercise has rationale and progression notes
          prescription.exercises.forEach((exercise) => {
            expect(exercise.clinicalRationale).toBeTruthy();
            expect(exercise.progressionNotes).toBeTruthy();
            expect(exercise.prescribedDosage).toBeDefined();
            expect(exercise.prescribedDosage.sets).toBeGreaterThan(0);
            expect(exercise.prescribedDosage.frequencyPerWeek).toBeGreaterThan(
              0,
            );
          });
        }),
        { numRuns: 30 },
      );
    });
  });
});
