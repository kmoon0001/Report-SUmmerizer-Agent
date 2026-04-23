/**
 * Integration Tests: Clinical Quality Measures Hub
 * Requirements: 1.1, 8.4, 8.5
 */
import { describe, it, expect } from "vitest";
import {
  qualityDomains,
  mipsMeasures,
  calculateMIPSPerformanceRate,
  estimatePaymentAdjustment,
  generateMIPSDocumentationChecklist,
} from "../../data/quality-measures-data";
import {
  interpretOxfordScale,
  scoreICIQUI,
  analyzeBladderDiary,
  calculateVoidingProgression,
} from "../../utils/pelvic-floor-assessment";
import {
  scoreCSSConstipation,
  interpretBristolScale,
  scoreWexnerFI,
  analyzeBowelDiary,
} from "../../utils/bowel-program-assessment";
import {
  calculateCompositeScore,
  isAboveBenchmark,
  generateMIPSSummary,
} from "../../utils/mips-tracker";

// ── Fall Prevention Workflow ──────────────────────────────────────────────────
describe("Fall prevention program selection workflow", () => {
  it("falls domain has programs with evidence citations", () => {
    const falls = qualityDomains.find((d) => d.id === "falls")!;
    falls.programs.forEach((p) => {
      expect(p.citation.length).toBeGreaterThan(10);
      expect(p.evidenceLevel).toBeGreaterThanOrEqual(1);
    });
  });

  it("falls domain CPT codes include gait training", () => {
    const falls = qualityDomains.find((d) => d.id === "falls")!;
    expect(falls.cptCodes.some((c) => /97116/i.test(c))).toBe(true);
  });

  it("MIPS #155 and #318 documentation checklists are complete", () => {
    const checklist155 = generateMIPSDocumentationChecklist("155");
    const checklist318 = generateMIPSDocumentationChecklist("318");
    expect(checklist155.length).toBeGreaterThanOrEqual(3);
    expect(checklist318.length).toBeGreaterThanOrEqual(3);
    expect(checklist155.some((c) => /fall risk/i.test(c))).toBe(true);
    expect(checklist318.some((c) => /plan|prevention/i.test(c))).toBe(true);
  });
});

// ── Pelvic Floor Assessment Workflow ─────────────────────────────────────────
describe("Pelvic floor assessment → program recommendation flow", () => {
  it("Oxford Scale 0 recommends biofeedback", () => {
    const result = interpretOxfordScale(0);
    expect(result.recommendation).toMatch(/biofeedback/i);
  });

  it("Oxford Scale 3 recommends PFMT with 10s hold", () => {
    const result = interpretOxfordScale(3);
    expect(result.recommendation).toMatch(/10s hold/i);
  });

  it("ICIQ score 15 is severe", () => {
    const result = scoreICIQUI(4, 4, 7);
    expect(result.severity).toBe("Severe");
    expect(result.score).toBe(15);
  });

  it("ICIQ MCID is 2 points", () => {
    const result = scoreICIQUI(2, 2, 4);
    expect(result.mcid).toBe(2);
  });

  it("bladder diary with 12 voids flags frequency", () => {
    const result = analyzeBladderDiary(12, 2, 3);
    expect(result.interpretation).toMatch(/frequency/i);
  });

  it("voiding progression from 60 to 180 min has correct steps", () => {
    const steps = calculateVoidingProgression(60, 180, 15);
    expect(steps[0]).toBe(60);
    expect(steps[steps.length - 1]).toBe(180);
    expect(steps.length).toBeGreaterThan(2);
  });

  it("MIPS #50 checklist includes plan of care", () => {
    const checklist = generateMIPSDocumentationChecklist("50");
    expect(checklist.some((c) => /plan of care/i.test(c))).toBe(true);
  });
});

