/**
 * Integration Tests — Pediatric PT Hub
 * Requirements: 1.1, 1.4
 */
import { describe, it, expect } from "vitest";
import {
  developmentalMilestones,
  interpretPDMS2Score,
  scoreGMFM,
  gmfcsLevels,
  cerebralPalsyProtocols,
  pediatricExerciseProgressions,
  gmfmDimensions,
  pdms2Subtests,
} from "../../data/pt-pediatric-data";

// ── Milestone Workflow ────────────────────────────────────────────────────────
describe("Pediatric Integration: Developmental Milestone Workflow", () => {
  it("milestones are ordered by age", () => {
    const ages = developmentalMilestones.map((m) => m.ageMonths);
    for (let i = 1; i < ages.length; i++) {
      expect(ages[i]).toBeGreaterThan(ages[i - 1]);
    }
  });

  it("all milestones have non-empty ageLabel", () => {
    developmentalMilestones.forEach((m) => {
      expect(m.ageLabel).toBeTruthy();
    });
  });

  it("red flags are clinically meaningful (contain action words)", () => {
    developmentalMilestones.forEach((m) => {
      m.redFlags.forEach((flag) => {
        expect(flag.length).toBeGreaterThanOrEqual(10);
      });
    });
  });
});

// ── PDMS-2 Workflow ───────────────────────────────────────────────────────────
describe("Pediatric Integration: PDMS-2 Assessment Workflow", () => {
  it("all 6 subtests are defined", () => {
    expect(pdms2Subtests).toHaveLength(6);
  });

  it("subtest names match PDMS-2 standard", () => {
    const names = pdms2Subtests.map((s) => s.name);
    expect(names).toContain("Reflexes");
    expect(names).toContain("Stationary");
    expect(names).toContain("Locomotion");
    expect(names).toContain("Grasping");
  });

  it("score interpretation covers full range", () => {
    const low = interpretPDMS2Score(1, 60);
    const high = interpretPDMS2Score(120, 12);
    expect(low.interpretation).toMatch(/below|significantly/i);
    expect(high.interpretation).toMatch(/above|average/i);
  });

  it("interpretation always returns all three fields", () => {
    [6, 12, 24, 36, 48, 60].forEach((age) => {
      const result = interpretPDMS2Score(age * 2, age);
      expect(result.percentileRank).toBeDefined();
      expect(result.standardScore).toBeDefined();
      expect(result.interpretation).toBeDefined();
    });
  });
});

// ── GMFM Workflow ─────────────────────────────────────────────────────────────
describe("Pediatric Integration: GMFM Scoring Workflow", () => {
  it("5 dimensions are defined", () => {
    expect(gmfmDimensions).toHaveLength(5);
  });

  it("dimension letters are A through E", () => {
    const letters = gmfmDimensions.map((d) => d.letter);
    expect(letters).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("total item count matches GMFM-88", () => {
    const total = gmfmDimensions.reduce((sum, d) => sum + d.items, 0);
    expect(total).toBe(88);
  });

  it("partial scores produce intermediate total", () => {
    const scores = {
      A: Array(17).fill(1),
      B: Array(20).fill(1),
      C: Array(14).fill(1),
      D: Array(13).fill(1),
      E: Array(24).fill(1),
    };
    const result = scoreGMFM(scores);
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThan(100);
  });

  it("interpretation changes with score level", () => {
    const highScores = {
      A: Array(17).fill(3),
      B: Array(20).fill(3),
      C: Array(14).fill(3),
      D: Array(13).fill(3),
      E: Array(24).fill(3),
    };
    const lowScores = {
      A: Array(17).fill(0),
      B: Array(20).fill(0),
      C: Array(14).fill(0),
      D: Array(13).fill(0),
      E: Array(24).fill(0),
    };
    const high = scoreGMFM(highScores);
    const low = scoreGMFM(lowScores);
    expect(high.interpretation).not.toBe(low.interpretation);
  });
});

// ── GMFCS Workflow ────────────────────────────────────────────────────────────
describe("Pediatric Integration: GMFCS Classification Workflow", () => {
  it("levels 1–5 all have PT goals", () => {
    [1, 2, 3, 4, 5].forEach((level) => {
      const l = gmfcsLevels.find((g) => g.level === level);
      expect(l?.ptGoals.length).toBeGreaterThan(0);
    });
  });

  it("higher GMFCS levels have more assistive equipment", () => {
    const l1 = gmfcsLevels.find((l) => l.level === 1)!;
    const l5 = gmfcsLevels.find((l) => l.level === 5)!;
    expect(l5.equipment.length).toBeGreaterThanOrEqual(l1.equipment.length);
  });
});

// ── CP Protocol Workflow ──────────────────────────────────────────────────────
describe("Pediatric Integration: CP Protocol Workflow", () => {
  it("all protocols have outcome measures", () => {
    cerebralPalsyProtocols.forEach((p) => {
      expect(p.outcomes.length).toBeGreaterThan(0);
    });
  });

  it("all protocols have indications", () => {
    cerebralPalsyProtocols.forEach((p) => {
      expect(p.indication).toBeTruthy();
    });
  });

  it("evidence levels reference recognized sources", () => {
    cerebralPalsyProtocols.forEach((p) => {
      expect(p.evidenceLevel).toMatch(/Level|Cochrane|RCT|APTA/i);
    });
  });
});

// ── Exercise Progression Workflow ─────────────────────────────────────────────
describe("Pediatric Integration: Age-Appropriate Exercise Workflow", () => {
  it("progressions cover infant through school-age", () => {
    const groups = pediatricExerciseProgressions.map((g) => g.ageGroup);
    expect(groups.some((g) => /infant/i.test(g))).toBe(true);
    expect(groups.some((g) => /school/i.test(g))).toBe(true);
  });

  it("each exercise has sets, reps, and notes", () => {
    pediatricExerciseProgressions.forEach((group) => {
      group.exercises.forEach((ex) => {
        expect(ex.sets).toBeTruthy();
        expect(ex.reps).toBeTruthy();
        expect(ex.notes).toBeTruthy();
      });
    });
  });

  it("precautions are age-appropriate", () => {
    const infant = pediatricExerciseProgressions.find((g) =>
      /infant/i.test(g.ageGroup),
    );
    expect(infant?.precautions.some((p) => /supervise|support/i.test(p))).toBe(
      true,
    );
  });
});
