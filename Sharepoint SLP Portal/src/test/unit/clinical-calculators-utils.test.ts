import { describe, it, expect } from "vitest";
import {
  calculateTotalScore,
  calculateWabScore,
  calculateAidsScore,
  getMocaInterpretation,
  getMasaInterpretation,
  getEat10Interpretation,
  getGussInterpretation,
  getFlciInterpretation,
  getRipaG2Interpretation,
  getWabrInterpretation,
  getAidsInterpretation,
  getFda2Interpretation,
  MOCA_RANGES,
  MASA_RANGES,
  EAT10_RANGES,
  GUSS_RANGES,
} from "../../utils/clinical-calculators";

describe("clinical-calculators utils", () => {
  describe("calculateTotalScore", () => {
    it("sums all values", () =>
      expect(calculateTotalScore({ a: 5, b: 3, c: 2 }).value).toBe(10));
    it("returns 0 for empty", () =>
      expect(calculateTotalScore({}).value).toBe(0));
  });

  describe("calculateWabScore", () => {
    it("doubles the total", () =>
      expect(calculateWabScore({ a: 10, b: 5 }).value).toBe(30));
  });

  describe("calculateAidsScore", () => {
    it("calculates percentage", () =>
      expect(
        calculateAidsScore({ "Words Understood": 80, "Total Words": 100 })
          .value,
      ).toBe(80));
    it("defaults total to 1 when missing", () =>
      expect(calculateAidsScore({ "Words Understood": 5 }).value).toBe(500));
  });

  describe("getMocaInterpretation", () => {
    it("Normal for 28", () =>
      expect(getMocaInterpretation(28)?.label).toBe("Normal"));
    it("MCI for 22", () =>
      expect(getMocaInterpretation(22)?.label).toContain("MCI"));
    it("Moderate for 14", () =>
      expect(getMocaInterpretation(14)?.label).toContain("Moderate"));
    it("Severe for 5", () =>
      expect(getMocaInterpretation(5)?.label).toContain("Severe"));
    it("null for 31", () => expect(getMocaInterpretation(31)).toBeNull());
  });

  describe("getMasaInterpretation", () => {
    it("No Abnormality for 190", () =>
      expect(getMasaInterpretation(190)?.label).toBe("No Abnormality"));
    it("Mild for 170", () =>
      expect(getMasaInterpretation(170)?.label).toContain("Mild"));
    it("Moderate for 150", () =>
      expect(getMasaInterpretation(150)?.label).toContain("Moderate"));
    it("Severe for 100", () =>
      expect(getMasaInterpretation(100)?.label).toContain("Severe"));
  });

  describe("getEat10Interpretation", () => {
    it("Normal for 1", () =>
      expect(getEat10Interpretation(1)?.label).toBe("Normal"));
    it("Abnormal for 5", () =>
      expect(getEat10Interpretation(5)?.label).toContain("Abnormal"));
  });

  describe("getGussInterpretation", () => {
    it("Normal for 20", () =>
      expect(getGussInterpretation(20)?.label).toContain("Normal"));
    it("Slight for 17", () =>
      expect(getGussInterpretation(17)?.label).toContain("Slight"));
    it("Moderate for 12", () =>
      expect(getGussInterpretation(12)?.label).toContain("Moderate"));
    it("Severe for 5", () =>
      expect(getGussInterpretation(5)?.label).toContain("Severe"));
  });

  describe("getFlciInterpretation", () => {
    it("Mild for 70", () =>
      expect(getFlciInterpretation(70)?.label).toContain("Mild"));
    it("Moderate for 50", () =>
      expect(getFlciInterpretation(50)?.label).toContain("Moderate"));
    it("Severe for 20", () =>
      expect(getFlciInterpretation(20)?.label).toContain("Severe"));
    it("null for 90", () => expect(getFlciInterpretation(90)).toBeNull());
  });

  describe("getRipaG2Interpretation", () => {
    it("Mild for 85", () =>
      expect(getRipaG2Interpretation(85)?.label).toContain("Mild"));
    it("Moderate for 60", () =>
      expect(getRipaG2Interpretation(60)?.label).toContain("Moderate"));
    it("Severe for 30", () =>
      expect(getRipaG2Interpretation(30)?.label).toContain("Severe"));
  });

  describe("getWabrInterpretation", () => {
    it("WNL for 95", () =>
      expect(getWabrInterpretation(95)?.label).toContain("Normal"));
    it("Mild for 80", () =>
      expect(getWabrInterpretation(80)?.label).toContain("Mild"));
    it("Moderate for 60", () =>
      expect(getWabrInterpretation(60)?.label).toContain("Moderate"));
    it("Severe for 40", () =>
      expect(getWabrInterpretation(40)?.label).toContain("Severe"));
    it("Very Severe for 10", () =>
      expect(getWabrInterpretation(10)?.label).toContain("Very Severe"));
  });

  describe("getAidsInterpretation", () => {
    it("Normal for 95", () =>
      expect(getAidsInterpretation(95)?.label).toContain("Normal"));
    it("Mild for 75", () =>
      expect(getAidsInterpretation(75)?.label).toContain("Mild"));
    it("Moderate for 55", () =>
      expect(getAidsInterpretation(55)?.label).toContain("Moderate"));
    it("Severe for 20", () =>
      expect(getAidsInterpretation(20)?.label).toContain("Severe"));
  });

  describe("getFda2Interpretation", () => {
    it("Normal for 58", () =>
      expect(getFda2Interpretation(58)?.label).toBe("Normal"));
    it("Mild for 45", () =>
      expect(getFda2Interpretation(45)?.label).toContain("Mild"));
    it("Moderate for 30", () =>
      expect(getFda2Interpretation(30)?.label).toContain("Moderate"));
    it("Severe for 10", () =>
      expect(getFda2Interpretation(10)?.label).toContain("Severe"));
    it("null for 70", () => expect(getFda2Interpretation(70)).toBeNull());
  });

  describe("range constants", () => {
    it("MOCA_RANGES has 4 entries", () => expect(MOCA_RANGES).toHaveLength(4));
    it("MASA_RANGES has 4 entries", () => expect(MASA_RANGES).toHaveLength(4));
    it("EAT10_RANGES has 2 entries", () =>
      expect(EAT10_RANGES).toHaveLength(2));
    it("GUSS_RANGES has 4 entries", () => expect(GUSS_RANGES).toHaveLength(4));
  });
});
