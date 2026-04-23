/**
 * PT Intervention - Exercise Progressions Tests
 */

import { describe, it, expect } from "vitest";
import {
  getPTExerciseProgressionById,
  getAllPTExerciseProgressions,
  getPTExerciseProgressionsByCategory,
  searchPTExerciseProgressions,
  getPTExerciseProgressionsByEvidenceLevel,
  getPTExerciseProgressionPhases,
  validatePTExerciseProgressionCriteria,
} from "../../data/pt-intervention-exercise-progressions";

describe("PT Intervention - Exercise Progressions", () => {
  it("should have 20 progressions", () => {
    expect(getAllPTExerciseProgressions().length).toBe(20);
  });

  it("should return progression by ID", () => {
    const progression = getPTExerciseProgressionById("tech-pt-ex-001");
    expect(progression?.name).toBe("Shoulder Rehabilitation Progression");
  });

  it("should return undefined for invalid ID", () => {
    expect(getPTExerciseProgressionById("invalid")).toBeUndefined();
  });

  it("should filter by category", () => {
    const progressions = getPTExerciseProgressionsByCategory("Exercise");
    expect(progressions.length).toBe(20);
  });

  it("should search progressions", () => {
    const results = searchPTExerciseProgressions("Shoulder");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should filter by evidence level", () => {
    const progressions = getPTExerciseProgressionsByEvidenceLevel(1);
    expect(progressions.length).toBe(20);
  });

  it("should return phases", () => {
    const phases = getPTExerciseProgressionPhases();
    expect(Array.isArray(phases)).toBe(true);
    expect(phases.length).toBeGreaterThan(0);
  });

  it("should validate progression criteria", () => {
    const result = validatePTExerciseProgressionCriteria(
      "tech-pt-ex-001",
      "Pain-free ROM",
    );
    expect(result.valid).toBe(true);
  });

  it("should reject invalid criteria", () => {
    const result = validatePTExerciseProgressionCriteria(
      "tech-pt-ex-001",
      "Invalid",
    );
    expect(result.valid).toBe(false);
  });

  it("should have consistent data", () => {
    const all = getAllPTExerciseProgressions();
    all.forEach((p) => {
      expect(getPTExerciseProgressionById(p.id)).toEqual(p);
    });
  });

  it("should handle errors gracefully", () => {
    expect(() => {
      getPTExerciseProgressionById(null as any);
      getAllPTExerciseProgressions();
      getPTExerciseProgressionsByCategory("test");
      searchPTExerciseProgressions("test");
      getPTExerciseProgressionsByEvidenceLevel(1);
      getPTExerciseProgressionPhases();
      validatePTExerciseProgressionCriteria("test", "test");
    }).not.toThrow();
  });

  it("should have all required properties", () => {
    const all = getAllPTExerciseProgressions();
    all.forEach((p) => {
      expect(p.id).toBeDefined();
      expect(p.name).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.description).toBeDefined();
      expect(p.phases).toBeDefined();
      expect(p.indications).toBeDefined();
      expect(p.contraindications).toBeDefined();
      expect(p.progressionCriteria).toBeDefined();
      expect(p.evidenceLevel).toBeDefined();
      expect(p.source).toBeDefined();
      expect(p.citation).toBeDefined();
      expect(p.lastUpdated).toBeDefined();
    });
  });

  it("should have valid evidence levels", () => {
    const all = getAllPTExerciseProgressions();
    all.forEach((p) => {
      expect([1, 2, 3]).toContain(p.evidenceLevel);
    });
  });

  it("should have non-empty arrays", () => {
    const all = getAllPTExerciseProgressions();
    all.forEach((p) => {
      expect(p.phases.length).toBeGreaterThan(0);
      expect(p.indications.length).toBeGreaterThan(0);
      expect(p.contraindications.length).toBeGreaterThan(0);
      expect(p.progressionCriteria.length).toBeGreaterThan(0);
    });
  });
});
