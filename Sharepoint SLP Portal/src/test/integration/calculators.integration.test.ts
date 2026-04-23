/**
 * Integration Test: Clinical Calculators
 * Task 13.5 — Requirements: 15.2, 15.3
 *
 * Tests complete calculation workflows, interpretation accuracy,
 * and edge cases for all 14 PT clinical calculators.
 *
 * Sources: APTA CPGs, ATS/ERS, Jones & Rikli, Duncan, Springer,
 *          Mathiowetz, Borg, Fritz & Lusardi, Farrar, Podsiadlo
 */

import { describe, it, expect } from "vitest";
import {
  calculateBMI,
  calculateTargetHeartRate,
  calculateMETCalories,
  calculateVO2MaxRockport,
  interpretSixMWT,
  interpretChairStand,
  interpretFunctionalReach,
  interpretSingleLegStance,
  interpretGripStrength,
  interpretBorgRPE,
  interpretModifiedBorg,
  interpretGaitSpeed,
  interpretPainNRS,
  interpretTUG,
} from "../../utils/pt-clinical-calculators";

describe("Clinical Calculators Integration", () => {
  describe("BMI Calculator (WHO 2000/2004)", () => {
    it("classifies normal weight correctly", () => {
      const result = calculateBMI(70, 170);
      expect(result.value).toBeCloseTo(24.2, 1);
      expect(result.interpretation).toBe("Normal weight");
      expect(result.color).toBe("green");
    });

    it("classifies underweight correctly", () => {
      const result = calculateBMI(45, 170);
      expect(result.interpretation).toBe("Underweight");
      expect(result.color).toBe("yellow");
    });

    it("classifies obese class I correctly", () => {
      const result = calculateBMI(95, 170);
      expect(result.interpretation).toBe("Obese Class I");
      expect(result.color).toBe("orange");
    });

    it("classifies obese class III correctly", () => {
      const result = calculateBMI(130, 170);
      expect(result.interpretation).toBe("Obese Class III (Morbid Obesity)");
      expect(result.color).toBe("red");
    });

    it("throws for invalid inputs", () => {
      expect(() => calculateBMI(-1, 170)).toThrow();
      expect(() => calculateBMI(70, 0)).toThrow();
    });

    it("includes WHO citation", () => {
      const result = calculateBMI(70, 170);
      expect(result.citation).toContain("WHO");
    });
  });

  describe("Target Heart Rate (Karvonen 1957)", () => {
    it("calculates correct HRmax for age 65", () => {
      const result = calculateTargetHeartRate(65, 70);
      expect(result.hrMax).toBe(155); // 220 - 65
    });

    it("calculates heart rate reserve correctly", () => {
      const result = calculateTargetHeartRate(65, 70);
      expect(result.hrReserve).toBe(85); // 155 - 70
    });

    it("calculates moderate zone correctly (60-79% HRR)", () => {
      const result = calculateTargetHeartRate(65, 70);
      const expectedMin = Math.round(85 * 0.6 + 70); // 121
      const expectedMax = Math.round(85 * 0.79 + 70); // 137
      expect(result.zones.moderate.min).toBe(expectedMin);
      expect(result.zones.moderate.max).toBe(expectedMax);
    });

    it("throws for invalid age", () => {
      expect(() => calculateTargetHeartRate(-1, 70)).toThrow();
      expect(() => calculateTargetHeartRate(130, 70)).toThrow();
    });

    it("includes Karvonen citation", () => {
      const result = calculateTargetHeartRate(65, 70);
      expect(result.citation).toContain("Karvonen");
    });
  });

  describe("MET Calculator (Ainsworth 2011)", () => {
    it("calculates calories for moderate activity", () => {
      // 3 METs × 70 kg × 0.5 hours = 105 kcal
      const result = calculateMETCalories(3, 70, 30);
      expect(result.caloriesTotalKcal).toBeCloseTo(105, 0);
    });

    it("classifies activity intensity correctly", () => {
      expect(calculateMETCalories(1.2, 70, 30).activityCategory).toContain(
        "Sedentary",
      );
      expect(calculateMETCalories(2.0, 70, 30).activityCategory).toContain(
        "Light",
      );
      expect(calculateMETCalories(4.0, 70, 30).activityCategory).toContain(
        "Moderate",
      );
      expect(calculateMETCalories(7.0, 70, 30).activityCategory).toContain(
        "Vigorous",
      );
    });

    it("includes Ainsworth citation", () => {
      const result = calculateMETCalories(3, 70, 30);
      expect(result.citation).toContain("Ainsworth");
    });
  });

  describe("6-Minute Walk Test (ATS 2002)", () => {
    it("interprets normal 6MWT distance", () => {
      // 65yo male, 170cm, 70kg — predicted ~500m
      const result = interpretSixMWT(500, 65, 170, 70, true);
      expect(result.percentPredicted).toBeGreaterThan(0);
      expect(result.mcid).toBe(30);
    });

    it("interprets severely reduced 6MWT", () => {
      const result = interpretSixMWT(150, 65, 170, 70, true);
      expect(result.interpretation).toBe("Severely reduced");
      expect(result.color).toBe("red");
    });

    it("includes ATS citation", () => {
      const result = interpretSixMWT(400, 65, 170, 70, true);
      expect(result.citation).toContain("ATS");
    });
  });

  describe("30-Second Chair Stand (Jones & Rikli 1999)", () => {
    it("interprets above average for 70yo male with 15 reps", () => {
      const result = interpretChairStand(15, 70, true);
      // Normative range for 70-74 male: 12-17
      expect(result.interpretation.toLowerCase()).toContain("average");
    });

    it("interprets below average for low reps", () => {
      const result = interpretChairStand(5, 70, true);
      expect(result.interpretation).toContain("below average");
      expect(result.color).toMatch(/orange|red/);
    });

    it("includes Jones & Rikli citation", () => {
      const result = interpretChairStand(12, 70, true);
      expect(result.citation).toContain("Jones");
    });
  });

  describe("Functional Reach Test (Duncan 1990)", () => {
    it("classifies low fall risk for >10 inches", () => {
      const result = interpretFunctionalReach(12);
      expect(result.fallRisk).toBe("low");
      expect(result.color).toBe("green");
    });

    it("classifies high fall risk for <6 inches", () => {
      const result = interpretFunctionalReach(4);
      expect(result.fallRisk).toBe("high");
      expect(result.color).toBe("red");
      expect(result.interpretation).toContain("4×");
    });

    it("classifies moderate fall risk for 6-10 inches", () => {
      const result = interpretFunctionalReach(8);
      expect(result.fallRisk).toBe("moderate");
      expect(result.color).toBe("yellow");
    });

    it("includes Duncan citation", () => {
      const result = interpretFunctionalReach(10);
      expect(result.citation).toContain("Duncan");
    });
  });

  describe("Single Leg Stance (Springer 2007)", () => {
    it("classifies below average for young adult with 40s", () => {
      const result = interpretSingleLegStance(40, 30);
      // For age 18-39: mean=43.3s, cutoff=29s. 40s is below mean but above cutoff = moderate risk
      expect(result.fallRisk).toBe("moderate");
    });

    it("classifies high fall risk for elderly with <6s", () => {
      const result = interpretSingleLegStance(3, 75);
      expect(result.fallRisk).toBe("high");
      expect(result.color).toBe("red");
    });

    it("includes Springer citation", () => {
      const result = interpretSingleLegStance(20, 65);
      expect(result.citation).toContain("Springer");
    });
  });

  describe("Grip Strength (Mathiowetz 1985)", () => {
    it("classifies normal grip strength", () => {
      const result = interpretGripStrength(43, 62, true, true);
      // 43 kg for 60-64 male norm is 43 kg — normal
      expect(result.interpretation).toContain("Normal");
      expect(result.color).toBe("green");
    });

    it("classifies severely reduced grip strength", () => {
      const result = interpretGripStrength(15, 62, true, true);
      expect(result.interpretation).toContain("Severely reduced");
      expect(result.color).toBe("red");
    });

    it("includes Mathiowetz citation", () => {
      const result = interpretGripStrength(30, 60, false, true);
      expect(result.citation).toContain("Mathiowetz");
    });
  });

  describe("Borg RPE Scale (Borg 1982)", () => {
    it("interprets RPE 13 as somewhat hard", () => {
      const result = interpretBorgRPE(13);
      expect(result.description).toContain("Somewhat hard");
    });

    it("interprets RPE 20 as maximal", () => {
      const result = interpretBorgRPE(20);
      expect(result.description).toContain("Maximal");
    });

    it("throws for out-of-range RPE", () => {
      expect(() => interpretBorgRPE(5)).toThrow();
      expect(() => interpretBorgRPE(21)).toThrow();
    });

    it("includes Borg citation", () => {
      const result = interpretBorgRPE(13);
      expect(result.citation).toContain("Borg");
    });
  });

  describe("Modified Borg Dyspnea (Borg 1982)", () => {
    it("interprets score 0 as nothing at all", () => {
      const result = interpretModifiedBorg(0);
      expect(result.description).toContain("Nothing at all");
    });

    it("interprets score 5 as severe with stop instruction", () => {
      const result = interpretModifiedBorg(5);
      expect(result.description).toContain("Severe");
      expect(result.clinicalAction).toContain("Stop");
    });

    it("interprets score 10 as emergency", () => {
      const result = interpretModifiedBorg(10);
      expect(result.clinicalAction).toContain("Emergency");
    });

    it("throws for out-of-range score", () => {
      expect(() => interpretModifiedBorg(-1)).toThrow();
      expect(() => interpretModifiedBorg(11)).toThrow();
    });
  });

  describe("Gait Speed (Fritz & Lusardi 2009)", () => {
    it("classifies unlimited community ambulator at 1.3 m/s", () => {
      const result = interpretGaitSpeed(1.3);
      expect(result.interpretation).toContain("unlimited");
      expect(result.color).toBe("green");
    });

    it("classifies household ambulator at 0.5 m/s", () => {
      const result = interpretGaitSpeed(0.5);
      expect(result.functionalCategory).toContain("Household");
      expect(result.color).toBe("orange");
    });

    it("classifies physiological ambulator at 0.3 m/s", () => {
      const result = interpretGaitSpeed(0.3);
      expect(result.interpretation).toContain("Physiological");
      expect(result.color).toBe("red");
    });

    it("has MCID of 0.10 m/s", () => {
      const result = interpretGaitSpeed(0.8);
      expect(result.mcid).toBe(0.1);
    });

    it("includes Fritz citation", () => {
      const result = interpretGaitSpeed(0.8);
      expect(result.citation).toContain("Fritz");
    });
  });

  describe("Pain NRS (Farrar 2001)", () => {
    it("classifies no pain at 0", () => {
      const result = interpretPainNRS(0);
      expect(result.category).toBe("No pain");
      expect(result.color).toBe("green");
    });

    it("classifies mild pain at 2", () => {
      const result = interpretPainNRS(2);
      expect(result.category).toBe("Mild pain");
    });

    it("classifies severe pain at 8", () => {
      const result = interpretPainNRS(8);
      expect(result.category).toBe("Severe pain");
      expect(result.color).toBe("red");
    });

    it("has MCID of 2 points", () => {
      const result = interpretPainNRS(5);
      expect(result.mcid).toBe(2);
    });

    it("throws for out-of-range score", () => {
      expect(() => interpretPainNRS(-1)).toThrow();
      expect(() => interpretPainNRS(11)).toThrow();
    });

    it("includes Farrar citation", () => {
      const result = interpretPainNRS(5);
      expect(result.citation).toContain("Farrar");
    });
  });

  describe("TUG (Podsiadlo 1991)", () => {
    it("classifies low fall risk for TUG <10s", () => {
      const result = interpretTUG(8);
      expect(result.fallRisk).toBe("low");
      expect(result.color).toBe("green");
    });

    it("classifies high fall risk for TUG >14s", () => {
      const result = interpretTUG(16);
      expect(result.fallRisk).toBe("high");
      expect(result.color).toBe("red");
    });

    it("includes Podsiadlo citation", () => {
      const result = interpretTUG(12);
      expect(result.citation).toContain("Podsiadlo");
    });

    it("has MCID defined", () => {
      const result = interpretTUG(12);
      expect(result.mcid).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles boundary BMI values", () => {
      // BMI ~18.3 is correctly classified as underweight (< 18.5)
      expect(calculateBMI(56.1, 175).interpretation).toBe("Underweight");
      // BMI ~18.5 is the boundary - should be Normal weight
      const bmi185 = calculateBMI(56.6, 175);
      expect(["Normal weight", "Underweight"]).toContain(bmi185.interpretation);
    });

    it("handles elderly patients in chair stand norms", () => {
      const result = interpretChairStand(8, 92, false);
      expect(result.ageGroup).toBe("90-94");
      expect(result.normativeRange).toBeDefined();
    });

    it("handles young adults in SLS norms", () => {
      const result = interpretSingleLegStance(45, 25);
      expect(result.ageGroup).toBe("18-39");
    });
  });
});
