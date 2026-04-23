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

describe("calculateBMI", () => {
  it("classifies underweight", () => {
    const r = calculateBMI(45, 170);
    expect(r.interpretation).toBe("Underweight");
    expect(r.color).toBe("yellow");
  });
  it("classifies normal weight", () => {
    const r = calculateBMI(70, 175);
    expect(r.interpretation).toBe("Normal weight");
    expect(r.color).toBe("green");
  });
  it("classifies overweight", () => {
    const r = calculateBMI(85, 170);
    expect(r.interpretation).toBe("Overweight");
  });
  it("classifies obese class I", () => {
    const r = calculateBMI(95, 170);
    expect(r.interpretation).toBe("Obese Class I");
    expect(r.color).toBe("orange");
  });
  it("classifies obese class II", () => {
    const r = calculateBMI(110, 170);
    expect(r.interpretation).toBe("Obese Class II");
    expect(r.color).toBe("red");
  });
  it("classifies obese class III", () => {
    const r = calculateBMI(130, 170);
    expect(r.interpretation).toContain("Obese Class III");
  });
  it("throws on invalid input", () => {
    expect(() => calculateBMI(0, 170)).toThrow();
    expect(() => calculateBMI(70, 0)).toThrow();
  });
});

describe("calculateTargetHeartRate", () => {
  it("returns correct zones for 40yo with RHR 70", () => {
    const r = calculateTargetHeartRate(40, 70);
    expect(r.hrMax).toBe(180);
    expect(r.hrReserve).toBe(110);
    expect(r.zones.light.min).toBeLessThan(r.zones.moderate.min);
    expect(r.zones.moderate.min).toBeLessThan(r.zones.vigorous.min);
  });
  it("throws on invalid age", () => {
    expect(() => calculateTargetHeartRate(0, 70)).toThrow();
    expect(() => calculateTargetHeartRate(130, 70)).toThrow();
  });
  it("throws on invalid resting HR", () => {
    expect(() => calculateTargetHeartRate(40, 20)).toThrow();
    expect(() => calculateTargetHeartRate(40, 210)).toThrow();
  });
});

describe("calculateMETCalories", () => {
  it("calculates calories correctly", () => {
    const r = calculateMETCalories(5, 70, 30);
    expect(r.caloriesTotalKcal).toBeCloseTo(175, 0);
    expect(r.activityCategory).toContain("Moderate");
  });
  it("classifies sedentary activity", () => {
    const r = calculateMETCalories(1.2, 70, 60);
    expect(r.activityCategory).toContain("Sedentary");
  });
  it("classifies light activity", () => {
    const r = calculateMETCalories(2.0, 70, 30);
    expect(r.activityCategory).toContain("Light");
  });
  it("classifies vigorous activity", () => {
    const r = calculateMETCalories(7.0, 70, 30);
    expect(r.activityCategory).toContain("Vigorous");
  });
  it("classifies very vigorous activity", () => {
    const r = calculateMETCalories(10, 70, 30);
    expect(r.activityCategory).toContain("Very Vigorous");
  });
  it("throws on invalid inputs", () => {
    expect(() => calculateMETCalories(0, 70, 30)).toThrow();
    expect(() => calculateMETCalories(5, 0, 30)).toThrow();
    expect(() => calculateMETCalories(5, 70, 0)).toThrow();
  });
});

describe("calculateVO2MaxRockport", () => {
  it("returns a VO2max value for male", () => {
    const r = calculateVO2MaxRockport(45, 80, 15, 140, true);
    expect(typeof r.vo2MaxMlKgMin).toBe("number");
    expect(r.fitnessCategory).toBeTruthy();
  });
  it("returns a VO2max value for female", () => {
    const r = calculateVO2MaxRockport(50, 65, 18, 155, false);
    expect(typeof r.vo2MaxMlKgMin).toBe("number");
  });
  it("classifies excellent fitness", () => {
    const r = calculateVO2MaxRockport(30, 60, 12, 110, true);
    expect(["Excellent", "Good", "Fair", "Poor", "Very Poor"]).toContain(
      r.fitnessCategory,
    );
  });
});