// ── Bowel Program Workflow ────────────────────────────────────────────────────
describe("Bowel program assessment workflow", () => {
  it("CSS score 18 is severe", () => {
    const result = scoreCSSConstipation([3, 3, 3, 3, 3, 2, 0, 1]);
    expect(result.severity).toBe("Severe");
  });

  it("CSS score 4 is mild", () => {
    const result = scoreCSSConstipation([1, 1, 1, 1, 0, 0, 0, 0]);
    expect(result.severity).toBe("Mild");
  });

  it("Bristol Type 4 is target", () => {
    const result = interpretBristolScale(4);
    expect(result.isTarget).toBe(true);
  });

  it("Bristol Type 1 is not target", () => {
    const result = interpretBristolScale(1);
    expect(result.isTarget).toBe(false);
  });

  it("Wexner score 12 is severe", () => {
    const result = scoreWexnerFI([3, 3, 3, 2, 1]);
    expect(result.severity).toBe("Severe");
  });

  it("Wexner score 0 is continent", () => {
    const result = scoreWexnerFI([0, 0, 0, 0, 0]);
    expect(result.severity).toBe("None");
  });

  it("bowel diary with 1 void/week flags infrequent", () => {
    const result = analyzeBowelDiary(1, [2, 1], 5);
    expect(result.interpretation).toMatch(/infrequent/i);
  });
});

// ── MIPS Tracker Workflow ─────────────────────────────────────────────────────
describe("MIPS measure documentation checklist generation", () => {
  it("composite score from all 100% rates is 100", () => {
    const rates = Object.fromEntries(mipsMeasures.map((m) => [m.number, 100]));
    expect(calculateCompositeScore(rates)).toBe(100);
  });

  it("composite score from empty rates is 0", () => {
    expect(calculateCompositeScore({})).toBe(0);
  });

  it("isAboveBenchmark returns true when rate >= benchmark", () => {
    const benchmark = mipsMeasures.find(
      (m) => m.number === "155",
    )!.benchmark2026;
    expect(isAboveBenchmark("155", benchmark)).toBe(true);
    expect(isAboveBenchmark("155", benchmark - 1)).toBe(false);
  });

  it("generateMIPSSummary identifies gaps below benchmark", () => {
    const numerators = { "155": 50, "318": 90 };
    const denominators = { "155": 100, "318": 100 };
    const summary = generateMIPSSummary(numerators, denominators);
    expect(summary.totalMeasuresTracked).toBe(2);
    expect(summary.compositeScore).toBeGreaterThan(0);
    expect(summary.paymentAdjustment).toBeDefined();
  });

  it("payment adjustment for score 80 is +9%", () => {
    expect(estimatePaymentAdjustment(80)).toMatch(/\+9%/);
  });

  it("payment adjustment for score 10 is -9%", () => {
    expect(estimatePaymentAdjustment(10)).toMatch(/-9%/);
  });

  it("MIPS #182 checklist includes validated functional tool", () => {
    const checklist = generateMIPSDocumentationChecklist("182");
    expect(checklist.some((c) => /validated|functional/i.test(c))).toBe(true);
  });
});

// ── Cross-domain data integrity ───────────────────────────────────────────────
describe("Quality measures data integrity", () => {
  it("all domains have unique IDs", () => {
    const ids = qualityDomains.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all MIPS measures have unique numbers", () => {
    const nums = mipsMeasures.map((m) => m.number);
    expect(new Set(nums).size).toBe(nums.length);
  });

  it("all programs have evidence levels 1–5", () => {
    qualityDomains.forEach((d) => {
      d.programs.forEach((p) => {
        expect(p.evidenceLevel).toBeGreaterThanOrEqual(1);
        expect(p.evidenceLevel).toBeLessThanOrEqual(5);
      });
    });
  });

  it("all domains have CPT codes", () => {
    qualityDomains.forEach((d) => {
      expect(d.cptCodes.length).toBeGreaterThan(0);
    });
  });

  it("MIPS performance targets are ≥ benchmarks", () => {
    mipsMeasures.forEach((m) => {
      expect(m.performanceTarget).toBeGreaterThanOrEqual(m.benchmark2026);
    });
  });
});
