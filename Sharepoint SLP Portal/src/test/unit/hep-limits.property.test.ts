/**
 * Property-Based Test: Home Exercise Program Limits
 *
 * Property 6: Home Exercise Program Limits
 * Validates: Requirement 4.4
 *
 * Correctness Property:
 * For all HEP generations:
 * - HEP never exceeds 5 exercises (evidence-based limit)
 * - All HEP exercises are HEP-eligible
 * - HEP exercises are a subset of the full prescription
 * - Patient instructions are generated for all HEP exercises
 * - Precautions are included
 *
 * Sources: APTA CPGs — HEP compliance research shows >5 exercises
 *          significantly reduces patient adherence (Friedrich et al. 1998)
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  generateExercisePrescription,
  buildHomeExerciseProgram,
} from "../../utils/exercise-prescription-generator";
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

describe("Property 6: Home Exercise Program Limits", () => {
  describe("HEP Maximum Exercise Count", () => {
    it("should never exceed 5 exercises in HEP", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength", "mobility", "balance"],
          });

          const hep = buildHomeExerciseProgram(prescription);

          // Property: HEP never exceeds 5 exercises
          expect(hep.totalExercises).toBeLessThanOrEqual(5);
          expect(hep.exercises.length).toBeLessThanOrEqual(5);
          expect(hep.exercises.length).toBe(hep.totalExercises);
        }),
        { numRuns: 50 },
      );
    });

    it("should respect custom maxExercises parameter (capped at 5)", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_REGIONS),
          fc.integer({ min: 1, max: 10 }),
          (region, requestedMax) => {
            const prescription = generateExercisePrescription({
              diagnosis: "test diagnosis",
              bodyRegion: region,
              functionalLimitations: ["strength", "mobility"],
            });

            const hep = buildHomeExerciseProgram(prescription, requestedMax);

            // Property: HEP never exceeds 5 regardless of requested max
            expect(hep.exercises.length).toBeLessThanOrEqual(5);
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe("HEP Eligibility", () => {
    it("should only include HEP-eligible exercises", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength", "mobility"],
          });

          const hep = buildHomeExerciseProgram(prescription);

          // Property: All HEP exercises are HEP eligible
          hep.exercises.forEach((exercise) => {
            expect(exercise.isHEPEligible).toBe(true);
          });
        }),
        { numRuns: 50 },
      );
    });

    it("should be a subset of the full prescription", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength", "mobility"],
          });

          const hep = buildHomeExerciseProgram(prescription);
          const prescriptionIds = new Set(
            prescription.exercises.map((e) => e.id),
          );

          // Property: All HEP exercises are in the full prescription
          hep.exercises.forEach((exercise) => {
            expect(prescriptionIds.has(exercise.id)).toBe(true);
          });
        }),
        { numRuns: 50 },
      );
    });
  });

  describe("HEP Content Requirements", () => {
    it("should always include patient instructions", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength"],
          });

          const hep = buildHomeExerciseProgram(prescription);

          // Property: Patient instructions always present
          expect(hep.patientInstructions).toBeTruthy();
          expect(hep.patientInstructions.length).toBeGreaterThan(0);
        }),
        { numRuns: 30 },
      );
    });

    it("should always include frequency information", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength"],
          });

          const hep = buildHomeExerciseProgram(prescription);

          // Property: Frequency always specified
          expect(hep.frequency).toBeTruthy();
          expect(hep.frequency).toMatch(/per week/i);
        }),
        { numRuns: 30 },
      );
    });

    it("should include precautions array", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength"],
          });

          const hep = buildHomeExerciseProgram(prescription);

          // Property: Precautions array always present (may be empty)
          expect(Array.isArray(hep.precautions)).toBe(true);
        }),
        { numRuns: 30 },
      );
    });

    it("should include safety stop instruction in patient instructions", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength"],
          });

          const hep = buildHomeExerciseProgram(prescription);

          if (hep.exercises.length > 0) {
            // Property: Safety instruction present (stop if sharp pain)
            expect(hep.patientInstructions).toMatch(/pain|stop/i);
          }
        }),
        { numRuns: 30 },
      );
    });
  });

  describe("HEP Dosage Integrity", () => {
    it("should preserve valid dosage parameters for all HEP exercises", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_REGIONS), (region) => {
          const prescription = generateExercisePrescription({
            diagnosis: "test diagnosis",
            bodyRegion: region,
            functionalLimitations: ["strength", "mobility"],
          });

          const hep = buildHomeExerciseProgram(prescription);

          // Property: All HEP exercises have valid dosage
          hep.exercises.forEach((exercise) => {
            expect(exercise.prescribedDosage.sets).toBeGreaterThan(0);
            expect(
              exercise.prescribedDosage.frequencyPerWeek,
            ).toBeGreaterThanOrEqual(1);
            expect(
              exercise.prescribedDosage.frequencyPerWeek,
            ).toBeLessThanOrEqual(7);
          });
        }),
        { numRuns: 30 },
      );
    });
  });
});