describe("interpretSixMWT", () => {
  it("returns normal for high distance", () => {
    const r = interpretSixMWT(600, 50, 170, 70, true);
    expect(r.interpretation).toBe("Normal");
    expect(r.color).toBe("green");
  });
  it("returns mildly reduced", () => {
    const r = interpretSixMWT(400, 65, 165, 75, false);
    expect([
      "Mildly reduced",
      "Moderately reduced",
      "Severely reduced",
    ]).toContain(r.interpretation);
  });
  it("includes MCID of 30", () => {
    const r = interpretSixMWT(500, 60, 170, 70, true);
    expect(r.mcid).toBe(30);
  });
});

describe("interpretChairStand", () => {
  it("above average for high reps", () => {
    const r = interpretChairStand(20, 65, true);
    expect(r.interpretation).toContain("Above average");
    expect(r.color).toBe("green");
  });
  it("average for normal reps", () => {
    const r = interpretChairStand(15, 65, true);
    expect(r.interpretation).toContain("Average");
  });
  it("below average for low reps", () => {
    const r = interpretChairStand(9, 65, true);
    expect([
      "Below average – high fall risk",
      "Well below average – very high fall risk",
    ]).toContain(r.interpretation);
  });
  it("works for female", () => {
    const r = interpretChairStand(12, 70, false);
    expect(r.ageGroup).toBe("70-74");
  });
});

describe("interpretFunctionalReach", () => {
  it("low fall risk for >10 inches", () => {
    const r = interpretFunctionalReach(12);
    expect(r.fallRisk).toBe("low");
    expect(r.color).toBe("green");
  });
  it("moderate fall risk for 6-10 inches", () => {
    const r = interpretFunctionalReach(8);
    expect(r.fallRisk).toBe("moderate");
    expect(r.color).toBe("yellow");
  });
  it("high fall risk for <6 inches", () => {
    const r = interpretFunctionalReach(4);
    expect(r.fallRisk).toBe("high");
    expect(r.color).toBe("red");
  });
  it("converts to cm correctly", () => {
    const r = interpretFunctionalReach(10);
    expect(r.reachCm).toBeCloseTo(25.4, 0);
  });
});

describe("interpretSingleLegStance", () => {
  it("normal for time >= mean", () => {
    const r = interpretSingleLegStance(45, 30);
    expect(r.fallRisk).toBe("low");
    expect(r.color).toBe("green");
  });
  it("moderate risk for below mean but above cutoff", () => {
    const r = interpretSingleLegStance(20, 65);
    expect(["low", "moderate", "high"]).toContain(r.fallRisk);
  });
  it("high risk for very low time", () => {
    const r = interpretSingleLegStance(1, 75);
    expect(r.fallRisk).toBe("high");
    expect(r.color).toBe("red");
  });
  it("returns correct age group for 80+", () => {
    const r = interpretSingleLegStance(3, 85);
    expect(r.ageGroup).toBe("80+");
  });
});

describe("interpretGripStrength", () => {
  it("normal grip for high value", () => {
    const r = interpretGripStrength(55, 35, true, true);
    expect(r.interpretation).toBe("Normal grip strength");
    expect(r.color).toBe("green");
  });
  it("mildly reduced grip", () => {
    // For male 35-39, norm is 55kg. 75-89% = ~41-49kg
    const r = interpretGripStrength(45, 37, true, true);
    expect(r.interpretation).toBe("Mildly reduced grip strength");
    expect(r.color).toBe("yellow");
  });
  it("severely reduced grip", () => {
    const r = interpretGripStrength(10, 35, true, true);
    expect(r.interpretation).toBe("Severely reduced grip strength");
    expect(r.color).toBe("red");
  });
  it("adjusts for non-dominant hand", () => {
    const dominant = interpretGripStrength(30, 35, true, true);
    const nonDominant = interpretGripStrength(30, 35, true, false);
    expect(nonDominant.normativeMean).toBeLessThan(dominant.normativeMean);
  });
  it("works for female", () => {
    const r = interpretGripStrength(25, 40, false, true);
    expect(r.percentOfNorm).toBeGreaterThan(0);
  });
});

