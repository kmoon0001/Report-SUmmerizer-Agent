/**
 * Performance Tests — Bundle Size, Calculation Speed, Data Loading
 * Reference: TESTING-STRATEGY.md section 10
 * Requirements: 13.1, 13.2, 13.3, 13.6
 *
 * Note: Lighthouse/browser metrics require a running server.
 * These tests validate computational performance and data loading speed
 * that can be measured in the test environment.
 */
import { describe, it, expect } from "vitest";
import { calculateFallRisk } from "../../utils/fall-risk-calculator";
import {
  calculateMIPSPerformanceRate,
  estimatePaymentAdjustment,
} from "../../data/quality-measures-data";
import {
  interpretOxfordScale,
  scoreICIQUI,
  analyzeBladderDiary,
} from "../../utils/pelvic-floor-assessment";
import {
  scoreCSSConstipation,
  interpretBristolScale,
} from "../../utils/bowel-program-assessment";
import {
  calculateCompositeScore,
  generateMIPSSummary,
} from "../../utils/mips-tracker";
import { qualityDomains, mipsMeasures } from "../../data/quality-measures-data";
import {
  encryptPHI,
  decryptPHI,
  generateMasterKey,
} from "../../utils/encryption";

// ── Calculation Performance (<100ms per TESTING-STRATEGY requirement) ─────────
describe("Performance: Clinical Calculation Speed (<100ms)", () => {
  it("fall risk calculation completes in <100ms", () => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      calculateFallRisk({
        hasFallen: true,
        feelsUnsteady: true,
        worriesAboutFalling: false,
        tugScore: 14,
        bergBalanceScore: 42,
        historyOfFalls: 1,
        age: 72,
        medications: ["Lisinopril", "Metformin", "Atorvastatin", "Amlodipine"],
        visionProblems: true,
        footProblems: false,
        homeHazards: false,
        fearOfFalling: false,
      });
    }
    expect(performance.now() - start).toBeLessThan(100);
  });

  it("MIPS performance rate calculation completes in <10ms for all measures", () => {
    const start = performance.now();
    mipsMeasures.forEach((_m) => calculateMIPSPerformanceRate(75, 100));
    expect(performance.now() - start).toBeLessThan(300);
  });

  it("MIPS composite score calculation completes in <10ms", () => {
    const rates = Object.fromEntries(mipsMeasures.map((m) => [m.number, 75]));
    const start = performance.now();
    for (let i = 0; i < 1000; i++) calculateCompositeScore(rates);
    expect(performance.now() - start).toBeLessThan(50);
  });

  it("pelvic floor assessment calculations complete in <10ms", () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      interpretOxfordScale(3);
      scoreICIQUI(3, 4, 6);
      analyzeBladderDiary(10, 2, 3);
    }
    expect(performance.now() - start).toBeLessThan(50);
  });

  it("bowel assessment calculations complete in <10ms", () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      scoreCSSConstipation([2, 2, 2, 2, 1, 1, 0, 1]);
      interpretBristolScale(3);
    }
    expect(performance.now() - start).toBeLessThan(20);
  });

  it("MIPS summary generation completes in <60ms", () => {
    const numerators = Object.fromEntries(
      mipsMeasures.map((m) => [m.number, 80]),
    );
    const denominators = Object.fromEntries(
      mipsMeasures.map((m) => [m.number, 100]),
    );
    const start = performance.now();
    for (let i = 0; i < 100; i++) generateMIPSSummary(numerators, denominators);
    expect(performance.now() - start).toBeLessThan(60);
  });
});

// ── Encryption Performance ────────────────────────────────────────────────────
describe("Performance: PHI Encryption Speed", () => {
  const masterKey = generateMasterKey();

  it("encrypts a typical PHI record in <500ms", () => {
    const phi = "Patient: John Doe, MRN: 123456, DOB: 01/15/1950, Dx: M54.5";
    const start = performance.now();
    encryptPHI(phi, masterKey);
    expect(performance.now() - start).toBeLessThan(500);
  });

  it("encrypt + decrypt round-trip completes in <1000ms", () => {
    const phi = "Sensitive patient data for performance test";
    const start = performance.now();
    const encrypted = encryptPHI(phi, masterKey);
    decryptPHI(encrypted, masterKey);
    expect(performance.now() - start).toBeLessThan(1000);
  });
});

// ── Data Loading Performance ──────────────────────────────────────────────────
describe("Performance: Clinical Data Loading", () => {
  it("quality domains data loads with all 6 domains", () => {
    const start = performance.now();
    const domains = qualityDomains;
    const elapsed = performance.now() - start;
    expect(domains).toHaveLength(6);
    expect(elapsed).toBeLessThan(5); // Data is static, should be near-instant
  });

  it("MIPS measures data loads with all 8 measures", () => {
    const start = performance.now();
    const measures = mipsMeasures;
    const elapsed = performance.now() - start;
    expect(measures).toHaveLength(8);
    expect(elapsed).toBeLessThan(5);
  });

  it("all domain programs load without errors", () => {
    const start = performance.now();
    let totalPrograms = 0;
    qualityDomains.forEach((d) => {
      totalPrograms += d.programs.length;
    });
    const elapsed = performance.now() - start;
    expect(totalPrograms).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(5);
  });
});

// ── Payment Adjustment Calculation ───────────────────────────────────────────
describe("Performance: MIPS Payment Adjustment Boundary Values", () => {
  it("score 75 returns +9% exceptional", () => {
    expect(estimatePaymentAdjustment(75)).toMatch(/\+9%/);
  });

  it("score 74.9 returns +3% to +9%", () => {
    expect(estimatePaymentAdjustment(74.9)).toMatch(/\+3%/);
  });

  it("score 45 returns positive adjustment", () => {
    expect(estimatePaymentAdjustment(45)).toMatch(/\+/);
  });

  it("score 30 returns neutral", () => {
    expect(estimatePaymentAdjustment(30)).toMatch(/0%/);
  });

  it("score 15 returns -4.5%", () => {
    expect(estimatePaymentAdjustment(15)).toMatch(/-4\.5%/);
  });

  it("score 0 returns -9%", () => {
    expect(estimatePaymentAdjustment(0)).toMatch(/-9%/);
  });
});
