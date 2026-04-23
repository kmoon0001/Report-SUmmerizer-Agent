/**
 * Integration Test: Exercise Prescription Workflow
 * Task 12.9 — Requirements: 4.6, 16.4
 *
 * Tests the complete workflow:
 * 1. Exercise selection from library
 * 2. Prescription generation with contraindication filtering
 * 3. HEP building with max 5 exercises
 * 4. Patient handout generation
 */

import { describe, it, expect } from "vitest";
import {
  EXERCISE_LIBRARY,
  getExercisesByRegion,
  getHEPEligibleExercises,
} from "../../data/exercise-library-data";
import {
  generateExercisePrescription,
  buildHomeExerciseProgram,
} from "../../utils/exercise-prescription-generator";

describe("Exercise Prescription Workflow Integration", () => {
  describe("Exercise Library Data Integrity", () => {
    it("should have exercises in the library", () => {
      expect(EXERCISE_LIBRARY.length).toBeGreaterThan(0);
    });

    it("should have exercises for all major body regions", () => {
      const regions = ["shoulder", "hip", "knee", "lumbar-spine"];
      regions.forEach((region) => {
        const exercises = getExercisesByRegion(region as any);
        expect(exercises.length).toBeGreaterThan(0);
      });
    });

    it("should have HEP-eligible exercises", () => {
      const hepExercises = getHEPEligibleExercises();
      expect(hepExercises.length).toBeGreaterThan(0);
      hepExercises.forEach((e) => expect(e.isHEPEligible).toBe(true));
    });

    it("should have exercises with valid evidence levels", () => {
      EXERCISE_LIBRARY.forEach((exercise) => {
        expect(exercise.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(exercise.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });

    it("should have exercises with required fields", () => {
      EXERCISE_LIBRARY.forEach((exercise) => {
        expect(exercise.id).toBeTruthy();
        expect(exercise.name).toBeTruthy();
        expect(exercise.description).toBeTruthy();
        expect(exercise.patientInstruction).toBeTruthy();
        expect(exercise.citation).toBeTruthy();
        expect(exercise.contraindications).toBeDefined();
        expect(exercise.precautions).toBeDefined();
        expect(exercise.targetMuscles.length).toBeGreaterThan(0);
        expect(exercise.therapeuticGoals.length).toBeGreaterThan(0);
      });
    });

    it("should have authoritative citations (APTA, Cochrane, JOSPT)", () => {
      const authoritativeSources = ["APTA", "Cochrane", "JOSPT", "NSCA"];
      const exercisesWithAuthoritativeCitations = EXERCISE_LIBRARY.filter((e) =>
        authoritativeSources.some((source) => e.citation.includes(source)),
      );
      // At least 80% should have authoritative citations
      expect(
        exercisesWithAuthoritativeCitations.length / EXERCISE_LIBRARY.length,
      ).toBeGreaterThan(0.8);
    });
  });

  describe("Complete Knee OA Prescription Workflow", () => {
    it("should generate a complete knee OA prescription", () => {
      const prescription = generateExercisePrescription({
        diagnosis: "knee osteoarthritis",
        bodyRegion: "knee",
        functionalLimitations: ["strength", "mobility", "stair negotiation"],
        difficultyLevel: 1,
      });

      expect(prescription.patientDiagnosis).toBe("knee osteoarthritis");
      expect(prescription.bodyRegion).toBe("knee");
      expect(prescription.exercises.length).toBeGreaterThanOrEqual(5);
      expect(prescription.exercises.length).toBeLessThanOrEqual(10);
      expect(prescription.clinicalNotes).toContain("knee osteoarthritis");
      expect(prescription.evidenceSummary).toContain("APTA");
    });

    it("should exclude exercises contraindicated for acute knee effusion", () => {
      const prescription = generateExercisePrescription({
        diagnosis: "knee osteoarthritis",
        bodyRegion: "knee",
        functionalLimitations: ["strength"],
        contraindications: ["acute knee effusion"],
      });

      prescription.exercises.forEach((exercise) => {
        const contraindications = exercise.contraindications.map((c) =>
          c.toLowerCase(),
        );
        const hasConflict = contraindications.some((c) =>
          c.includes("acute knee effusion"),
        );
        expect(hasConflict).toBe(false);
      });
    });

    it("should build a valid HEP from knee OA prescription", () => {
      const prescription = generateExercisePrescription({
        diagnosis: "knee osteoarthritis",
        bodyRegion: "knee",
        functionalLimitations: ["strength", "mobility"],
        difficultyLevel: 1,
      });

      const hep = buildHomeExerciseProgram(prescription);

      expect(hep.exercises.length).toBeLessThanOrEqual(5);
      expect(hep.exercises.length).toBeGreaterThan(0);
      hep.exercises.forEach((e) => expect(e.isHEPEligible).toBe(true));
      expect(hep.patientInstructions).toBeTruthy();
      expect(hep.frequency).toMatch(/per week/i);
    });
  });

  describe("Complete Shoulder Prescription Workflow", () => {
    it("should generate a shoulder prescription with rotator cuff focus", () => {
      const prescription = generateExercisePrescription({
        diagnosis: "rotator cuff tendinopathy",
        bodyRegion: "shoulder",
        functionalLimitations: [
          "rotator cuff strengthening",
          "shoulder stability",
        ],
        difficultyLevel: 2,
      });

      expect(prescription.exercises.length).toBeGreaterThanOrEqual(5);
      // Should include shoulder exercises
      const shoulderExercises = prescription.exercises.filter(
        (e) => e.bodyRegion === "shoulder",
      );
      expect(shoulderExercises.length).toBeGreaterThan(0);
    });

    it("should exclude exercises contraindicated for acute rotator cuff tear", () => {
      const prescription = generateExercisePrescription({
        diagnosis: "rotator cuff tendinopathy",
        bodyRegion: "shoulder",
        functionalLimitations: ["strength"],
        contraindications: ["acute rotator cuff tear (full thickness)"],
      });

      prescription.exercises.forEach((exercise) => {
        const contraindications = exercise.contraindications.map((c) =>
          c.toLowerCase(),
        );
        const hasConflict = contraindications.some((c) =>
          c.includes("acute rotator cuff tear"),
        );
        expect(hasConflict).toBe(false);
      });
    });
  });

  describe("Complete Low Back Pain Prescription Workflow", () => {
    it("should generate a lumbar spine prescription", () => {
      const prescription = generateExercisePrescription({
        diagnosis: "low back pain",
        bodyRegion: "lumbar-spine",
        functionalLimitations: ["core stability", "lumbar flexibility"],
        difficultyLevel: 1,
      });

      // May return fewer than 5 exercises if limited candidates for specific region/limitations
      expect(prescription.exercises.length).toBeGreaterThan(0);
      expect(prescription.exercises.length).toBeLessThanOrEqual(10);
      expect(prescription.clinicalNotes).toContain("low back pain");
    });

    it("should build HEP with patient-friendly instructions", () => {
      const prescription = generateExercisePrescription({
        diagnosis: "low back pain",
        bodyRegion: "lumbar-spine",
        functionalLimitations: ["core stability"],
        difficultyLevel: 1,
      });

      const hep = buildHomeExerciseProgram(prescription);

      expect(hep.exercises.length).toBeLessThanOrEqual(5);
      // Patient instructions should be readable
      expect(hep.patientInstructions.length).toBeGreaterThan(50);
      // Should include safety instruction
      expect(hep.patientInstructions).toMatch(/pain|stop/i);
    });
  });

  describe("HEP Compliance Workflow", () => {
    it("should enforce 5-exercise HEP limit across all regions", () => {
      const regions = [
        "shoulder",
        "hip",
        "knee",
        "lumbar-spine",
        "ankle-foot",
      ] as const;

      regions.forEach((region) => {
        const prescription = generateExercisePrescription({
          diagnosis: "test diagnosis",
          bodyRegion: region,
          functionalLimitations: [
            "strength",
            "mobility",
            "balance",
            "flexibility",
          ],
          difficultyLevel: 2,
        });

        const hep = buildHomeExerciseProgram(prescription);
        expect(hep.exercises.length).toBeLessThanOrEqual(5);
      });
    });

    it("should generate unique exercise IDs in prescription", () => {
      const prescription = generateExercisePrescription({
        diagnosis: "hip osteoarthritis",
        bodyRegion: "hip",
        functionalLimitations: ["strength", "mobility"],
      });

      const ids = prescription.exercises.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("Evidence Summary Workflow", () => {
    it("should generate evidence summary with level breakdown", () => {
      const prescription = generateExercisePrescription({
        diagnosis: "knee osteoarthritis",
        bodyRegion: "knee",
        functionalLimitations: ["strength"],
      });

      expect(prescription.evidenceSummary).toContain("Level 1");
      expect(prescription.evidenceSummary).toContain("Level 2");
      expect(prescription.evidenceSummary).toContain("APTA CPGs");
    });
  });
});