describe("interpretBorgRPE", () => {
  it("returns correct description for RPE 13", () => {
    const r = interpretBorgRPE(13);
    expect(r.description).toContain("Somewhat hard");
  });
  it("returns correct description for RPE 6", () => {
    const r = interpretBorgRPE(6);
    expect(r.description).toContain("No exertion");
  });
  it("returns correct description for RPE 20", () => {
    const r = interpretBorgRPE(20);
    expect(r.description).toContain("Maximal");
  });
  it("throws for out-of-range values", () => {
    expect(() => interpretBorgRPE(5)).toThrow();
    expect(() => interpretBorgRPE(21)).toThrow();
  });
});

describe("interpretModifiedBorg", () => {
  it("returns nothing at all for 0", () => {
    const r = interpretModifiedBorg(0);
    expect(r.description).toContain("Nothing");
  });
  it("returns severe for 5", () => {
    const r = interpretModifiedBorg(5);
    expect(r.description).toContain("Severe");
    expect(r.clinicalAction).toContain("Stop");
  });
  it("returns emergency for 10", () => {
    const r = interpretModifiedBorg(10);
    expect(r.clinicalAction).toContain("Emergency");
  });
  it("throws for out-of-range", () => {
    expect(() => interpretModifiedBorg(-1)).toThrow();
    expect(() => interpretModifiedBorg(11)).toThrow();
  });
});

describe("interpretGaitSpeed", () => {
  it("unlimited community ambulator for fast speed", () => {
    const r = interpretGaitSpeed(1.3);
    expect(r.functionalCategory).toContain("Unlimited");
    expect(r.color).toBe("green");
  });
  it("limited community ambulator", () => {
    const r = interpretGaitSpeed(0.65);
    expect(r.functionalCategory).toContain("Limited");
    expect(r.color).toBe("yellow");
  });
  it("household ambulator", () => {
    const r = interpretGaitSpeed(0.45);
    expect(r.functionalCategory).toContain("Household");
    expect(r.color).toBe("orange");
  });
  it("physiological ambulator for very slow speed", () => {
    const r = interpretGaitSpeed(0.2);
    expect(r.functionalCategory).toContain("Physiological");
    expect(r.color).toBe("red");
  });
  it("includes MCID", () => {
    const r = interpretGaitSpeed(1.0);
    expect(r.mcid).toBe(0.1);
  });
});

describe("interpretPainNRS", () => {
  it("no pain for 0", () => {
    const r = interpretPainNRS(0);
    expect(r.category).toBe("No pain");
    expect(r.color).toBe("green");
  });
  it("mild pain for 2", () => {
    const r = interpretPainNRS(2);
    expect(r.category).toBe("Mild pain");
    expect(r.color).toBe("yellow");
  });
  it("moderate pain for 5", () => {
    const r = interpretPainNRS(5);
    expect(r.category).toBe("Moderate pain");
    expect(r.color).toBe("orange");
  });
  it("severe pain for 8", () => {
    const r = interpretPainNRS(8);
    expect(r.category).toBe("Severe pain");
    expect(r.color).toBe("red");
  });
  it("throws for out-of-range", () => {
    expect(() => interpretPainNRS(-1)).toThrow();
    expect(() => interpretPainNRS(11)).toThrow();
  });
  it("MCID is 2", () => {
    const r = interpretPainNRS(5);
    expect(r.mcid).toBe(2);
  });
});

describe("interpretTUG", () => {
  it("low fall risk for <=10s", () => {
    const r = interpretTUG(8);
    expect(r.fallRisk).toBe("low");
    expect(r.color).toBe("green");
  });
  it("moderate fall risk for 11-14s", () => {
    const r = interpretTUG(12);
    expect(r.fallRisk).toBe("moderate");
    expect(r.color).toBe("yellow");
  });
  it("high fall risk for >14s", () => {
    const r = interpretTUG(20);
    expect(r.fallRisk).toBe("high");
    expect(r.color).toBe("red");
  });
  it("MCID is 3.5", () => {
    const r = interpretTUG(10);
    expect(r.mcid).toBe(3.5);
  });
});
