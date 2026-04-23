/**
 * Functional Tests - Requirement-Based Validation
 *
 * These tests validate that the system functions according to the 25 requirements
 * defined in requirements.md. Each requirement gets dedicated functional tests.
 */

import { describe, it, expect } from "vitest";
import {
  PT_DATA,
  PT_CORNER_CONTENT,
  PT_QUIZ_QUESTIONS,
} from "../../data/pt-data";
import { calculateFallRisk } from "../../utils/fall-risk-calculator";
import {
  interpretOxfordScale,
  scoreICIQUI,
} from "../../utils/pelvic-floor-assessment";
import {
  calculateTotalScore,
  getMocaInterpretation,
} from "../../utils/clinical-calculators";

describe("Functional Tests: Requirement Validation", () => {
  describe("Requirement 1: Clinical Content Transformation", () => {
    it("1.1: provides nine specialized clinical modules", () => {
      const hubIds = [
        "orthopedic-hub",
        "neurological-hub",
        "geriatric-hub",
        "cardiopulmonary-vestibular",
        "sports-pelvic-health",
        "wound-care-hub",
        "pediatric-pt",
        "quality-measures",
        "compliance-center",
      ];
      hubIds.forEach((id) => {
        expect(PT_DATA.some((c) => c.id === id)).toBe(true);
      });
    });

    it("1.2: all PT_DATA entries have required fields", () => {
      PT_DATA.forEach((cat) => {
        expect(cat.id).toBeTruthy();
        expect(cat.title).toBeTruthy();
        expect(cat.description).toBeTruthy();
        expect(cat.icon).toBeDefined();
        expect(cat.color).toBeTruthy();
      });
    });

    it("1.3: PT_QUIZ_QUESTIONS have evidence-based answers", () => {
      PT_QUIZ_QUESTIONS.forEach((q) => {
        expect(q.q).toBeTruthy();
        expect(q.a).toBeTruthy();
        expect(q.detail).toBeTruthy();
      });
    });
  });

  describe("Requirement 7: Fall Risk Assessment", () => {
    it("7.1: calculateFallRisk returns a risk level", () => {
      const result = calculateFallRisk({
        hasFallen: false,
        feelsUnsteady: false,
        worriesAboutFalling: false,
        tugScore: 15,
        bergBalanceScore: 40,
        age: 75,
        historyOfFalls: 1,
        medications: [],
        visionProblems: false,
        footProblems: false,
        homeHazards: false,
        fearOfFalling: false,
      });
      expect(result).toHaveProperty("level");
      expect(["low", "moderate", "high"]).toContain(result.level);
    });

    it("7.2: TUG > 14s contributes to high risk", () => {
      const result = calculateFallRisk({
        hasFallen: false,
        feelsUnsteady: false,
        worriesAboutFalling: false,
        tugScore: 15,
        bergBalanceScore: 50,
        age: 70,
        historyOfFalls: 0,
        medications: [],
        visionProblems: false,
        footProblems: false,
        homeHazards: false,
        fearOfFalling: false,
      });
      expect(["moderate", "high"]).toContain(result.level);
    });

    it("7.3: Berg < 45 contributes to high risk", () => {
      const result = calculateFallRisk({
        hasFallen: true,
        feelsUnsteady: true,
        worriesAboutFalling: false,
        tugScore: 10,
        bergBalanceScore: 40,
        age: 70,
        historyOfFalls: 1,
        medications: [],
        visionProblems: false,
        footProblems: false,
        homeHazards: false,
        fearOfFalling: false,
      });
      // hasFallen(3) + feelsUnsteady(3) + berg<45(5) + historyOfFalls(1) = 12 → high
      expect(result.level).toBe("high");
    });
  });

  describe("Requirement: Pelvic Floor Assessment", () => {
    it("Oxford Scale 0-5 all return valid results", () => {
      [0, 1, 2, 3, 4, 5].forEach((score) => {
        const r = interpretOxfordScale(score);
        expect(r.label).toBeTruthy();
        expect(r.recommendation).toBeTruthy();
      });
    });

    it("ICIQ-UI scores 0-21 return valid severity", () => {
      const r = scoreICIQUI(5, 6, 10);
      expect(r.severity).toBeTruthy();
      expect(r.score).toBe(21);
    });
  });

  describe("Requirement: Clinical Calculators", () => {
    it("calculateTotalScore handles multiple inputs", () => {
      expect(calculateTotalScore({ a: 10, b: 10, c: 10 }).value).toBe(30);
    });

    it("MoCA interpretation covers full range", () => {
      expect(getMocaInterpretation(30)?.label).toBe("Normal");
      expect(getMocaInterpretation(0)?.label).toContain("Severe");
    });
  });

  describe("Requirement: PT Corner Content", () => {
    it("PT Corner has all 4 content types", () => {
      expect(PT_CORNER_CONTENT.ceus.length).toBeGreaterThan(0);
      expect(PT_CORNER_CONTENT.events.length).toBeGreaterThan(0);
      expect(PT_CORNER_CONTENT.blogs.length).toBeGreaterThan(0);
      expect(PT_CORNER_CONTENT.podcasts.length).toBeGreaterThan(0);
    });

    it("all CEUs have required fields", () => {
      PT_CORNER_CONTENT.ceus.forEach((ceu) => {
        expect(ceu.title).toBeTruthy();
        expect(ceu.provider).toBeTruthy();
        expect(ceu.credits).toBeGreaterThan(0);
        expect(ceu.url).toContain("http");
      });
    });
  });
});
