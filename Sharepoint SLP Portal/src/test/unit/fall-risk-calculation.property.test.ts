/**
 * Property-Based Test: Fall Risk Calculation Accuracy (Task 8.4)
 *
 * Property 11: Fall Risk Calculation Accuracy
 * Validates: Requirements 7.2, 7.3
 *
 * Correctness Properties:
 * - For any valid STEADI assessment, risk level is always 'low' | 'moderate' | 'high'
 * - Score is always non-negative
 * - TUG >14s always identified as a risk factor
 * - BBS <45 always identified as a risk factor
 * - High risk (score ≥12) always includes immediate intervention recommendation
 * - Low risk (score <6) never includes immediate intervention
 *
 * Evidence: CDC STEADI Initiative, AGS Fall Prevention Guidelines (2019)
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  calculateFallRisk,
  interpretBergBalance,
  interpretTUG,
  getFallPreventionInterventions,
  type STEADIAssessment,
} from "../../../src/utils/fall-risk-calculator";

// Arbitrary for a valid STEADI assessment
const validAssessmentArb = fc.record({
  hasFallen: fc.boolean(),
  feelsUnsteady: fc.boolean(),
  worriesAboutFalling: fc.boolean(),
  tugScore: fc.option(
    fc.float({ min: Math.fround(5), max: Math.fround(60), noNaN: true }),
    { nil: undefined },
  ),
  thirtySecondChairStand: fc.option(fc.integer({ min: 0, max: 20 }), {
    nil: undefined,
  }),
  age: fc.integer({ min: 65, max: 100 }),
  historyOfFalls: fc.integer({ min: 0, max: 10 }),
  medications: fc.array(fc.string({ minLength: 3, maxLength: 20 }), {
    minLength: 0,
    maxLength: 8,
  }),
  visionProblems: fc.boolean(),
  footProblems: fc.boolean(),
  homeHazards: fc.boolean(),
  fearOfFalling: fc.boolean(),
  bergBalanceScore: fc.option(fc.integer({ min: 0, max: 56 }), {
    nil: undefined,
  }),
});

describe("Property 11: Fall Risk Calculation Accuracy", () => {
  describe("Core invariants", () => {
    it("always returns a valid risk level for any assessment", () => {
      fc.assert(
        fc.property(validAssessmentArb, (assessment) => {
          const result = calculateFallRisk(assessment);
          expect(["low", "moderate", "high"]).toContain(result.level);
        }),
        { numRuns: 200 },
      );
    });

    it("score is always non-negative", () => {
      fc.assert(
        fc.property(validAssessmentArb, (assessment) => {
          const result = calculateFallRisk(assessment);
          expect(result.score).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: 200 },
      );
    });

    it("riskFactors is always an array", () => {
      fc.assert(
        fc.property(validAssessmentArb, (assessment) => {
          const result = calculateFallRisk(assessment);
          expect(Array.isArray(result.riskFactors)).toBe(true);
        }),
        { numRuns: 200 },
      );
    });

    it("recommendations is always a non-empty array", () => {
      fc.assert(
        fc.property(validAssessmentArb, (assessment) => {
          const result = calculateFallRisk(assessment);
          expect(Array.isArray(result.recommendations)).toBe(true);
          expect(result.recommendations.length).toBeGreaterThan(0);
        }),
        { numRuns: 200 },
      );
    });
  });

  describe("TUG score thresholds (CDC STEADI)", () => {
    it("TUG >14s always identified as high fall risk factor", () => {
      fc.assert(
        fc.property(
          fc.float({
            min: Math.fround(14.1),
            max: Math.fround(60),
            noNaN: true,
          }),
          (tugScore) => {
            const assessment: STEADIAssessment = {
              hasFallen: false,
              feelsUnsteady: false,
              worriesAboutFalling: false,
              tugScore,
              age: 70,
              historyOfFalls: 0,
              medications: [],
              visionProblems: false,
              footProblems: false,
              homeHazards: false,
              fearOfFalling: false,
            };
            const result = calculateFallRisk(assessment);
            const hasTUGFactor = result.riskFactors.some(
              (f) => f.includes("TUG") && f.includes("High fall risk"),
            );
            expect(hasTUGFactor).toBe(true);
          },
        ),
        { numRuns: 100 },
      );
    });

    it("TUG 12-14s identified as moderate fall risk factor", () => {
      fc.assert(
        fc.property(
          fc.float({
            min: Math.fround(12.1),
            max: Math.fround(14),
            noNaN: true,
          }),
          (tugScore) => {
            const assessment: STEADIAssessment = {
              hasFallen: false,
              feelsUnsteady: false,
              worriesAboutFalling: false,
              tugScore,
              age: 70,
              historyOfFalls: 0,
              medications: [],
              visionProblems: false,
              footProblems: false,
              homeHazards: false,
              fearOfFalling: false,
            };
            const result = calculateFallRisk(assessment);
            const hasTUGFactor = result.riskFactors.some(
              (f) => f.includes("TUG") && f.includes("Moderate fall risk"),
            );
            expect(hasTUGFactor).toBe(true);
          },
        ),
        { numRuns: 100 },
      );
    });

    it("TUG ≤12s does not add TUG risk factor", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(1), max: Math.fround(12), noNaN: true }),
          (tugScore) => {
            const assessment: STEADIAssessment = {
              hasFallen: false,
              feelsUnsteady: false,
              worriesAboutFalling: false,
              tugScore,
              age: 70,
              historyOfFalls: 0,
              medications: [],
              visionProblems: false,
              footProblems: false,
              homeHazards: false,
              fearOfFalling: false,
            };
            const result = calculateFallRisk(assessment);
            const hasTUGFactor = result.riskFactors.some((f) =>
              f.includes("TUG"),
            );
            expect(hasTUGFactor).toBe(false);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Berg Balance Scale thresholds", () => {
    it("BBS <45 always identified as high fall risk factor", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 44 }), (bergBalanceScore) => {
          const assessment: STEADIAssessment = {
            hasFallen: false,
            feelsUnsteady: false,
            worriesAboutFalling: false,
            age: 70,
            historyOfFalls: 0,
            medications: [],
            visionProblems: false,
            footProblems: false,
            homeHazards: false,
            fearOfFalling: false,
            bergBalanceScore,
          };
          const result = calculateFallRisk(assessment);
          const hasBBSFactor = result.riskFactors.some(
            (f) => f.includes("Berg") && f.includes("High fall risk"),
          );
          expect(hasBBSFactor).toBe(true);
        }),
        { numRuns: 100 },
      );
    });

    it("BBS 45-50 identified as moderate fall risk factor", () => {
      fc.assert(
        fc.property(fc.integer({ min: 45, max: 50 }), (bergBalanceScore) => {
          const assessment: STEADIAssessment = {
            hasFallen: false,
            feelsUnsteady: false,
            worriesAboutFalling: false,
            age: 70,
            historyOfFalls: 0,
            medications: [],
            visionProblems: false,
            footProblems: false,
            homeHazards: false,
            fearOfFalling: false,
            bergBalanceScore,
          };
          const result = calculateFallRisk(assessment);
          const hasBBSFactor = result.riskFactors.some(
            (f) => f.includes("Berg") && f.includes("Moderate fall risk"),
          );
          expect(hasBBSFactor).toBe(true);
        }),
        { numRuns: 50 },
      );
    });

    it("BBS ≥51 does not add BBS risk factor", () => {
      fc.assert(
        fc.property(fc.integer({ min: 51, max: 56 }), (bergBalanceScore) => {
          const assessment: STEADIAssessment = {
            hasFallen: false,
            feelsUnsteady: false,
            worriesAboutFalling: false,
            age: 70,
            historyOfFalls: 0,
            medications: [],
            visionProblems: false,
            footProblems: false,
            homeHazards: false,
            fearOfFalling: false,
            bergBalanceScore,
          };
          const result = calculateFallRisk(assessment);
          const hasBBSFactor = result.riskFactors.some((f) =>
            f.includes("Berg"),
          );
          expect(hasBBSFactor).toBe(false);
        }),
        { numRuns: 50 },
      );
    });
  });

  describe("Risk level thresholds", () => {
    it("score ≥12 always results in high risk level", () => {
      // Construct a guaranteed high-risk assessment: hasFallen(3) + feelsUnsteady(3) + TUG>14(5) + BBS<45(5) = 16
      const highRiskAssessment: STEADIAssessment = {
        hasFallen: true,
        feelsUnsteady: true,
        worriesAboutFalling: false,
        tugScore: 20,
        age: 70,
        historyOfFalls: 0,
        medications: [],
        visionProblems: false,
        footProblems: false,
        homeHazards: false,
        fearOfFalling: false,
        bergBalanceScore: 30,
      };
      const result = calculateFallRisk(highRiskAssessment);
      expect(result.level).toBe("high");
      expect(result.score).toBeGreaterThanOrEqual(12);
    });

    it("score <6 always results in low risk level", () => {
      const lowRiskAssessment: STEADIAssessment = {
        hasFallen: false,
        feelsUnsteady: false,
        worriesAboutFalling: false,
        age: 65,
        historyOfFalls: 0,
        medications: [],
        visionProblems: false,
        footProblems: false,
        homeHazards: false,
        fearOfFalling: false,
      };
      const result = calculateFallRisk(lowRiskAssessment);
      expect(result.level).toBe("low");
      expect(result.score).toBeLessThan(6);
    });

    it("high risk always includes immediate intervention recommendation", () => {
      const highRiskAssessment: STEADIAssessment = {
        hasFallen: true,
        feelsUnsteady: true,
        worriesAboutFalling: true,
        tugScore: 20,
        age: 80,
        historyOfFalls: 2,
        medications: [
          "Benzodiazepines",
          "Antidepressants",
          "Antipsychotics",
          "Opioids",
        ],
        visionProblems: true,
        footProblems: false,
        homeHazards: false,
        fearOfFalling: false,
        bergBalanceScore: 20,
      };
      const result = calculateFallRisk(highRiskAssessment);
      expect(result.level).toBe("high");
      const hasImmediateRec = result.recommendations.some(
        (r) =>
          r.toLowerCase().includes("immediate") ||
          r.toLowerCase().includes("required"),
      );
      expect(hasImmediateRec).toBe(true);
    });
  });

  describe("Polypharmacy detection", () => {
    it("4+ medications always adds polypharmacy risk factor", () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 3, maxLength: 15 }), {
            minLength: 4,
            maxLength: 8,
          }),
          (medications) => {
            const assessment: STEADIAssessment = {
              hasFallen: false,
              feelsUnsteady: false,
              worriesAboutFalling: false,
              age: 70,
              historyOfFalls: 0,
              medications,
              visionProblems: false,
              footProblems: false,
              homeHazards: false,
              fearOfFalling: false,
            };
            const result = calculateFallRisk(assessment);
            const hasPolypharmacy = result.riskFactors.some((f) =>
              f.toLowerCase().includes("polypharmacy"),
            );
            expect(hasPolypharmacy).toBe(true);
          },
        ),
        { numRuns: 100 },
      );
    });

    it("<4 medications does not add polypharmacy risk factor", () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 3, maxLength: 15 }), {
            minLength: 0,
            maxLength: 3,
          }),
          (medications) => {
            const assessment: STEADIAssessment = {
              hasFallen: false,
              feelsUnsteady: false,
              worriesAboutFalling: false,
              age: 70,
              historyOfFalls: 0,
              medications,
              visionProblems: false,
              footProblems: false,
              homeHazards: false,
              fearOfFalling: false,
            };
            const result = calculateFallRisk(assessment);
            const hasPolypharmacy = result.riskFactors.some((f) =>
              f.toLowerCase().includes("polypharmacy"),
            );
            expect(hasPolypharmacy).toBe(false);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("interpretBergBalance", () => {
    it("always returns a non-empty level and fallRisk string", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 56 }), (score) => {
          const result = interpretBergBalance(score);
          expect(result.level.length).toBeGreaterThan(0);
          expect(result.fallRisk.length).toBeGreaterThan(0);
          expect(result.description.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });

    it("score 56 returns Independent with Low fall risk", () => {
      const result = interpretBergBalance(56);
      expect(result.level).toBe("Independent");
      expect(result.fallRisk).toBe("Low fall risk");
    });

    it("score <45 returns High or Very high fall risk", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 44 }), (score) => {
          const result = interpretBergBalance(score);
          // BBS <45 is always high or very high fall risk (Berg 1989)
          expect(result.fallRisk).toMatch(/High fall risk|Very high fall risk/);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("interpretTUG", () => {
    it("always returns a non-empty level and fallRisk string", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(1), max: Math.fround(60), noNaN: true }),
          (tugScore) => {
            const result = interpretTUG(tugScore);
            expect(result.level.length).toBeGreaterThan(0);
            expect(result.fallRisk.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 100 },
      );
    });

    it("TUG >14s returns High fall risk", () => {
      fc.assert(
        fc.property(
          fc.float({
            min: Math.fround(14.1),
            max: Math.fround(60),
            noNaN: true,
          }),
          (tugScore) => {
            const result = interpretTUG(tugScore);
            // >14s is always high or very high fall risk (Podsiadlo & Richardson 1991)
            expect(result.fallRisk).toMatch(
              /High fall risk|Very high fall risk/,
            );
          },
        ),
        { numRuns: 100 },
      );
    });

    it("TUG <10s returns Low fall risk", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(1), max: Math.fround(9.9), noNaN: true }),
          (tugScore) => {
            const result = interpretTUG(tugScore);
            expect(result.fallRisk).toContain("Low fall risk");
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("getFallPreventionInterventions", () => {
    it("high risk returns all 3 evidence-based interventions", () => {
      const interventions = getFallPreventionInterventions("high");
      expect(interventions.length).toBe(3);
    });

    it("moderate risk returns 2 interventions", () => {
      const interventions = getFallPreventionInterventions("moderate");
      expect(interventions.length).toBe(2);
    });

    it("low risk returns no interventions", () => {
      const interventions = getFallPreventionInterventions("low");
      expect(interventions.length).toBe(0);
    });

    it("all interventions have evidence level 5 (Cochrane/CDC)", () => {
      const interventions = getFallPreventionInterventions("high");
      interventions.forEach((i) => {
        expect(i.evidenceLevel).toBe(5);
      });
    });

    it("all interventions have non-empty citations", () => {
      const interventions = getFallPreventionInterventions("high");
      interventions.forEach((i) => {
        expect(i.citation.length).toBeGreaterThan(0);
      });
    });
  });
});
